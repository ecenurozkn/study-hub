import React, { useEffect, useState } from 'react';
import {
  CalendarClock,
  MapPin,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';
import { getLiveCountdownParts, formatTurkishDateTime } from '../utils/dateUtils';

export default function ExamCountdownHub({
  exams = [],
  courses = [],
  onSelectExam,
}) {
  const [, setSecondTick] = useState(0);

  // Canlı geri sayım için her saniye güncelle
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.examDate) - new Date(b.examDate)
  );

  const urgent24hCount = sortedExams.filter((ex) => {
    const parts = getLiveCountdownParts(ex.examDate);
    return parts.isUnder24h;
  }).length;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
      {/* Üst Başlık */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100/90 text-rose-700">
            <CalendarClock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Merkezi Sınav Takvimi & Canlı Geri Sayım
              </h2>
              {urgent24hCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-900 animate-pulse">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{urgent24hCount} Sınav &lt;24 Saat!</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Tarihe göre sıralı tüm sınavlar için Gün, Saat ve Dakika bazında anlık geri sayım
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500 sm:self-center">
          <Clock className="h-3 w-3 text-sky-500" />
          <span>Canlı Sayaç Aktif</span>
        </span>
      </div>

      {sortedExams.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-6 text-center text-xs text-slate-500">
          Henüz sınav eklenmemiş. Sınavlar sekmesinden sınav tarihi ekleyerek canlı geri sayımı başlatabilirsiniz.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {sortedExams.map((exam) => {
            const course = courses.find((c) => c.id === exam.courseId);
            const cTheme =
              COURSE_COLOR_THEMES[course?.color] || COURSE_COLOR_THEMES.blue;
            const parts = getLiveCountdownParts(exam.examDate);
            const isCritical24 = parts.isUnder24h;

            return (
              <div
                key={exam.id}
                onClick={() => onSelectExam && onSelectExam(exam)}
                role={onSelectExam ? 'button' : undefined}
                tabIndex={onSelectExam ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onSelectExam && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectExam(exam);
                  }
                }}
                className={`group flex flex-col justify-between gap-3 rounded-2xl border p-4 transition sm:flex-row sm:items-center ${
                  isCritical24
                    ? 'border-rose-300/90 bg-rose-50/60 shadow-2xs'
                    : 'border-slate-200/80 bg-slate-50/60 hover:border-sky-300'
                } ${onSelectExam ? 'cursor-pointer' : ''}`}
              >
                {/* Sol: Ders, Sınav Türü, Tarih & Yer */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cTheme.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cTheme.dot}`} />
                      {course?.code || 'DERS'}
                    </span>

                    <span className="truncate text-xs font-semibold text-slate-800">
                      {exam.examType}
                    </span>

                    {isCritical24 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-0.5 text-[10px] font-semibold text-rose-900 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span>SON 24 SAAT • ACİL</span>
                      </span>
                    )}
                  </div>

                  <p className="mt-1 truncate text-xs font-medium text-slate-600">
                    {course?.name}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>{formatTurkishDateTime(exam.examDate)}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{exam.location}</span>
                    </span>
                    {exam.cheatsheetAllowed && (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <FileCheck2 className="h-3 w-3" />
                        <span>Cheatsheet Serbest</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Sağ: Canlı Gün / Saat / Dakika / Saniye Rozetleri */}
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  {parts.isPast ? (
                    <span className="rounded-full border border-rose-200 bg-rose-100/90 px-3 py-1 text-xs font-medium text-rose-800">
                      Sınav Zamanı Geçti
                    </span>
                  ) : (
                    <>
                      {/* Gün Kutusu */}
                      <div
                        className={`flex min-w-[46px] flex-col items-center rounded-xl border px-2 py-1.5 text-center ${
                          isCritical24
                            ? 'border-rose-200 bg-rose-100/90 text-rose-900 animate-pulse'
                            : 'border-sky-200/80 bg-white text-slate-800'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold leading-none">
                          {String(parts.days).padStart(2, '0')}
                        </span>
                        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-500">
                          Gün
                        </span>
                      </div>

                      {/* Saat Kutusu */}
                      <div
                        className={`flex min-w-[46px] flex-col items-center rounded-xl border px-2 py-1.5 text-center ${
                          isCritical24
                            ? 'border-rose-200 bg-rose-100/90 text-rose-900 animate-pulse'
                            : 'border-sky-200/80 bg-white text-slate-800'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold leading-none">
                          {String(parts.hours).padStart(2, '0')}
                        </span>
                        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-500">
                          Saat
                        </span>
                      </div>

                      {/* Dakika Kutusu */}
                      <div
                        className={`flex min-w-[46px] flex-col items-center rounded-xl border px-2 py-1.5 text-center ${
                          isCritical24
                            ? 'border-rose-200 bg-rose-100/90 text-rose-900 animate-pulse'
                            : 'border-violet-200/80 bg-white text-slate-800'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold leading-none">
                          {String(parts.minutes).padStart(2, '0')}
                        </span>
                        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-500">
                          Dk
                        </span>
                      </div>

                      {/* Saniye Kutusu */}
                      <div
                        className={`flex min-w-[44px] flex-col items-center rounded-xl border px-2 py-1.5 text-center ${
                          isCritical24
                            ? 'border-rose-300 bg-rose-100 text-rose-900 animate-pulse'
                            : 'border-emerald-200/80 bg-emerald-50/70 text-emerald-900'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold leading-none">
                          {String(parts.seconds).padStart(2, '0')}
                        </span>
                        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-500">
                          Sn
                        </span>
                      </div>
                    </>
                  )}

                  {onSelectExam && (
                    <ArrowRight className="ml-1 hidden h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-600 sm:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
