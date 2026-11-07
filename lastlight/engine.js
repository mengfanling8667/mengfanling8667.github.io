import { DIFFICULTIES, ITEMS, EVENTS, canScavenge } from './data.js';

export const FAMILY = [
  { id: 'father', name: '陆远', role: '父亲' },
  { id: 'mother', name: '夏晴', role: '母亲' },
  { id: 'daughter', name: '小禾', role: '姐姐' },
  { id: 'son', name: '阿野', role: '弟弟' }
];
const BASIC = ['food', 'water', 'health', 'mood', 'stamina', 'temp'];
const LETHAL = ['food', 'water', 'health', 'stamina', 'temp'];
const clamp = (n, min = 0, max = 12) => Math.min(max, Math.max(min, Number(n) || 0));
const copy = x => JSON.parse(JSON.stringify(x));
const good = message => ({ ok: true, message });
const bad = message => ({ ok: false, message });
const BASE_STOCK = { canned: 8, water: 12, bread: 4, medkit: 1, bandage: 2, wood: 2, blanket: 1, radio: 1, knife: 1, cards: 1 };
const TUTORIAL = [
  ['先认识家人', '观察每个人的状态。人物的表现比数字更重要：饥饿、口渴、生病、焦虑和疲倦都在提醒你照顾他们。白天仍可以挽救危急的家人，死亡会在过夜后才被发现。'],
  ['分配食物与饮水', '在物资栏选择食物或饮料，再选择使用者。吃喝和药品没有每日次数限制，只受库存限制。今天试着照顾出现饥饿或口渴的人。'],
  ['照顾身体与心情', '药物可以照顾身体，娱乐用品能安慰情绪。疯狂不会因为心情低落直接致死；体力耗尽却有生命危险。注意可疑物品的模糊风险描述。'],
  ['听听门外的声音', '每天可能遇到营地事件。先读清情况，再做选择；未处理的事件会阻止过夜。不是每一次敲门都值得开门，也不是每一次冒险都没有回报。'],
  ['准备一次外出', '选择一位家人，再选择随身物品。所有东西合计最多占四只手；背包本身占双手，不会增加容量。武器只在外出时发挥作用。'],
  ['等待与归途', '外出者会遇到自己的选择事件，回归时带回剩余装备、补给和消息。照顾他们的体力。情报和之后的来访可能连成一条漫长的故事。'],
  ['把决定交给你', '核尘、病毒与严寒需要不同准备。感染会逐渐恶化；极寒可能经历寒冷、冻结，最终夺走生命。正式游戏里，仔细观察、及时补给，再决定是否过夜。']
];

/** Deliberately returns descriptions only; no hidden numerical attributes leak to UI. */
export function statuses(person, type) {
  if (!person || !person.alive) return ['已故'];
  if (person.away) return ['外出中', '状态未知'];
  if (!person.present && !person.away) return ['下落不明'];
  const out = [];
  const severity = (value, severe, warning) => value <= 4 ? severe : value <= 8 ? warning : null;
  for (const [key, severe, warning] of [
    ['food', '饥荒', '饥饿'], ['water', '脱水', '口渴'], ['health', '痛苦', '生病'], ['stamina', '乏力', '疲倦']
  ]) { const label = severity(person[key], severe, warning); if (label) out.push(label); }
  if (person.mood <= 2) out.push('疯狂'); else if (person.mood <= 4) out.push('抑郁'); else if (person.mood <= 8) out.push('焦虑');
  if (type === 'cold') { const label = severity(person.temp, '冻结', '寒冷'); if (label) out.push(label); }
  if (type === 'zombie' || person.infection > 0) {
    if (person.infection >= 12) out.push('尸变'); else if (person.infection >= 8) out.push('异变'); else if (person.infection >= 4) out.push('感染');
  }
  if (LETHAL.some(k => (k !== 'temp' || type === 'cold') && person[k] <= 0)) out.push('生命垂危');
  if (person.quarantined) out.push('隔离中');
  return out.length ? out : ['状态良好'];
}

export class Game {
  constructor(savedState) {
    this.state = savedState ? copy(savedState) : null;
    if (this.state) this._hydrate();
  }
  _hydrate() {
    const s = this.state;
    s.flags ||= {}; s.messages ||= []; s.inventory ||= {}; s.family ||= [];
    s.eventHistory ||= []; s.itemCooldowns ||= {}; s.completedDays ||= 0; s.scheduled ||= []; s.productionTimers ||= {};
    s.seed = (Number(s.seed) >>> 0) || 99173;
    for (const p of s.family) {
      p.infection ||= 0; p.temp ??= 12; p.quarantined ||= false;
      p.initiallyMissing ??= Boolean(p.missing && !p.eventMissing && ['little-boy', 'fat-man'].includes(s.difficulty) && !s.flags.familyReturned);
    }
    this._syncProduction();
  }
  _random() {
    let a = this.state.seed | 0;
    a ^= a << 13; a ^= a >>> 17; a ^= a << 5;
    this.state.seed = a >>> 0;
    return (a >>> 0) / 4294967296;
  }
  _pick(array) { return array.length ? array[Math.floor(this._random() * array.length)] : null; }
  _log(text) { this.state.messages.push({ day: this.state.day, text }); if (this.state.messages.length > 250) this.state.messages.splice(0, this.state.messages.length - 250); }
  _difficulty() { return DIFFICULTIES.find(d => d.id === this.state.difficulty) || DIFFICULTIES[0]; }
  _home() { return this.state.family.filter(p => p.alive && p.present && !p.away); }
  _living() { return this.state.family.filter(p => p.alive && (p.present || p.away)); }
  _conditionPenalty(person) {
    if (!person) return 0;
    let penalty = 0;
    for (const [key, weight] of Object.entries({ food: 0.05, water: 0.07, health: 0.08, mood: 0.05, stamina: 0.1 })) penalty += person[key] <= 4 ? weight * 2 : person[key] <= 8 ? weight : 0;
    return Math.min(0.6, penalty);
  }
  _adjustChance(base, person, adventure = false) {
    if (base === undefined) return undefined;
    return Math.max(0, Math.min(1, Number(base) - (this.state.tutorial ? 0 : (this._difficulty().level - 1) * 0.025) - (adventure ? this._conditionPenalty(person) : 0)));
  }
  _returnLootCount(person) {
    const base = { 'little-boy': 6, 'fat-man': 5, tsar: 4, walker: 3.5, infected: 2.7, cold: 3.2, 'ice-age': 2 }[this.state.difficulty] ?? 4;
    return Math.max(0, Math.floor(base + this._random() * 3 - this._conditionPenalty(person) * 6));
  }
  _countsAsWealth(event, id) {
    return !(['lg-green-poor', 'lg-green-rich'].includes(event.id) && ['little-boy', 'fat-man'].includes(this.state.difficulty) && ['food', 'drink'].includes(ITEMS[id]?.category));
  }
  _eventConsequence(event, index) {
    const s = this.state;
    if (event.id === 'lg-refugee-charity' && index === event.choices.length - 1) {
      const risk = { 'little-boy': 0.3, 'fat-man': 0.5, tsar: 1, walker: 0.65, infected: 0.85, cold: 0.7, 'ice-age': 0.95 }[s.difficulty] ?? 0.5;
      if (this._random() < risk) {
        for (const id of Object.keys(s.inventory)) s.inventory[id] = 0;
        this._syncProduction();
        return '难民突然闯进避难所，搬空了物资架。库存里的物品全被抢走了。';
      }
      return '难民失望地离开了，物资暂时保住了。';
    }
    if (event.id === 'lg-green-rich' && index === 0) {
      const lost = {}, amount = 1 + Math.floor(this._random() * 3);
      for (let n = 0; n < amount; n++) {
        const ids = Object.keys(s.inventory).filter(id => s.inventory[id] > 0 && this._countsAsWealth(event, id));
        const id = this._pick(ids); if (!id) break;
        s.inventory[id]--; lost[id] = (lost[id] || 0) + 1;
      }
      const goods = Object.entries(lost).map(([id, count]) => `${ITEMS[id]?.name || id} ×${count}`).join('、');
      return goods ? `绿衣访客带走了${goods}，说会交给更需要的人。` : '绿衣访客没有找到可以分走的物品，随后离开了。';
    }
    return null;
  }
  start({ difficulty = 'little-boy', endless = false, tutorial = false, seed } = {}) {
    const d = DIFFICULTIES.find(x => x.id === difficulty) || DIFFICULTIES[0];
    this.state = {
      version: 4, phase: tutorial ? 'shelter' : 'scavenge', day: 1, completedDays: 0,
      difficulty: d.id, type: d.type, endless: Boolean(endless), tutorial: Boolean(tutorial),
      seed: (Number(seed) >>> 0) || ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 99173,
      family: FAMILY.map(p => ({ ...p, alive: true, present: Boolean(tutorial), away: false,
        food: 12, water: 12, health: 12, mood: 12, stamina: 12, temp: 12, infection: 0, quarantined: false, initiallyMissing: false })),
      inventory: tutorial ? { ...BASE_STOCK, canned: 16, water: 20, antiviral: 2, coat: 1, fuel: 3 } : {},
      messages: [], event: null, expedition: null, scheduled: [], flags: {}, itemCooldowns: {}, productionTimers: {}, eventHistory: [], ending: ''
    };
    this._log(tutorial ? '教学避难所已经准备好。这里的经历不会计入生存纪录。' : '警报响起。带上重要的物资，别忘了家人。');
    this._syncProduction();
    if (tutorial) this._tutorialEvent();
    return this.state;
  }
  finishScavenge({ inventory = {}, familyIds = [] } = {}) {
    const s = this.state;
    if (!s || s.phase !== 'scavenge') return bad('搜集阶段已经结束。');
    s.inventory = {};
    for (const [id, count] of Object.entries(inventory)) if (canScavenge(id) && Number.isFinite(count) && count > 0) s.inventory[id] = Math.floor(count);
    this._syncProduction();
    const selected = new Set(familyIds);
    for (const p of s.family) {
      p.present = selected.has(p.id);
      p.missing = !p.present && ['little-boy', 'fat-man'].includes(s.difficulty);
      p.initiallyMissing = p.missing;
      if (!p.present && !p.missing) { p.alive = false; p.deathReason = '没能及时进入避难所'; }
    }
    s.phase = 'shelter';
    this._log('舱门在身后合上了。接下来的日子，只能靠彼此。');
    if (!this._living().length) this._lose('空荡的避难所', '没有家人及时抵达避难所，故事停在了警报声里。');
    else s.event = this._special('first-night', '门闩落下', '尘埃落在舱门上。外面的世界安静了下来，屋里的人却久久没有说话。', [
      { label: '整理物资', result: '熟悉的物品整齐地摆在架子上，明天似乎有了些把握。', effects: { mood: 1 } },
      { label: '陪伴家人', result: '你们围坐了一会儿。至少，今晚不是独自一人。', effects: { mood: 2 } }
    ]);
    return good('已经进入避难所。');
  }
  _special(id, title, text, choices, extra = {}) { return { id: 'special-' + id, title, text, scene: 'shelter', choices, ...extra }; }
  _tutorialEvent() {
    const s = this.state, lesson = TUTORIAL[Math.min(6, s.day - 1)];
    s.event = this._special('tutorial-' + s.day, lesson[0], lesson[1], [{ label: s.day === 7 ? '我准备好了' : '记住了，开始今天', result: '你把这条经验记在了日记里。' }]);
  }
  _apply(person, effects = {}) {
    if (!person || !person.alive) return;
    for (const [key, value] of Object.entries(effects)) {
      if (BASIC.includes(key) && (key !== 'temp' || this.state.type === 'cold')) person[key] = clamp(person[key] + Number(value));
      else if (key === 'infection' && this.state.type === 'zombie') person.infection = clamp(person.infection + Number(value));
    }
  }
  _inventoryChange(changes = {}, store = this.state.inventory) {
    for (const [id, amount] of Object.entries(changes)) if (ITEMS[id]) store[id] = Math.max(0, (store[id] || 0) + Number(amount));
    this._refreshChoices();
  }
  _productionFor(id) { return ITEMS[id]?.production || (id === 'purifier' ? { every: 3, min: 1, max: 3, item: 'water' } : null); }
  _syncProduction() {
    const s = this.state;
    if (!s) return;
    s.productionTimers ||= {};
    for (const id of Object.keys(s.productionTimers)) if (!(s.inventory[id] > 0) || !this._productionFor(id)) delete s.productionTimers[id];
    for (const [id, count] of Object.entries(s.inventory)) {
      const production = this._productionFor(id);
      if (count > 0 && production && s.productionTimers[id] === undefined) s.productionTimers[id] = s.day + Math.max(1, Math.floor(production.every || 1));
    }
    if (s.inventory.seeds > 0 && s.inventory.soil > 0) s.flags.plantNextHarvest ??= s.day + 8;
    else delete s.flags.plantNextHarvest;
  }
  _runProduction() {
    const s = this.state;
    this._syncProduction();
    for (const [id, dueDay] of Object.entries(s.productionTimers)) {
      if (s.day < dueDay || !(s.inventory[id] > 0)) continue;
      const production = this._productionFor(id), inputs = production.inputs || {};
      s.productionTimers[id] = s.day + Math.max(1, Math.floor(production.every || 1));
      const missing = Object.entries(inputs).filter(([input, count]) => (s.inventory[input] || 0) < count);
      if (missing.length) { this._log(`${ITEMS[id].name}缺少${missing.map(([input]) => ITEMS[input]?.name || input).join('、')}，本轮没有产出。`); continue; }
      const pool = production.pool?.filter(output => ITEMS[output]) || [];
      const output = pool.length ? this._pick(pool) : production.item;
      if (!ITEMS[output]) continue;
      const min = Math.max(0, Math.floor(production.min ?? 1)), max = Math.max(min, Math.floor(production.max ?? min));
      const amount = min + Math.floor(this._random() * (max - min + 1));
      const changes = Object.fromEntries(Object.entries(inputs).map(([input, count]) => [input, -count]));
      changes[output] = (changes[output] || 0) + amount;
      this._inventoryChange(changes);
      this._log(`${ITEMS[id].name}产出了${ITEMS[output].name}，已经放入物资架。`);
    }
    if (s.flags.plantNextHarvest !== undefined && s.day >= s.flags.plantNextHarvest) {
      s.inventory.apple = (s.inventory.apple || 0) + 1; s.flags.plantNextHarvest = s.day + 8;
      this._log('角落里的种植盆结出一点可以吃的东西。');
    }
  }
  _canPay(changes, store) { return !changes || Object.entries(changes).every(([id, count]) => Number(count) >= 0 || (store[id] || 0) >= -Number(count)); }
  _personUnavailable(id) {
    const person = this.state.family.find(p => p.id === id), name = person?.name || '所需家人';
    if (!person?.alive) return `${name}已离世`;
    if (person.away) return `${name}正在外出`;
    if (person.missing) return `${name}下落不明`;
    if (!person.present) return `${name}不在避难所`;
    return `${name}暂时不适合这次行动`;
  }
  _paymentReason(choice, store) {
    const required = {};
    for (const [changes, mission] of [[choice.items, choice.sendPerson], [choice.failItems, choice.failSendPerson]]) {
      const branch = {};
      for (const [id, value] of Object.entries(changes || {})) if (value < 0) branch[id] = -value;
      for (const [id, value] of Object.entries(mission?.pack || {})) branch[id] = (branch[id] || 0) + value;
      for (const [id, value] of Object.entries(branch)) required[id] = Math.max(required[id] || 0, value);
    }
    if (choice.requiresItem) required[choice.requiresItem] = Math.max(1, required[choice.requiresItem] || 0);
    const missing = Object.entries(required).filter(([id, count]) => (store[id] || 0) < count).map(([id, count]) => `${ITEMS[id]?.name || id} ×${count - (store[id] || 0)}`);
    if (missing.length) return `缺少：${missing.join('、')}。`;
    if (choice.requiresAnyItem && !choice.requiresAnyItem.some(id => store[id] > 0)) return `需要以下任一物品：${choice.requiresAnyItem.map(id => ITEMS[id]?.name || id).join('、')}。`;
    return '';
  }
  _flagsMatch(rule) {
    return (!rule.requiresFlag || this.state.flags[rule.requiresFlag])
      && (!rule.requiresFlags || rule.requiresFlags.every(k => this.state.flags[k]))
      && (!rule.forbidsFlags || rule.forbidsFlags.every(k => !this.state.flags[k]));
  }
  _hasItems(rule, store) {
    return (!rule.requiresItem || store[rule.requiresItem] > 0)
      && (!rule.requiresAnyItem || rule.requiresAnyItem.some(id => store[id] > 0));
  }
  _isRoute(event) { return event.rescue || event.ending || event.route || event.choices?.some(choice => choice.victory) || /^special-(military|intel|siblings(?:-return)?|car|research(?:-rescue)?|warm-route|warm-rescue)$/.test(event.id); }
  _peopleFor(choice, event, scene) {
    const bound = choice.targetId || choice.sendPerson?.id || event.targetId || event._context?.targetId;
    let people;
    if (scene === 'outside') people = this.state.family.filter(p => p.id === this.state.expedition?.personId && p.alive);
    else if (choice.returnPerson) people = this.state.family.filter(p => p.alive && (p.missing || (p.present && !p.away)));
    else people = this._home();
    if (bound) people = people.filter(p => p.id === bound);
    if (choice.people) people = people.filter(p => choice.people.includes(p.id));
    if (choice.sendPerson || choice.failSendPerson) people = people.filter(p => LETHAL.every(k => (k === 'temp' && this.state.type !== 'cold') || p[k] > 0));
    const filter = choice.targetFilter || event.targetFilter;
    if (filter) people = people.filter(p => Object.entries(filter.min || {}).every(([key, n]) => p[key] >= n)
      && Object.entries(filter.max || {}).every(([key, n]) => p[key] <= n));
    return people;
  }
  _choiceCheck(choice, event, scene) {
    const store = scene === 'outside' ? this.state.expedition?.pack || {} : this.state.inventory;
    if (this.state.endless && (choice.route || choice.rescue || choice.ending || choice.victory)) return '无尽模式不会开启获救路线';
    if (!this._flagsMatch(choice)) return '此时还不具备这个选择的条件';
    if (choice.requiresPeople) {
      const missing = choice.requiresPeople.filter(id => !this._home().some(p => p.id === id));
      if (missing.length) return missing.map(id => this._personUnavailable(id)).join('；') + '。';
    }
    const paymentReason = this._paymentReason(choice, store);
    if (paymentReason) return paymentReason;
    if ((choice.choosePerson || choice.targetId || choice.sendPerson || choice.failSendPerson || choice.returnPerson || event.targetId || event._context?.targetId) && !this._peopleFor(choice, event, scene).length) {
      const bound = choice.targetId || choice.sendPerson?.id || event.targetId || event._context?.targetId;
      const ids = bound ? [bound] : choice.people || this.state.family.map(p => p.id);
      return `没有可选家人：${ids.map(id => this._personUnavailable(id)).join('；')}。`;
    }
    if (choice.sendPerson || choice.failSendPerson) {
      if (this.state.expedition || this._living().some(p => p.away) || scene === 'outside') return `${this.state.family.find(p => p.id === this.state.expedition?.personId)?.name || this._living().find(p => p.away)?.name || '家人'}正在外出，请先等其回来。`;
      for (const [mission, changes] of [[choice.sendPerson, choice.items], [choice.failSendPerson, choice.failItems]]) {
        if (!mission) continue;
        const pack = mission.pack || {};
        if (Object.entries(pack).some(([id, n]) => !ITEMS[id] || !Number.isInteger(n) || n < 0)) return '行动携带物品无效';
        if (Object.entries(pack).reduce((sum, [id, n]) => sum + (ITEMS[id]?.hands || 1) * n, 0) > 4) return '行动携带物品超过四只手';
      }
    }
    return '';
  }
  _refreshChoices() {
    this._syncProduction();
    for (const [event, scene] of [[this.state.event, 'shelter'], [this.state.expedition?.event, 'outside']]) {
      if (!event) continue;
      for (const choice of event.choices || []) {
        const reason = this._choiceCheck(choice, event, scene);
        choice.disabled = Boolean(reason);
        if (reason) choice.reason = reason; else delete choice.reason;
        if (choice.choosePerson) choice.targetOptions = this._peopleFor(choice, event, scene).map(({ id, name }) => ({ id, name }));
      }
    }
  }
  _checkInfection() {
    const p = this._living().find(x => x.infection >= 12);
    if (p) { for (const member of this.state.family) { member.alive = false; member.deathReason = '尸变袭击'; } this._lose('最后一声敲门', `${p.name}再也认不出家人的声音。尸变在避难所里蔓延，没有人逃过这一夜。`); return true; }
    return false;
  }
  _lose(title, text) { this.state.phase = 'lost'; this.state.ending = title; this.state.endingText = text; this.state.event = null; if (this.state.expedition) this.state.expedition.event = null; this._log(text); }
  _win(title, text) {
    if (this.state.endless && !this.state.tutorial) return false;
    this.state.phase = 'won'; this.state.ending = title; this.state.endingText = text; this.state.event = null;
    if (this.state.expedition) this.state.expedition.event = null;
    this._log(text); return true;
  }
  useItem(personId, itemId) {
    const s = this.state, item = ITEMS[itemId];
    if (!s || s.phase !== 'shelter') return bad('现在无法使用物品。');
    if (!item || !(s.inventory[itemId] > 0)) return bad('这件物品已经不在库存里。');
    const p = s.family.find(x => x.id === personId);
    if (!p || !p.alive || !p.present || p.away) return bad('请选择仍在避难所中的家人。');
    if (item.material) return bad('这份材料可以留给生产设备或交换，不能直接使用。');
    if (itemId === 'lamp') return bad('神灯需要许愿：选择食物、饮料或其他。');
    if (this._productionFor(itemId)) { this._syncProduction(); return good('这件耐用品正在按周期工作，无需反复点击。'); }
    if (item.reusable && ['warmth', 'durable'].includes(item.category) && (item.effects?.temp || 0) > 0) return good('这件用品正持续为避难所保暖，不必反复使用。');
    if (item.category === 'weapon') return bad('把武器装入外出背包，才能在外面发挥作用。');
    if (itemId === 'intel') { s.flags.intel = true; s.flags.intelDay ??= s.day; this._log('你们认真核对了情报，记下军方可能询问的地标与撤离消息。'); return good('已经读过这份情报。'); }
    if (itemId === 'map') { s.flags.mapStudied = true; this._log('地图上的旧公路被圈了起来。也许能修好一辆还能行驶的车。'); return good('已经记下地图上的路线。'); }
    if (!Object.keys(item.effects || {}).length) return bad('这件物品适合外出携带，或留到需要它的事件。');
    const cooldown = item.reusable ? Number(item.cooldown || 1) : 0;
    const key = itemId + ':' + p.id;
    if (cooldown && s.itemCooldowns[key] !== undefined && s.day - s.itemCooldowns[key] < cooldown) return bad('这件耐用品还需要等待一段时间才能再次发挥作用。');
    const success = item.chance === undefined || this._random() < item.chance;
    this._apply(p, success ? item.effects : item.failEffects || {});
    if (!item.reusable) s.inventory[itemId]--;
    else s.itemCooldowns[key] = s.day;
    this._refreshChoices();
    if (itemId === 'radio') s.flags.radioListened = true;
    if (this._checkInfection()) return good('感染已经失去控制。');
    const text = `${p.name}使用了${item.name}。${success ? '身体或心情有了些变化，请留意新的状态。' : '效果不如预期，令人不安。'}`;
    this._log(text); return good(text);
  }
  wish(category) {
    const s = this.state;
    if (!s || s.phase !== 'shelter' || !(s.inventory.lamp > 0)) return bad('需要一盏仍在避难所中的神灯。');
    if (!['food', 'drink', 'other'].includes(category)) return bad('请选择食物、饮料或其他物品。');
    if (s.flags.lastWish !== undefined && s.day - s.flags.lastWish < 3) return bad('灯里没有回应，再等几天吧。');
    const options = Object.values(ITEMS).filter(i => category === 'other' ? !['food', 'drink'].includes(i.category) && i.id !== 'lamp' : i.category === category);
    const found = this._pick(options);
    if (!found) return bad('神灯没有找到能回应这个愿望的东西。');
    s.inventory[found.id] = (s.inventory[found.id] || 0) + 1;
    this._refreshChoices();
    s.flags.lastWish = s.day; this._log(`铜灯微微发亮。等光芒散去，地上多了${found.name}。`);
    return good(`愿望得到了回应：${found.name}。`);
  }
  force(person) {
    const p = typeof person === 'string' ? this.state?.family.find(x => x.id === person) : person;
    if (!p?.away || this.state?.expedition?.personId !== p.id) return 1;
    let bonus = 0;
    for (const [id, qty] of Object.entries(this.state.expedition.pack || {})) bonus += (ITEMS[id]?.force || 0) * qty;
    return Math.min(12, 1 + Math.max(0, bonus));
  }
  depart(personId, pack = {}) {
    const s = this.state;
    if (!s || s.phase !== 'shelter') return bad('现在无法安排外出。');
    if (s.expedition || this._living().some(p => p.away)) return bad(`${this._living().find(p => p.away)?.name || '家人'}正在外出，请先等其回来。`);
    const p = this._home().find(x => x.id === personId);
    if (!p) return bad('请选择仍在避难所的家人。');
    if (LETHAL.some(k => (k !== 'temp' || s.type === 'cold') && p[k] <= 0)) return bad('先照顾这位生命垂危的家人，再安排外出。');
    let hands = 0; const checked = {};
    for (const [id, qty] of Object.entries(pack)) {
      if (!ITEMS[id] || !Number.isInteger(qty) || qty < 0) return bad('外出物品数量无效。');
      if (qty > (s.inventory[id] || 0)) return bad(`缺少：${ITEMS[id].name} ×${qty - (s.inventory[id] || 0)}。`);
      if (qty > 0) { checked[id] = qty; hands += Math.max(1, ITEMS[id].hands || 1) * qty; }
    }
    if (hands > 4) return bad('随身物品超过四只手的携带上限。背包本身也占双手。');
    for (const [id, qty] of Object.entries(checked)) s.inventory[id] -= qty;
    p.present = false; p.away = true;
    const duration = s.tutorial ? 1 : 2 + (this._random() < 0.35 ? 1 : 0);
    s.expedition = { personId, pack: checked, returnDay: s.day + duration, event: null, loot: {}, startedDay: s.day, escort: Boolean(s.flags.lg_tripEscort) };
    if (s.flags.lg_tripEscort) { delete s.flags.lg_tripEscort; this._log('先前约好的向导会照应这次回程，减少遇袭的危险。'); }
    this._refreshChoices();
    this._log(`${p.name}推开舱门走了出去。你们约好，几天后在这里重逢。`);
    return good(`${p.name}已经出发。`);
  }
  chooseEvent(index, scene = 'shelter', options = {}) {
    const s = this.state;
    if (!s || s.phase !== 'shelter') return bad('现在没有可处理的事件。');
    const outside = scene === 'outside', event = outside ? s.expedition?.event : s.event;
    const choice = event?.choices?.[index];
    if (!choice) return bad('请选择一个有效选项。');
    const store = outside ? s.expedition.pack : s.inventory;
    const blocked = this._choiceCheck(choice, event, scene);
    if (blocked) return bad(blocked);
    if (typeof options === 'string') options = { targetId: options };
    const people = this._peopleFor(choice, event, scene);
    if (choice.choosePerson && !people.some(p => p.id === options.targetId)) return bad('请先选择参加这次行动的家人。');
    const target = choice.choosePerson ? people.find(p => p.id === options.targetId) : this._pick(people);
    let chance = choice.chance;
    if (chance !== undefined) {
      for (const [id, bonus] of Object.entries(choice.chanceByItem || {})) if (store[id] > 0) chance += bonus;
      for (const [flag, bonus] of Object.entries(choice.chanceByFlag || {})) if (s.flags[flag]) chance += bonus;
      chance = this._adjustChance(chance, target, outside || Boolean(choice.sendPerson || choice.failSendPerson));
    }
    const success = chance === undefined || this._random() < Math.max(0, Math.min(1, chance));
    const effects = success ? choice.effects || {} : choice.failEffects || {};
    const changes = success ? choice.items || {} : choice.failItems || {};
    if (choice.all || event.all) { for (const p of this._home()) this._apply(p, effects); } else this._apply(target, effects);
    for (const [id, specificEffects] of Object.entries((success ? choice.personEffects : choice.failPersonEffects) || {})) this._apply(this._home().find(p => p.id === id), specificEffects);
    this._inventoryChange(changes, store);
    const removed = success && event.id === 'lg-green-rich' && index === 0 ? [] : (success ? choice.removeItems : choice.failRemoveItems) || [];
    for (const id of removed) if (store[id] > 0) {
      store[id]--; this._log(`${ITEMS[id]?.name || '一件物品'}损坏或遗失了。`);
    }
    this._setFlags(success ? choice.setFlags : choice.failSetFlags);
    for (const key of (success ? choice.clearFlags : choice.failClearFlags) || []) delete s.flags[key];
    if (choice.flag && success) {
      s.flags[choice.flag] = true; s.flags[choice.flag + 'Day'] = s.day;
      if (choice.flag === 'chose_isolation' && s.type === 'zombie' && target) target.quarantined = true;
    }
    if (choice.failFlag && !success) s.flags[choice.failFlag] = true;
    const consequence = success ? this._eventConsequence(event, index) : null;
    const outcomeText = consequence || (success ? choice.result || '你们做出了决定。' : choice.failResult || '结果并不如愿。');
    const explicitTarget = choice.choosePerson || choice.targetId || choice.sendPerson || choice.failSendPerson || event.targetId || event._context?.targetId;
    this._log(explicitTarget && target ? `${target.name}：${outcomeText}` : outcomeText);
    s.flags.eventCount = (s.flags.eventCount || 0) + 1;
    const mission = success ? choice.sendPerson : choice.failSendPerson;
    if (mission && target) this._sendPerson(target, mission);
    if ((success ? choice.losePerson : choice.failLosePerson) && target) this._losePerson(target);
    if (success && choice.returnPerson && target) { target.missing = false; target.present = true; target.away = false; this._log(`${target.name}终于重新回到了家人身边。`); }
    const boundTarget = explicitTarget ? target : null;
    this._schedule(success ? choice.followUp : choice.failFollowUp, event, boundTarget);
    if (event._action) this._specialChoice(event._action, index, success);
    if (s.phase === 'shelter') { if (outside) { if (s.expedition) s.expedition.event = null; } else s.event = null; }
    if (!this._checkInfection()) {
      if (!this._living().length) this._lose('无人回应', '最后一位家人也失去了踪迹，这处避难所再没有等来回应。');
      else if (success && choice.victory && !s.endless && !s.tutorial && s.phase === 'shelter') this._win(choice.victory.title || '新的去处', choice.victory.text || '你们终于等到了可以离开的机会。');
    }
    this._refreshChoices();
    return good('这件事已经记入日记。');
  }
  _setFlags(flags) {
    if (Array.isArray(flags)) for (const flag of flags) { this.state.flags[flag] = true; this.state.flags[flag + 'Day'] = this.state.day; }
    else if (flags && typeof flags === 'object') for (const [flag, value] of Object.entries(flags)) { this.state.flags[flag] = value; this.state.flags[flag + 'Day'] = this.state.day; }
  }
  _losePerson(person) {
    person.present = false; person.away = false; person.missing = true; person.initiallyMissing = false; person.eventMissing = true;
    if (this.state.expedition?.personId === person.id) this.state.expedition = null;
    this._log(`${person.name}没有回来，也没有留下可以追寻的消息。`);
  }
  _sendPerson(person, mission) {
    const s = this.state, pack = copy(mission.pack || {});
    for (const [id, qty] of Object.entries(pack)) s.inventory[id] = Math.max(0, (s.inventory[id] || 0) - qty);
    person.present = false; person.away = true;
    s.expedition = { personId: person.id, pack, loot: {}, event: null, scripted: true,
      returnDay: s.day + Math.max(1, Number(mission.days) || 1), startedDay: s.day, mission: copy(mission) };
    this._log(`${person.name}离开避难所执行这次约定的行动。`);
  }
  _schedule(followUp, source, person) {
    if (!followUp) return;
    const s = this.state;
    for (const follow of Array.isArray(followUp) ? followUp : [followUp]) {
      if (!follow.eventId) continue;
      const chainId = follow.chainId || source.chainId || source._context?.chainId || source.id;
      const context = { chainId, sourceEventId: source.id, targetId: follow.bindPerson === false ? null : person?.id || source._context?.targetId || null };
      // A saved chain can have several different stages, but never duplicate the same pending stage.
      if (!s.scheduled.some(entry => entry.eventId === follow.eventId && entry.context.chainId === chainId && entry.context.targetId === context.targetId)) {
        const dueDay = s.day + Math.max(1, Number(follow.delay) || 1);
        s.scheduled.push({ eventId: follow.eventId, dueDay, context, expiresDay: dueDay + (Number(follow.expiresAfter) || 30) });
      }
    }
  }
  _specialChoice(action, index) {
    const s = this.state;
    if (action === 'family-return') {
      for (const p of s.family.filter(x => x.initiallyMissing && x.missing && x.alive)) {
        p.missing = false; p.initiallyMissing = false; p.present = true;
        const key = this._pick(['food', 'water', 'health', 'mood']); p[key] = 7;
        this._log(`${p.name}终于回来了，身上还带着这几天奔波留下的不适。`);
      }
      s.flags.familyReturned = true;
    } else if (action === 'fishing-loan' && index === 0) {
      s.flags.fishingBorrowed = true;
      s.flags.fishingReturnDay = s.day + 3 + Math.floor(this._random() * 3);
      s.flags.fishingOutstanding = true;
    } else if (action === 'fishing-return') {
      s.inventory.fishing_rod = (s.inventory.fishing_rod || 0) + 1;
      s.flags.fishingOutstanding = false;
      if (this._random() < 0.65) {
        this._inventoryChange({ fish_can: 1 + Math.floor(this._random() * 2), water: 1 });
        this._log('钓鱼佬还留下了自己准备的食物与饮水，当作这次借用的谢礼。');
      } else this._log('他抱歉地解释这次没有多少收获，但仍把鱼竿擦干净还了回来。');
    } else if (action === 'intel' && index === 0) {
      s.flags.intel = true; s.flags.intelDay = s.day;
    } else if (action === 'military') {
      s.flags.militaryVisited = true;
      if (index === 0) { s.flags.militaryHonest = true; s.flags.militaryDay = s.day; }
    } else if (action === 'siblings' && index === 0) {
      s.flags.siblingsHelped = true; s.flags.siblingsDay = s.day;
    } else if (action === 'siblings-return') {
      if (index === 0) this._win('同行之路', '曾经得到帮助的兄妹带回一支幸存者队伍。你们带上行李，走向新的营地。');
      else s.flags.siblingsDeclined = true;
    } else if (action === 'car') {
      if (index === 0) this._win('驶向黎明', '发动机终于再次轰鸣。地图铺在膝头，一家人沿着旧公路离开了废墟。');
      else s.flags.carDeclined = true;
    } else if (action === 'research' && index === 0) {
      s.flags.researchHelped = true; s.flags.researchDay = s.day;
    } else if (action === 'research-rescue' && index === 0) this._win('净化曙光', '研究队循着你们留下的消息找来。隔离车门关上时，远处终于亮起了新的希望。');
    else if (action === 'warm-route' && index === 0) { s.flags.warmRoute = true; s.flags.warmRouteDay = s.day; }
    else if (action === 'warm-rescue' && index === 0) this._win('暖城迁徙', '履带车碾过厚雪。带着最后一箱物资，你们终于望见远方有热气升起的城镇。');
  }
  _prepareEvent(source, scene) {
    const event = copy(source);
    if (event.trade) {
      const available = event.choices.filter(choice => !choice.decline && !this._choiceCheck(choice, event, scene));
      const selected = [];
      while (available.length && selected.length < 3) selected.push(available.splice(Math.floor(this._random() * available.length), 1)[0]);
      event.choices = selected.concat(event.choices.filter(c => c.decline));
    }
    event.choices = event.choices.map(c => {
      const reason = this._choiceCheck(c, event, scene), prepared = { ...c, disabled: Boolean(reason) };
      if (reason) prepared.reason = reason; else delete prepared.reason;
      if (c.choosePerson) prepared.targetOptions = this._peopleFor(c, event, scene).map(({ id, name }) => ({ id, name }));
      return prepared;
    });
    return event;
  }
  _eventAllowed(event, scene, scheduled = false) {
    const s = this.state, store = scene === 'outside' ? s.expedition?.pack || {} : s.inventory;
    if (event.scene !== scene || (event.scheduledOnly && !scheduled) || (event.types && !event.types.includes(s.type))) return false;
    if ((event.minDay && s.day < event.minDay) || (event.maxDay && s.day > event.maxDay)) return false;
    if (!this._flagsMatch(event) || !this._hasItems(event, store) || (s.endless && this._isRoute(event))) return false;
    if (event.requiresNoExpedition && (s.expedition || this._living().some(p => p.away))) return false;
    if ((event.minHome !== undefined && this._home().length < event.minHome) || (event.maxHome !== undefined && this._home().length > event.maxHome)) return false;
    if (event.requiresPeople && !event.requiresPeople.every(id => this._home().some(p => p.id === id))) return false;
    const stock = Object.entries(store).reduce((sum, [id, count]) => sum + (this._countsAsWealth(event, id) ? Math.max(0, Number(count) || 0) : 0), 0);
    if ((event.minStock !== undefined && stock < event.minStock) || (event.maxStock !== undefined && stock > event.maxStock)) return false;
    if (event.maxSupply && !Object.entries(event.maxSupply).some(([category, threshold]) => Object.entries(store).reduce((sum, [id, qty]) => sum + (ITEMS[id]?.category === category ? Math.max(0, qty) : 0), 0) <= threshold)) return false;
    if ((event.minResource || event.maxResource) && !this._home().some(p => Object.entries(event.minResource || {}).every(([key, n]) => p[key] >= n)
      && Object.entries(event.maxResource || {}).every(([key, n]) => p[key] <= n))) return false;
    if (event.once && s.eventHistory.some(h => h.id === event.id)) return false;
    if (!scheduled && s.eventHistory.some(h => h.id === event.id && s.day - h.day < (event.cooldown || 8))) return false;
    return event.choices?.some(choice => !this._choiceCheck(choice, event, scene));
  }
  _drawEvent(scene) {
    const s = this.state, pool = EVENTS.filter(event => this._eventAllowed(event, scene));
    if (!pool.length) return null;
    const chosen = this._pick(pool); s.eventHistory.push({ id: chosen.id, day: s.day });
    return this._prepareEvent(chosen, scene);
  }
  _scheduledEvent(scene) {
    const s = this.state;
    s.scheduled.sort((a, b) => a.dueDay - b.dueDay);
    for (const entry of [...s.scheduled]) {
      if (s.day < entry.dueDay) break;
      const source = EVENTS.find(e => e.id === entry.eventId);
      const person = entry.context.targetId ? s.family.find(p => p.id === entry.context.targetId) : null;
      const returnEvent = source?.choices.some(c => c.returnPerson);
      if (!source || (s.endless && this._isRoute(source)) || (entry.context.targetId && (!person?.alive || (person.missing && !returnEvent))) || s.day > entry.expiresDay) {
        s.scheduled.splice(s.scheduled.indexOf(entry), 1);
        if (source && !(s.endless && this._isRoute(source))) this._log('一段约定没有等来后续，日记里只留下了未完的故事。');
        continue;
      }
      if (source.scene !== scene) continue;
      const event = { ...copy(source), _context: copy(entry.context) };
      if (!this._eventAllowed(event, scene, true)) continue;
      s.scheduled.splice(s.scheduled.indexOf(entry), 1); s.eventHistory.push({ id: event.id, day: s.day });
      return this._prepareEvent(event, scene);
    }
    return null;
  }
  _routeEvent() {
    const s = this.state, f = s.flags;
    if (s.endless || s.tutorial) return null;
    const militaryDay = f.militaryDay ?? f.militaryHonestDay;
    const siblingsDay = f.siblingsDay ?? f.siblingsHelpedDay;
    const build = (id, title, text, choices, action) => this._special(id, title, text, choices, { _action: action });
    if (f.militaryHonest && Number.isFinite(militaryDay) && s.day - militaryDay >= 3 && this._random() < 0.13) {
      this._win('军方撤离', '舱外传来约定的口令。你们提供的情报通过核实，军方车队为仍然活着的家人留出了位置。'); return null;
    }
    if (f.intel && !f.militaryVisited && s.day - (f.intelDay || 1) >= 3) return build('military', '制服上的尘埃', '军方巡逻员来到舱门前，询问你们掌握的地标与撤离消息。纸条上的细节仍记在心里。', [
      { label: '如实回答', result: '巡逻员认真记下回答，并约好后续联络方式。' },
      { label: '编造更有价值的消息', result: '对方没有反驳，却也没有留下任何约定。' }
    ], 'military');
    if (!f.intel && s.day >= 5 && (s.inventory.intel > 0 || (s.inventory.radio > 0 && f.radioListened && this._random() < 0.4))) return build('intel', '噪声里的坐标', '断续的广播与旧纸条能拼成一份撤离情报。把它认真记下，或许有一天用得上。', [
      { label: '仔细搜集并核对情报', result: '你们记住了呼号与地标，等待有人来问起。' },
      { label: '先顾好眼前的生活', result: '广播再次隐没在噪声里。' }
    ], 'intel');
    if (f.siblingsHelped && !f.siblingsDeclined && !f.lg_robbedInnocent && Number.isFinite(siblingsDay) && s.day - siblingsDay >= 9 && this._random() < 0.18) return build('siblings-return', '熟悉的声音', '曾在门外求助的兄妹回来了。他们找到一处营地，邀请你们同行。', [
      { label: '带着家人同行', result: '你们决定相信这次重逢。' }, { label: '继续留守', result: '你们道别，并互相祝愿平安。' }
    ], 'siblings-return');
    if (!f.siblingsHelped && !f.siblingsAsked && !f.lg_robbedInnocent && s.day >= 8 && this._random() < 0.12) { f.siblingsAsked = true; return this._prepareEvent(build('siblings', '门外的兄妹', '一对疲惫的兄妹在门外求助，他们还想去寻找其他幸存者。', [
      { label: '分给他们食物和水', result: '兄妹带着补给离开，认真记住了这扇门。', items: { canned: -1, water: -1 } },
      { label: '婉拒请求', result: '你们把难言的沉默留在了门两侧。' }
    ], 'siblings'), 'shelter'); }
    if (!f.carDeclined && s.day >= 12 && s.inventory.parts > 0 && s.inventory.fuel > 0 && s.inventory.map > 0) return this._prepareEvent(build('car', '还能发动的旧车', '路边那辆旧车终于有了修好的希望。零件、燃料和地图都在，你们可以试着离开。', [
      { label: '修车，带家人离开', result: '你们把最后的希望交给了旧发动机。', items: { parts: -1, fuel: -1 } },
      { label: '继续守住避难所', result: '你们把钥匙放回了抽屉。' }
    ], 'car'), 'shelter');
    if (s.type === 'zombie' && s.day >= 13 && !f.researchHelped && !f.researchAsked && this._random() < 0.15) { f.researchAsked = true; return this._prepareEvent(build('research', '研究员的请求', '流亡的研究员需要抗病毒药物。他们承诺，找到安全的隔离区后会回来。', [
      { label: '交出抗病毒药物', result: '他们小心收起药物，在地图上标记了这里。', items: { antiviral: -1 } },
      { label: '留下药物', result: '研究员理解你们的担忧，转身离开。' }
    ], 'research'), 'shelter'); }
    if (f.researchHelped && s.day - f.researchDay >= 8 && this._random() < 0.2) return build('research-rescue', '隔离车队', '研究队带着隔离车辆回来，愿意接走仍在等待的人。', [{ label: '登上隔离车辆', result: '你们终于可以离开这里。' }, { label: '暂时留守', result: '车队留下了联络口令。' }], 'research-rescue');
    if (s.type === 'cold' && s.day >= 12 && !f.warmRoute && !f.warmRouteAsked && this._random() < 0.18) { f.warmRouteAsked = true; return this._prepareEvent(build('warm-route', '风雪另一端', '勘探队正在寻找一条通向地热城镇的路线，希望你们能提供燃料。', [{ label: '分出燃料，帮助探路', result: '探路者约定带回通行的消息。', items: { fuel: -1 } }, { label: '把燃料留给家人', result: '火炉里仍有一点温度。' }], 'warm-route'), 'shelter'); }
    if (f.warmRoute && s.day - f.warmRouteDay >= 8 && this._random() < 0.2) return build('warm-rescue', '通往暖城', '探路者带来可以通行的好消息。一辆履带车正在雪地里等候。', [{ label: '跟随车队迁徙', result: '你们最后一次熄灭了避难所的灯。' }, { label: '继续等待', result: '你们记住了车队的方向。' }], 'warm-rescue');
    return null;
  }
  _ordinaryChainEvent() {
    const s = this.state, f = s.flags;
    if (s.tutorial) return null;
    if (f.fishingOutstanding && s.day >= f.fishingReturnDay) return this._special('fishing-return', '钓鱼佬回来了', '门外站着那位借走鱼竿的人。他把熟悉的鱼竿抱在怀里，说自己没有忘记约定。', [
      { label: '接过鱼竿，请他讲讲近况', result: '鱼竿又回到了物资架上。' }
    ], { _action: 'fishing-return' });
    if (!f.fishingBorrowed && s.inventory.fishing_rod > 0 && s.day >= 4 && this._random() < 0.14) return this._prepareEvent(this._special('fishing-loan', '想借鱼竿的人', '一位自称熟悉附近水域的钓鱼佬来到门外。他想借走鱼竿几天，并承诺回来归还。', [
      { label: '借给他，相信这次约定', result: '钓鱼佬接过鱼竿，认真说了声谢谢。', items: { fishing_rod: -1 } },
      { label: '把鱼竿留在家里', result: '对方点点头，祝你们平安。' }
    ], { _action: 'fishing-loan' }), 'shelter');
    return null;
  }
  _returnExpedition() {
    const s = this.state, trip = s.expedition;
    if (!trip || s.day < trip.returnDay) return;
    const p = s.family.find(x => x.id === trip.personId);
    if (!p?.alive) { s.expedition = null; return; }
    if (trip.scripted) {
      const mission = trip.mission || {}, chance = this._adjustChance(mission.chance, p, true), success = chance === undefined || this._random() < chance;
      this._apply(p, success ? mission.returnEffects || {} : mission.failEffects || {});
      this._inventoryChange(trip.pack); this._inventoryChange(success ? mission.returnItems || {} : mission.failItems || {});
      p.stamina = Math.min(8, clamp(p.stamina - 6));
      p.away = false; p.present = true; s.expedition = null;
      this._log(`${p.name}完成约定的行动回来了。${success ? mission.result || '归途与经历已经记在日记里。' : mission.failResult || '这次的经历并不顺利。'}`);
      this._log(`${p.name}的脚步沉重，需要在避难所休息。`);
      this._checkInfection(); return;
    }
    const level = this._difficulty().level, power = this.force(p), safe = Boolean(trip.pack.mask || trip.pack.helmet || trip.pack.raincoat);
    if (!s.tutorial && !trip.escort && this._random() < Math.max(0.06, 0.14 + level * 0.035 + this._conditionPenalty(p) * 0.3 - power * 0.018 - (safe ? 0.05 : 0))) {
      this._apply(p, { health: -2, stamina: -2, ...(s.type === 'zombie' ? { infection: 2 } : {}) });
      this._log(`${p.name}回程时遭遇了危险，仍咬牙把物资带了回来。`);
    }
    this._inventoryChange(trip.pack); this._inventoryChange(trip.loot);
    const lootIds = ['canned', 'water', 'bread', 'water', 'antiseptic', 'fuel', 'wood', 'parts', 'map', 'antiviral', 'apple', 'bandage'];
    const devices = Object.values(ITEMS).filter(item => item.production || item.category === 'durable' || (item.reusable && ['tool', 'warmth'].includes(item.category))).map(item => item.id);
    const supplies = Object.values(ITEMS).filter(item => ['food', 'drink', 'medicine'].includes(item.category)).map(item => item.id);
    const amount = this._returnLootCount(p);
    for (let i = 0; i < amount; i++) {
      const roll = this._random(), pool = roll < 0.18 && devices.length ? devices : roll < 0.35 && supplies.length ? supplies : lootIds;
      const id = this._pick(pool); s.inventory[id] = (s.inventory[id] || 0) + 1;
    }
    if (!s.endless && !s.tutorial && !s.flags.intel && this._random() < 0.3) { s.inventory.intel = (s.inventory.intel || 0) + 1; this._log('归途中捡到的纸条似乎记着撤离消息，可以仔细读一读。'); }
    p.stamina = Math.min(8, clamp(p.stamina - 6));
    p.away = false; p.present = true; s.expedition = null;
    s.flags.expeditions = (s.flags.expeditions || 0) + 1;
    this._log(amount ? `${p.name}回来了，带回一些补给和未用完的随身物品。` : `${p.name}回来了，但没有找到能带走的补给。`);
    this._log(`${p.name}的脚步沉重，需要在避难所休息。`);
    this._refreshChoices();
    this._checkInfection();
  }
  _nightPerson(p, level) {
    const s = this.state, trip = p.away ? s.expedition : null;
    if (trip) {
      for (const category of ['food', 'drink']) {
        const key = category === 'food' ? 'food' : 'water';
        if (p[key] <= 8) {
          const id = Object.keys(trip.pack).find(i => trip.pack[i] > 0 && ITEMS[i]?.category === category);
          if (id) { const item = ITEMS[id], works = item.chance === undefined || this._random() < item.chance; this._apply(p, works ? item.effects : item.failEffects || {}); trip.pack[id]--; }
        }
      }
      const medicine = Object.keys(trip.pack).find(id => trip.pack[id] > 0 && ITEMS[id]?.category === 'medicine'
        && ((p.health <= 8 && (ITEMS[id].effects?.health || 0) > 0) || (p.infection >= 4 && (ITEMS[id].effects?.infection || 0) < 0)));
      if (medicine) {
        const item = ITEMS[medicine], works = item.chance === undefined || this._random() < item.chance;
        this._apply(p, works ? item.effects : item.failEffects || {}); trip.pack[medicine]--;
        this._log(`${p.name}在途中使用了随身携带的${item.name}。${works ? '不适稍有缓解。' : '效果并不理想。'}`);
      }
    }
    const tutorialScale = s.tutorial ? 0.55 : 1;
    p.food = clamp(p.food - (0.65 + Math.min(level, 5) * 0.1) * tutorialScale);
    p.water = clamp(p.water - (0.85 + Math.min(level, 5) * 0.09) * tutorialScale);
    const wellFed = p.food > 8 && p.water > 8, deprived = p.food <= 4 || p.water <= 4;
    p.mood = clamp(p.mood + ((wellFed ? 0.2 : deprived ? -0.7 : -0.25) - (p.away ? 0.15 : 0)) * tutorialScale);
    const rest = (wellFed ? 1.1 : deprived ? 0.35 : 0.8) * (p.health <= 4 ? 0.6 : 1);
    p.stamina = clamp(p.stamina + (p.away ? -(0.3 + Math.max(0, level - 1) * 0.05) : rest));
    let damage = 0;
    if (p.food <= 4) damage += 0.45;
    if (p.water <= 4) damage += 0.7;
    if (p.food <= 0 || p.water <= 0) damage += 1;
    if (p.infection >= 4) damage += 0.15;
    p.health = clamp(p.health - damage);
    if (s.type === 'zombie' && !s.tutorial) {
      if (p.infection > 0 && this._random() < (s.difficulty === 'infected' ? 0.6 : 0.4)) p.infection = clamp(p.infection + 1);
      const infectedOthers = this._home().some(x => x.id !== p.id && x.infection >= 4 && !x.quarantined);
      if (!p.away && !p.quarantined && infectedOthers && this._random() < 0.18) p.infection = clamp(p.infection + 1);
    }
    if (s.type === 'cold' && !s.tutorial) {
      const outsidePack = trip?.pack || {};
      const store = p.away ? outsidePack : s.inventory;
      let insulation = 0;
      for (const [id, qty] of Object.entries(store)) if (qty > 0 && ITEMS[id]?.reusable && (ITEMS[id].effects?.temp || 0) > 0) insulation += Math.min(2, qty) * (ITEMS[id].effects.temp || 0) * 0.5;
      if (!p.away) insulation /= Math.max(1, this._home().length / 2);
      const ice = s.difficulty === 'ice-age';
      if (this._random() < (ice ? (p.away ? 0.9 : 0.7) : (p.away ? 0.65 : 0.4))) p.temp = clamp(p.temp - Math.max(0, (ice ? 3.1 + this._random() * 1.7 : 1.2 + this._random() * 1.3) + (p.away ? 1.3 : 0) - insulation));
      else if (insulation > 0) p.temp = clamp(p.temp + Math.min(1.5, insulation * 0.5));
      if (p.temp <= 4) p.health = clamp(p.health - 0.35);
    }
  }
  nextDay() {
    const s = this.state;
    if (!s || s.phase !== 'shelter') return bad('现在无法过夜。');
    if (s.event || s.expedition?.event) return bad('先处理还没有决定的营地或外出事件，再度过夜晚。');
    this._syncProduction();
    const level = this._difficulty().level, night = s.day;
    const lethal = p => LETHAL.some(k => (k !== 'temp' || s.type === 'cold') && p[k] <= 0);
    // Natural overnight recovery cannot rescue someone left at a lethal threshold at dusk.
    const criticalAtDusk = new Set(this._living().filter(lethal).map(p => p.id));
    for (const p of this._living()) if (!criticalAtDusk.has(p.id)) this._nightPerson(p, level);
    if (this._checkInfection()) return good('尸变终结了这次求生。');
    const dead = [];
    for (const p of this._living()) if (criticalAtDusk.has(p.id) || lethal(p)) {
      p.alive = false; p.present = false; p.away = false;
      p.deathReason = s.type === 'cold' && p.temp <= 0 ? '冻死' : p.water <= 0 ? '脱水' : p.food <= 0 ? '饥荒' : p.stamina <= 0 ? '体力耗尽' : '病痛'; dead.push(p);
    }
    s.day++;
    for (const p of dead) this._log(`天亮后，你们发现${p.name}没有醒来。${p.deathReason}带走了这位家人。`);
    if (s.expedition && !s.family.find(p => p.id === s.expedition.personId)?.alive) { this._log('外出者再也没能按约定回来。'); s.expedition = null; }
    if (!this._living().length) { this._lose('灯火熄灭', '新的一天已经到来，避难所里却再没有回应。'); return good('这次求生已经结束。'); }
    s.completedDays = night;
    if (!s.endless && !s.tutorial && night >= 100) { s.day = night; this._win('地面重逢', '你们撑过了第一百个夜晚。地面的幸存者终于发现这处避难所，将仍然活着的家人接了出去。'); return good('地面的幸存者找到了你们。'); }
    if (s.tutorial && night >= 7) { s.day = 7; s.flags.tutorialComplete = true; this._win('教程完成', '七天的练习结束了。带着学到的经验，准备开始一次属于自己的正式求生。'); return good('七天教程已完成。'); }
    this._returnExpedition();
    if (s.phase !== 'shelter') return good('这次求生已经结束。');
    this._runProduction();
    if (s.tutorial) this._tutorialEvent();
    else if (s.day >= 4 && ['little-boy', 'fat-man'].includes(s.difficulty) && s.family.some(p => p.alive && p.initiallyMissing && p.missing)) s.event = this._special('family-return', '熟悉的敲门声', '门外传来你们绝不会认错的呼唤。没能及时进入避难所的家人，终于找到了这里。', [{ label: '打开舱门，接家人回家', result: '门开了，你们紧紧抱住彼此。' }], { _action: 'family-return' });
    else { s.event = this._scheduledEvent('shelter') || this._ordinaryChainEvent() || this._routeEvent(); if (s.phase === 'shelter' && !s.event && this._random() < 0.83) s.event = this._drawEvent('shelter'); }
    if (s.phase === 'shelter' && s.expedition && !s.expedition.scripted && !s.expedition.event) s.expedition.event = this._scheduledEvent('outside') || this._drawEvent('outside');
    this._log(s.event ? '新的一天，有件事需要你们决定。' : '新的一天开始了。请照顾家人，检查物资。');
    return good('已经迎来新的一天。');
  }
}
