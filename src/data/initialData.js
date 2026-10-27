// Göz yormayan Aydınlık Pastel Renk Temaları (Mine Yeşili, Açık Pembe, Bebek Mavisi, Lila)
export const COURSE_COLOR_THEMES = {
  blue: {
    id: 'blue',
    label: 'Bebek Mavisi (Matematik / Analiz)',
    dot: 'bg-sky-400',
    badge: 'bg-sky-100/85 text-sky-800 border-sky-200/90',
    border: 'border-slate-200/80 hover:border-sky-300/90',
    accentBar: 'bg-gradient-to-r from-sky-300 to-blue-300',
    softBg: 'bg-sky-50/70',
    text: 'text-sky-600',
    ring: 'focus:ring-sky-300',
  },
  emerald: {
    id: 'emerald',
    label: 'Mine Yeşili (Fizik / Fen Bilimleri)',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-100/85 text-emerald-800 border-emerald-200/90',
    border: 'border-slate-200/80 hover:border-emerald-300/90',
    accentBar: 'bg-gradient-to-r from-emerald-300 to-teal-300',
    softBg: 'bg-emerald-50/70',
    text: 'text-emerald-600',
    ring: 'focus:ring-emerald-300',
  },
  violet: {
    id: 'violet',
    label: 'Lila / Lavanta (Bilgisayar / Yazılım)',
    dot: 'bg-violet-400',
    badge: 'bg-violet-100/85 text-violet-800 border-violet-200/90',
    border: 'border-slate-200/80 hover:border-violet-300/90',
    accentBar: 'bg-gradient-to-r from-violet-300 to-purple-300',
    softBg: 'bg-violet-50/70',
    text: 'text-violet-600',
    ring: 'focus:ring-violet-300',
  },
  rose: {
    id: 'rose',
    label: 'Açık Pembe (Zorunlu / Kritik Dersler)',
    dot: 'bg-rose-400',
    badge: 'bg-rose-100/85 text-rose-800 border-rose-200/90',
    border: 'border-slate-200/80 hover:border-rose-300/90',
    accentBar: 'bg-gradient-to-r from-rose-300 to-pink-300',
    softBg: 'bg-rose-50/70',
    text: 'text-rose-600',
    ring: 'focus:ring-rose-300',
  },
  amber: {
    id: 'amber',
    label: 'Pastel Şeftali (Elektronik / Donanım)',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100/85 text-amber-800 border-amber-200/90',
    border: 'border-slate-200/80 hover:border-amber-300/90',
    accentBar: 'bg-gradient-to-r from-amber-300 to-orange-200',
    softBg: 'bg-amber-50/70',
    text: 'text-amber-600',
    ring: 'focus:ring-amber-300',
  },
  cyan: {
    id: 'cyan',
    label: 'Su Yeşili / Buz Mavisi (Veri / İstatistik)',
    dot: 'bg-teal-400',
    badge: 'bg-teal-100/85 text-teal-800 border-teal-200/90',
    border: 'border-slate-200/80 hover:border-teal-300/90',
    accentBar: 'bg-gradient-to-r from-teal-300 to-sky-300',
    softBg: 'bg-teal-50/70',
    text: 'text-teal-600',
    ring: 'focus:ring-teal-300',
  },
};

/**
 * Her yeni kullanıcı için tamamen boş ([]) ve temiz başlangıç durumu üretir.
 * Hiçbir yapay/örnek (mock) veri otomatik yüklenmez.
 */
export function createEmptyUserData(userEmail = '') {
  return {
    courses: [],
    assignments: [],
    topics: [],
    exams: [],
    knowledgeCards: [],
    graduation: {
      goals: {
        totalEctsRequired: 240,
        mandatoryCoursesRequired: 32,
        electiveCoursesRequired: 10,
        minGpaRequired: 2.0,
      },
      transcriptCourses: [],
    },
    notificationSettings: {
      emailAddress: userEmail || '',
      autoEmailUnder24h: true,
    },
    notificationHistory: [],
  };
}

// Geriye dönük uyumluluk için alias
export const createInitialData = createEmptyUserData;
