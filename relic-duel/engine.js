/* Chest Duel — deterministic-size, two-player canvas arena. No storage or network. */
const W = 1100, H = 530, FLOOR = 470;
const KEYS = [
  { left: 'KeyA', right: 'KeyD', up: 'KeyW', attack: 'KeyS' },
  { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', attack: 'ArrowDown' }
];
const CONTROL_KEYS = new Set(KEYS.flatMap(k => Object.values(k)));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const col = (h, s = 65, l = 57) => `hsl(${h},${s}%,${l}%)`;
const smoothRect = (ctx, x, y, w, h, r = 8) => {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
};
function shape(ctx, points, fill, stroke = null, width = 2) {
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function circle(ctx, x, y, r, fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}
function weapon(ctx, c, time = 0, attack = 0) {
  const outline = '#252741', hue = c.hue ?? 210, color = col(hue, 72, 70);
  ctx.save(); ctx.translate(16, -25); ctx.rotate(attack ? -1.3 + (1 - attack) * 2.2 : -.25);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = outline; ctx.lineWidth = 4;
  switch (c.archetype) {
    case 'bow':
      ctx.strokeStyle = '#e7c085'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(7,-9,23,-1.3,1.3); ctx.stroke();
      ctx.strokeStyle = outline; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(13,-31); ctx.lineTo(13,13); ctx.stroke();
      ctx.strokeStyle = '#faf2d5'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1,-10); ctx.lineTo(37,-10); ctx.stroke();
      shape(ctx,[[39,-10],[30,-15],[30,-5]],'#f1f7fe',outline,1); break;
    case 'gun':
      smoothRect(ctx, 0,-19,35,14,4); ctx.fillStyle = '#39435c'; ctx.fill(); ctx.stroke();
      smoothRect(ctx, 6,-8,9,16,2); ctx.fillStyle = '#8e643d'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = color; ctx.fillRect(8,-17,15,4); ctx.fillStyle='#d6e5e8'; ctx.fillRect(32,-16,6,8); break;
    case 'magic':
      ctx.strokeStyle='#cba373'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(0,14); ctx.lineTo(12,-37); ctx.stroke();
      circle(ctx,13,-37,11,col(hue,80,72)); circle(ctx,10,-41,4,'#fff4dd');
      ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(13,-37,16,time,time+3);ctx.stroke(); break;
    case 'ball':
      circle(ctx,14,-6,13,outline); circle(ctx,14,-6,11,'#f5a54f');
      ctx.strokeStyle='#905431';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(3,-6);ctx.lineTo(25,-6);ctx.moveTo(14,-17);ctx.lineTo(14,5);ctx.stroke();
      ctx.beginPath();ctx.ellipse(14,-6,5,11,0,0,Math.PI*2);ctx.stroke(); break;
    case 'spear':
      ctx.strokeStyle='#957454';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-7,19);ctx.lineTo(35,-43);ctx.stroke();
      shape(ctx,[[35,-51],[27,-33],[39,-38]],'#e5f5f6',outline,2); ctx.strokeStyle=color;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(22,-25);ctx.lineTo(31,-19);ctx.stroke();break;
    case 'hammer':
      ctx.strokeStyle='#8b6445';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,13);ctx.lineTo(13,-31);ctx.stroke();
      smoothRect(ctx,-3,-43,36,23,4);ctx.fillStyle='#9daec0';ctx.fill();ctx.strokeStyle=outline;ctx.lineWidth=3;ctx.stroke();
      ctx.fillStyle=color;ctx.fillRect(9,-40,9,17);break;
    case 'shield':
      shape(ctx,[[-1,-25],[23,-25],[25,-5],[11,9],[-3,-5]],'#c1d0dc',outline,3);
      shape(ctx,[[5,-19],[17,-19],[17,-6],[11,0],[5,-6]],color);break;
    case 'dagger':
      shape(ctx,[[3,6],[7,-22],[20,-35],[19,-13],[8,10]],'#dbe8f1',outline,2);
      ctx.strokeStyle='#e8bf75';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(15,7);ctx.stroke();break;
    case 'scythe':
      ctx.strokeStyle='#5e5472';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-6,19);ctx.lineTo(12,-42);ctx.stroke();
      shape(ctx,[[10,-43],[28,-49],[45,-36],[26,-42],[16,-31]],'#e2e0f0',outline,2);break;
    default:
      shape(ctx,[[2,4],[7,-34],[15,-47],[20,-31],[11,7]],'#e0edf5',outline,2);
      ctx.strokeStyle='#f3c881';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-1,-1);ctx.lineTo(19,3);ctx.stroke();
      ctx.strokeStyle='#716080';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(6,5);ctx.lineTo(4,15);ctx.stroke();
  }
  ctx.restore();
}
/** Draw a distinctive paper-cut fighter, centered horizontally and anchored at its feet. */
function fighter(ctx, c, x, y, scale = 1, face = 1, motion = 0, attack = 0, playerIndex = 0, time = 0) {
  const hue = c.hue ?? 210, body = col(hue, 52, 58), light = col(hue, 58, 77), dark = col(hue, 34, 34);
  const outline = '#252741', limb = Math.sin(motion) * 5, teamColor = playerIndex ? '#f3b181' : '#b8edaa';
  ctx.save(); ctx.translate(x,y);ctx.scale(scale * face,scale);ctx.lineJoin='round';ctx.lineCap='round';
  // Cloth moves independently from the body; silhouettes differ by profession.
  shape(ctx,[[-12,-48],[-24,-23],[-30-limb*.3,-5],[-9,-10],[4,-37]],dark,outline,2.5);
  ctx.strokeStyle=outline;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-7,-17);ctx.lineTo(-9-limb,0);ctx.moveTo(8,-17);ctx.lineTo(10+limb,0);ctx.stroke();
  ctx.strokeStyle='#3e4056';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-7,-17);ctx.lineTo(-9-limb,-1);ctx.moveTo(8,-17);ctx.lineTo(10+limb,-1);ctx.stroke();
  smoothRect(ctx,-14,-43,28,28,7);ctx.fillStyle=body;ctx.fill();ctx.strokeStyle=outline;ctx.lineWidth=2.5;ctx.stroke();
  ctx.fillStyle=light;ctx.fillRect(-10,-39,19,5);
  shape(ctx,[[-12,-39],[-7,-41],[12,-22],[8,-19]],teamColor);
  ctx.fillStyle=dark;ctx.fillRect(-13,-22,26,5);
  smoothRect(ctx,-3,-23,7,7,1);ctx.fillStyle='#f6d699';ctx.fill();
  circle(ctx,-14,-34,7,light);circle(ctx,-14,-34,7,light);ctx.strokeStyle=outline;ctx.lineWidth=2;ctx.beginPath();ctx.arc(-14,-34,7,0,Math.PI*2);ctx.stroke();
  // Face / helmet.
  circle(ctx,0,-57,16,outline);circle(ctx,0,-57,13.5,'#f1c5a3');
  const caster = ['magic','scythe'].includes(c.archetype), rogue = ['dagger','bow'].includes(c.archetype);
  if (caster) {
    shape(ctx,[[-19,-63],[-5,-91],[8,-72],[19,-64]],dark,outline,2.5);
    smoothRect(ctx,-19,-67,38,8,3);ctx.fillStyle=body;ctx.fill();ctx.stroke();
    circle(ctx,-3,-76,3,'#f6dba6');
  } else if (c.archetype === 'ball') {
    shape(ctx,[[-14,-60],[-14,-72],[-5,-78],[10,-72],[15,-61]],'#38354e',outline,2);
    ctx.strokeStyle=light;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-12,-63);ctx.lineTo(14,-63);ctx.stroke();
    ctx.fillStyle='#fff2d6';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText(String((c.id ?? 0)%99+1),0,-28);
  } else if (rogue) {
    shape(ctx,[[-15,-55],[-17,-68],[-6,-78],[9,-76],[16,-63],[13,-55],[8,-65],[-9,-65]],body,outline,2);
  } else if (c.archetype === 'gun') {
    shape(ctx,[[-16,-63],[-13,-75],[8,-76],[15,-64],[21,-61],[-16,-61]],dark,outline,2);
    ctx.fillStyle=light;ctx.fillRect(-12,-67,24,4);
  } else {
    shape(ctx,[[-15,-54],[-16,-68],[-9,-77],[8,-78],[16,-68],[15,-54],[9,-61],[-8,-61]],'#bfcedb',outline,2);
    shape(ctx,[[-4,-78],[-7,-90],[5,-86],[10,-77]],light,outline,2);
    ctx.fillStyle='#e8f1ee';ctx.fillRect(-10,-70,20,4);
  }
  ctx.strokeStyle=outline;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(2,-58);ctx.lineTo(4,-58);ctx.moveTo(10,-58);ctx.lineTo(12,-58);ctx.stroke();
  ctx.strokeStyle='#c28f7c';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(7,-50);ctx.lineTo(11,-50);ctx.stroke();
  // Higher qualities carry an increasingly elaborate aura crest.
  if ((c.tier ?? 0) >= 3) {
    ctx.strokeStyle=col(hue,90,82);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-58,24,3.5,5.8);ctx.stroke();
    if(c.tier>=5){circle(ctx,-23,-66,2,'#ffe6a8');circle(ctx,21,-73,2,'#ffe6a8');}
  }
  weapon(ctx,c,time,attack);
  circle(ctx,14,-30,5,'#f1c5a3');
  ctx.restore();
}
export function drawPortrait(ctx, character, x, y, size = 100, playerIndex = 0) {
  fighter(ctx, character, x, y, size / 92, 1, 0, 0, playerIndex, 0);
}

export class DuelEngine {
  static drawPortrait = drawPortrait;
  constructor(canvas, { onEnd = () => {}, onUpdate = () => {}, onState = () => {} } = {}) {
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.onEnd=onEnd;this.onUpdate=onUpdate;this.onState=onState;
    const dpr=Math.min(2,globalThis.devicePixelRatio||1);canvas.width=W*dpr;canvas.height=H*dpr;
    this.keys=new Set();this.mode='preview';this.paused=false;this.sound=true;this.time=0;this.visualTime=0;
    this.players=[];this.projectiles=[];this.effects=[];this.particles=[];this.texts=[];this.shake=0;this.last=0;this.updateElapsed=0;
    this.map={name:'晨光森林',theme:'grove',bg:['#b6d8d8','#edf0d6'],accent:'#788d58',platforms:[{x:340,y:364,w:150,h:24},{x:610,y:364,w:150,h:24}]};
    this.keydown=e=>this._keyDown(e);this.keyup=e=>{this.keys.delete(e.code);};this.blur=()=>{this.keys.clear();if(this.mode==='playing'&&!this.paused)this.pause();};
    this.visibility=()=>{if(document.hidden)this.blur();};
    window.addEventListener('keydown',this.keydown);window.addEventListener('keyup',this.keyup);window.addEventListener('blur',this.blur);
    document.addEventListener('visibilitychange',this.visibility);
    this.frame=t=>{if(this.destroyed)return;let dt=this.last?Math.min((t-this.last)/1000,.035):.016;this.last=t;this.visualTime+=dt;
      if(!this.paused)this._tick(dt);this._render();this.raf=requestAnimationFrame(this.frame);};
    this.raf=requestAnimationFrame(this.frame);
  }
  renderPreview(map, characters) {
    this.mode='preview';this.paused=false;this.cpuPlayer=null;this.cpu=null;this.keys.clear();this.map=map||this.map;this.projectiles=[];this.effects=[];this.particles=[];this.texts=[];
    if(characters)this.players=characters.map((c,i)=>({...this._makePlayer(c,i),x:i?780:330}));
  }
  _makePlayer(c,i){return {char:c,index:i,x:i?960:140,y:FLOOR,vx:0,vy:0,kb:0,face:i?-1:1,w:32,h:68,hp:c.hp,maxHp:c.hp,
    grounded:true,attackTimer:0,ultRemaining:0,ultCooldown:c.ultCooldown||10,pendingAttack:-1,pendingIntent:null,heldRepeat:0,invuln:0,flash:0,motion:0,attackPose:0,guard:0};}
  start({characters,map,duration=90,cpuPlayer=null}) {
    this.players=characters.map((c,i)=>this._makePlayer(c,i));this.map=map;this.duration=duration;this.time=duration;
    this.cpuPlayer=cpuPlayer===1?1:null;this.cpu=this.cpuPlayer===1?{reaction:.28,seed:173,route:null,flight:null,replan:0,dodge:0,nav:this._buildNavigation(this.players[1])}:null;
    this.countdown=3;this.mode='playing';this.paused=false;this.ended=false;this.keys.clear();this.projectiles=[];this.effects=[];this.texts=[];this.particles=[];this.shake=0;
    this.onState('playing');this._updateUI();
  }
  pause(){if(this.mode!=='playing'||this.paused)return;this.paused=true;this.keys.clear();this.players.forEach(p=>{p.pendingAttack=-1;p.pendingIntent=null;});this.onState('paused');this._updateUI();}
  resume(){if(this.mode!=='playing'||!this.paused)return;this.paused=false;this.keys.clear();this.last=0;this.onState('playing');this._updateUI();}
  stop(){this.mode='preview';this.paused=false;this.keys.clear();this.projectiles=[];this.effects=[];this.texts=[];this.onState('stopped');}
  setSound(value){this.sound=!!value;}
  destroy(){this.destroyed=true;cancelAnimationFrame(this.raf);window.removeEventListener('keydown',this.keydown);window.removeEventListener('keyup',this.keyup);window.removeEventListener('blur',this.blur);document.removeEventListener('visibilitychange',this.visibility);if(this.audio)this.audio.close();}
  _keyDown(e){
    if(this.mode!=='playing')return;
    if(e.code==='Escape'){e.preventDefault();this.paused?this.resume():this.pause();return;}
    if(!CONTROL_KEYS.has(e.code))return;e.preventDefault();if(this.paused)return;
    if(this.cpuPlayer===1&&Object.values(KEYS[1]).includes(e.code))return;
    const was=this.keys.has(e.code);this.keys.add(e.code);if(was||e.repeat)return;
    KEYS.forEach((k,i)=>{const p=this.players[i];if(!p)return;
      if(e.code===k.left)p.face=-1;if(e.code===k.right)p.face=1;
    });
    if(this.countdown>0)return;
    KEYS.forEach((k,i)=>{const p=this.players[i];if(!p)return;
      if(p.pendingAttack>=0&&(e.code===k.left||e.code===k.right||e.code===k.up))p.pendingIntent={dir:this._readChord(i)};
      if(e.code===k.up&&p.grounded){p.vy=-650;p.grounded=false;this._dust(p.x,p.y,6);this._tone(300,.045,'sine',.025);}
      if(e.code===k.attack){p.pendingAttack=.075;p.heldRepeat=.075;p.pendingIntent={dir:this._readChord(i)};}
    });
  }
  _readChord(index){
    const k=KEYS[index],left=this.keys.has(k.left),right=this.keys.has(k.right),up=this.keys.has(k.up);
    return left&&right?{x:0,y:0}:up?{x:0,y:-1}:left||right?{x:right?1:-1,y:0}:null;
  }
  _tick(dt){
    if(this.paused||!(dt>0)||!Number.isFinite(dt))return;
    this.particles=this.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gravity*dt;return p.life>0;});
    this.texts=this.texts.filter(t=>{t.life-=dt;t.y-=dt*23;return t.life>0;});
    this.effects=this.effects.filter(e=>{e.life-=dt;return e.life>0;});this.shake=Math.max(0,this.shake-dt*25);
    if(this.mode!=='playing')return;
    if(this.countdown>0){
      const prev=Math.ceil(this.countdown),used=Math.min(dt,this.countdown);this.countdown=Math.max(0,this.countdown-used);dt-=used;
      if(Math.ceil(this.countdown)!==prev)this._tone(this.countdown?500:780,.06,'triangle',.04);this._updateUI();
      if(dt<=0)return;
    }
    // The final frame may be longer than the time remaining. Only inputs and
    // physics at or before the deadline can affect the result.
    dt=Math.min(dt,this.time);if(dt<=0){this._finishTime();return;}
    this.time=Math.max(0,this.time-dt);
    const controls=[];
    for(let i=0;i<this.players.length;i++){
      const p=this.players[i],k=KEYS[i],cpu=this.cpuPlayer===i?this._cpuControl(p,dt):null;
      const left=cpu?cpu.move<0:this.keys.has(k.left),right=cpu?cpu.move>0:this.keys.has(k.right);
      if(cpu?.jump&&p.grounded){p.vy=-650;p.grounded=false;this._dust(p.x,p.y,6);this._tone(300,.045,'sine',.025);}
      p.attackTimer=Math.max(0,p.attackTimer-dt);p.ultRemaining=Math.max(0,p.ultRemaining-dt);p.invuln=Math.max(0,p.invuln-dt);p.flash=Math.max(0,p.flash-dt);p.attackPose=Math.max(0,p.attackPose-dt*3);p.guard=Math.max(0,p.guard-dt);
      const move=cpu?clamp(cpu.move,-1,1):(right?1:0)-(left?1:0);if(cpu&&move)p.face=Math.sign(move);
      p.vx=move*(p.char.speed||230);p.kb*=Math.pow(.025,dt);p.vy+=1450*dt;
      controls.push({cpu,k,move});
    }
    this._stepPlayers(dt);
    // All attacks due in this simulation slice have an equal opportunity to
    // resolve, including the second player's input on a simultaneous knockout.
    this._attackPhaseAlive=new Set(this.players.filter(p=>p.hp>0).map(p=>p.index));
    for(let i=0;i<this.players.length;i++){
      const p=this.players[i],{cpu,k,move}=controls[i];
      if(move&&p.grounded){p.motion+=dt*17;if(Math.random()<dt*9)this._dust(p.x,p.y,1);}else p.motion*=Math.pow(.0001,dt);
      if(cpu){if(cpu.attack)this._attack(p,{dir:cpu.ult||null});continue;}
      if(p.pendingAttack>=0){p.pendingAttack-=dt;if(p.pendingAttack<=0){p.pendingAttack=-1;const intent=p.pendingIntent;p.pendingIntent=null;this._attack(p,intent);}}
      if(this.keys.has(k.attack)){p.heldRepeat-=dt;if(p.heldRepeat<=0&&p.pendingAttack<0&&p.attackTimer<=0){this._attack(p);p.heldRepeat=Math.max(.22,p.char.attackCooldown||.5);}}else p.heldRepeat=0;
    }
    this._attackPhaseAlive=null;
    this._projectileTick(dt);
    const dead=this.players.map(p=>p.hp<=0);
    if(dead.some(Boolean))this._finish(dead[0]&&dead[1]?null:dead[0]?1:0,'ko');
    else if(this.time<=0)this._finishTime();
    this.updateElapsed+=dt;if(this.updateElapsed>=.08){this.updateElapsed=0;this._updateUI();}
  }
  _sweepX(p,dx){
    const epsilon=.00001,half=(p.w||32)/2;
    let allowed=clamp(p.x+dx,19,W-19)-p.x;
    for(const b of this.map.platforms||[]){
      if(p.y<=b.y+epsilon||p.y-p.h>=b.y+b.h-epsilon)continue;
      if(dx>0&&p.x+half<=b.x+epsilon&&p.x+half+allowed>b.x)allowed=Math.min(allowed,b.x-p.x-half);
      if(dx<0&&p.x-half>=b.x+b.w-epsilon&&p.x-half+allowed<b.x+b.w)allowed=Math.max(allowed,b.x+b.w-p.x+half);
    }
    return allowed;
  }
  _sweepY(p,dy){
    const epsilon=.00001,half=(p.w||32)/2;
    let allowed=clamp(p.y+dy,p.h+8,FLOOR)-p.y;
    for(const b of this.map.platforms||[]){
      if(p.x+half<=b.x+epsilon||p.x-half>=b.x+b.w-epsilon)continue;
      if(dy>=0&&p.y<=b.y+epsilon&&p.y+allowed>b.y)allowed=Math.min(allowed,b.y-p.y);
      if(dy<0&&p.y-p.h>=b.y+b.h-epsilon&&p.y-p.h+allowed<b.y+b.h)allowed=Math.max(allowed,b.y+b.h+p.h-p.y);
    }
    return allowed;
  }
  _bodySnapshots(){return this.players.map(p=>({x:p.x,y:p.y,vy:p.vy,grounded:p.grounded,support:p.support??null}));}
  _moveWorld(p,dt,visuals){
    const dx=(p.vx+p.kb)*dt,dy=p.vy*dt;
    p.x+=this._sweepX(p,dx);const actual=this._sweepY(p,dy);p.y+=actual;p.grounded=false;p.support=null;
    if(Math.abs(actual-dy)>.00001){if(dy>=0){if(visuals&&p.vy>200)this._dust(p.x,p.y,5);p.grounded=true;}p.vy=0;}
    // Zero vertical velocity still counts as support when resting on the floor.
    if(p.y>=FLOOR-.00001&&p.vy>=0){p.y=FLOOR;p.vy=0;p.grounded=true;}
    else if(p.vy>=0&&(this.map.platforms||[]).some(b=>Math.abs(p.y-b.y)<.00001&&p.x+16>b.x&&p.x-16<b.x+b.w)){p.vy=0;p.grounded=true;}
  }
  _carryRiders(before){
    for(let i=0;i<2;i++){
      const rider=this.players[i],base=this.players[1-i],old=before[i],oldBase=before[1-i];
      if(!old.grounded||old.vy<0||Math.abs(old.y-(oldBase.y-base.h))>.08||Math.abs(old.x-oldBase.x)>=32-.01)continue;
      const dx=base.x-oldBase.x,dy=base.y-oldBase.y;
      rider.x+=this._sweepX(rider,dx);
      const carried=this._sweepY(rider,dy);rider.y+=carried;
      // A support cannot lift its rider through a ceiling or floating platform.
      // Stop its upward travel by exactly the rider's unavailable headroom.
      if(dy<0&&carried>dy+.00001&&Math.abs(rider.x-base.x)<32){
        base.y+=this._sweepY(base,carried-dy);base.vy=0;
      }
    }
  }
  _resolvePlayerPair(before){
    if(this.players.length!==2)return;
    const a=this.players[0],b=this.players[1],oa=before[0],ob=before[1],epsilon=.0001;
    if(Math.abs(a.x-b.x)>=32-epsilon)return;
    if(Math.abs(a.y-(b.y-b.h))<=epsilon&&a.vy>=0){a.grounded=true;a.support=b.index;a.vy=0;return;}
    if(Math.abs(b.y-(a.y-a.h))<=epsilon&&b.vy>=0){b.grounded=true;b.support=a.index;b.vy=0;return;}
    if(a.y<=b.y-b.h+epsilon||b.y<=a.y-a.h+epsilon)return;
    let top=null,bottom=null,oldTop=null,oldBottom=null;
    if(oa.y<=ob.y-b.h+.1){top=a;bottom=b;oldTop=oa;oldBottom=ob;}
    else if(ob.y<=oa.y-a.h+.1){top=b;bottom=a;oldTop=ob;oldBottom=oa;}
    if(top){
      const overlap=top.y-(bottom.y-bottom.h);
      const wasRider=oldTop.grounded&&Math.abs(oldTop.y-(oldBottom.y-bottom.h))<.1;
      const bumpFromBelow=!wasRider&&oldBottom.vy<0&&Math.abs(bottom.y-oldBottom.y)>Math.max(0,top.y-oldTop.y);
      let remaining=overlap;
      if(bumpFromBelow){
        const shift=this._sweepY(bottom,remaining);bottom.y+=shift;remaining-=shift;bottom.vy=Math.max(0,bottom.vy);
      }
      if(remaining>epsilon){const shift=this._sweepY(top,-remaining);top.y+=shift;remaining+=shift;}
      if(remaining>epsilon){const shift=this._sweepY(bottom,remaining);bottom.y+=shift;remaining-=shift;bottom.vy=Math.max(0,bottom.vy);}
      if(remaining<.001){
        top.grounded=true;top.support=bottom.index;top.vy=Math.min(0,top.vy);
        if(bumpFromBelow)bottom.vy=Math.max(0,bottom.vy);
        return;
      }
      // A confined vertical contact has no room to stack. Use the existing
      // horizontal order, with map-constrained separation, instead of clipping.
    }
    const left=oa.x<=ob.x?a:b,right=left===a?b:a;
    let overlap=32-(right.x-left.x);
    let shift=this._sweepX(left,-overlap/2);left.x+=shift;overlap+=shift;
    shift=this._sweepX(right,overlap);right.x+=shift;overlap-=shift;
    if(overlap>epsilon){shift=this._sweepX(left,-overlap);left.x+=shift;overlap+=shift;}
    if(left.kb>0)left.kb=0;if(right.kb<0)right.kb=0;
  }
  _stepPlayers(dt){
    const travel=Math.max(...this.players.map(p=>Math.max(Math.abs(p.vx+p.kb),Math.abs(p.vy))))*dt;
    const steps=Math.max(1,Math.ceil(travel/6)),step=dt/steps;
    for(let n=0;n<steps;n++){
      const before=this._bodySnapshots();
      for(const p of this.players)this._moveWorld(p,step,true);
      this._carryRiders(before);this._resolvePlayerPair(before);
    }
  }
  _movePlayer(p,dt,visuals=true){
    // Ghosts used by CPU navigation must never collide with the live players.
    const live=visuals&&this.mode==='playing'&&this.players.includes(p);
    const travel=Math.max(Math.abs(p.vx+p.kb),Math.abs(p.vy))*dt,steps=live?Math.max(1,Math.ceil(travel/6)):1;
    for(let n=0;n<steps;n++){
      const snapshot=live?this._bodySnapshots():null;
      this._moveWorld(p,dt/steps,visuals);
      if(live){this._carryRiders(snapshot);this._resolvePlayerPair(snapshot);}
    }
  }
  // The CPU chooses ordinary inputs. Navigation uses the same collider and jump
  // velocity as people; its graph contains only physically simulated landings.
  _buildNavigation(player){
    const surfaces=[{x:19,y:FLOOR,w:W-38,id:0},...(this.map.platforms||[]).map((b,i)=>({...b,id:i+1}))];
    const nodes=[],speed=player.char.speed||230;
    const clear=(x,y)=>!(this.map.platforms||[]).some(b=>x+16>b.x&&x-16<b.x+b.w&&y-1>b.y&&y-67<b.y+b.h);
    for(const surface of surfaces){
      const xs=[surface.x+17,surface.x+surface.w-17,surface.x+surface.w/2];
      if(surface.id)xs.push(surface.x-13,surface.x+3,surface.x+surface.w-3,surface.x+surface.w+13);
      for(let x=surface.x+17;x<surface.x+surface.w-16;x+=48)xs.push(x);
      // Extra take-off points make narrow 90–140px steps reachable without
      // requiring artificial midair steering or stronger jumps.
      if(surface.id===0)for(const b of this.map.platforms||[])xs.push(b.x-65,b.x-115,b.x+b.w+65,b.x+b.w+115);
      for(const x of xs){
        if(x<19||x>W-19||!clear(x,surface.y))continue;
        if(nodes.some(n=>n.surface===surface.id&&Math.abs(n.x-x)<5))continue;
        nodes.push({id:nodes.length,x,y:surface.y,surface:surface.id,edges:[]});
      }
    }
    const walkClear=(a,b)=>{
      if(Math.abs(a.y-b.y)>2)return false;
      const steps=Math.ceil(Math.abs(a.x-b.x)/12);
      for(let n=0;n<=steps;n++)if(!clear(a.x+(b.x-a.x)*n/Math.max(1,steps),a.y))return false;
      return true;
    };
    for(const surface of surfaces){
      const row=nodes.filter(n=>n.surface===surface.id).sort((a,b)=>a.x-b.x);
      for(let i=1;i<row.length;i++)if(walkClear(row[i-1],row[i])){
        for(const [a,b] of [[row[i-1],row[i]],[row[i],row[i-1]]])a.edges.push({from:a.id,to:b.id,kind:'walk',dir:Math.sign(b.x-a.x),cost:Math.abs(a.x-b.x)/speed});
      }
    }
    for(const from of nodes){
      for(const kind of ['jump','drop'])for(const dir of [-1,1]){
        const ghost={x:from.x,y:from.y,vx:dir*speed,vy:kind==='jump'?-650:0,kb:0,h:68,grounded:kind!=='jump'};
        let airborne=false;
        for(let step=0;step<180;step++){
          ghost.vy+=1450/90;this._movePlayer(ghost,1/90,false);
          if(!ghost.grounded)airborne=true;
          if(airborne&&ghost.grounded){
            const candidates=nodes.filter(n=>Math.abs(n.y-ghost.y)<2&&walkClear(ghost,n));
            candidates.sort((a,b)=>Math.abs(a.x-ghost.x)-Math.abs(b.x-ghost.x));
            const to=candidates[0];
            if(to&&to.id!==from.id&&Math.abs(to.x-ghost.x)<65){
              const cost=(step+1)/90+.12+Math.abs(to.x-ghost.x)/speed;
              const existing=from.edges.find(e=>e.to===to.id);
              if(!existing||existing.cost>cost){if(existing)from.edges.splice(from.edges.indexOf(existing),1);from.edges.push({from:from.id,to:to.id,kind,dir,cost});}
            }
            break;
          }
          if(step>20&&Math.abs(ghost.x-from.x)<1)break;
        }
      }
    }
    return {nodes,walkClear};
  }
  _cpuPlan(player,target){
    const {nodes,walkClear}=this.cpu.nav;
    const starts=nodes.filter(n=>Math.abs(n.y-player.y)<3&&walkClear(player,n));
    starts.sort((a,b)=>Math.abs(a.x-player.x)-Math.abs(b.x-player.x));
    const start=starts[0];if(!start)return null;
    const distance=new Array(nodes.length).fill(Infinity),previous=new Array(nodes.length),visited=new Set();distance[start.id]=0;
    while(visited.size<nodes.length){
      let current=-1,best=Infinity;
      for(let i=0;i<nodes.length;i++)if(!visited.has(i)&&distance[i]<best){best=distance[i];current=i;}
      if(current<0)break;visited.add(current);
      for(const edge of nodes[current].edges){const next=best+edge.cost;if(next<distance[edge.to]){distance[edge.to]=next;previous[edge.to]=edge;}}
    }
    let goal=start,score=Infinity;
    for(const n of nodes){if(!Number.isFinite(distance[n.id]))continue;
      const candidate=Math.hypot(n.x-target.x,(n.y-target.y)*2.7)+distance[n.id]*9;
      if(candidate<score){score=candidate;goal=n;}
    }
    if(goal.id===start.id)return {approach:start.x,edge:null,goal};
    let edge=previous[goal.id];
    while(edge&&edge.from!==start.id)edge=previous[edge.from];
    return edge?{approach:start.x,edge,goal}:null;
  }
  _cpuVisible(player,target,vertical=false){
    const x=player.x,y=player.y-36;
    if(vertical){const end=target.y-36;return !(this.map.platforms||[]).some(b=>x>b.x-4&&x<b.x+b.w+4&&Math.max(Math.min(y,end),b.y)<Math.min(Math.max(y,end),b.y+b.h));}
    const end=target.x,lo=Math.min(x,end)+18,hi=Math.max(x,end)-18;
    return !(this.map.platforms||[]).some(b=>y>b.y-4&&y<b.y+b.h+4&&b.x<hi&&b.x+b.w>lo);
  }
  _cpuControl(player,dt){
    const ai=this.cpu,target=this.players[1-player.index],dx=target.x-player.x,dy=target.y-player.y,ax=Math.abs(dx),ay=Math.abs(dy),toward=Math.sign(dx)||player.face;
    const input={move:0,jump:false,attack:false,ult:null};
    const steer=x=>clamp((x-player.x)/Math.max(1,(player.char.speed||230)*dt),-1,1);
    // The opponent is a real moving support. Step off deliberately instead of
    // repeatedly steering toward their center while standing on their helmet.
    if(player.support===target.index||ai.dismount){
      if(!ai.dismount){
        const preferred=player.x<W/2?1:-1;
        const canStep=direction=>Math.abs(this._sweepX(player,direction*40))>20;
        ai.dismount=canStep(preferred)?preferred:-preferred;ai.route=null;ai.flight=null;
      }
      input.move=ai.dismount;
      if(player.support!==target.index&&Math.abs(dx)>44)ai.dismount=null;
      return input;
    }
    ai.reaction-=dt;ai.replan-=dt;ai.dodge=Math.max(0,ai.dodge-dt);
    const random=()=>{ai.seed=(Math.imul(ai.seed,1664525)+1013904223)>>>0;return ai.seed/4294967296;};
    const horizontal=ay<42&&this._cpuVisible(player,target),above=dy<-45&&ax<38&&this._cpuVisible(player,target,true);
    const basic=player.char.projectile?horizontal&&ax<Math.min(player.char.range||600,650):ay<60&&ax<(player.char.range||74)+6&&this._cpuVisible(player,target);
    let ultimate=null;
    if(player.ultRemaining<=0){
      if(player.char.ultType==='dash'){
        if(horizontal&&ax<195)ultimate={x:toward,y:0};else if(above&&-dy<175)ultimate={x:0,y:-1};
      }else if(player.char.ultType==='nova'){
        if(Math.hypot(dx,dy)<190)ultimate=ay>ax&&dy<0?{x:0,y:-1}:{x:toward,y:0};
      }else{
        if(horizontal&&ax<570)ultimate={x:toward,y:0};else if(above&&-dy<570)ultimate={x:0,y:-1};
      }
    }
    if(ai.reaction<=0){
      ai.reaction=.2+random()*.17;
      if(player.attackTimer<=0&&(basic||ultimate)){
        input.attack=true;input.ult=ultimate;
        // A one-frame movement turn obeys the same facing rule as keyboard play.
        if(!ultimate&&player.face!==toward)input.move=toward;
      }
      if(player.grounded&&ai.dodge<=0&&this.projectiles.some(b=>b.owner!==player.index&&Math.abs(b.y-(player.y-35))<38&&Math.abs(b.x-player.x)<145&&(player.x-b.x)*b.vx>0)&&random()<.55){input.jump=true;ai.dodge=1.25;}
    }
    if(ai.flight){
      ai.flight.elapsed+=dt;if(!player.grounded)ai.flight.air=true;
      if((ai.flight.air&&player.grounded&&ai.flight.elapsed>.07)||ai.flight.elapsed>2.3){ai.flight=null;ai.route=null;ai.replan=0;}
      else{input.move=ai.flight.dir;return input;}
    }
    // Good shooting/striking positions are held for a relaxed reaction, rather
    // than constantly running through the opponent and attacking every frame.
    if(basic||ultimate){
      ai.route=null;
      if(!input.attack){
        input.move=0;
        if(player.char.projectile&&horizontal&&ax<135&&player.grounded){
          const retreat={x:player.x-toward*26,y:player.y};
          const supported=player.y===FLOOR||(this.map.platforms||[]).some(b=>Math.abs(b.y-player.y)<2&&retreat.x+12>b.x&&retreat.x-12<b.x+b.w);
          if(retreat.x>22&&retreat.x<W-22&&supported&&ai.nav.walkClear(player,retreat))input.move=-toward;
        }
      }
      return input;
    }
    if(!player.grounded){input.move=toward;return input;}
    if(!ai.route&&ai.replan<=0){ai.route=this._cpuPlan(player,target);ai.replan=.28;}
    const route=ai.route;
    if(route){
      const edge=route.edge,approach=route.approach;
      if(Math.abs(player.y-(edge?ai.nav.nodes[edge.from].y:route.goal.y))>3){ai.route=null;return input;}
      if(Math.abs(player.x-approach)>1){input.move=steer(approach);return input;}
      if(!edge){
        if(ax>40)input.move=toward;ai.route=null;return input;
      }
      if(edge.kind==='walk'){
        const destination=ai.nav.nodes[edge.to];input.move=steer(destination.x);
        // Once a walking edge starts, approach its destination on every frame.
        route.approach=destination.x;
        if(Math.abs(player.x-destination.x)<1){ai.route=null;input.move=0;ai.replan=0;}
      }else{
        input.move=edge.dir;input.jump=edge.kind==='jump';
        ai.flight={dir:edge.dir,air:false,elapsed:0};ai.route=null;
      }
    }else input.move=toward;
    return input;
  }
  _attack(p,intent=null){
    if(this.mode!=='playing'||this.paused||this.countdown>0||p.attackTimer>0||(p.hp<=0&&!this._attackPhaseAlive?.has(p.index)))return;
    const k=KEYS[p.index],left=this.keys.has(k.left),right=this.keys.has(k.right),up=this.keys.has(k.up);
    const wantsUlt=intent?!!intent.dir:left||right||up;
    if(wantsUlt&&p.ultRemaining<=0){let dir=intent?intent.dir:left&&right?{x:0,y:0}:up?{x:0,y:-1}:{x:right?1:-1,y:0};this._ultimate(p,dir);return;}
    if(wantsUlt&&p.ultRemaining>0&&(!p.lastCoolText||this.visualTime-p.lastCoolText>2.5)){this._text(p.x,p.y-105,`大招冷却 ${Math.ceil(p.ultRemaining)}s`,'#dfe8f5',.8);p.lastCoolText=this.visualTime;}
    p.attackTimer=p.char.attackCooldown||.5;p.attackPose=1;p.heldRepeat=p.attackTimer+.03;
    if(p.char.projectile){
      const ball=p.char.archetype==='ball';this._spawnProjectile(p,{x:p.face,y:0},{damage:p.char.damage,speed:ball?435:p.char.archetype==='gun'?820:570,radius:ball?10:5,life:ball?4:1.65,bounce:p.char.bounce||0,pierce:!!p.char.pierce,kind:ball?'ball':p.char.archetype==='magic'?'orb':p.char.archetype==='bow'?'arrow':'bullet'});
      this._tone(ball?340:620,.055,'triangle',.035);
    }else{
      const range=p.char.range||74,tx=p.x+p.face*range*.56;
      this.effects.push({type:'slash',x:p.x,y:p.y-37,dx:p.face,dy:0,radius:range,color:col(p.char.hue,90,82),life:.22,maxLife:.22});
      const target=this.players[1-p.index];if(Math.abs(target.y-p.y)<67&&(target.x-p.x)*p.face>=-15&&Math.abs(target.x-p.x)<=range+17&&!this._solidBetween(p.x,p.y-36,target.x,target.y-36))this._damage(target,p.char.damage,p,p.face,0);
      if(p.char.archetype==='shield')p.guard=.3;
      this._tone(p.char.archetype==='hammer'?125:220,.07,'triangle',.035);
    }
  }
  _ultimate(p,dir){
    const c=p.char,t=this.players[1-p.index],color=col(c.hue,90,76);p.ultRemaining=p.ultCooldown;p.attackTimer=Math.max(.65,c.attackCooldown||.5);p.heldRepeat=p.attackTimer+.1;p.attackPose=1;
    this._text(p.x,p.y-115,c.ultName,color,1.15);this._burst(p.x,p.y-35,color,22);this.shake=5;this._tone(150,.13,'sawtooth',.045);this._tone(500,.15,'triangle',.04);
    const stationary=!dir.x&&!dir.y,damage=c.damage;
    if(c.ultType==='nova'||(stationary&&c.ultType==='dash')){
      const radius=c.ultType==='nova'?145:125,cx=p.x+(stationary?0:dir.x*70),cy=p.y-35+(stationary?0:dir.y*70);
      this.effects.push({type:'nova',x:cx,y:cy,radius,color,life:.5,maxLife:.5});
      if(stationary&&c.ultType==='dash'){
        this.effects.push({type:'slash',x:p.x,y:p.y-37,dx:1,dy:0,radius,color,life:.32,maxLife:.32});
        this.effects.push({type:'slash',x:p.x,y:p.y-37,dx:-1,dy:0,radius,color,life:.32,maxLife:.32});
      }
      if(Math.hypot(t.x-cx,t.y-35-cy)<radius+20&&(c.ultType!=='dash'||!this._solidBetween(p.x,p.y-36,t.x,t.y-36)))this._damage(t,damage*(stationary?2.6:3.05),p,Math.sign(t.x-p.x)||p.face,-.3);
      if(c.archetype==='shield')p.guard=1.1;
    }else if(c.ultType==='dash'){
      const oldX=p.x,oldY=p.y;p.kb=dir.x*700;if(dir.y<0)p.vy=-650;
      // A short, collision-checked dash never teleports through walls.
      const dashDistance=175,steps=12;for(let n=0;n<steps;n++){
        const lastX=p.x,lastY=p.y;p.vx=dir.x*dashDistance/steps*60;p.vy=dir.y*dashDistance/steps*60;this._movePlayer(p,1/60);
        const contact=dir.y<0?Math.abs(t.x-p.x)<40&&t.y<=p.y&&p.y-t.y<=p.h+.1:Math.abs(t.x-p.x)<55&&Math.abs(t.y-p.y)<65;
        if(contact&&!this._solidBetween(p.x,p.y-36,t.x,t.y-36)){this._damage(t,damage*2.8,p,dir.x,dir.y);break;}
        if((dir.x&&Math.abs(p.x-lastX)<1)||(dir.y&&Math.abs(p.y-lastY)<1))break;
      }
      p.vx=0;p.vy=dir.y<0?-250:0;
      this.effects.push({type:'trail',x:oldX,y:oldY-35,x2:p.x,y2:p.y-35,color,life:.35,maxLife:.35});
    }else if(c.ultType==='beam'){
      // Stationary beam splits into two independently obstruction-tested rays.
      if(stationary){this._castBeam(p,{x:-1,y:0},damage*2.3,color);this._castBeam(p,{x:1,y:0},damage*2.3,color);}
      else this._castBeam(p,dir,damage*3.15,color);
    }else if(stationary){
      // The original ultimate pattern survives a stationary cast: a full radial fan.
      const count=c.ultType==='volley'?8:c.ultType==='rain'?10:6;
      const factor=c.ultType==='volley'?.45:c.ultType==='rain'?.4:.55;
      for(let i=0;i<count;i++){
        const angle=i/count*Math.PI*2,dx=Math.cos(angle),dy=Math.sin(angle);
        this._spawnProjectile(p,{x:dx,y:dy},{damage:damage*factor,speed:c.ultType==='rain'?500:620,radius:c.archetype==='ball'?12:8,life:2.3,bounce:Math.max(c.bounce||0,c.archetype==='ball'?6:0),pierce:c.pierce||c.ultType==='rain',kind:c.archetype==='ball'?'ball':c.archetype==='bow'?'arrow':'orb',ultimate:true});
      }
    }else if(c.ultType==='rain'){
      // Directed cluster: the first projectile follows the requested direction.
      for(let i=0;i<6;i++){const angle=(i-2.5)*.12,dx=dir.x*Math.cos(angle)-dir.y*Math.sin(angle),dy=dir.x*Math.sin(angle)+dir.y*Math.cos(angle);
        this._spawnProjectile(p,{x:dx,y:dy},{damage:damage*.7,speed:490+i*25,radius:7,life:2.1,bounce:c.bounce||0,pierce:true,kind:c.archetype==='ball'?'ball':'orb',ultimate:true});}
    }else{
      const count=c.ultType==='volley'?5:3;
      for(let i=0;i<count;i++){const angle=(i-(count-1)/2)*.16,dx=dir.x*Math.cos(angle)-dir.y*Math.sin(angle),dy=dir.x*Math.sin(angle)+dir.y*Math.cos(angle);
        this._spawnProjectile(p,{x:dx,y:dy},{damage:damage*(count===5?.75:1.1),speed:620,radius:c.archetype==='ball'?12:8,life:2.3,bounce:Math.max(c.bounce||0,c.archetype==='ball'?6:0),pierce:c.pierce||false,kind:c.archetype==='ball'?'ball':'orb',ultimate:true});}
    }
  }
  _solidBetween(x1,y1,x2,y2){
    // A swept segment prevents short melee ranges and muzzles from reaching
    // through thin walls. Touching a solid endpoint is an obstruction too.
    for(const b of this.map.platforms||[]){
      let near=0,far=1,miss=false;
      for(const [origin,delta,min,max] of [[x1,x2-x1,b.x,b.x+b.w],[y1,y2-y1,b.y,b.y+b.h]]){
        if(Math.abs(delta)<.000001){if(origin<=min||origin>=max){miss=true;break;}}
        else{const first=(min-origin)/delta,last=(max-origin)/delta;near=Math.max(near,Math.min(first,last));far=Math.min(far,Math.max(first,last));if(near>far){miss=true;break;}}
      }
      if(!miss&&near<=1&&far>=0)return true;
    }
    return false;
  }
  _castBeam(p,dir,damage,color){
    const x=p.x,y=p.y-35,halfWidth=10;
    let reach=630;
    // Clip the full luminous beam against solid scenery, including origin overlap.
    for(const b of this.map.platforms||[]){
      if(dir.x&&y+halfWidth>b.y&&y-halfWidth<b.y+b.h){
        if(x>=b.x&&x<=b.x+b.w){reach=0;continue;}
        const d=dir.x>0?b.x-x:x-b.x-b.w;if(d>=0)reach=Math.min(reach,d);
      }
      if(dir.y&&x+halfWidth>b.x&&x-halfWidth<b.x+b.w){
        if(y>=b.y&&y<=b.y+b.h){reach=0;continue;}
        const d=dir.y>0?b.y-y:y-b.y-b.h;if(d>=0)reach=Math.min(reach,d);
      }
    }
    this.effects.push({type:'beam',x,y,dx:dir.x,dy:dir.y,radius:reach,color,life:.38,maxLife:.38});
    const target=this.players[1-p.index];
    const targetLeft=target.x-17,targetRight=target.x+17,targetTop=target.y-target.h,targetBottom=target.y;
    let hits=false;
    if(dir.x&&y+halfWidth>targetTop&&y-halfWidth<targetBottom){
      const near=dir.x>0?targetLeft-x:x-targetRight,far=dir.x>0?targetRight-x:x-targetLeft;
      hits=far>=0&&near<=reach&&reach>0;
    }
    if(dir.y&&x+halfWidth>targetLeft&&x-halfWidth<targetRight){
      const near=dir.y>0?targetTop-y:y-targetBottom,far=dir.y>0?targetBottom-y:y-targetTop;
      hits=far>=0&&near<=reach&&reach>0;
    }
    if(hits)this._damage(target,damage,p,dir.x,dir.y);
    return reach;
  }
  _spawnProjectile(p,dir,o){this.projectiles.push({owner:p.index,x:p.x,y:p.y-36,vx:dir.x*o.speed,vy:dir.y*o.speed,radius:o.radius,damage:o.damage,life:o.life,bounce:o.bounce,pierce:o.pierce,kind:o.kind,color:col(p.char.hue,86,72),ultimate:o.ultimate,trail:[],hits:new Map(),age:0});}
  _projectileTick(dt){
    for(const b of this.projectiles){b.life-=dt;b.age+=dt;b.trail.unshift({x:b.x,y:b.y});if(b.trail.length>7)b.trail.pop();
      const steps=Math.max(1,Math.ceil(Math.hypot(b.vx,b.vy)*dt/9)),step=dt/steps;
      for(let n=0;n<steps&&b.life>0;n++){
        const ox=b.x,oy=b.y;b.x+=b.vx*step;b.y+=b.vy*step;
        let hitX=false,hitY=false,resolveX=ox,resolveY=oy;
        if(b.x-b.radius<0||b.x+b.radius>W){hitX=true;resolveX=clamp(b.x,b.radius+.1,W-b.radius-.1);}
        if(b.y-b.radius<0||b.y+b.radius>FLOOR){hitY=true;resolveY=clamp(b.y,b.radius+.1,FLOOR-b.radius-.1);}
        for(const r of this.map.platforms||[]){if(b.x+b.radius>r.x&&b.x-b.radius<r.x+r.w&&b.y+b.radius>r.y&&b.y-b.radius<r.y+r.h){
          const side=ox+b.radius<=r.x||ox-b.radius>=r.x+r.w;
          const vertical=oy+b.radius<=r.y||oy-b.radius>=r.y+r.h;
          if(side||(!vertical&&Math.abs(b.vx)>=Math.abs(b.vy))){hitX=true;resolveX=b.vx>=0?r.x-b.radius-.1:r.x+r.w+b.radius+.1;}
          else{hitY=true;resolveY=b.vy>=0?r.y-b.radius-.1:r.y+r.h+b.radius+.1;}
        }}
        if(hitX||hitY){if(b.bounce>0){if(hitX)b.vx*=-1;if(hitY)b.vy*=-1;b.x=resolveX;b.y=resolveY;b.bounce--;this._burst(b.x,b.y,b.color,3);}
          else{b.life=0;this._burst(b.x,b.y,b.color,5);break;}}
        const target=this.players[1-b.owner];if(target&&b.x+b.radius>target.x-17&&b.x-b.radius<target.x+17&&b.y+b.radius>target.y-target.h&&b.y-b.radius<target.y){
          if(!b.hits.has(target.index)||b.age-b.hits.get(target.index)>.25){
            b.hits.set(target.index,b.age);this._damage(target,b.damage,this.players[b.owner],Math.sign(b.vx),Math.sign(b.vy)*.3);
            if(!b.pierce){b.life=0;break;}
          }
        }
      }
    }
    this.projectiles=this.projectiles.filter(b=>b.life>0).slice(-100);
  }
  _damage(target,amount,source,dx,dy){
    if(target.hp<=0||target.invuln>0)return;
    amount=Math.round(amount*(target.guard>0?.45:1));target.hp=Math.max(0,target.hp-amount);target.flash=.16;target.invuln=.065;target.kb+=dx*110;target.vy=Math.min(target.vy,dy<0?-160:-70);
    this._burst(target.x,target.y-37,col(source.char.hue,90,76),9);this._text(target.x+rand(-10,10),target.y-83,`−${amount}`,'#fff2d7',.65);this.shake=Math.max(this.shake,3.2);
    this._tone(100,.055,'triangle',.035);
  }
  _finishTime(){
    const diff=this.players[0].hp/this.players[0].maxHp-this.players[1].hp/this.players[1].maxHp;
    this._finish(Math.abs(diff)<1e-9?null:diff>0?0:1,'time');
  }
  _finish(winner,reason){if(this.ended)return;this.ended=true;this.mode='ended';this.keys.clear();this.projectiles=[];this._updateUI();
    if(winner!==null){const p=this.players[winner];this._burst(p.x,p.y-60,col(p.char.hue,90,76),60);}
    this.onState('ended');this.onEnd({winner,reason,players:this.players.map(p=>({hp:p.hp,maxHp:p.maxHp,char:p.char})),time:this.time});
  }
  _updateUI(){this.onUpdate({players:this.players.map(p=>({hp:p.hp,maxHp:p.maxHp,ultRemaining:p.ultRemaining,ultCooldown:p.ultCooldown,facing:p.face})),time:this.time,paused:this.paused,countdown:this.countdown||0});}
  _burst(x,y,color,count){for(let i=0;i<count;i++)this.particles.push({x,y,vx:rand(-180,180),vy:rand(-210,90),life:rand(.25,.7),maxLife:.7,r:rand(2,5),color,gravity:390});}
  _dust(x,y,count){for(let i=0;i<count;i++)this.particles.push({x:x+rand(-10,10),y:y-3,vx:rand(-40,40),vy:rand(-45,-10),life:rand(.18,.4),maxLife:.4,r:rand(2,5),color:'#e8e9d1',gravity:0});}
  _text(x,y,text,color,life=1){this.texts.push({x,y,text,color,life,maxLife:life});}
  _tone(freq,duration,type='sine',volume=.04){if(!this.sound)return;try{if(!this.audio)this.audio=new (window.AudioContext||window.webkitAudioContext)();if(this.audio.state==='suspended')this.audio.resume();const a=this.audio,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(freq,a.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(40,freq*.55),a.currentTime+duration);g.gain.setValueAtTime(volume,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+duration);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+duration);}catch{}}
  _render(){
    const ctx=this.ctx;ctx.setTransform(this.canvas.width/W,0,0,this.canvas.height/H,0,0);ctx.clearRect(0,0,W,H);ctx.save();
    if(this.shake>0&&this.mode==='playing'&&!this.paused)ctx.translate(rand(-this.shake,this.shake),rand(-this.shake,this.shake));
    this._background(ctx);
    for(const b of this.map.platforms||[])this._platform(ctx,b);
    for(const p of this.players){
      ctx.save();ctx.globalAlpha=.18;ctx.fillStyle='#263f45';ctx.beginPath();ctx.ellipse(p.x,FLOOR+4,24*Math.max(.4,1-(FLOOR-p.y)/400),7,0,0,Math.PI*2);ctx.fill();ctx.restore();
      const idle=this.mode==='preview'?Math.sin(this.visualTime*2+p.index)*1.5:0;
      const teamColor=p.index?'#f3b181':'#b8edaa';
      ctx.save();ctx.fillStyle=teamColor;ctx.globalAlpha=.24;ctx.beginPath();ctx.ellipse(p.x,p.y+2,29,8,0,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=.95;ctx.strokeStyle=teamColor;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(p.x,p.y+2,29,8,0,0,Math.PI*2);ctx.stroke();ctx.restore();
      if(p.guard>0){ctx.globalAlpha=.3;circle(ctx,p.x,p.y-35,49,col(p.char.hue,80,75));ctx.globalAlpha=1;}
      if(p.flash>0)ctx.globalAlpha=.35+Math.sin(p.flash*70)*.25;
      fighter(ctx,p.char,p.x,p.y+idle,.86,p.face,p.motion,p.attackPose,p.index,this.visualTime);ctx.globalAlpha=1;
      if(this.mode==='playing'||this.mode==='ended'){
        const tagY=p.y-111;ctx.fillStyle='#29384b';smoothRect(ctx,p.x-20,tagY,40,21,6);ctx.fill();
        ctx.strokeStyle=teamColor;ctx.lineWidth=1.5;ctx.stroke();shape(ctx,[[p.x-6,tagY+24],[p.x+6,tagY+24],[p.x,tagY+31]],teamColor);
        ctx.fillStyle=teamColor;ctx.font='800 12px sans-serif';ctx.textAlign='center';ctx.fillText(this.cpuPlayer===p.index?'CPU':`P${p.index+1}`,p.x,tagY+15);
      }
    }
    this._drawProjectiles(ctx);this._drawEffects(ctx);
    for(const p of this.particles){ctx.globalAlpha=Math.min(1,p.life/.2);circle(ctx,p.x,p.y,p.r,p.color);}ctx.globalAlpha=1;
    for(const t of this.texts){ctx.globalAlpha=Math.min(1,t.life/.2);ctx.textAlign='center';ctx.font='bold 15px "PingFang SC",sans-serif';ctx.lineWidth=3;ctx.strokeStyle='#273148';ctx.strokeText(t.text,t.x,t.y);ctx.fillStyle=t.color;ctx.fillText(t.text,t.x,t.y);}ctx.globalAlpha=1;
    if(this.mode==='playing'&&this.countdown>0){
      ctx.fillStyle='rgba(25,39,55,.14)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#fffae7';ctx.shadowColor='rgba(23,36,48,.3)';ctx.shadowBlur=18;ctx.font='900 78px sans-serif';ctx.fillText(Math.ceil(this.countdown),W/2,250);ctx.shadowBlur=0;ctx.font='600 16px "PingFang SC",sans-serif';ctx.fillText('准备好，决斗即将开始',W/2,285);
    }
    if(this.paused){ctx.fillStyle='rgba(25,39,55,.28)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#fff8e4';ctx.font='bold 30px "PingFang SC",sans-serif';ctx.fillText('对决已暂停',W/2,255);ctx.font='15px "PingFang SC",sans-serif';ctx.fillText('按 ESC 或点击继续',W/2,285);}
    ctx.restore();
  }
  _background(ctx){
    const t=this.visualTime,theme=this.map.theme||'grove',accent=this.map.accent||'#6f8c61';
    const palettes={grove:['#b7d7d6','#f0edcf'],ruins:['#bec8d5','#e6e3da'],neon:['#242d53','#68557d'],lava:['#6b5558','#ce8a72'],ice:['#b1d4e0','#e9f2ed'],desert:['#e9c89e','#f3e2bd'],temple:['#c2c6d2','#e4dfd8'],sky:['#a6cbdc','#e9ece4'],factory:['#a8bcc1','#d6d8cb'],moon:['#273b58','#7485a2']};
    const colors=this.map.bg||palettes[theme]||palettes.grove;const gradient=ctx.createLinearGradient(0,0,0,FLOOR);gradient.addColorStop(0,colors[0]);gradient.addColorStop(1,colors[1]);ctx.fillStyle=gradient;ctx.fillRect(0,0,W,H);
    const night=theme==='neon'||theme==='moon',moon=theme==='moon';
    circle(ctx,moon?830:845,92,night?37:45,night?'#eee7bd':'#faf3ce');
    if(night){for(let i=0;i<30;i++){const x=(i*137+32)%W,y=(i*59)%200+20;ctx.globalAlpha=.3+.3*Math.sin(t+i);circle(ctx,x,y,1.2,'#ffffdf');}ctx.globalAlpha=1;}
    else{ctx.fillStyle='rgba(255,255,246,.35)';for(let i=0;i<5;i++){let x=((i*281+t*3)%1350)-100;ctx.beginPath();ctx.ellipse(x,60+(i%3)*40,65,12,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(x+35,54+(i%3)*40,37,20,0,0,7);ctx.fill();}}
    // Distant mountains establish depth in every arena.
    ctx.fillStyle=night?'rgba(36,45,70,.5)':'rgba(91,139,145,.18)';
    shape(ctx,[[0,330],[0,257],[100,201],[192,276],[297,152],[430,282],[568,202],[727,280],[855,177],[1010,274],[1100,226],[1100,420]],ctx.fillStyle);
    shape(ctx,[[0,420],[0,333],[171,274],[315,339],[478,272],[615,346],[825,277],[975,350],[1100,308],[1100,460]],night?'rgba(42,61,75,.35)':'rgba(95,143,138,.21)');
    if(['grove','sky','ice','moon'].includes(theme)){
      for(let i=0;i<10;i++){const x=i*132-22,base=435+(i%3)*10,h=94+(i*41)%130;this._tree(ctx,x,base,h,theme==='ice'?'#adc9cb':night?'#3d5870':'#86aca0',.55);}
      for(const x of [38,1070])this._tree(ctx,x,473,205,theme==='ice'?'#82b6bd':night?'#2d4e65':'#567e70',.9);
    }else if(['ruins','temple'].includes(theme)){
      for(let i=0;i<7;i++){const x=i*185+40,y=252+(i%3)*32;ctx.fillStyle='rgba(110,125,141,.24)';ctx.fillRect(x,y,31,210);ctx.fillRect(x-9,y-9,49,12);ctx.fillStyle='rgba(220,222,214,.3)';ctx.fillRect(x+6,y+5,5,180);}
      ctx.strokeStyle='rgba(91,109,111,.22)';ctx.lineWidth=11;ctx.beginPath();ctx.arc(548,336,98,Math.PI,0);ctx.stroke();
    }else if(theme==='neon'||theme==='factory'){
      for(let i=0;i<12;i++){const x=i*99,h=85+(i*71)%145;ctx.fillStyle=night?'#34425d':'rgba(91,121,132,.26)';ctx.fillRect(x,450-h,75,h);
        ctx.fillStyle=night?'rgba(200,148,216,.45)':'rgba(226,231,213,.4)';for(let n=0;n<4;n++)ctx.fillRect(x+11+(n%2)*35,466-h+Math.floor(n/2)*30,13,8);}
      if(theme==='factory'){ctx.strokeStyle='rgba(66,97,109,.35)';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(170,260);ctx.lineTo(170,220);ctx.lineTo(400,220);ctx.lineTo(400,390);ctx.stroke();}
    }else if(theme==='desert'){
      shape(ctx,[[0,429],[275,298],[530,436]],'#d5b18a');shape(ctx,[[420,440],[785,284],[1100,430]],'#dfbd94');
      for(const x of[78,1005]){ctx.strokeStyle='#8d9e77';ctx.lineWidth=15;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,468);ctx.lineTo(x,368);ctx.moveTo(x,418);ctx.lineTo(x-22,418);ctx.lineTo(x-22,391);ctx.moveTo(x,402);ctx.lineTo(x+22,402);ctx.lineTo(x+22,375);ctx.stroke();}
    }else if(theme==='lava'){
      shape(ctx,[[0,470],[0,360],[88,296],[175,430],[290,328],[410,470]],'#8e7774');shape(ctx,[[660,470],[792,325],[902,399],[1030,300],[1100,390],[1100,470]],'#8e7774');
      for(let i=0;i<14;i++){const x=(i*89+t*6)%W,y=420-((t*22+i*31)%250);ctx.globalAlpha=.4;circle(ctx,x,y,2,'#ffd4a2');}ctx.globalAlpha=1;
    }
    // Solid ground with layered edge, pebbles and sparse grass.
    ctx.fillStyle=night?'#485861':theme==='desert'?'#bd9b72':theme==='ice'?'#8daeb4':theme==='lava'?'#725a58':'#758b69';ctx.fillRect(0,FLOOR,W,H-FLOOR);
    ctx.fillStyle=night?'#83978d':theme==='desert'?'#e4c596':theme==='ice'?'#e7f4ed':theme==='lava'?'#d49b79':'#b2c29a';ctx.fillRect(0,FLOOR,W,9);
    ctx.fillStyle='rgba(41,53,56,.1)';ctx.fillRect(0,FLOOR+9,W,4);
    for(let i=0;i<48;i++){const x=(i*137)%W,y=FLOOR+21+(i*17)%33;ctx.fillStyle=i%2?'rgba(230,232,206,.17)':'rgba(35,61,53,.12)';smoothRect(ctx,x,y,5+(i%3)*4,3,2);ctx.fill();}
    if(!['desert','lava','factory','neon'].includes(theme)){ctx.strokeStyle=night?'#82998b':'#94a77c';ctx.lineWidth=2;for(let i=0;i<32;i++){const x=(i*173)%W;ctx.beginPath();ctx.moveTo(x,FLOOR+1);ctx.lineTo(x-3,FLOOR-6);ctx.moveTo(x,FLOOR+1);ctx.lineTo(x+3,FLOOR-8);ctx.stroke();}}
    // Near-camera sprigs frame the scene without obstructing play.
    for(const x of[14,1084]){ctx.fillStyle=night?'#415e64':'#6c916f';ctx.beginPath();ctx.ellipse(x,FLOOR+5,22,10,-.4,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(x-9,FLOOR+3,10,21,-.6,0,7);ctx.fill();}
  }
  _tree(ctx,x,y,h,color,alpha){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.fillRect(x-6,y-h*.65,12,h*.65);shape(ctx,[[x-h*.25,y-h*.32],[x,y-h],[x+h*.25,y-h*.32]],color);shape(ctx,[[x-h*.32,y-h*.17],[x,y-h*.83],[x+h*.32,y-h*.17]],color);ctx.restore();}
  _platform(ctx,b){
    const theme=this.map.theme||'grove',night=theme==='moon'||theme==='neon';ctx.save();
    ctx.fillStyle='rgba(31,46,49,.12)';smoothRect(ctx,b.x+4,b.y+6,b.w,b.h,4);ctx.fill();
    ctx.fillStyle=night?'#586576':theme==='ice'?'#98c2ce':theme==='desert'?'#c4a17f':theme==='lava'?'#7e6868':'#8e9d8c';smoothRect(ctx,b.x,b.y,b.w,b.h,5);ctx.fill();
    ctx.fillStyle=night?'#a8a8bd':theme==='ice'?'#edf6f4':theme==='lava'?'#cf997c':'#c9d0ae';smoothRect(ctx,b.x,b.y,b.w,7,[5,5,1,1]);ctx.fill();
    ctx.strokeStyle='rgba(49,64,63,.18)';ctx.lineWidth=1;for(let x=b.x+22;x<b.x+b.w-8;x+=36){ctx.beginPath();ctx.moveTo(x,b.y+10);ctx.lineTo(x+6,b.y+b.h-3);ctx.stroke();}
    if(theme==='grove'){ctx.strokeStyle='#90a478';ctx.lineWidth=2;for(let x=b.x+10;x<b.x+b.w-10;x+=28){ctx.beginPath();ctx.moveTo(x,b.y+3);ctx.lineTo(x-3,b.y-4);ctx.stroke();}}
    if(theme==='neon'){ctx.shadowBlur=10;ctx.shadowColor=this.map.accent||'#bd9fe7';ctx.fillStyle=this.map.accent||'#bd9fe7';ctx.fillRect(b.x+5,b.y+2,b.w-10,2);}
    ctx.restore();
  }
  _drawProjectiles(ctx){for(const b of this.projectiles){
    for(let i=b.trail.length-1;i>=0;i--){ctx.globalAlpha=(1-i/b.trail.length)*.18;circle(ctx,b.trail[i].x,b.trail[i].y,b.radius*(1-i/b.trail.length*.7),b.color);}ctx.globalAlpha=1;
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));
    if(b.kind==='ball'){ctx.rotate(b.age*8);circle(ctx,0,0,b.radius+1,'#6c483b');circle(ctx,0,0,b.radius-1,'#efa14d');ctx.strokeStyle='#986034';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(-b.radius,0);ctx.lineTo(b.radius,0);ctx.moveTo(0,-b.radius);ctx.lineTo(0,b.radius);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,b.radius*.4,b.radius,0,0,7);ctx.stroke();}
    else if(b.kind==='arrow'){ctx.strokeStyle='#735a49';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-13,0);ctx.lineTo(10,0);ctx.stroke();shape(ctx,[[15,0],[7,-4],[7,4]],'#fbf4d8');}
    else{ctx.shadowColor=b.color;ctx.shadowBlur=b.ultimate?16:8;circle(ctx,0,0,b.radius,b.color);circle(ctx,-1,-1,b.radius*.45,'#fffbe5');}
    ctx.restore();
  }}
  _drawEffects(ctx){for(const e of this.effects){const progress=1-e.life/e.maxLife;ctx.save();ctx.strokeStyle=e.color;ctx.fillStyle=e.color;ctx.globalAlpha=Math.min(1,e.life/.12);ctx.lineCap='round';
    if(e.type==='slash'){ctx.translate(e.x,e.y);ctx.scale(e.dx,1);ctx.lineWidth=7*(1-progress)+2;ctx.beginPath();ctx.arc(0,0,e.radius*(.5+progress*.5),-.9+progress*.35,.9+progress*.35);ctx.stroke();ctx.globalAlpha*=.18;ctx.lineWidth=19;ctx.stroke();}
    else if(e.type==='nova'){ctx.lineWidth=9*(1-progress)+2;ctx.beginPath();ctx.arc(e.x,e.y,e.radius*(.25+.75*progress),0,7);ctx.stroke();ctx.globalAlpha*=.1;ctx.fill();}
    else if(e.type==='beam'){ctx.shadowColor=e.color;ctx.shadowBlur=20;ctx.lineWidth=23*(1-progress)+3;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+e.dx*e.radius,e.y+e.dy*e.radius);ctx.stroke();ctx.strokeStyle='#fff9db';ctx.lineWidth=6;ctx.stroke();}
    else if(e.type==='trail'){ctx.lineWidth=22*(1-progress)+2;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x2,e.y2);ctx.stroke();}
    ctx.restore();
  }}
}
