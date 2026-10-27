import React, { useRef } from 'react';
import {
  GraduationCap,
  Download,
  Upload,
  Search,
  LayoutGrid,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  FileSpreadsheet,
  Award,
  Bell,
  LogOut,
  User,
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
  currentUser,
  onSignOut,
  activeTab,
  setActiveTab,
  selectedCourseId,
  setSelectedCourseId,
  courses,
  searchQuery,
  setSearchQuery,
  onExportJson,
  onImportJson,
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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Üst Satır: Marka + Arama + Bildirimler + Yedekleme + Kullanıcı Profili & Çıkış Yap */}
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200/80 bg-sky-100 text-sky-700 shadow-2xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-semibold tracking-tight text-slate-800 sm:text-lg">
                  Akademik Ders & Sınav Merkezi
                </h1>
                <span className="hidden rounded-full border border-violet-200/80 bg-violet-100/70 px-2.5 py-0.5 text-[11px] font-medium text-violet-700 sm:inline-block">
                  Course & Exam Hub
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Kişisel ders, ödev, sınav geri sayımı, mezuniyet transkript denetimi ve GANO simülatörü
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Arama Kutusu */}
            <div className="relative flex-1 sm:w-52 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ders, ödev veya formül ara..."
                className="w-full rounded-full border border-slate-200/90 bg-slate-50/90 py-1.5 pl-8 pr-3.5 text-xs text-slate-700 placeholder-slate-400 transition focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200/60"
              />
            </div>

            {/* 24 Saat Acil Bildirim ve E-posta Merkezi */}
            <button
              type="button"
              onClick={onOpenNotifications}
              title="Acil Bildirim ve 24 Saat E-posta Hatırlatma Merkezi"
              className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-2xs transition ${
                urgentAlertCount > 0
                  ? 'border-rose-300 bg-rose-100/90 text-rose-900 hover:bg-rose-200/80'
                  : 'border-slate-200/90 bg-white text-slate-600 hover:border-sky-300'
              }`}
            >
              <Bell
                className={`h-3.5 w-3.5 ${
                  urgentAlertCount > 0
                    ? 'text-rose-600 animate-bounce'
                    : 'text-slate-500'
                }`}
              />
              <span className="hidden sm:inline">Bildirimler</span>
              {urgentAlertCount > 0 && (
                <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white animate-pulse">
                  {urgentAlertCount}
                </span>
              )}
            </button>

            {/* JSON Yedekle (Export) */}
            <button
              type="button"
              onClick={onExportJson}
              title="Kişisel verilerinizi JSON olarak indir (Yedekle)"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs transition hover:border-sky-300 hover:bg-sky-50/60 hover:text-sky-800"
            >
              <Download className="h-3.5 w-3.5 text-sky-500" />
              <span className="hidden sm:inline">Yedekle</span>
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
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-800"
            >
              <Upload className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Yükle</span>
            </button>

            {/* Aktif Kullanıcı Profil Rozeti & Çıkış Yap (Sign Out) */}
            {currentUser && (
              <div className="flex items-center gap-1.5 rounded-full border border-violet-200/90 bg-violet-50/80 pl-2.5 pr-1.5 py-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-200/90 text-[10px] font-bold text-violet-900">
                  {(currentUser.name || currentUser.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="max-w-[155px] truncate text-left">
                  <span
                    className="block truncate text-[11px] font-semibold text-violet-950"
                    title={currentUser.email}
                  >
                    {currentUser.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  title="Oturumu Kapat (Çıkış Yap)"
                  className="ml-1 inline-flex items-center gap-1 rounded-full border border-rose-200/90 bg-rose-100/90 px-2.5 py-0.5 text-[11px] font-semibold text-rose-900 transition hover:bg-rose-200/80"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Alt Satır: Minimal Sekmeler + Ders Filtre Hapları (Pills) */}
        <div className="mt-3.5 flex flex-col gap-2.5 border-t border-slate-100 pt-3 md:flex-row md:items-center md:justify-between">
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
                      ? 'border border-sky-200/90 bg-sky-100/90 text-sky-900 shadow-2xs'
                      : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800'
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
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCourseId === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
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
                      : 'border-slate-200/80 bg-white/80 text-slate-600 hover:border-slate-300'
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
