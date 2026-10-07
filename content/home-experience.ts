import copy from './homepage.json';

// Short labels and fictional records for the existing animated previews.
// Module summaries condense the supplied homepage copy for the interactive panel.
export const homeModules = [
  ...copy.sections[1].cards.map((card, i) => ({
    title: card.title,
    label: ['Admissions', 'Finance', 'Academics', 'Attendance & HR', 'Communication', 'Centralisation'][i],
    heading: ["Admissions & enrolment","Fees & accounting","Academics & exams","Attendance & payroll","Parent communication","Multi-branch control"][i],
    paragraphs: [["Capture enquiries, manage assessments and convert accepted applicants into student records without re-entering details.","Collect fees, track dues and expenses, and issue branded receipts. Support cash, UPI, cheque and bank-transfer payments.","Coordinate classes and exams, then publish report cards with marks, attendance and performance trends.","Sync supported biometric or RFID devices, track staff leave and manage payroll in one workspace.","Keep families informed with fee receipts, attendance alerts, report cards and school updates.","Manage campuses, student and staff directories, and bulk imports from one central workspace."][i]],
    features: [
      ['Enquiry tracking', 'WhatsApp follow-ups', 'Student conversion'],
      ['QR-verifiable receipts', 'Approved concessions', 'Ledgers and reports'],
      ['Timetables', 'Hall tickets', 'Six report-card templates'],
      ['Biometric / RFID', 'Leave workflows', 'Salary slips'],
      ['Official WhatsApp number', 'Fee status', 'Digital report cards'],
      ['Campus setup', 'Master data', 'Database backups'],
    ][i],
  })),
  { title: 'ID-card production', label: 'School identity', heading: 'School ID cards', paragraphs: ['Create student ID cards in batches with customisable templates and print-ready layouts.'], features: ['26 templates', 'Batch generation', 'Print-ready PDF grids'] },
  { title: 'Store and inventory', label: 'School supplies', heading: 'Store & inventory', paragraphs: ['Track school supplies, monitor stock levels and manage purchases for uniforms, books and other essentials.'], features: ['Uniforms and books', 'Low-stock alerts', 'Purchase orders'] },
  { title: 'School creatives and data', label: 'Everyday operations', heading: 'Creatives & data', paragraphs: ['Create branded school announcements and admission creatives. Import or export student, staff and lead records with Excel.'], features: ['Admission creatives', 'School announcements', 'Excel import and export'] },
];

export const homeRoles = copy.sections[4].rows.slice(1).map(([name, body], i) => ({
  id: ['leadership', 'administration', 'accounts', 'front-desk', 'hr', 'teachers-parents'][i],
  name, title: name, body, value: body,
  mode: [5, 2, 4, 0, 1, 3][i],
}));

export const attendanceSteps = [
  { title: 'Synchronise attendance', body: 'Bring in records from supported networked biometric or RFID devices.' },
  { title: 'Review attendance', body: 'Track late or irregular attendance and leave workflows.' },
  { title: 'Keep parents updated', body: 'Send attendance alerts through the school’s paired WhatsApp number.' },
];

export const automationExamples = [
  { prompt: 'Generate a weekly timetable using teacher availability and subject weightage.', output: 'Weekly timetable', detail: 'Class 6A · 35 periods · Teacher availability, sections and break intervals included.', note: 'Review teacher overlaps and available substitutes.', checks: ['Availability', 'Overlaps', 'Substitutes'] },
  { prompt: 'Prepare a Class 6 Science paper from the selected syllabus chapters.', output: 'Science question paper', detail: 'MCQs · Short answers · Long answers · Marks allocation · Branded PDF export.', note: 'Review chapter coverage and marks before exporting.', checks: ['Syllabus', 'Question formats', 'Marks'] },
  { prompt: 'Prepare this student photo for a school ID card.', output: 'ID-card photo', detail: 'On-device background removal · Clean white background · ID-card image formatting.', note: 'Check the prepared image before ID-card production.', checks: ['White background', 'Photo format', 'ID-card fit'] },
  { prompt: 'Show subject performance across terms for this student.', output: 'Student performance trends', detail: 'Multi-term subject charts and performance indicators alongside the report card.', note: 'Review progress beyond a single mark sheet.', checks: ['Subject trends', 'Term comparison', 'Progress'] },
];

export const homeViews = [
  {title:'From enquiry to student record',label:'Admissions',meta:'Front desk · Admissions CRM',stat:'12',statLabel:'Enquiries in pipeline',second:'04',secondLabel:'Counselling outcomes',columns:['Applicant','Tracking no.','Stage'],rows:[['Aarav S.','ENQ-001','Enquiry'],['Meera K.','ENQ-002','Counselling'],['Riya P.','ENQ-003','Accepted'],['Kabir A.','ENQ-004','Follow-up']],note:'One school record',body:'Capture enquiries, record assessments and convert accepted applicants without re-entering details.',status:'Student records connected'},
  {title:'Attendance, connected',label:'Attendance',meta:'Class 6A · Biometric / RFID',stat:'28 / 30',statLabel:'Students present',second:'02',secondLabel:'Attendance exceptions',columns:['Student','Class','Status'],rows:[['Aarav S.','6A','Present'],['Meera K.','6A','Present'],['Riya P.','6A','Present'],['Kabir A.','6A','Absent']],note:'Attendance, HR and payroll',body:'Supported device records connect attendance, leave and salary-slip workflows.',status:'Attendance ready for review'},
  {title:'Student report card',label:'Academics',meta:'Class 6A · Term 2 report card',stat:'06',statLabel:'Report-card templates',second:'03',secondLabel:'Terms in view',columns:['Subject','Term 1','Term 2'],rows:[['Mathematics','78 / 100','84 / 100'],['Science','81 / 100','87 / 100'],['English','76 / 100','82 / 100'],['Social studies','80 / 100','85 / 100']],note:'Progress across terms',body:'Review marks, attendance percentages, subject charts and performance trends.',status:'Academic records connected'},
  {title:'School updates for parents',label:'Communication',meta:'Official school WhatsApp number',stat:'Class 6A',statLabel:'Selected audience',second:'Today',secondLabel:'School updates',columns:['School update','Channel','Status'],rows:[['Fee receipt','WhatsApp','Prepared'],['Attendance alert','WhatsApp','Review'],['Digital report card','Parent view','Available'],['Event update','Parent view','Available']],note:'Parents stay informed',body:'Give families access to fee status, digital report cards and school events.',status:'Review audience and permissions'},
  {title:'Collections, dues and ledgers',label:'Finance',meta:'Accounts · Daily fee records',stat:'04',statLabel:'Payment methods',second:'05',secondLabel:'Fee reports',columns:['Fee record','Method','Status'],rows:[['Tuition fee','UPI','Recorded'],['Admission fee','Cash','Recorded'],['Transport fee','Cheque','Review'],['Term fee','Bank transfer','Recorded']],note:'QR-verifiable receipts',body:'Manage approved concessions, expenses, vendor ledgers and outstanding fees.',status:'Accounts ready for review'},
  {title:'One central workspace',label:'Centralisation',meta:'School group · Campus records',stat:'03',statLabel:'Sample campuses',second:'Excel',secondLabel:'Bulk record import',columns:['Institution record','Workspace','Status'],rows:[['Campus setup','Central team','Prepared'],['Student directory','All campuses','Review'],['Staff directory','All campuses','Review'],['Database backup','Institution','Available']],note:'Multi-branch control',body:'Centralise campus setup, master data, directories and institutional backups.',status:'School group records connected'},
  {"title":"Weekly timetable","label":"Timetable","meta":"Class 6A · Weekly planning","stat":"35","statLabel":"Weekly periods","second":"01","secondLabel":"Teacher overlap to review","columns":["Period","Subject","Teacher"],"rows":[["Mon · 09:00","Mathematics","Ms Rao"],["Mon · 10:00","Science","Mr Shah"],["Mon · 11:30","English","Ms Sen"],["Tue · 09:00","Mathematics","Ms Rao"]],"note":"Conflict-aware planning","body":"Use teacher availability, sections, breaks and subject weightage. Review overlaps and available substitutes.","status":"Illustrative timetable for review"},
];
