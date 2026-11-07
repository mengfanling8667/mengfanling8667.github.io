// Continuations of the audited cat / agents / laboratory chains. Original prose and balance.
export const LEGACY_ROUTE_EVENTS = [
 {id:'lg-agent-pickup',title:'暗号之后的接应',text:'侦察图与补给都已交付。特工带回了通行文件，说一处保密避难设施终于为你们留出了位置。现在就可以跟随接应车离开。',scene:'shelter',route:true,once:true,minDay:15,requiresFlags:['lg_agentProvisions','lg_agentReconDone'],choices:[
  {label:'带上家人，按暗号前往',result:'最后一次检查舱门之后，你们跟上了等候的接应车。',victory:{title:'秘密避难所',text:'提供的物资和侦察记录通过了核验。接应车驶入远处的地下设施，熟悉的家人终于能在更安全的地方重逢。'}},
  {label:'继续留守，把机会留到以后',result:'你们记下接应地点，仍决定靠自己的物资再坚持一段时间。'}
 ]},
 {id:'lg-scientist-supplies',title:'研究车里的发射计划',text:'研究者完成观察后提出一个疯狂计划：把改造过的飞行器送上天空。实验的记录还不够，他们需要一些食物与饮水，才能开始最后的准备。',scene:'shelter',route:true,once:false,cooldown:12,minDay:15,requiresFlags:['lg_catScientist','lg_labCompleted'],forbidsFlags:['lg_rocketReady'],choices:[
  {label:'提供食物和饮水，协助准备',result:'研究者把补给装入储物箱，承诺准备完成后回来接你们。',items:{canned:-2,water:-2},setFlags:['lg_rocketReady'],followUp:{eventId:'lg-rocket-launch',delay:4,chainId:'lg-rocket',bindPerson:false}},
  {label:'暂时保留补给，不参与计划',result:'研究者表示还可以再等一等。你们把这个计划记进了日记。'}
 ]},
 {id:'lg-rocket-launch',title:'从地面望向星空',text:'远处的改造发射架终于准备就绪。研究车在门口按约定闪灯；登上那台古怪飞行器，或许会结束这段地下生活。',scene:'shelter',scheduledOnly:true,route:true,once:true,requiresFlags:['lg_rocketReady'],choices:[
  {label:'带上家人，接受发射邀请',result:'舱门关闭，熟悉的废土逐渐落在身后。',victory:{title:'驶向星空',text:'研究者兑现了离开废土的约定。飞行器越过灰色天空，家人们在轰鸣里握紧彼此的手。这次冒险终于有了新的开始。'}},
  {label:'不登机，继续守住避难所',result:'你们向研究者道别，带着对这个疯狂时代的新认识回到了屋里。',clearFlags:['lg_rocketReady']}
 ]}
];
