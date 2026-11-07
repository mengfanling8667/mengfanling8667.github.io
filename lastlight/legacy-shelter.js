// Original Chinese scenarios implementing audited event mechanics; no original diary text is reproduced.
const item=(id,name,description,hands,icon,effects={},extra={})=>({id,name,description,hands,icon,effects,category:'tool',...extra});
export const LEGACY_ITEMS={
 bug_spray:item('bug_spray','杀虫喷雾','密封的驱虫用品，能把不请自来的小住客赶离储物架。',1,'tools'),
 scout_book:item('scout_book','童军手册','翻旧的手册里有野外知识、信号码和夹在页间的旧记忆。',1,'book',{mood:1},{category:'durable',reusable:true,cooldown:2}),
 checkers:item('checkers','跳棋','棋盘边角磨损，却仍能在漫长等待中分出一场胜负。',1,'book',{mood:2},{category:'durable',reusable:true,cooldown:2}),
 ammo:item('ammo','备用弹药','未开封的弹药盒，也常被陌生访客当作交换的筹码。',1,'weapon'),
 harmonica:item('harmonica','口琴','音孔里的细小灰尘挡不住一首熟悉的曲子。',1,'book',{mood:2},{category:'durable',reusable:true,cooldown:2}),
 suitcase:item('suitcase','手提箱','坚硬的旧箱子，可以整理杂物，也可以陪你试一次出人意料的办法。',2,'backpack'),
 padlock:item('padlock','挂锁','一把结实的备用锁，锁住舱门时总能让人踏实些。',1,'shield')
};
const C=(label,result,effects={},items={},extra={})=>({label,result,effects,items,...extra});
const E=(id,title,text,choices,extra={})=>({id,title,text,scene:'shelter',once:true,minDay:3,choices,...extra});
const keep=(id,other)=>C('抢救'+({mask:'防毒面具',radio:'收音机',flashlight:'手电筒',map:'地图',cards:'扑克牌',medkit:'急救箱',scout_book:'童军手册'}[id]),'你抱住选中的东西，其他物品却没能躲过这次意外。',{stamina:-1},{},{requiresItem:id,removeItems:other});
export const LEGACY_SHELTER_EVENTS=[
 E('lg-quake-salvage','地震中的取舍','地板突然剧烈晃动。架子上几件重要装备同时滑落，你只能先保住其中一件。',[
  keep('mask',['radio','flashlight']),keep('radio',['mask','flashlight']),keep('flashlight',['mask','radio']),
  C('先护住家人','大家都平安，回头时几件装备已经压在碎块下面。',{stamina:-1},{},{removeItems:['mask','radio','flashlight']})],{types:['nuclear']}),
 E('lg-flood-salvage','从脚边涨起的水','管道接连爆裂，地上的水迅速漫过箱底。地图、纸牌和收音机都在低处。',[
  keep('map',['cards','radio']),keep('cards',['map','radio']),keep('radio',['map','cards']),
  C('集中精力排水','水退了下去，浸湿的装备却很难再用了。',{stamina:-2},{},{removeItems:['map','cards','radio']})]),
 E('lg-fire-salvage','火焰爬上储物架','一团火苗窜上旧木架。急救箱、收音机和手册就在火舌即将舔到的位置。',[
  keep('medkit',['radio','scout_book']),keep('radio',['medkit','scout_book']),keep('scout_book',['medkit','radio']),
  C('先灭火再检查物资','火势终于受控，几样珍贵的东西只剩下焦黑外壳。',{health:-1,stamina:-1},{},{removeItems:['medkit','radio','scout_book']})]),
 E('lg-wall-fungus','墙上的蘑菇','潮湿墙面长出一片饱满蘑菇。它们闻起来并不难闻，却没有人认识这种品种。',[
  C('试着做成一顿饭','这一餐暂时填平了饥饿，大家希望它没有别的代价。',{food:3},{},{all:true,chance:0.55,failEffects:{food:1,health:-2},failResult:'味道很糟，随后出现的不适让大家再也不想试第二次。'}),
  C('清理掉，不入口','蘑菇被包好扔进垃圾箱，饭量不会因此多一点。',{stamina:-1})]),
 E('lg-vent-hive','通风管里的巢','房间里的空气越来越闷。管道深处有翅膀振动的声音，显然不只是积灰。',[
  C('使用杀虫喷雾','虫群从管道另一端退了出去，新鲜空气终于吹进来。',{mood:1},{bug_spray:-1}),
  C('用手电筒查看','强光激怒了藏在管道里的虫群，处理完以后手臂多了几处红肿。',{health:-2},{},{requiresItem:'flashlight'}),
  C('对照手册拆开风口','拆开的瞬间虫群涌了出来，空气恢复了，身体却有些发热。',{health:-2,stamina:-1},{},{requiresItem:'scout_book'}),
  C('等一等再处理','闷热的一天过去后，咳嗽比之前更严重了。',{health:-1,stamina:-1},{},{all:true})]),
 E('lg-hygiene','该洗一洗了','衣服与床铺的气味已经不能忽视。继续挤在这里生活，清洁也得列入求生计划。',[
  C('拿出肥皂清洗','水用得很节省，洗净之后连心情都轻了些。',{health:2,mood:1},{soap:-1}),
  C('戴上面罩整理污物','面罩挡住难闻气味，你终于完成了必要的清理。',{health:1,stamina:-1},{},{requiresItem:'mask'}),
  C('用喷雾处理滋生的虫害','清理完垃圾再处理虫子，屋里总算重新像个住处。',{health:1},{bug_spray:-1}),
  C('今天先忍过去','难闻气味没有自行消失，大家的胃口反而更差了。',{health:-1,mood:-1},{},{all:true})]),
 E('lg-rodent-raid','储粮箱里的巨鼠','一只异常肥大的老鼠正在拖动食物包装，背后还有细小的抓挠声。',[
  C('拿斧子驱赶','老鼠钻回了缝隙，食物总算保住。',{stamina:-1},{},{requiresItem:'axe'}),
  C('用步枪吓退它','它逃走了，枪身却在仓促行动中受了损。',{}, {},{requiresItem:'rifle',chance:0.75,failEffects:{stamina:-1},failRemoveItems:['rifle'],failResult:'老鼠跑了，旧步枪也彻底卡死了。'}),
  C('把食物拖到另一边','搬动时仍被它叼走一包，只好先封住洞口。',{stamina:-1},{},{removeItems:['canned']})]),
 E('lg-infestation','垃圾桶后的虫影','几只发着微光的大蟑螂藏在垃圾桶后。也许今天赶走它们，比以后容易。',[
  C('用杀虫喷雾清除','储物架和垃圾桶都重新检查过，虫群没有留下来。',{}, {bug_spray:-1}),
  C('按手册封堵巢穴','你找到了虫群进出的裂缝，清理之后把它封严。',{stamina:-1},{},{requiresItem:'scout_book'}),
  C('让猫守在墙边','猫认真盯了一整夜，第二天虫影已经不见。',{mood:1},{},{requiresFlags:['lg_cat']}),
  C('暂时不理会','墙缝里的动静越来越密，看来它们开始把这里当成家。',{mood:-1},{},{setFlags:['lg_roaches'],followUp:{eventId:'lg-swarm',delay:3,chainId:'lg-roaches'}})],{forbidsFlags:['lg_roaches'],cooldown:16}),
 E('lg-swarm','虫群扩张','没处理的蟑螂已经占住好几个角落。它们开始沿着食物箱排成细长队伍。',[
  C('用喷雾清除','所有角落都检查了一遍，虫群终于退出了房间。',{stamina:-1},{bug_spray:-1},{clearFlags:['lg_roaches']}),
  C('依照手册追踪虫道','清掉巢穴之后，地面重新安静了下来。',{stamina:-2},{},{requiresItem:'scout_book',clearFlags:['lg_roaches']}),
  C('用步枪震慑并赶出通道','声响大得耳朵发麻，总算把虫群赶出了入口。',{stamina:-1,mood:-1},{},{requiresItem:'rifle',clearFlags:['lg_roaches']}),
  C('继续容忍它们','夜里的窸窣声越来越有规律，像是在讨论什么。',{health:-1},{},{followUp:{eventId:'lg-roach-message',delay:3,chainId:'lg-roaches'}})],{scheduledOnly:true,requiresFlags:['lg_roaches'],chainId:'lg-roaches'}),
 E('lg-roach-message','奇怪的虫群队列','蟑螂把碎纸和灰尘排成一行，像一个拙劣的问候。你开始怀疑是不是自己太累了。',[
  C('用手册赶走它们','不管那些线条是什么意思，虫群已经被赶回了裂缝。',{stamina:-1},{},{requiresItem:'scout_book',clearFlags:['lg_roaches']}),
  C('使用喷雾结束闹剧','当最后一点翅膀声消失，房间才恢复了熟悉的安静。',{}, {bug_spray:-1},{clearFlags:['lg_roaches']}),
  C('让女儿试着观察','她盯着那些队列看了很久，回来时显得格外安静。',{mood:-1},{},{targetId:'daughter',setFlags:['lg_mutantDaughter'],requiresPeople:['daughter'],followUp:{eventId:'lg-mutant-conversation',delay:3,chainId:'lg-mutation'}})],{scheduledOnly:true,requiresFlags:['lg_roaches'],chainId:'lg-roaches'}),
 E('lg-spiders','蛛网爬上了餐桌','蛛丝连起杯沿与床架，几只不寻常的大蜘蛛藏在水杯后面。',[
  C('用喷雾仔细清理','清出墙角时，还找到一瓶被藏住的饮水。',{stamina:-1},{bug_spray:-1,water:1}),
  C('用厚手册清理角落','桌面干净了，架子后还掉下一只完整罐头。',{stamina:-1},{canned:1},{requiresItem:'scout_book',chance:0.75,failEffects:{health:-1},failItems:{canned:1},failSetFlags:['lg_mutantDaughter'],failResult:'蜘蛛清掉了，但女儿说自己手背被咬了一下。'}),
  C('用急救用品处理叮咬','先照顾红肿的伤处，接着把床铺和餐桌彻底清理。',{health:2},{medkit:-1}),
  C('让猫去检查','猫沿着墙根追了一圈，蛛丝很快失去了主人。',{mood:1},{},{requiresFlags:['lg_cat']}),
  C('徒手慢慢赶走','忙了许久仍留下几处蛛网，手臂也被咬得红肿。',{health:-1,stamina:-2},{},{setFlags:['lg_mutantDaughter'],followUp:{eventId:'lg-mutant-conversation',delay:3,chainId:'lg-mutation'}})]),
 E('lg-mutant-conversation','她还是她吗','女儿最近变得异常强壮，也常常独自站在墙边。外表陌生了，家人却仍记得她原来的笑容。',[
  C('温和地和她说话','她慢慢回答了熟悉的称呼，桌边终于又有一个位置可以安心坐下。',{mood:3},{},{targetId:'daughter',chance:0.75,failEffects:{health:-1,mood:-1},failResult:'谈话让她有些激动，移开的桌角撞伤了伸出的手。'}),
  C('让她独自待一会','谁也不知道怎样开始这段对话，沉默让人更加疏远。',{mood:-2},{},{all:true})],{requiresFlags:['lg_mutantDaughter'],requiresPeople:['daughter'],chainId:'lg-mutation',cooldown:12}),
 E('lg-wall-stench','洞里的恶臭','墙角新出现的洞里飘出难闻气味，偶尔还传来像喘息一样的声音。',[
  C('照着洞口查个究竟','松动砖头后藏着一副纸牌，气味来自坏掉的旧垃圾。',{stamina:-1},{cards:1},{chance:0.65,failEffects:{stamina:-1},failRemoveItems:['radio'],failResult:'一只怪异的小动物冲进房间，撞坏收音机后又钻回洞里。'}),
  C('先堵住洞口','气味稍淡，但闷在屋里的那一阵仍让人不舒服。',{health:-1,stamina:-1})]),
 E('lg-concert','地下音乐会','有人想吹一首曲子。或许音乐能填满那些只剩滴水声的时刻。',[
  C('吹响口琴','大家听得入神，随后才发现几只发光蟑螂也聚到墙根，跟着节拍摆动。',{mood:2},{},{requiresItem:'harmonica',setFlags:['lg_roaches'],followUp:{eventId:'lg-swarm',delay:4,chainId:'lg-roaches'}}),
  C('今天先保持安静','没有观众抱怨，也没有音乐留下。',{stamina:1,mood:-1})],{requiresItem:'harmonica',forbidsFlags:['lg_roaches']})
];
LEGACY_SHELTER_EVENTS.push(
 E('lg-ration-fight','争夺最后一份饭','孩子们盯着同一份食物，争论很快变成推搡。再晚一点，食物也许就会落到地上。',[
  C('站出来重新分配','碗被公平摆好，大家终于肯坐下吃饭。',{food:2,mood:1},{canned:-1},{all:true}),
  C('让他们自己解决','争夺中食物洒在地上，谁也没能成为赢家。',{mood:-2,stamina:-1},{},{all:true,removeItems:['canned']})],{requiresPeople:['daughter','son'],maxResource:{food:6}}),
 E('lg-charades','比划猜词','儿子想找父亲玩猜词游戏。桌子旁的空位不大，却也许容得下一场想象中的冒险。',[
  C('认真玩一局','猜错的答案越积越多，最后竟成了一场谁也忍不住的笑话。',{mood:2},{},{all:true,chance:0.7,failEffects:{mood:-1},failRemoveItems:['flashlight'],failResult:'一次夸张的动作碰倒了架上的手电筒，争论也跟着冒了出来。'}),
  C('改玩安静的寻物游戏','床下找到一瓶漏记的饮水，游戏终于有了一个好结尾。',{mood:1,stamina:-1},{water:1})],{requiresPeople:['father','son']}),
 E('lg-bug-dissection','餐桌上的实验','儿子拿着放大镜研究一只发光蟑螂，实验残留已经占据了本来要吃饭的位置。母亲正等他解释。',[
  C('让他自己清理到底','整理桌子时，他还在柜子深处翻出一包旧饼干。',{stamina:-2},{biscuits:1},{targetId:'son',chance:0.7,failEffects:{health:-1,mood:-1},failResult:'他赌气躲去门边，回来时脸色不太好。'}),
  C('一起清理，先把饭桌收回来','边收拾边讨论的过程有些漫长，但关系终于不再紧绷。',{stamina:-1,mood:1},{},{all:true})],{requiresFlags:['lg_roaches'],requiresPeople:['mother','son']}),
 E('lg-comic-distrust','一本引起误解的漫画','儿子找回的太空漫画被误认为危险宣传。紧张的生活让一句玩笑变成了认真的指责。',[
  C('先把故事看完','漫画讲的只是遥远星球的冒险，误会解开以后大家都有点不好意思。',{mood:2},{},{targetId:'son'}),
  C('把他和漫画一起赶出去','门关上后再也没人争论那个故事，留下的只有无法收回的话。',{mood:-3},{},{targetId:'son',losePerson:true,setFlags:['lg_exiledSon']})],{requiresPeople:['son'],minDay:8}),
 E('lg-private-diary','夹在手册里的日记','翻阅手册时，一本私人的小日记掉在桌上。女儿还没有发现，其他人已经围了过来。',[
  C('合上日记还给她','被尊重的秘密没有再变成争论。她把日记收好，轻轻说了声谢谢。',{mood:3},{},{targetId:'daughter'}),
  C('把内容念给大家听','笑声很快变成争吵。抢回日记时，桌边有人被撞伤了。',{mood:-3,health:-1},{},{targetId:'daughter'})],{requiresItem:'scout_book',requiresPeople:['daughter']}),
 E('lg-letter-date','要不要寄出那封信','女儿承认她外出时结识了一个陌生青年，想留张纸条解释失约的原因。母亲担心对方会跟着找到避难所。',[
  C('约好时间，让她去放纸条','她终于把想说的话写完，回来时脸上多了一点释然。',{mood:2},{},{targetId:'daughter',sendPerson:{id:'daughter',days:1,returnEffects:{mood:2,stamina:-1}},chance:0.75,failEffects:{mood:-2,health:-1},failResult:'见到的情形和想象不同，她带着失望与擦伤回来了。'}),
  C('先留下信，再谈一谈','门没有打开，争执却让双方都疲惫了。',{mood:-2,stamina:-1},{},{targetId:'daughter'})],{requiresPeople:['mother','daughter'],requiresNoExpedition:true,minDay:8}),
 E('lg-instrument-search','想找回的乐器','女儿想回到屋子废墟里找找从前的乐器。哪怕只有一页旧乐谱，也能提醒她生活曾经有别的声音。',[
  C('让她去熟悉的地方看看','她记下了必须返回的时间，认真收好门口的路线标记。',{}, {},{targetId:'daughter',sendPerson:{id:'daughter',days:1,returnEffects:{mood:3,stamina:-1},returnItems:{harmonica:1}}}),
  C('请她今天留下','她没有再提乐器，却一整天都没怎么开口。',{mood:-2},{},{targetId:'daughter'})],{requiresPeople:['daughter'],requiresNoExpedition:true}),
 E('lg-son-walk','想跑一跑的双腿','儿子说自己已经快忘记奔跑是什么感觉了，哪怕只在附近转一小圈，也比继续数墙缝好。',[
  C('约好路线和回程时间','他努力表现得很可靠，出门前又复述了一遍约定。',{}, {},{targetId:'son',sendPerson:{id:'son',days:2,returnEffects:{mood:3,stamina:-2}}}),
  C('先在屋里活动','空间太小，他很快又坐回了床边。',{mood:-2},{},{targetId:'son'})],{requiresPeople:['son'],requiresNoExpedition:true}),
 E('lg-family-support','有人沉默了一整天','有位家人越来越少说话，吃饭时也只盯着自己的杯子。也许现在就该认真听一听。',[
  C('留点时间，好好聊聊','没有立刻解决所有问题，但愿意被听见已经让人轻松不少。',{mood:3,stamina:1},{},{choosePerson:true,people:['mother','daughter','son'],chance:0.85,failEffects:{mood:-1},failResult:'谈话没有找到合适的开头，你们约好明天再试一次。'}),
  C('给对方一段安静时间','安静没有变成责备，但也没有解开眼前的心结。',{mood:-1,stamina:1},{},{choosePerson:true,people:['mother','daughter','son']})],{maxResource:{mood:7},cooldown:10,once:false}),
 E('lg-mother-blues','提不起精神的一天','母亲今天连整理物资都没有兴致。那些总能让她忙起来的小事，现在好像都失去了意义。',[
  C('翻翻手册，找个能一起做的小任务','照着旧步骤整理一只抽屉，终于让她重新找回一点事情正在变好的感觉。',{mood:3,stamina:1},{},{requiresItem:'scout_book',targetId:'mother'}),
  C('请猫陪她坐一会','猫安静地卧在膝头，母亲很久以来第一次露出了笑容。',{mood:3},{},{requiresFlags:['lg_cat'],targetId:'mother'}),
  C('让她独自缓一缓','休息了一会，倦意仍然没有完全离开。',{stamina:1,mood:-1},{},{targetId:'mother'})],{requiresPeople:['mother'],maxResource:{stamina:7}}),
 E('lg-lesson','避难所的临时课堂','一次猜词游戏暴露了不少被忘掉的知识。母亲提议上一节课，女儿却担心又是没完没了的练习。',[
  C('把课变成实际维修','从算尺寸到装回零件，课上完时房间里的坏东西真的少了一些。',{mood:2,stamina:-2},{parts:1},{targetId:'daughter'}),
  C('今天放下课本','双方都觉得自己没有被理解，一场本来可以很小的争论拖了很久。',{mood:-1},{},{all:true})],{requiresPeople:['mother','daughter']}),
 E('lg-tag','很小很小的操场','孩子们计划在桌子周围玩追逐。避难所实在不适合奔跑，笑声却已经在门边响起来了。',[
  C('清出地方，允许玩一会','追逐时踢出一只躲在床下的罐头，今天的游戏有了意外奖品。',{mood:2,stamina:-1},{canned:1},{all:true,chance:0.7,failEffects:{mood:1,health:-1},failRemoveItems:['flashlight'],failResult:'一个转身碰倒了架子，笑声和懊恼同时挤满房间。'}),
  C('改成不跑动的游戏','大家没有受伤，不过孩子们显然还没消耗完那股兴奋劲。',{mood:-1,stamina:1},{},{targetId:'son'})],{requiresPeople:['daughter','son']}),
 E('lg-claustrophobia','墙好像更近了','父亲突然觉得空气不够、墙面也像在往里挤。他很想立刻推开舱门透口气。',[
  C('短暂开门透气','紧绷的呼吸缓了下来，外面的尘土却让喉咙难受了很久。',{mood:2,health:-2},{},{targetId:'father'}),
  C('关着门陪他慢慢平静','他终于坐下，却仍然疲倦地盯着舱门。',{mood:-2,stamina:1},{},{targetId:'father'})],{requiresPeople:['father'],maxResource:{mood:7}}),
 E('lg-infected-wound','不肯愈合的伤口','一次外出留下的小伤，今天却肿得更厉害。继续把它藏在袖子和裤管里，显然不是办法。',[
  C('使用急救箱处理','清理后的伤口被重新包好，发热与疼痛都慢慢退下去。',{health:4,infection:-2},{medkit:-1},{choosePerson:true,people:['mother','son']}),
  C('牺牲斧子整备清理工具','工具没能保留下来，伤处终于得到处理，过程却让人疲惫。',{health:2,stamina:-1},{axe:-1},{choosePerson:true,people:['mother','son'],chance:0.75,failEffects:{health:-1,infection:-1},failItems:{axe:-1},failResult:'处理过程出了些差错，虽然清理了污物，却又添了一处伤。'}),
  C('先让伤者休息','伤口依然没有好转，还必须留意接下来的夜晚。',{health:-1,stamina:1},{},{choosePerson:true,people:['mother','son']})],{maxResource:{health:8},cooldown:10,once:false}),
 E('lg-birthday-gift','仓促准备的礼物','今天是家里孩子的生日。没有礼品店，也没有彩纸，但至少还能认真选择送出什么。',[
  C('送出一副纸牌','礼物被小心收进枕边，今天终于和平时有些不同。',{mood:4},{cards:-1},{choosePerson:true,people:['daughter','son']}),
  C('送出棋盘','你们约好以后经常下一局，作为生日过后的礼物。',{mood:4},{checkers:-1},{choosePerson:true,people:['daughter','son']}),
  C('送出珍藏的童军手册','翻开的那一页被折了一个小角，像是给未来留下的约定。',{mood:3},{scout_book:-1},{choosePerson:true,people:['daughter','son']}),
  C('送出一份健康的祝愿与急救用品','礼物并不浪漫，却很实在。受伤的地方也终于认真处理过。',{health:3,mood:2},{medkit:-1},{choosePerson:true,people:['daughter','son']}),
  C('只唱一首生日歌','歌声唱完后有些安静，但这个日子至少没有被忘掉。',{mood:1},{},{choosePerson:true,people:['daughter','son']})],{minDay:10}),
 E('lg-memory-book','书页里的亲人','想起远方亲人时，大家开始寻找一张不知道夹在哪本书里的照片。也许那些旧书还保留着一点好消息。',[
  C('仔细翻阅童军手册','发黄的照片从页缝滑了出来，熟悉的脸一下子让回忆有了轮廓。',{mood:3},{photo:1},{requiresItem:'scout_book',all:true}),
  C('只说说记得的往事','故事说完，大家发现自己还记得很多细节。',{mood:1},{},{all:true})]),
 E('lg-neighbor-promise','答应邻居的事','父亲提起曾答应给一位旧邻居送点食物。母亲怀疑他是不是把危险想得太简单了。',[
  C('一起确认情况，再送食物','邻居正为孩子的晚饭发愁，这次帮助让误会也随之解开。',{mood:2},{canned:-1},{all:true,chance:0.8,failEffects:{health:-1,mood:-1},failItems:{canned:-1},failResult:'邻居附近有人埋伏，食物送到了，人却带着擦伤回来。'}),
  C('说明目前无法兑现','承诺暂时落空了，餐桌上的谈话也有些生硬。',{mood:-1},{},{targetId:'father'})],{requiresPeople:['father','mother'],minDay:7}),
 E('lg-darkside','不该拿走的补给','有人提出从其他幸存者手里强取补给。老人住处、邻居的小屋和临时课堂都不太设防，可他们同样需要活下去。',[
  C('强取老人住处的储粮','食物带回来了，谁也没有讲述途中发生的事。',{mood:-4},{canned:3},{all:true,setFlags:['lg_robbedInnocent']}),
  C('强取邻居藏起的饮水','水瓶排在架上，那扇再也不愿打开的邻居家门却留在每个人心里。',{mood:-4},{water:3},{all:true,setFlags:['lg_robbedInnocent']}),
  C('闯进临时课堂索取物资','里面的人比想象中多，你们在反抗中空手退了回来。',{mood:-3,health:-1},{},{all:true,setFlags:['lg_robbedInnocent']}),
  C('拒绝伤害其他幸存者','物资没有变多，但你们仍能坦然面对同一张餐桌。',{mood:2},{},{all:true})],{minDay:16,maxResource:{food:5}}),
 E('lg-starvation-thought','饥饿带来的危险念头','饥饿让餐桌上出现不愿复述的念头。越过这道底线，或许有人能多撑几天，代价却是一个家人永远消失。',[
  C('绝不伤害家人','大家约好不再提这个主意，接下来仍要一起想别的办法。',{mood:1},{},{all:true}),
  C('跨过这道无法回头的底线','屋里少了一个位置。留下的人得到一点食物，却再也无法把今天当作普通的一天。',{food:5,mood:-5},{},{all:true,choosePerson:true,losePerson:true,setFlags:['lg_robbedInnocent']})],{minDay:20,maxResource:{food:2},minHome:2}),
 E('lg-mother-crisis','快要压不住的情绪','母亲终于爆发了。那些没做完的事、没能救回的东西，全部涌到了一起。',[
  C('认真听完，别急着反驳','她把压在心里的话说完后终于停了下来，大家都很疲倦，却少了些敌意。',{mood:2,stamina:-1},{},{all:true}),
  C('今天先各自冷静','话没有说完，紧绷的气氛一直拖到熄灯。',{mood:-2},{},{all:true})],{requiresPeople:['mother'],maxResource:{mood:4}})
);
LEGACY_SHELTER_EVENTS.push(
 E('lg-dog-eyes','黑暗里的眼睛','舱门外亮起一双眼睛，低低的吼声让你们停在原地。现在能看清它的，只有手边的装备。',[
  C('打开手电筒看清楚','光圈里是一条疲惫的狗。它留了一夜，临走时又回头看了你们。',{mood:1},{},{requiresItem:'flashlight',setFlags:['lg_dogSeen'],followUp:{eventId:'lg-dog-feed',delay:2,chainId:'lg-dog'}}),
  C('用步枪把它吓走','那双眼睛迅速消失，再也没有靠近门口。',{}, {},{requiresItem:'rifle',setFlags:['lg_dogLost']}),
  C('朝通道喷驱虫剂','阴影退远了，你们始终不知道来的究竟是什么。',{}, {bug_spray:-1},{setFlags:['lg_dogLost']}),
  C('关上门，先求平安','外面的脚步声渐渐远去，没有留下可以辨认的痕迹。',{mood:-1},{},{setFlags:['lg_dogLost']})],{forbidsFlags:['lg_dogSeen','lg_dogLost','lg_dog'],chainId:'lg-dog'}),
 E('lg-dog-feed','它又回来了','那条被手电照到的狗又在门口等候。它比上次更瘦，却依然认得你们的脚步。',[
  C('分享一份罐头','它吃完后恢复了一点精神，像是认真记住了这扇门。',{mood:2},{canned:-1},{setFlags:['lg_dogFed'],followUp:{eventId:'lg-dog-follow',delay:3,chainId:'lg-dog'}}),
  C('留下食物给家人','狗在门外趴了一会，后来再没看见它。',{mood:-1},{},{setFlags:['lg_dogLost']})],{scheduledOnly:true,requiresFlags:['lg_dogSeen'],forbidsFlags:['lg_dogLost'],chainId:'lg-dog'}),
 E('lg-dog-follow','跟着摇动的尾巴','狗在门外不停来回，走出几步就回头，显然希望有人跟上它。出门前该拿哪件装备？',[
  C('带地图，小心跟随','地图帮你们避开坍塌道路，狗带来的那段路上还找到一些食物。',{stamina:-1},{canned:2},{requiresItem:'map',setFlags:['lg_dog']}),
  C('带斧子，准备应对危险','两个拦路的人被赶开，留下的饮水也成了狗的第一份礼物。',{stamina:-1},{water:3},{requiresItem:'axe',setFlags:['lg_dog']}),
  C('带步枪，保持警惕','街口突然响起枪声。你们平安退回，狗却被惊得消失在另一边。',{stamina:-2,mood:-1},{},{requiresItem:'rifle',setFlags:['lg_dogLost'],clearFlags:['lg_dog']}),
  C('这次不跟出去','狗等到天黑，最终自己离开了。',{mood:-1},{},{setFlags:['lg_dogLost']})],{scheduledOnly:true,requiresFlags:['lg_dogFed'],forbidsFlags:['lg_dogLost'],chainId:'lg-dog'}),
 E('lg-dog-trip','狗想出去转转','狗把鼻子贴在门边，过一会就回头看看你们。它显然受够了一整天的地下生活。',[
  C('放它出去，留好回来的门','小小的影子很快穿过通道，大家记住了它离开的方向。',{}, {},{clearFlags:['lg_dog'],followUp:{eventId:'lg-dog-trip-return',delay:2,chainId:'lg-dog-walk'}}),
  C('今天让它留在屋里','它在桌边打转，最后不情不愿地躺回老地方。',{mood:-1})],{requiresFlags:['lg_dog'],once:false,cooldown:12}),
 E('lg-dog-trip-return','熟悉的爪子声','门边传来了熟悉的挠门声，那条狗带着满身灰尘回来了。',[
  C('迎接它，检查带回的东西','它从布包里推出来一瓶饮水，骄傲地甩了甩尾巴。',{mood:2},{water:1},{setFlags:['lg_dog'],chance:0.7,failEffects:{mood:2},failSetFlags:['lg_dog'],failResult:'它什么也没带回来，但看见它平安就已经足够。'}),
  C('先给它清理爪子','门外的尘土留在了水盆里，狗也安心回到熟悉的角落。',{mood:1},{},{setFlags:['lg_dog']})],{scheduledOnly:true,chainId:'lg-dog-walk'}),
 E('lg-dog-locked-trip','锁好门的一次同行','狗愿意跟母亲走一趟附近的补给点。挂锁能在她们离开时，把这个来之不易的家牢牢锁好。',[
  C('用挂锁守住家，出去走一趟','门被锁好。回来之前，大家都得仔细记住路线。',{}, {padlock:-1},{targetId:'mother',sendPerson:{id:'mother',days:2,returnEffects:{stamina:-2},returnItems:{canned:1,water:1}}}),
  C('先留下，不让房间空着','挂锁重新放回架上，狗也停在母亲的椅子边。',{stamina:1})],{requiresFlags:['lg_dog'],requiresPeople:['mother'],requiresNoExpedition:true}),
 E('lg-cat-bag','会动的袋子','一个商人扛着不许拆看的袋子来到门口。袋里时不时轻轻动一下，他只要一份罐头。',[
  C('拿罐头换下袋子','袋口一松，一只生气的猫跳了出来。它巡视房间后占据了最暖的角落。',{mood:3},{canned:-1},{setFlags:['lg_cat'],clearFlags:['lg_dog']}),
  C('不买看不清的东西','商人扛起袋子离开，里面的动静也跟着远去了。',{}, {})],{forbidsFlags:['lg_cat']}),
 E('lg-cat-follows','废墟中跟来的猫','一只猫一路跟着外出的人回来，现在正在舱门外耐心挠门，像是已经决定住进这里。',[
  C('给它一个角落','猫挨个闻过所有人，最后选定最安稳的床脚睡下。',{mood:2},{},{setFlags:['lg_cat']}),
  C('不让陌生动物进屋','门外安静了，你们没能知道它后来去了哪里。',{mood:-1})],{minDay:20,forbidsFlags:['lg_cat']}),
 E('lg-cat-checkers','猫与棋盘','猫发现棋子落地的声音很好听，正在把它们一颗颗推向桌沿。桌边的人已经忍到极限。',[
  C('给它玩一会','它反而失去兴趣，最后只趴在棋盘中央睡觉。',{mood:1},{},{chance:0.75,failRemoveItems:['checkers'],failEffects:{mood:-1},failResult:'棋盘在争抢中折断，至少没有人被猫抓到。'}),
  C('立刻把棋盘抢回来','猫猛地跃起，棋盘和棋子一起滚到地上，没法再用了。',{mood:-1},{},{removeItems:['checkers']})],{requiresFlags:['lg_cat'],requiresItem:'checkers'}),
 E('lg-cat-collar','项圈上的地址','猫的项圈内侧刻着一个地址。也许原来的主人还在等待，也许只是一个早已不存在的地方。',[
  C('顺着地址寻找主人','路上出现的陌生人认出了猫，坚持先把它带走。你们只好记下会面的地方。',{stamina:-1},{},{clearFlags:['lg_cat'],setFlags:['catOwnerFound'],followUp:{eventId:'lg-cat-return',delay:3,chainId:'lg-cat-owner'}}),
  C('让猫暂时留下','它不愿解释自己的来历，只在门口留下一串新的脚印。',{mood:1},{},{setFlags:['lg_catOwnerDeclined']})],{requiresFlags:['lg_cat'],chainId:'lg-cat-owner'}),
 E('lg-cat-return','自己找回来的路','清晨开门时，猫已经坐在门边。它像什么也没发生一样，从你们脚边走了进去。',[
  C('欢迎回家','它选择了熟悉的地方，这次谁也没有再问它为什么。',{mood:2},{},{setFlags:['lg_cat']}),
  C('先检查它有没有受伤','除了沾灰的毛发，一切都很好。检查完它立刻又睡着了。',{stamina:-1,mood:1},{},{setFlags:['lg_cat']})],{scheduledOnly:true,chainId:'lg-cat-owner'}),
 E('lg-cat-night-trail','猫的夜间路线','猫总在深夜钻过墙缝，早晨又准时回来。它找到的是食物，还是另一个愿意喂它的人？',[
  C('远远跟在它后面','它领你到一辆改成实验室的旧车。里面的研究者认得猫，也热切谈起自己的计划。',{stamina:-1},{intel:1},{setFlags:['lg_catScientist'],route:true}),
  C('尊重它自己的安排','它继续按自己的时间来去，偶尔回来时还会蹭一下门框。',{mood:1})],{requiresFlags:['lg_cat','lg_catOwnerDeclined'],route:true,chainId:'lg-cat-scientist'}),
 E('lg-cat-wire','猫扯下的细线','猫从天花板拉出一根陌生电线。灯还亮着，说明它可能属于别的设备。',[
  C('沿着电线检查','线头通向停在外面的旧车。里面的人摘下耳机，尴尬地望着你。',{stamina:-1},{},{setFlags:['lg_wireFound'],followUp:{eventId:'lg-agents',delay:3,chainId:'lg-agents'}}),
  C('剪断后收好，不再追查','没有人再听得到这间屋里的谈话，至少你们愿意这样相信。',{mood:1},{parts:1})],{requiresFlags:['lg_cat'],chainId:'lg-agents'}),
 E('lg-agents','戴墨镜的访客','上次在车里见过的人来解释那根电线。他们声称自己执行秘密任务，还暗示有更安全的去处。',[
  C('听完条件，再决定是否合作','他们留下暗号，表示以后可能需要一些物资协助。',{}, {},{setFlags:['lg_agentsMet'],followUp:{eventId:'lg-agent-provisions',delay:4,chainId:'lg-agents'}}),
  C('拒绝这次合作','访客收起证件离开，今后你们还得依靠自己的判断。',{mood:1},{},{setFlags:['lg_agentsDeclined']})],{scheduledOnly:true,route:true,chainId:'lg-agents'}),
 E('lg-agent-provisions','秘密任务的后勤','戴墨镜的访客回来，要求为外面的同伴准备一批补给。承诺仍然只有一句：以后的安全。',[
  C('交出一批罐头','他们仔细清点补给，并约定再来通知下一步。',{mood:1},{canned:-4},{setFlags:['lg_agentProvisions']}),
  C('交出一批饮水','装满水瓶的箱子被搬上车，你们记下新的联络暗号。',{mood:1},{water:-4},{setFlags:['lg_agentProvisions']}),
  C('这次不提供物资','访客没有争论，但也不愿继续透露计划。',{}, {},{setFlags:['lg_agentsDeclined']})],{scheduledOnly:true,requiresFlags:['lg_agentsMet'],route:true,chainId:'lg-agents'}),
 E('lg-seed-plant','一颗陌生的种子','女儿找到一颗被仔细包好的种子。她想种下它，但土里的希望也要用宝贵饮水来浇灌。',[
  C('拿出饮水，试着种下','小盆被安置在灯下，女儿认真给它记下了日期。',{mood:1},{water:-1},{setFlags:['lg_plantGrowing'],followUp:{eventId:'lg-glowing-harvest',delay:5,chainId:'lg-plant'}}),
  C('先把种子干燥保存','花盆仍然空着，种子则留给另一个可能更合适的日子。',{mood:-1},{seeds:1})],{requiresPeople:['daughter'],forbidsFlags:['lg_plantGrowing'],chainId:'lg-plant'}),
 E('lg-glowing-harvest','过快成熟的果实','盆里的植物长得远比预料更快，果实带着一层奇怪微光。再不收获，或许就错过了它的季节。',[
  C('现在采下果实','成熟果实被整理成可保存的食物。那颗种子的希望终于有了重量。',{mood:2},{canned:4},{clearFlags:['lg_plantGrowing']}),
  C('再等等看','第二天，整株植物已经枯萎成灰。等待没有换来更好的收成。',{mood:-2},{},{clearFlags:['lg_plantGrowing']})],{scheduledOnly:true,requiresFlags:['lg_plantGrowing'],chainId:'lg-plant'}),
 E('lg-father-car','口袋里的车钥匙','父亲忽然摸到一串旧钥匙，开始念叨停在附近的汽车。它也许早成了废铁，但他想亲眼看看。',[
  C('让他去确认一下','他记下附近路口的位置，带着钥匙出门。',{}, {},{targetId:'father',sendPerson:{id:'father',days:2,returnEffects:{stamina:-2}},followUp:{eventId:'lg-roadside-bbq',delay:3,chainId:'lg-old-car'}}),
  C('先留下，别为旧车冒险','钥匙重新塞回口袋，他也许明白道理，却仍然有些失落。',{mood:-2},{},{targetId:'father'})],{requiresPeople:['father'],requiresNoExpedition:true,chainId:'lg-old-car'}),
 E('lg-roadside-bbq','没找到车的归程','父亲没有带回车的消息，倒是说起回程路上遇见的一场临时聚餐。热闹让他久违地忘了时间。',[
  C('听他讲完聚餐，再好好休息','带回的小罐头放上桌，晚些时候的不适提醒他下次得更谨慎。',{mood:3,health:-1,stamina:1},{canned:1},{targetId:'father'}),
  C('先检查身体，再谈旧车','聚餐的故事留到明天，今天先让他睡个安稳觉。',{stamina:2,mood:1},{},{targetId:'father'})],{scheduledOnly:true,requiresPeople:['father'],chainId:'lg-old-car'}),
 E('lg-school-visit','想回去看一眼的学校','女儿想回熟悉的学校，看看还有没有同学或旧物留下。那里比眼前废墟更远，但她已经记好了路线。',[
  C('允许这趟谨慎的探访','她答应不进入危险教室，并会按时回来。',{}, {},{targetId:'daughter',sendPerson:{id:'daughter',days:3,returnEffects:{mood:2,stamina:-2}},followUp:{eventId:'lg-teacher-visit',delay:4,chainId:'lg-school'}}),
  C('今天不去，留在家里','课表上不会再有人记旷课，但她还是对这个决定很失望。',{mood:-2},{},{targetId:'daughter'})],{requiresPeople:['daughter'],requiresNoExpedition:true,chainId:'lg-school'}),
 E('lg-teacher-visit','登记簿里的地址','学校登记簿上留着音乐老师的住址。女儿担心老人需要帮助，还想继续走这段路。',[
  C('让她拜访老师','她找到的老师比想象中更能照顾自己，还送出一只保存完好的口琴。',{}, {},{targetId:'daughter',sendPerson:{id:'daughter',days:2,returnEffects:{mood:3,stamina:-2},returnItems:{harmonica:1}}}),
  C('把地址记下来，暂缓拜访','女儿把地址夹进笔记，答应以后还有机会。',{mood:-1},{intel:1},{targetId:'daughter'})],{scheduledOnly:true,requiresPeople:['daughter'],requiresNoExpedition:true,chainId:'lg-school'}),
 E('lg-code-note','写满符号的纸条','门缝下塞进一张密写纸条。母亲好像见过这样的编码，愿意试着把它解开。',[
  C('让她专心解码','符号被一行行誊写出来，母亲工作到很晚才放下铅笔。',{stamina:-2},{},{targetId:'mother',followUp:{eventId:'lg-coded-reunion',delay:3,chainId:'lg-code'}}),
  C('先顾眼前，不碰陌生暗号','纸条被收进柜子，母亲显得有点失落。',{mood:-1},{},{targetId:'mother'})],{requiresPeople:['mother'],chainId:'lg-code'}),
 E('lg-coded-reunion','纸条里的旧同事','编码终于解开，竟是一位旧同事的联络邀请。纸条要求母亲独自前去，她已经准备好了答复。',[
  C('按约去见旧友','她带着约定的记号出发，答应不在外面逗留太久。',{}, {},{targetId:'mother',sendPerson:{id:'mother',days:2,returnEffects:{mood:3,stamina:-2},returnItems:{water:1,canned:1}}}),
  C('暂不赴约','字条被折回原样，母亲没能知道旧友现在过得怎样。',{mood:-2},{},{targetId:'mother'})],{scheduledOnly:true,requiresPeople:['mother'],requiresNoExpedition:true,chainId:'lg-code'}),
 E('lg-stargazing','残存的望远镜','儿子从观察口认出废墟里的旧望远镜。他想趁今晚天空清晰，再看看星星是否还在原来的地方。',[
  C('约好观察时间','他出发前认真检查路线，回程会把看见的星星讲给大家听。',{}, {},{targetId:'son',sendPerson:{id:'son',days:1,returnEffects:{mood:3,stamina:-1}}}),
  C('今晚留在屋里','星空仍在那里，可他今天只能从想象中看见。',{mood:-2},{},{targetId:'son'})],{requiresPeople:['son'],requiresNoExpedition:true,minDay:7})
);
LEGACY_SHELTER_EVENTS.push(
 E('lg-green-poor','穿绿衣的访客','一群穿绿衣的人说，要把有余的物资交给缺少物资的人。他们站在门口，想看看你们现在过得怎样。',[
  C('请他们进来看看','看过空荡荡的储物架，访客留下了一台能用的收音机。',{mood:2},{radio:1}),
  C('隔门谢绝','脚步声离开了，你们仍然不知道这次信任会带来什么。',{}, {})],{maxStock:6}),
 E('lg-green-rich','来清点物资的绿衣人','绿衣访客们打量着储物架，认为你们该为其他幸存者分出一点余粮。',[
  C('开门交谈','他们带走一小部分物资，承诺把东西送给更需要的人。',{mood:-1},{},{removeItems:['canned','water']}),
  C('关门，守好自己的物资','访客在门边争论了一会，最终转向下一条街。',{mood:-1})],{minStock:7}),
 E('lg-anonymous-case','无署名的手提箱','清晨门口出现一只旧箱子，没有便条，也看不到送来它的人。',[
  C('谨慎打开看看','箱子里装着密封食物，还有一个能继续使用的旧箱壳。',{mood:1},{canned:1,suitcase:1},{chance:0.7,failEffects:{health:-2},failItems:{suitcase:1},failResult:'里面的食物早已变质，幸好只尝了一小口；箱子倒还能用。'}),
  C('不接受来路不明的东西','你把箱子挪到远离舱门的位置，第二天它已经不见。',{}, {})]),
 E('lg-stone-gift','卖石头的老人','一位眼熟的老人来问你们要不要一块石头。他坚持说第一块不收东西，只希望有人愿意认真挑选。',[
  C('接过石头，认真道谢','老人把一块光滑石头放在你手心，说以后路过还会来看看。',{mood:1},{},{followUp:{eventId:'lg-stone-return',delay:4,chainId:'lg-stone'}}),
  C('礼貌回绝','老人耸耸肩，抱着那袋石头慢慢走远。',{}, {})],{chainId:'lg-stone'}),
 E('lg-stone-return','石头带来的好运','卖石头的老人又来了。这次他带着一大瓶干净的水，说好运至少应该能让人解渴。',[
  C('接过饮水，一起聊聊','杯子被重新添满，大家很久没有这样踏实地喝水了。',{water:4,mood:1},{water:1},{all:true}),
  C('先存好，留到紧要时刻','老人把盖子拧紧，将那份难得的好意留在物资架上。',{mood:1},{water:2})],{scheduledOnly:true,chainId:'lg-stone'}),
 E('lg-young-guards','年轻人的巡逻队','门外站着一群背着装备的年轻人，说自己在保护附近街区。他们看上去比喊出来的口号紧张得多。',[
  C('开门说明这里的情况','年轻人确认你们只是普通幸存者，留下饮水和一把备用斧子。',{mood:1},{water:1,axe:1}),
  C('隔门道平安，不透露细节','巡逻队继续向前，没有把这扇门当成敌人。',{}, {})]),
 E('lg-language-radio','听不懂的广播','调频时突然出现一种陌生语言。语气平静，像在播报普通天气。有人想把声音关掉，有人却想多听一会。',[
  C('把广播听完','内容依然听不懂，远方还有人在生活这件事，却让大家轻松了一点。',{mood:2},{},{all:true}),
  C('换回熟悉的频道','噪声重新填满房间，今天没有多听见别的消息。',{}, {})],{requiresItem:'radio'}),
 E('lg-radio-repair','只有白噪声的频道','收音机从早到晚只剩白噪声。是所有广播都停了，还是这台旧机器终于出了问题？',[
  C('拆开外壳调整','旋钮重新能转了，却没有立刻找到想要的声音。',{stamina:-1,mood:-1},{},{chance:0.6,failRemoveItems:['radio'],failEffects:{mood:-2},failResult:'老化的线路经不起折腾，机器彻底安静下来。'}),
  C('暂不拆机，等信号回来','期待没有马上兑现，至少机器仍好好放在原处。',{mood:-1})],{requiresItem:'radio'}),
 E('lg-strange-transmission','很远很远的呼叫','静电声中夹着几句关于遥远旅程和失去联络的呼叫。那不太像本地电台，也不完全像一场玩笑。',[
  C('慢慢调出更清楚的信号','一段慌张的声音说出一个熟悉城区的住址，随后又只剩噪声。',{stamina:-1},{},{followUp:{eventId:'lg-radio-address',delay:2,chainId:'lg-odd-radio'}}),
  C('不动旋钮，保住当前频道','呼叫渐渐淡了下去，你们没能记下更多内容。',{}, {})],{requiresItem:'radio',chainId:'lg-odd-radio'}),
 E('lg-radio-address','广播留下的住址','上次听到的地址就在附近。声音的主人已经不再回应，要不要去看看那里还留下什么？',[
  C('谨慎查访那个地址','屋里有咖啡香和凌乱文件。你没有找到主人，只带回一些还完整的补给。',{stamina:-2},{canned:2},{setFlags:['lg_radioAddressVisited']}),
  C('留在这里，继续等待声音','广播没有完全停止，细碎的节拍像是在等待某种回应。',{}, {},{setFlags:['lg_radioAddressDeclined'],followUp:{eventId:'lg-cosmic-reply',delay:3,chainId:'lg-odd-radio'}})],{scheduledOnly:true,chainId:'lg-odd-radio'}),
 E('lg-cosmic-reply','对远方吹一首歌','电波里响起像口琴一样的旋律。你们不知道是谁在另一端，却忽然有了用音乐回答的念头。',[
  C('用口琴回应','抬头时，远处出现一串忽明忽暗的光。也许只是巧合，大家却第一次觉得自己没有那么孤单。',{mood:3},{},{requiresItem:'harmonica',all:true}),
  C('继续倾听，不发出声音','旋律终究淡去，但远方有人存在的感觉没有立刻消失。',{mood:1})],{scheduledOnly:true,requiresItem:'radio',requiresFlags:['lg_radioAddressDeclined'],chainId:'lg-odd-radio'}),
 E('lg-supply-rush','广播里的补给投放','急促的广播宣称附近刚投放了补给。地面很快传来争抢声，这次机会显然不会等太久。',[
  C('趁人还没聚齐去一趟','你抓住两箱还能拿走的补给，在争执变大之前离开。',{stamina:-2},{canned:2,water:2},{chance:0.7,failEffects:{health:-1,stamina:-2},failItems:{canned:1},failResult:'人群把出口挤得很窄，匆忙中只带回一只罐头。'}),
  C('不卷入争抢','喧闹持续了很久，你们保住了平静，却没能多添一份物资。',{}, {})],{requiresItem:'radio',minDay:8}),
 E('lg-wall-safe','地图后面的保险格','地图突然滑落，墙后露出一个被遗忘的小保险格。锁还完好，却并不复杂。',[
  C('尝试把它打开','锈锁终于松开，里面的饮水仍然密封得很好。',{stamina:-1},{water:1},{chance:0.7,failRemoveItems:['canned'],failEffects:{mood:-1},failResult:'开锁时房间忽然停电，混乱过后发现一份食物摔坏了，格子里却是空的。'}),
  C('先把地图挂回去','好奇心暂时收住了，今天仍按原来的计划继续。',{}, {})],{requiresItem:'map'}),
 E('lg-neighbors-below','地板下的动静','床脚附近的地板下面有声音。一块旧盖板似乎通向更深的房间，只是一直没有打开过。',[
  C('带手电筒下去查看','光束照到一排完整储物架，你拿走饮水后沿原路回来。',{stamina:-1},{water:2},{requiresItem:'flashlight',chance:0.75,failEffects:{health:-2,stamina:-1},failResult:'下面有陌生动物活动，匆忙爬回去时被盖板擦伤了。'}),
  C('带斧子防身','挥开的杂物后露出一只旧急救箱，声音的来源却没有找到。',{stamina:-1},{medkit:1},{requiresItem:'axe',chance:0.65,failEffects:{health:-2},failResult:'狭窄的暗处突然有东西扑来，你只好立刻退回去。'}),
  C('重新压紧盖板','声音暂时听不到了，但那个未知房间仍让人心里发紧。',{mood:-1})]),
 E('lg-hopeful-picnic','留给两个人的片刻','父母很久没有独处，连最小的讨论也总有人听见。门边那一小片背风空地，也许能换来一次安静谈话。',[
  C('留出一点空间，给他们独处','回来时他们没有复述谈话内容，却都愿意重新坐到同一侧。',{}, {},{personEffects:{father:{mood:3},mother:{mood:3}}}),
  C('今天仍守在屋里','谈话被推到以后，拥挤房间里的沉默又多了一点。',{}, {},{personEffects:{father:{mood:-1},mother:{mood:-1}}})],{requiresPeople:['father','mother']}),
 E('lg-huntress','追踪巨蛛的猎人','一位女猎人来到门边，说自己正在追踪某种巨大的野生动物。她缺少备用弹药，并承诺日后报答。',[
  C('分享备用弹药','她认真记住这扇门的位置，说猎物找到之后会再来。',{}, {ammo:-1},{followUp:{eventId:'lg-huntress-meal',delay:4,chainId:'lg-huntress'}}),
  C('留下弹药防身','猎人没有争执，只是继续沿着足迹往前走。',{}, {})],{chainId:'lg-huntress'}),
 E('lg-huntress-meal','拴着巨蛛的回访','猎人果然回来了，身旁竟跟着一只已经驯服的巨大蜘蛛。她带来的晚餐比解释更让人关心。',[
  C('一起分享这顿饭','那只蜘蛛安静待在门外，热饭则让大家重新有了精神。',{food:4,mood:2},{},{all:true}),
  C('收下食物，和动物保持距离','猎人理解你们的顾虑，把装好的食物留在门边。',{mood:1},{canned:2})],{scheduledOnly:true,chainId:'lg-huntress'}),
 E('lg-visiting-doctors','穿白衣的求助者','一队自称流动医护的人来到舱门前，希望得到干净饮水，才能继续处理路上伤者的需要。',[
  C('分给他们一瓶水','对方记下这里，表示等补给整理好就回来看看大家。',{mood:1},{water:-1},{followUp:{eventId:'lg-doctors-return',delay:4,chainId:'lg-doctors'}}),
  C('先把水留给家人','白衣访客点点头，继续去找下一扇愿意打开的门。',{}, {})],{chainId:'lg-doctors'}),
 E('lg-doctors-return','医护带着药回来了','之前请求饮水的医护人员回来履行承诺。带来的设备虽然简陋，检查却十分认真。',[
  C('请他们为大家检查','需要处理的伤口重新包好，发热的人也终于得到照顾。',{health:5,infection:-2,mood:1},{},{all:true}),
  C('优先检查最虚弱的家人','对方在床边仔细忙了一阵，留下新的绷带。',{health:6,infection:-2},{bandage:1},{choosePerson:true})],{scheduledOnly:true,chainId:'lg-doctors'}),
 E('lg-knights-map','自称骑士的旅人','几位拿着木剑的旅人声称正在寻找传说中的地点。扮相古怪，他们却只是想看看地图。',[
  C('拿出地图指路','他们郑重道谢，送出一副保存完好的棋盘当作回礼。',{mood:1},{checkers:1},{requiresItem:'map'}),
  C('认真解释自己也不熟路','骑士们有些失望，但没有纠缠，继续寻找下一位向导。',{}, {})]),
 E('lg-army-mask','巡逻队的短途任务','巡逻队请求协助检查一个可能受污染的入口，前提是带好防护面具。没有防护就不该冒进。',[
  C('带面罩协助检查','任务很快结束，对方记录了你们提供的线索。',{stamina:-1},{intel:1},{requiresItem:'mask',setFlags:['lg_armyAssisted']}),
  C('说明没有合适装备','巡逻队理解了拒绝，约定以后有机会再合作。',{}, {})],{types:['nuclear'],route:true,minDay:7}),
 E('lg-cards-marker','用纸牌留下人数标记','军方广播要求在附近站牌留下纸牌，作为避难所人数与位置的标记。这个奇怪方法至少不需要发出太大声响。',[
  C('用纸牌做好标记','纸牌被牢牢固定在指定位置，物资架上多了一份你写回来的联络情报。',{stamina:-1},{intel:1},{requiresItem:'cards',setFlags:['lg_militaryMarked']}),
  C('暂时不暴露位置','你们没有走出去，广播声也慢慢被噪声盖住。',{}, {})],{requiresItem:'radio',types:['nuclear'],route:true,minDay:7}),
 E('lg-camp-letter','署名为朋友的求助信','一封求助信写着一处地址。来信人是一对照顾其他幸存者的兄妹，希望有人愿意分出一点食物。',[
  C('带去一份罐头','信里的兄妹正照顾一群无力外出的人。他们记住这份帮助，并约好继续联络。',{mood:2},{canned:-1},{setFlags:['lg_campStarted'],followUp:{eventId:'lg-camp-map',delay:3,chainId:'lg-community'}}),
  C('先把物资留给家人','你把地址留在日志里，今天还无法回应他们。',{}, {})],{minDay:8,forbidsFlags:['lg_robbedInnocent','lg_campStarted'],chainId:'lg-community'}),
 E('lg-camp-map','寻找更大的营地','兄妹照顾的人越来越多，原来的帐篷挤不下了。他们想看一看地图，寻找能让大家住稳的地方。',[
  C('借出地图并一起规划','你们圈出几个值得调查的地方，对方离开前郑重道谢。',{stamina:-1,mood:1},{},{requiresItem:'map',setFlags:['lg_campMapped'],followUp:{eventId:'lg-camp-build',delay:3,chainId:'lg-community'}}),
  C('先分享已经走过的路线','消息不如地图完整，但也让他们少了几个危险选择。',{mood:1},{intel:-1},{setFlags:['lg_campMapped'],followUp:{eventId:'lg-camp-build',delay:4,chainId:'lg-community'}}),
  C('这次帮不上忙','兄妹表示会自己继续寻找，联络还会保持。',{}, {})],{scheduledOnly:true,requiresFlags:['lg_campStarted'],forbidsFlags:['lg_robbedInnocent'],chainId:'lg-community'}),
 E('lg-camp-build','营地需要木料与工具','选好的营地还缺少坚实围挡。兄妹来问，是否有能帮助施工的斧子或备用材料。',[
  C('交出一把斧子','施工的人终于有了得力工具，门边留下感谢的标记。',{mood:1},{axe:-1},{setFlags:['lg_campBuilt'],followUp:{eventId:'lg-camp-games',delay:4,chainId:'lg-community'}}),
  C('提供木料与零件','材料被认真打包，下一次见面时营地应该会更稳固。',{mood:1},{wood:-1,parts:-1},{setFlags:['lg_campBuilt'],followUp:{eventId:'lg-camp-games',delay:4,chainId:'lg-community'}}),
  C('留下自己的工具','兄妹没有为难你们，准备从别处想办法。',{}, {})],{scheduledOnly:true,requiresFlags:['lg_campStarted'],forbidsFlags:['lg_robbedInnocent'],chainId:'lg-community'}),
 E('lg-camp-games','营地里的孩子们','围挡和床位已经大致齐备，但小孩子们每天只能在废墟里打发时间。兄妹想为他们找点安全的娱乐。',[
  C('送出纸牌','他们说，哪怕缺一两张，也足够发明很多新游戏。',{mood:2},{cards:-1},{setFlags:['lg_campFun']}),
  C('送出口琴','乐器被仔细裹好，这次送出去的是一点热闹生活的可能。',{mood:2},{harmonica:-1},{setFlags:['lg_campFun']}),
  C('送出棋盘','棋盘将放在营地公共桌上，成为孩子们可以一起等待明天的地方。',{mood:2},{checkers:-1},{setFlags:['lg_campFun']}),
  C('暂时留下这些游戏','兄妹表示理解，仍祝你们今晚平安。',{}, {})],{scheduledOnly:true,requiresFlags:['lg_campBuilt'],forbidsFlags:['lg_robbedInnocent'],chainId:'lg-community'}),
 E('lg-camp-nest','营地旁的虫巢','友好的幸存者发现住处附近有一处变异虫巢，希望在虫群扩张前清掉它。',[
  C('提供杀虫喷雾','喷雾足够用来处理虫巢，来人留下饮水道谢。',{mood:1},{bug_spray:-1,water:1},{setFlags:['lg_nestHelped']}),
  C('带斧子帮忙清理','累得双臂发酸，但巢穴终于被拆除，营地可以安心一些。',{stamina:-2,mood:1},{canned:1},{requiresItem:'axe',setFlags:['lg_nestHelped']}),
  C('带步枪协助警戒','大家趁掩护处理掉巢穴，回来时还分到一点食物。',{stamina:-1},{canned:1},{requiresItem:'rifle',setFlags:['lg_nestHelped']}),
  C('这次没有合适办法','来人准备继续向其他住处求助。',{}, {})],{requiresFlags:['lg_campStarted']}),
 E('lg-handymen','多一双愿意帮忙的手','一群外表被灾难改变的幸存者来到门边。他们只想换一点补给，并提出可以帮忙防守或照看回程路。',[
  C('用罐头换下次防守的帮助','他们记下附近几处藏身点，承诺下次遇到强盗会赶来。',{mood:1},{canned:-1},{setFlags:['lg_raidGuard']}),
  C('用饮水换下次外出的护送','对方圈出容易遇袭的路口，答应下一次为回程多留一双眼睛。',{mood:1},{water:-1},{setFlags:['lg_tripEscort']}),
  C('说明现在无法分出物资','对方没有责怪，叮嘱你们关好门。',{}, {})],{once:false,cooldown:20}),
 E('lg-raider-demand','强盗逼近舱门','门外的人不肯交谈，只要求你们放弃抵抗，把避难所交出来。门框已经在撞击中发响。',[
  C('用挂锁撑住入口','强盗没能撬开门，挂锁却也被砸得不能再用了。',{stamina:-1},{padlock:-1}),
  C('用斧子守住门口','你们顶住了这次进攻，斧柄却在最后一次撞击中折断。',{stamina:-1},{axe:-1}),
  C('用步枪和备用弹药防守','门外的人终于退开，今天的弹药已经用尽。',{stamina:-1},{ammo:-1},{requiresItem:'rifle'}),
  C('吹口琴争取一段谈话时间','门外的人没有继续冲进来，似乎也被这突然的音乐打乱了打算。',{mood:1},{},{requiresItem:'harmonica',chance:0.6,failRemoveItems:['harmonica'],failEffects:{health:-1},failResult:'刺耳的一响没能劝住他们，口琴也在混乱中压坏了。'}),
  C('呼唤曾帮过的邻居','多出的几双手从侧巷赶来，强盗只能放弃进攻。',{mood:2},{},{requiresFlags:['lg_raidGuard'],clearFlags:['lg_raidGuard']}),
  C('让异变后的女儿保护大家','她挡在门口赶跑来人，之后很久才安静下来。',{stamina:-2},{},{requiresFlags:['lg_mutantDaughter'],requiresPeople:['daughter'],targetId:'daughter'}),
  C('让狗从侧面吓退他们','狗冲向门外，强盗散去后却再没看见它的身影。',{mood:-2},{},{requiresFlags:['lg_dog'],clearFlags:['lg_dog'],setFlags:['lg_dogLost']}),
  C('放弃抵抗，先保住性命','强盗搬走眼前最容易拿走的物资，留下受伤与混乱。',{health:-2,mood:-2},{},{removeItems:['canned','water','medkit','radio'],all:true})],{minDay:16,once:false,cooldown:18}),
 E('lg-raider-skirmish','试探性的抢夺','几个趁夜靠近的人试图撬开储物通道。你们还有机会在他们进入房间之前阻止。',[
  C('用挂锁拖住入口','撬门的人放弃了，门上的锁也已经变形。',{}, {padlock:-1}),
  C('用喷雾制造撤退机会','对方退回通道，混乱中落下一些备用弹药。',{stamina:-1},{bug_spray:-1,ammo:1}),
  C('举起斧子守住','你们合力守住窄门，退去的人留下了一盒电池。',{stamina:-1},{battery:1},{requiresItem:'axe'}),
  C('用步枪逼他们后退','他们把一把斧子丢在地上，旧枪却也受损卡死。',{stamina:-1},{axe:1},{requiresItem:'rifle',removeItems:['rifle']}),
  C('护着家人退到墙边','食物和水被拿走一些，好在大家仍然在一起。',{mood:-1},{},{removeItems:['canned','water']})],{minDay:10,once:false,cooldown:16}),
 E('lg-refugee-charity','衣衫褴褛的求助者','一小群难民来到门口，想要的并不多：能喝的水、能吃的东西，或者处理伤口的药。',[
  C('分出一份食物','他们把一路用过的地图留给你们，感谢的话说了很久。',{mood:3},{canned:-1,map:1},{all:true}),
  C('分出一瓶饮水','访客留下一台小收音机，执意不肯让你们推辞。',{mood:3},{water:-1,radio:1},{all:true}),
  C('交出急救箱','最虚弱的伤者得到照顾，大家离开时重新有了站稳的力气。',{mood:4},{medkit:-1},{all:true}),
  C('说明现在顾不上别人','对方垂下眼睛，没有继续恳求，只是走向下一扇门。',{mood:-1})])
);
LEGACY_SHELTER_EVENTS.push(
 E('lg-entertainment','得找点事情做','等待让每个人都开始烦躁。储物架上的东西，也许能让今天不再只是坐到天黑。',[
  C('听一段收音机','很久以前的歌从杂音中冒出来，大家跟着哼了几句。',{mood:2},{},{requiresItem:'radio',all:true}),
  C('玩一局纸牌','牌局从平静变得吵闹，最后终于有人笑出声。',{mood:2},{},{requiresItem:'cards',all:true,chance:0.8,failRemoveItems:['flashlight'],failEffects:{mood:1},failResult:'一次争论碰倒了手电筒，好在牌局没有把关系也一起弄坏。'}),
  C('摆开棋盘','简单的规则让漫长下午有了结束与开始。',{mood:2},{},{requiresItem:'checkers',all:true}),
  C('检查旧步枪消磨时间','机械零件值得认真检查，仓促摆弄却让手指受了伤。',{health:-1,stamina:-1},{},{requiresItem:'rifle'}),
  C('继续坐着等','墙上的痕迹并没有长出新的故事，倦意倒是更重了。',{mood:-1,stamina:-1},{},{all:true})],{once:false,cooldown:12}),
 E('lg-hide-game','需要道具的侦探游戏','孩子们计划玩一场寻物推理游戏，想借走一件真正的物资充当关键线索。线索能不能找回来，就得看他们的记性。',[
  C('借出纸牌','一整天都有人在猜藏匿地点，直到晚饭才终于找到大多数线索。',{mood:2},{},{requiresItem:'cards',all:true,chance:0.7,failRemoveItems:['cards'],failEffects:{mood:2},failResult:'游戏非常热闹，只是最后谁也想不起纸牌究竟藏在哪里。'}),
  C('借出手电筒','灯光成了最后一段谜题的答案，欢呼声把其他人也引到桌边。',{mood:2},{},{requiresItem:'flashlight',all:true,chance:0.7,failRemoveItems:['flashlight'],failEffects:{mood:2},failResult:'大家猜完了谜，手电筒却真的成了失踪物品。'}),
  C('只用空罐子当道具','谜题简单了一些，但至少没有珍贵物资可能消失。',{mood:1},{},{all:true})],{requiresPeople:['daughter','son']}),
 E('lg-ammo-trade','只想要弹药的商人','门外商人对备用弹药格外感兴趣，愿意拿自己的东西交换。眼下要的是防守能力，还是别的生存物资？',[
  C('用弹药换收音机','旧收音机在门边试出了声音，双方都认可了这笔交换。',{}, {ammo:-1,radio:1}),
  C('用弹药换口粮','新罐头放上架，原来的弹药盒则被商人带走。',{}, {ammo:-1,canned:1}),
  C('拿棋子开个玩笑','商人没有被逗乐，居然把棋盘当成谈好的东西拿走了。',{mood:-1},{checkers:-1}),
  C('结束谈话，保留物资','商人失望地离开，你们仍然可以自己决定何时用这些东西。',{}, {})]),
 E('lg-make-medkit','拼起一只应急药箱','受潮的应急盒只剩零散备件。也许拆用一罐清洁喷雾的附件，能够把散落用品重新整理成完整装备。',[
  C('尝试整备和重新封装','密封附件派上了用场，杂乱用品终于被整理成一只可以使用的急救箱。',{stamina:-1},{bug_spray:-1,medkit:1},{chance:0.7,failEffects:{health:-1,stamina:-1},failItems:{bug_spray:-1,medkit:1},failResult:'药箱整理好了，过程中刺鼻气味却让人很不舒服。'}),
  C('保留喷雾，等待合适药品','空格子没有被胡乱填满，药箱还得以后再整理。',{}, {})],{requiresItem:'bug_spray'}),
 E('lg-case-fishing','不用鱼竿的捞取','附近的小池塘里露出一截像物资箱的东西。没有合适鱼竿，旧手提箱也许能临时当一次打捞工具。',[
  C('牺牲手提箱试着捞取','箱底泡坏了，但里面兜起的零件和密封物品仍能带回去。',{stamina:-1},{suitcase:-1,parts:1,water:1},{chance:0.7,failEffects:{stamina:-2},failItems:{suitcase:-1,parts:1},failResult:'手提箱几乎散架，最后只兜起几块还算能用的金属件。'}),
  C('留下箱子，不下水','池塘没有给出答案，旧箱子至少还能继续用来装东西。',{}, {})],{requiresItem:'suitcase'}),
 E('lg-camp-school','废墟里的第一间课堂','营地已经能遮风，兄妹又开始为孩子们筹备课堂。他们缺少的不是老师，而是能拿在手里认真翻阅的书。',[
  C('送出童军手册','几位孩子围着新书坐好，幸存不再是课堂里唯一的一件事。',{mood:2},{scout_book:-1},{setFlags:['lg_campSchool']}),
  C('送出旧小说和笔记','故事可以练习阅读，空白纸也终于有了比点火更好的用途。',{mood:1},{book:-1,notebook:-1},{setFlags:['lg_campSchool']}),
  C('暂时留下自己的书','来人说还会继续找，教育这件事值得慢慢准备。',{}, {})],{requiresFlags:['lg_campBuilt'],forbidsFlags:['lg_robbedInnocent']}),
 E('lg-hear-noises','又听见那种声音','没人找到响声来自哪条管线，越想寻找却越觉得处处都有。继续盯着墙面，也许只会把自己拖进恐惧。',[
  C('用纸牌分散注意力','等大家想起那阵声音时，已经不确定它是什么时候停下的。',{mood:2},{},{requiresItem:'cards',all:true}),
  C('用棋盘安排一场比赛','眼前的局势替代了墙后的猜疑，连呼吸也平稳下来。',{mood:2},{},{requiresItem:'checkers',all:true}),
  C('独自盯着墙继续听','声音没有变得更清楚，心里却越来越乱。',{mood:-3})],{maxResource:{mood:8}}),
 E('lg-scout-signal','地平线上的闪光','外出时看见的一串闪光一直让儿子惦记。他认为那可能是童军伙伴使用的联络方式。',[
  C('对照手册解读','那些闪光终于拼出有意义的消息，儿子兴奋地准备回应。',{mood:2},{},{requiresItem:'scout_book',targetId:'son',followUp:{eventId:'lg-scout-reply',delay:2,chainId:'lg-scouts'}}),
  C('暂不追查陌生信号','儿子收好记下的节拍，今天还无法知道伙伴是否平安。',{mood:-1},{},{targetId:'son'})],{requiresPeople:['son'],chainId:'lg-scouts',minDay:6}),
 E('lg-scout-reply','向伙伴发回消息','解读过的灯光再次出现。儿子想趁对方还在监听，用简单信号码说明这里有人平安。',[
  C('用手电筒发回消息','几段熟悉的节拍发出后，远方也亮起回应的光。',{mood:1},{},{requiresItem:'flashlight',targetId:'son',setFlags:['lg_scoutContact'],followUp:{eventId:'lg-scout-visit',delay:3,chainId:'lg-scouts'}}),
  C('按手册制作白天能辨认的标记','标记安稳留在门边，希望伙伴能看懂它。',{stamina:-1},{},{requiresItem:'scout_book',setFlags:['lg_scoutContact'],followUp:{eventId:'lg-scout-visit',delay:4,chainId:'lg-scouts'}}),
  C('今天不发信号','闪光直到深夜才停下，儿子一直没能完全入睡。',{mood:-1,stamina:-1},{},{targetId:'son'})],{scheduledOnly:true,requiresPeople:['son'],chainId:'lg-scouts'}),
 E('lg-scout-visit','童军伙伴的来访','门外响起约定节拍。那串远方闪光的主人找到了这里，还带来一份小小补给。',[
  C('开门迎接伙伴','久别的同伴挤在桌边讲了很久的故事，饮水也一同放上架。',{mood:3},{water:1},{targetId:'son'}),
  C('隔门确认平安，再收下补给','没能见面的遗憾没有盖过大家仍然活着的好消息。',{mood:2},{canned:1},{targetId:'son'})],{scheduledOnly:true,requiresPeople:['son'],requiresFlags:['lg_scoutContact'],chainId:'lg-scouts'}),
 E('lg-door-mystery','没有约定的敲门声','深夜有人敲门，既没有自报身份，也没有使用任何约定暗号。也许是援助，也许是新的麻烦。',[
  C('小心开一条门缝','两位戴面罩的旅人留下饮水就继续赶路，甚至没来得及问他们的名字。',{mood:1},{water:2},{chance:0.65,failEffects:{health:-2},failResult:'门外突然有东西撞来，你赶紧关门，肩膀仍被擦伤了。'}),
  C('等到敲门声停止','门外的人没有继续逗留，这一次你们保住了安静。',{}, {})],{once:false,cooldown:14}),
 E('lg-astro-salesman','谈论太空的推销员','访客讲起遥远轨道上的奇闻，讲着讲着才说自己只是饿了。那些故事真假难辨，眼前的疲惫却是真的。',[
  C('分出一份食物，听他讲完','故事绕了很大一圈，大家却因此短暂忘了困境。',{mood:2},{canned:-1},{all:true}),
  C('给他一瓶水','对方喝得很慢，说完最后一个奇闻才认真道谢。',{mood:2},{water:-1},{all:true}),
  C('请他去别处碰碰运气','关于星空的故事在门外结束，屋里又只剩熟悉的噪声。',{}, {})]),
 E('lg-gamble-food','以罐头为赌注','一位赌客愿意在门边玩一局纸牌，赢者得到对方押下的罐头。输掉的东西同样是真正的晚饭。',[
  C('拿出纸牌，接受这局','最后一张牌翻开，对方按约把罐头交给了你。',{mood:1},{canned:2},{requiresItem:'cards',chance:0.5,failEffects:{mood:-1},failItems:{canned:-2},failResult:'最后一张牌不属于你，赌客把押下的罐头带走了。'}),
  C('不拿晚饭下注','你们把纸牌收回桌里，让食物继续待在储物架上。',{mood:1})],{requiresItem:'cards',once:false,cooldown:16}),
 E('lg-gamble-water','以饮水为赌注','赌客在门边摆好牌，愿意押上自己的饮水。机会看似公平，但输掉的水不会再回到架上。',[
  C('接受饮水赌局','牌局结束后，对方留下自己的水瓶，愿赌服输。',{mood:1},{water:2},{requiresItem:'cards',chance:0.5,failEffects:{mood:-1},failItems:{water:-2},failResult:'赌客赢下了这一局，你们只能看着饮水被带走。'}),
  C('请他离开','水瓶仍然好好放在架上，今天没有任何人决定拿它冒险。',{mood:1})],{requiresItem:'cards',once:false,cooldown:16})
);
