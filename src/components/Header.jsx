import React, { useRef } from 'react';
import {
  GraduationCap,
  Download,
  Upload,
  RotateCcw,
  Search,
  LayoutGrid,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  FileSpreadsheet,
  Award,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';

const TABS = [
  { id: 'all', label: 'Genel Görünüm', icon: LayoutGrid },
  { id: 'courses', label: 'Dersler', icon: BookOpen },
  { id: 'assignments', label: 'Ödevler', icon: ClipboardCheck },
  { id: 'study', label: 'Çalışma Planı', icon: Sparkles },
  { id: 'exams', label: 'Sınav & Cheatsheet', icon: FileSpreadsheet },
  { id: 'graduation', label: 'Mezuniyet & Transkript', icon: Award },
];

export default function Header({
  theme,
  onToggleTheme,
  activeTab,
  setActiveTab,
  selectedCourseId,
  setSelectedCourseId,
  courses,
  searchQuery,
  setSearchQuery,
  onExportJson,
  onImportJson,
  onResetDemo,
  urgentAlertCount = 0,
  onOpenNotifications,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImportJson(file);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-[#0f172a]/85">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Üst Satır: Marka + Arama + Acil Bildirim Merkezi + Tema Anahtarı + Yedekleme */}
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 border border-sky-200/80 shadow-sm dark:bg-sky-400/15 dark:text-sky-200 dark:border-sky-400/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100 sm:text-lg">
                  Akademik Ders & Sınav Merkezi
                </h1>
                <span className="hidden rounded-full border border-violet-200/80 bg-violet-100/70 px-2.5 py-0.5 text-[11px] font-medium text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/15 dark:text-violet-200 sm:inline-block">
                  Course & Exam Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ders, ödev, sınav geri sayımı, mezuniyet transkript denetimi ve GANO simülatörü
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Arama Kutusu */}
            <div className="relative flex-1 sm:w-56 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ders, ödev veya formül ara..."
                className="w-full rounded-full border border-slate-200/90 bg-slate-50/90 py-1.5 pl-8 pr-3.5 text-xs text-slate-700 placeholder-slate-400 transition focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/60 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400/50 dark:focus:ring-sky-500/20"
              />
            </div>

            {/* 24 Saat Acil Bildirim Merkezi (Zil İkonu) */}
            <button
              type="button"
              onClick={onOpenNotifications}
              title="Acil Bildirim ve 24 Saat E-posta Merkezi"
              className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition ${
                urgentAlertCount > 0
                  ? 'border-rose-300 bg-rose-100/90 text-rose-900 hover:bg-rose-200/80 dark:border-rose-400/40 dark:bg-rose-500/20 dark:text-rose-100'
                  : 'border-slate-200/90 bg-white text-slate-600 hover:border-sky-300 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300'
              }`}
            >
              <Bell
                className={`h-3.5 w-3.5 ${
                  urgentAlertCount > 0
                    ? 'text-rose-600 dark:text-rose-300 animate-bounce'
                    : 'text-slate-500 dark:text-slate-300'
                }`}
              />
              <span className="hidden sm:inline">Bildirimler</span>
              {urgentAlertCount > 0 && (
                <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white animate-pulse">
                  {urgentAlertCount}
                </span>
              )}
            </button>

            {/* Animasyonlu Aydınlık / Karanlık Mod Geçiş Anahtarı */}
            <button
              type="button"
              onClick={onToggleTheme}
              title={
                theme === 'dark'
                  ? 'Aydınlık Moda Geç (Light Mode)'
                  : 'Karanlık Moda Geç (Dark Mode)'
              }
              aria-label="Tema Değiştir"
              className="group relative inline-flex h-8 w-16 items-center rounded-full border border-slate-200/90 bg-slate-100/90 p-1 transition-colors duration-300 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-800"
            >
              <span
                className={`flex h-6 w-6 transform items-center justify-center rounded-full shadow-sm transition-transform duration-300 ${
                  theme === 'dark'
                    ? 'translate-x-8 bg-violet-400/25 text-violet-200 ring-1 ring-violet-300/40'
                    : 'translate-x-0 bg-white text-amber-500 ring-1 ring-slate-200'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-12" />
                ) : (
                  <Sun className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
                )}
              </span>
              <span
                className={`absolute text-[10px] font-medium transition-opacity duration-200 ${
                  theme === 'dark'
                    ? 'left-2 text-slate-300 opacity-100'
                    : 'right-2 text-slate-500 opacity-100'
                }`}
              >
                {theme === 'dark' ? 'Gece' : 'Gün'}
              </span>
            </button>

            {/* JSON Yedekle (Export) */}
            <button
              type="button"
              onClick={onExportJson}
              title="Tüm verileri JSON olarak indir (Yedekle)"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50/60 hover:text-sky-800 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-sky-400/40 dark:hover:text-sky-200"
            >
              <Download className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
              <span>Yedekle</span>
            </button>

            {/* JSON Geri Yükle (Import) */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="JSON yedeğinden geri yükle"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-800 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-200"
            >
              <Upload className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" />
              <span>Yükle</span>
            </button>

            {/* Örnek Veriyi Sıfırla */}
            <button
              type="button"
              onClick={onResetDemo}
              title="Örnek verileri sıfırla"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white p-1.5 text-xs text-slate-400 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/60 hover:text-rose-600 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:border-rose-400/40 dark:hover:text-rose-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Alt Satır: Minimal Sekmeler + Ders Filtre Hapları (Pills) */}
        <div className="mt-3.5 flex flex-col gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800/70 md:flex-row md:items-center md:justify-between">
          {/* Modül Sekmeleri (Bebek Mavisi Aktif Sekme) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-sky-100/90 text-sky-900 border border-sky-200/90 shadow-sm dark:bg-sky-400/20 dark:text-sky-100 dark:border-sky-400/35'
                      : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Ders Filtre Hapları */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCourseId('all')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition shrink-0 ${
                selectedCourseId === 'all'
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              Tümü ({courses.length})
            </button>
            {courses.map((course) => {
              const cTheme =
                COURSE_COLOR_THEMES[course.color] || COURSE_COLOR_THEMES.blue;
              const isSelected = selectedCourseId === course.id;
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() =>
                    setSelectedCourseId(isSelected ? 'all' : course.id)
                  }
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                    isSelected
                      ? `${cTheme.badge} ring-1 ring-current`
                      : 'border-slate-200/80 bg-white/80 text-slate-600 hover:border-slate-300 dark:border-slate-700/70 dark:bg-slate-800/50 dark:text-slate-300'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${cTheme.dot}`} />
                  <span>{course.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
