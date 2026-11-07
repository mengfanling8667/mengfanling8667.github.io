import OpenCC from './vendor/opencc.js';
import {ITEMS,EVENTS} from './data.js';
import {ITEM_EN} from './item-en.js';
import {EVENT_EN} from './events-en.js';
import {EXPANSION_EVENT_EN} from './expansion-items.js';
import {UI_EN} from './ui-en.js';
import {SYSTEM_EN} from './system-en.js';
const languages=new Set(['zh-CN','zh-TW','en']);
let language='zh-CN';try{const stored=localStorage.getItem('lastlight-language');if(languages.has(stored))language=stored;}catch{}
const traditional=OpenCC.Converter({from:'cn',to:'tw'});
const strings=new Map(Object.entries({...UI_EN,...SYSTEM_EN}));
const unknown=new Set();
function pair(source,target){if(typeof source==='string'&&typeof target==='string'&&target)strings.set(source,target);}
function pairTree(source,target){if(!source||!target)return;for(const key of ['title','text','label','result','failResult','name','description'])pair(source[key],target[key]);for(const key of ['sendPerson','failSendPerson','victory'])if(source[key]&&target[key])pairTree(source[key],target[key]);if(source.choices&&target.choices)source.choices.forEach((c,i)=>pairTree(c,target.choices[i]));}
for(const item of Object.values(ITEMS))pairTree(item,ITEM_EN[item.id]||{name:item.nameEn,description:item.descriptionEn});
for(const event of EVENTS)pairTree(event,EVENT_EN[event.id]||EXPANSION_EVENT_EN[event.id]);
const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
let phraseRE;
function phrasePattern(){return phraseRE??=new RegExp([...strings.keys()].filter(Boolean).sort((a,b)=>b.length-a.length).map(escapeRE).join('|'),'g');}
export function addEnglish(map){for(const [s,t]of Object.entries(map))pair(s,t);phraseRE=null;}
export function getLanguage(){return language;}
export function setLanguage(value){if(!languages.has(value))return;language=value;try{localStorage.setItem('lastlight-language',value)}catch{} }
export function untranslated(){return [...unknown];}
const hasHan=s=>/[\u3400-\u9fff]/.test(s);
function english(raw,depth=0){
 if(!hasHan(raw))return raw;
 const lead=raw.match(/^\s*/)[0],tail=raw.match(/\s*$/)[0],text=raw.trim();
 if(strings.has(text))return lead+strings.get(text)+tail;
 if(depth>5)return raw;
 const sub=s=>english(s,depth+1);
 const actor='(陆远|夏晴|小禾|阿野|家人)';
 const rules=[
  [/^第 (\d+) 天 \/ STILL HERE$/,(_,n)=>`DAY ${n} / STILL HERE`],
  [/^第 (\d+) 天$/,(_,n)=>`Day ${n}`],
  [/^七天教程 · 第 (\d+) 课$/,(_,n)=>`Tutorial · Lesson ${n}`],
  [/^继续存档 · (.+)$/,(_,x)=>`Continue · ${sub(x)}`],
  [/^准备一次探索 · (\d+) \/ 4 手$/,(_,n)=>`Prepare an expedition · ${n} / 4 hands`],
  [/^(\d+) \/ 4 手$/,(_,n)=>`${n} / 4 hands`],
  [/^(\d+) 手 · (.+)$/,(_,n,x)=>`${n} hand${n==='1'?'':'s'} · ${sub(x)}`],
  [/^(\d+)手 \/ 库存(\d+)$/,(_,n,q)=>`${n} hand${n==='1'?'':'s'} / stock ${q}`],
  [/^(\d+) 天$/,(_,n)=>`${n} days`],
  [/^当前照顾：(.+)$/,(_,x)=>`Caring for: ${sub(x)}`],
  [/^对 (.+) 使用$/,(_,x)=>`Use on ${sub(x)}`],
  [/^携带占 (\d+) 手$/,(_,n)=>`Carry space: ${n} hands`],
  [/^库存 (\d+) 件$/,(_,n)=>`In stock: ${n}`],
  [/^(\d+) 个可交互事件，选择会在未来回响。$/,(_,n)=>`${n} interactive events. Your choices echo into the future.`],
  [/^(\d+) 种物资、多条获救路线与百日挑战。$/,(_,n)=>`${n} supplies, multiple rescue routes, and a 100-day challenge.`],
  [/^当前共 (\d+) 个可交互事件：避难所 (\d+) 个，外出 (\d+) 个。(.+)$/,(_,a,b,c)=>`${a} interactive events: ${b} in the shelter and ${c} outside. Events depend on the disaster, supplies, people and earlier decisions. Stories have their own continuations. Hidden effects and probabilities stay hidden.`],
  [new RegExp('^'+actor+'：(.+)$'),(_,n,x)=>`${sub(n)}: ${sub(x)}`],
  [new RegExp('^'+actor+'使用了(.+?)。(.+)$'),(_,n,i,x)=>`${sub(n)} used ${sub(i)}. ${sub(x)}`],
  [new RegExp('^'+actor+'在途中使用了随身携带的(.+?)。(.+)$'),(_,n,i,x)=>`${sub(n)} used the packed ${sub(i)} along the way. ${sub(x)}`],
  [new RegExp('^'+actor+'完成约定的行动回来了。(.+)$'),(_,n,x)=>`${sub(n)} returned from the mission. ${sub(x)}`],
  [new RegExp('^'+actor+'推开舱门走了出去。你们约好，几天后在这里重逢。$'),(_,n)=>`${sub(n)} opens the hatch and steps outside. You agree to meet here again in a few days.`],
  [new RegExp('^'+actor+'已经出发。$'),(_,n)=>`${sub(n)} has departed.`],
  [new RegExp('^'+actor+'正在外面探索$'),(_,n)=>`${sub(n)} is exploring outside`],
  [new RegExp('^'+actor+'正在外出，请先等其回来。$'),(_,n)=>`${sub(n)} is outside. Wait for their return first.`],
  [new RegExp('^'+actor+'(已离世|正在外出|下落不明|不在避难所|暂时不适合这次行动)$'),(_,n,x)=>`${sub(n)}: ${sub(x)}`],
  [new RegExp('^'+actor+'终于重新回到了家人身边。$'),(_,n)=>`${sub(n)} is finally back with the family.`],
  [new RegExp('^'+actor+'没有回来，也没有留下可以追寻的消息。$'),(_,n)=>`${sub(n)} does not return, leaving no trace to follow.`],
  [new RegExp('^'+actor+'离开避难所执行这次约定的行动。$'),(_,n)=>`${sub(n)} leaves the shelter on the agreed mission.`],
  [new RegExp('^'+actor+'终于回来了，身上还带着这几天奔波留下的不适。$'),(_,n)=>`${sub(n)} finally returns, still suffering from the journey.`],
  [new RegExp('^'+actor+'的脚步沉重，需要在避难所休息。$'),(_,n)=>`${sub(n)} returns exhausted and needs rest in the shelter.`],
  [new RegExp('^'+actor+'回程时遭遇了危险，仍咬牙把物资带了回来。$'),(_,n)=>`${sub(n)} faces danger on the way back, but still brings the supplies home.`],
  [new RegExp('^'+actor+'回来了，带回一些补给和未用完的随身物品。$'),(_,n)=>`${sub(n)} returns with supplies and the remaining packed items.`],
  [new RegExp('^'+actor+'回来了，但没有找到能带走的补给。$'),(_,n)=>`${sub(n)} returns without finding supplies to bring home.`],
  [new RegExp('^'+actor+'再也认不出家人的声音。尸变在避难所里蔓延，没有人逃过这一夜。$'),(_,n)=>`${sub(n)} no longer recognizes the family's voices. The infection takes over the shelter; nobody survives.`],
  [new RegExp('^天亮后，你们发现'+actor+'没有醒来。(.+)带走了这位家人。$'),(_,n,x)=>`At dawn, ${sub(n)} does not wake. The cause was ${sub(x).toLowerCase()}.`],
  [/^铜灯微微发亮。等光芒散去，地上多了(.+)。$/,(_,i)=>`The lamp glows softly. When the light fades, ${sub(i)} lies on the floor.`],
  [/^愿望得到了回应：(.+)。$/,(_,i)=>`Your wish is answered: ${sub(i)}.`],
  [/^(.+)损坏或遗失了。$/,(_,i)=>`${sub(i)} was damaged or lost.`],
  [/^(.+)产出了(.+)，已经放入物资架。$/,(_,i,o)=>`${sub(i)} produced ${sub(o)}, now stored on the shelf.`],
  [/^(.+)缺少(.+)，本轮没有产出。$/,(_,i,need)=>`${sub(i)} is missing ${sub(need)}. No output this cycle.`],
  [/^绿衣访客带走了(.+)，说会交给更需要的人。$/,(_,items)=>`The visitors in green take ${sub(items)}, saying they will give it to people in greater need.`],
  [/^缺少：(.+)。$/,(_,x)=>`Missing: ${sub(x)}.`],
  [/^需要以下任一物品：(.+)。$/,(_,x)=>`Requires one of: ${sub(x)}.`],
  [/^没有可选家人：(.+)。$/,(_,x)=>`No eligible survivor: ${sub(x)}.`],
  [/^(.+)：选择家人$/,(_,x)=>`${sub(x)}: choose a survivor`],
  [/^(.+) 已安全$/,(_,x)=>`${sub(x)} is safe`],
 ];
 for(const [re,fn]of rules)if(re.test(text))return lead+text.replace(re,fn)+tail;
 const result=text.replace(phrasePattern(),m=>strings.get(m)).replace(/、/g,', ').replace(/；/g,'; ').replace(/：/g,': ').replace(/。/g,'. ').replace(/，/g,', ').replace(/（/g,' (').replace(/）/g,')').replace(/(\d+)手/g,'$1 hands').replace(/(\d+)hands/g,(_,n)=>`${n} ${n==='1'?'hand':'hands'}`);
 if(hasHan(result))unknown.add(text);
 return lead+result+tail;
}
export function T(text,locale=language){text=String(text??'');if(locale==='zh-TW')return traditional(text);return locale==='en'?english(text):text;}
const rawNodes=new WeakMap(),rawAttributes=new WeakMap();
export function localizeDOM(root=document.body){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(node.parentElement?.closest('script,style,.language-picker'))continue;
  let raw=rawNodes.get(node);if(raw===undefined){raw=node.nodeValue;rawNodes.set(node,raw)}node.nodeValue=T(raw);
 }
 for(const el of root.querySelectorAll('[title],[aria-label],[placeholder],[alt]')){
  let raw=rawAttributes.get(el);if(!raw){raw={};for(const attr of ['title','aria-label','placeholder','alt'])if(el.hasAttribute(attr))raw[attr]=el.getAttribute(attr);rawAttributes.set(el,raw)}
  for(const [key,value]of Object.entries(raw))el.setAttribute(key,T(value));
 }
 document.documentElement.lang=language==='zh-TW'?'zh-Hant':language;
 document.title=T('余烬60秒')+' · '+T('避难所');
}
