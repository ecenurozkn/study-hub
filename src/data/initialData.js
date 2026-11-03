// Habitz Pastel Tasarım Sistemi Renk Temaları ve Karakter Eşleşmeleri
export const COURSE_COLOR_THEMES = {
  blue: {
    id: 'blue',
    label: 'Bebek Mavisi (Bulut Maskot)',
    mascot: 'cloud',
    hex: '#93C5FD',
    dot: 'bg-[#93C5FD]',
    badge: 'bg-[#EFF6FF] text-sky-900 border-[#93C5FD]/60',
    border: 'border-purple-100/80 hover:border-[#93C5FD]',
    accentBar: 'bg-gradient-to-r from-[#93C5FD] to-sky-300',
    pillGradient: 'bg-gradient-to-r from-[#EFF6FF] via-white to-[#DBEAFE]/70',
    iconBg: 'bg-[#DBEAFE]/80',
    softBg: 'bg-[#EFF6FF]/80',
    text: 'text-sky-600',
    ring: 'focus:ring-[#93C5FD]',
  },
  emerald: {
    id: 'emerald',
    label: 'Nane Yeşili (Damla Maskot)',
    mascot: 'drop',
    hex: '#6EE7B7',
    dot: 'bg-[#6EE7B7]',
    badge: 'bg-[#ECFDF5] text-emerald-900 border-[#6EE7B7]/60',
    border: 'border-purple-100/80 hover:border-[#6EE7B7]',
    accentBar: 'bg-gradient-to-r from-[#6EE7B7] to-emerald-300',
    pillGradient: 'bg-gradient-to-r from-[#ECFDF5] via-white to-[#D1FAE5]/70',
    iconBg: 'bg-[#D1FAE5]/80',
    softBg: 'bg-[#ECFDF5]/80',
    text: 'text-emerald-600',
    ring: 'focus:ring-[#6EE7B7]',
  },
  violet: {
    id: 'violet',
    label: 'Tatlı Mor / Lila (Beşgen Maskot)',
    mascot: 'pentagon',
    hex: '#8B5CF6',
    dot: 'bg-[#8B5CF6]',
    badge: 'bg-[#F5F3FF] text-purple-900 border-[#C4B5FD]',
    border: 'border-purple-100/80 hover:border-[#8B5CF6]/60',
    accentBar: 'bg-gradient-to-r from-[#C4B5FD] to-[#8B5CF6]',
    pillGradient: 'bg-gradient-to-r from-[#F5F3FF] via-white to-[#EDE9FE]/80',
    iconBg: 'bg-[#EDE9FE]/90',
    softBg: 'bg-[#F5F3FF]/80',
    text: 'text-purple-600',
    ring: 'focus:ring-[#C4B5FD]',
  },
  rose: {
    id: 'rose',
    label: 'Pastel Mercan / Pembe (Alev Maskot)',
    mascot: 'flame',
    hex: '#FDA4AF',
    dot: 'bg-[#FDA4AF]',
    badge: 'bg-[#FFF1F2] text-rose-900 border-[#FDA4AF]/60',
    border: 'border-purple-100/80 hover:border-[#FDA4AF]',
    accentBar: 'bg-gradient-to-r from-[#FDA4AF] to-pink-300',
    pillGradient: 'bg-gradient-to-r from-[#FFF1F2] via-white to-[#FFE4E6]/75',
    iconBg: 'bg-[#FFE4E6]/85',
    softBg: 'bg-[#FFF1F2]/80',
    text: 'text-rose-500',
    ring: 'focus:ring-[#FDA4AF]',
  },
  amber: {
    id: 'amber',
    label: 'Günışığı Turuncusu (Yıldız Maskot)',
    mascot: 'star',
    hex: '#FDBA74',
    dot: 'bg-[#FDBA74]',
    badge: 'bg-[#FFF7ED] text-amber-900 border-[#FDBA74]/60',
    border: 'border-purple-100/80 hover:border-[#FDBA74]',
    accentBar: 'bg-gradient-to-r from-[#FDBA74] to-amber-300',
    pillGradient: 'bg-gradient-to-r from-[#FFF7ED] via-white to-[#FFEDD5]/75',
    iconBg: 'bg-[#FFEDD5]/85',
    softBg: 'bg-[#FFF7ED]/80',
    text: 'text-orange-500',
    ring: 'focus:ring-[#FDBA74]',
  },
};

// Dersler yalnızca iki türe ayrılır: Zorunlu ve Seçmeli
export const COURSE_TYPES = {
  mandatory: {
    id: 'mandatory',
    label: 'Zorunlu Ders',
    shortLabel: 'Zorunlu',
    badgeClass: 'border-purple-200 bg-purple-100/80 text-purple-800',
  },
  elective: {
    id: 'elective',
    label: 'Seçmeli Ders',
    shortLabel: 'Seçmeli',
    badgeClass: 'border-[#6EE7B7] bg-[#ECFDF5] text-emerald-800',
  },
};

// Haftalık Ders Programı Günleri
export const WEEK_DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
];

// Sınav Türleri
export const EXAM_TYPES = ['Vize', 'Final', 'Büt', 'Quiz'];

/**
 * Her yeni kullanıcı için tamamen boş ([]) ve temiz başlangıç durumu üretir.
 */
export function createEmptyUserData() {
  return {
    courses: [],
    exams: [],
  };
}

export const createInitialData = createEmptyUserData;
