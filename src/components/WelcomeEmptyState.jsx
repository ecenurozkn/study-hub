import React from 'react';
import {
  Sparkles,
  Plus,
  BookOpen,
  CalendarClock,
  Award,
} from 'lucide-react';

export default function WelcomeEmptyState({
  userName,
  userEmail,
  onStartAddCourse,
  onNavigateTab,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-sky-200/85 bg-gradient-to-br from-sky-50/80 via-white to-violet-50/70 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-900">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>
              Merhaba {userName || userEmail} • Kişisel Çalışma Alanınız Hazır
            </span>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
            Hoş Geldiniz! Henüz bir ders eklemediniz. İlk dersinizi ekleyerek başlayın.
          </h2>

          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
            Hesabınız sıfırdan tamamen temiz oluşturuldu. Aldığınız dersleri ekledikten sonra o derse ait ödev teslimlerini, sınav geri sayımlarını, dijital formül kağıtlarını (Cheatsheet) ve GANO senaryolarınızı tek ekrandan takip edebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onStartAddCourse}
            className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-5 py-2.5 text-xs font-semibold text-sky-900 shadow-xs transition hover:bg-sky-200/80"
          >
            <Plus className="h-4 w-4" />
            <span>İlk Dersinizi Ekleyin</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('graduation')}
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-100/80 px-4 py-2.5 text-xs font-medium text-violet-900 transition hover:bg-violet-200/70"
          >
            <Award className="h-4 w-4" />
            <span>Transkript & Mezuniyet Hedefi</span>
          </button>
        </div>
      </div>

      {/* 3 Adımlı Pastel Başlangıç Rehberi */}
      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
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
          className="cursor-pointer rounded-2xl border border-sky-200/70 bg-white/90 p-4 transition hover:border-sky-300 hover:shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-800">
              1
            </span>
            <BookOpen className="h-3.5 w-3.5 text-sky-600" />
            <span>1. Adım: Derslerinizi Oluşturun</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Ders kodu, kredi (AKTS), öğretim görevlisi ve pastel renk etiketini belirleyin.
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
          className="cursor-pointer rounded-2xl border border-rose-200/70 bg-white/90 p-4 transition hover:border-rose-300 hover:shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-800">
              2
            </span>
            <CalendarClock className="h-3.5 w-3.5 text-rose-600" />
            <span>2. Adım: Ödev & Sınavları Girin</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Canlı geri sayım sayaçlarını başlatın ve 24 saat kala e-posta bildirimlerini alın.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('graduation')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigateTab('graduation');
            }
          }}
          className="cursor-pointer rounded-2xl border border-emerald-200/70 bg-white/90 p-4 transition hover:border-emerald-300 hover:shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              3
            </span>
            <Award className="h-3.5 w-3.5 text-emerald-600" />
            <span>3. Adım: GANO & Mezuniyet Takibi</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Vize/Final ağırlıklarınızı girerek olası dönem ve genel ortalamanızı simüle edin.
          </p>
        </div>
      </div>
    </section>
  );
}
