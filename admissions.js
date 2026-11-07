/** 正式取錄通知、候補名單與學生回覆。所有機率均為本遊戲模型。 */
const STATUSES = new Set(['pending', 'waitlisted', 'offered', 'accepted', 'declined', 'rejected', 'withdrawn']);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
const round = (value, places = 0) => Math.round(value * 10 ** places) / 10 ** places;
const mean = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const ok = message => ({ok: true, message});
const fail = message => ({ok: false, message});
const currentWeek = s => Math.max(0, finite(s.elapsedWeeks));
const money = value => '$' + Math.round(value).toLocaleString('zh-HK');

// Same generator as engine.js. Draw once when issuing each offer, then persist it.
function random(s) {
  let n = (s.rngState += 0x6D2B79F5);
  n = Math.imul(n ^ (n >>> 15), n | 1);
  n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
  s.rngState = s.rngState >>> 0;
  return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
}

function record(s, message) {
  s.log.unshift({
    id: `log-${++s.idCounter}`, week: currentWeek(s),
    year: Math.min(3, Math.floor(currentWeek(s) / 48) + 1),
    type: 'admissions', message
  });
  if (s.log.length > 180) s.log.length = 180;
}

function publicOffer(offer) {
  if (!offer) return null;
  const {decisionDraw, ...snapshot} = offer;
  return {...snapshot, reasons: [...(snapshot.reasons || [])]};
}

function transition(s, student, status, reason, reasons = []) {
  student.status = status;
  student.statusWeek = currentWeek(s);
  student.reservation = status === 'offered';
  student.admissionEvents ||= [];
  student.admissionEvents.push({week: currentWeek(s), status, reason, reasons: [...reasons]});
  if (['accepted', 'declined', 'rejected', 'withdrawn'].includes(status)) {
    student.decisionWeek = currentWeek(s);
    student.decisionReason = reason;
  }
  s.admissionHistory.push({
    ...student, offer: publicOffer(student.offer),
    admissionEvents: student.admissionEvents.map(event => ({...event, reasons: [...event.reasons]})),
    recordedWeek: currentWeek(s), reason, reasons: [...reasons]
  });
  record(s, reason);
}

/** Upgrade earlier saves without enrolling their accepted students a second time. */
export function ensureAdmissionsState(s) {
  s.applicants ||= [];
  s.admissionHistory ||= [];
  s.log ||= [];
  s.idCounter = finite(s.idCounter);
  s.rngState = finite(s.rngState, finite(s.seed, 12345)) >>> 0;
  s.lastAdmissionsResponse ||= {week: null, accepted: [], declined: []};
  for (const student of s.applicants) {
    if (!STATUSES.has(student.status)) student.status = 'pending';
    student.admissionEvents ||= [];
    student.reservation = student.status === 'offered';
    if (student.status === 'accepted') student.enrolled = true;
    // Older released versions never had offers. Preserve a partially upgraded
    // save by filling a missing snapshot once, never every time the UI reads it.
    if (student.status === 'offered') {
      const previous = student.offer || {};
      const forecast = calculateForecast(s, student);
      const issuedWeek = finite(previous.issuedWeek, finite(student.offerWeek, currentWeek(s)));
      student.offer = {
        ...forecast, ...offerTerms(s, student), ...previous,
        issuedWeek,
        responseWeek: Math.min(144, finite(previous.responseWeek, issuedWeek + 2)),
        chance: clamp(finite(previous.chance, forecast.chance), 0, 100),
        reasons: Array.isArray(previous.reasons) ? [...previous.reasons] : [...forecast.reasons],
        decisionDraw: Number.isFinite(previous.decisionDraw) && previous.decisionDraw >= 0 && previous.decisionDraw < 1
          ? previous.decisionDraw : random(s)
      };
    }
  }
  return s;
}

// Keep the exact competition-rank formula used by engine.getRankings, without
// importing engine.js and creating a dependency cycle.
function schoolRanking(s) {
  const time = currentWeek(s) / 48;
  const schools = (s.opponents || []).map(opponent => ({
    id: opponent.id,
    score: round(clamp(opponent.base + opponent.ambition * time + Math.sin(time * 2 + opponent.phase) * .72, 20, 97), 2)
  }));
  schools.push({id: 'player', score: round(finite(s.compositeScore, finite(s.score, 50)), 2)});
  schools.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  let last = -1, lastRank = 0;
  for (let index = 0; index < schools.length; index++) {
    const school = schools[index];
    school.rank = school.score === last ? lastRank : index + 1;
    last = school.score;
    lastRank = school.rank;
  }
  return {schoolRank: schools.find(school => school.id === 'player').rank, total: schools.length};
}

function offerTerms(s, student) {
  const tuition = Math.max(0, finite(s.policies?.tuition));
  const scholarship = clamp(finite(s.policies?.scholarship), 0, 100);
  return {
    tuition, scholarship,
    effectiveTuition: round(tuition * (1 - scholarship / 100)),
    maxTuition: Math.max(1, finite(student.maxTuition, 5000))
  };
}

function calculateForecast(s, student) {
  const {schoolRank, total} = schoolRanking(s);
  const terms = offerTerms(s, student);
  const reference = clamp(finite(student.profileScore, finite(student.ability, 60)), 0, 100);
  const expectedScore = round(clamp(reference * .78 + 14 + Math.max(0, finite(student.attitude, 70) - 75) * .06, 45, 94), 1);
  const schoolScore = finite(s.compositeScore, finite(s.score, 50));
  const scoreGap = schoolScore - expectedScore;
  const prestige = total > 1 ? 1 - (schoolRank - 1) / (total - 1) : .5;
  const affordability = terms.effectiveTuition / terms.maxTuition;
  let chance = 48 + prestige * 18 + clamp(scoreGap * 1.6, -40, 16);
  const reasons = [];

  if (schoolRank <= Math.max(1, Math.ceil(total * .1))) {
    reasons.push(`本校全港第${schoolRank}／${total}，較受重視學業表現的家庭青睞。`);
  } else {
    reasons.push(`本校全港第${schoolRank}／${total}；學生也會比較其他學校的取錄通知。`);
  }
  if (scoreGap < -10) reasons.push(`參考成績較高，學生傾向選擇成績指數約${expectedScore}分或以上的學校。`);
  else if (scoreGap < -3) reasons.push(`學生期望的學業水平約${expectedScore}分，本校仍需爭取其認同。`);
  else reasons.push(`本校學業水平與學生約${expectedScore}分的擇校期望相配。`);

  if (affordability > 1) {
    chance -= Math.min(70, 28 + (affordability - 1) * 45);
    reasons.push(`扣除獎助學金後每月約${money(terms.effectiveTuition)}，高於家庭約${money(terms.maxTuition)}的預算，接受意向大幅降低。`);
  } else if (affordability <= .6) {
    chance += 10;
    reasons.push(`扣除獎助學金後每月約${money(terms.effectiveTuition)}，家庭負擔較輕。`);
  } else {
    chance += affordability <= .85 ? 6 : 1;
    reasons.push(`扣除獎助學金後每月約${money(terms.effectiveTuition)}，在家庭預算內${affordability > .85 ? '，但餘裕有限' : ''}。`);
  }
  if (terms.scholarship >= 15) {
    chance += 3;
    reasons.push(`獎助學金預留比例${terms.scholarship}%，增加家庭對資助安排的信心。`);
  }
  chance = round(clamp(chance, 2, 96));
  const label = chance >= 75 ? '接受意向較高' : chance >= 45 ? '仍需爭取' : chance >= 20 ? '接受意向偏低' : '接受機會很低';
  return {chance, label, reasons, schoolRank, total, expectedScore};
}

/** Pure UI forecast: no mutation, random draw or guaranteed result. */
export function getOfferForecast(s, student) {
  if (student?.offer && ['offered', 'accepted', 'declined'].includes(student.status)) {
    const offer = student.offer;
    return {
      chance: offer.chance, label: offer.label, reasons: [...(offer.reasons || [])],
      schoolRank: offer.schoolRank, total: offer.total, expectedScore: offer.expectedScore
    };
  }
  return calculateForecast(s, student || {});
}

export function issueOffer(s, id) {
  ensureAdmissionsState(s);
  if (s.ended || currentWeek(s) >= 144) return fail('三年任期已結束，不能再發出取錄通知。');
  const student = s.applicants.find(applicant => applicant.id === id);
  if (!student || !['pending', 'waitlisted'].includes(student.status)) return fail('只有待處理或預備名單的申請人可以獲發取錄通知。');
  if (!student.interviewed) return fail('請先完成校長或教師面試，才發出正式取錄通知。');
  const reserved = s.applicants.filter(applicant => applicant.status === 'offered').length;
  if (finite(s.capacity) - finite(s.enrollment) - reserved < 1) return fail('學額已滿或已預留予待覆通知，請等候回覆或先擴建課室。');
  const forecast = calculateForecast(s, student);
  student.offer = {
    ...forecast, reasons: [...forecast.reasons], ...offerTerms(s, student),
    issuedWeek: currentWeek(s), responseWeek: Math.min(currentWeek(s) + 2, 144),
    decisionDraw: random(s)
  };
  student.offerWeek = currentWeek(s);
  transition(s, student, 'offered', `向${student.name}發出中${student.grade}正式取錄通知，已預留1個學額，預計第${student.offer.responseWeek}週回覆；尚未入讀。${forecast.reasons.join('')}`, forecast.reasons);
  return ok(`已向${student.name}發出正式取錄通知；預留學額，等候學生回覆。`);
}

export function waitlistStudent(s, id) {
  ensureAdmissionsState(s);
  if (s.ended || currentWeek(s) >= 144) return fail('三年任期已結束。');
  const student = s.applicants.find(applicant => applicant.id === id);
  if (!student || student.status !== 'pending') return fail('只有待處理的申請人可以加入預備名單。');
  if (!student.interviewed) return fail('請先完成校長或教師面試，才加入預備名單。');
  student.waitlistedWeek = currentWeek(s);
  transition(s, student, 'waitlisted', `${student.name}列入中${student.grade}預備名單；不佔學額。有學生放棄後，仍由你挑選補錄人選。`);
  return ok(`${student.name}已加入預備名單；補錄時須由你發出取錄通知。`);
}

export function rejectApplicant(s, id) {
  ensureAdmissionsState(s);
  if (s.ended) return fail('三年任期已結束。');
  const student = s.applicants.find(applicant => applicant.id === id);
  if (!student || !['pending', 'waitlisted'].includes(student.status)) return fail('只有待處理或預備名單的申請人可以作出不取錄決定。');
  transition(s, student, 'rejected', `校長決定不取錄${student.name}；本申請已結束。`);
  return ok(`已完成${student.name}的不取錄決定。`);
}

// Exactly match engine.syncScores after a new student joins the existing cohort.
function syncAcademicScores(s) {
  const total = s.cohorts.reduce((sum, cohort) => sum + cohort.count, 0);
  s.enrollment = total;
  const subjectScore = mean(s.subjects.map(subject => subject.score));
  const cohortScore = total ? s.cohorts.reduce((sum, cohort) => sum + cohort.score * cohort.count, 0) / total : subjectScore;
  s.academicScore = round(clamp(cohortScore * .72 + subjectScore * .28, 0, 100), 2);
  const senior = s.cohorts.find(cohort => cohort.grade === 6);
  s.dseScore = round(clamp((senior?.score ?? subjectScore) * .83 + subjectScore * .17 + finite(s.examReadiness), 0, 100), 2);
  s.compositeScore = round(s.academicScore * .6 + s.dseScore * .4, 2);
  s.score = s.compositeScore;
}

function declineReason(student) {
  const offer = student.offer;
  if (offer.effectiveTuition > offer.maxTuition) return '通知中的學費扣除資助後仍超出家庭預算，學生選擇不入讀。';
  if (offer.reasons.some(reason => reason.includes('參考成績較高'))) return '學生比較各校學業表現後，選擇追求更符合其成績期望的學校。';
  return '學生綜合學校排名、學業配合及學費安排後，選擇其他學位，沒有接受本校通知。';
}

/** Settle due responses only; never automatically promote waitlisted students. */
export function processOfferResponses(s) {
  ensureAdmissionsState(s);
  const week = currentWeek(s);
  let accepted = 0, declined = 0;
  const due = s.applicants.filter(student => student.status === 'offered' && student.offer.responseWeek <= week);
  if (due.length && s.lastAdmissionsResponse.week !== week) s.lastAdmissionsResponse = {week, accepted: [], declined: []};
  for (const student of due) {
    const cohort = s.cohorts.find(group => group.grade === student.grade);
    const acceptedOffer = student.offer.decisionDraw < student.offer.chance / 100;
    if (acceptedOffer && cohort && s.enrollment < s.capacity) {
      const count = cohort.count;
      cohort.ability = (cohort.ability * count + student.ability) / (count + 1);
      cohort.score = (cohort.score * count + student.ability) / (count + 1);
      cohort.count = count + 1;
      student.enrolled = true;
      student.enrolledWeek = week;
      student.offer.respondedWeek = week;
      syncAcademicScores(s);
      const reason = `${student.name}接受取錄通知，正式入讀中${student.grade}；現有${s.enrollment}名學生，由入讀後開始計入學費。`;
      transition(s, student, 'accepted', reason, student.offer.reasons);
      s.lastAdmissionsResponse.accepted.push({id: student.id, name: student.name, reason});
      accepted++;
    } else {
      student.offer.respondedWeek = week;
      const detail = acceptedOffer ? '本校未能提供原預留年級的有效學額，入讀安排未完成。' : declineReason(student);
      const reason = `${student.name}沒有入讀：${detail}已釋放預留學額；可由你從預備名單挑選補錄。`;
      transition(s, student, acceptedOffer ? 'withdrawn' : 'declined', reason, student.offer.reasons);
      s.lastAdmissionsResponse.declined.push({id: student.id, name: student.name, reason});
      declined++;
    }
  }
  return {accepted, declined};
}

/** Call at the academic-year boundary, before engine.js promotes the cohorts. */
export function closeAdmissionYear(s) {
  const responses = processOfferResponses(s);
  let withdrawn = 0;
  for (const student of s.applicants) {
    if (!['pending', 'waitlisted', 'offered'].includes(student.status)) continue;
    const wasOffered = student.status === 'offered';
    const reason = `${student.name}的本年度申請已截止，${wasOffered ? '尚未到回覆日期的取錄通知失效，預留學額已釋放' : '未完成入讀安排，申請已結束'}。新學年不會自動補錄。`;
    transition(s, student, 'withdrawn', reason, student.offer?.reasons || []);
    withdrawn++;
  }
  return {...responses, withdrawn};
}
