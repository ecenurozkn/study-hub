// Göz yormayan Pastel Renk Temaları (Hem Aydınlık hem Karanlık Mod uyumlu)
export const COURSE_COLOR_THEMES = {
  blue: {
    id: 'blue',
    label: 'Bebek Mavisi (Matematik / Analiz)',
    dot: 'bg-sky-400 dark:bg-sky-300',
    badge:
      'bg-sky-100/80 text-sky-800 border-sky-200/90 dark:bg-sky-400/15 dark:text-sky-200 dark:border-sky-400/30',
    border:
      'border-slate-200/80 hover:border-sky-300/90 dark:border-slate-700/70 dark:hover:border-sky-400/40',
    accentBar:
      'bg-gradient-to-r from-sky-300 to-blue-300 dark:from-sky-400/80 dark:to-blue-400/80',
    softBg: 'bg-sky-50/70 dark:bg-sky-400/10',
    text: 'text-sky-600 dark:text-sky-300',
    ring: 'focus:ring-sky-300 dark:focus:ring-sky-400',
  },
  emerald: {
    id: 'emerald',
    label: 'Mine Yeşili (Fizik / Fen Bilimleri)',
    dot: 'bg-emerald-400 dark:bg-emerald-300',
    badge:
      'bg-emerald-100/80 text-emerald-800 border-emerald-200/90 dark:bg-emerald-400/15 dark:text-emerald-200 dark:border-emerald-400/30',
    border:
      'border-slate-200/80 hover:border-emerald-300/90 dark:border-slate-700/70 dark:hover:border-emerald-400/40',
    accentBar:
      'bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-400/80 dark:to-teal-400/80',
    softBg: 'bg-emerald-50/70 dark:bg-emerald-400/10',
    text: 'text-emerald-600 dark:text-emerald-300',
    ring: 'focus:ring-emerald-300 dark:focus:ring-emerald-400',
  },
  violet: {
    id: 'violet',
    label: 'Lila / Lavanta (Bilgisayar / Yazılım)',
    dot: 'bg-violet-400 dark:bg-violet-300',
    badge:
      'bg-violet-100/80 text-violet-800 border-violet-200/90 dark:bg-violet-400/15 dark:text-violet-200 dark:border-violet-400/30',
    border:
      'border-slate-200/80 hover:border-violet-300/90 dark:border-slate-700/70 dark:hover:border-violet-400/40',
    accentBar:
      'bg-gradient-to-r from-violet-300 to-purple-300 dark:from-violet-400/80 dark:to-purple-400/80',
    softBg: 'bg-violet-50/70 dark:bg-violet-400/10',
    text: 'text-violet-600 dark:text-violet-300',
    ring: 'focus:ring-violet-300 dark:focus:ring-violet-400',
  },
  rose: {
    id: 'rose',
    label: 'Açık Pembe (Zorunlu / Kritik Dersler)',
    dot: 'bg-rose-400 dark:bg-rose-300',
    badge:
      'bg-rose-100/80 text-rose-800 border-rose-200/90 dark:bg-rose-400/15 dark:text-rose-200 dark:border-rose-400/30',
    border:
      'border-slate-200/80 hover:border-rose-300/90 dark:border-slate-700/70 dark:hover:border-rose-400/40',
    accentBar:
      'bg-gradient-to-r from-rose-300 to-pink-300 dark:from-rose-400/80 dark:to-pink-400/80',
    softBg: 'bg-rose-50/70 dark:bg-rose-400/10',
    text: 'text-rose-600 dark:text-rose-300',
    ring: 'focus:ring-rose-300 dark:focus:ring-rose-400',
  },
  amber: {
    id: 'amber',
    label: 'Pastel Şeftali (Elektronik / Donanım)',
    dot: 'bg-amber-400 dark:bg-amber-300',
    badge:
      'bg-amber-100/80 text-amber-800 border-amber-200/90 dark:bg-amber-400/15 dark:text-amber-200 dark:border-amber-400/30',
    border:
      'border-slate-200/80 hover:border-amber-300/90 dark:border-slate-700/70 dark:hover:border-amber-400/40',
    accentBar:
      'bg-gradient-to-r from-amber-300 to-orange-200 dark:from-amber-400/80 dark:to-orange-300/80',
    softBg: 'bg-amber-50/70 dark:bg-amber-400/10',
    text: 'text-amber-600 dark:text-amber-300',
    ring: 'focus:ring-amber-300 dark:focus:ring-amber-400',
  },
  cyan: {
    id: 'cyan',
    label: 'Su Yeşili / Buz Mavisi (Veri / İstatistik)',
    dot: 'bg-teal-400 dark:bg-teal-300',
    badge:
      'bg-teal-100/80 text-teal-800 border-teal-200/90 dark:bg-teal-400/15 dark:text-teal-200 dark:border-teal-400/30',
    border:
      'border-slate-200/80 hover:border-teal-300/90 dark:border-slate-700/70 dark:hover:border-teal-400/40',
    accentBar:
      'bg-gradient-to-r from-teal-300 to-sky-300 dark:from-teal-400/80 dark:to-sky-400/80',
    softBg: 'bg-teal-50/70 dark:bg-teal-400/10',
    text: 'text-teal-600 dark:text-teal-300',
    ring: 'focus:ring-teal-300 dark:focus:ring-teal-400',
  },
};

export function createSampleTranscriptCourses() {
  return [
    { id: 'tr-1', code: 'MAT101', name: 'Kalkülüs I', credits: 6, grade: 'AA', category: 'mandatory', semester: '1. Yarıyıl' },
    { id: 'tr-2', code: 'FİZ100', name: 'Genel Fizik ve Laboratuvarı', credits: 6, grade: 'BA', category: 'mandatory', semester: '1. Yarıyıl' },
    { id: 'tr-3', code: 'BLM101', name: 'Algoritma ve Programlamaya Giriş', credits: 6, grade: 'AA', category: 'mandatory', semester: '1. Yarıyıl' },
    { id: 'tr-4', code: 'MAT110', name: 'Lineer Cebir', credits: 5, grade: 'BB', category: 'mandatory', semester: '1. Yarıyıl' },
    { id: 'tr-5', code: 'TUR101', name: 'Türk Dili I', credits: 2, grade: 'AA', category: 'mandatory', semester: '1. Yarıyıl' },
    { id: 'tr-6', code: 'İNG101', name: 'Akademik İngilizce I', credits: 5, grade: 'BA', category: 'mandatory', semester: '1. Yarıyıl' },

    { id: 'tr-7', code: 'BLM102', name: 'Nesne Yönelimli Programlama (OOP)', credits: 6, grade: 'AA', category: 'mandatory', semester: '2. Yarıyıl' },
    { id: 'tr-8', code: 'MAT201', name: 'Diferansiyel Denklemler', credits: 5, grade: 'BB', category: 'mandatory', semester: '2. Yarıyıl' },
    { id: 'tr-9', code: 'BLM104', name: 'Ayrık Matematik', credits: 6, grade: 'BA', category: 'mandatory', semester: '2. Yarıyıl' },
    { id: 'tr-10', code: 'İST202', name: 'Olasılık ve İstatistik', credits: 5, grade: 'CB', category: 'mandatory', semester: '2. Yarıyıl' },
    { id: 'tr-11', code: 'SOS105', name: 'Teknoloji Felsefesi ve Etik', credits: 4, grade: 'AA', category: 'elective', semester: '2. Yarıyıl' },
    { id: 'tr-12', code: 'İNG102', name: 'Akademik İngilizce II', credits: 4, grade: 'BB', category: 'mandatory', semester: '2. Yarıyıl' },

    { id: 'tr-13', code: 'BLM203', name: 'Bilgisayar Organizasyonu ve Mimarisi', credits: 6, grade: 'BA', category: 'mandatory', semester: '3. Yarıyıl' },
    { id: 'tr-14', code: 'BLM205', name: 'Veritabanı Yönetim Sistemleri', credits: 6, grade: 'AA', category: 'mandatory', semester: '3. Yarıyıl' },
    { id: 'tr-15', code: 'BLM207', name: 'İşletim Sistemleri', credits: 6, grade: 'BB', category: 'mandatory', semester: '3. Yarıyıl' },
    { id: 'tr-16', code: 'MAT215', name: 'Sayısal Yöntemler (Nümerik Analiz)', credits: 5, grade: 'CC', category: 'mandatory', semester: '3. Yarıyıl' },
    { id: 'tr-17', code: 'SEC210', name: 'Kullanıcı Deneyimi (UI/UX) Tasarımı', credits: 5, grade: 'AA', category: 'elective', semester: '3. Yarıyıl' },
    { id: 'tr-18', code: 'SEC214', name: 'Girişimcilik ve İnovasyon Yönetimi', credits: 4, grade: 'BA', category: 'elective', semester: '3. Yarıyıl' },

    { id: 'tr-19', code: 'BLM208', name: 'Yazılım Mühendisliği İlkeleri', credits: 6, grade: 'AA', category: 'mandatory', semester: '4. Yarıyıl' },
    { id: 'tr-20', code: 'BLM210', name: 'Bilgisayar Ağları ve İnternet Protokolleri', credits: 6, grade: 'CB', category: 'mandatory', semester: '4. Yarıyıl' },
    { id: 'tr-21', code: 'BLM212', name: 'Biçimsel Diller ve Otomata Teorisi', credits: 6, grade: 'DC', category: 'mandatory', semester: '4. Yarıyıl' },
    { id: 'tr-22', code: 'SEC240', name: 'Veri Bilimine Giriş ve Python', credits: 6, grade: 'AA', category: 'elective', semester: '4. Yarıyıl' },
    { id: 'tr-23', code: 'SEC245', name: 'Bulut Bilişim Mimarileri', credits: 5, grade: 'BA', category: 'elective', semester: '4. Yarıyıl' },
    { id: 'tr-24', code: 'ATA101', name: 'Atatürk İlkeleri ve İnkılap Tarihi', credits: 4, grade: 'AA', category: 'mandatory', semester: '4. Yarıyıl' },
    { id: 'tr-25', code: 'SEC290', name: 'Siber Güvenlik Temelleri', credits: 5, grade: 'BB', category: 'elective', semester: '4. Yarıyıl' },
    { id: 'tr-26', code: 'ELK109', name: 'Devre Teorisi (Tekrar Alınacak)', credits: 5, grade: 'FF', category: 'mandatory', semester: '3. Yarıyıl' },
  ];
}

export function createDefaultKnowledgeCards() {
  return [
    {
      id: 'kw-1',
      courseId: 'course-mat102',
      examId: 'exm-1',
      topicId: 'top-1',
      category: 'Formül & Vektör',
      symbol: '∇f · u',
      title: 'Gradyan ve Yönlü Türev Formülü',
      formula: 'D_u f(P) = ∇f(P) · u = |∇f| cos(θ)',
      summary: 'Bir fonksiyonun en hızlı artış yönü ∇f yönüdür ve maksimum değişim oranı |∇f| büyüklüğüne eşittir.',
      palette: 'sky',
    },
    {
      id: 'kw-2',
      courseId: 'course-mat102',
      examId: 'exm-1',
      topicId: 'top-3',
      category: 'Koordinat Dönüşümü',
      symbol: 'ρ² sinφ',
      title: 'Küresel Koordinatlarda Jacobian',
      formula: 'dV = ρ² sin(φ) dρ dφ dθ',
      summary: 'x = ρ sinφ cosθ, y = ρ sinφ sinθ, z = ρ cosφ dönüşümünde hacim elemanı çarpanı.',
      palette: 'lilac',
    },
    {
      id: 'kw-3',
      courseId: 'course-blm201',
      examId: 'exm-2',
      topicId: 'top-4',
      category: 'Algoritma Analizi',
      symbol: 'log_b(a)',
      title: 'Master Teoremi Kritik Üs Bağıntısı',
      formula: 'T(n) = a T(n/b) + f(n)  ⇒  c_krit = log_b(a)',
      summary: 'f(n) ile n^(log_b a) karşılaştırılır; eşit mertebede ise T(n) = Θ(n^c_crit · log n) olur.',
      palette: 'mint',
    },
    {
      id: 'kw-4',
      courseId: 'course-blm201',
      examId: 'exm-2',
      topicId: 'top-5',
      category: 'Ağaç Dengesi',
      symbol: 'BF ∈ {-1,0,1}',
      title: 'AVL Ağacı Denge Faktörü & Rotasyon',
      formula: 'BF(node) = height(sol) - height(sağ)',
      summary: 'BF = +2 ve sol çocuk BF = -1 ise LR (Önce Sol-Sola, sonra Kök-Sağa) çift döndürme uygulanır.',
      palette: 'blush',
    },
    {
      id: 'kw-5',
      courseId: 'course-fiz101',
      examId: 'exm-3',
      topicId: 'top-7',
      category: 'Dönme Dinamiği',
      symbol: 'I_cm + Md²',
      title: 'Paralel Eksen (Steiner) Teoremi',
      formula: 'I = I_cm + M · d²   |   K_top = ½Mv² + ½Iω²',
      summary: 'Kütle merkezinden d kadar uzaktaki paralel bir eksene göre eylemsizlik momenti hesabı.',
      palette: 'mint',
    },
    {
      id: 'kw-6',
      courseId: 'course-elk204',
      examId: 'exm-4',
      topicId: 'top-9',
      category: 'Ardışıl Devreler',
      symbol: 'Q(t+1)',
      title: 'JK ve D Flip-Flop Karakteristik Denklemleri',
      formula: 'D-FF: Q(t+1) = D   |   JK-FF: Q(t+1) = J·Q\' + K\'·Q',
      summary: 'J=1, K=1 durumunda JK Flip-Flop bir önceki durumu tersler (Toggle: Q\'(t)).',
      palette: 'lilac',
    },
  ];
}

// Dinamik başlangıç verisi üretici (her zaman güncel tarihe göre anlamlı kalan süreler üretir)
export function createInitialData() {
  const now = new Date();
  const addHours = (h) => {
    const d = new Date(now.getTime() + h * 3600 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return {
    courses: [
      {
        id: 'course-mat102',
        code: 'MAT102',
        name: 'Kalkülüs II (Çok Değişkenli Analiz)',
        instructor: 'Prof. Dr. Kerem Aydın',
        credits: 6,
        schedule: 'Pazartesi 09:30 - 12:20 • Çarşamba 13:30 - 15:20',
        room: 'Fen-Edebiyat B-204',
        color: 'blue',
        targetGradeOverride: '',
        assessments: [
          { id: 'asm-mat-1', name: 'Ara Sınav (Vize)', weight: 30, score: 84 },
          { id: 'asm-mat-2', name: 'WebWork Ödev Seti 1', weight: 15, score: 92 },
          { id: 'asm-mat-3', name: 'WebWork Ödev Seti 2', weight: 15, score: 88 },
          { id: 'asm-mat-4', name: 'Final Sınavı (Beklenen)', weight: 40, score: 86 },
        ],
        links: [
          { id: 'lnk-1', title: 'Haftalık Ders Slaytları (PDF)', url: 'https://drive.google.com/drive/folders/mat102-slides', type: 'slides' },
          { id: 'lnk-2', title: 'Google Drive Çıkmış Sorular', url: 'https://drive.google.com/drive/folders/mat102-exams', type: 'drive' },
          { id: 'lnk-3', title: 'MIT OpenCourseWare 18.02 Portalı', url: 'https://ocw.mit.edu/courses/18-02-multivariable-calculus-fall-2007/', type: 'portal' },
        ],
      },
      {
        id: 'course-fiz101',
        code: 'FİZ101',
        name: 'Fizik I: Mekanik ve Termodinamik',
        instructor: 'Doç. Dr. Selin Karaca',
        credits: 5,
        schedule: 'Salı 10:30 - 13:20 • Perşembe 14:30 - 16:20 (Lab)',
        room: 'Mühendislik Amfi-1',
        color: 'emerald',
        targetGradeOverride: '',
        assessments: [
          { id: 'asm-fiz-1', name: 'Vize Sınavı', weight: 30, score: 78 },
          { id: 'asm-fiz-2', name: 'Laboratuvar Deney Raporları', weight: 20, score: 90 },
          { id: 'asm-fiz-3', name: 'Kısa Sınavlar (Quiz)', weight: 10, score: 85 },
          { id: 'asm-fiz-4', name: 'Final Sınavı (Beklenen)', weight: 40, score: 80 },
        ],
        links: [
          { id: 'lnk-4', title: 'FİZ101 Laboratuvar Föyleri', url: 'https://drive.google.com/drive/folders/fiz101-lab', type: 'drive' },
          { id: 'lnk-5', title: 'Serway Fizik Ders Sunumları', url: 'https://canvas.university.edu.tr/courses/fiz101', type: 'slides' },
        ],
      },
      {
        id: 'course-blm201',
        code: 'BLM201',
        name: 'Veri Yapıları ve Algoritmalar',
        instructor: 'Dr. Öğr. Üyesi Emre Demir',
        credits: 6,
        schedule: 'Çarşamba 09:30 - 12:20 • Cuma 10:30 - 12:20 (Uygulama)',
        room: 'Bilgisayar Müh. D-102',
        color: 'violet',
        targetGradeOverride: '',
        assessments: [
          { id: 'asm-blm-1', name: 'Ara Sınav (Vize)', weight: 30, score: 91 },
          { id: 'asm-blm-2', name: 'Kodlama Ödevi 1 (BST/AVL)', weight: 15, score: 95 },
          { id: 'asm-blm-3', name: 'Kodlama Ödevi 2 (Graph/Heap)', weight: 15, score: 90 },
          { id: 'asm-blm-4', name: 'Final Sınavı (Beklenen)', weight: 40, score: 90 },
        ],
        links: [
          { id: 'lnk-6', title: 'GitHub Ders Kod Deposu', url: 'https://github.com/uni-cs/blm201-data-structures', type: 'portal' },
          { id: 'lnk-7', title: 'Algoritma Görselleştirme Slaytları', url: 'https://visualgo.net/en', type: 'slides' },
          { id: 'lnk-8', title: 'Proje Şablonları (Google Drive)', url: 'https://drive.google.com/drive/folders/blm201-templates', type: 'drive' },
        ],
      },
      {
        id: 'course-elk204',
        code: 'ELK204',
        name: 'Sayısal Tasarım ve Mantık Devreleri',
        instructor: 'Prof. Dr. Hakan Özkan',
        credits: 4,
        schedule: 'Perşembe 09:30 - 12:20',
        room: 'Elektrik-Elektronik Lab-3',
        color: 'rose',
        targetGradeOverride: '',
        assessments: [
          { id: 'asm-elk-1', name: 'Vize Sınavı', weight: 35, score: 74 },
          { id: 'asm-elk-2', name: 'Verilog ALU Projesi', weight: 25, score: 88 },
          { id: 'asm-elk-3', name: 'Final Sınavı (Beklenen)', weight: 40, score: 78 },
        ],
        links: [
          { id: 'lnk-9', title: 'Verilog Simülasyon Kılavuzu', url: 'https://hdlbits.01xz.net/', type: 'portal' },
          { id: 'lnk-10', title: 'Karnaugh Haritası Ders Notları', url: 'https://drive.google.com/drive/folders/elk204-notes', type: 'slides' },
        ],
      },
    ],
    assignments: [
      {
        id: 'asg-1',
        courseId: 'course-blm201',
        title: 'AVL Ağacı ve Red-Black Tree Performans Analizi Ödevi',
        description: '100.000 elemanlı veri kümesinde ekleme, silme ve arama karmaşıklıklarını C++/Python ile ölçüp grafiksel rapor hazırlayın.',
        dueDate: addHours(16), // 24 saatten az kaldı! (Acil Bildirim & E-posta tetikleyici)
        priority: 'high',
        status: 'in_progress',
      },
      {
        id: 'asg-2',
        courseId: 'course-mat102',
        title: 'WebWork Problem Seti #4 (Çok Katlı İntegraller & Jacobian)',
        description: 'Kutupsal, silindirik ve küresel koordinatlarda hacim integrali sorularının çevrimiçi sistem üzerinden çözümü.',
        dueDate: addHours(42),
        priority: 'high',
        status: 'todo',
      },
      {
        id: 'asg-3',
        courseId: 'course-fiz101',
        title: 'Deney 3 Raporu: Eğik Atış ve Enerjinin Korunumu',
        description: 'Laboratuvar hata analizi hesaplamaları, hız-zaman grafikleri ve sonuç tartışması PDF formatında yüklenecek.',
        dueDate: addHours(110),
        priority: 'medium',
        status: 'todo',
      },
      {
        id: 'asg-4',
        courseId: 'course-elk204',
        title: '4-Bit ALU (Aritmetik Mantık Birimi) Verilog Tasarımı',
        description: 'Testbench simülasyon çıktıları ve FPGA pin atama tablosu ile birlikte teslim edilecektir.',
        dueDate: addHours(160),
        priority: 'medium',
        status: 'done',
      },
    ],
    topics: [
      {
        id: 'top-1',
        courseId: 'course-mat102',
        unit: 'Ünite 1',
        title: 'Kısmi Türevler, Gradyan Vektörü ve Yönlü Türev',
        notes: 'Teğet düzlem denklemi ve yerel ekstremum (Hessian matrisi) soru tipleri çözüldü.',
        status: 'studied',
        inExamScope: true,
      },
      {
        id: 'top-2',
        courseId: 'course-mat102',
        unit: 'Ünite 2',
        title: 'Lagrange Çarpanları ile Kısıtlı Optimizasyon',
        notes: 'İki kısıtlı (g(x,y,z)=0 ve h(x,y,z)=0) sistemlerde sınır değer kontrolü tekrar edilmeli.',
        status: 'review',
        inExamScope: true,
      },
      {
        id: 'top-3',
        courseId: 'course-mat102',
        unit: 'Ünite 3',
        title: 'Üç Katlı İntegrallerde Jacobian ve Küresel Koordinat Dönüşümü',
        notes: 'İntegral sınırlarının (ρ, φ, θ) çizimden çıkarılması ve Jacobian determinantı eksik.',
        status: 'missing',
        inExamScope: true,
      },
      {
        id: 'top-4',
        courseId: 'course-blm201',
        unit: 'Hafta 1-3',
        title: 'Asimptotik Analiz (Big-O, Omega, Theta) ve Rekürans Bağıntıları',
        notes: 'Master Teoremi 3 durumunun tamamı çalışıldı.',
        status: 'studied',
        inExamScope: true,
      },
      {
        id: 'top-5',
        courseId: 'course-blm201',
        unit: 'Hafta 4-5',
        title: 'AVL Ağaçlarında Çift Döndürme (LR ve RL Rotasyonları)',
        notes: 'Silme işlemi sonrası yükseklik güncelleme ve yeniden dengeleme adımları karıştırılıyor.',
        status: 'missing',
        inExamScope: true,
      },
      {
        id: 'top-6',
        courseId: 'course-blm201',
        unit: 'Hafta 6',
        title: 'Binary Heap, Öncelik Kuyrukları (Priority Queue) ve HeapSort',
        notes: 'Build-Heap O(n) ispatı tekrar gözden geçirilecek.',
        status: 'review',
        inExamScope: true,
      },
      {
        id: 'top-7',
        courseId: 'course-fiz101',
        unit: 'Bölüm 4',
        title: 'Katı Cisimlerin Dönme Dinamiği ve Eylemsizlik Momenti',
        notes: 'Paralel eksen teoremi (Steiner) ve yuvarlanma hareketinde sürtünme kuvveti yönü anlaşılmadı.',
        status: 'missing',
        inExamScope: true,
      },
      {
        id: 'top-8',
        courseId: 'course-fiz101',
        unit: 'Bölüm 5',
        title: 'Açısal Momentumun Korunumu ve Jiroskopik Hareket',
        notes: 'Çarpışma problemlerinde çizgisel + açısal momentum dönüşümü tekrar edilecek.',
        status: 'review',
        inExamScope: true,
      },
      {
        id: 'top-9',
        courseId: 'course-elk204',
        unit: 'Modül 3',
        title: 'Senkron Ardışıl Devreler: JK, D, T Flip-Flop Durum Tabloları',
        notes: 'Mealy ve Moore durum makineleri (FSM) geçiş diyagramları çalışıldı.',
        status: 'studied',
        inExamScope: true,
      },
    ],
    exams: [
      {
        id: 'exm-1',
        courseId: 'course-mat102',
        examType: 'Ara Sınav (Vize)',
        examDate: addHours(19), // 24 saatten az kaldı! (Açık Pembe yanıp sönen acil rozet)
        location: 'Merkezi Derslikler Amfi-A1 & A2',
        weight: 30,
        scopeTopics: [
          'Çok değişkenli fonksiyonlarda limit ve süreklilik',
          'Kısmi türevler, Zincir kuralı ve Yönlü türev (Gradyan)',
          'Teğet düzlem, Doğrusallaştırma ve Hessian ile Ekstremum testi',
          'Lagrange çarpanları yöntemi',
          'İki ve üç katlı integraller, Kutupsal/Silindirik/Küresel koordinatlar (Jacobian)',
        ],
        cheatsheetAllowed: true,
        cheatsheetRules: '1 Sayfa Tek Yüz A4 (El Yazısı Zorunlu, Fotokopi Yasak)',
        calculatorRule: 'Yasak',
        cheatsheetContent: `# MAT102 Vize Formül Kağıdı (A4 Tek Yüz)

## 1. Gradyan ve Yönlü Türev
- **Gradyan Vektörü:** ∇f(x,y,z) = <fx, fy, fz>
- **Birim Vektör u Yönünde Türev:** D_u f = ∇f(P) · u = |∇f| cos(θ)
- En hızlı artış yönü: **∇f yönü**, maksimum artış hızı: **|∇f|**

## 2. İkinci Türev (Hessian) Testi
- D(a,b) = f_xx(a,b) · f_yy(a,b) - [f_xy(a,b)]²
  1. D > 0 ve f_xx > 0  ⇒  **Yerel Minimum**
  2. D > 0 ve f_xx < 0  ⇒  **Yerel Maksimum**
  3. D < 0              ⇒  **Eyer Noktası (Saddle Point)**

## 3. Lagrange Çarpanları
- Tek kısıt: **∇f(x,y,z) = λ ∇g(x,y,z)** ve g(x,y,z) = k
- İki kısıt: **∇f = λ ∇g + μ ∇h**

## 4. Koordinat Dönüşümleri ve Jacobian
- **Kutupsal:** x = r cosθ, y = r sinθ  ⇒  **dA = r dr dθ**
- **Silindirik:** x = r cosθ, y = r sinθ, z = z  ⇒  **dV = r dz dr dθ**
- **Küresel:**
  - x = ρ sinφ cosθ, y = ρ sinφ sinθ, z = ρ cosφ
  - **dV = ρ² sinφ dρ dφ dθ**  (φ ∈ [0, π], θ ∈ [0, 2π])`,
      },
      {
        id: 'exm-2',
        courseId: 'course-blm201',
        examType: 'Ara Sınav (Vize)',
        examDate: addHours(92),
        location: 'Bilgisayar Müh. B-Blok D101-D104',
        weight: 30,
        scopeTopics: [
          'Asimptotik Notasyonlar (O, Ω, Θ) ve Rekürans Çözümleri (Master Teoremi)',
          'Bağlı Listeler (Tek/Çift Yönlü, Dairesel) & Stack / Queue Uygulamaları',
          'İkili Arama Ağaçları (BST) ve AVL Dengeli Ağaç Rotasyonları',
          'Binary Heap, Priority Queue ve HeapSort Algoritması',
        ],
        cheatsheetAllowed: false,
        cheatsheetRules: 'Kapalı Kitap / Kapalı Not (Cheatsheet İzni Yok)',
        calculatorRule: 'Yasak',
        cheatsheetContent: `# BLM201 Hafızada Tutulacak Kritik Özet Notlar

## 1. Master Teoremi: T(n) = a T(n/b) + f(n)
- Kritik üs: **c_crit = log_b(a)**
- Durum 1: f(n) = O(n^(c_crit - ε)) ⇒ **T(n) = Θ(n^c_crit)**
- Durum 2: f(n) = Θ(n^c_crit · log^k n) ⇒ **T(n) = Θ(n^c_crit · log^(k+1) n)**
- Durum 3: f(n) = Ω(n^(c_crit + ε)) ⇒ **T(n) = Θ(f(n))**

## 2. AVL Ağacı Denge Faktörü (Balance Factor)
- **BF(node) = height(left) - height(right)** ∈ {-1, 0, +1}
- BF = +2 ve Sol çocuğun BF >= 0 ⇒ **LL (Tek Sağa Döndürme - Right Rotate)**
- BF = +2 ve Sol çocuğun BF = -1 ⇒ **LR (Önce Sol Çocuğu Sola, Sonra Kökü Sağa)**
- BF = -2 ve Sağ çocuğun BF <= 0 ⇒ **RR (Tek Sola Döndürme - Left Rotate)**
- BF = -2 ve Sağ çocuğun BF = +1 ⇒ **RL (Önce Sağ Çocuğu Sağa, Sonra Kökü Sola)**

## 3. Dizi Tabanlı Binary Heap İndeksleri (0-indexed)
- Parent(i) = ⌊(i - 1) / 2⌋
- Left(i)   = 2i + 1
- Right(i)  = 2i + 2`,
      },
      {
        id: 'exm-3',
        courseId: 'course-fiz101',
        examType: 'Ara Sınav (Vize)',
        examDate: addHours(168),
        location: 'Mühendislik Fakültesi Büyük Amfi',
        weight: 30,
        scopeTopics: [
          'Kinematik (1B ve 2B Hareket, Eğik Atış, Bağıl Hız)',
          'Newton Hareket Yasaları ve Sürtünmeli Sistemler',
          'İş-Güç-Enerji Teoremi ve Korunumlu Kuvvetler',
          'Çizgisel Momentum, İtme ve 2 Boyutlu Çarpışmalar',
          'Katı Cisimlerin Dönme Hareketi, Tork ve Eylemsizlik Momenti',
        ],
        cheatsheetAllowed: true,
        cheatsheetRules: '1 Sayfa Önlü Arkalı A4 (Sadece Formüller, Çözümlü Örnek Yasak)',
        calculatorRule: 'Bilimsel Hesap Makinesi Serbest (Programlanabilir Yasak)',
        cheatsheetContent: `# FİZ101 Önlü Arkalı A4 Formül Kağıdı

## 1. Dönme Kinematik & Dinamik Eşdeğerlikleri
- θ(t) = θ₀ + ω₀t + ½αt²   |   ω² = ω₀² + 2αΔθ
- v_teğetsel = ω · r      |   a_teğetsel = α · r   |   a_merkezcil = ω² · r
- **Paralel Eksen (Steiner) Teoremi:** I = I_cm + M · d²
- **Dönme Kinetik Enerjisi:** K_toplam = ½ M v_cm² + ½ I_cm ω²

## 2. Önemli Eylemsizlik Momentleri (I_cm)
- İnce Çember / Halka: **I = M R²**
- İçi Dolu Silindir / Disk: **I = ½ M R²**
- İçi Dolu Küre: **I = (2/5) M R²**
- İnce Çubuk (Ortasından): **I = (1/12) M L²**  |  (Ucundan): **I = (1/3) M L²**

## 3. Tork ve Açısal Momentum
- τ = r × F  (|τ| = r F sinφ = I · α)
- L = r × p = I · ω
- Net dış tork sıfır ise (∑τ_dış = 0) ⇒ **L_ilk = L_son (Açısal Momentum Korunur)**`,
      },
      {
        id: 'exm-4',
        courseId: 'course-elk204',
        examType: 'Kısa Sınav (Flip-Flop & FSM)',
        examDate: addHours(210),
        location: 'Elektrik-Elektronik Lab-3',
        weight: 20,
        scopeTopics: [
          'Karnaugh Haritaları ve Quine-McCluskey Sadeleştirme',
          'Senkron Ardışıl Devreler (D, JK, T Flip-Flop)',
          'Mealy ve Moore Durum Makineleri (FSM) Tasarımı',
        ],
        cheatsheetAllowed: true,
        cheatsheetRules: 'Yarım Sayfa A5 Durum Tablosu Serbest',
        calculatorRule: 'Yasak',
        cheatsheetContent: `# ELK204 Flip-Flop & FSM Özet Kağıdı
- **D Flip-Flop:** Q(t+1) = D
- **JK Flip-Flop:** Q(t+1) = J·Q'(t) + K'·Q(t)
- **T Flip-Flop:** Q(t+1) = T ⊕ Q(t)`,
      },
    ],
    graduation: {
      goals: {
        totalEctsRequired: 240,
        mandatoryCoursesRequired: 32,
        electiveCoursesRequired: 10,
        minGpaRequired: 2.0,
      },
      transcriptCourses: createSampleTranscriptCourses(),
    },
    knowledgeCards: createDefaultKnowledgeCards(),
    notificationSettings: {
      emailAddress: 'ogrenci@universite.edu.tr',
      autoEmailUnder24h: true,
    },
    notificationHistory: [
      {
        id: 'notif-init-1',
        type: 'email_auto',
        title: '24 Saat Kala Otomatik Acil Sınav & Ödev Özeti Hazırlandı',
        recipient: 'ogrenci@universite.edu.tr',
        summary: 'MAT102 Ara Sınav (Vize) ve BLM201 AVL Ağacı Ödevi için 24 saatten az süre kaldı.',
        createdAt: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
      },
    ],
  };
}
