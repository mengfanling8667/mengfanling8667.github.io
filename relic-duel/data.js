// Chest Duel: deterministic roster definitions; currencies and draws live in app.js.
export const QUALITIES = [
  { id: 'white', name: '白色', label: '普通', color: '#dce5e7', rank: 0 },
  { id: 'yellow', name: '黄色', label: '优良', color: '#e9ce65', rank: 1 },
  { id: 'green', name: '绿色', label: '精良', color: '#73d49c', rank: 2 },
  { id: 'blue', name: '蓝色', label: '稀有', color: '#74b9ff', rank: 3 },
  { id: 'purple', name: '紫色', label: '史诗', color: '#bc94ef', rank: 4 },
  { id: 'orange', name: '橙色', label: '传说', color: '#f1a363', rank: 5 },
  { id: 'red', name: '红色', label: '神话', color: '#fa7885', rank: 6 },
];

// name, archetype, normal move, ultimate move, ultimate pattern, flavor, hue
const ROSTER = [
  [
    ['剑士','sword','横斩','破阵突刺','dash','最初的旅伴。挥剑贴身压制，以突刺打破僵局。',158],
    ['见习弓手','bow','木羽箭','三箭齐发','volley','保持距离的入门射手，适合开阔的地形。',90],
    ['木杖学徒','magic','微光弹','星屑散射','burst','把第一道魔法藏在掌心，近身时放出一圈微光。',265],
    ['巡路枪手','gun','短铳射击','快枪连射','volley','直线火力稳定，在窄路上更容易命中。',35],
    ['草帽枪兵','spear','竹枪突击','一路向前','dash','长一点的距离，让朴素的枪法也有机会。',55],
    ['铁锤工','hammer','敲铁','开工震荡','nova','挥锤稍慢，但每一下都很扎实。',25],
    ['木盾卫','shield','盾击','圆盾震波','nova','在近处守住自己的节奏，用震波赶开对手。',190],
    ['跑腿刺客','dagger','短刃','急步穿刺','dash','轻快的步伐与紧凑的连击，靠近才是开始。',300],
    ['小镰农夫','scythe','割草斩','丰收回旋','burst','一把日常用的小镰，也能划出漂亮的弧线。',110],
    ['街头球童','ball','直线投球','双球快攻','volley','篮球会在墙面上反弹，找好角度就出手。',28],
    ['青铜侍从','sword','青铜斩','勇气冲锋','dash','扎实的基础剑术，是每一位侍从的底气。',48],
    ['松林猎人','bow','松针箭','林间箭雨','rain','弓弦声很轻，落下的箭却足够醒目。',132],
    ['烛火使','magic','火苗','烛光盛放','burst','小小的烛火，在身边绽成温暖的火环。',16],
    ['矿洞守卫','hammer','碎石锤','落岩冲击','nova','以力气换取命中时的回报，擅长近身交锋。',210],
    ['石桥卫士','spear','石尖枪','过桥突进','dash','枪尖先行，越过双方之间那一点距离。',180],
    ['铜哨兵','gun','铜丸','守望扫射','beam','沿着朝向开火，让狭窄通道变成自己的阵地。',45],
    ['夜跑客','dagger','轻刃','风中追影','dash','攻击距离短，却有灵活的脚步作伴。',235],
    ['旧书术士','magic','纸页飞弹','散页风暴','rain','翻开旧书，几页纸便成了空中的魔法。',280],
  ],
  [
    ['练习生','ball','胯下投篮','全场应援','volley','穿透篮球能多次弹墙，再次命中需短暂间隔；障碍越多越有发挥空间。',27],
    ['枪手','gun','精准点射','火力封锁','beam','笔直而迅速的子弹，在狭长通道里格外强势。',42],
    ['银刃游侠','sword','银光斩','银刃突袭','dash','干净利落的横斩，接上一段迅速的突进。',195],
    ['花园弓手','bow','花刺箭','繁花箭阵','rain','在合适的位置拉弓，让花瓣与箭一起落下。',338],
    ['黄沙枪兵','spear','沙锋刺','流沙冲锋','dash','枪尖卷起细沙，擅长把握中近距离。',40],
    ['铜甲卫','shield','铜甲撞击','铜墙震荡','nova','更厚实的体魄，让每次贴身交换都更从容。',36],
    ['铃铛法师','magic','铃音弹','回响之环','burst','清亮的音符飞向对手，铃声在身侧回响。',278],
    ['双刀客','dagger','双刃交错','疾风双闪','dash','两把短刀节奏紧凑，需要大胆寻找近身机会。',15],
    ['赤岩锤手','hammer','赤岩重锤','岩心迸发','nova','舍去一点灵巧，换来更有分量的一击。',12],
    ['月牙镰客','scythe','月牙割','月轮回旋','burst','镰刃扫过的弧线，比看上去更远一些。',214],
    ['萤火术士','magic','流萤','萤火星落','rain','把夜色中的光点聚成一束，再撒向空中。',98],
    ['信风射手','bow','风羽箭','顺风连珠','volley','喜欢开阔地形的远程射手，出箭节奏轻快。',172],
    ['纸鸢匠','magic','纸鸢飞刃','满天纸鸢','volley','纸鸢飞得低而稳，连发时铺开一道扇面。',57],
    ['港口水手','sword','船锚斩','乘浪突击','dash','以宽刃劈开近处的空隙，向着目标乘浪前进。',204],
    ['烟花匠','gun','火星弹','绽放礼炮','burst','平时用火星瞄准，关键时刻让烟花近身绽放。',352],
    ['黑街投手','ball','贴地弹球','转角双投','volley','弹球善于拐弯，在墙壁密集处寻找第二次机会。',315],
  ],
  [
    ['疾风剑客','sword','疾风斩','风切无痕','dash','剑势与脚步都更快，适合主动接近对手。',170],
    ['翡翠猎手','bow','翠羽箭','千叶齐射','volley','箭矢穿过林隙，偏爱有高台的战场。',137],
    ['霜花法师','magic','霜晶弹','霜花盛开','burst','凝成晶体的冷光飞出，贴身时会向四周绽放。',195],
    ['荒野警长','gun','左轮点射','正午决斗','beam','直线火力与稳健体魄，让决斗只需一条路。',32],
    ['翠竹武者','spear','翠竹刺','竹影破阵','dash','修长的枪身先一步抵达，在中距离牵制对手。',99],
    ['铁壁骑士','shield','铁壁重击','壁垒震波','nova','用更厚的护甲承受压力，再以震波重整距离。',210],
    ['巡山力士','hammer','裂石击','山鸣地动','nova','挥动大锤需要片刻，命中却足以改变局面。',31],
    ['影足斥候','dagger','暗影割','踏影穿梭','dash','步伐轻盈，短刃需要在最近的距离出手。',263],
    ['碧月收割者','scythe','碧月弧','碧月轮舞','burst','宽阔的镰刃划出弧光，适合把守平台边缘。',160],
    ['街球高手','ball','旋转弹球','街头风暴','volley','让篮球在障碍间穿行，反弹也是进攻的一部分。',22],
    ['星草祭司','magic','星草光球','星草天降','rain','以星草为引，召来从上方落下的光点。',84],
    ['林间风笛手','magic','风笛音波','林风回响','burst','音符沿着朝向飞行，合奏时在近处汇成波纹。',145],
    ['机巧弩师','bow','连机弩箭','机弩齐鸣','volley','机关弩弦出手利落，擅长持续压住一条射线。',55],
    ['绿洲游骑','sword','绿洲弯刀','沙海奔袭','dash','弯刀与迅捷的脚步，让开阔战场也有近战机会。',115],
  ],
  [
    ['苍蓝剑卫','sword','苍蓝重斩','蓝锋破军','dash','沉稳的剑卫，用更坚实的生命与剑锋推进。',218],
    ['潮汐术士','magic','潮涌弹','潮汐回环','burst','把海潮压成飞弹，再令力量向四面涌出。',192],
    ['雷鸣枪手','gun','雷鸣弹','雷光贯线','beam','用一条明亮的射线，在狭窄地形抢占先机。',220],
    ['冰原猎弓','bow','冰羽箭','极地箭雨','rain','在高台上寻找射界，让冷光从空中落下。',185],
    ['深海枪骑','spear','海渊突刺','破浪长驱','dash','长枪保持距离，冲锋在瞬间缩短距离。',200],
    ['蓝晶守护者','shield','晶盾冲击','晶壁脉冲','nova','晶盾与厚实的体魄，让近身交战更有底气。',202],
    ['风暴锤卫','hammer','风暴重击','雷锤震地','nova','一击沉重，周围迸发的震波同样不容小觑。',233],
    ['幽蓝刺客','dagger','幽蓝刃','蓝影掠杀','dash','迅捷而贴近地面，让对手难以保持舒适距离。',250],
    ['暮海镰使','scythe','暮浪弧斩','深蓝轮舞','burst','弧刃与涌动的蓝光，善于覆盖近处的空间。',210],
    ['幻彩投手','ball','幻彩弹射','七色回旋球','volley','穿透弹球把反弹变成连击，在复杂地图持续制造压力。',292],
    ['流星学者','magic','蓝星飞弹','星轨坠落','rain','计算星轨之后，天空也成了出手的方向。',235],
    ['发条狙手','gun','发条铅弹','精密连发','volley','机关让射击规律而密集，适合把握对手落地的瞬间。',44],
  ],
  [
    ['紫电剑豪','sword','紫电拔刀','雷切瞬身','dash','剑锋带着雷光，突进的一刻最为危险。',270],
    ['梦境织法者','magic','梦丝光弹','绮梦星爆','burst','梦丝凝成飞弹，星爆在近处绽出一圈紫光。',280],
    ['暗夜裁决','gun','裁决之弹','终夜贯穿','beam','在一条射线上倾注火力，逼迫对手寻找高低差。',285],
    ['紫藤神射','bow','紫藤箭','万藤天落','rain','以细致的箭术覆盖上方，平台无法完全遮住天空。',289],
    ['虚空枪卫','spear','虚空尖刺','空隙突进','dash','长枪先行，向着选定方向划开一道紫色轨迹。',258],
    ['晶冠圣盾','shield','晶冠盾击','王冠脉冲','nova','高大的护盾承受对抗，近身脉冲负责回应。',276],
    ['陨铁战锤','hammer','陨铁崩击','碎星震荡','nova','重锤拥有强大的单次威力，出手前要找准机会。',316],
    ['暮色舞者','dagger','暮色双刃','月下疾舞','dash','短距离的迅速切入，是这位舞者最熟悉的舞步。',324],
    ['冥月执镰','scythe','冥月斩','幽月轮回','burst','宽阔的镰影划出危险区域，贴身时尤其强势。',254],
    ['星环球王','ball','星环弹球','星轨连投','volley','高弹性的穿透篮球，能在障碍之间反复威胁同一目标。',286],
  ],
  [
    ['曙光剑圣','sword','曙光斩','旭日破阵','dash','传说中的剑锋与体魄，用明亮的突进开启交锋。',37],
    ['日冕法皇','magic','日冕光球','烈阳盛放','burst','将烈阳凝于掌中，近处盛放时光芒覆盖四方。',31],
    ['烈焰枪王','gun','烈焰枪火','日落火线','beam','强劲的直线火力，在狭路上形成极大压力。',16],
    ['凤凰神弓','bow','凤羽飞箭','天火箭雨','rain','凤羽射向前方，天火则从头顶降临。',22],
    ['龙脊枪皇','spear','龙脊穿刺','金龙破空','dash','长枪与冲势合而为一，足以主导中近距离的战斗。',43],
    ['黄金堡垒','shield','金盾裁击','辉煌震波','nova','厚重的黄金盾与生命力，适合正面承受交锋。',47],
    ['熔星巨锤','hammer','熔星重击','天崩炉火','nova','以缓慢但极具分量的一击，换取震撼的回报。',13],
    ['流金幻刃','dagger','流金切割','金影穿心','dash','敏捷的身影带着金色双刃，擅长迅速进入近身。',50],
  ],
  [
    ['赤霄剑神','sword','赤霄一剑','天穹断界','dash','神话级的剑术，以压倒性的剑锋贯穿前路。',354],
    ['绯红星主','magic','绯红星核','群星寂灭','burst','赤色星核飞向目标，爆发的星环环绕周身。',343],
    ['终焉枪神','gun','终焉裁决弹','地平线终章','beam','把神话级的力量压进直线火力，狭路更显威力。',350],
    ['天陨神弓','bow','天陨赤羽','万星坠世','rain','每一支赤羽都有非凡的力量，星雨从天而降。',5],
    ['龙焰圣枪','spear','龙焰贯刺','赤龙天征','dash','裹着龙焰的长枪，以强劲冲锋主导近处战局。',10],
    ['永夜收割者','scythe','永夜弧刃','血月终舞','burst','神话中的镰刃横扫近处，以血月的光辉结束轮舞。',330],
  ],
];

const ARCHETYPES = {
  sword: {hp:1,damage:1,speed:1,cd:0.48,range:76,projectile:false},
  bow: {hp:0.95,damage:0.94,speed:1.015,cd:0.58,range:590,projectile:true},
  gun: {hp:0.96,damage:0.88,speed:0.99,cd:0.43,range:700,projectile:true},
  magic: {hp:0.94,damage:1.07,speed:0.98,cd:0.62,range:520,projectile:true},
  ball: {hp:0.98,damage:0.8,speed:1.04,cd:0.69,range:700,projectile:true},
  spear: {hp:1.01,damage:1.03,speed:0.99,cd:0.57,range:111,projectile:false},
  hammer: {hp:1.11,damage:1.28,speed:0.9,cd:0.78,range:86,projectile:false},
  shield: {hp:1.18,damage:0.92,speed:0.92,cd:0.61,range:66,projectile:false},
  dagger: {hp:0.92,damage:0.76,speed:1.12,cd:0.31,range:56,projectile:false},
  scythe: {hp:0.98,damage:1.1,speed:1.01,cd:0.63,range:102,projectile:false},
};

// Existing identities keep their original ids even when their quality changes.
// Save files store ids, so new heroes are appended rather than inserted by tier.
const TIER_OVERRIDES = new Map([[69,1],[76,1],[77,2],[81,3],[82,2],[83,3]]);
const SOURCE_ROSTER = [
  ...ROSTER.flatMap((group,sourceTier) => group.map((entry,index) => ({entry,sourceTier,index}))),
  {entry:['苔石拳卫','shield','苔盾推击','青苔震环','nova','随身带着一面长出青苔的木盾，靠扎实的体魄守住近处。',120],sourceTier:0,index:18},
  {entry:['风车小匠','magic','旋叶飞弹','风车星旋','burst','把小风车转成魔法飞弹，近处散开的旋叶像一阵微风。',70],sourceTier:0,index:19},
];

// Estimate ultimate pressure from the engine's actual payload, reach, area and
// repeat-hit mechanics. This is a balance index, not guaranteed hit damage:
// scenery and aim still determine how much of the attack connects.
const ULT_PROFILES = {
  dash:  {payload:2.8, reach:175, coverage:1},
  nova:  {payload:3.05,reach:145, coverage:1.14},
  beam:  {payload:3.15,reach:630, coverage:1.07},
  burst: {payload:3.3, reach:1426,coverage:1.06},
  volley:{payload:3.75,reach:1426,coverage:1.10},
  rain:  {payload:4.2, reach:1160,coverage:1.13},
};
function ultimateBalance(damage,ultType,archetype,bounce,pierce) {
  const profile=ULT_PROFILES[ultType];
  const reachFactor=1+Math.min(profile.reach/1100,1)*0.18;
  // Ball ultimates have at least six wall bounces; rain always pierces.
  const ultBounces=archetype==='ball'?Math.max(6,bounce):bounce;
  const mechanicsFactor=1+Math.min(ultBounces,10)*0.02+((pierce||ultType==='rain')?0.12:0);
  const ultPower=+(damage*profile.payload*reachFactor*profile.coverage*mechanicsFactor).toFixed(1);
  return {
    ultPower,
    ultPowerLabel:ultPower>=450?'极高爆发':ultPower>=300?'高强爆发':ultPower>=180?'强力爆发':ultPower>=100?'中等爆发':'轻量爆发',
    // More damage/coverage always costs more recovery time, regardless of tier.
    ultCooldown:+Math.min(50,6+ultPower*0.066).toFixed(1),
  };
}

export const CHARACTERS = SOURCE_ROSTER.map(({entry,sourceTier,index},id) => {
  const tier=TIER_OVERRIDES.get(id)??sourceTier;
  const [name,archetype,basicName,ultName,ultType,description,hue] = entry;
  const a = ARCHETYPES[archetype];
  const variation = 0.97 + (index % 7) * 0.01;
  const damage=Math.round([14,21,31,45,66,96,140][tier] * a.damage * (1.03 - (index % 6) * 0.01));
  const bounce=archetype==='ball'?(name==='练习生'?9:4+tier):0;
  const pierce=archetype==='ball'&&name!=='街头球童';
  return {
    id, name, quality: QUALITIES[tier].id, tier, archetype, hue,
    hp: Math.round([120,160,215,285,375,495,650][tier] * a.hp * variation),
    damage,
    speed: Math.round((216 + tier * 3) * a.speed * (0.985 + (index % 4) * 0.01)),
    attackCooldown: +(a.cd * (1 + (index % 5 - 2) * 0.018)).toFixed(3),
    ...ultimateBalance(damage,ultType,archetype,bounce,pierce),
    range: a.range + (index % 3) * (a.projectile ? 15 : 3),
    basicName, ultName, description, projectile: a.projectile,
    bounce, pierce, ultType,
    passive: archetype === 'ball' ? '弹墙后继续飞行；穿透球可间隔命中' : archetype === 'hammer' ? '重击威力高，出手间隔较长' : archetype === 'shield' ? '同品质中生命值较高' : archetype === 'dagger' ? '移速快、攻击快，需要贴近目标' : a.projectile ? '远程攻击，善用地形与距离' : '近身攻击，方向决定出手朝向',
  };
});

export const CHESTS = [
  {id:'common',name:'普通宝箱',price:100,count:1,subtitle:'每一段冒险，从这里开始',weights:[80000,15000,4000,850,130,19,1],color:'#c4aa7c'},
  {id:'rare',name:'稀有宝箱',price:320,count:1,subtitle:'保底黄色，向更好的相遇出发',weights:[0,80000,16500,3000,450,45,5],color:'#8bc7ae'},
  {id:'large',name:'大宝箱',price:280,count:3,subtitle:'一次三位角色，概率与普通相同',weights:[80000,15000,4000,850,130,19,1],color:'#b898d1'},
  {id:'diamond',name:'钻石宝箱',price:1200,count:1,subtitle:'保底绿色，红色概率 0.1%',weights:[0,0,78000,17000,4000,900,100],color:'#83cce2'},
];

// Arena logical size 1100×530. The engine supplies the common ground at y=470.
export const MAPS = [
  {id:'grove',name:'静谧林地',subtitle:'开阔草地 · 均衡交锋',theme:'grove',accent:'#a4c487',bg:['#d7e7d1','#ecf0d9'],platforms:[{x:300,y:365,w:150,h:22},{x:650,y:365,w:150,h:22},{x:480,y:265,w:140,h:20}]},
  {id:'ruins',name:'回音遗迹',subtitle:'密集障碍 · 弹射天堂',theme:'ruins',accent:'#b1b39c',bg:['#dce2d2','#e9e6cf'],platforms:[{x:270,y:380,w:72,h:90},{x:435,y:305,w:70,h:165},{x:595,y:305,w:70,h:165},{x:760,y:380,w:72,h:90},{x:330,y:190,w:115,h:20},{x:655,y:190,w:115,h:20}]},
  {id:'neon',name:'霓虹长街',subtitle:'狭长通道 · 枪手主场',theme:'neon',accent:'#bd8ab6',bg:['#e2d9e7','#f0e1ec'],platforms:[{x:255,y:330,w:590,h:26},{x:60,y:225,w:210,h:22},{x:830,y:225,w:210,h:22}]},
  {id:'lava',name:'余烬熔炉',subtitle:'阶梯高台 · 争夺制高点',theme:'lava',accent:'#ce8c73',bg:['#e9d3c8','#f5e6d5'],platforms:[{x:270,y:380,w:120,h:90},{x:430,y:290,w:100,h:180},{x:570,y:290,w:100,h:180},{x:710,y:380,w:120,h:90}]},
  {id:'ice',name:'霜白庭院',subtitle:'对称双台 · 远近皆宜',theme:'ice',accent:'#97c4ce',bg:['#d6e6e9','#edf2ee'],platforms:[{x:250,y:350,w:215,h:22},{x:635,y:350,w:215,h:22},{x:485,y:250,w:130,h:20}]},
  {id:'desert',name:'落日沙海',subtitle:'低矮掩体 · 把握出手时机',theme:'desert',accent:'#ceac74',bg:['#edddbd','#f4e9d0'],platforms:[{x:275,y:405,w:100,h:65},{x:470,y:360,w:160,h:110},{x:725,y:405,w:100,h:65}]},
  {id:'temple',name:'青玉神殿',subtitle:'错落石阶 · 灵活切换路线',theme:'temple',accent:'#81aaa0',bg:['#d3e3dc','#e7ece1'],platforms:[{x:255,y:375,w:125,h:22},{x:435,y:280,w:100,h:22},{x:565,y:280,w:100,h:22},{x:720,y:375,w:125,h:22},{x:470,y:180,w:160,h:20}]},
  {id:'sky',name:'浮云群岛',subtitle:'多层平台 · 立体追逐',theme:'sky',accent:'#a3b9d0',bg:['#d4e5ee','#eef1eb'],platforms:[{x:230,y:365,w:180,h:22},{x:690,y:365,w:180,h:22},{x:455,y:280,w:190,h:22},{x:285,y:180,w:125,h:20},{x:690,y:180,w:125,h:20}]},
  {id:'factory',name:'发条工坊',subtitle:'交错墙台 · 反弹与伏击',theme:'factory',accent:'#ae9b85',bg:['#dedbd3','#ece5d6'],platforms:[{x:260,y:380,w:90,h:90},{x:410,y:290,w:105,h:25},{x:585,y:290,w:105,h:25},{x:750,y:380,w:90,h:90},{x:465,y:395,w:170,h:75},{x:425,y:190,w:250,h:20}]},
  {id:'moon',name:'月影回廊',subtitle:'上下双路 · 选择你的进攻线',theme:'moon',accent:'#a6a0c0',bg:['#dcdcea','#eeebf1'],platforms:[{x:260,y:365,w:580,h:24},{x:350,y:255,w:130,h:22},{x:620,y:255,w:130,h:22},{x:485,y:155,w:130,h:20}]},
];
