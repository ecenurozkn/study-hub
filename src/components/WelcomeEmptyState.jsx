import React from 'react';
import {
  Sparkles,
  Plus,
  CalendarDays,
} from 'lucide-react';
import {
  WinkingCloudMascot,
  CloudMascot,
  FlameMascot,
  DropMascot,
} from './MascotIcons';

export default function WelcomeEmptyState({
  userName,
  userEmail,
  courseCount = 0,
  examCount = 0,
  onStartAddCourse,
  onNavigateTab,
}) {
  const hasCourses = courseCount > 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/95 bg-white p-6 sm:p-8 shadow-habitz">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center max-w-2xl">
          {/* Sol tarafta göz kırpan sevimli bulut maskot */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] border border-[#C4B5FD]/60 shadow-2xs">
            <WinkingCloudMascot className="h-13 w-13" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6EE7B7] bg-[#ECFDF5] px-3 py-1 text-xs font-bold text-emerald-900">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                Merhaba {userName || userEmail} • Kişisel Çalışma Alanınız Hazır
              </span>
            </div>

            <h2 className="text-lg font-extrabold tracking-tight text-slate-800 sm:text-xl">
              {hasCourses
                ? `Hoş Geldiniz! Şu an ${courseCount} dersiniz ve ${examCount} sınav kaydınız aktif.`
                : 'Hoş Geldiniz! Henüz bir ders eklemediniz. İlk dersinizi ekleyerek başlayın.'}
            </h2>

            <p className="text-xs leading-relaxed text-slate-500 sm:text-sm">
              Zorunlu veya Seçmeli derslerinizi (0 Kredi ve 0 AKTS OC dersler dahil) ekledikten sonra haftalık ders programınızı, sınav takviminizi, 0–100 sınav sonuçlarınızı ve çıkmış soru PDF & çalışma notu arşivinizi tek ekrandan yönetebilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* "+ İlk Dersinizi Ekleyin" yumuşak lila/mor tonda, rounded-2xl ve hover:scale-105 */}
          <button
            type="button"
            onClick={onStartAddCourse}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#C4B5FD]/85 border border-[#8B5CF6]/30 px-5 py-3 text-xs font-extrabold text-purple-950 shadow-xs transition-all duration-200 hover:scale-105 hover:bg-[#C4B5FD]"
          >
            <Plus className="h-4 w-4 text-purple-800" />
            <span>
              {hasCourses ? 'Yeni Ders Ekleyin' : 'İlk Dersinizi Ekleyin'}
            </span>
          </button>

          {/* "Haftalık Programı Gör" açık pastel çerçeveli zarif ikincil buton */}
          <button
            type="button"
            onClick={() => onNavigateTab('schedule')}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-purple-200 bg-purple-50/70 px-4 py-3 text-xs font-bold text-purple-700 transition hover:bg-purple-100/75"
          >
            <CalendarDays className="h-4 w-4 text-purple-600" />
            <span>Haftalık Programı Gör</span>
          </button>
        </div>
      </div>

      {/* Alttaki 3 Rehber Kutusu: Pastel çerçeveli, bol iç boşluklu ve sevimli minik ikonlarla */}
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          onClick={onStartAddCourse}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onStartAddCourse();
            }
          }}
          className="cursor-pointer rounded-3xl border border-sky-200/80 bg-gradient-to-br from-[#EFF6FF]/90 via-white to-[#DBEAFE]/50 p-5 shadow-2xs transition hover:-translate-y-0.5 hover:border-[#93C5FD]"
        >
          <div className="flex items-center gap-2.5 text-xs font-extrabold text-sky-950">
            <CloudMascot className="h-8 w-8 shrink-0" />
            <span>1. Ders ve Saat Ekleyin</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Zorunlu veya Seçmeli dersinizi, bağımsız Kredi/AKTS değerlerini (0 dahil) ve ders saatini belirleyin.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('exams')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigateTab('exams');
            }
          }}
          className="cursor-pointer rounded-3xl border border-rose-200/80 bg-gradient-to-br from-[#FFF1F2]/90 via-white to-[#FFE4E6]/50 p-5 shadow-2xs transition hover:-translate-y-0.5 hover:border-[#FDA4AF]"
        >
          <div className="flex items-center gap-2.5 text-xs font-extrabold text-rose-950">
            <FlameMascot className="h-8 w-8 shrink-0" />
            <span>2. Sınav Takvimi & Sonuçlar</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Vize, Final, Büt ve Quiz tarihlerini ekleyin; sonuçlar açıklandığında 0–100 notunuzu kaydedin.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('courses')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigateTab('courses');
            }
          }}
          className="cursor-pointer rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-[#ECFDF5]/90 via-white to-[#D1FAE5]/50 p-5 shadow-2xs transition hover:-translate-y-0.5 hover:border-[#6EE7B7]"
        >
          <div className="flex items-center gap-2.5 text-xs font-extrabold text-emerald-950">
            <DropMascot className="h-8 w-8 shrink-0" />
            <span>3. Çıkmış Soru PDF & Not Arşivi</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Her dersin kendi kartı içinde Sınav PDF/Çıkmış Sorular ve Ders Çalışma Notları arşivini yönetin.
          </p>
        </div>
      </div>
    </section>
  );
}
