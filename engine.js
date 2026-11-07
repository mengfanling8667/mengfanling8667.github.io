import {ensureAdmissionsState, getOfferForecast, issueOffer, waitlistStudent, rejectApplicant, processOfferResponses, closeAdmissionYear} from './admissions.js?v=2';
import {ensureEventState, createRandomEvent, applyEventChoice, processEventFollowups} from './events.js?v=2';
export {getOfferForecast};
/** 香港校長室 — deterministic, serialisable simulation. All financial rules are game rules. */
export const DISTRICTS = ['中西區','灣仔區','東區','南區','油尖旺區','深水埗區','九龍城區','黃大仙區','觀塘區','葵青區','荃灣區','屯門區','元朗區','北區','大埔區','沙田區','西貢區','離島區'];
export const SUBJECTS = ['中文','英文','數學','科學','人文','資訊科技'];
export const POLICY_META = {
  tuition:{label:'每月學費',min:0,max:12000,step:100,unit:'港元'},
  mealFee:{label:'每日餐費',min:15,max:80,step:1,unit:'港元'},
  homework:{label:'每日功課',min:0,max:4,step:0.5,unit:'小時'},
  tutoring:{label:'每週課後輔導',min:0,max:4,step:1,unit:'節'},
  scholarship:{label:'獎助學金預留比例',min:0,max:30,step:1,unit:'%'},
  teaching:{label:'教學路線',options:[{value:'balanced',label:'均衡教學'},{value:'exam',label:'應試訓練'},{value:'joyful',label:'快樂教育'}]},
  mealQuality:{label:'膳食方案',options:[{value:'budget',label:'經濟套餐'},{value:'balanced',label:'均衡膳食'},{value:'premium',label:'優質膳食'}]}
};
export const MATERIAL_SOURCES = {
  edb:{label:'教育局提供材料',description:'遊戲中的免費基礎資源；支付整理與印製成本。',leadWeeks:1},
  publisher:{label:'出版社教材',description:'成套內容及授權題庫，品質穩定，三週到貨。',leadWeeks:3},
  custom:{label:'私校自編教材',description:'按學生弱項編寫；需要科任教師、試教與十週研發。',leadWeeks:10}
};
export const PRINTING_MODES = {
  inhouse:{label:'校內印刷',description:'使用校內設備，支付紙墨與維護成本。'},
  outsourced:{label:'外判印刷',description:'單價較高，無需佔用校內印刷產能。'},
  digital:{label:'電子教材',description:'減少紙張，成效取決於圖書館及數碼支援。'}
};
export const FACILITY_META = {
  library:{name:'圖書館與數碼資源',description:'改善備課、閱讀與電子教材使用效率。',baseCost:80000,weeks:5,maxLevel:4},
  laboratory:{name:'科學與電腦室',description:'讓科學與資訊科技的實作教學更有效。',baseCost:150000,weeks:7,maxLevel:4},
  counselling:{name:'輔導與學習支援',description:'減少過量課業造成的缺勤及學習疲勞。',baseCost:60000,weeks:4,maxLevel:4},
  printer:{name:'印刷設備',description:'提高校內印刷產能，降低重印成本。',baseCost:45000,weeks:3,maxLevel:4},
  classrooms:{name:'課室與學額',description:'每次擴建增加120個學額；招生仍需逐一決定。',baseCost:220000,weeks:9,maxLevel:4}
};

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const round=(v,n=0)=>Math.round(v*10**n)/10**n;
const mean=(a)=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
const ok=message=>({ok:true,message});
const fail=message=>({ok:false,message});
const money=n=>'$'+Math.round(n).toLocaleString('zh-HK');
const TARGETS={easy:'全區第一',normal:'全港前十',hard:'全港第一'};
const SURNAMES=['陳','李','張','黃','林','何','梁','吳','劉','周','鄭','王','馮','許','曾','葉','蘇','蔡'];
const GIVEN=['思晴','俊熙','曉彤','子朗','樂言','芷欣','柏謙','穎怡','承希','嘉敏','梓軒','朗晴','凱文','心妍','皓然','卓琳','靖瑤','天佑'];

function seedNumber(value){if(typeof value==='number'&&Number.isFinite(value))return (value>>>0)||12345;let n=2166136261;for(const c of String(value??Date.now()))n=Math.imul(n^c.charCodeAt(0),16777619);return(n>>>0)||12345;}
function random(s){let n=(s.rngState+=0x6D2B79F5);n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);s.rngState=s.rngState>>>0;return((n^(n>>>14))>>>0)/4294967296;}
function between(s,a,b){return a+random(s)*(b-a);}
function pick(s,arr){return arr[Math.floor(random(s)*arr.length)];}
function id(s,prefix){return `${prefix}-${++s.idCounter}`;}
function personName(s){return pick(s,SURNAMES)+pick(s,GIVEN);}
function record(s,message,type='info'){s.log.unshift({id:id(s,'log'),week:s.elapsedWeeks,year:Math.min(3,Math.floor(s.elapsedWeeks/48)+1),type,message});if(s.log.length>180)s.log.length=180;}
function canAct(s){return !s.ended;}
function subjectName(value){if(typeof value==='number')return SUBJECTS[value];if(value&&typeof value==='object')return value.name;return SUBJECTS.includes(value)?value:undefined;}
function updateCalendar(s){s.year=Math.min(3,Math.floor(s.elapsedWeeks/48)+1);s.week=s.elapsedWeeks>=144?48:(s.elapsedWeeks%48)+1;s.month=Math.min(36,Math.floor(s.elapsedWeeks/4)+1);s.term=s.week<=24?1:2;s.weeksRemaining=Math.max(0,144-s.elapsedWeeks);}
function refreshFacilities(s){for(const [key,meta] of Object.entries(FACILITY_META)){const f=s.facilities[key];f.maxLevel=meta.maxLevel;f.nextCost=Math.round(meta.baseCost*(1+f.level*.65));f.name=meta.name;f.description=meta.description;}s.capacity=480+(s.facilities.classrooms.level-1)*120;}
function syncScores(s){
  const weight=s.cohorts.reduce((n,c)=>n+c.count,0);
  s.enrollment=weight;
  const cohortScore=weight?s.cohorts.reduce((n,c)=>n+c.score*c.count,0)/weight:mean(s.subjects.map(x=>x.score));
  const subjectScore=mean(s.subjects.map(x=>x.score));
  s.academicScore=round(clamp(cohortScore*.72+subjectScore*.28,0,100),2);
  const senior=s.cohorts.find(c=>c.grade===6);
  s.dseScore=round(clamp((senior?.score??subjectScore)*.83+subjectScore*.17+s.examReadiness,0,100),2);
  s.compositeScore=round(s.academicScore*.6+s.dseScore*.4,2);
  s.score=s.compositeScore;
  s.debt=round(s.loans.reduce((n,l)=>n+l.balance,0));
  s.wellbeing=round(clamp(100-s.studentFatigue*.72,5,100));
  s.fatigue=s.studentFatigue;
  s.teacherFatigue=round(mean(s.teachers.map(t=>t.fatigue)));
}

export function createGame(options={}){
  const seed=seedNumber(options.seed);
  const s={version:1,seed,rngState:seed,idCounter:0,name:String(options.name||'啟晴書院').slice(0,40),district:DISTRICTS.includes(options.district)?options.district:DISTRICTS[0],type:options.type==='dss'?'dss':'private',difficulty:['easy','normal','hard'].includes(options.difficulty)?options.difficulty:'normal',elapsedWeeks:0,cash:1600000,debt:0,policies:{tuition:options.type==='dss'?1600:2800,mealFee:32,mealQuality:'balanced',homework:1.5,teaching:'balanced',tutoring:1,scholarship:5},teachers:[],applicants:[],admissionHistory:[],materials:[],subjects:[],cohorts:[],loans:[],projects:[],history:[],log:[],currentEvent:null,pendingReport:null,ended:false,result:null,studentFatigue:25,teacherFatigue:15,wellbeing:82,examReadiness:0,reputation:52,actionPoints:6,principalTime:6,eventsResolved:0,interviewCount:0,withdrawalCarry:0,enrollment:384,capacity:480,lastMonthlyFinance:null,modifiers:[],recruitmentPool:[],facilities:{},opponents:[]};
  if(s.type==='dss')s.policies.scholarship=10;
  s.school={name:s.name,district:s.district,type:s.type};
  for(const [key,meta]of Object.entries(FACILITY_META))s.facilities[key]={level:key==='counselling'?0:1,maxLevel:meta.maxLevel,nextCost:0,name:meta.name,description:meta.description};
  refreshFacilities(s);
  for(let i=0;i<SUBJECTS.length;i++){
    const initial=between(s,52,61);
    s.subjects.push({name:SUBJECTS[i],id:SUBJECTS[i],score:round(initial,2),mastery:round(initial,2),level:round(initial,2),trend:0});
    for(let j=0;j<3;j++)s.teachers.push({id:id(s,'teacher'),name:personName(s),subject:SUBJECTS[i],skill:round(between(s,61,76)),salary:Math.round(between(s,27000,34500)/500)*500,fatigue:round(between(s,12,22)),morale:75,trainingUntil:0,busyUntil:0,workload:24,experience:round(between(s,3,16)),trainingGain:0});
  }
  for(let grade=1;grade<=6;grade++)s.cohorts.push({grade,count:64,ability:round(between(s,53,66),1),score:round(between(s,53,60),2),entryAbility:58});
  const first=['明德','博文','啟智','弘志','育才','培正','崇文','尚善'];
  const last=['書院','中學','學院','中學','書院','中學','書院','學院'];
  DISTRICTS.forEach((district,d)=>{for(let j=0;j<8;j++){
    const tier=j/7;
    s.opponents.push({id:`school-${d}-${j}`,name:`${district.replace('區','')}${first[(j+d)%8]}${last[j]}`,district,base:48+tier*38+between(s,-2,2),ambition:between(s,.5,2.1),phase:between(s,0,Math.PI*2),score:0});
  }});
  for(let i=0;i<24;i++)s.applicants.push(makeApplicant(s));
  refreshHiring(s);updateCalendar(s);syncScores(s);ensureAdmissionsState(s);ensureEventState(s);s.rulesVersion=2;
  record(s,`你接掌了${s.district}的${s.name}。第三學年結束時，以純成績爭取${TARGETS[s.difficulty]}。`,'milestone');
  record(s,'排名＝全校統一評核60%＋中六畢業成績40%；幸福與財務不直接計分。','info');
  record(s,'開局中四學生將在第三年升讀中六；培養成績需要時間。','info');
  return s;
}

function makeApplicant(s){
  const ability=clamp(between(s,35,88)+(s.reputation-50)*.18+s.policies.scholarship*.14,25,96);
  const grade=random(s)<.69?1:(random(s)<.7?4:5);
  return {id:id(s,'student'),name:personName(s),grade,ability:round(ability),potential:round(clamp(ability+between(s,4,19),40,99)),attitude:round(between(s,45,95)),wellbeing:round(between(s,50,95)),needs:pick(s,['閱讀支援','適應新環境','數學補底','英語表達','發展理科興趣','需要伸展課程']),background:pick(s,['積極參與校內活動','喜歡獨立閱讀','家長重視學業進度','正在尋找合適的教學環境','有清晰的升學目標']),interviewed:false,interviewMode:null,interviewScore:null,teacherScore:null,status:'pending',appliedWeek:s.elapsedWeeks,year:Math.min(3,Math.floor(s.elapsedWeeks/48)+1),confidence:round(between(s,45,90)),profileScore:round(clamp(ability+between(s,-10,10),20,99)),maxTuition:Math.round(between(s,2800,10500)/100)*100};
}

function refreshHiring(s){
  s.recruitmentPool=Array.from({length:8},(_,i)=>{const skill=round(between(s,62,92));return{id:id(s,'candidate'),name:personName(s),subject:SUBJECTS[i%6],skill,salary:Math.round((23000+(skill-55)*780+between(s,-1000,1800))/500)*500,fatigue:8,morale:78,trainingUntil:0,busyUntil:0,workload:0,experience:Math.max(2,round((skill-45)/3)),trainingGain:0};});
}
export function getHiringPool(s){return s.recruitmentPool??[];}

export function getRankings(s){
  const time=s.elapsedWeeks/48;
  const overall=s.opponents.map(o=>({id:o.id,name:o.name,district:o.district,score:round(clamp(o.base+o.ambition*time+Math.sin(time*2+o.phase)*.72,20,97),2),isPlayer:false}));
  overall.push({id:'player',name:s.name,district:s.district,score:round(s.compositeScore,2),isPlayer:true});
  overall.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  let last=-1,lastRank=0;
  overall.forEach((x,i)=>{x.rank=x.score===last?lastRank:i+1;last=x.score;lastRank=x.rank;});
  const district=overall.filter(x=>x.district===s.district).map(x=>({...x,overallRank:x.rank}));
  last=-1;lastRank=0;
  district.forEach((x,i)=>{x.rank=x.score===last?lastRank:i+1;last=x.score;lastRank=x.rank;});
  const p=overall.find(x=>x.isPlayer),pd=district.find(x=>x.isPlayer);
  return {overall,district,playerRank:p.rank,rank:p.rank,districtRank:pd.rank,total:overall.length,districtTotal:district.length,score:s.compositeScore,target:TARGETS[s.difficulty]};
}

export function getFinance(s){
  const count=s.enrollment;
  const scholarships=count*s.policies.scholarship/100;
  const tuitionIncome=Math.round(s.policies.tuition*count*(1-s.policies.scholarship/100));
  const grantIncome=s.type==='dss'?count*1250:0;
  const mealParticipation=clamp(.84-Math.max(0,s.policies.mealFee-36)*.009,.35,.9);
  const meals=count*20*mealParticipation;
  const mealUnit={budget:20,balanced:25,premium:32}[s.policies.mealQuality]??25;
  const mealIncome=Math.round(meals*s.policies.mealFee);
  const mealCost=Math.round(meals*mealUnit);
  const salaryCost=s.teachers.reduce((n,t)=>n+t.salary,0);
  const rentCost=145000+(s.facilities.classrooms.level-1)*18000;
  const operatingCost=Math.round(35000+count*270+Object.values(s.facilities).reduce((n,f)=>n+f.level*1800,0));
  const tutoringCost=Math.round(count*s.policies.tutoring*35);
  const loanPayment=Math.round(s.loans.reduce((n,l)=>n+Math.min(l.payment,l.balance+l.balance*l.monthlyRate),0));
  const effectiveTuition=s.policies.tuition*(1-s.policies.scholarship/100);
  const affordableBaseline=s.type==='dss'?2600:3800;
  const tuitionPressure=clamp((effectiveTuition-affordableBaseline)/8000,0,1);
  const expectedWithdrawals=round(count*tuitionPressure*.035,1);
  const demand=clamp(1-tuitionPressure*.9+(s.reputation-60)/160,.12,1.25);
  const monthlyIncome=tuitionIncome+grantIncome+mealIncome;
  const monthlyExpense=salaryCost+rentCost+operatingCost+mealCost+tutoringCost+loanPayment;
  const monthlyNet=monthlyIncome-monthlyExpense;
  const debtLimit=Math.max(300000,Math.round((tuitionIncome+grantIncome)*2.2));
  return{monthlyIncome,monthlyExpense,monthlyNet,income:monthlyIncome,expense:monthlyExpense,net:monthlyNet,tuitionIncome,grantIncome,mealIncome,mealCost,salaryCost,rentCost,operatingCost,tutoringCost,loanPayment,scholarships:round(scholarships),mealParticipation:round(mealParticipation*100),tuitionPressure:round(tuitionPressure*100),expectedWithdrawals,demand,debtLimit,borrowingAvailable:Math.max(0,debtLimit-s.debt),runway:monthlyNet<0?Math.max(0,round(s.cash/-monthlyNet,1)):null,cash:s.cash,debt:s.debt,loans:s.loans,breakdown:[{label:'學費',amount:tuitionIncome},{label:'辦學撥款',amount:grantIncome},{label:'餐費收入',amount:mealIncome},{label:'教師薪酬',amount:-salaryCost},{label:'校舍租用',amount:-rentCost},{label:'日常營運',amount:-operatingCost},{label:'膳食採購',amount:-mealCost},{label:'課後輔導',amount:-tutoringCost},{label:'貸款月供',amount:-loanPayment}]};
}

export function setPolicy(s,key,value){
  if(!canAct(s))return fail('本局已結束，請開展新的三年任期。');
  const meta=POLICY_META[key];if(!meta)return fail('找不到這項政策。');
  if(meta.options){if(!meta.options.some(x=>x.value===value))return fail('請選擇有效的政策方案。');}
  else{value=Number(value);if(!Number.isFinite(value))return fail('請輸入有效數值。');const minimum=key==='scholarship'&&s.type==='dss'?10:meta.min;value=clamp(value,minimum,meta.max);value=Math.round(value/(meta.step||1))*(meta.step||1);}
  if(s.policies[key]===value)return ok('政策維持不變。');
  s.policies[key]=value;
  const display=meta.options?meta.options.find(x=>x.value===value).label:`${value}${meta.unit||''}`;
  record(s,`${meta.label}調整為${display}；教學與招生效果將逐週反映。`,'policy');
  return ok(`${meta.label}已更新。`);
}

export function hireTeacher(s,candidateId){
  if(!canAct(s))return fail('任期已結束。');
  const index=s.recruitmentPool.findIndex(t=>t.id===candidateId);if(index<0)return fail('這位應徵者已不在招聘名單。');
  if(s.teachers.length>=36)return fail('現有行政編制最多容納36位教師。');
  const candidate=s.recruitmentPool[index],cost=Math.round(candidate.salary*.5);
  if(s.cash<cost)return fail(`招聘與入職成本需要${money(cost)}。`);
  s.cash-=cost;s.teachers.push({...candidate,id:id(s,'teacher')});s.recruitmentPool.splice(index,1);
  record(s,`聘任${candidate.name}老師教授${candidate.subject}，月薪${money(candidate.salary)}。`,'staff');
  return ok(`${candidate.name}老師已加入，將分擔教學工作。`);
}
export function releaseTeacher(s,teacherId){
  if(!canAct(s))return fail('任期已結束。');
  const i=s.teachers.findIndex(t=>t.id===teacherId);if(i<0)return fail('找不到這位教師。');
  const teacher=s.teachers[i];
  if(s.teachers.filter(t=>t.subject===teacher.subject).length<=1)return fail('每科至少需要保留一位教師。');
  const cost=teacher.salary;if(s.cash<cost)return fail(`離職安排需要${money(cost)}。`);
  s.cash-=cost;s.teachers.splice(i,1);record(s,`${teacher.name}老師完成離職安排，同科教師將接手課務。`,'staff');
  return ok('離職安排已完成；請留意同科工作量。');
}
export function trainTeacher(s,teacherId){
  if(!canAct(s))return fail('任期已結束。');
  const teacher=s.teachers.find(t=>t.id===teacherId);if(!teacher)return fail('找不到這位教師。');
  if(teacher.trainingUntil>s.elapsedWeeks||teacher.busyUntil>s.elapsedWeeks)return fail('這位教師正在進修或編寫教材。');
  if(teacher.skill>=98)return fail('這位教師已達到目前培訓可提升的水平。');
  const cost=18000;if(s.cash<cost)return fail('這次培訓需要$18,000。');
  s.cash-=cost;teacher.trainingUntil=s.elapsedWeeks+4;teacher.trainingGain=4.5;teacher.fatigue=clamp(teacher.fatigue+5,0,100);
  record(s,`${teacher.name}老師開始四週專業進修；期間部分課務由同科教師承接。`,'staff');
  return ok('培訓已安排，四週後完成。');
}

export function interviewStudent(s,studentId,mode,score){
  if(!canAct(s))return fail('任期已結束。');
  const student=s.applicants.find(x=>x.id===studentId);if(!student||student.status!=='pending')return fail('這位學生不在待審名單。');
  if(student.interviewed)return fail('已完成面試，請作出錄取決定。');
  if(mode!=='self'&&mode!=='teacher')return fail('請選擇親自面試或教師面試。');
  const time=mode==='self'?2:.5;if(s.actionPoints<time)return fail('本週校長時間不足，推進一週即可恢復。');
  if(mode==='self'){
    const mark=Number(score);if(score===undefined||!Number.isFinite(mark)||mark<0||mark>100)return fail('親自面試時，請給予0至100分。');
    student.interviewScore=round(mark);student.teacherScore=null;student.interviewNotes='校長親自評分；是否錄取由你決定。';
  }else{
    const available=s.teachers.filter(t=>t.trainingUntil<=s.elapsedWeeks&&t.busyUntil<=s.elapsedWeeks).sort((a,b)=>a.fatigue-b.fatigue);
    const teacher=available[0];if(!teacher)return fail('教師目前都在進修或研發教材，請稍後再安排。');
    const noise=between(s,-13,13)*(1-teacher.skill/140);
    const mark=round(clamp(student.ability*.62+student.attitude*.23+student.confidence*.15+noise,0,100));
    student.interviewScore=mark;student.teacherScore=mark;student.interviewer=teacher.name;
    student.interviewNotes=`${teacher.name}老師評估：${student.ability<55?'需要基礎支援':'基礎表現'+(student.ability>75?'突出':'穩定')}，${student.attitude>73?'學習態度積極':'需要建立學習習慣'}。評分僅供參考。`;
    teacher.fatigue=clamp(teacher.fatigue+2.5,0,100);
  }
  s.actionPoints=round(s.actionPoints-time,1);s.principalTime=s.actionPoints;s.interviewCount++;student.interviewed=true;student.interviewMode=mode;student.interviewWeek=s.elapsedWeeks;
  record(s,`${student.name}完成${mode==='self'?'校長':'教師'}面試，評分${student.interviewScore}；等待你的錄取決定。`,'admissions');
  return ok(`面試評分${student.interviewScore}，請決定是否錄取。`);
}
export function getAdmissionSummary(s){
  const reserved=s.applicants.filter(a=>a.status==='offered').length;
  return {reserved,vacancies:Math.max(0,s.capacity-s.enrollment-reserved),waitlisted:s.applicants.filter(a=>a.status==='waitlisted').length,enrolled:s.applicants.filter(a=>a.status==='accepted').length,pending:s.applicants.filter(a=>a.status==='pending').length};
}
export function decideStudent(s,studentId,decision){
  let result;
  if(['accept','accepted','offer'].includes(decision))result=issueOffer(s,studentId);
  else if(['waitlist','waitlisted'].includes(decision))result=waitlistStudent(s,studentId);
  else if(['reject','rejected'].includes(decision))result=rejectApplicant(s,studentId);
  else return fail('請選擇發出offer、加入預備名單或不錄取。');
  if(result.ok)syncScores(s);
  return result;
}

export function orderMaterial(s,options={}){
  if(!canAct(s))return fail('任期已結束。');
  const subject=subjectName(options.subject),source=options.source,printing=options.printing??'inhouse';
  if(!subject)return fail('請選擇科目。');if(!MATERIAL_SOURCES[source])return fail('請選擇有效的教材來源。');if(!PRINTING_MODES[printing])return fail('請選擇有效的印製方式。');
  if(source==='custom'&&s.type!=='private')return fail('依本遊戲設定，只有私立學校可以自編教材。');
  if(s.materials.some(m=>m.subject===subject&&m.status==='developing'))return fail('這科已有教材在製作中，請等待完成。');
  const author=s.teachers.filter(t=>t.subject===subject&&t.busyUntil<=s.elapsedWeeks&&t.trainingUntil<=s.elapsedWeeks).sort((a,b)=>b.skill-a.skill)[0];
  if(source==='custom'&&!author)return fail('需要一位未在進修或研發的科任教師。');
  const pages={edb:48,publisher:110,custom:96}[source];
  const contentCost=source==='edb'?2000:source==='publisher'?28000+s.enrollment*40:65000;
  const printCost=printing==='digital'?3500:Math.round(pages*s.enrollment*(printing==='outsourced'?.38:.24/(1+s.facilities.printer.level*.12)));
  const cost=Math.round(contentCost+printCost);
  if(s.cash<cost)return fail(`這份教材需要${money(cost)}，請調整預算。`);
  let duration=MATERIAL_SOURCES[source].leadWeeks+(printing==='outsourced'?1:0);
  if(printing==='inhouse'&&s.enrollment>600&&s.facilities.printer.level<2)duration++;
  const quality=source==='edb'?.48:source==='publisher'?.76:clamp(.7+(author.skill-50)/100,.72,1.2);
  const material={id:id(s,'material'),subject,source,printing,name:`${subject}・${MATERIAL_SOURCES[source].label}`,status:'developing',orderedWeek:s.elapsedWeeks,readyWeek:s.elapsedWeeks+duration,leadWeeks:duration,quality:round(quality,2),cost,contentCost:round(contentCost),printCost,pages,author:source==='custom'?author.name:null,authorId:source==='custom'?author.id:null};
  s.cash-=cost;s.materials.push(material);if(source==='custom')author.busyUntil=material.readyWeek;
  record(s,`${subject}訂製${MATERIAL_SOURCES[source].label}，支出${money(cost)}，預計${duration}週後投入教學。`,'materials');
  return ok(`教材已安排，預計${duration}週後完成。`);
}

export function borrow(s,amount,term=24){
  if(!canAct(s))return fail('任期已結束。');amount=Number(amount);term=Number(term);
  if(!Number.isFinite(amount)||amount<10000)return fail('每筆貸款最少$10,000。');
  if(!Number.isFinite(term)||term<3||term>36)return fail('還款期為3至36個月。');
  amount=Math.round(amount);term=Math.round(term);const f=getFinance(s);
  if(amount>f.borrowingAvailable)return fail(`目前可借額度為${money(f.borrowingAvailable)}，按現有學費及撥款計算。`);
  const monthlyRate=.005;const payment=amount*monthlyRate/(1-(1+monthlyRate)**-term);
  const loan={id:id(s,'loan'),principal:amount,balance:amount,term,monthsRemaining:term,monthlyRate,annualRate:.06,payment:round(payment,2),takenWeek:s.elapsedWeeks,totalPaid:0};
  s.loans.push(loan);s.cash+=amount;syncScores(s);record(s,`獲批${money(amount)}貸款，${term}個月攤還，每月約${money(payment)}；遊戲年息6%。`,'finance');
  return ok(`已收到${money(amount)}；下次月結開始還款。`);
}
export function repay(s,amount){
  if(!canAct(s))return fail('任期已結束。');amount=Number(amount);
  if(!Number.isFinite(amount)||amount<=0)return fail('請輸入有效還款金額。');if(s.debt<=0)return fail('目前沒有未償還貸款。');
  amount=Math.min(Math.round(amount),s.debt);if(s.cash<amount)return fail('現金不足以作出這筆提前還款。');
  let left=amount;for(const loan of s.loans){const paid=Math.min(left,loan.balance);loan.balance-=paid;left-=paid;loan.totalPaid+=paid;if(loan.balance>0)loan.payment=round(loan.balance*loan.monthlyRate/(1-(1+loan.monthlyRate)**-Math.max(1,loan.monthsRemaining)),2);if(left<=0)break;}
  s.cash-=amount;s.loans=s.loans.filter(l=>l.balance>.5);syncScores(s);record(s,`提前償還本金${money(amount)}；未來月供同步調整。`,'finance');return ok('已完成提前還款。');
}
export function improveFacility(s,key){
  if(!canAct(s))return fail('任期已結束。');const meta=FACILITY_META[key],facility=s.facilities[key];if(!meta||!facility)return fail('找不到這項設施。');
  if(facility.level>=meta.maxLevel)return fail('這項設施已達最高等級。');if(s.projects.some(p=>p.key===key))return fail('這項設施正在改善中。');
  const cost=facility.nextCost;if(s.cash<cost)return fail(`改善工程需要${money(cost)}。`);
  s.cash-=cost;s.projects.push({id:id(s,'project'),key,name:meta.name,level:facility.level+1,cost,startWeek:s.elapsedWeeks,readyWeek:s.elapsedWeeks+meta.weeks});record(s,`${meta.name}改善工程開始，需時${meta.weeks}週，支出${money(cost)}。`,'facilities');return ok('工程已安排；完成後才會投入使用。');
}

export function resolveEvent(s,choiceId){
  const result=applyEventChoice(s,choiceId);
  if(result.ok)syncScores(s);
  return result;
}

function materialQuality(s,subject){
  let best=.18;
  for(const m of s.materials){if(m.subject!==subject||m.status!=='ready')continue;const age=s.elapsedWeeks-m.readyWeek;const relevance=age>96?.6:age>48?.82:1;const format=m.printing==='digital'?Math.min(1,.78+s.facilities.library.level*.055):1;best=Math.max(best,m.quality*relevance*format);}
  return best;
}
function teachWeek(s){
  const p=s.policies;
  const perTeacher=(Math.max(1,s.enrollment)/30)*(28+p.tutoring*1.6+p.homework*.6)/Math.max(1,s.teachers.length)+3;
  for(const t of s.teachers){
    if(t.trainingUntil&&t.trainingUntil<=s.elapsedWeeks){t.skill=clamp(t.skill+t.trainingGain,0,99);t.trainingUntil=0;t.trainingGain=0;record(s,`${t.name}老師完成進修，教學能力提升。`,'staff');}
    const unavailable=(t.trainingUntil>s.elapsedWeeks?.35:0)+(t.busyUntil>s.elapsedWeeks?.3:0);
    t.workload=round(perTeacher+unavailable*12,1);
    const target=clamp(10+Math.max(0,t.workload-25)*5+(p.teaching==='exam'?5:0),8,94);
    t.fatigue=clamp(t.fatigue+(target-t.fatigue)*.13,0,100);t.morale=clamp(90-t.fatigue*.32,20,95);
    if(t.fatigue<55)t.skill=clamp(t.skill+.016,0,99);
  }
  const studentTarget=clamp(14+p.homework*7+p.tutoring*6+(p.teaching==='exam'?12:p.teaching==='joyful'?-10:0)-s.facilities.counselling.level*4+(p.mealQuality==='budget'?3:p.mealQuality==='premium'?-3:0),8,96);
  s.studentFatigue=clamp(s.studentFatigue+(studentTarget-s.studentFatigue)*.095,0,100);
  const attendance=clamp(1-Math.max(0,s.studentFatigue-40)*.008,.5,1);
  const learningTime=1+.09*Math.min(p.tutoring,2)+.035*Math.max(0,p.tutoring-2)+.09*Math.min(p.homework,2)-.025*Math.max(0,p.homework-2);
  const modifiers=1+s.modifiers.filter(m=>m.until>s.elapsedWeeks).reduce((n,m)=>n+m.learning,0);
  s.modifiers=s.modifiers.filter(m=>m.until>s.elapsedWeeks);
  const financialFriction=s.cash<0?clamp(1-Math.abs(s.cash)/6000000,.6,1):1;
  let skills=[],resources=[];
  for(const subject of s.subjects){
    const teachers=s.teachers.filter(t=>t.subject===subject.name);
    const skill=mean(teachers.map(t=>t.skill*(1-Math.max(0,t.fatigue-38)*.006)*(t.trainingUntil>s.elapsedWeeks?.7:t.busyUntil>s.elapsedWeeks?.75:1)))||25;
    const resource=materialQuality(s,subject.name);const last=subject.score;
    const facility=.025*s.facilities.library.level+(['科學','資訊科技'].includes(subject.name)?.035*s.facilities.laboratory.level:0);
    const potential=clamp(43+skill*.43+mean(s.cohorts.filter(c=>c.count>0).map(c=>c.ability))*.29+resource*6+facility*12,55,99);
    const pedagogy=p.teaching==='exam'?(subject.score>=60?1.12:.94):p.teaching==='joyful'?(subject.score<68?1.08:.99):1.04;
    const quality=(.62+skill/100*.62+resource*.16+facility)*attendance*learningTime*modifiers*financialFriction;
    const delta=(potential-subject.score)*.0083*quality*pedagogy+.018;
    subject.score=round(clamp(subject.score+delta,0,99.5),3);subject.mastery=subject.score;subject.level=subject.score;subject.trend=round(subject.score-last,3);skills.push(skill);resources.push(resource);
  }
  const skill=mean(skills),resource=mean(resources),subjectAverage=mean(s.subjects.map(x=>x.score));
  for(const cohort of s.cohorts){
    if(!cohort.count)continue;
    const potential=clamp(43+skill*.43+cohort.ability*.29+resource*6+s.facilities.library.level*.35,55,99);
    const teaching=p.teaching==='exam'?(cohort.score>60?1.12:.94):p.teaching==='joyful'?(cohort.score<68?1.08:1):1.04;
    const quality=(.64+skill/100*.64+resource*.18+s.facilities.library.level*.025)*attendance*learningTime*modifiers*financialFriction;
    cohort.score=round(clamp(cohort.score+(potential-cohort.score)*.0087*quality*teaching+(subjectAverage-cohort.score)*.001,0,99.5),3);
  }
  const readinessTarget=p.teaching==='exam'?1.4:p.teaching==='joyful'?-.15:.45;
  s.examReadiness+=(readinessTarget-s.examReadiness)*.04;
  s.reputation=clamp(s.reputation+(s.compositeScore-s.reputation)*.025,20,99);
}

function finishProjects(s){
  for(const material of s.materials){if(material.status==='developing'&&material.readyWeek<=s.elapsedWeeks){material.status='ready';record(s,`${material.name}完成並投入教學；成效將隨課堂使用逐步反映。`,'materials');}}
  const complete=s.projects.filter(p=>p.readyWeek<=s.elapsedWeeks);for(const p of complete){s.facilities[p.key].level=p.level;record(s,`${p.name}改善工程完成，現為第${p.level}級。`,'facilities');}s.projects=s.projects.filter(p=>p.readyWeek>s.elapsedWeeks);if(complete.length)refreshFacilities(s);
}
function monthlySettlement(s){
  const f=getFinance(s);
  s.cash+=f.monthlyNet;
  let interestPaid=0;
  for(const loan of s.loans){const interest=loan.balance*loan.monthlyRate;const payment=Math.min(loan.payment,loan.balance+interest);loan.balance=Math.max(0,loan.balance+interest-payment);loan.totalPaid+=payment;loan.monthsRemaining=Math.max(0,loan.monthsRemaining-1);interestPaid+=interest;}
  s.loans=s.loans.filter(l=>l.balance>.5);syncScores(s);
  s.lastMonthlyFinance={...f,month:Math.floor(s.elapsedWeeks/4),week:s.elapsedWeeks,interestPaid:round(interestPaid),cash:s.cash,debt:s.debt};
  const eventCash=s.eventFinancePending||{income:0,expense:0};
  const actualIncome=f.monthlyIncome+eventCash.income,actualExpense=f.monthlyExpense+eventCash.expense;
  s.eventFinancePending={income:0,expense:0};
  const rank=getRankings(s),last=s.history.at(-1);
  const entry={week:s.elapsedWeeks,month:Math.floor(s.elapsedWeeks/4),year:Math.ceil(s.elapsedWeeks/48),cash:round(s.cash),debt:s.debt,score:s.compositeScore,academic:s.academicScore,dse:s.dseScore,rank:rank.playerRank,districtRank:rank.districtRank,income:actualIncome,expense:actualExpense,net:actualIncome-actualExpense,eventIncome:eventCash.income,eventExpense:eventCash.expense,enrollment:s.enrollment,wellbeing:s.wellbeing,teacherFatigue:s.teacherFatigue};
  s.history.push(entry);
  s.pendingReport={year:entry.year,month:entry.month,title:`第${entry.month}個月營運報告`,summary:`成績${s.compositeScore.toFixed(2)}，全區第${rank.districtRank}、全港第${rank.playerRank}；本月${entry.net>=0?'盈餘':'赤字'}${money(Math.abs(entry.net))}（含事件收支）。`,income:entry.income,expense:entry.expense,net:entry.net,eventIncome:eventCash.income,eventExpense:eventCash.expense,score:s.compositeScore,change:round(s.compositeScore-(last?.score??s.compositeScore),2),rank:rank.playerRank,districtRank:rank.districtRank};
  record(s,`第${entry.month}個月結算：${entry.net>=0?'盈餘':'赤字'}${money(Math.abs(entry.net))}；成績${s.compositeScore.toFixed(2)}。`,'report');
  if(s.cash<0)record(s,'現金已出現缺口；欠款令供應與教學安排受阻。可以調整收支或使用剩餘授信。負債不直接扣排名。','warning');
  // Fee-driven departures are proportionate across cohorts, never a tool to remove weak scorers.
  s.withdrawalCarry=(s.withdrawalCarry||0)+f.expectedWithdrawals;
  let withdrawals=Math.floor(s.withdrawalCarry);s.withdrawalCarry-=withdrawals;
  if(withdrawals>0){const total=s.enrollment;let removed=0;for(const cohort of s.cohorts){const take=Math.min(cohort.count,Math.floor(withdrawals*cohort.count/Math.max(1,total)));cohort.count-=take;removed+=take;}let left=withdrawals-removed;for(const cohort of s.cohorts){if(left<=0)break;if(cohort.count>0){cohort.count--;left--;}}record(s,`本月${withdrawals-left}名學生因學費負擔選擇轉校；降低學費或擴大獎學金可改善留生。`,'admissions');syncScores(s);}
  refreshHiring(s);
  // A changing pool provides enough individually reviewed applications for each annual intake.
  const pending=s.applicants.filter(a=>a.status==='pending');
  const expired=pending.filter(a=>s.elapsedWeeks-a.appliedWeek>16&&!a.interviewed);
  for(const a of expired)a.status='withdrawn';
  const available=s.applicants.filter(a=>['pending','waitlisted','offered'].includes(a.status)).length;
  const additions=Math.min(Math.max(1,Math.round(10*f.demand)),Math.max(0,26-available));
  for(let i=0;i<additions;i++)s.applicants.push(makeApplicant(s));
  // Preserve admissions decisions in admissionHistory, keep the current dashboard bounded.
  s.applicants=s.applicants.filter(a=>['pending','waitlisted','offered'].includes(a.status)||s.elapsedWeeks-(a.decisionWeek??a.appliedWeek)<48);
}
function graduateYear(s){
  const outgoing=s.cohorts.find(c=>c.grade===6);record(s,`本學年${outgoing.count}名中六學生完成畢業評核，畢業成績換算${s.dseScore.toFixed(2)}。`,'milestone');
  s.graduationHistory??=[];s.graduationHistory.push({year:s.elapsedWeeks/48,count:outgoing.count,score:s.dseScore});
  if(s.elapsedWeeks>=144)return;
  closeAdmissionYear(s);
  const next=[];for(let grade=6;grade>=2;grade--){const old=s.cohorts.find(c=>c.grade===grade-1);next.push({...old,grade});}next.push({grade:1,count:0,ability:58,entryAbility:58,score:mean(s.subjects.map(x=>x.score))*.76});s.cohorts=next.sort((a,b)=>a.grade-b.grade);
  for(let i=0;i<24;i++)s.applicants.push(makeApplicant(s));
  record(s,'新學年開始：學生升級，中一學額由你逐一面試及錄取；已錄取紀錄會保留。','milestone');syncScores(s);
}
function finishGame(s){
  const r=getRankings(s),won=s.difficulty==='easy'?r.districtRank===1:s.difficulty==='normal'?r.playerRank<=10:r.playerRank===1;
  s.ended=true;s.result={won,success:won,title:won?'三年辦學目標達成':'三年任期完成',message:`${s.name}以${s.compositeScore.toFixed(2)}分完成第三學年，全區第${r.districtRank}、全港第${r.playerRank}。${won?'你成功達成'+TARGETS[s.difficulty]+'的目標。':'距離'+TARGETS[s.difficulty]+'仍有差距，可以換一套策略再挑戰。'}`,score:s.compositeScore,rank:r.playerRank,playerRank:r.playerRank,districtRank:r.districtRank,target:TARGETS[s.difficulty],difficulty:s.difficulty,weeks:s.elapsedWeeks};
  record(s,s.result.message,'milestone');
}
export function advanceWeek(s){
  if(!canAct(s))return fail('三年任期已結束。');
  ensureAdmissionsState(s);ensureEventState(s);
  if(s.currentEvent){
    const event=s.currentEvent;
    const fallback=event.choices.find(c=>c.id===event.defaultChoiceId)||event.choices.find(c=>c.cost===0)||event.choices.at(-1);
    const automatic=resolveEvent(s,fallback.id);
    if(!automatic.ok)return automatic;
    record(s,`${event.title}：本週未另作決定，副校長按「${fallback.label}」處理。`,'event');
  }
  s.elapsedWeeks++;updateCalendar(s);processEventFollowups(s);finishProjects(s);teachWeek(s);syncScores(s);
  processOfferResponses(s);syncScores(s);
  s.actionPoints=6;s.principalTime=6;
  if(s.elapsedWeeks%4===0)monthlySettlement(s);
  if(s.elapsedWeeks%48===0)graduateYear(s);
  if(s.elapsedWeeks>=144)finishGame(s);
  else if(s.elapsedWeeks>=4&&s.elapsedWeeks%6===4)s.currentEvent=createRandomEvent(s);
  return ok(s.ended?s.result.title:`已推進至第${s.year}年第${s.week}週。`);
}

export function saveGame(s){return JSON.stringify(s);}
export function loadGame(serialized){
  const invalid=()=>{throw new Error('存檔格式不正確，請選擇由校長誌匯出的完整存檔。');};
  let s;try{s=typeof serialized==='string'?JSON.parse(serialized):JSON.parse(JSON.stringify(serialized));}catch{invalid();}
  const finite=value=>typeof value==='number'&&Number.isFinite(value);
  const inRange=(value,min,max)=>finite(value)&&value>=min&&value<=max;
  if(!s||typeof s!=='object'||s.version!==1||!DISTRICTS.includes(s.district)||!['private','dss'].includes(s.type)||!['easy','normal','hard'].includes(s.difficulty)||typeof s.name!=='string'||!s.name||!Number.isInteger(s.elapsedWeeks)||!inRange(s.elapsedWeeks,0,144))invalid();
  for(const key of ['cash','debt','rngState','seed','idCounter','compositeScore','academicScore','dseScore','studentFatigue','examReadiness','reputation','enrollment','capacity','actionPoints'])if(!finite(s[key]))invalid();
  for(const key of ['teachers','applicants','admissionHistory','subjects','cohorts','loans','projects','materials','history','log','modifiers','recruitmentPool','opponents'])if(!Array.isArray(s[key]))invalid();
  if(!s.policies||!s.facilities||typeof s.ended!=='boolean')invalid();
  for(const [key,meta]of Object.entries(POLICY_META)){const value=s.policies[key];if(meta.options?!meta.options.some(o=>o.value===value):!inRange(value,meta.min,meta.max))invalid();}
  for(const [key,meta]of Object.entries(FACILITY_META)){const f=s.facilities[key];if(!f||!Number.isInteger(f.level)||!inRange(f.level,0,meta.maxLevel)||!finite(f.nextCost))invalid();}
  if(s.subjects.length!==6||!SUBJECTS.every(name=>s.subjects.some(x=>x.name===name&&inRange(x.score,0,100))))invalid();
  if(s.cohorts.length!==6||![1,2,3,4,5,6].every(grade=>s.cohorts.some(c=>c.grade===grade&&Number.isInteger(c.count)&&c.count>=0&&inRange(c.ability,0,100)&&inRange(c.score,0,100))))invalid();
  if(!s.teachers.length||!s.teachers.every(t=>typeof t.id==='string'&&typeof t.name==='string'&&SUBJECTS.includes(t.subject)&&['skill','salary','fatigue','morale','trainingUntil','busyUntil'].every(key=>finite(t[key]))))invalid();
  if(!s.recruitmentPool.every(t=>typeof t.id==='string'&&typeof t.name==='string'&&SUBJECTS.includes(t.subject)&&finite(t.skill)&&finite(t.salary)))invalid();
  if(!s.opponents.length||!s.opponents.every(o=>typeof o.id==='string'&&typeof o.name==='string'&&DISTRICTS.includes(o.district)&&['base','ambition','phase'].every(key=>finite(o[key]))))invalid();
  if(!s.applicants.every(a=>typeof a.id==='string'&&typeof a.name==='string'&&inRange(a.grade,1,6)&&finite(a.ability)&&finite(a.maxTuition)&&['pending','waitlisted','offered','accepted','declined','rejected','withdrawn'].includes(a.status)))invalid();
  if(!s.materials.every(m=>typeof m.id==='string'&&SUBJECTS.includes(m.subject)&&MATERIAL_SOURCES[m.source]&&PRINTING_MODES[m.printing]&&['ready','developing'].includes(m.status)&&['readyWeek','quality','cost'].every(key=>finite(m[key]))))invalid();
  if(!s.projects.every(p=>FACILITY_META[p.key]&&finite(p.readyWeek)&&finite(p.level)))invalid();
  if(!s.loans.every(l=>['balance','principal','monthlyRate','payment','monthsRemaining'].every(key=>finite(l[key]))&&l.balance>=0&&l.payment>=0&&l.monthlyRate>=0))invalid();
  if(!s.modifiers.every(m=>finite(m.learning)&&finite(m.until)))invalid();
  if(s.currentEvent&&(!Array.isArray(s.currentEvent.choices)||typeof s.currentEvent.title!=='string'||typeof s.currentEvent.description!=='string'||!s.currentEvent.choices.every(c=>typeof c.id==='string'&&finite(c.cost)&&(!c.effect||Object.values(c.effect).every(finite)))))invalid();
  if(s.ended&&(!s.result||typeof s.result.won!=='boolean'||!finite(s.result.rank)))invalid();
  if(s.eventHistory!==undefined&&(!Array.isArray(s.eventHistory)||!s.eventHistory.every(h=>h&&typeof h.id==='string'&&typeof h.title==='string'&&typeof h.choiceLabel==='string'&&typeof h.summary==='string'&&finite(h.week)&&finite(h.year)&&h.impact&&Object.values(h.impact).every(finite))))invalid();
  const followupTypes=['complaint_followup','complaint_review','teacher_review','teacher_handover','transfer_talk','material_repair'];
  const followupNumbers=['restoreQuality','scoreRecovery','cohortRecovery','teacherFatigue','count','withdrawRate','initialPressure','initialFatigue','retries','raised'];
  if(s.eventFollowups!==undefined&&(!Array.isArray(s.eventFollowups)||!s.eventFollowups.every(f=>f&&followupTypes.includes(f.type)&&Number.isInteger(f.dueWeek)&&f.dueWeek>=0&&typeof f.eventId==='string'&&typeof f.title==='string'&&followupNumbers.every(k=>f[k]===undefined||finite(f[k]))&&
    (f.type!=='material_repair'||typeof f.materialId==='string'&&SUBJECTS.includes(f.subject)&&finite(f.restoreQuality)&&finite(f.scoreRecovery)&&finite(f.cohortRecovery))&&
    (f.type!=='complaint_followup'||finite(f.withdrawRate))&&
    (f.type!=='complaint_review'||finite(f.initialPressure)&&finite(f.initialFatigue))&&
    (f.type!=='transfer_talk'||finite(f.count))&&
    (!['teacher_review','teacher_handover'].includes(f.type)||typeof f.teacherId==='string'))))invalid();
  if(s.parentTrust!==undefined&&!inRange(s.parentTrust,0,100))invalid();
  if(s.eventFinancePending&&(!finite(s.eventFinancePending.income)||!finite(s.eventFinancePending.expense)))invalid();
  for(const a of s.applicants){
    if(a.status!=='offered'&&!a.offer)continue;
    const o=a.offer;
    if(!o||!Number.isInteger(o.issuedWeek)||!Number.isInteger(o.responseWeek)||o.responseWeek<o.issuedWeek||o.responseWeek>144||!inRange(o.chance,0,100)||!finite(o.decisionDraw)||o.decisionDraw<0||o.decisionDraw>=1||typeof o.label!=='string'||!Array.isArray(o.reasons)||!o.reasons.every(x=>typeof x==='string'))invalid();
    for(const key of ['schoolRank','total','expectedScore','tuition','scholarship','effectiveTuition','maxTuition'])if(!finite(o[key]))invalid();
  }
  if(s.lastAdmissionsResponse){
    const r=s.lastAdmissionsResponse;
    if(r.week!==null&&(!Number.isInteger(r.week)||r.week<0||r.week>144))invalid();
    for(const key of ['accepted','declined'])if(!Array.isArray(r[key])||!r[key].every(a=>a&&typeof a.id==='string'&&typeof a.name==='string'&&typeof a.reason==='string'))invalid();
  }
  if(s.eventRisk&&Object.values(s.eventRisk).some(v=>!inRange(v,0,100)))invalid();
  if(s.lastEventKinds!==undefined&&(!Array.isArray(s.lastEventKinds)||s.lastEventKinds.some(v=>typeof v!=='string')))invalid();
  if(s.lastEventFollowupWeek!==undefined&&(!Number.isInteger(s.lastEventFollowupWeek)||s.lastEventFollowupWeek<0||s.lastEventFollowupWeek>144))invalid();
  ensureAdmissionsState(s);ensureEventState(s);s.rulesVersion=2;
  return s;
}
