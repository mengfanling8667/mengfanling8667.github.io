import {EXPANSION_ITEMS,EXPANSION_EVENTS} from './expansion-items.js';
import {LEGACY_ROUTE_EVENTS} from './legacy-endings.js';
import {LEGACY_SHELTER_EVENTS,LEGACY_ITEMS} from './legacy-shelter.js';
import {LEGACY_OUTSIDE_EVENTS} from './legacy-outside.js';
import {LEGACY_TRADE_EVENTS} from './legacy-trades.js';
export const DIFFICULTIES = [
 {id:'little-boy',name:'小男孩',type:'nuclear',level:1,description:'冲击波之后仍有补给可寻，适合第一次走进避难所。'},
 {id:'fat-man',name:'胖子',type:'nuclear',level:2,description:'尘埃遮住天空，食物和干净饮水开始变得珍贵。'},
 {id:'tsar',name:'沙皇炸弹',type:'nuclear',level:3,description:'强烈辐射与坍塌废墟，让每次出门都成为赌局。'},
 {id:'walker',name:'僵尸',type:'zombie',level:4,description:'感染者在街道游荡，威胁已经超过沙皇炸弹。'},
 {id:'infected',name:'丧尸',type:'zombie',level:5,description:'病毒悄悄侵蚀幸存者，物资、隔离和信任同样重要。'},
 {id:'cold',name:'寒冷',type:'cold',level:6,description:'严寒可能让人进入寒冷状态，再恶化便会冰冻。'},
 {id:'ice-age',name:'冰河',type:'cold',level:7,description:'风雪没有尽头。寒冷、冰冻，最终会夺走生命。'}
];

const I = (id,name,category,description,hands,icon,effects={},extra={}) => ({id,name,category,description,hands,icon,effects,...extra});
const BASE_ITEMS = Object.fromEntries([
 I('apple','苹果','food','还带着一点果园的清香，也许能让今天好过些。',1,'food',{food:2,water:1,mood:1}),
 I('canned','罐头','food','密封的炖肉罐头，是避难所里最踏实的声音。',1,'food',{food:4}),
 I('water','饮用水','drink','没有异味的密封瓶装水。',1,'water',{water:4}),
 I('bread','面包','food','表皮有些干硬，里面还可以吃。',1,'food',{food:3}),
 I('biscuits','压缩饼干','food','干得让人想念汤，却足够顶饿。',1,'food',{food:4,water:-1}),
 I('chocolate','巧克力','food','值得认真分享的一小块甜味。',1,'food',{food:2,mood:3}),
 I('beans','焗豆罐头','food','温热的时候，闻起来很像从前的厨房。',1,'food',{food:3,stamina:1}),
 I('rice','即食米饭','food','撕开包装便能吃，是忙碌一天后的安慰。',1,'food',{food:4,stamina:1}),
 I('soup','浓汤罐头','food','一份带着蔬菜碎的浓汤，能稍微暖暖身子。',1,'food',{food:2,water:2,temp:1}),
 I('jerky','牛肉干','food','咸香耐放，吃完记得找水。',1,'food',{food:3,stamina:2,water:-1}),
 I('nuts','混合坚果','food','小袋子里藏着难得的饱腹感。',1,'food',{food:3,stamina:1}),
 I('peaches','黄桃罐头','food','糖水和果肉，让人短暂忘记外面的世界。',1,'food',{food:2,water:2,mood:2}),
 I('oatmeal','燕麦杯','food','便携的即食燕麦，适合慢慢吃。',1,'food',{food:3,health:1}),
 I('dried_fruit','果干','food','皱巴巴的水果仍有甜味。',1,'food',{food:2,mood:1}),
 I('energy_bar','能量棒','food','出门前咬上一口，腿脚似乎也轻快些。',1,'food',{food:2,stamina:3}),
 I('fish_can','鱼肉罐头','food','开罐时味道很重，营养却来之不易。',1,'food',{food:4,health:1}),
 I('spoiled_food','可疑食物','food','气味不太对劲，饥饿却会让人犹豫。',1,'food',{food:3},{chance:0.55,failEffects:{health:-3,food:1}}),
 I('tea','热茶包','drink','泡开的茶香，能让冻僵的手指稍微舒展。',1,'water',{water:2,temp:2,mood:1}),
 I('juice','果汁','drink','有些过甜，但至少瓶盖没有开过。',1,'water',{water:3,mood:1}),
 I('coffee','速溶咖啡','drink','苦涩的香味能赶走一点困倦。',1,'water',{water:1,stamina:3,temp:1}),
 I('electrolyte','电解质饮料','drink','为虚弱的人准备的补水饮料。',1,'water',{water:4,stamina:2}),
 I('dirty_water','浑浊水','drink','瓶底有沉淀，直接饮用会让人担心。',1,'water',{water:2},{chance:0.45,failEffects:{water:1,health:-2,infection:1}}),
 I('medkit','急救箱','medicine','绷带、消毒用品与基础药物整齐放在一起。',2,'medicine',{health:5,infection:-1}),
 I('bandage','无菌绷带','medicine','干净的敷料能照顾那些尚未愈合的伤口。',1,'medicine',{health:2}),
 I('antiseptic','消毒液','medicine','刺鼻的气味说明它还没有失效。',1,'medicine',{health:1,infection:-2}),
 I('antiviral','抗病毒药','medicine','标有病毒应急治疗字样，感染时格外珍贵。',1,'medicine',{infection:-4,health:1}),
 I('antibiotics','抗生素','medicine','用来对付伤口感染，不能代替抗病毒药。',1,'medicine',{health:3,infection:-1}),
 I('painkillers','止痛药','medicine','让疼痛稍微退后，代价是有些犯困。',1,'medicine',{health:2,stamina:-1}),
 I('vitamins','维生素','medicine','一小瓶日常营养补充品。',1,'medicine',{health:1,stamina:1}),
 I('expired_meds','过期药片','medicine','标签已经过期；它可能仍有效，也可能让身体更糟。',1,'medicine',{health:4},{chance:0.5,failEffects:{health:-4}}),
 I('herbs','草药包','medicine','邻居留下的草药，至少闻起来让人安心。',1,'medicine',{health:2,mood:1},{chance:0.7,failEffects:{health:-1}}),
 I('iodine','防辐射药','medicine','封装完好的应急药品，适合核尘弥漫的日子。',1,'medicine',{health:3}),
 I('warming_patch','暖贴','warmth','贴在衣服内侧，热意会慢慢透进来。',1,'flame',{temp:3}),
 I('blanket','保温毯','warmth','银色薄毯能把一点体温留在身边。',2,'blanket',{temp:2,mood:1},{reusable:true,cooldown:1}),
 I('coat','厚棉衣','warmth','宽大的旧棉衣，袖口缝了好几遍。',2,'blanket',{temp:3},{reusable:true,cooldown:1}),
 I('sleeping_bag','睡袋','warmth','拉好拉链后，终于像有了一个属于自己的小窝。',3,'blanket',{temp:3,stamina:1},{reusable:true,cooldown:1}),
 I('gloves','羊毛手套','warmth','磨薄的掌心仍能挡住刺骨的风。',1,'blanket',{temp:1},{reusable:true,cooldown:1}),
 I('hot_water_bottle','热水袋','warmth','捂在怀里，像抱着一小团晴天。',1,'flame',{temp:2,mood:1},{reusable:true,cooldown:1}),
 I('fuel','燃料','warmth','封好的燃料罐，能让冷清的炉子重新工作。',1,'flame',{temp:3}),
 I('wood','干柴','warmth','干燥木料在手里沉甸甸的。',2,'wood',{temp:3}),
 I('coal','煤块','warmth','不起眼的黑石头，能熬过漫长的寒夜。',2,'flame',{temp:4}),
 I('stove','便携炉','durable','一台结实的小炉子，能让严寒中的食物与手掌重新温热。',3,'flame',{temp:2},{reusable:true,cooldown:1}),
 I('purifier','净水器','durable','旧式手压净水装置，让每一滴水都更值得珍惜。',3,'water',{water:3},{reusable:true,cooldown:1}),
 I('lamp','阿拉丁神灯','durable','一盏古怪的铜灯。擦亮它，或许会发生意想不到的事情。',2,'flame',{mood:3,health:2},{reusable:true,cooldown:3,chance:0.5,failEffects:{mood:-2,stamina:-1}}),
 I('fishing_rod','钓鱼竿','tool','可折叠的旧鱼竿，河水没有结冰时也许有用。',2,'tools',{food:3},{reusable:true,cooldown:2,chance:0.65,failEffects:{stamina:-1}}),
 I('radio','收音机','quest','旋钮已经磨亮。噪声里或许还藏着另一个人的声音。',2,'radio',{mood:1},{reusable:true,cooldown:1}),
 I('map','城区地图','quest','街道和旧路口仍在纸上，实地却未必还是原来的样子。',1,'compass',{}),
 I('intel','幸存者情报','quest','写着撤离路线与地标的折叠纸条。',1,'book',{}),
 I('parts','电子零件','quest','拆下来的元件，看上去还能修好些什么。',1,'tools',{}),
 I('battery','电池','tool','密封包装里的备用电源。',1,'battery',{stamina:1}),
 I('flashlight','手电筒','tool','窄窄的光柱，让黑暗里多了一点方向。',1,'bolt',{mood:1},{reusable:true,cooldown:1}),
 I('mask','防毒面具','durable','镜片有划痕，滤罐却还能牢牢拧紧。',2,'mask',{infection:-1},{reusable:true,cooldown:2}),
 I('filter','备用滤芯','tool','干净的过滤材料，是被污染世界里的奢侈品。',1,'mask',{infection:-1}),
 I('tools','维修工具','tool','钳子与扳手都在，足以开始一次不太体面的维修。',2,'tools',{}),
 I('duct_tape','胶带','tool','能补管道、封箱子，也能挽回一点生活的秩序。',1,'tools',{}),
 I('rope','绳索','tool','打结的旧绳子，越过废墟时让人安心。',1,'tools',{}),
 I('shovel','折叠铲','tool','能挖开雪层，也能翻动堵住门口的碎土。',2,'tools',{}),
 I('crowbar','撬棍','weapon','撬门和防身都算顺手的老工具。',2,'weapon',{}, {force:4,reusable:true}),
 I('knife','小刀','weapon','短小、锋利，握在手中就有些底气。',1,'weapon',{}, {force:3,reusable:true}),
 I('bat','棒球棍','weapon','缠着布条的球棒，没有人再用它打球了。',2,'weapon',{}, {force:1,reusable:true}),
 I('axe','消防斧','weapon','红漆剥落的消防斧，锋刃仍然可靠。',3,'weapon',{}, {force:7,reusable:true}),
 I('gun','手枪','weapon','冰冷的金属带来力量，也会让每一次选择更沉重。',2,'weapon',{}, {force:8,reusable:true}),
 I('shotgun','霰弹枪','weapon','笨重而可靠，最好只在不得已时发声。',4,'weapon',{}, {force:10,reusable:true}),
 I('rifle','步枪','weapon','保存良好的长枪，是危险远路上的最后一道保障。',4,'weapon',{}, {force:11,reusable:true}),
 I('flare','信号弹','tool','一束能穿透烟尘的亮光，等一个值得使用的时刻。',1,'flag',{}),
 I('whistle','求生哨','tool','一口气就能把声音传得很远。',1,'flag',{mood:1},{reusable:true,cooldown:2}),
 I('backpack','双肩背包','tool','已经装满零碎东西的旧背包，携带它也要占用双手。',2,'backpack',{}),
 I('notebook','笔记本','tool','空白纸页还能记录明天的计划。',1,'book',{mood:2},{reusable:true,cooldown:2}),
 I('pencil','铅笔','tool','削得短短的铅笔，仍能写下很长的故事。',1,'book',{mood:1},{reusable:true,cooldown:2}),
 I('cards','扑克牌','durable','牌角卷起，熟悉的游戏还能让一家人坐到一起。',1,'book',{mood:3},{reusable:true,cooldown:2}),
 I('guitar','吉他','durable','有一根弦走了音，剩下的仍能拼出一首歌。',3,'book',{mood:4},{reusable:true,cooldown:3}),
 I('teddy','玩具熊','durable','纽扣眼睛陪着小主人走进了地下。',1,'heart',{mood:2},{reusable:true,cooldown:1}),
 I('photo','全家福','durable','照片上的人还站在阳光里。',1,'heart',{mood:2},{reusable:true,cooldown:2}),
 I('soap','肥皂','tool','洗去手上的污迹，也洗去一点恐惧。',1,'water',{infection:-1,mood:1}),
 I('seeds','蔬菜种子','tool','纸袋里装着对下一季的希望。',1,'food',{}),
 I('soil','种植土','tool','一小袋干净土壤，散发着雨后的气息。',2,'food',{}),
 I('book','旧小说','durable','末日前没有读完的故事，终于有时间翻开。',1,'book',{mood:2},{reusable:true,cooldown:2}),
 I('candles','蜡烛','tool','微小的火苗也能让晚餐显得郑重。',1,'flame',{mood:1,temp:1}),
 I('matches','防水火柴','tool','密封盒里的火柴，值得留到真正需要火的时候。',1,'flame',{}),
 I('screwdriver','螺丝刀','tool','小小一把，能打开许多看似无解的盒子。',1,'tools',{}),
 I('binoculars','望远镜','durable','远处的路牌和陌生身影都能看得更清楚。',2,'compass',{}, {reusable:true}),
 I('compass','指南针','durable','磁针还在转，至少有一个方向不会撒谎。',1,'compass',{}, {reusable:true}),
 I('helmet','安全头盔','durable','壳上凹了一块，里面的衬垫仍然完整。',2,'shield',{health:1},{reusable:true,cooldown:2}),
 I('raincoat','雨衣','durable','隔开湿冷空气与衣服，远行时总能派上用场。',2,'blanket',{temp:1},{reusable:true,cooldown:1}),
 I('gas','备用气罐','warmth','密封良好的气罐，能让火焰再亮一会儿。',2,'flame',{temp:4}),
 I('honey','蜂蜜','food','瓶底金黄的甜味，像最后一点夏天。',1,'food',{food:2,health:1,mood:1}),
 I('milk','常温奶','drink','盒子没有鼓包，熟悉的味道让人安心。',1,'water',{water:2,food:2}),
 I('salt','食盐','tool','一包寻常调味料，现在连交换时都值得认真称量。',1,'food',{}),
 I('thread','针线包','tool','补一件衣服，也能补住一场冻病的开头。',1,'tools',{}),
 I('tarp','防水布','tool','厚实的布片可以遮雨、挡风或铺出一张临时床。',2,'blanket',{temp:1}),
 I('sanitizer','免洗洗手液','medicine','清洁双手，减少把外面的污物带进来的机会。',1,'medicine',{infection:-2}),
 I('oxygen','便携氧气','medicine','沉重的小罐子里装着畅快呼吸的机会。',2,'medicine',{health:3,stamina:2}),
 I('socks','干燥袜子','warmth','一双没有湿透的袜子，在这里值得好好庆祝。',1,'blanket',{temp:2,mood:1}),
 I('mirror','小镜子','tool','能整理头发，也能把光反射到远处。',1,'flag',{mood:1},{reusable:true,cooldown:2})
].map(item=>[item.id,item]));

const C = (label,result,effects={},items={},extra={}) => ({label,result,effects,items,...extra});
const E = (id,title,text,scene,choices,extra={}) => ({id,title,text,scene,choices,...extra});
const BASE_EVENTS = [
 E('s-knock','门外的敲击','有人隔着舱门请求一点干净饮水，并说自己知道旧城区的近路。','shelter',[
  C('递出一瓶水','陌生人将路线写在门缝递来的纸上。',{mood:1},{water:-1,intel:1},{flag:'helped_stranger'}),
  C('保持安静','敲门声停了，屋里却没人愿意先开口。',{mood:-1})]),
 E('s-trader','流动商人','一名推着手推车的商人来到门边，愿意用食物换你们的零件。','shelter',[
  C('交换零件','罐头摆到了餐桌上，维修计划只能再等等。',{}, {parts:-1,canned:2}),
  C('请他下次再来','他在门口留下了以后可能经过的记号。',{mood:1})]),
 E('s-rats','墙后的窸窣声','仓储墙后传来老鼠啃咬包装的声音。继续拖延，可能就要重新清点粮食。','shelter',[
  C('用工具封洞','撬开木板后找到了鼠道，大家终于可以安心睡觉。',{stamina:-1},{tools:-1,parts:1}),
  C('搬动整架物资','重物划伤了手臂，好在罐头没有损失。',{health:-1,stamina:-2})]),
 E('s-pipe','头顶的漏水','旧管线滴水不止。桶只能接住眼前的水，裂缝却正在扩大。','shelter',[
  C('用胶带缠住裂缝','管道暂时止住了水，接下来的夜晚终于安静。',{mood:1},{duct_tape:-1,dirty_water:1}),
  C('徒手拧紧接头','接头卡得很死，反弹的铁片划伤了手。',{health:-2,stamina:-1})]),
 E('s-argument','谁吃掉了最后一块糖','一点不公平的猜疑在餐桌上爆发，连旧事都被翻了出来。','shelter',[
  C('拿出巧克力一起分','大家慢慢停止争论，甜味让道歉变得容易。',{mood:3},{chocolate:-1}),
  C('让所有人冷静一下','争吵停了，空气仍像绷紧的线。',{mood:-1,stamina:1})]),
 E('s-static','电波里的碎片','收音机断断续续传来一段天气预报，关键地点被噪声盖住了。','shelter',[
  C('换上备用电池细听','信号稳定下来，你记下了邻近补给点。',{mood:1},{battery:-1,intel:1}),
  C('记住能听清的部分','没有完整坐标，但人声本身就让人安心。',{mood:1})],{requiresItem:'radio'}),
 E('s-blackout','灯泡熄灭','灯丝最后闪了一下，地下室陷入漆黑。黑暗里传来了压抑的抽泣。','shelter',[
  C('点上蜡烛','火光照亮了餐桌，影子也不再像怪物。',{mood:2,temp:1},{candles:-1}),
  C('摸黑检查配电箱','线路重新接通了，指尖却被铁皮划破。',{health:-1,stamina:-1},{parts:1})]),
 E('s-sleepless','睡不着的夜','滴答声、脚步声与回忆挤在脑海里。眼睛闭上了，身体却始终紧绷。','shelter',[
  C('读一段旧小说','熟悉的故事渐渐盖过杂音，困意终于来了。',{mood:2,stamina:1}),
  C('主动接下夜间值守','其他人得以休息，自己却熬得眼睛发酸。',{stamina:-2,mood:1})],{requiresItem:'book'}),
 E('s-birthday','没有蜡烛的生日','有人从旧日历上认出今天的日期。生日还在，只是蛋糕和歌声都变得遥远。','shelter',[
  C('用黄桃做一份甜点','小碗摆成一圈，大家认真唱完了整首歌。',{mood:3},{peaches:-1}),
  C('给寿星写张纸卡','粗糙的纸片被仔细折好，放进最安全的口袋。',{mood:2,stamina:-1})]),
 E('s-mildew','墙角霉斑','潮气正在床铺下蔓延，靠近墙壁的毯子闻起来已经不太对。','shelter',[
  C('用消毒液擦洗','刺鼻的气味散去后，墙角终于干净了。',{health:1},{antiseptic:-1}),
  C('拆床搬到房间中央','重排床铺很累，却避开了最潮湿的墙面。',{stamina:-2,mood:-1})]),
 E('s-vegetable','窗台的小菜园','废罐头盒已经打了孔，只差一点种子就能试着把绿色带回地下。','shelter',[
  C('播下种子','几天后钻出的嫩芽，让每个人都来窗台看了一眼。',{mood:2},{seeds:-1,apple:1},{flag:'planted_garden'}),
  C('先把种子留好','空花盆被放回架上，大家说着以后再试。',{mood:-1})],{requiresItem:'seeds',minDay:4}),
 E('s-canteen','水壶里的异味','公用水壶闻起来有些发酸。是旧壶壁的味道，还是水已经不能喝了？','shelter',[
  C('用清水彻底冲洗','壶里终于没有怪味，干净水却少了一份。',{health:1},{water:-1}),
  C('用旧布擦净继续用','这次似乎只是壶壁的问题。',{}, {},{chance:0.6,failEffects:{health:-2},failResult:'没多久肚子就开始隐隐作痛。'})]),
 E('s-loose-shelf','松动的储物架','一颗螺丝掉在地上，整排铁架开始往前倾斜。','shelter',[
  C('用绳子拉回固定','铁架重新站稳，罐头也免于掉在地上。',{stamina:-1},{rope:-1}),
  C('硬撑住铁架搬空物资','架子没有倒下，肩膀却被压得生疼。',{health:-2,stamina:-2})]),
 E('s-toy','失而复得的玩具','从床底找出一只蒙灰的玩具熊，纽扣眼睛已经快掉下来了。','shelter',[
  C('认真缝好它','玩具重新坐回枕边，紧绷的表情终于松开。',{mood:3},{thread:-1,teddy:1}),
  C('掸掉灰尘先留着','抱住旧玩具的那一刻，过去似乎近了一些。',{mood:1},{teddy:1})]),
 E('s-roof-rumble','头顶的闷响','地上传来一阵坍塌声，细沙从通风口落在桌上。','shelter',[
  C('用木料加固顶梁','支撑卡住了松动的梁，细沙终于不再落下。',{stamina:-1},{wood:-1}),
  C('躲到坚固的墙边','屋顶撑过了这一阵，等待却耗尽了耐心。',{mood:-1,stamina:-1},{},{chance:0.7,failEffects:{health:-2,mood:-1},failResult:'掉下的碎块擦伤了肩膀，好在没有人被压住。'})]),
 E('s-ventilation','通风扇卡住了','房间越来越闷，风扇叶片只剩下吃力的嗡嗡声。','shelter',[
  C('拆开外壳清灰','积灰像一层旧棉絮，清掉以后空气又开始流动。',{stamina:-1,health:1},{parts:-1}),
  C('暂时打开应急风口','新鲜空气进来了，也带进了外面的灰尘。',{stamina:1,health:-1})]),
 E('s-memory','餐桌上的全家福','照片里是一次普通的野餐。有人盯着它很久，终于说起那天忘带的东西。','shelter',[
  C('听大家讲完往事','笑声来得很轻，却持续了整个晚餐。',{mood:3}),
  C('把照片收进防水袋','纸边被仔细压平。留住它，就是留住回家的方向。',{mood:1,stamina:1})],{requiresItem:'photo'}),
 E('s-poker','一局小赌','漫长的空闲让每个人都烦躁起来。旧牌被洗得哗啦作响。','shelter',[
  C('用一份饼干当彩头','输赢引来一阵笑声，饼干最后还是被平分了。',{mood:3},{biscuits:-1}),
  C('只打牌，不下赌注','牌局很安静，却足够让一个下午慢慢过去。',{mood:2})],{requiresItem:'cards'}),
 E('s-chore','轮值表','打扫、取水和守夜总落在相同的人身上，大家开始有了怨言。','shelter',[
  C('自己多接一班','怨言少了，睡眠也跟着少了一截。',{mood:2,stamina:-2}),
  C('重新安排公平轮值','讨论花了很久，最终每个人都在表上签了名字。',{mood:1,stamina:-1},{},{flag:'fair_roster'})]),
 E('s-dentist','突然的牙疼','牙痛让人连喝水都皱眉。眼下找不到牙医，只能决定怎样熬过今晚。','shelter',[
  C('使用止痛药','疼痛缓和后，终于能咽下晚饭。',{health:2,stamina:-1},{painkillers:-1}),
  C('用盐水漱口','疼痛没有完全消失，至少嘴里干净了些。',{health:1,stamina:-1},{salt:-1})]),
 E('s-needle','衣服破了个洞','袖口的裂缝越来越大，稍微一抬手就能感觉到钻进来的凉气。','shelter',[
  C('用针线补好','针脚不算整齐，却结结实实挡住了风。',{temp:2,mood:1},{thread:-1}),
  C('把旧布条绑在外面','临时补丁有些碍手，勉强能撑上一阵。',{temp:1,stamina:-1})]),
 E('s-air-filter','灰黑的滤芯','通风滤芯变得像炭一样黑，再撑下去恐怕会把灰尘送回房间。','shelter',[
  C('更换备用滤芯','空气里的刺鼻味道淡了许多。',{health:1},{filter:-1}),
  C('拆下拍净继续用','灰尘呛得人直咳嗽，滤网勉强恢复了通风。',{health:-1,stamina:-1})]),
 E('s-watch','停摆的钟','钟针停在了一个没有意义的时刻。没有它，日子仿佛混成了一团。','shelter',[
  C('拆一节电池修好','钟摆重新响起，所有人都望向了墙面。',{mood:2},{battery:-1}),
  C('改用墙上刻痕计日','清楚的刻痕让明天重新有了名字。',{mood:1,stamina:-1})]),
 E('s-book-trade','带书来的邻居','隔壁避难所的人捧来一本旧小说，想换一点能让孩子填饱肚子的东西。','shelter',[
  C('拿一罐食物交换','书页有些卷曲，里面夹着手写的感谢。',{mood:2},{canned:-1,book:1},{flag:'helped_neighbor'}),
  C('拒绝交换','对方抱紧那本书离开了，脚步很轻。',{mood:-1})]),
 E('s-split-can','鼓胀的罐头','架子深处的一罐食物鼓了起来。旁边的罐头看起来还算正常。','shelter',[
  C('扔掉可疑的一罐','少吃一点总比病倒好，大家默默认同了这个决定。',{}, {canned:-1}),
  C('打开闻一闻再决定','盖子弹开，令人不安的气味扑了出来。',{health:-2,food:1})]),
 E('s-morning-song','想不起的旋律','有人轻声哼起一首歌，到了副歌却怎么也想不起下一句。','shelter',[
  C('一起把歌唱完','每个人记得的词都不太一样，最后笑着拼成了一首新歌。',{mood:2}),
  C('让哼歌的人先休息','歌声停下，安静让人补回了一点精神。',{stamina:2,mood:-1})]),
 E('s-sketch','墙上的画','一面空墙被画上了太阳、树和房子。有人担心这些线条会招来不祥。','shelter',[
  C('把画补得更完整','树下多了一个小小的避难所，像是在告诉所有人仍有家。',{mood:2,stamina:-1}),
  C('把画留在原样','没有人再擦掉那些线条，太阳安安静静待在墙上。',{mood:1})]),
 E('s-scrap-fan','旧风扇的遗物','坏掉的桌面风扇彻底不能用了，但外壳里似乎还有完好的元件。','shelter',[
  C('花时间拆解','齿轮、线圈与螺丝被分门别类摆好。',{stamina:-2},{parts:2}),
  C('保留外壳装杂物','桌面变得整齐，至少再也不会找不到小东西。',{mood:1})]),
 E('s-ant-line','地上的蚂蚁','一列蚂蚁从储粮箱延伸到墙缝。甜食的包装上已经出现小洞。','shelter',[
  C('用肥皂水清理路线','蚂蚁散开了，粮食箱被垫到了高处。',{stamina:-1},{soap:-1}),
  C('丢掉招虫的蜂蜜','虫群渐渐撤去，甜味也跟着消失了。',{}, {honey:-1})]),
 E('s-copper-wire','松脱的电线','电线上露出的一段铜丝时不时冒出火星，离床铺实在太近。','shelter',[
  C('用绝缘胶带修补','火花停了，空气里焦糊的味道也慢慢散去。',{mood:1},{duct_tape:-1}),
  C('切断这段照明','房间暗了一角，却不必再担心床铺着火。',{mood:-1,stamina:1})]),
 E('s-nightmare','尖叫着醒来','梦里又出现了地上的那条街。醒来的人浑身发抖，不愿再闭眼。','shelter',[
  C('陪着说话直到平静','那些可怕的画面终于能被说出来了。',{mood:2,stamina:-1}),
  C('让出自己的安稳床位','换个地方睡，似乎真的让噩梦退远了一点。',{mood:1,stamina:-2})]),
 E('s-shelter-letter','旧住户的留言','床板背面贴着一张纸：不要放弃，墙后还有东西。字迹已经褪色。','shelter',[
  C('拆下后面的木板','夹层里没有奇迹，只有前人留下的饼干和一张笑脸。',{stamina:-1,mood:1},{biscuits:1}),
  C('把纸条贴回显眼处','那几个简单的字成了今天最好的提醒。',{mood:2})]),
 E('s-cough','落灰后的咳嗽','打扫过后咳嗽一直不停。有人担心是灰尘，也有人担心更坏的事情。','shelter',[
  C('戴好面罩休息','呼吸渐渐平稳下来，疲惫却还在。',{health:1,stamina:1},{mask:-1}),
  C('煮一点热茶','热气让喉咙好受些，却没能让人完全放心。',{water:1,temp:1},{tea:-1})]),
 E('s-fallout-grit','灰尘钻进门缝','细细的灰粒从舱门下涌进来，鞋印旁的浅色痕迹让人不安。','shelter',[
  C('湿布擦洗并封住门缝','脏水被密封收好，门边终于不再积灰。',{stamina:-1},{water:-1,duct_tape:-1}),
  C('赶紧扫出去','动作太急扬起了尘土，喉咙像被砂纸擦过。',{health:-2})],{types:['nuclear']}),
 E('s-geiger','计数器的尖叫','借来的辐射计数器靠近储物箱时，发出了比平时更急促的声响。','shelter',[
  C('丢掉最脏的物资','箱子被封进废弃通道，计数声总算降了下来。',{health:1},{canned:-1}),
  C('先包好箱子观察','隔离箱占了一大片地方，但大家暂时还能应付。',{stamina:-2,mood:-1})],{types:['nuclear']}),
 E('s-red-sky','红色的天空','观察口外一整片暗红。大家担心是新的爆炸，却听不到任何声响。','shelter',[
  C('整理撤离包以防万一','有备无患让恐惧有了落脚点。',{mood:1,stamina:-1},{parts:1}),
  C('关上观察口早点休息','红光被挡在外面，梦却一直不太安稳。',{stamina:2,mood:-1})],{types:['nuclear']}),
 E('s-powder','药盒里的白粉','翻出的药盒受过潮，里面的片剂已经碎成白粉。','shelter',[
  C('留下标签清楚的药片','仔细筛选后，仍有一些药物可以辨认。',{stamina:-1},{expired_meds:1}),
  C('整盒封存处理','不冒险也是一种照顾自己的办法。',{mood:1})],{types:['nuclear']}),
 E('s-signal-grid','墙上的频率表','一张旧说明书上印着民用应急频率，你们的收音机还没试过这些频道。','shelter',[
  C('花一晚逐个调试','大多是噪声，但一个频道报出了附近街区的情况。',{stamina:-2},{intel:1}),
  C('先把频率抄下来','纸条被夹进日志，以后还有机会慢慢尝试。',{mood:1})],{types:['nuclear'],requiresItem:'radio'}),
 E('s-metal-taste','奇怪的金属味','饭菜里似乎有股金属味。餐具是旧的，食物也是旧的，没人拿得准原因。','shelter',[
  C('换一份密封食物','难闻的味道消失后，胃里总算安定下来。',{food:2},{canned:-1}),
  C('只吃最小的一口','饥饿没有消失，还得继续留意身体的变化。',{food:1},{},{chance:0.65,failEffects:{health:-2,food:1},failResult:'怪味不是错觉，身体很快给出了警告。'})],{types:['nuclear']}),
 E('s-damp-manual','应急手册','湿透的民防手册被晾在桌上。某几页仍能读到临时修补和储水方法。','shelter',[
  C('照着修一个储水桶','漏孔被补好，之前接下的水终于有了容器。',{stamina:-1},{duct_tape:-1,water:1}),
  C('把还能读的内容誊抄下来','字迹虽然歪歪扭扭，却是以后用得上的经验。',{mood:1},{intel:1})],{types:['nuclear']}),
 E('s-aftershock','余震','墙上的杯子突然摇晃起来。桌底和床边都能躲，储物箱却还没固定。','shelter',[
  C('先拉住储物箱','罐头保住了，手腕被震得发麻。',{health:-1,stamina:-1}),
  C('立刻躲好','震动停下后大家都平安，只能清理掉摔坏的食物。',{}, {canned:-1})],{types:['nuclear']}),
 E('s-outside-scrape','拖在门上的指甲','门外有缓慢的刮擦声，间隔中夹着不像人的喘息。','shelter',[
  C('保持安静并关掉灯','不知过了多久，声音终于移向远处。',{mood:-1,stamina:-1}),
  C('用重物加固舱门','加固的声音引来一阵撞击，好在门最终顶住了。',{stamina:-2},{wood:-1})],{types:['zombie']}),
 E('s-hot-forehead','额头烫得吓人','有人开始发热，袖口下还藏着一道没有解释的擦伤。','shelter',[
  C('尽快使用抗病毒药','伤者的呼吸平稳了一些，至少不再继续隐瞒伤口。',{infection:-3,health:1},{antiviral:-1}),
  C('分开床铺观察','独自待在角落很难熬，但先把距离拉开更让人放心。',{mood:-2,stamina:1},{},{flag:'chose_isolation'})],{types:['zombie']}),
 E('s-blood-cloth','门口的血布','外出的衣物里夹着一块染血的布，没人确定血来自哪里。','shelter',[
  C('用消毒用品仔细清理','布被封存，手指和袖口都得到认真清洁。',{infection:-2},{sanitizer:-1}),
  C('直接扔出通道','动作仓促，手背蹭过了粗糙的血迹。',{infection:1,mood:-1})],{types:['zombie']}),
 E('s-scream-direction','隔墙的呼救','附近的通道有人惊恐呼救。声音越来越急，却始终看不到对方。','shelter',[
  C('隔门问清情况','对方讲出了尸群转向的消息，随后匆忙离开。',{mood:1},{intel:1},{chance:0.65,failEffects:{mood:-2},failResult:'你们听了很久，回应的始终只是重复的尖叫。'}),
  C('堵住通道入口','声音渐渐远去，堵门的人很久没有说话。',{stamina:-1,mood:-1})],{types:['zombie']}),
 E('s-scratch-pet','一只陌生的猫','猫从通风口钻进来，毛上沾着灰，警惕地盯着餐桌。','shelter',[
  C('拿食物引它靠近','猫轻轻蹭了蹭椅腿，大家久违地笑了。',{mood:3},{fish_can:-1},{chance:0.75,failEffects:{health:-1,infection:1},failItems:{fish_can:-1},failResult:'猫受惊抓伤了伸过去的手，随后消失在管道里。'}),
  C('打开通道让它离开','小身影很快不见了，至少没人受到伤害。',{mood:1})],{types:['zombie']}),
 E('s-mask-elastic','断开的面罩带','整理装备时，面罩的系带突然断裂。没有可靠的密封，出去就更危险了。','shelter',[
  C('用针线重新缝牢','旧系带被补得很结实，面罩也重新贴紧了脸。',{mood:1},{thread:-1}),
  C('用衣服抽绳代替','临时办法不太舒服，却还能继续使用。',{stamina:-1})],{types:['zombie'],requiresItem:'mask'}),
 E('s-floor-cleaning','回程留下的脚印','深色脚印一路延伸到床边。每个人都在回忆有没有踩到街上的污水。','shelter',[
  C('清洗鞋底与地面','鞋被晾在入口，地下室终于又有了一道干净的边界。',{infection:-1,stamina:-1},{soap:-1}),
  C('用旧报纸盖住污迹','眼前干净了，心里却依然难以踏实。',{mood:-1,infection:1})],{types:['zombie']}),
 E('s-false-radio','可疑的安全区','广播声称附近有绝对安全的聚集地，却不停催促大家立刻前往。','shelter',[
  C('多听一会核对地名','相互矛盾的地名暴露了骗局，你记下了应当避开的路。',{stamina:-1},{intel:1}),
  C('关掉这个频道','危险的声音被切断，屋里安静得有些沉重。',{mood:-1,stamina:1})],{types:['zombie'],requiresItem:'radio'}),
 E('s-supply-quarantine','来路不明的补给','门外留下了一袋食物，封条上沾着湿漉漉的暗色液体。','shelter',[
  C('消毒后拆开','包装里有完好的饮水和罐头，处理过程没出意外。',{stamina:-1},{antiseptic:-1,water:1,canned:1}),
  C('原封不动留在门外','你们失去了一次补给机会，也避开了一次未知接触。',{mood:-1})],{types:['zombie']}),
 E('s-whisper','不敢说的伤口','有人把衣袖拉得很低，终于小声承认自己在外面被抓了一下。','shelter',[
  C('先消毒，听他讲完','伤口得到处理，隐瞒带来的恐惧也消退了一点。',{infection:-2,mood:1},{antiseptic:-1}),
  C('要求独自待在隔间','隔离执行了，但关上门时大家都避开了彼此的目光。',{mood:-2,stamina:1},{},{flag:'chose_isolation'})],{types:['zombie']}),
 E('s-frost-door','舱门结霜','门轴上长出一圈白霜，开门时发出刺耳的呻吟。再拖延，门可能被冻住。','shelter',[
  C('点火缓慢化霜','冰水沿着门框流下，门轴恢复了转动。',{temp:2},{fuel:-1}),
  C('用工具一点点敲开','门能打开了，指尖却冻得发麻。',{temp:-1,stamina:-2})],{types:['cold']}),
 E('s-wet-blanket','潮湿的被褥','毯子吸满了冷凝水，盖在身上反而让寒意慢慢往骨头里钻。','shelter',[
  C('在炉边烘干','被褥重新蓬松起来，终于能闻到干燥织物的味道。',{temp:3,mood:1},{fuel:-1}),
  C('拧干后继续使用','双手累得发酸，湿冷却只退去一点。',{stamina:-2,temp:-1})],{types:['cold']}),
 E('s-blue-fingers','变青的指尖','指尖开始发青，弯曲时已经不太听使唤。大家都知道不能继续等了。','shelter',[
  C('使用暖贴缓慢回温','温热一点点回到手里，疼痛也随之提醒着身体还活着。',{temp:4,health:1},{warming_patch:-1}),
  C('用干衣服包住手','回温很慢，但至少没有继续暴露在冷空气里。',{temp:1,stamina:-1})],{types:['cold']}),
 E('s-snow-vent','被雪堵住的通风口','风扇正常转着，却吹不来一点空气。观察口上方已经堆起厚厚的雪。','shelter',[
  C('拿铲子清出一条缝','冷风终于进来，清雪的人也冻得打了个寒战。',{temp:-1,stamina:-1}),
  C('从内部顶开积雪','手臂被卡在狭窄管道里，费了好大力气才拔出来。',{health:-1,temp:-1,stamina:-2})],{types:['cold'],requiresItem:'shovel'}),
 E('s-cold-story','关于夏天','冷得睡不着时，有人提议轮流说一件最热的往事。','shelter',[
  C('讲那年停电的夏夜','蝉鸣、蒲扇和西瓜，把这个夜晚填得不再空荡。',{mood:3,stamina:-1}),
  C('围在一起安静休息','肩膀靠近肩膀，暖意比话语来得更直接。',{temp:1,stamina:1})],{types:['cold']}),
 E('s-fire-risk','炉边的火星','一粒火星落在旧布上，淡淡的焦味刚刚飘起来。','shelter',[
  C('用少量水压住火星','布没有烧起来，炉边却湿了一片。',{mood:1},{water:-1}),
  C('徒手拽开旧布','火星被踩灭，手掌却烫出了水泡。',{health:-2,temp:1})],{types:['cold']}),
 E('s-condensation','墙上的冰珠','墙面结出的冰珠正在连成薄片。今晚若不做点什么，床边会更难熬。','shelter',[
  C('挂起防水布作隔层','简陋的隔热层让床边终于不再滴水。',{temp:2},{tarp:-1}),
  C('把床铺向中央挪','大家挤得更近了，活动空间也小了许多。',{temp:1,mood:-1,stamina:-1})],{types:['cold']}),
 E('s-frozen-water','冻住的饮水','储水瓶像一块沉重的冰砖，摇一摇也听不到任何水声。','shelter',[
  C('用燃料慢慢融化','瓶底终于出现流动的水，喝下去时还带着一点温热。',{water:2,temp:1},{fuel:-1}),
  C('抱在衣服里等它化开','等得很久，身体也被冰块吸走了一些热量。',{water:1,temp:-2,stamina:-1})],{types:['cold']}),
 E('s-burnt-wood','床板还是燃料','木料快用完了，坏掉的床板还算干燥。但拆掉它就只能睡在地上。','shelter',[
  C('拆下不用的床板','火焰重新旺了起来，大家开始重新安排睡觉的位置。',{stamina:-2,mood:-1},{wood:2}),
  C('先保住床铺','被褥被塞得更紧，今天只能靠忍耐抵过寒夜。',{temp:-1,mood:1})],{types:['cold']}),
 E('s-white-silence','风雪突然停了','整夜的风声突然消失。安静令人安心，也令人担心下一阵风来得更猛烈。','shelter',[
  C('趁机检查门外','门边捡到一捆被风吹来的干柴。',{temp:-1,stamina:-1},{wood:1}),
  C('好好补上一觉','安静的片刻没有被浪费，醒来时精神好了一些。',{stamina:3})],{types:['cold']}),
 E('s-lamp-polish','铜灯上的纹路','擦掉灯身的积灰后，一圈陌生纹路浮了出来。它像是在等待一个愿望。','shelter',[
  C('诚恳许下平安的愿望','温暖的光映在脸上，心里忽然没那么害怕了。',{mood:3,health:1},{},{chance:0.6,failEffects:{mood:-2},failResult:'灯里只是冒出一股呛人的烟，愿望没有得到回应。'}),
  C('把它当作普通纪念品','奇迹也许不来，但这件漂亮的小东西仍能陪着你们。',{mood:1})],{requiresItem:'lamp'}),
 E('s-purifier-seal','净水器的胶圈','手压净水器漏了水，老化的密封圈已经变得脆硬。','shelter',[
  C('用胶带做临时密封','压出的水重新流进杯子，桌面终于不再湿漉漉。',{stamina:-1},{duct_tape:-1,water:1}),
  C('慢慢压，接住漏水','耗时很长，但还是接下了一点能用的水。',{stamina:-2},{water:1})],{requiresItem:'purifier'}),
 E('s-last-match','最后一根火柴','火柴盒里只剩一根完整的火柴，偏偏今天最想吃一顿热饭。','shelter',[
  C('认真生一小堆火','火苗稳稳燃起，大家围着那顿热饭坐了很久。',{temp:2,mood:2},{matches:-1}),
  C('留到更需要的时候','冷饭不太好咽，但那根火柴被放进了干燥盒子。',{food:1,mood:-1})],{requiresItem:'matches'}),
 E('s-repair-guitar','断弦','吉他突然绷断了一根弦，清脆的一响吓了所有人一跳。','shelter',[
  C('试着用金属丝代替','新弦音色很奇怪，但仍然能奏出熟悉的和弦。',{stamina:-1,mood:2},{parts:-1}),
  C('用剩下的弦弹一首','残缺的旋律没有被嫌弃，大家反而唱得更大声。',{mood:2})],{requiresItem:'guitar'}),
 E('o-market','被翻空的便利店','店门敞开着，货架像被风暴扫过。收银台后面似乎还藏着一个完整纸箱。','outside',[
  C('翻过柜台检查','纸箱被架子挡住了，里面的食物还保持着密封。',{stamina:-1},{canned:1,juice:1},{chance:0.7,failEffects:{health:-1,stamina:-1},failResult:'纸箱里只有空包装，翻柜台时还划破了手。'}),
  C('只捡地上的东西','散落的饼干已经压碎，但包装没有破。',{}, {biscuits:1})]),
 E('o-vending','卡住的售货机','自动售货机斜靠着墙，玻璃里能看到饮料，投币口却堵满了灰。','outside',[
  C('用工具拆开面板','前盖终于打开，完好的饮料滚到了手边。',{stamina:-1},{water:2},{chance:0.7,failEffects:{health:-1,stamina:-2},failResult:'面板纹丝不动，锋利边缘割伤了指节。'}),
  C('检查退币槽附近','机器底下恰好滚着一瓶被忽略的水。',{stamina:-1},{water:1})]),
 E('o-pharmacy','药房的卷帘门','半开的卷帘门下面有一条窄缝。里面光线很暗，还能看到倒下的药架。','outside',[
  C('匍匐进去搜寻','柜子深处的药品没有受潮，值得带回去。',{stamina:-2},{bandage:1,antiseptic:1},{chance:0.7,failEffects:{health:-2,stamina:-2},failResult:'门后散落着碎玻璃，药架也早已空了。'}),
  C('只查看门边货架','靠近入口的一盒药已经过期。',{stamina:-1},{expired_meds:1})]),
 E('o-bike','倒在街口的自行车','自行车轮子歪成了一圈，后架上的包裹却还系得结实。','outside',[
  C('拆下包裹','包裹里是维修用具和一卷胶带。',{stamina:-1},{parts:1,duct_tape:1}),
  C('拆下可用的零件','链条有些生锈，仍有元件可以回收。',{stamina:-2},{parts:2})]),
 E('o-bakery','面包房的香味','久闭的烘焙店里竟然留着一点麦香。保鲜柜已经停电，但后厨仓库还没被打开。','outside',[
  C('撬开仓库','密封饼干和袋装燕麦都放在干燥的高架上。',{stamina:-2},{biscuits:1,oatmeal:1},{chance:0.65,failEffects:{stamina:-2},failResult:'仓库已经被潮气侵蚀，没有食物还能安全食用。'}),
  C('查看前台包装篮','只剩一包有些干硬但仍密封的面包。',{}, {bread:1})]),
 E('o-child-shoe','路边的小鞋','一只小鞋旁边坐着迷路的孩子，紧紧抱着一只空水瓶。','outside',[
  C('给他水并指路','孩子的家人就在不远处，他们感激地送来一点食物。',{mood:3,stamina:-1},{water:-1,canned:1},{flag:'helped_child'}),
  C('画下安全路线让他等候','孩子记下了路线，你把路标画得尽可能清楚。',{mood:1,stamina:-1},{},{flag:'helped_child'})]),
 E('o-dog','拴住的狗','一条瘦狗被拴在铁栏上，链子卡得很紧。它看着你，却没有力气叫。','outside',[
  C('给它食物并解开链子','狗慢慢站起来，领你找到一只遗落的背包。',{mood:2,stamina:-1},{jerky:-1,backpack:1},{flag:'helped_dog'}),
  C('只解开卡住的链子','狗踉跄着跑向街角，回头看了你好几次。',{mood:1,stamina:-1},{},{flag:'helped_dog'})]),
 E('o-library','倾斜的图书馆','散落的书页铺满地面。一排立着的书架挡住了通往阅览室的路。','outside',[
  C('从缝隙钻进阅览室','桌上有一本旧小说和一张读者留下的城市地图。',{stamina:-1},{book:1,map:1},{chance:0.7,failEffects:{health:-1,stamina:-1},failResult:'书架松动了，你只能赶紧退出来。'}),
  C('挑一本完好的书','封皮有点皱，里面的故事仍然完整。',{}, {book:1})]),
 E('o-school','空无一人的教室','黑板上还留着一道未讲完的题，课桌抽屉里堆着没人带走的小东西。','outside',[
  C('收集文具与笔记','纸张和铅笔被仔细装好，似乎还能从头安排生活。',{mood:1},{notebook:1,pencil:1}),
  C('检查教师休息室','储物柜里还留着盒装牛奶和茶包。',{stamina:-1},{milk:1,tea:1})]),
 E('o-workshop','修车铺','油污覆盖着地板，工具架后方挂着一只没被打开的铁箱。','outside',[
  C('打开铁箱','生锈的锁终于松脱，箱里有一套完整工具。',{stamina:-2},{tools:1},{chance:0.7,failEffects:{health:-2,stamina:-1},failResult:'锁掉了，箱子却已经空了，铁皮还划伤了掌心。'}),
  C('收集散落的螺丝','把有用的金属件捡起来，总好过空手回去。',{stamina:-1},{parts:1})]),
 E('o-river','桥下的缓流','水面不算清澈，桥墩附近却偶尔能看到鱼翻动的痕迹。','outside',[
  C('耐心试着钓鱼','浮标突然一沉，一条小鱼成了今天难得的收获。',{stamina:-2},{fish_can:1},{chance:0.65,failEffects:{temp:-1,stamina:-2},failResult:'水面始终没有动静，等候让你越来越冷。'}),
  C('沿河捡一捆干柴','水边的高地上，枯枝还没被浸湿。',{stamina:-1},{wood:1})],{requiresItem:'fishing_rod'}),
 E('o-broken-stairs','塌了一半的楼梯','楼上的储物间还关着门，楼梯中段却只剩几根晃动的钢筋。','outside',[
  C('用绳子固定后攀爬','储物间里有备用毯子和旧棉衣。',{stamina:-2},{rope:-1,blanket:1,coat:1}),
  C('放弃楼上，只查楼下','门房的抽屉里找到了一节完整电池。',{}, {battery:1})]),
 E('o-flower-pot','阳台的花盆','倒塌的阳台上还有几只完整花盆，泥土里已经长出细小的野草。','outside',[
  C('收集种子和干净土','带回这些，也许能让地下室长出一点绿色。',{stamina:-1},{seeds:1,soil:1}),
  C('只带走一个轻巧的花盆','没法装下整片花园，但能给人一个开始的地方。',{mood:1},{soil:1})]),
 E('o-camping','露营用品店','户外用品店的玻璃碎了一地，角落里的睡袋架仍被倒下的招牌挡着。','outside',[
  C('搬开沉重招牌','压在下面的睡袋没有破，值得这一身酸痛。',{stamina:-2},{sleeping_bag:1},{chance:0.7,failEffects:{health:-1,stamina:-2},failResult:'下面的用品早已浸透污水，只能无功而返。'}),
  C('拿走门边的防水火柴','小盒子被夹在货架和门框之间，包装仍很干燥。',{}, {matches:1})]),
 E('o-laundromat','自助洗衣房','洗衣机一排排停在那里，有的滚筒里还塞着没被取走的衣服。','outside',[
  C('找一套干燥衣物','一件厚外套和干袜子被夹在高处。',{stamina:-1},{coat:1,socks:1}),
  C('查看清洁用品柜','柜子里只有一块密封肥皂，也足够派上用场。',{}, {soap:1})]),
 E('o-bus','终点站的巴士','巴士停在最后一站，车窗都蒙着灰。司机座位后还有一个半开的储物柜。','outside',[
  C('搜索储物柜','急救用品仍整齐装在原处。',{stamina:-1},{bandage:1,flashlight:1}),
  C('查看乘客落下的行李','翻开一个空袋子后，底部滚出一包能量棒。',{}, {energy_bar:1})]),
 E('o-handcart','陷住的手推车','车轮被卡在排水沟里，车上堆着盖好篷布的杂物。旁边的人急得满头大汗。','outside',[
  C('帮忙把车抬出来','车主把一罐燃料塞给你，坚持让你带走。',{stamina:-2,mood:1},{fuel:1},{flag:'helped_cart'}),
  C('指点一条平坦的绕行路','对方把路口情况告诉了你，双方都少一点摸索。',{mood:1},{intel:1})]),
 E('o-water-pipe','破裂的消防管','消防管道从地砖下冒着水，流到路边时已经变得浑浊。','outside',[
  C('靠近裂口接水','接到的水比路边清一些，仍该处理后再喝。',{stamina:-1},{dirty_water:2}),
  C('寻找旁边的备用消防箱','箱里没有水，却留着一捆绳子。',{stamina:-1},{rope:1})]),
 E('o-police-booth','空岗亭','警用岗亭的抽屉锁着，墙上挂的应急装备袋已经裂开一道口。','outside',[
  C('仔细撬开抽屉','里面只有备用电池和一支求生哨。',{stamina:-1},{battery:1,whistle:1},{chance:0.7,failEffects:{stamina:-2},failResult:'抽屉打不开，反倒把手磨出了水泡。'}),
  C('取下还能用的头盔','装备袋里最后一顶头盔有凹痕，内衬却是完整的。',{}, {helmet:1})]),
 E('o-barter-coat','拿棉衣换水','路边的老人裹着两件外套，愿意用其中一件换点干净的水。','outside',[
  C('拿水交换','老人认真替你系好外套带子，像交出一件重要的东西。',{mood:1},{water:-1,coat:1}),
  C('说明自己也需要水','他点头表示理解，指了指附近可能还有物资的仓库。',{}, {intel:1})]),
 E('o-lost-map','迷路的拐角','熟悉的路口被废墟堵死，原先记住的地标也消失了。','outside',[
  C('爬上高处辨认方向','远处的水塔帮你找回了回程路线，途中还发现一个小仓库。',{stamina:-2},{canned:1},{chance:0.7,failEffects:{health:-1,stamina:-2},failResult:'高处的视线也被遮住，只能费力原路返回。'}),
  C('沿来时的记号慢慢回走','路绕得很远，但没有继续在陌生街区打转。',{stamina:-1})]),
 E('o-rain','突来的冷雨','雨点突然砸在灰尘上，脚下很快变成泥水。最近的屋檐还隔着一条街。','outside',[
  C('躲雨并搜查门房','等待雨停时，在抽屉里找到了一盒未开封火柴。',{stamina:-1},{matches:1}),
  C('尽快赶路','衣服被淋湿，好在没有在外面耽搁太久。',{temp:-2,stamina:-1})]),
 E('o-canteen-window','食堂的小窗','侧门锁得死死的，后厨换气窗却还开着。窗台里似乎压着一袋食物。','outside',[
  C('挤进小窗','后厨储存的即食米饭还没有变质。',{stamina:-2},{rice:2},{chance:0.7,failEffects:{health:-1,stamina:-2},failResult:'脚下的瓷砖碎了，除了划伤没有找到能吃的东西。'}),
  C('只够到窗台的袋子','袋子里是一包挂在窗边晾干的果干。',{}, {dried_fruit:1})]),
 E('o-warehouse-rope','货仓的滑轮','货仓里一箱物资吊在半空，控制滑轮的绳子已经缠成一团。','outside',[
  C('解开绳结慢慢放下','箱子稳稳落地，里面有结实的防水布。',{stamina:-2},{tarp:1,rope:1}),
  C('不要碰吊起的箱子','你只拿走地面上还完整的胶带。',{}, {duct_tape:1})]),
 E('o-flea-market','废墟上的小摊','摊主不肯说自己从哪来，桌上只摆着一盏铜灯和一把旧小刀。','outside',[
  C('用零件换铜灯','灯身擦拭后泛着温润的光，摊主笑得十分神秘。',{}, {parts:-2,lamp:1}),
  C('用罐头换小刀','刀口磨得很整齐，至少不是一笔糟糕的交易。',{}, {canned:-1,knife:1})]),
 E('o-old-garden','屋顶的小菜地','屋顶花箱里有被疏于照顾的蔬菜，还有一个贴满胶布的种子盒。','outside',[
  C('检查还能吃的植物','谨慎挑出的嫩叶和果实，被你包进干净布里。',{stamina:-1},{apple:1,seeds:1},{chance:0.75,failEffects:{stamina:-1},failItems:{seeds:1},failResult:'能吃的部分都坏了，只有种子盒还可以带回去。'}),
  C('只收好种子盒','未来还有机会重新种下它们。',{mood:1},{seeds:1})]),
 E('o-broken-glass','碎玻璃长廊','走廊尽头的急救标志仍清楚可见，地面却铺满锋利的玻璃。','outside',[
  C('裹好鞋底慢慢通过','走过最危险的一段后，急救箱还在原处。',{stamina:-2},{medkit:1},{chance:0.7,failEffects:{health:-2,stamina:-1},failItems:{bandage:1},failResult:'碎玻璃穿过临时包裹，最后只拿到了一卷绷带。'}),
  C('绕到外墙查看其他入口','侧门的储物盒里还有一瓶消毒液。',{stamina:-1},{antiseptic:1})]),
 E('o-sewing-shop','裁缝铺','缝纫机上盖着厚厚灰尘，柜台下面的抽屉却看起来没被翻过。','outside',[
  C('翻查抽屉','针线和纽扣都还在，一小包整整齐齐放好。',{stamina:-1},{thread:2}),
  C('收集厚实布料','卷起的防水布足够补几处破洞。',{stamina:-1},{tarp:1})]),
 E('o-gas-station','加油站的储物房','油泵早已干涸，后面的员工储物房却还关着门。空气里残留着淡淡油味。','outside',[
  C('小心搜索储物房','备用燃料罐被放在阴凉角落。',{stamina:-1},{fuel:2},{chance:0.65,failEffects:{health:-2,stamina:-1},failResult:'刺鼻气味越来越重，你不得不赶紧退出房间。'}),
  C('只取门外的工具箱','箱里零件散乱，仍有能用的东西。',{}, {parts:1})]),
 E('o-whistle-answer','远处的哨声','远处有人按规律吹哨，似乎是在寻找同伴，也可能是在引人过去。','outside',[
  C('隔着街回应','对方是收集物资的小队，愿意分享附近道路的情况。',{mood:1},{intel:1},{chance:0.65,failEffects:{stamina:-2,mood:-1},failResult:'几个人影试图堵住街口，你赶紧绕路离开。'}),
  C('记下声音方向后离开','你没有靠近陌生人，也避免了一段可能的纠缠。',{stamina:-1})]),
 E('o-hardware-bin','五金店的后巷','垃圾桶后压着几只还没拆封的工具盒，大概是搬运时被遗落的。','outside',[
  C('搬开垃圾桶取盒子','盒里是螺丝刀和结实的工作手套。',{stamina:-2},{screwdriver:1,gloves:1}),
  C('挑最容易拿到的一盒','一卷完整胶带被你安全带了出来。',{}, {duct_tape:1})]),
 E('o-familiar-door','熟悉的门牌','你认出了曾经常去的朋友家。门已经变形，里面没有任何回应。','outside',[
  C('留张字条再检查厨房','柜子里有一瓶蜂蜜，门上也留下了你平安的消息。',{mood:-1,stamina:-1},{honey:1},{flag:'left_letter'}),
  C('不进去，记住这个地方','有些门暂时还没准备好推开。',{mood:1})]),
 E('o-tin-roof','铁皮下的物资','风把仓库铁皮吹起一个角。下面的箱子露出半截，铁皮随时可能拍回来。','outside',[
  C('用木块撑住再取箱子','箱子里是密封饮料，铁皮最终稳稳落在支撑上。',{stamina:-1},{wood:-1,electrolyte:2}),
  C('等风停下再动手','等得有些久，好在最后取出一瓶饮料。',{stamina:-2},{electrolyte:1})]),
 E('o-mushrooms','潮湿角落的蘑菇','墙根长出一簇颜色普通的蘑菇。看起来像从前吃过的品种，也不完全一样。','outside',[
  C('谨慎采一些带回','这些也许能成为今天的晚餐。',{}, {spoiled_food:2},{chance:0.6,failEffects:{health:-2},failItems:{spoiled_food:1},failResult:'采集时碰到了刺痛皮肤的植物，收获也比想象中少。'}),
  C('不碰陌生菌类','你只捡走附近干燥的树枝。',{}, {wood:1})]),
 E('o-dust-wall','尘墙逼近','远处扬起一整道灰色尘墙，正沿街道缓缓压来。','outside',[
  C('躲进地下通道','等到空气重新能看清路时，你在墙边发现了密封饮水。',{stamina:-2},{water:1}),
  C('蒙住口鼻赶回去','你及时走出了尘墙的范围，喉咙却痛得厉害。',{health:-2,stamina:-1})],{types:['nuclear']}),
 E('o-checkpoint','废弃检查站','路障后面留着防护物资箱，旁边的辐射警示牌已经被风吹歪。','outside',[
  C('快速拿取防护用品','箱盖没锁，里面还有一只面罩和备用滤芯。',{health:-1,stamina:-1},{mask:1,filter:1},{chance:0.7,failEffects:{health:-2,stamina:-1},failItems:{filter:1},failResult:'物资箱被污染的灰尘覆盖，你只够到一包密封滤芯。'}),
  C('绕开警示范围','少一次接触也是一种收获。',{stamina:-1})],{types:['nuclear']}),
 E('o-radiation-puddle','发亮的水面','积水表面泛着一层不自然的色泽，最近的路线必须从旁边经过。','outside',[
  C('绕去更远的高架路','多走的路让腿脚发酸，却避开了整段积水。',{stamina:-2}),
  C('踩着碎块通过','碎块勉强撑住了重量。',{stamina:-1},{},{chance:0.6,failEffects:{health:-3,stamina:-1},failResult:'脚下的碎块滑入水中，裤脚立刻湿透。'})],{types:['nuclear']}),
 E('o-rubble-voice','废墟中的回声','一片瓦砾下传出虚弱的敲击。堵住出口的不是整面墙，只是几块沉重碎石。','outside',[
  C('帮忙搬开碎石','获救者将怀里一直护着的急救用品交给了你。',{stamina:-3,mood:2},{bandage:1,iodine:1},{flag:'helped_rubble'}),
  C('标记位置并呼喊附近的人','远处有人答应过来帮忙，你把入口位置标得很清楚。',{stamina:-1,mood:1},{},{flag:'helped_rubble'})],{types:['nuclear']}),
 E('o-civil-defense','民防储物柜','地下通道尽头，一排有些生锈的民防储物柜还保持着整齐的编号。','outside',[
  C('逐个检查可开的柜门','大部分是空的，最后一个柜子里仍有应急药和饮水。',{stamina:-2},{iodine:1,water:1}),
  C('只检查最近的一个','门轴拉开时声音很大，里面仅剩一张城区地图。',{stamina:-1},{map:1})],{types:['nuclear']}),
 E('o-shattered-tower','倒下的信号塔','扭曲的塔架横在路上，控制盒还挂在钢架中段。','outside',[
  C('拆下控制盒元件','一些电子元件没有烧坏，带回去也许能修好旧设备。',{stamina:-2},{parts:2,battery:1},{chance:0.65,failEffects:{health:-2,stamina:-2},failItems:{parts:1},failResult:'钢架突然移动，你只带出一把零散元件。'}),
  C('只沿塔架底部搜索','掉在地上的接线盒里还有一节电池。',{}, {battery:1})],{types:['nuclear']}),
 E('o-gray-orchard','落灰的果园','树上挂着几只蒙灰的苹果，地上散落的果实看起来已经腐烂。','outside',[
  C('挑完整果实密封带回','擦净之后，果皮下面仍是饱满的颜色。',{stamina:-1},{apple:2},{chance:0.65,failEffects:{health:-1},failItems:{spoiled_food:1},failResult:'采下后才发现果肉已经变色，只能把它们单独封好。'}),
  C('只收集干枝','树枝的外层布满尘土，但干燥部分仍能做燃料。',{stamina:-1},{wood:1})],{types:['nuclear']}),
 E('o-basement-office','地下档案室','档案室的厚门挡住了大部分灰尘，里面堆着文件箱和员工备用物资。','outside',[
  C('寻找地图与路网资料','一张清晰地图和应急标注仍可辨认。',{stamina:-1},{map:1,intel:1}),
  C('搜索员工储物区','袋装咖啡和饼干像是在等人回来上班。',{mood:1},{coffee:1,biscuits:1})],{types:['nuclear']}),
 E('o-tanker','空油罐车','油罐已经破裂，驾驶室却锁得完好。你能看到座位旁有一个便携箱。','outside',[
  C('敲开侧窗查看','箱子里是驾驶员的应急口粮和照明工具。',{stamina:-1},{rice:1,flashlight:1},{chance:0.65,failEffects:{health:-2,stamina:-1},failItems:{energy_bar:1},failResult:'玻璃划破了手臂，箱子里也只剩一根能量棒。'}),
  C('检查车外工具架','没有燃油，但还能带走一捆绳子。',{}, {rope:1})],{types:['nuclear']}),
 E('o-geiger-trader','计数器商人','一个戴面罩的人愿意检测你带着的东西，报酬是能吃的食物。','outside',[
  C('用罐头付酬','他挑出一件可疑杂物，作为补偿给了你一包防护药。',{health:1},{canned:-1,iodine:1}),
  C('请教最安全的道路','对方指了几个该绕开的低洼地带，没有再索要东西。',{mood:1},{intel:1})],{types:['nuclear']}),
 E('o-glasshouse','破碎的温室','大片玻璃已经坠落，温室角落却还藏着没有枯萎的植物。','outside',[
  C('穿过碎玻璃采集','找到一些能辨认的果实和密封种子包。',{stamina:-2},{apple:1,seeds:1},{chance:0.7,failEffects:{health:-2,stamina:-1},failItems:{seeds:1},failResult:'收获很少，还被看不见的玻璃边缘割伤了。'}),
  C('收集入口的种植工具','小铲子旁的一袋土仍然干净。',{}, {soil:1})],{types:['nuclear']}),
 E('o-yellow-rain','黄色的雨点','雨点落在袖口，留下发黄的痕迹。你已经离避难所有一段距离。','outside',[
  C('找掩体等雨停','仓库屋檐足够宽，你在脚边还找到一瓶密封水。',{stamina:-2},{water:1}),
  C('快步穿过雨幕','你更早踏上了回程，皮肤却出现难受的刺痒。',{health:-2,temp:-1})],{types:['nuclear']}),
 E('o-shamblers','巷子里的身影','几个人影在巷子里反复踱步。近路就在它们身后，但那种姿态已经不像活人。','outside',[
  C('轻手轻脚绕过','你没有惊动它们，还在侧巷找到一袋遗落的食物。',{stamina:-1},{canned:1},{chance:0.65,failEffects:{health:-2,infection:1,stamina:-1},failResult:'一块碎石暴露了脚步，逃离时手臂被擦破了。'}),
  C('远远退回大路','绕行消耗了体力，却让你一直保持安全距离。',{stamina:-2})],{types:['zombie']}),
 E('o-dangling-bag','摇晃的背包','围栏上挂着一只鼓囊囊的背包，下面有感染者漫无目的地游荡。','outside',[
  C('从高处够取背包','背包带被顺利割开，里面有口粮和绷带。',{stamina:-2},{energy_bar:1,bandage:1},{chance:0.6,failEffects:{health:-2,infection:2,stamina:-2},failResult:'围栏晃动惊动了感染者，你只能仓促逃走。'}),
  C('只拿外围散落的物资','一瓶没开封的水滚在安全一侧。',{}, {water:1})],{types:['zombie']}),
 E('o-quarantine-gate','封锁区的铁门','铁门上写着隔离警告，门后办公桌上放着未拆封的医用品。','outside',[
  C('小心进入办公区','桌上的消毒用品和抗病毒药仍保持着密封。',{stamina:-2},{antiviral:1,sanitizer:1},{chance:0.6,failEffects:{health:-2,infection:2},failItems:{sanitizer:1},failResult:'里面的动静让人不敢久留，你只拿到最近的一瓶洗手液。'}),
  C('只看门外运输箱','箱中还剩一卷干净的绷带。',{}, {bandage:1})],{types:['zombie']}),
 E('o-noisy-toy','自己响起的玩具','脚边的玩具突然开始唱歌，空荡街道里很快传来回应般的嘶哑声音。','outside',[
  C('拆下电池后离开','歌声终于停止，你顺手留下了还能用的电池。',{stamina:-1},{battery:1},{chance:0.7,failEffects:{stamina:-2,mood:-1},failResult:'开关卡住了，你不得不丢下玩具跑开。'}),
  C('马上躲进旁边小巷','歌声留在身后，等四周重新安静才敢呼吸。',{stamina:-2})],{types:['zombie']}),
 E('o-distant-friend','远处的熟面孔','街对面的人影穿着熟悉的外套，走路姿势却僵硬得令人心里发凉。','outside',[
  C('在远处叫一声名字','对方没有回应，只僵硬地转过头。你终于愿意面对眼前的事实。',{mood:-2,stamina:-1}),
  C('避开视线悄悄离开','你把关于那件外套的记忆留在从前。',{mood:-1,stamina:-1})],{types:['zombie']}),
 E('o-clinic-fridge','诊所的冷藏柜','诊所后门敞开着，备用冷藏柜上还贴着病毒药物的标签。','outside',[
  C('检查备用冷藏柜','密封药品仍在保温箱里，标签清楚可辨。',{stamina:-2},{antiviral:2},{chance:0.6,failEffects:{infection:1,stamina:-2},failItems:{expired_meds:1},failResult:'备用电源早已停了，只有旁边一盒过期药还能辨认。'}),
  C('拿取普通医护用品','不去柜子深处，门边也有干净的绷带。',{}, {bandage:1,mask:1})],{types:['zombie']}),
 E('o-fence-gap','围栏的窄缝','安全围栏留下一个刚够侧身通过的洞，缝隙边缘挂着干涸的暗色痕迹。','outside',[
  C('用布包住边缘再穿过','你顺利通过，近路尽头还找到一个工具盒。',{stamina:-1},{tarp:-1,parts:2}),
  C('绕去完整的入口','多走一段比留下可疑伤口更能让人放心。',{stamina:-2})],{types:['zombie']}),
 E('o-rooftop-survivor','屋顶的求助者','一个被困在屋顶的人招手求助，楼下游荡着几道蹒跚身影。','outside',[
  C('用绳子接应','对方安全落到隔壁平台，把珍藏的药分给了你。',{stamina:-2,mood:2},{rope:-1,antiviral:1},{flag:'helped_rooftop'}),
  C('指明避开尸群的天桥','对方看懂了你的手势，终于开始挪向安全方向。',{mood:1,stamina:-1},{},{flag:'helped_rooftop'})],{types:['zombie']}),
 E('o-canteen-chain','食堂门后的撞击','食堂侧门被铁链缠住，里面时不时传来一下沉重撞击。后厨窗边摆着几盒食物。','outside',[
  C('从窗边够出食物','你没有打开那扇门，食物也顺利滑进了包里。',{stamina:-1},{rice:2},{chance:0.65,failEffects:{health:-1,infection:1,stamina:-1},failResult:'窗框突然掉落，急着退开时手臂被划了一下。'}),
  C('离开这栋建筑','里面的声音越来越急，退开也许正是正确的时机。',{stamina:-1})],{types:['zombie']}),
 E('o-clothesline','最后一条晾衣绳','晾衣绳上挂着干燥衣物，院子里却有一团看不清的阴影。','outside',[
  C('观察后慢慢取下衣物','阴影只是倒下的花架，你带走了外套和干袜子。',{stamina:-1},{coat:1,socks:1},{chance:0.7,failEffects:{stamina:-2,temp:-1},failResult:'阴影突然动了，你只能空着手爬回墙外。'}),
  C('只剪断垂到外面的绳子','结实的绳段总能在别的地方派上用场。',{}, {rope:1})],{types:['zombie']}),
 E('o-handwash','水槽边的用品','临时检疫点已经空了，水槽旁还摆着几瓶清洁用品。','outside',[
  C('认真清洁再拿物资','清洁过程让你安心了一些，还能带走剩下的一瓶。',{infection:-1,stamina:-1},{sanitizer:1}),
  C('只拿封口完整的肥皂','一块尚未拆封的肥皂被放进干净口袋。',{}, {soap:1})],{types:['zombie']}),
 E('o-chapel-bell','塔楼上的钟','风推动钟绳，闷响不断把街上的感染者引向这里。楼梯下面有一只应急箱。','outside',[
  C('先固定钟绳再取箱子','钟声停了，箱里有求生哨和急救用品。',{stamina:-2},{whistle:1,medkit:1},{chance:0.6,failEffects:{stamina:-3,infection:1},failResult:'钟绳突然脱手，更多身影围过来，你只能逃离。'}),
  C('趁它们靠近前离开','闷响留在远处，你挑了另一条回程路。',{stamina:-1})],{types:['zombie']}),
 E('o-frozen-lake','结冰的池塘','冰面覆盖着薄雪，对岸的工具棚比绕路近得多。你无法看清冰层有多厚。','outside',[
  C('试探着踩过去','工具棚里有铲子和一捆干柴，冰面勉强撑到了回程。',{stamina:-2,temp:-1},{shovel:1,wood:1},{chance:0.55,failEffects:{health:-2,temp:-4,stamina:-2},failResult:'冰面裂开了，你抓住岸边才爬出来，衣服全湿了。'}),
  C('沿着岸边绕行','路很长，双脚却一直踩在稳固地面上。',{stamina:-2,temp:-1},{wood:1})],{types:['cold']}),
 E('o-whiteout','白茫茫的风暴','风卷起积雪，几步之外就看不清道路。脚印很快也被抹平了。','outside',[
  C('贴着建筑寻找掩体','你在门廊里熬过了最猛烈的风雪，门边还堆着旧煤块。',{temp:-2,stamina:-1},{coal:1}),
  C('沿最后记住的方向前进','你最终辨认出熟悉的墙角，但身体已经冻得发抖。',{temp:-3,stamina:-2})],{types:['cold']}),
 E('o-bus-shelter','雪里的公交站','厚雪几乎盖住了候车亭，广告板后面却露出一个保温袋。','outside',[
  C('扒开积雪取出袋子','袋中有暖贴和一双厚袜子，像是有人留给冬天的礼物。',{stamina:-2,temp:-1},{warming_patch:1,socks:1}),
  C('先在亭下挡一会风','风雪从脚边吹过，至少能让呼吸重新平稳。',{stamina:1,temp:-1})],{types:['cold']}),
 E('o-chimney','仍冒烟的烟囱','远处有一根烟囱冒出细烟，屋主隔着窗警惕地看着你。','outside',[
  C('用罐头换一会炉火','炉边的温暖很真实，离开时屋主还分了一点柴。',{temp:3,mood:1},{canned:-1,wood:1}),
  C('只询问避风的道路','屋主隔窗指向背风街，那里确实好走了一些。',{mood:1,temp:1})],{types:['cold']}),
 E('o-frozen-grocery','冻硬的杂货铺','店里的所有瓶子都结了冰，木架上的包装食品却仍然干燥。','outside',[
  C('挑出完整的食品','冻硬的能量棒还能慢慢吃，至少包装没有破。',{temp:-1,stamina:-1},{energy_bar:2}),
  C('带走结冰的饮水','瓶身没有裂，带回温暖处就能慢慢融化。',{stamina:-1,temp:-1},{water:2})],{types:['cold']}),
 E('o-snowdrift-car','雪堆中的汽车','汽车几乎埋进雪里，侧窗露出一点缝。后排座椅上铺着厚毯子。','outside',[
  C('挖开车门','手指冻得发僵，好在那条毯子还是干燥的。',{stamina:-2,temp:-2},{blanket:1},{chance:0.7,failEffects:{stamina:-3,temp:-2},failResult:'车门冻死在框上，挖了很久仍然打不开。'}),
  C('只拆下外部遮雪布','布料不算漂亮，但挡风总能派上用场。',{stamina:-1,temp:-1},{tarp:1})],{types:['cold']}),
 E('o-coal-cellar','煤窖入口','地下煤窖的入口被薄冰封住，里面传出干燥煤灰特有的气味。','outside',[
  C('敲开冰层收集煤块','袋子很快变得沉重，今晚的炉火有了着落。',{stamina:-2,temp:-1},{coal:2}),
  C('只拿入口处的碎煤','收获不多，也不必在黑暗里逗留太久。',{stamina:-1},{coal:1})],{types:['cold']}),
 E('o-thin-ice-steps','结冰的台阶','通向药店的台阶结成光滑冰面，扶手也已经断了。','outside',[
  C('贴墙慢慢挪上去','终于摸到结实的门框，药店入口还留着急救用品。',{stamina:-2,temp:-1},{bandage:1,warming_patch:1},{chance:0.65,failEffects:{health:-2,temp:-1,stamina:-2},failResult:'脚下一滑，撞上台阶的膝盖很久直不起来。'}),
  C('放弃台阶，搜索平地','低矮储物棚里也找到了一包干燥袜子。',{stamina:-1},{socks:1})],{types:['cold']}),
 E('o-snow-person','雪地里的呼吸','一个人蜷在背风墙边，睫毛上挂着白霜，呼吸很浅却仍在继续。','outside',[
  C('给他保温毯并呼救','附近避难所的人赶来接应，留给你一罐燃料道谢。',{stamina:-2,mood:2},{blanket:-1,fuel:1},{flag:'helped_freezing'}),
  C('带他挪到最近的门廊','终于有人开门把他接进去，你也得到了一杯热茶。',{temp:1,stamina:-3,mood:1},{},{flag:'helped_freezing'})],{types:['cold']}),
 E('o-ice-branches','挂冰的树林','冰壳压弯了树枝，靠近树根的枯枝还算干燥。头顶不时传来断裂声。','outside',[
  C('快速捆好干柴','挑出的木料足够点起一堆像样的火。',{stamina:-2,temp:-1},{wood:2},{chance:0.65,failEffects:{health:-2,temp:-1,stamina:-2},failItems:{wood:1},failResult:'断枝突然砸下来，你带着少量木料匆忙退开。'}),
  C('只捡外围的小枝','轻巧的树枝不够耐烧，却足够先把炉火点起来。',{stamina:-1},{wood:1})],{types:['cold']}),
 E('o-abandoned-sauna','废弃浴室','浴室的水管全冻住了，储物间里却放着厚毛巾和备用清洁用品。','outside',[
  C('查看干燥的高层柜子','里面的毯子与肥皂没有被冻水浸湿。',{stamina:-1,temp:-1},{blanket:1,soap:1}),
  C('收集外侧的木板','拆下的木板足够为避难所带回一些温暖。',{stamina:-2},{wood:1})],{types:['cold']})
];

export const ITEMS = {...BASE_ITEMS,...LEGACY_ITEMS,...EXPANSION_ITEMS};
export const EVENTS = [...BASE_EVENTS,...LEGACY_SHELTER_EVENTS,...LEGACY_OUTSIDE_EVENTS,...LEGACY_TRADE_EVENTS,...LEGACY_ROUTE_EVENTS,...EXPANSION_EVENTS];

export function canScavenge(itemOrId){const item=typeof itemOrId==='string'?ITEMS[itemOrId]:itemOrId;return Boolean(item&&item.startAllowed!==false&&!item.production&&item.category!=='durable'&&!(item.reusable&&['tool','warmth'].includes(item.category)));}
