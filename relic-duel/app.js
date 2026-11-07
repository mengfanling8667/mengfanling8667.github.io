import { QUALITIES, CHARACTERS, CHESTS, MAPS } from './data.js';
import { DuelEngine } from './engine.js';
import { ProgressStore } from './progress.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const quality = c => QUALITIES.find(q => q.id === c.quality);
const number = n => new Intl.NumberFormat('zh-CN').format(n);
const store = new ProgressStore();
let page = 'lobby', currentPlayer = 0, filter = 'all', search = '', engine = null;
let nextMap = MAPS[Math.floor(Math.random() * MAPS.length)], selected = [0, 0], ready = [false, false];
let selectionInterval = null, selectionEnd = 0, modalType = null, inGame = false, rewards = null;
let gameMode = 'progress', creativeMap = 'random', progressSelections = [0,0], progressOpponent = 'human', selectionOrientationPause = null, orientationPausedGame = false;
let modalGeneration = 0, importReadToken = 0, roundGeneration = 0, resultTimer = null, externalProgressPending = false;
let sound = false, opponentMode = 'human', openingTimer = null, openingComplete = true;
try { sound = localStorage.getItem('relic-duel-sound') === 'true'; opponentMode = localStorage.getItem('relic-duel-opponent') === 'computer' ? 'computer' : 'human'; } catch {}
progressOpponent=opponentMode;
const app = $('#app'), modalRoot = $('#modal-root');
const isCreative = () => gameMode === 'creative';

const paths = {
  cpu: '<rect x="5" y="7" width="22" height="21" rx="6"/><path d="M16 3v4M1 14h4m22 0h4M11 21h10"/><circle cx="11" cy="15" r="1.5"/><circle cx="21" cy="15" r="1.5"/>',
  chest: '<path d="M4 11h24v17H4zM7 4h18l3 7H4zM4 17h24M13 10h6v10h-6z"/>',
  swords:'<path d="m5 4 13 13-4 4L2 7V2h5l12 12M27 4 14 17l4 4L30 7V2h-5L13 14M10 20l-5 5m-3-3 6 6M22 20l5 5m3-3-6 6"/>',
  grid:'<rect x="4" y="4" width="9" height="9" rx="2"/><rect x="19" y="4" width="9" height="9" rx="2"/><rect x="4" y="19" width="9" height="9" rx="2"/><rect x="19" y="19" width="9" height="9" rx="2"/>',
  map:'<path d="m3 7 8-3 10 4 8-3v21l-8 3-10-4-8 3zM11 4v21m10-17v21"/>',
  book:'<path d="M16 8C10 3 5 4 2 5v22c6-2 10-1 14 2 4-3 8-4 14-2V5c-3-1-8-2-14 3zm0 0v21"/>',
  arrow:'<path d="M5 16h21m-8-8 8 8-8 8"/>',
  chevron:'<path d="m12 7 9 9-9 9"/>',
  shuffle:'<path d="M3 8h5c8 0 8 16 16 16h5m-5-5 5 5-5 5M3 24h5c8 0 8-16 16-16h5m-5-5 5 5-5 5"/>',
  clock:'<circle cx="16" cy="16" r="12"/><path d="M16 9v8l5 3"/>',
  users:'<circle cx="12" cy="11" r="5"/><path d="M3 27v-3a9 9 0 0 1 18 0v3M23 6a5 5 0 0 1 0 10m2 5a7 7 0 0 1 4 6"/>',
  star:'<path d="m16 3 4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z"/>',
  spark:'<path d="m17 3 3 9 9 3-9 3-3 10-3-10-9-3 9-3zM5 3v6M2 6h6"/>',
  sound:'<path d="m4 12 7 0 9-8v24l-9-8H4zM24 10a9 9 0 0 1 0 12m3-16a15 15 0 0 1 0 20"/>',
  mute:'<path d="m4 12 7 0 9-8v24l-9-8H4zM25 12l6 8m0-8-6 8"/>',
  expand:'<path d="M4 12V4h8m8 0h8v8m0 8v8h-8m-8 0H4v-8"/>',
  settings:'<path d="m13 3 6 0 1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2z" transform="translate(0 -2) scale(.95)"/><circle cx="15.5" cy="15" r="5"/>',
  help:'<circle cx="16" cy="16" r="13"/><path d="M12 12a4 4 0 1 1 5 4c-1 1-1 2-1 3m0 4v1"/>',
  close:'<path d="m7 7 18 18M25 7 7 25"/>',
  lock:'<rect x="6" y="14" width="20" height="15" rx="3"/><path d="M10 14V9a6 6 0 0 1 12 0v5m-6 6v4"/>',
  check:'<path d="m6 16 7 7L27 8"/>',
  trophy:'<path d="M9 4h14v9c0 6-14 6-14 0zM9 7H3v5c0 5 6 7 9 7m11-12h6v5c0 5-6 7-9 7m-4 0v8m-6 2h12"/>',
  download:'<path d="M16 3v17m-7-7 7 7 7-7M5 22v7h22v-7"/>',
  upload:'<path d="M16 21V4m-7 7 7-7 7 7M5 22v7h22v-7"/>',
  pause:'<path d="M10 5v22M22 5v22"/>',
  leaf:'<path d="M28 4C8 0-1 17 11 24 23 31 30 17 28 4ZM5 29 22 11"/>',
};
function icon(name, size = 20) { return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`; }
const key = s => `<kbd class="key">${s}</kbd>`;
const coin = n => `<span class="coins"><i class="coin-icon"></i>${number(n)}</span>`;
function portrait(c, cls = '', player = 0) { return `<canvas class="${cls}" data-character="${c.id}" data-player="${player}" aria-label="${c.name}"></canvas>`; }
function chestArt(id) {
  const palettes = {common:['#986242','#c0905e','#e7bc7e','#4c382b'],rare:['#596b72','#859aa4','#d4e0dc','#30434b'],large:['#6c6654','#a49b73','#ddca8b','#383e35'],diamond:['#3c8291','#74c3d5','#d0f8ec','#264e61']};
  const [base,top,edge,dark] = palettes[id];
  const diamond = id === 'diamond', large = id === 'large';
  return `<svg viewBox="0 0 180 145" fill="none" aria-hidden="true"><ellipse cx="90" cy="129" rx="62" ry="9" fill="#000" opacity=".2"/>${diamond?'<path d="m31 25 3 9 8 3-8 3-3 9-3-9-8-3 8-3zM147 13l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM154 59l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#b0e9e3" opacity=".8"/>':''}<path d="m30 69 61 17 60-18-2 48-59 18-58-17z" fill="${base}"/><path d="m91 86 60-18-2 48-59 18z" fill="${dark}"/><path d="M30 69 39 41 91 26l51 14 9 28-60 18z" fill="${top}"/><path d="m39 41 52 15 51-16-51-14z" fill="${edge}" opacity=".7"/><path d="m91 56 51-16 9 28-60 18z" fill="${base}"/><path d="m30 69 61 17 60-18M91 86v48" stroke="${dark}" stroke-width="3"/><path d="m49 38 0 36 0 48m77-86v39l-1 48" stroke="${edge}" stroke-width="9"/><path d="m52 37 0 37 0 47m70-83v38l-1 49" stroke="${dark}" stroke-width="1.5" opacity=".4"/><path d="m30 82 61 18 60-18" stroke="${edge}" stroke-width="5"/><path d="m79 78 24 1v25l-12 9-12-8z" fill="${dark}" stroke="${edge}" stroke-width="3"/>${diamond?`<path d="m91 84 8 7-8 12-8-12z" fill="#c0fcf1"/><path d="m91 84 0 19 8-12z" fill="#6bd1dd"/>`:`<circle cx="91" cy="92" r="4" fill="${edge}"/><path d="M91 94v6" stroke="${edge}" stroke-width="3"/>`}<path d="m36 64 7-19 43-13" stroke="#fff" stroke-opacity=".15" stroke-width="2" stroke-linecap="round"/>${large?`<path d="m63 47 28 8 27-8m-27 8v22" stroke="${edge}" stroke-width="5"/><path d="m37 106 9 3m87-3 9-3" stroke="${edge}" stroke-width="3"/>`:''}<circle cx="41" cy="90" r="2" fill="${edge}"/><circle cx="141" cy="89" r="2" fill="${edge}"/></svg>`;
}

function renderShell() {
  document.body.classList.toggle('in-game', inGame);
  app.innerHTML = `<div class="app-shell"><aside class="sidebar"><a class="brand" href="#" aria-label="箱遇首页"><div class="brand-mark">${icon('chest',28)}</div><div><div class="brand-name">箱遇</div><small>RELIC DUEL</small></div></a><div class="nav-label">你的冒险 / PLAY</div><nav class="nav" aria-label="主要导航">${[['lobby','swords','对决大厅'],['collection','grid','角色图鉴'],['chests','chest','宝箱工坊'],['maps','map','地图巡览']].map(([p,i,n])=>`<button data-page="${p}" class="${page===p?'active':''}" ${inGame?'disabled':''}>${icon(i,22)}<span>${n}</span></button>`).join('')}</nav><div class="sidebar-bottom"><div class="season-card"><div class="eyebrow">COLLECT · BATTLE · REPEAT</div><h3>慢慢收集，<br>每一场都有新期待。</h3><p>从一把剑开始，<br>遇见你的下一位英雄。</p></div><button data-action="help">${icon('book',20)}<span>新手指南</span></button><button data-action="settings">${icon('settings',20)}<span>游戏与存档</span></button><div class="sidebar-footer"><i class="status-dot"></i>双人 / 人机 · v1.2.1</div></div></aside><main class="workspace"><header class="topbar"><div class="breadcrumb">游戏空间 ${icon('chevron',12)} <b>${inGame?'正在对决':({lobby:'对决大厅',collection:'角色图鉴',chests:'宝箱工坊',maps:'地图巡览'}[page])}</b></div><div class="top-actions"><span class="save-indicator"><i class="status-dot"></i>${isCreative()?'创意模式 · 不存档':(store.lastError||store.recoveryWarning)?'存档状态请查看提示':store.storageAvailable?'进度已在本机保存':'本次会话存档'}</span><button class="icon-btn" data-action="sound" aria-label="${sound?'关闭':'开启'}音效" title="${sound?'关闭':'开启'}音效">${icon(sound?'sound':'mute',17)}</button><button class="icon-btn" data-action="redeem" aria-label="兑换码" title="兑换码">${icon('spark',17)}</button><button class="icon-btn" data-action="fullscreen" aria-label="全屏游戏" title="全屏游戏">${icon('expand',16)}</button><button class="icon-btn" data-action="help" aria-label="操作指南">${icon('help',18)}</button><div class="avatar">P1·P2</div></div></header><div id="content"></div></main></div><div id="landscape-notice" class="landscape-notice hidden" role="status"><svg width="70" height="70" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="3"><rect x="20" y="10" width="40" height="60" rx="7" transform="rotate(90 40 40)"/><path d="M9 25a33 33 0 0 1 57-8m-1-10 2 12-12-1"/></svg><h2>横过来，一起开打。</h2><p>准备区与战场采用横屏左右布局。<br>请旋转设备，或加宽游戏窗口。<br>当前计时已暂停，角色选择与进度会保留。</p></div>`;
  $('.brand').onclick = e => {e.preventDefault(); if(!inGame) navigate('lobby');};
  $$('[data-page]').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
  bindActions(app);
}
function navigate(p) { if(inGame||(modalType==='opening'&&!openingComplete))return; if(closeModal()===false)return;page=p;render(); }
function stopEngine() { if(engine) {engine.destroy(); engine=null;} }
function render() {
  externalProgressPending=false;reconcileSelections();stopEngine();renderShell();
  const content=$('#content');
  const storageIssue=store.lastError||store.recoveryWarning;
  if(storageIssue||!store.storageAvailable){const banner=document.createElement('div');banner.className='storage-warning';banner.textContent=storageIssue||'浏览器未能保存进度，请及时导出备份。';content.appendChild(banner);}
  if(inGame) renderGame(content);
  else if(page==='lobby') renderLobby(content);
  else if(page==='collection') renderCollection(content);
  else if(page==='chests') renderChests(content);
  else renderMaps(content);
  paintPortraits(); bindActions(content); checkLandscape(); window.scrollTo({top:0,behavior:'instant'});
}
function heading(kicker,title,subtitle,aside='') { return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p class="subtext">${subtitle}</p></div>${aside}</div>`; }
function profile(index) { return index === 2 ? store.data.computer : store.data.players[index]; }
function profileName(index) { return ['玩家一','玩家二','电脑'][index]; }
function isComputerSlot(i) { return i === 1 && opponentMode === 'computer'; }
function duelProfile(i) { return profile(isComputerSlot(i) ? 2 : i); }
function duelLabel(i) { return isComputerSlot(i) ? '电脑 · CPU' : `PLAYER 0${i+1}`; }
function playerSwitch(){return `<div class="player-switch" aria-label="切换收藏"><button data-player-switch="0" class="${currentPlayer===0?'active':''}">玩家一 · P1</button><button data-player-switch="1" class="p2 ${currentPlayer===1?'active':''}">玩家二 · P2</button><button data-player-switch="2" class="cpu-tab ${currentPlayer===2?'active':''}">${icon('cpu',13)} 电脑</button></div>`;}
function availableCharacters(i){
  const ids=isCreative()?CHARACTERS.map(c=>c.id):duelProfile(i).owned;
  return [...ids].sort((a,b)=>CHARACTERS[a].tier-CHARACTERS[b].tier||a-b);
}
function chooseCreativeComputer(){
  let roll=Math.random()*CHARACTERS.reduce((sum,c)=>sum+20**c.tier,0);
  return (CHARACTERS.find(c=>(roll-=20**c.tier)<0)||CHARACTERS.at(-1)).id;
}
function setGameMode(mode){
  if(inGame||selectionInterval||modalType==='opening'||!['progress','creative'].includes(mode)||mode===gameMode)return;
  closeModal();
  if(mode==='creative'){progressSelections=[...selected];progressOpponent=opponentMode;}
  gameMode=mode;
  if(!isCreative()){
    opponentMode=progressOpponent;
    selected=progressSelections.map((id,i)=>duelProfile(i).owned.includes(id)?id:0);
  }
  nextMap=plannedMap();render();
}
function setOpponent(mode) {
  if(inGame || selectionInterval || (mode !== 'human' && mode !== 'computer')) return;
  opponentMode=mode; selected[1]=0;
  if(!isCreative()){
    progressOpponent=mode;
    try{localStorage.setItem('relic-duel-opponent',mode);}catch{}
  }
  render();
}
function plannedMap(){return isCreative()&&creativeMap!=='random'?(MAPS.find(m=>m.id===creativeMap)||randomMap()):randomMap();}
function setCreativeMap(id){
  if(!isCreative()||inGame||selectionInterval||!['random',...MAPS.map(m=>m.id)].includes(id))return;
  creativeMap=id;nextMap=plannedMap();render();
}
function portraitBlocked(){return (window.innerWidth||1100)<(window.innerHeight||700)&&(window.innerWidth||1100)<=900;}
function checkLandscape(){
  const blocked=portraitBlocked()&&(inGame||modalType==='selection');
  $('#landscape-notice')?.classList.toggle('hidden',!blocked);
  document.body.classList.toggle('landscape-locked',blocked);
  if(modalType==='selection'){
    const pauseSelection=blocked||document.hidden;
    if(pauseSelection&&selectionOrientationPause===null)selectionOrientationPause=Date.now();
    if(!pauseSelection&&selectionOrientationPause!==null){selectionEnd+=Date.now()-selectionOrientationPause;selectionOrientationPause=null;}
  }else selectionOrientationPause=null;
  if(inGame&&engine&&engine.mode==='playing'){
    if(blocked&&!engine.paused){orientationPausedGame=true;engine.pause();}
    else if(!blocked&&orientationPausedGame&&!document.hidden){orientationPausedGame=false;engine.resume();}
  }else if(!inGame)orientationPausedGame=false;
}
function bindPlayerSwitch(){ $$('[data-player-switch]').forEach(b=>b.onclick=()=>{currentPlayer=+b.dataset.playerSwitch;render();}); }
function chestCards(shop=false){return CHESTS.map(ch=>`<article class="chest-card ${ch.id==='diamond'?'diamond-card':''}" style="--glow:${ch.color}30"><span class="mini-badge">${ch.id==='rare'?'黄色起步':ch.id==='diamond'?'绿色起步':ch.id==='large'?'一次三位':'从这里开始'}</span><div class="chest-art">${chestArt(ch.id)}</div><h3>${ch.name}</h3><p>${ch.id==='common'?'一份小小期待，什么都有可能。':ch.id==='rare'?'保底黄色品质，偶尔遇见惊喜。':ch.id==='large'?'一次获得 3 个角色，普通宝箱概率。':'保底绿色品质，神话概率 0.1%。'}</p><div class="chest-footer">${coin(ch.price)}<button class="small-open" data-${shop?'open-chest':'go-chest'}="${ch.id}">${shop?'开启宝箱':'去看看'} ${icon('arrow',12)}</button></div></article>`).join('');}
function renderLobby(content){
  content.insertAdjacentHTML('beforeend',heading('A LITTLE DUEL, A LONG ADVENTURE','小小英雄，大大对决。','和朋友并肩，或向电脑发起挑战。把平凡的一局玩出惊喜。',`<span class="tag"><i class="status-dot"></i>${opponentMode==='computer'?'人机对决 · 电脑会成长':'双人同屏 · 键盘对战'}</span>`)+`<div class="play-mode-bar"><div class="play-mode-switch" aria-label="游戏模式"><button data-game-mode="progress" class="${!isCreative()?'active':''}">${icon('chest',16)}普通模式<span>收集 · 自动存档</span></button><button data-game-mode="creative" class="${isCreative()?'active':''}">${icon('spark',16)}创意模式<span>全角色 · 自选地图 · 不存档</span></button></div></div>${isCreative()?`<div class="creative-banner"><div><b>${icon('spark',18)}自由试招，尽管放开手脚。</b><p>全部 ${CHARACTERS.length} 位角色可选，双人和人机均可用。本模式不记录战绩、不结算金币、不触发电脑开箱。</p></div><label class="creative-map-picker">本轮地图<select id="creative-map" aria-label="创意模式地图"><option value="random" ${creativeMap==='random'?'selected':''}>随机地图</option>${MAPS.map(m=>`<option value="${m.id}" ${creativeMap===m.id?'selected':''}>${m.name}</option>`).join('')}</select></label></div>`:''}<div class="opponent-bar"><div class="opponent-switch" aria-label="选择对手"><button data-opponent="human" class="${opponentMode==='human'?'active':''}">${icon('users',18)}和朋友对战</button><button data-opponent="computer" class="${opponentMode==='computer'?'active':''}">${icon('cpu',18)}挑战电脑</button></div><p>${opponentMode==='computer'?'电脑独立攒币开箱 · 选人偏向高品质':'一块键盘，两个玩家 · 双方各自收集角色'}</p></div><div class="mobile-notice">本游戏使用实体键盘操作；横屏或电脑体验更好。</div><div class="lobby-grid"><section class="arena-card"><div class="arena-heading"><div class="eyebrow">YOUR NEXT LITTLE ADVENTURE</div><h2>下一场，会遇见谁？</h2><p>从一把剑开始，下一位传奇由你开启。</p></div><canvas id="lobby-canvas" class="arena-visual" aria-label="双人对战地图预览"></canvas><div class="arena-meta"><span class="map-chip">${icon('map',14)}<span id="next-map-name">${nextMap.name}</span><span style="opacity:.45">/ ${isCreative()&&creativeMap!=='random'?'指定地图':'随机战场'}</span></span><button class="map-shuffle" data-action="shuffle" aria-label="更换随机地图" title="更换随机地图">${icon('shuffle',16)}</button></div></section><section class="match-card"><h2 class="section-title">准备好，来一局 <span>${opponentMode==='computer'?'VS COMPUTER':'LOCAL 2P'}</span></h2><div class="duel-players">${[0,1].map(i=>`<div class="duel-player p${i+1}"><div class="portrait-frame">${portrait(CHARACTERS[selected[i]],'',i)}</div><span class="player-tag">${duelLabel(i)}</span><h3>${CHARACTERS[selected[i]].name}</h3></div>`).join('')}<span class="versus">VS</span></div><div class="coins-line"><span>P1 ${coin(store.data.players[0].coins)}</span><span>${opponentMode==='computer'?'CPU':'P2'} ${coin(duelProfile(1).coins)}</span></div><button class="primary-btn" data-action="select">开始对决 ${icon('arrow',18)}</button><p class="match-note">20 秒选择英雄 · 单局 90 秒<br>${isCreative()?'创意试战 · 不发金币 / 不存档':'胜者 +60 金币 / 败者 +20 金币'}</p></section></div><div class="stats-strip">${[['users',CHARACTERS.length,'位','等你解锁的角色'],['spark','7','种','逐阶变强的品质'],['map','10','张','各有优势的地图'],['trophy',store.data.matches,'场','已经完成的对决']].map(([i,n,u,l])=>`<div class="stat">${icon(i,25)}<div><div class="stat-value">${n}<small>${u}</small></div><p class="stat-label">${l}</p></div></div>`).join('')}</div><section><div class="section-heading"><div><h2>把下一份惊喜，藏进宝箱</h2><p class="subtext">赢下对决，攒点金币。每一次开启，都是新的相遇。</p></div><button class="ghost-btn" data-action="odds">查看掉落概率 ${icon('arrow',14)}</button></div><div class="chest-grid">${chestCards()}</div></section><div class="quick-guide"><div class="guide-title">${icon('book',21)}一块键盘，两位对手。</div><div class="keys-row"><span style="color:var(--mint)">P1</span>${key('A')}${key('D')}移动 ${key('W')}跳跃 ${key('S')}攻击</div><div class="keys-row"><span style="color:var(--orange)">P2</span>${key('←')}${key('→')}移动 ${key('↑')}跳跃 ${key('↓')}攻击</div><button class="ghost-btn" data-action="help">操作指南 ${icon('arrow',14)}</button></div><div class="footer-line"><span>胜负只是一局，收藏才是长久的冒险。</span><span>自动存档 · 无需注册游戏账号</span></div>`);
  engine=new DuelEngine($('#lobby-canvas'),{onEnd:()=>{},onUpdate:()=>{}});engine.renderPreview(nextMap,selected.map(id=>CHARACTERS[id]));
  $$('[data-go-chest]').forEach(b=>b.onclick=()=>navigate('chests'));
  $$('[data-opponent]').forEach(b=>b.onclick=()=>setOpponent(b.dataset.opponent));
  $$('[data-game-mode]').forEach(b=>b.onclick=()=>setGameMode(b.dataset.gameMode));
  if($('#creative-map'))$('#creative-map').onchange=e=>setCreativeMap(e.target.value);
}
function renderCollection(content){
  const player=profile(currentPlayer);
  content.insertAdjacentHTML('beforeend',heading('THE HERO ARCHIVE','每一位，都值得相遇。',`${CHARACTERS.length} 位角色，7 种品质。从最初的剑士，到宝箱里的红色神话。`,playerSwitch())+`<div class="toolbar"><div class="filter-row"><button class="filter-btn ${filter==='all'?'active':''}" data-filter="all">全部角色</button><button class="filter-btn ${filter==='owned'?'active':''}" data-filter="owned">已解锁</button>${QUALITIES.map(q=>`<button class="filter-btn ${filter===q.id?'active':''}" data-filter="${q.id}" style="${filter===q.id?`color:${q.color};border-color:${q.color}`:''}">${q.name}</button>`).join('')}</div><div class="collection-progress">已收集 ${player.owned.length} / ${CHARACTERS.length} <span class="progress-track"><i style="width:${player.owned.length/CHARACTERS.length*100}%"></i></span></div></div><div class="toolbar"><p class="subtext">${profileName(currentPlayer)}的收藏 · 点击角色查看专属招式与属性</p><input id="character-search" class="search-input" type="search" placeholder="寻找一位角色…" aria-label="搜索角色" value="${search.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')}"></div><div id="character-grid" class="collection-grid"></div>`);
  bindPlayerSwitch();$$('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render();});
  $('#character-search').oninput=e=>{search=e.target.value;renderCharacterGrid();};renderCharacterGrid();
}
function renderCharacterGrid(){
  const player=profile(currentPlayer);
  const chars=CHARACTERS.filter(c=>(filter==='all'||filter==='owned'&&player.owned.includes(c.id)||c.quality===filter)&&c.name.includes(search.trim()));
  $('#character-grid').innerHTML=chars.length?chars.map(c=>{const owned=player.owned.includes(c.id),q=quality(c);return `<button class="character-card ${owned?'':'locked'}" data-detail="${c.id}" style="--quality-color:${q.color}" aria-label="${c.name}，${q.name}，${owned?'已解锁':'未解锁'}"><div class="character-art">${portrait(c,'',currentPlayer)}</div>${owned?'<span class="owned-badge">已解锁</span>':`<span class="lock-badge">${icon('lock',12)}</span>`}<h3>${c.name}</h3><div class="quality-text"><span>${q.name} · ${q.label}</span><span>${String(c.id+1).padStart(2,'0')}</span></div></button>`;}).join(''):'<div class="empty">还没有找到这样的角色。试试其他名字或品质。</div>';
  $$('[data-detail]').forEach(b=>b.onclick=()=>showDetail(+b.dataset.detail));paintPortraits($('#character-grid'));
}
function renderChests(content){
  const p=profile(currentPlayer);
  content.insertAdjacentHTML('beforeend',heading('A BOX FULL OF POSSIBILITIES','下一位英雄，在箱子里。','用每一场积攒的金币，换一次小小的期待。',playerSwitch())+`<div class="wallet-bar"><div><div class="wallet-label">${profileName(currentPlayer)}的金币</div>${coin(p.coins)}</div><div class="collection-progress">${icon('grid',18)}已解锁 ${p.owned.length} / ${CHARACTERS.length} 位角色</div><button class="ghost-btn" data-action="odds">完整掉落概率 ${icon('arrow',14)}</button></div>${currentPlayer===2?`<div class="cpu-shop-status">${icon('cpu',44)}<div><h2>它也在慢慢积攒下一份期待。</h2><p>电脑在人机对战结算后，金币足够时自动开启计划中的宝箱。相同价格、相同概率，直接更新收藏，不播放动画。</p><div class="cpu-target">下一个目标：<b>${CHESTS.find(c=>c.id===p.targetChest)?.name||'普通宝箱'}</b> · 已攒 ${number(p.coins)} / ${CHESTS.find(c=>c.id===p.targetChest)?.price||100} 金币</div><button class="secondary-btn" data-action="cpu-collection">查看电脑收藏 ${icon('arrow',14)}</button></div></div>`:`<div class="chest-grid shop-chests">${chestCards(true)}</div>`}<div class="economy-note">${icon('leaf',26)}<p><b>一场小对决，一点新积累。</b><br>胜者获得 60 金币，败者获得 20 金币，平局各得 30。普通宝箱 100 金币，赢两局就能开启。<br>重复角色按品质返还 5 / 8 / 12 / 20 / 35 / 60 / 100 金币。每次抽取独立随机，没有累计保底。玩家一、玩家二和电脑各自拥有独立的金币与收藏。</p></div><div class="footer-line"><span>慢慢玩，慢慢收集。所有宝箱仅使用游戏内金币。</span><span>开箱与动画不占选人和对战时间</span></div>`);
  bindPlayerSwitch();$$('[data-open-chest]').forEach(b=>b.onclick=()=>openChest(b.dataset.openChest));
}
function renderMaps(content){
  content.insertAdjacentHTML('beforeend',heading('TEN PLACES TO SETTLE A DUEL','换个地方，再来一局。','每轮随机进入一张地图。学会利用地形，小小的差距也可能改变战局。',`<span class="tag">${icon('shuffle',14)}每轮随机 · 10 张地图</span>`)+`<div class="maps-grid">${MAPS.map((m,i)=>`<article class="map-card"><canvas data-map="${i}" aria-label="${m.name}地形图"></canvas><div class="map-description"><div><h3>${m.name}</h3><p>${m.subtitle}</p></div><span class="map-no">${String(i+1).padStart(2,'0')}</span></div></article>`).join('')}</div><div class="economy-note">${icon('spark',24)}<p><b>地形也是战术。</b><br>障碍密集时，练习生的穿透篮球可以反弹回来；狭窄的走廊里，枪手的直线火力更难躲开。利用跳跃和高低差，找到属于你的出手机会。</p></div>`);
  $$('[data-map]').forEach(canvas=>paintMap(canvas,MAPS[+canvas.dataset.map]));
}
function paintPortraits(root=document){
  $$('canvas[data-character]',root).forEach(canvas=>{const c=CHARACTERS[+canvas.dataset.character],rect=canvas.getBoundingClientRect(),w=rect.width||150,h=rect.height||100;canvas.width=w*2;canvas.height=h*2;const ctx=canvas.getContext('2d');ctx.scale(2,2);DuelEngine.drawPortrait(ctx,c,w/2,h-7,Math.min(h*.9,w*.85),+canvas.dataset.player||0);});
}
function paintMap(canvas,m){
  const W=660,H=245;canvas.width=W*2;canvas.height=H*2;const ctx=canvas.getContext('2d');ctx.scale(2,2);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,m.bg[0]);g.addColorStop(1,m.bg[1]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle=m.accent+'0f';for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(i*110-60,H);ctx.lineTo(i*110+20,45+(i%3)*30);ctx.lineTo(i*110+115,H);ctx.fill();}ctx.fillStyle=m.accent+'44';ctx.beginPath();ctx.arc(540,48,25,0,Math.PI*2);ctx.fill();const sx=W/1100,sy=H/530;ctx.fillStyle='#111f20';ctx.fillRect(0,470*sy,W,H-470*sy);ctx.fillStyle=m.accent;ctx.fillRect(0,470*sy,W,3);for(const p of m.platforms){ctx.fillStyle='#2f4541';ctx.fillRect(p.x*sx,p.y*sy,p.w*sx,p.h*sy);ctx.fillStyle=m.accent;ctx.fillRect(p.x*sx,p.y*sy,p.w*sx,3);}for(const x of [140,960]){ctx.fillStyle='#f5edd0';ctx.beginPath();ctx.arc(x*sx,443*sy,5,0,Math.PI*2);ctx.fill();ctx.fillStyle=x===140?'#8cdbba':'#e4ad7b';ctx.fillRect(x*sx-5,449*sy,10,19*sy);}ctx.font='9px sans-serif';ctx.fillStyle='#ffffff40';ctx.fillText('RELIC DUEL / ARENA',18,25);
}

function clearResultTimer(){if(resultTimer!==null){clearTimeout(resultTimer);resultTimer=null;}}
function reconcileSelections(){
  if(!isCreative())for(let i=0;i<2;i++)if(!duelProfile(i).owned.includes(selected[i]))selected[i]=0;
}
function refreshExternalProgress(){
  if(!externalProgressPending||inGame||modalType||selectionInterval)return;
  render();toast('已同步其他游戏标签页的最新进度。');
}
function showModal(html,type='',wide=false){
  if(modalType==='selection'&&type!=='selection'&&selectionInterval){clearInterval(selectionInterval);selectionInterval=null;selectionOrientationPause=null;}
  modalGeneration++;modalType=type;
  modalRoot.innerHTML=`<div class="modal-backdrop"><section class="modal ${wide?'wide':''} ${type==='result'?'result-modal':''} ${type==='opening'?'opening-modal':''} ${type==='reveal'?'reveal-modal':''}" role="dialog" aria-modal="true" aria-label="${{redeem:'兑换码',opening:'宝箱开启动画',chestConfirm:'确认开启宝箱',help:'操作指南',odds:'掉落概率',settings:'游戏与存档',selection:'选择角色',result:'对决结果',reveal:'宝箱奖励',detail:'角色详情'}[type]||'游戏提示'}"><button class="icon-btn modal-close" data-action="close" aria-label="关闭">${icon('close',17)}</button>${html}</section></div>`;
  bindActions(modalRoot);paintPortraits(modalRoot);$('.modal-close')?.focus({preventScroll:true});checkLandscape();
}
function closeModal(){
  if(modalType==='opening'&&!openingComplete)return false;
  modalGeneration++;importReadToken++;
  if(openingTimer){clearTimeout(openingTimer);openingTimer=null;}
  if(selectionInterval){clearInterval(selectionInterval);selectionInterval=null;}
  selectionOrientationPause=null;
  if(modalType==='result'){clearResultTimer();roundGeneration++;inGame=false;nextMap=plannedMap();page='lobby';modalType=null;modalRoot.innerHTML='';render();return true;}
  modalType=null;modalRoot.innerHTML='';checkLandscape();refreshExternalProgress();return true;
}
function showHelp(){showModal(`<div class="eyebrow" style="margin-bottom:10px">ONE KEYBOARD, TWO HEROES</div><h2>来，先记住这几个键。</h2><p class="intro">在大厅选择“和朋友对战”或“挑战电脑”。人机模式中电脑拥有独立收藏，会自动开箱，并优先选择更高品质的角色。率先击倒对手获胜；90 秒结束时比较剩余生命比例，相同则平局。</p><div class="help-cols">${[0,1].map(i=>`<div class="help-card ${i?'p2':''}"><h3>PLAYER 0${i+1} · 玩家${i?'二':'一'}</h3><p>${key(i?'←':'A')}${key(i?'→':'D')} 左右移动</p><p>${key(i?'↑':'W')} 跳跃（不改变朝向）</p><p>${key(i?'↓':'S')} 普通攻击</p><p>${key(i?'↓':'S')} + ${key(i?'↑':'W')} 大招向上</p><p>${key(i?'↓':'S')} + ${key(i?'←':'A')}/${key(i?'→':'D')} 左 / 右大招</p><p>${key(i?'↓':'S')} + ${key(i?'←':'A')} + ${key(i?'→':'D')} 原地大招</p></div>`).join('')}</div><div class="help-note">最后按下的左右方向决定普通攻击朝向，跳跃和攻击不会改变朝向。大招冷却按伤害、范围、穿透和反弹强度分别计算，越强通常越久；冷却中按攻击组合会释放普攻。<br>移动中释放大招：先按住方向，再按攻击即可。想在落地时向前普通攻击，可先松开方向再按攻击。<br>准备阶段：1P 用 A / D 切换、S 准备；2P 用 ← / → 切换、↓ 准备。角色之间会实体碰撞，可以站到对方头上。<br>创意模式支持全部角色与自选 / 随机地图，不保存对战进度；普通双人与人机都会自动保存。<br>每个角色有自己的普攻与大招；品质越高，生命与伤害越强。同品质之间保留小幅差异。<br>${key('Esc')} 暂停 / 继续。切走页面会自动暂停。建议使用支持多键同时按下的键盘。</div><div class="modal-actions"><button class="primary-btn" data-action="close">记住了，准备开打 ${icon('arrow',16)}</button></div>`,'help',true);}
function showOdds(){showModal(`<div class="eyebrow" style="margin-bottom:10px">A LITTLE LUCK TAKES TIME</div><h2>每份期待，都明明白白。</h2><p class="intro">以下为每次抽取的品质概率。品质确定后，在该品质角色中等概率抽取；大宝箱独立抽取 3 次，与普通宝箱同概率。</p><div class="table-scroll"><table class="odds-table"><thead><tr><th>角色品质</th>${CHESTS.map(c=>`<th>${c.name}</th>`).join('')}</tr></thead><tbody>${QUALITIES.map((q,i)=>`<tr><td style="color:${q.color}">● ${q.name} · ${q.label}</td>${CHESTS.map(c=>`<td>${(c.weights[i]/1000).toLocaleString('en-US',{maximumFractionDigits:3})}%</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="help-note">稀有宝箱不会获得白色角色；钻石宝箱不会获得白色和黄色角色。每次抽取独立，没有累计次数保底。<br>钻石宝箱红色概率为 0.1%（单次约千分之一），抽取次数不保证一定出现。收集全部角色是一段长期旅程。</div><div class="modal-actions"><button class="secondary-btn" data-action="close">了解了</button></div>`,'odds',true);}
function showDetail(id){
  const c=CHARACTERS[id],q=quality(c),owned=profile(currentPlayer).owned.includes(id);
  const ultText={dash:'沿指定方向突进，沿途造成强力伤害。原地释放时爆发近身斩击。',burst:'向指定方向释放扇形弹幕。原地释放时向四周散射。',volley:'向指定方向连续发射多枚投射物，原地释放时向四周发射。',nova:'在指定方向引爆范围冲击；原地释放时以自身为中心震荡。',beam:'向指定方向发射高伤害贯穿射线。原地释放时横扫两侧。',rain:'朝指定方向降下密集弹雨。原地释放时覆盖自身周围。'};
  showModal(`<div class="detail-grid"><div class="detail-art" style="--glow:${q.color}20">${portrait(c,'',currentPlayer)}</div><div><div class="eyebrow" style="color:${q.color};margin-bottom:10px">${q.name} / ${q.label} · NO.${String(id+1).padStart(2,'0')}</div><h2>${c.name}</h2><p class="intro" style="margin-bottom:12px">${c.description}</p><div class="detail-stats"><div class="detail-stat"><span>生命值</span><b>${c.hp}</b></div><div class="detail-stat"><span>普攻伤害</span><b>${c.damage}</b></div><div class="detail-stat"><span>大招冷却</span><b>${c.ultCooldown}s</b></div></div><div class="skill"><h3>普攻 · ${c.basicName}</h3><p>${c.projectile?'向面朝方向发射投射物':'向面朝方向发起近战攻击'} · 间隔 ${c.attackCooldown}s${c.bounce?' · 可反弹 '+c.bounce+' 次':''}${c.pierce?' · 穿透目标':''}</p></div><div class="skill"><h3>大招 · ${c.ultName}</h3><p>${ultText[c.ultType]||'释放专属强力攻击。'}<br>强度：${c.ultPowerLabel||'标准'} · 冷却 ${c.ultCooldown}s（依据威力与覆盖范围平衡）</p></div><p class="subtext" style="margin-top:12px">${owned?(currentPlayer===2?'已加入电脑收藏，它会按品质权重自动选用。':'已加入你的收藏，可在选人阶段使用。'):'尚未解锁。在宝箱工坊中期待与他相遇。'}</p></div></div><div class="modal-actions"><button class="secondary-btn" data-action="close">返回图鉴</button></div>`,'detail');
}
function showSettings(){showModal(`<div class="eyebrow" style="margin-bottom:10px">MAKE YOURSELF AT HOME</div><h2>游戏与存档</h2>${isCreative()?'<div class="creative-settings-note">当前为创意模式，普通模式存档保持原样。兑换、导入、重置请先返回普通模式。</div>':''}<p class="intro">两位玩家及电脑的金币和角色分别保存在当前浏览器。换设备或清理浏览器前，记得导出存档。</p><div class="setting-row"><div><b>战斗音效</b><p>轻量合成音效，无背景音乐。</p></div><button class="secondary-btn" data-action="setting-sound">${sound?'已开启':'已关闭'}</button></div><div class="setting-row"><div><b>本地存储</b><p>${store.storageAvailable?'正常 · 每次结算和开箱后自动保存':'无法持久保存 · 请及时导出本次进度'}</p></div><span class="tag">${store.data.matches} 场对决</span></div><div class="settings-buttons"><button class="secondary-btn" data-action="redeem">${icon('spark',18)}兑换码 · 分别兑换 P1 / P2</button><button class="secondary-btn" data-action="export">${icon('download',18)}导出全部存档</button><button class="secondary-btn" data-action="import">${icon('upload',18)}导入存档</button><input id="save-file" class="hidden" type="file" accept=".json,application/json"></div><div class="help-note">导入会覆盖当前真人玩家与电脑的进度（旧存档会为电脑创建初始进度），请先备份。存档仅包含游戏数据。<br>同一浏览器建议只打开一个游戏标签页，以免进度相互覆盖。</div><div class="setting-row" style="border:0;margin-top:10px"><div><b>重新从一把剑开始</b><p>清空两位玩家与电脑的金币、收藏及对战记录。</p></div><button class="danger-btn" data-action="reset-request">重置进度</button></div>`,'settings');$('#save-file').onchange=importFile;}

function showRedeem(target=(currentPlayer===1?1:0),message=''){
  if(inGame||selectionInterval)return;
  if(isCreative()){toast('创意模式已开放全部角色。请返回普通模式后兑换永久收藏。');return;}
  showModal(`<div class="eyebrow" style="margin-bottom:10px">A GIFT FOR YOUR HEROES</div><h2>兑换码</h2><p class="intro">1P 与 2P 分别兑换，奖励只加入当前选中的玩家收藏。</p><div class="redeem-player-switch"><button class="secondary-btn ${target===0?'redeem-active':''}" data-redeem-player="0">1P · 玩家一 <small>${profile(0).owned.length} / ${CHARACTERS.length}</small></button><button class="secondary-btn ${target===1?'redeem-active':''}" data-redeem-player="1">2P · 玩家二 <small>${profile(1).owned.length} / ${CHARACTERS.length}</small></button></div><label class="redeem-label" for="redeem-code">兑换码</label><input id="redeem-code" class="search-input redeem-input" type="text" inputmode="numeric" autocomplete="off" maxlength="24" placeholder="输入兑换码" aria-label="输入兑换码"><p id="redeem-feedback" class="redeem-feedback" role="status">${message}</p><div class="modal-actions"><button class="secondary-btn" data-action="close">返回</button><button class="primary-btn" id="redeem-submit">为 ${target===0?'1P':'2P'} 兑换 ${icon('spark',17)}</button></div>`,'redeem');
  $$('[data-redeem-player]').forEach(b=>b.onclick=()=>showRedeem(+b.dataset.redeemPlayer));
  const redeem=()=>{
    const result=store.redeemCode(target,$('#redeem-code').value);
    if(!result.ok){$('#redeem-feedback').textContent=result.error;return;}
    render();showRedeem(target,result.alreadyUnlocked?'该玩家已拥有全部角色，无需重复领取。':`${target===0?'1P':'2P'} 已解锁 ${result.unlocked} 位角色，当前共 ${result.total} 位。另一位玩家的收藏保持原样。`);
  };
  $('#redeem-submit').onclick=redeem;$('#redeem-code').onkeydown=e=>{if(e.code==='Enter'){e.preventDefault();redeem();}};
  $('#redeem-code').focus({preventScroll:true});
}
function toggleSound(){sound=!sound;if(!isCreative())try{localStorage.setItem('relic-duel-sound',String(sound));}catch{}engine?.setSound(sound);$$('[data-action="sound"]').forEach(b=>{b.innerHTML=icon(sound?'sound':'mute',17);b.setAttribute('aria-label',sound?'关闭音效':'开启音效');});}
function exportSave(){const blob=new Blob([store.exportSave()],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`箱遇-双人存档-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('存档已导出，记得妥善保存。');}
async function importFile(e){
  if(isCreative()||inGame||selectionInterval||modalType!=='settings'){toast('请在普通模式的游戏与存档中导入。');return;}
  const file=e.target.files?.[0];if(!file)return;e.target.value='';
  if(file.size>1_000_000){toast('存档文件过大，请选择小于 1 MB 的 JSON 存档。');return;}
  const token=++importReadToken,origin=modalGeneration;
  const stillReading=()=>token===importReadToken&&modalGeneration===origin&&modalType==='settings'&&!isCreative()&&!inGame&&!selectionInterval;
  let raw;
  try{raw=await file.text();}catch{if(stillReading())toast('无法读取这个文件，请重新选择存档。');return;}
  if(!stillReading())return;
  showModal(`<h2>替换当前游戏进度？</h2><p class="intro">导入后，两位真人玩家及电脑的金币、收藏与记录将被替换。</p><div class="modal-actions"><button class="secondary-btn" data-action="settings">取消</button><button id="confirm-import" class="primary-btn">确认导入</button></div>`,'confirm');
  const confirmation=modalGeneration;let imported=false;
  $('#confirm-import').onclick=()=>{
    if(imported||modalGeneration!==confirmation||modalType!=='confirm'||isCreative()||inGame||selectionInterval)return;
    imported=true;
    const result=store.importSave(raw);
    if(!result.ok){toast(result.error);showSettings();return;}
    selected=[0,0];closeModal();render();toast(result.persisted===false?'已导入本次会话，但无法写入浏览器存储，请导出备份。':'游戏存档导入成功，已保留全部有效进度。');
  };
}
function requestReset(){if(isCreative()){toast('请返回普通模式后管理存档。');return;}showModal(`<h2>确定重新开始吗？</h2><p class="intro">两位玩家与电脑将只保留初始剑士，金币和对战记录清零。建议先导出存档。</p><div class="modal-actions"><button class="secondary-btn" data-action="settings">保留进度</button><button id="confirm-reset" class="danger-btn">清空并重新开始</button></div>`,'confirm');$('#confirm-reset').onclick=()=>{store.reset();selected=[0,0];closeModal();render();toast('新的冒险，从剑士开始。');};}
function openChest(id){
  if(isCreative()){toast('创意模式已开放全部角色，无需开箱，普通收藏保持原样。');return;}
  // Shopping is available only between rounds: no active selection/battle clock
  // can advance, be restarted or be destroyed by a chest confirmation/reveal.
  if(inGame || selectionInterval || modalType==='opening' || currentPlayer===2)return;
  const playerIndex=currentPlayer, ch=CHESTS.find(c=>c.id===id);
  if(!ch)return;
  if(profile(playerIndex).coins<ch.price){toast('金币不足。来一场对决，再积攒一点金币吧。');return;}
  showModal(`<div class="chest-confirm-art">${chestArt(ch.id)}</div><div class="eyebrow" style="margin-bottom:10px">${profileName(playerIndex)} · ${ch.count===3?'三位角色':'一位角色'}</div><h2>确定开启${ch.name}吗？</h2><p class="intro">确认后将立即消耗 ${ch.price} 金币，并抽取角色。<br>选择取消，不消耗金币，也不会进行抽取。</p><div class="confirm-balance"><span>本次花费 ${coin(ch.price)}</span><span>当前余额 ${coin(profile(playerIndex).coins)}</span></div><p class="subtext">${icon('clock',14)} 开箱与角色出场动画，不占选人及对战时间。</p><div class="modal-actions"><button class="secondary-btn" data-action="close">取消</button><button class="primary-btn" id="confirm-chest">确定开启 ${icon('chest',18)}</button></div>`,'chestConfirm');
  let confirmed=false;const confirmation=modalGeneration;
  $('#confirm-chest').onclick=()=>{if(confirmed||modalGeneration!==confirmation||modalType!=='chestConfirm'||isCreative()||inGame||selectionInterval)return;confirmed=true;$('#confirm-chest').disabled=true;performChestOpen(playerIndex,id);};
}
function animatedChest(ch){
  const colors={common:['#ad7b4f','#dfb77c','#5c3f2c'],rare:['#8ea7b4','#d1e5e9','#455665'],large:['#9a9b6b','#d1ce8b','#4f5439'],diamond:['#69b8c8','#bbf2e6','#2f5e71']};
  const [a,b,c]=colors[ch.id];
  return `<svg class="animated-chest-svg" viewBox="0 0 200 150" aria-hidden="true"><ellipse cx="100" cy="134" rx="67" ry="10" fill="#0005"/><path d="m34 75 66 15 66-17-3 46-63 18-63-18z" fill="${a}" stroke="${c}" stroke-width="3"/><path d="m100 90 66-17-3 46-63 18z" fill="${c}"/><path d="M52 80v44m93-47v46" stroke="${b}" stroke-width="8"/><path d="m35 85 65 18 65-18" stroke="${b}" stroke-width="5"/><path d="m87 88 24 1v21l-12 8-12-9z" fill="${c}" stroke="${b}" stroke-width="3"/><circle cx="99" cy="100" r="4" fill="${b}"/><g class="animated-chest-lid"><path d="m34 75 8-29 58-18 58 16 8 29-66 17z" fill="${a}" stroke="${c}" stroke-width="3"/><path d="m42 46 58 17 58-19-58-16z" fill="${b}"/><path d="m100 63 58-19 8 29-66 17z" fill="${c}"/><path d="m58 42 0 39m83-42v41" stroke="${b}" stroke-width="7"/><path d="m47 49 51 16" stroke="#fff4" stroke-width="2"/></g></svg>`;
}
function performChestOpen(playerIndex,id){
  if(isCreative()||inGame||selectionInterval)return;
  const result=store.openChest(playerIndex,id);
  if(!result.ok){closeModal();toast(result.error);return;}
  const ch=CHESTS.find(c=>c.id===id);
  render();openingComplete=false;
  const delay=result.results.length>1?330:0;
  const duration=3200+delay*(result.results.length-1);
  showModal(`<div class="eyebrow" style="margin-bottom:10px">${profileName(playerIndex)} · ${ch.name}</div><h2>${result.results.length>1?'三位小英雄，正向你走来。':'一位小英雄，正向你走来。'}</h2><p class="intro">${icon('clock',14)} 慢慢揭晓这份惊喜 · 选人和对战时间不会减少</p><div class="opening-stage ${result.results.length>1?'triple-opening':''}">${result.results.map((r,i)=>{const q=quality(r.character);return `<div class="opening-slot" style="--quality-color:${q.color};--reveal-delay:${i*delay}ms"><div class="chest-light"></div><div class="opening-stars">✦<i>✧</i><b>✦</b></div><div class="floating-character">${portrait(r.character,'',playerIndex)}</div><div class="opening-chest">${animatedChest(ch)}</div><div class="opening-name"><span>${r.duplicate?'又见老朋友':'NEW · 新的相遇'}</span><h3>${r.character.name}</h3><p style="color:${q.color}">${q.name} · ${q.label}</p><p>${r.duplicate?`重复返还 ${r.refund} 金币`:'已加入你的角色收藏'}</p></div></div>`;}).join('')}</div><div id="opening-summary" class="opening-summary"><p class="subtext">已消耗 ${result.cost} 金币${result.totalRefund?' · 重复返还 '+result.totalRefund+' 金币':''} · 余额 ${number(profile(playerIndex).coins)}</p><div class="modal-actions" style="justify-content:center"><button class="secondary-btn" data-action="close" disabled>收下惊喜</button><button class="primary-btn" id="open-again" disabled>再开一次 ${coin(ch.price)}</button></div></div>`,'opening',result.results.length>1);
  $('.modal-close').disabled=true;
  $('#open-again').onclick=()=>openChest(id);
  openingTimer=setTimeout(()=>{
    openingTimer=null;
    if(modalType!=='opening')return;
    openingComplete=true;modalType='reveal';
    $('.modal').classList.add('opening-complete');
    $$('.modal button').forEach(b=>b.disabled=false);
    $('.modal-close').focus({preventScroll:true});
  },duration);
}
function startSelection(){
  if(inGame||modalType||selectionInterval)return;
  store.refreshFromStorage?.({notify:false});
  if(isCreative()&&creativeMap!=='random')nextMap=plannedMap();
  if(opponentMode==='computer')selected[1]=isCreative()?chooseCreativeComputer():store.chooseComputerCharacter();
  for(let i=0;i<2;i++)if(!availableCharacters(i).includes(selected[i]))selected[i]=availableCharacters(i)[0]||0;
  ready=[false,opponentMode==='computer'];selectionEnd=Date.now()+20000;selectionOrientationPause=null;renderSelection();
  const interval=setInterval(()=>{
    if(selectionInterval!==interval||modalType!=='selection'){clearInterval(interval);if(selectionInterval===interval)selectionInterval=null;return;}
    checkLandscape();if(selectionOrientationPause!==null)return;
    const left=Math.max(0,Math.ceil((selectionEnd-Date.now())/1000));const node=$('#selection-count');if(node)node.textContent=left;if(!left)beginGame();
  },100);selectionInterval=interval;
}
function selectCharacter(i,id){
  if(modalType!=='selection'||!availableCharacters(i).includes(id)||(ready[i]&&!(isComputerSlot(i)&&isCreative())))return;
  if(isComputerSlot(i)&&!isCreative())return;
  selected[i]=id;renderSelection();
  const picked=$(`.mini-character.chosen[data-select-player="${i}"]`);
  picked?.scrollIntoView?.({block:'nearest',inline:'nearest'});
}
function readyPlayer(i){
  if(modalType!=='selection'||isComputerSlot(i)||ready[i]||portraitBlocked())return;
  ready[i]=true;if(ready.every(Boolean))beginGame();else renderSelection();
}
function handleSelectionKey(e){
  if(modalType!=='selection'||!['KeyA','KeyD','KeyS','ArrowLeft','ArrowRight','ArrowDown'].includes(e.code))return false;
  e.preventDefault();e.stopPropagation();
  if(e.repeat||portraitBlocked())return true;
  const i=e.code.startsWith('Arrow')?1:0;
  if(e.code==='KeyS'||e.code==='ArrowDown'){readyPlayer(i);return true;}
  const ids=availableCharacters(i),current=ids.indexOf(selected[i]),step=(e.code==='KeyD'||e.code==='ArrowRight')?1:-1;
  selectCharacter(i,ids[(Math.max(0,current)+step+ids.length)%ids.length]);return true;
}
function renderSelection(){
  showModal(`<div class="selection-top"><div><div class="eyebrow" style="margin-bottom:9px">${opponentMode==='computer'?'YOUR HERO VS THE COMPUTER':'CHOOSE YOUR LITTLE HERO'}</div><h2 style="margin:0">这一次，谁来出战？</h2></div><div class="selection-timer"><span id="selection-count">${Math.max(0,Math.ceil((selectionEnd-Date.now())/1000))}</span><small>秒</small></div></div><div class="selection-cols">${[0,1].map(i=>{
    const c=CHARACTERS[selected[i]],cpu=isComputerSlot(i);
    return `<div class="select-panel ${i?'p2':''}"><div class="player-title"><b>${duelLabel(i)}</b><span>${cpu?(isCreative()?'可指定电脑角色':'自动选人完成'):ready[i]?'已准备':'选择中'}</span></div><div class="selected-hero" data-quality="${c.quality}" style="--quality-color:${quality(c).color}">${portrait(c,'',i)}<div><h3>${c.name}</h3><p style="color:${quality(c).color}">${quality(c).name} · ${quality(c).label}</p><p>${c.hp} 生命 / ${c.damage} 攻击</p><p>大招冷却 ${c.ultCooldown}s</p></div></div><div class="mini-roster">${availableCharacters(i).map(id=>`<button class="mini-character ${selected[i]===id?'chosen':''}" data-select-player="${i}" data-id="${id}" data-quality="${CHARACTERS[id].quality}" style="--quality-color:${quality(CHARACTERS[id]).color}" title="${CHARACTERS[id].name} · ${quality(CHARACTERS[id]).name}" ${(ready[i]||cpu)&&!(cpu&&isCreative())?'disabled':''}>${portrait(CHARACTERS[id],'',i)}${CHARACTERS[id].name}</button>`).join('')}</div>${!cpu?`<div class="selection-keys">${key(i?'←':'A')}${key(i?'→':'D')} 切换角色 · ${key(i?'↓':'S')} 准备</div>`:''}${cpu?`<div class="cpu-selection-note">${icon('cpu',17)}${isCreative()?'← / → 可指定电脑角色':'随机选人，强者优先'}<br><span>${isCreative()?'电脑已就绪，你准备好即可开始':'每升一个品质，选中权重 ×20'}</span></div>`:''}<button class="primary-btn" data-ready="${i}" ${ready[i]?'disabled':''}>${icon(ready[i]?'check':'swords',16)}${cpu?'电脑已就绪':ready[i]?'准备就绪':'我准备好了'}</button></div>`;
  }).join('')}</div><p class="selection-hint">${opponentMode==='computer'?(isCreative()?'你准备好即可开战，也可用右侧方向键指定电脑角色。':'你准备好即可开战，电脑已从自己的收藏中选人。'):'双方准备后立即开始；'}20 秒结束时，自动使用当前选择。<br>本轮地图：${nextMap.name} · ${isCreative()?'创意模式 / 不结算、不存档':'胜者 60 / 败者 20 金币'}</p>`,'selection',true);
  $$('[data-select-player]').forEach(b=>b.onclick=()=>selectCharacter(+b.dataset.selectPlayer,+b.dataset.id));
  $$('[data-ready]').forEach(b=>b.onclick=()=>readyPlayer(+b.dataset.ready));
}
function beginGame(){if(inGame||portraitBlocked())return;clearResultTimer();roundGeneration++;store.refreshFromStorage?.({notify:false});reconcileSelections();clearInterval(selectionInterval);selectionInterval=null;modalType=null;modalRoot.innerHTML='';inGame=true;rewards=null;render();checkLandscape();}
function renderGame(content){
  const chars=selected.map(id=>CHARACTERS[id]);
  content.insertAdjacentHTML('beforeend',`<div class="game-container"><div class="game-top"><div><div class="eyebrow" style="margin-bottom:8px">${isCreative()?'CREATIVE · 不存档':opponentMode==='computer'?'VS COMPUTER':'LOCAL DUEL'}${isCreative()?'':` · ROUND ${store.data.matches+1}`}</div><h1>${nextMap.name}</h1><p>${nextMap.subtitle}</p></div><button class="secondary-btn" data-action="pause">${icon('pause',15)}暂停 ${key('Esc')}</button></div><div class="game-hud">${hud(chars[0],0)}<div class="round-clock"><span id="round-time">90</span><small>SECONDS</small></div>${hud(chars[1],1)}</div><div class="game-stage"><canvas id="game-canvas" aria-label="双人对战区域"></canvas><div id="pause-overlay" class="game-pause hidden"><h2>喘口气，再出发。</h2><p>游戏已暂停，生命与计时保持不变。</p><div class="buttons"><button class="secondary-btn" data-action="abandon">返回大厅</button><button class="primary-btn" data-action="resume">继续对决 ${icon('arrow',16)}</button></div></div></div><div class="game-help">${[0,1].map(i=>`<div class="game-player-help"><div class="keys-row"><span style="color:var(--${i?'orange':'mint'})">${isComputerSlot(i)?'CPU':`P${i+1}`}</span>${isComputerSlot(i)?icon('cpu',18)+' 电脑自动操作':`${key(i?'←':'A')}${key(i?'→':'D')} 移动 ${key(i?'↑':'W')} 跳跃 ${key(i?'↓':'S')} 攻击`}</div><span class="ult-status" id="ult-${i}">大招已就绪 · 方向 + 攻击</span></div>`).join('')}</div><div class="economy-note" style="margin-top:18px;padding:15px 20px"><p style="font-size:11px">${icon('spark',16)} 大招组合：攻击 + 上 / 左 / 右 = 定向释放，攻击 + 左右同时 = 原地释放。最后按下的左右方向决定面朝方向。</p></div></div>`);
  engine=new DuelEngine($('#game-canvas'),{onUpdate:updateGame,onEnd:finishGame,onState:state=>{if(state==='paused')$('#pause-overlay')?.classList.remove('hidden');else if(state==='playing')$('#pause-overlay')?.classList.add('hidden');}});
  engine.setSound(sound);engine.start({characters:chars,map:nextMap,duration:90,cpuPlayer:opponentMode==='computer'?1:null});
}
function hud(c,i){return `<div class="fighter-hud ${i?'p2':''}"><div class="fighter-name"><b>${c.name}</b><span>${duelLabel(i)}</span></div><div class="hp-track"><div class="hp-fill" id="hp-${i}" style="width:100%"></div></div><div class="fighter-health"><span id="hp-text-${i}">${c.hp} / ${c.hp}</span><span>${quality(c).name} · ${c.basicName}</span></div></div>`;}
function updateGame(state){
  if(!inGame)return;$('#round-time').textContent=Math.max(0,Math.ceil(state.time));
  state.players.forEach((p,i)=>{const hp=$(`#hp-${i}`);if(!hp)return;hp.style.width=`${Math.max(0,p.hp/p.maxHp*100)}%`;$(`#hp-text-${i}`).textContent=`${Math.max(0,Math.ceil(p.hp))} / ${p.maxHp}`;const left=Math.ceil(p.ultRemaining||0);$(`#ult-${i}`).textContent=left?`大招冷却 · ${left}s`:'大招已就绪 · 方向 + 攻击';$(`#ult-${i}`).style.color=left?'#859a8b':'#b7f79b';});
}
function finishGame(result){
  if(!inGame||rewards)return;
  const creative=isCreative();
  const finishedRound=roundGeneration;
  rewards=store.recordMatch(result.winner,{opponent:opponentMode,creative});
  const roundRewards=rewards.map(r=>({...r}));
  const draw=result.winner===null;
  const cpuOpening=!creative&&opponentMode==='computer'?store.autoOpenComputerChest():null;
  clearResultTimer();resultTimer=setTimeout(()=>{
    resultTimer=null;if(!inGame||roundGeneration!==finishedRound)return;
    const winnerLabel=result.winner===0?'玩家一':opponentMode==='computer'?'电脑':'玩家二';
    showModal(`<div class="result-icon">${icon(draw?'users':'trophy',44)}</div><div class="eyebrow" style="margin-bottom:12px">${draw?'A WELL-MATCHED DUEL':'A LITTLE VICTORY'}</div><h2>${draw?'旗鼓相当，下局再见。':`${winnerLabel}，拿下这一局！`}</h2><p class="intro">${result.reason==='time'?'时间到，按剩余生命比例结算。':'漂亮的一击，结束这场小小对决。'}</p>${creative?`<div class="creative-result">${icon('spark',26)}<h3>自由对战，尽管试招。</h3><p>本局不发放金币，不记录战绩，电脑也不会开箱。<br>你在普通模式中的收藏与进度保持原样。</p></div>`:`<div class="result-rewards">${roundRewards.map((r,i)=>`<div class="reward-box"><p>${duelLabel(i)} · ${draw?'平局':result.winner===i?'胜利':'再接再厉'}</p>${coin(r.coins)}<p>金币余额 ${number(duelProfile(i).coins)}</p></div>`).join('')}</div>`}${cpuOpening?.ok?`<div class="cpu-auto-report">${icon('cpu',20)}<p>电脑自动开启了<b>${CHESTS.find(c=>c.id===cpuOpening.chestId).name}</b>，获得 ${cpuOpening.results.map(r=>`${r.character.name}${r.duplicate?'（重复返币）':''}`).join('、')}。<br><span>已直接更新电脑收藏，不播放开箱动画。</span></p></div>`:!creative&&opponentMode==='computer'?`<p class="cpu-saving-note">${icon('chest',16)}电脑正在为${CHESTS.find(c=>c.id===store.data.computer.targetChest)?.name||'普通宝箱'}攒金币。</p>`:''}<p class="subtext">${creative?'创意模式不会写入存档。':store.storageAvailable?'奖励已自动保存。慢慢积攒，下一个宝箱在等你。':'奖励暂存于当前页面，请在游戏与存档中导出备份。'}</p><div class="modal-actions"><button class="secondary-btn" data-action="result-lobby">返回大厅</button><button class="primary-btn" data-action="rematch">再来一局 ${icon('arrow',17)}</button></div>`,'result');
  },650);
}
function randomMap(){return MAPS[Math.floor(Math.random()*MAPS.length)];}
function pauseGame(){if(!inGame||rewards)return;orientationPausedGame=false;engine.pause();$('#pause-overlay').classList.remove('hidden');}
function resumeGame(){if(!inGame||rewards||portraitBlocked())return;$('#pause-overlay').classList.add('hidden');engine.resume();}
function abandonGame(){clearResultTimer();roundGeneration++;inGame=false;rewards=null;page='lobby';nextMap=plannedMap();render();toast('已返回大厅，本局不结算奖励。');}
function bindActions(root){$$('[data-action]',root).forEach(b=>b.onclick=()=>{
  const a=b.dataset.action;
  if(a==='close')closeModal();
  if(a==='help'){if(inGame)pauseGame();showHelp();}
  if(a==='odds')showOdds();
  if(a==='redeem')showRedeem();
  if(a==='cpu-collection'){page='collection';currentPlayer=2;filter='owned';render();}
  if(a==='settings'){if(inGame){pauseGame();return;}showSettings();}
  if(a==='sound')toggleSound();
  if(a==='setting-sound'){toggleSound();showSettings();}
  if(a==='fullscreen')toggleFullscreen();
  if(a==='shuffle'){if(isCreative()){setCreativeMap('random');return;}nextMap=randomMap();engine.renderPreview(nextMap,selected.map(id=>CHARACTERS[id]));$('#next-map-name').textContent=nextMap.name;}
  if(a==='select')startSelection();
  if(a==='pause')pauseGame();
  if(a==='resume')resumeGame();
  if(a==='abandon')abandonGame();
  if(a==='export')exportSave();
  if(a==='import'){if(isCreative())toast('请返回普通模式后导入存档。');else $('#save-file').click();}
  if(a==='reset-request')requestReset();
  if(a==='result-lobby')closeModal();
  if(a==='rematch'){closeModal();startSelection();}
});}
function toggleFullscreen(){
  const target=document.fullscreenElement?document:document.documentElement;
  const method=document.fullscreenElement?document.exitFullscreen:document.documentElement.requestFullscreen;
  const unsupported=()=>toast('当前浏览器无法进入网页全屏，可使用浏览器的全屏功能。');
  if(typeof method!=='function'){unsupported();return;}
  try{Promise.resolve(method.call(target)).catch(unsupported);}catch{unsupported();}
}
store.subscribe?.((_data,meta)=>{
  if(meta?.source!=='external')return;
  externalProgressPending=true;refreshExternalProgress();
});
let toastTimer;function toast(message){clearTimeout(toastTimer);const el=$('#toast');el.textContent=message;el.classList.add('show');toastTimer=setTimeout(()=>el.classList.remove('show'),4200);}
document.addEventListener('keydown',e=>{if(handleSelectionKey(e))return;if(e.code==='Escape'){e.preventDefault();e.stopPropagation();if(modalType){closeModal();}else if(inGame&&!rewards){if($('#pause-overlay').classList.contains('hidden'))pauseGame();else resumeGame();}}if(e.code==='Tab'&&modalType==='opening'&&!openingComplete){e.preventDefault();return;}if(e.code==='Tab'&&modalType){const nodes=$$('button:not(:disabled),input,a[href]',modalRoot);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&inGame)pauseGame();else checkLandscape();});
window.addEventListener('resize',()=>{paintPortraits();checkLandscape();});
window.addEventListener('orientationchange',checkLandscape);
render();
