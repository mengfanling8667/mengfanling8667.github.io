// Mechanics checked against the community trade-event catalogue; all prose is original.
const offer = (give,take,amount=1,cost=1,label) => ({label:label||`交换物资`,result:'双方核对过数量，货物和约定一样。交易完成后，来客收好行李继续赶路。',requiresItem:give,items:{[give]:-cost,[take]:amount}});
const decline = {label:'这次不交易',result:'你们礼貌道别，把物资留给了以后的日子。',decline:true};
const trader = (id,title,text,choices,extra={}) => ({id,title,text,scene:'shelter',trade:true,once:true,minDay:4,sourceGroup:'trade',choices:[...choices,decline],...extra});
export const LEGACY_TRADE_EVENTS = [
 trader('lt-wandering-salesman','旅行推销员','一位背着旧货箱的推销员来到舱门前。他说自己的生意只是从街道搬到了废土，愿意用补给换些便于转手的东西。',[
  offer('cards','canned',1,1,'用扑克牌换罐头'),offer('checkers','water',1,1,'用棋盘换饮水'),offer('mask','canned',2,1,'用防毒面具换食物'),offer('rifle','water',4,1,'用步枪换饮水'),offer('flashlight','water',1,1,'用手电筒换饮水')]),
 trader('lt-scrap-peddler','杂货袋里的生意','一个瘦小的商贩把鼓鼓的布袋放在阶梯上。他急着推销古怪的零食，也愿意按你们拿得出的物品谈谈交换。',[
  offer('water','bug_spray',1,1,'用饮水换杀虫喷剂'),offer('canned','scout_book',1,2,'用食物换生存手册'),offer('cards','canned',1,1,'用扑克牌换罐头'),offer('battery','water',1,1,'用电池换饮水'),offer('soap','canned',1,1,'用肥皂换罐头')]),
 trader('lt-pack-caravan','驮兽商队','门外的驮兽比记忆中的骆驼多了几分古怪。牵着它的女商人翻开货单，表示可以收些你们暂时用不上的装备。',[
  offer('checkers','water',1,1,'用棋盘换饮水'),offer('radio','water',4,1,'用收音机换饮水'),offer('medkit','water',2,1,'用急救箱换饮水'),offer('ammo','water',1,1,'用弹药换饮水'),offer('water','mask',1,2,'用饮水换防毒面具')]),
 trader('lt-guarded-supply','带护卫的补给商','爽朗的商人报出几样货物，沉默的护卫替她看着街角。她把普通补给摆在前面，较难弄到的工具则需要认真讲价。',[
  offer('water','medkit',1,3,'用饮水换急救箱'),offer('canned','tools',1,2,'用食物换维修工具'),offer('parts','fuel',2,1,'用电子零件换燃料'),offer('gun','canned',3,1,'用手枪换食物'),offer('blanket','water',2,1,'用保温毯换饮水')]),
 trader('lt-wheelbarrow','独轮车货摊','锈得吱呀作响的独轮车停在门边。货主更需要能用的旧物，愿意拿水来换；他提醒你们，附近的路已经不太平了。',[
  offer('cards','water',1,1,'用扑克牌换饮水'),offer('bug_spray','water',1,1,'用杀虫喷剂换饮水'),offer('scout_book','water',2,1,'用生存手册换饮水'),offer('flashlight','water',1,1,'用手电筒换饮水'),offer('water','axe',1,3,'用饮水换消防斧')]),
 trader('lt-scout-stall','童子军的小货摊','两个背着货包的孩子在门外报出商品名。她们把饼干生意做到了废土，货单不长，却仔细说明了每件货物的来历。',[
  offer('water','biscuits',2,1,'用饮水换压缩饼干'),offer('canned','bandage',2,1,'用罐头换无菌绷带'),offer('soap','water',1,1,'用肥皂换饮水'),offer('battery','chocolate',2,1,'用电池换巧克力'),offer('book','apple',2,1,'用旧小说换苹果')])
];
