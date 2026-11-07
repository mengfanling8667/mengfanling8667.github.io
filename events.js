/** Contextual, deterministic school events. Financial figures are simulation rules. */
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const round=(n,p=2)=>Math.round(n*10**p)/10**p;
const average=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:0;
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const money=n=>'HK$ '+Math.round(Math.abs(n)).toLocaleString('zh-HK');
const fail=message=>({ok:false,message});
const EVENT_KINDS=['parent_complaint','teacher_departure','student_transfer','material_error','collaborative_planning','mock_exam','catering','opportunity'];

function random(s){let n=(s.rngState+=0x6D2B79F5);n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);s.rngState=s.rngState>>>0;return((n^(n>>>14))>>>0)/4294967296;}
function nextId(s,prefix){s.idCounter=(finite(s.idCounter)?s.idCounter:0)+1;return `${prefix}-${s.idCounter}`;}
function weighted(s,items){const total=items.reduce((n,x)=>n+x.weight,0);if(!items.length||total<=0)return null;let n=random(s)*total;for(const item of items){n-=item.weight;if(n<0)return item.value;}return items.at(-1).value;}
function writeLog(s,message,type='event'){s.log.unshift({id:nextId(s,'log'),week:s.elapsedWeeks,year:Math.min(3,Math.floor(s.elapsedWeeks/48)+1),type,message});if(s.log.length>180)s.log.length=180;}

export function ensureEventState(s){
  if(!Array.isArray(s.eventHistory))s.eventHistory=[];
  if(!Array.isArray(s.eventFollowups))s.eventFollowups=[];
  if(!Array.isArray(s.lastEventKinds))s.lastEventKinds=[];
  if(!Array.isArray(s.log))s.log=[];
  if(!Array.isArray(s.modifiers))s.modifiers=[];
  if(!finite(s.parentTrust))s.parentTrust=72;
  s.parentTrust=clamp(s.parentTrust,0,100);
  if(!s.eventRisk||typeof s.eventRisk!=='object')s.eventRisk={};
  for(const key of ['complaints','departure','transfer','materials'])if(!finite(s.eventRisk[key]))s.eventRisk[key]=0;
  if(!s.eventFinancePending||typeof s.eventFinancePending!=='object')s.eventFinancePending={income:0,expense:0};
  for(const key of ['income','expense'])if(!finite(s.eventFinancePending[key]))s.eventFinancePending[key]=0;
  s.eventHistory=s.eventHistory.slice(0,80);s.lastEventKinds=s.lastEventKinds.slice(-3);
  return s;
}

function pressure(s){const fee=s.policies.tuition*(1-s.policies.scholarship/100);const base=s.type==='dss'?2600:3800;return clamp((fee-base)/8000,0,1);}
function eligibleMaterials(s){return(s.materials||[]).filter(m=>m.status==='ready'&&!m.repairPending&&(!finite(m.lastIncidentWeek)||s.elapsedWeeks-m.lastIncidentWeek>=20));}
function totalStudents(s){return(s.cohorts||[]).reduce((n,c)=>n+c.count,0);}
function riskAdd(s,key,n){s.eventRisk[key]=clamp((s.eventRisk[key]||0)+n,0,100);}
function trustAdd(s,n){s.parentTrust=round(clamp(s.parentTrust+n,0,100));}
function queue(s,followup){s.eventFollowups.push({id:nextId(s,'followup'),...followup});}
function charge(s,cost){s.cash-=cost;if(cost>0)s.eventFinancePending.expense+=cost;else if(cost<0)s.eventFinancePending.income-=cost;}
function snapshot(s){return{cash:s.cash,score:scoreMetric(s),teachers:s.teachers.length,students:totalStudents(s),trust:s.parentTrust,quality:(s.materials||[]).reduce((n,m)=>n+m.quality,0),salary:s.teachers.reduce((n,t)=>n+t.salary,0)};}
function scoreMetric(s){const count=totalStudents(s);const subjects=average(s.subjects.map(x=>x.score));const cohorts=count?s.cohorts.reduce((n,c)=>n+c.score*c.count,0)/count:subjects;const academic=cohorts*.72+subjects*.28;const senior=s.cohorts.find(c=>c.grade===6);const dse=clamp((senior?.score??subjects)*.83+subjects*.17+s.examReadiness,0,100);return academic*.6+dse*.4;}
function impact(before,s){const after=snapshot(s);return{cashDelta:round(after.cash-before.cash),scoreDelta:round(after.score-before.score,3),teacherDelta:after.teachers-before.teachers,studentDelta:after.students-before.students,parentTrustDelta:round(after.trust-before.trust),materialQualityDelta:round(after.quality-before.quality,3),salaryDelta:round(after.salary-before.salary)};}
function history(s,event,choice,summary,before,phase='decision'){
  const entry={id:nextId(s,'event-history'),eventId:event.id,kind:event.kind,title:event.title,choiceId:choice.id,choiceLabel:choice.label,week:s.elapsedWeeks,year:Math.min(3,Math.floor(s.elapsedWeeks/48)+1),cost:choice.cost||0,phase,summary,impact:impact(before,s)};
  s.eventHistory.unshift(entry);if(s.eventHistory.length>80)s.eventHistory.length=80;
  writeLog(s,`${phase==='followup'?'後續進展・':''}${event.title}：${summary}`);
  return entry;
}
function adjustScore(s,subject,subjectDelta=0,cohortDelta=0){
  const target=s.subjects.find(x=>x.name===subject);
  if(target&&subjectDelta){const old=target.score;target.score=round(clamp(old+subjectDelta,0,99.5),3);target.mastery=target.score;target.level=target.score;target.trend=round((target.trend||0)+target.score-old,3);}
  if(cohortDelta)for(const c of s.cohorts)if(c.count>0)c.score=round(clamp(c.score+cohortDelta,0,99.5),3);
}

/** Proportional withdrawals do not inspect grades, marks, ability, or individual students. */
function withdrawStudents(s,requested){
  const total=totalStudents(s),count=Math.min(Math.max(0,Math.round(requested)),Math.max(0,total-1));
  if(!count)return 0;
  const allocations=s.cohorts.map((cohort,index)=>{const exact=count*cohort.count/total;return{cohort,index,take:Math.floor(exact),remainder:exact-Math.floor(exact)};});
  let remaining=count-allocations.reduce((n,x)=>n+x.take,0);
  // Rotate tie breaks by event week rather than selecting the lowest-scoring cohort.
  allocations.sort((a,b)=>b.remainder-a.remainder||((a.index+s.elapsedWeeks)%6)-((b.index+s.elapsedWeeks)%6));
  for(const a of allocations){if(!remaining)break;if(a.take<a.cohort.count){a.take++;remaining--;}}
  for(const a of allocations)a.cohort.count-=a.take;
  s.enrollment=totalStudents(s);
  return count-remaining;
}

function choice(id,label,description,cost,effect={}){return{id,label,description,cost:Math.round(cost),effect};}
function makeParentComplaint(s){
  const feePressure=pressure(s),fatigue=s.studentFatigue||0;
  const issue=feePressure>.2?'學費與配套費用的負擔':fatigue>48?'功課與課後輔導的負荷':'收費、功課與家校溝通的安排';
  return{kind:'parent_complaint',title:'家長聯署要求校方回應',description:`家長群組正在討論${issue}。部分家庭希望校方交代如何改善，家長信任目前為${Math.round(s.parentTrust)}。回應方式會影響後續留生與投訴風險。`,context:{issue,feePressure,fatigue},defaultChoiceId:'defer',choices:[
    choice('meeting','安排家長會與個案跟進','支出$12,000；信任回升，但教師需要騰出時間。四週後家長會檢視實際收費與課業有沒有改善。',12000,{parentTrust:8,teacherFatigue:3,learning:-.02,weeks:2,complaintReview:1}),
    choice('support','提供一次性學習與費用支援',`支出${money(Math.max(16000,totalStudents(s)*65))}；減輕眼前負擔與疲勞。需要長期安排仍須調整政策。`,Math.max(16000,totalStudents(s)*65),{parentTrust:5,studentFatigue:-5,complaintRisk:-7,transferRisk:-5}),
    choice('defer','延後回覆，維持現有安排','沒有即時支出；信任下降，四週後部分家庭可能轉校。未處理事件也會採用此方案。',0,{parentTrust:-9,complaintRisk:12,learning:-.025,weeks:5,deferComplaint:1})
  ]};
}
function makeTeacherDeparture(s){
  const teacher=weighted(s,s.teachers.map(t=>({value:t,weight:.25+t.fatigue/28+Math.max(0,t.skill*510-t.salary)/12000})).filter(x=>!(x.value.retentionUntil>s.elapsedWeeks)));
  const t=teacher||s.teachers[0];if(!t)return null;
  const raise=Math.max(1500,Math.round(t.salary*.08/100)*100),supportCost=Math.round(22000+t.salary*.35);
  return{kind:'teacher_departure',title:`${t.name}老師提出離職`,description:`${t.subject}科的${t.name}老師希望重新考慮工作安排。教學能力${Math.round(t.skill)}、疲勞${Math.round(t.fatigue)}，現時月薪${money(t.salary)}。接受離職會真的減少師資；留人亦有持續或即時成本。`,context:{teacherId:t.id,teacherName:t.name,subject:t.subject,salary:t.salary,raiseAmount:raise},defaultChoiceId:'accept_departure',choices:[
    choice('raise','調整薪酬並確認留任',`每月薪酬永久增加${money(raise)}，即時無入職費；若工作負荷仍然過高，之後仍有離職風險。`,0,{salaryIncrease:raise,parentTrust:1,departureRisk:-7,teacherRetention:16}),
    choice('support','安排代課與短期工作支援',`支出${money(supportCost)}，讓教師整理課務兩週，疲勞明顯下降；短期授課時間也會減少。`,supportCost,{targetTeacherFatigue:-25,teacherSupport:1,departureRisk:-5,teacherRetention:10}),
    choice('accept_departure','接受離職，安排交接','沒有額外留人費。教師會離開，同科課務要重分；若只餘一位教師，先延長交接至有替補。',0,{teacherDeparture:1,parentTrust:-2,learning:-.045,weeks:5})
  ]};
}
function makeStudentTransfer(s){
  if(totalStudents(s)<8)return null;
  const group=Math.min(9,Math.max(2,Math.ceil(totalStudents(s)*(.006+pressure(s)*.008+Math.max(0,(s.studentFatigue||0)-45)*.00012))));
  return{kind:'student_transfer',title:'多個家庭提出轉校查詢',description:`約${group}個家庭正在考慮轉校，原因涉及學習適應、家庭負擔與課業安排。轉校按各年級人數比例處理，不會挑走低分學生；學額與學費收入都會改變。`,context:{affectedCount:group,feePressure:pressure(s),fatigue:s.studentFatigue||0},defaultChoiceId:'accept_transfer',choices:[
    choice('individual_plan','安排個別學習與適應支援','支出$18,000，保留這批學額；教師需額外跟進，學生疲勞下降。',18000,{parentTrust:4,studentFatigue:-6,teacherFatigue:3,transferRisk:-7}),
    choice('talk','由班主任與家長商討','沒有即時支出，教師負擔增加；兩週後按當時學費、疲勞與信任決定有多少家庭留下。',0,{parentTrust:1,teacherFatigue:5,learning:-.025,weeks:2,transferTalk:1}),
    choice('accept_transfer','尊重決定並辦理轉校',`這批約${group}位學生正式轉出；騰出學額，也減少往後學費收入。`,0,{withdrawCount:group,parentTrust:-2,learning:-.025,weeks:3})
  ]};
}
function makeMaterialError(s){
  const candidates=eligibleMaterials(s);if(!candidates.length)return null;
  const m=weighted(s,candidates.map(m=>({value:m,weight:(m.source==='custom'?1.7:m.source==='publisher'?.8:.45)*(m.printing==='inhouse'?1.15:1)})));
  const reprintCost=m.printing==='digital'?6500:Math.max(11000,Math.round((m.printCost||10000)*.8+6000));
  return{kind:'material_error',title:`${m.subject}教材發現錯誤`,description:`教師在「${m.name||m.subject+'教材'}」發現答案或例題有誤。教材已在使用，錯誤會影響理解與家長信任；返印、勘誤或延後修正所需時間不同。`,context:{materialId:m.id,subject:m.subject,materialName:m.name||m.subject+'教材',originalQuality:m.quality},defaultChoiceId:'defer_repair',choices:[
    choice('reprint','停用錯頁並完成返印',`支出${money(reprintCost)}，兩週後恢復教材品質。停用期間稍有教學磨合，已有誤解需要補回。`,reprintCost,{materialDamage:.14,subjectScore:-.4,cohortScore:-.045,repairWeeks:2,restoreRatio:1,scoreRecovery:.28,cohortRecovery:.03,parentTrust:3,learning:-.02,weeks:2}),
    choice('errata','先派勘誤表，由教師講解','支出$3,500；四週後完成校正，教師負擔增加，使用效率略低於完整返印。',3500,{materialDamage:.1,subjectScore:-.3,cohortScore:-.035,repairWeeks:4,restoreRatio:.97,scoreRecovery:.18,cohortRecovery:.02,teacherFatigue:4,parentTrust:1,learning:-.025,weeks:4}),
    choice('defer_repair','延至科組例行檢查再處理','沒有即時支出；錯誤繼續傳播，品質與學習會受損。八週後教師完成基本勘誤，僅部分恢復。',0,{materialDamage:.27,subjectScore:-.8,cohortScore:-.1,repairWeeks:8,restoreRatio:.83,scoreRecovery:.2,cohortRecovery:.025,parentTrust:-5,materialRisk:10,learning:-.045,weeks:8})
  ]};
}
function makeCollaborative(s){return{kind:'collaborative_planning',title:'教師建議安排共同備課',description:'同科教師希望研究錯題與互相觀課。騰出時間需要代課安排，直接加在現有課務上則會增加疲勞。',context:{},defaultChoiceId:'existing',choices:[choice('cover','安排代課與共同備課','支出$24,000；八週內改善課堂配合並減輕教師疲勞。',24000,{learning:.1,weeks:8,teacherFatigue:-5}),choice('short_meeting','安排精簡教研短會','支出$5,000；提升較小，教師仍需額外開會。',5000,{learning:.04,weeks:6,teacherFatigue:2}),choice('existing','沿用現有備課安排','沒有新增教研資源；本輪提案結束，現有課程繼續。',0,{departureRisk:1})]};}
function makeMockExam(s){
  const weak=[...s.subjects].sort((a,b)=>a.score-b.score)[0];
  return{kind:'mock_exam',title:`模擬試顯示${weak?.name||'部分科目'}失分`,description:'科任會議發現學生在新題型與概念運用上仍有缺口。你可重新安排教學，亦可保留原來的進度。',context:{subject:weak?.name||''},defaultChoiceId:'steady',choices:[choice('foundation','重新安排概念補底','支出$12,000；七週內改善理解，但教師備課較忙。',12000,{learning:.09,weeks:7,teacherFatigue:4}),choice('practice','採購題型分析與答題訓練','支出$22,000；提高考試熟練度，也會增加學生疲勞。',22000,{learning:.045,weeks:5,exam:.35,studentFatigue:4}),choice('steady','保持教學進度並繼續觀察','不新增開支或課時，等待下一輪評核。',0,{})]};
}
function makeCatering(s){return{kind:'catering',title:'膳食承辦商提出續約方案',description:'承辦商願意討論校內供餐流程與採購安排。節省採購費能改善現金，但也有餐單選擇與午休品質的取捨。',context:{mealFee:s.policies.mealFee},defaultChoiceId:'renew',choices:[choice('logistics','改善取餐動線與午休安排','支出$14,000；減少候餐與疲勞，提升家長信任。',14000,{studentFatigue:-6,parentTrust:2}),choice('rebate','接受精簡餐單與續約回贈','一次節省$6,000，餐單選擇減少，疲勞與投訴風險略增。',-6000,{studentFatigue:3,parentTrust:-2,complaintRisk:3}),choice('renew','按原有條件續約','沒有額外收入或支出，維持目前供餐安排。',0,{})]};}
function makeOpportunity(s){return{kind:'opportunity',title:'區內學校邀請參與教研交流',description:'鄰近學校提出分享課例與評核經驗。這是一次提升教學的機會，參與亦會佔用教師時間。',context:{district:s.district||''},defaultChoiceId:'decline',choices:[choice('team','安排科組深入交流','支出$18,000；六週內改善教學方法，教師短期較忙。',18000,{learning:.12,weeks:6,teacherFatigue:4,parentTrust:1}),choice('online','派代表參加免費線上分享','無即時費用；三週內小幅改善教學，需要代表整理筆記。',0,{learning:.035,weeks:3,teacherFatigue:2}),choice('decline','留校按原計劃授課','保留時間，不採用本次交流機會。',0,{})]};}

const BUILDERS={parent_complaint:makeParentComplaint,teacher_departure:makeTeacherDeparture,student_transfer:makeStudentTransfer,material_error:makeMaterialError,collaborative_planning:makeCollaborative,mock_exam:makeMockExam,catering:makeCatering,opportunity:makeOpportunity};

export function createRandomEvent(s,forcedKind){
  if(s.ended)return null;
  ensureEventState(s);
  let kind=forcedKind;
  if(kind&&!EVENT_KINDS.includes(kind))return null;
  if(kind==='material_error'&&!eligibleMaterials(s).length)return null;
  if(kind==='student_transfer'&&totalStudents(s)<8)return null;
  if(kind==='teacher_departure'&&!s.teachers.length)return null;
  if(!kind){
    const teacherFatigue=average(s.teachers.map(t=>t.fatigue));
    const weights={parent_complaint:.8+pressure(s)*2.3+Math.max(0,65-s.parentTrust)/35+s.eventRisk.complaints/45,teacher_departure:.55+Math.max(0,teacherFatigue-30)/30+s.eventRisk.departure/45,student_transfer:.6+pressure(s)*1.1+Math.max(0,(s.studentFatigue||0)-42)/45+s.eventRisk.transfer/50,material_error:eligibleMaterials(s).length?.5+Math.min(1,eligibleMaterials(s).filter(m=>m.source==='custom').length*.12)+s.eventRisk.materials/50:0,collaborative_planning:1,mock_exam:1.1,catering:.75,opportunity:.7};
    if(totalStudents(s)<8)weights.student_transfer=0;
    if(!s.teachers.length)weights.teacher_departure=0;
    const latest=s.lastEventKinds.at(-1),previous=s.lastEventKinds.at(-2);
    kind=weighted(s,EVENT_KINDS.map(value=>({value,weight:weights[value]*(value===latest?0:value===previous?.45:1)})));
  }
  if(!kind)return null;
  const built=BUILDERS[kind](s);if(!built)return null;
  const event={id:nextId(s,'event'),week:s.elapsedWeeks,...built};
  s.lastEventKinds.push(kind);if(s.lastEventKinds.length>3)s.lastEventKinds.shift();
  return event;
}

function genericEffects(s,effect){
  if(effect.parentTrust)trustAdd(s,effect.parentTrust);
  if(effect.studentFatigue)s.studentFatigue=clamp(s.studentFatigue+effect.studentFatigue,0,100);
  if(effect.teacherFatigue)for(const t of s.teachers)t.fatigue=clamp(t.fatigue+effect.teacherFatigue,0,100);
  if(effect.exam)s.examReadiness=clamp(s.examReadiness+effect.exam,-3,4);
  if(effect.learning)s.modifiers.push({learning:effect.learning,until:s.elapsedWeeks+(effect.weeks||4)});
  if(effect.complaintRisk)riskAdd(s,'complaints',effect.complaintRisk);
  if(effect.departureRisk)riskAdd(s,'departure',effect.departureRisk);
  if(effect.transferRisk)riskAdd(s,'transfer',effect.transferRisk);
  if(effect.materialRisk)riskAdd(s,'materials',effect.materialRisk);
}
function leaveTeacher(s,teacherId,event){
  const index=s.teachers.findIndex(t=>t.id===teacherId);if(index<0)return '教師已完成其他離職安排。';
  const teacher=s.teachers[index];
  if(s.teachers.length<=1){teacher.retentionUntil=s.elapsedWeeks+8;queue(s,{type:'teacher_handover',dueWeek:s.elapsedWeeks+4,teacherId,eventId:event.id,title:event.title,kind:event.kind,retries:0});return '目前只餘一位教師，先延長交接；補聘後離職安排才會完成。';}
  s.teachers.splice(index,1);riskAdd(s,'departure',-3);return `${teacher.name}老師已正式離職，${teacher.subject}科課務需要重新安排。`;
}

export function applyEventChoice(s,choiceId){
  if(s.ended)return fail('任期已結束。');
  const event=s.currentEvent;if(!event)return fail('目前沒有待處理的校務事件。');
  const selected=event.choices?.find(c=>c.id===choiceId);if(!selected)return fail('請選擇有效的處理方案。');
  if(!finite(selected.cost)||Object.values(selected.effect||{}).some(value=>!finite(value)))return fail('事件資料不完整，請重新載入有效存檔。');
  if(selected.cost>0&&s.cash<selected.cost)return fail('目前現金不足，請選擇無即時支出的方案。');
  ensureEventState(s);
  const before=snapshot(s),effect=selected.effect||{},context=event.context||{};
  charge(s,selected.cost);genericEffects(s,effect);
  let detail='';
  if(event.kind==='parent_complaint'){
    if(effect.complaintReview)queue(s,{type:'complaint_review',dueWeek:s.elapsedWeeks+4,eventId:event.id,title:event.title,kind:event.kind,initialPressure:context.feePressure||0,initialFatigue:context.fatigue||0});
    if(effect.deferComplaint)queue(s,{type:'complaint_followup',dueWeek:s.elapsedWeeks+4,eventId:event.id,title:event.title,kind:event.kind,withdrawRate:.006+(context.feePressure||0)*.009});
  }
  if(event.kind==='teacher_departure'){
    const teacher=s.teachers.find(t=>t.id===context.teacherId);
    if(teacher){
      if(effect.salaryIncrease){teacher.salary+=effect.salaryIncrease;teacher.morale=clamp((teacher.morale||70)+10,0,100);teacher.fatigue=clamp(teacher.fatigue-5,0,100);detail=`月薪現為${money(teacher.salary)}，持續成本將反映在月度預算。`;}
      if(effect.targetTeacherFatigue)teacher.fatigue=clamp(teacher.fatigue+effect.targetTeacherFatigue,0,100);
      if(effect.teacherSupport)teacher.busyUntil=Math.max(teacher.busyUntil||0,s.elapsedWeeks+2);
      if(effect.teacherRetention){teacher.retentionUntil=s.elapsedWeeks+effect.teacherRetention;queue(s,{type:'teacher_review',dueWeek:s.elapsedWeeks+6,eventId:event.id,title:event.title,kind:event.kind,teacherId:teacher.id,raised:effect.salaryIncrease?1:0});}
      if(effect.teacherDeparture)detail=leaveTeacher(s,teacher.id,event);
    }else detail='該教師已不在職，其他安排按所選方案執行。';
  }
  if(event.kind==='student_transfer'){
    if(effect.withdrawCount){const count=withdrawStudents(s,effect.withdrawCount);detail=`${count}位學生按年級人數比例轉出，往後學費收入相應減少。`;}
    if(effect.transferTalk)queue(s,{type:'transfer_talk',dueWeek:s.elapsedWeeks+2,eventId:event.id,title:event.title,kind:event.kind,count:context.affectedCount||2});
    if(selected.id==='individual_plan')detail='這批家庭接受個別支援安排，學額暫時保留；長期留生仍取決於收費與教學。';
  }
  if(event.kind==='material_error'){
    const material=s.materials.find(m=>m.id===context.materialId);
    if(material){
      const original=finite(context.originalQuality)?context.originalQuality:material.quality;
      material.quality=round(clamp(material.quality-(effect.materialDamage||0),.05,1.3),3);material.lastIncidentWeek=s.elapsedWeeks;material.repairPending=true;material.repairEventId=event.id;material.issueCount=(material.issueCount||0)+1;
      adjustScore(s,material.subject,effect.subjectScore||0,effect.cohortScore||0);
      queue(s,{type:'material_repair',dueWeek:s.elapsedWeeks+(effect.repairWeeks||4),eventId:event.id,title:event.title,kind:event.kind,materialId:material.id,subject:material.subject,restoreQuality:round(original*(effect.restoreRatio||1),3),scoreRecovery:effect.scoreRecovery||0,cohortRecovery:effect.cohortRecovery||0,teacherFatigue:selected.id==='defer_repair'?6:0,mode:selected.id});
      detail=`教材品質暫為${round(material.quality,2)}，${effect.repairWeeks||4}週後完成${selected.id==='reprint'?'返印':'勘誤'}。`;
    }else detail='該教材已不在使用清單；科組會改以現有資源處理。';
  }
  s.eventsResolved=(s.eventsResolved||0)+1;
  const learningNote=effect.learning?`未來${effect.weeks||4}週${effect.learning>0?'教學配合改善，成效會隨課堂逐步反映':'教學安排受影響，需要時間恢復'}。`:'';
  const trustNote=effect.parentTrust?`家長信任${effect.parentTrust>0?'增加':'下降'}${Math.abs(effect.parentTrust)}。`:'';
  const fatigueNote=effect.teacherFatigue?`教師疲勞${effect.teacherFatigue>0?'上升':'下降'}${Math.abs(effect.teacherFatigue)}。`:'';
  const summary=`${selected.label}。${selected.cost>0?`即時支出${money(selected.cost)}。`:selected.cost<0?`即時收入${money(-selected.cost)}。`:''}${detail}${learningNote}${trustNote}${fatigueNote}`;
  history(s,event,selected,summary,before);
  s.currentEvent=null;
  return{ok:true,message:detail||'處理方案已實施，後續影響會繼續反映。'};
}

export function processEventFollowups(s){
  ensureEventState(s);
  if(s.ended)return{ok:true,message:'任期已結束。',processed:0};
  const week=s.elapsedWeeks;
  // Idempotent for a given week: UI re-renders must not repeatedly decay risk or resolve cases.
  if(s.lastEventFollowupWeek===week)return{ok:true,message:'本週後續校務已更新。',processed:0};
  s.lastEventFollowupWeek=week;
  for(const key of Object.keys(s.eventRisk))s.eventRisk[key]=round(Math.max(0,s.eventRisk[key]-.22));
  const due=s.eventFollowups.filter(f=>f.dueWeek<=week);
  s.eventFollowups=s.eventFollowups.filter(f=>f.dueWeek>week);
  let processed=0;
  for(const f of due){
    const before=snapshot(s),event={id:f.eventId,kind:f.kind,title:f.title},selected={id:f.type,label:'後續處理',cost:0};
    let summary='';
    if(f.type==='complaint_followup'){
      const count=withdrawStudents(s,Math.max(1,Math.round(totalStudents(s)*f.withdrawRate)));
      trustAdd(s,-3);riskAdd(s,'transfer',3);summary=`未回應的家長投訴有了後續：${count}位學生按年級比例轉校，家長信任再下降3。`;
    }else if(f.type==='complaint_review'){
      const improved=pressure(s)<Math.max(.03,f.initialPressure-.04)||(s.studentFatigue||0)<f.initialFatigue-4;
      trustAdd(s,improved?4:-2);riskAdd(s,'complaints',improved?-5:3);
      summary=improved?'家長檢視後確認收費或課業已有改善，信任增加4。':'家長會已完成，但收費與課業負擔尚未改善；信任回落2，投訴風險略升。';
    }else if(f.type==='teacher_review'){
      const teacher=s.teachers.find(t=>t.id===f.teacherId);if(!teacher)continue;
      if(teacher.fatigue>74){riskAdd(s,'departure',7);teacher.retentionUntil=Math.min(teacher.retentionUntil||week,week+3);summary=`${teacher.name}老師的疲勞仍高於74，離職風險再次增加；薪酬安排仍按合約延續。`;}
      else{riskAdd(s,'departure',-3);summary=`${teacher.name}老師完成留任檢視，目前繼續任教；${f.raised?'調整後薪酬':'現有支援安排'}已反映在日常運作。`;}
    }else if(f.type==='teacher_handover'){
      const teacher=s.teachers.find(t=>t.id===f.teacherId);if(!teacher)continue;
      if(s.teachers.length>1){s.teachers=s.teachers.filter(t=>t.id!==f.teacherId);summary=`補充人手後，${teacher.name}老師正式完成離職交接。`;}
      else{queue(s,{...f,id:nextId(s,'followup'),dueWeek:week+4,retries:(f.retries||0)+1});if(f.retries>0)continue;summary=`尚未補聘替代人手，${teacher.name}老師的交接期延長；請檢視招聘安排。`;}
    }else if(f.type==='transfer_talk'){
      const fraction=clamp(.18+pressure(s)*.4+Math.max(0,(s.studentFatigue||0)-48)*.009+Math.max(0,65-s.parentTrust)*.006,.15,.85);
      const count=withdrawStudents(s,Math.round(f.count*fraction));
      trustAdd(s,count>f.count*.5?-2:1);summary=`班主任商討完成：${count}位學生仍決定轉校，${Math.max(0,f.count-count)}個家庭願意繼續觀察。`;
    }else if(f.type==='material_repair'){
      const material=s.materials.find(m=>m.id===f.materialId);if(!material)continue;
      if(material.repairEventId!==f.eventId)continue;
      material.quality=round(Math.max(material.quality,f.restoreQuality),3);material.repairPending=false;
      adjustScore(s,f.subject,f.scoreRecovery,f.cohortRecovery);
      if(f.teacherFatigue)for(const t of s.teachers.filter(t=>t.subject===f.subject))t.fatigue=clamp(t.fatigue+f.teacherFatigue,0,100);
      riskAdd(s,'materials',f.mode==='defer_repair'?0:-4);
      summary=`${f.subject}教材${f.mode==='reprint'?'返印':'勘誤'}完成，品質恢復至${round(material.quality,2)}。教師補回部分錯誤概念，${f.mode==='defer_repair'?'先前的學習損失未能完全補回。':'已有誤解仍需透過課堂鞏固。'}`;
    }
    if(summary){history(s,event,selected,summary,before,'followup');processed++;}
  }
  return{ok:true,message:processed?`完成${processed}項校務跟進。`:'本週沒有到期的校務跟進。',processed};
}

export { EVENT_KINDS };
