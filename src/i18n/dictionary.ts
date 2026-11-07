export type Language = 'en' | 'hi'

const en = {
  'nav.dashboard': 'Dashboard',
  'nav.discover': 'Discover',
  'nav.saved': 'Saved',
  'nav.applications': 'Applications',
  'nav.documents': 'Documents',
  'nav.deadlines': 'Deadlines',
  'nav.profile': 'Profile',
  'nav.compare': 'Compare',
  'nav.more': 'More',
  'tagline': 'Find your fit. Follow through.',
  'landing.intro':
    'Vidyaan checks scholarships against your profile, explains every result in plain language, and helps you track each application to the end.',
  'landing.start': 'Check my eligibility',
  'landing.open': 'Open dashboard',
  'landing.demo': 'Try the demo (Priya)',
  'landing.privacy': 'No account needed. Everything stays in your browser.',
  'verdict.eligible': 'Eligible',
  'verdict.needs_info': 'Needs information',
  'verdict.not_eligible': 'Not eligible',
  'status.saved': 'Saved',
  'status.preparing': 'Preparing',
  'status.submitted': 'Submitted',
  'status.under_review': 'Under review',
  'status.approved': 'Approved',
  'status.disbursed': 'Disbursed',
  'status.not_selected': 'Not selected',
  'common.save': 'Save',
  'common.saved': 'Saved',
  'common.seeWhy': 'See why',
  'common.demoData': 'Demo data',
  'dash.welcome': 'Welcome',
  'dash.nextSteps': 'Your next steps',
  'dash.activity': 'Recent activity',
  'dash.best': 'Best matches for you',
  'discover.title': 'Discover',
  'discover.search': 'Search by name, provider or course…',
  'profile.language': 'Language',
  'profile.theme': 'Dark mode',
  'profile.reminders': 'Deadline reminders in this browser',
} as const

export type MessageKey = keyof typeof en

const hi: Record<MessageKey, string> = {
  'nav.dashboard': 'डैशबोर्ड',
  'nav.discover': 'खोजें',
  'nav.saved': 'सहेजे गए',
  'nav.applications': 'आवेदन',
  'nav.documents': 'दस्तावेज़',
  'nav.deadlines': 'अंतिम तिथियाँ',
  'nav.profile': 'प्रोफ़ाइल',
  'nav.compare': 'तुलना',
  'nav.more': 'और',
  'tagline': 'अपने लिए सही छात्रवृत्ति खोजें, और आवेदन पूरा करें।',
  'landing.intro':
    'विद्यान आपकी प्रोफ़ाइल के आधार पर छात्रवृत्तियों की पात्रता जाँचता है, हर नतीजे को सरल भाषा में समझाता है, और हर आवेदन को अंत तक ट्रैक करने में मदद करता है।',
  'landing.start': 'मेरी पात्रता जाँचें',
  'landing.open': 'डैशबोर्ड खोलें',
  'landing.demo': 'डेमो देखें (प्रिया)',
  'landing.privacy': 'खाते की ज़रूरत नहीं। सारा डेटा आपके ब्राउज़र में ही रहता है।',
  'verdict.eligible': 'पात्र',
  'verdict.needs_info': 'और जानकारी चाहिए',
  'verdict.not_eligible': 'पात्र नहीं',
  'status.saved': 'सहेजा गया',
  'status.preparing': 'तैयारी में',
  'status.submitted': 'जमा किया',
  'status.under_review': 'समीक्षा में',
  'status.approved': 'स्वीकृत',
  'status.disbursed': 'राशि मिली',
  'status.not_selected': 'चयन नहीं हुआ',
  'common.save': 'सहेजें',
  'common.saved': 'सहेजा गया',
  'common.seeWhy': 'कारण देखें',
  'common.demoData': 'डेमो डेटा',
  'dash.welcome': 'स्वागत है',
  'dash.nextSteps': 'आपके अगले कदम',
  'dash.activity': 'हाल की गतिविधि',
  'dash.best': 'आपके लिए सबसे उपयुक्त',
  'discover.title': 'खोजें',
  'discover.search': 'नाम, प्रदाता या कोर्स से खोजें',
  'profile.language': 'भाषा',
  'profile.theme': 'डार्क मोड',
  'profile.reminders': 'इस ब्राउज़र में अंतिम तिथि की याद दिलाएँ',
}

export const DICTIONARIES: Record<Language, Record<MessageKey, string>> = { en, hi }

/** Looks a message up, falling back to English so a missing translation never shows a raw key. */
export function translate(lang: Language, key: MessageKey): string {
  return DICTIONARIES[lang][key] ?? en[key]
}
