import { CHARACTERS, CHESTS } from './data.js';

const STORAGE_KEY = 'relic-duel-save-v1';
const RECOVERY_KEY = `${STORAGE_KEY}-recovery`;
const MAX_COINS = 1_000_000_000_000;
const MAX_STAT = 1_000_000_000;
const DUPLICATE_REFUNDS = [5, 8, 12, 20, 35, 60, 100];
const KNOWN_IDS = new Set(CHARACTERS.map(character => character.id));
const charactersById = new Map(CHARACTERS.map(character => [character.id, character]));
const KNOWN_CHESTS = new Set(CHESTS.map(chest => chest.id));
const COMPUTER_CHEST_PLANS = [
  ['common', 45], ['rare', 35], ['large', 15], ['diamond', 5],
];
const charactersByTier = Array.from({ length: 7 }, (_, tier) =>
  CHARACTERS.filter(character => character.tier === tier)
);

function newPlayer() {
  return { coins: 0, owned: [0], wins: 0, losses: 0, draws: 0, chests: 0, duplicates: 0 };
}

function newComputer() {
  return { ...newPlayer(), targetChest: 'common' };
}

function newSave() {
  return { version: 1, players: [newPlayer(), newPlayer()], computer: newComputer(), matches: 0, lastDaily: null };
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isInteger(value, maximum) {
  return Number.isSafeInteger(value) && value >= 0 && value <= maximum;
}

function validatePlayer(player, label = '玩家') {
  if (!isRecord(player) || !isInteger(player.coins, MAX_COINS) ||
      !Array.isArray(player.owned) || player.owned.length < 1 ||
      player.owned.length > CHARACTERS.length || !player.owned.includes(0) ||
      !player.owned.every(id => Number.isSafeInteger(id) && KNOWN_IDS.has(id)) ||
      new Set(player.owned).size !== player.owned.length ||
      !['wins', 'losses', 'draws', 'chests', 'duplicates'].every(key =>
        isInteger(player[key], MAX_STAT))) {
    throw new Error(`存档中的${label}进度无效`);
  }
  return {
    coins: player.coins,
    owned: [...player.owned].sort((a, b) => a - b),
    wins: player.wins,
    losses: player.losses,
    draws: player.draws,
    chests: player.chests,
    duplicates: player.duplicates,
  };
}

function validateComputer(value) {
  const computer = { ...validatePlayer(value, '电脑'), targetChest: 'common' };
  if (Object.prototype.hasOwnProperty.call(value, 'targetChest')) {
    if (!KNOWN_CHESTS.has(value.targetChest)) throw new Error('存档中的电脑宝箱计划无效');
    computer.targetChest = value.targetChest;
  }
  return computer;
}

// Construct every saved field explicitly: imported JSON cannot add methods or
// arbitrary properties to the store, even when it contains a __proto__ key.
function validateSave(value) {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.players) ||
      value.players.length !== 2 || !isInteger(value.matches, MAX_STAT)) {
    throw new Error('存档格式不正确，或存档版本不受支持');
  }
  const players = value.players.map(player => validatePlayer(player));
  let computer = newComputer();
  // Human-only version-1 saves predate computer play and stay fully compatible.
  if (Object.prototype.hasOwnProperty.call(value, 'computer')) {
    computer = validateComputer(value.computer);
  }
  return { version: 1, players, computer, matches: value.matches, lastDaily: null };
}

// Recovery applies only to a browser's existing version-1 save. Explicit file
// imports remain strict and cannot silently replace a malformed profile.
function recoverLocalSave(raw) {
  let parsed;
  try { parsed = JSON.parse(raw); } catch {}
  const data = newSave(), broken = [];
  if (isRecord(parsed) && parsed.version === 1) {
    for (let index = 0; index < 2; index++) {
      try { data.players[index] = validatePlayer(parsed.players?.[index]); }
      catch { broken.push(index === 0 ? '玩家一' : '玩家二'); }
    }
    if (Object.prototype.hasOwnProperty.call(parsed, 'computer')) {
      try { data.computer = validateComputer(parsed.computer); }
      catch {
        // A broken savings plan alone need not remove CPU coins or heroes.
        try {
          data.computer = { ...validatePlayer(parsed.computer, '电脑'), targetChest: 'common' };
          broken.push('电脑宝箱计划');
        } catch { broken.push('电脑'); }
      }
    }
    if (isInteger(parsed.matches, MAX_STAT)) data.matches = parsed.matches;
    else broken.push('对战总数');
  } else broken.push('本地');
  return {
    data,
    warning: `${broken.join('、') || '本地'}存档格式异常，已恢复有效进度；原始存档将在下次保存前备份。`,
  };
}

function randomUnit() {
  try {
    if (globalThis.crypto?.getRandomValues) {
      const bytes = new Uint32Array(1);
      globalThis.crypto.getRandomValues(bytes);
      return bytes[0] / 4_294_967_296;
    }
  } catch {
    // Some restricted browser contexts disable crypto; local play still works.
  }
  return Math.random();
}

function cloneSave(value) {
  return {
    ...value,
    players: value.players.map(player => ({ ...player, owned: [...player.owned] })),
    computer: { ...value.computer, owned: [...value.computer.owned] },
  };
}

export class ProgressStore {
  constructor() {
    this._data = newSave();
    this._listeners = new Set();
    this._storage = null;
    this._lastRaw = null;
    this._storageKnown = false;
    this._dirty = false;
    this._recoveryRaw = null;
    this.storageAvailable = false;
    this.lastError = null;
    this.recoveryWarning = null;
    this.externalConflict = false;
    try {
      this._storage = globalThis.localStorage;
      if (!this._storage) throw new Error('Local storage unavailable');
      const raw = this._storage.getItem(STORAGE_KEY);
      this._lastRaw = raw;
      this._storageKnown = true;
      this.storageAvailable = true;
      if (raw !== null) {
        try {
          this._data = validateSave(JSON.parse(raw));
        } catch {
          const recovered = recoverLocalSave(raw);
          this._data = recovered.data;
          this._recoveryRaw = raw;
          this.recoveryWarning = recovered.warning;
          this.lastError = recovered.warning;
        }
      }
    } catch {
      this.lastError = '浏览器无法保存进度，本次进度仅在当前页面保留，请导出备份。';
    }
    this._storageListener = event => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      if (event.storageArea && this._storage && event.storageArea !== this._storage) return;
      this.refreshFromStorage();
    };
    globalThis.window?.addEventListener?.('storage', this._storageListener);
  }

  get data() {
    return this._data;
  }

  subscribe(listener) {
    if (typeof listener !== 'function') throw new TypeError('listener must be a function');
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify(source, extra = {}) {
    for (const listener of [...this._listeners]) {
      // Subscribers receive a snapshot, so sorting or editing a rendered list
      // cannot accidentally change a wallet or collection in the store.
      try { listener(cloneSave(this._data), { source, ...extra }); }
      catch (error) { console.error('Progress listener failed:', error); }
    }
  }

  refreshFromStorage({ notify = true } = {}) {
    const previousError = this.lastError;
    try {
      if (!this._storage) this._storage = globalThis.localStorage;
      if (!this._storage) throw new Error('Local storage unavailable');
      const raw = this._storage.getItem(STORAGE_KEY);
      if (this._storageKnown && raw === this._lastRaw) return false;
      if (this._dirty) {
        this.storageAvailable = false;
        this.externalConflict = true;
        this.lastError = '另一个标签页已更新存档；当前页面还有未保存进度，请先导出备份，再导入要保留的存档。';
        if (notify && previousError !== this.lastError) this._notify('external', { conflict: true });
        return false;
      }
      let next;
      try { next = raw === null ? newSave() : validateSave(JSON.parse(raw)); }
      catch {
        // An external malformed write must not destroy this tab's valid data.
        this._lastRaw = raw;
        this._storageKnown = true;
        this._recoveryRaw = raw;
        this.recoveryWarning = '其他标签页的存档格式异常，已保留本页有效进度；原始存档将在下次保存前备份。';
        this.lastError = this.recoveryWarning;
        if (notify) this._notify('external', { recovery: true });
        return false;
      }
      const changed = JSON.stringify(next) !== JSON.stringify(this._data);
      this._data = next;
      this._lastRaw = raw;
      this._storageKnown = true;
      this._recoveryRaw = null;
      this.storageAvailable = true;
      this.externalConflict = false;
      this.lastError = null;
      this.recoveryWarning = null;
      if (notify && (changed || previousError)) this._notify('external');
      return changed;
    } catch {
      this.storageAvailable = false;
      this.lastError = '浏览器无法读取本地存档，已保留当前页面进度，请导出备份。';
      if (notify && previousError !== this.lastError) this._notify('external', { readError: true });
      return false;
    }
  }

  save({ replace = false } = {}) {
    let saved = false;
    this._dirty = true;
    try {
      // Retry access in case browser storage permission changed during play.
      if (!this._storage) this._storage = globalThis.localStorage;
      if (!this._storage) throw new Error('Local storage unavailable');
      const currentRaw = this._storage.getItem(STORAGE_KEY);
      if (!replace && (!this._storageKnown || currentRaw !== this._lastRaw)) {
        this.externalConflict = true;
        throw new Error('external-conflict');
      }
      if (replace && currentRaw !== null && currentRaw !== this._lastRaw) {
        try { validateSave(JSON.parse(currentRaw)); }
        catch { this._recoveryRaw = currentRaw; }
      }
      if (this._recoveryRaw !== null) {
        try { this._storage.setItem(RECOVERY_KEY, this._recoveryRaw); }
        catch { throw new Error('recovery-backup-failed'); }
        this._recoveryRaw = null;
        this.recoveryWarning = '本地存档曾出现格式异常，已保留有效进度；原始存档已单独备份。';
      }
      const raw = JSON.stringify(this._data);
      this._storage.setItem(STORAGE_KEY, raw);
      this._lastRaw = raw;
      this._storageKnown = true;
      this._dirty = false;
      this.storageAvailable = true;
      this.externalConflict = false;
      this.lastError = null;
      saved = true;
    } catch (error) {
      this.storageAvailable = false;
      this.lastError = error.message === 'external-conflict'
        ? '另一个标签页已更新存档；已保留本页未保存进度，请先导出备份，再导入要保留的存档。'
        : error.message === 'recovery-backup-failed'
          ? '原始损坏存档未能备份，当前进度仅保留在页面内；请导出备份，原始存档尚未覆盖。'
          : '浏览器无法保存进度，本次进度仅在当前页面保留，请导出备份。';
    }
    this._notify('local', { persisted: saved });
    return saved;
  }

  destroy() {
    globalThis.window?.removeEventListener?.('storage', this._storageListener);
    this._listeners.clear();
  }

  recordMatch(winner, { opponent = 'human', creative = false } = {}) {
    if (winner !== null && winner !== 0 && winner !== 1) {
      throw new TypeError('winner must be 0, 1, or null');
    }
    if (opponent !== 'human' && opponent !== 'computer') {
      throw new TypeError('opponent must be human or computer');
    }
    if (creative) {
      const participants = [this._data.players[0], opponent === 'computer' ? this._data.computer : this._data.players[1]];
      return participants.map((player, index) => ({
        coins: 0, newBalance: player.coins, won: winner === index, draw: winner === null,
      }));
    }
    this.refreshFromStorage({ notify: false });
    const next = cloneSave(this._data);
    next.matches = Math.min(MAX_STAT, next.matches + 1);
    const participants = [next.players[0], opponent === 'computer' ? next.computer : next.players[1]];
    const rewards = participants.map((player, index) => {
      const coins = winner === null ? 30 : winner === index ? 60 : 20;
      player.coins = Math.min(MAX_COINS, player.coins + coins);
      const stat = winner === null ? 'draws' : winner === index ? 'wins' : 'losses';
      player[stat] = Math.min(MAX_STAT, player[stat] + 1);
      return { coins, newBalance: player.coins, won: winner === index, draw: winner === null };
    });
    this._data = next;
    this.save();
    return rewards;
  }

  openChest(playerIndex, chestId, { creative = false } = {}) {
    if (creative) return { ok: false, error: '创意模式不消耗金币' };
    return this._openChest(playerIndex, chestId, true);
  }

  _openChest(playerIndex, chestId, persist, refresh = true) {
    if (playerIndex !== 0 && playerIndex !== 1 && playerIndex !== 2) return { ok: false, error: '玩家无效' };
    const chest = CHESTS.find(item => item.id === chestId);
    if (!chest) return { ok: false, error: '宝箱不存在' };
    if (refresh) this.refreshFromStorage({ notify: false });
    const wallet = playerIndex === 2 ? this._data.computer : this._data.players[playerIndex];
    if (wallet.coins < chest.price) {
      return { ok: false, error: '金币不足' };
    }
    const weights = chest.weights;
    if (!Array.isArray(weights) || weights.length !== 7 ||
        weights.some((weight, tier) => !Number.isFinite(weight) || weight < 0 ||
          (weight > 0 && !charactersByTier[tier].length))) {
      return { ok: false, error: '宝箱配置无效' };
    }
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    if (total <= 0) return { ok: false, error: '宝箱配置无效' };

    const next = cloneSave(this._data);
    const player = playerIndex === 2 ? next.computer : next.players[playerIndex];
    player.coins -= chest.price;
    const owned = new Set(player.owned);
    const results = [];
    let totalRefund = 0;
    for (let pull = 0; pull < chest.count; pull++) {
      let roll = randomUnit() * total;
      let tier = weights.length - 1;
      for (let candidate = 0; candidate < weights.length; candidate++) {
        roll -= weights[candidate];
        if (roll < 0) { tier = candidate; break; }
      }
      const pool = charactersByTier[tier];
      const character = pool[Math.floor(randomUnit() * pool.length)];
      const duplicate = owned.has(character.id);
      const refund = duplicate ? DUPLICATE_REFUNDS[tier] : 0;
      if (duplicate) player.duplicates = Math.min(MAX_STAT, player.duplicates + 1);
      else owned.add(character.id);
      totalRefund += refund;
      results.push({ character, duplicate, refund });
    }
    player.owned = [...owned].sort((a, b) => a - b);
    player.coins = Math.min(MAX_COINS, player.coins + totalRefund);
    player.chests = Math.min(MAX_STAT, player.chests + 1);
    this._data = next;
    if (persist) this.save();
    return { ok: true, results, cost: chest.price, totalRefund };
  }

  chooseComputerCharacter() {
    this.refreshFromStorage({ notify: false });
    const owned = this._data.computer.owned;
    // A yellow hero has twenty times a white hero's individual selection
    // weight: 1 yellow + 2 white gives 20/22; + 5 white gives 20/25.
    const weights = owned.map(id => 20 ** charactersById.get(id).tier);
    let roll = randomUnit() * weights.reduce((total, weight) => total + weight, 0);
    for (let index = 0; index < owned.length; index++) {
      roll -= weights[index];
      if (roll < 0) return owned[index];
    }
    return owned[owned.length - 1];
  }

  autoOpenComputerChest({ creative = false } = {}) {
    if (creative) return { ok: false, error: '创意模式不消耗金币' };
    this.refreshFromStorage({ notify: false });
    const chestId = this._data.computer.targetChest;
    // Open at most one planned box. Keep an unaffordable plan so the computer
    // saves toward it instead of spending every 100 coins on a common box.
    const result = this._openChest(2, chestId, false, false);
    if (!result.ok) return { ...result, chestId };
    let roll = randomUnit() * 100;
    let nextTarget = COMPUTER_CHEST_PLANS[COMPUTER_CHEST_PLANS.length - 1][0];
    for (const [id, weight] of COMPUTER_CHEST_PLANS) {
      roll -= weight;
      if (roll < 0) { nextTarget = id; break; }
    }
    this._data.computer.targetChest = nextTarget;
    this.save();
    return { ...result, chestId, nextTarget };
  }

  redeemCode(playerIndex, code) {
    if (playerIndex !== 0 && playerIndex !== 1) return { ok: false, error: '仅两位真人玩家可以兑换' };
    if (typeof code !== 'string' || code.trim() !== '666888') {
      return { ok: false, error: '兑换码无效' };
    }
    this.refreshFromStorage({ notify: false });
    const player = this._data.players[playerIndex];
    const allIds = [...KNOWN_IDS].sort((a, b) => a - b);
    const unlocked = allIds.length - player.owned.length;
    if (unlocked === 0) return { ok: true, unlocked: 0, total: allIds.length, alreadyUnlocked: true };
    const next = cloneSave(this._data);
    next.players[playerIndex].owned = allIds;
    this._data = next;
    this.save();
    return { ok: true, unlocked, total: allIds.length, alreadyUnlocked: false };
  }

  exportSave() {
    this.refreshFromStorage({ notify: false });
    return JSON.stringify(validateSave(this._data), null, 2);
  }

  importSave(json) {
    if (typeof json !== 'string' || json.length > 1_000_000) {
      return { ok: false, error: '请选择有效的 JSON 存档文件（小于 1 MB）' };
    }
    let next;
    try {
      next = validateSave(JSON.parse(json));
    } catch (error) {
      return { ok: false, error: error instanceof SyntaxError ? '存档不是有效的 JSON 文件' : error.message };
    }
    this._data = next;
    const persisted = this.save({ replace: true });
    return { ok: true, persisted };
  }

  reset() {
    this._data = newSave();
    const persisted = this.save({ replace: true });
    return { ok: true, persisted };
  }
}
