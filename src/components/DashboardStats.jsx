import React from 'react';
import {
  BookOpen,
  Clock,
  CalendarClock,
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  Award,
  Bell,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';
import {
  getCountdownInfo,
  getSmartStudyRecommendations,
} from '../utils/dateUtils';
import {
  calculateTranscriptAudit,
  calculateCourseGradeSummary,
} from '../utils/gpaUtils';

export default function DashboardStats({
  courses,
  assignments,
  topics,
  exams,
  graduation,
  onUpdateTopicStatus,
  onNavigateToSection,
  onTriggerDailyStudyNotification,
}) {
  const now = new Date();

  // 1. Aktif ders ve kredi
  const totalCourses = courses.length;
  const totalCredits = courses.reduce(
    (acc, c) => acc + (Number(c.credits) || 0),
    0
  );

  // 2. Bu hafta teslim edilecek ödev sayısı
  const pendingAssignments = assignments.filter((a) => a.status !== 'done');
  const dueThisWeek = pendingAssignments.filter((a) => {
    const diffHours = (new Date(a.dueDate) - now) / (1000 * 3600);
    return diffHours <= 168;
  });

  // 3. En yakın sınav
  const upcomingExams = [...exams]
    .filter(
      (e) => new Date(e.examDate) >= new Date(now.getTime() - 2 * 3600 * 1000)
    )
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
  const nearestExam = upcomingExams[0] || exams[0] || null;
  const nearestExamCourse = nearestExam
    ? courses.find((c) => c.id === nearestExam.courseId)
    : null;
  const nearestExamCountdown = nearestExam
    ? getCountdownInfo(nearestExam.examDate, false)
    : null;

  // 4. Müfredat hazırlık oranı
  const studiedCount = topics.filter((t) => t.status === 'studied').length;
  const studyPercentage =
    topics.length > 0 ? Math.round((studiedCount / topics.length) * 100) : 0;

  // 5. Mezuniyet & Olası GANO Özeti
  const audit = calculateTranscriptAudit(
    graduation?.transcriptCourses || [],
    graduation?.goals || {}
  );
  const semesterCredits = courses.reduce(
    (acc, c) => acc + (Number(c.credits) || 0),
    0
  );
  const semesterPoints = courses.reduce((acc, c) => {
    const s = calculateCourseGradeSummary(
      c.assessments || [],
      c.targetGradeOverride || ''
    );
    return acc + (Number(c.credits) || 0) * s.finalCoeff;
  }, 0);
  const projectedGpa =
    audit.totalGpaCredits + semesterCredits > 0
      ? (
          (audit.totalQualityPoints + semesterPoints) /
          (audit.totalGpaCredits + semesterCredits)
        ).toFixed(2)
      : audit.currentGpa.toFixed(2);

  // 6. "Bugün Neye Odaklanmalıyım?" İlk 3 Akıllı Öneri
  const smartRecommendations = getSmartStudyRecommendations(
    topics,
    courses,
    exams,
    assignments
  );

  return (
    <section className="space-y-5">
      {/* Üst Özet İstatistikler: Minimal, Tek Satırlık Zarif Sayaçlar */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Sayaç 1: Aktif Dersler (Bebek Mavisi) */}
        <button
          type="button"
          onClick={() => onNavigateToSection('courses')}
          className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-sky-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-sky-400/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100/80 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-[11px] font-medium text-slate-400">
                Aktif Dersler
              </p>
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {totalCourses} Ders{' '}
                <span className="font-normal text-xs text-slate-400">
                  ({totalCredits} AKTS)
                </span>
              </p>
            </div>
          </div>
        </button>

        {/* Sayaç 2: Bu Hafta Ödevler (Açık Pembe / Blush) */}
        <button
          type="button"
          onClick={() => onNavigateToSection('assignments')}
          className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-rose-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-rose-400/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100/80 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200">
              <Clock className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-[11px] font-medium text-slate-400">
                Bu Hafta Teslim
              </p>
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {dueThisWeek.length} Ödev{' '}
                <span className="font-normal text-xs text-slate-400">
                  ({pendingAssignments.length} açık)
                </span>
              </p>
            </div>
          </div>
        </button>

        {/* Sayaç 3: En Yakın Sınav (Lila / Lavanta) */}
        <button
          type="button"
          onClick={() => onNavigateToSection('exams')}
          className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-violet-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-violet-400/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100/80 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
              <CalendarClock className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-[11px] font-medium text-slate-400">
                En Yakın Sınav
              </p>
              {nearestExam ? (
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {nearestExamCourse?.code || 'Ders'}{' '}
                  <span
                    className={`font-normal text-xs ${
                      nearestExamCountdown?.isUnder24h
                        ? 'font-bold text-rose-600 animate-pulse dark:text-rose-300'
                        : 'text-rose-600 dark:text-rose-300'
                    }`}
                  >
                    • {nearestExamCountdown?.shortLabel}
                  </span>
                </p>
              ) : (
                <p className="text-sm font-medium text-slate-400">Yok</p>
              )}
            </div>
          </div>
        </button>

        {/* Sayaç 4: Müfredat Hazırlığı (Mine Yeşili / Mint) */}
        <button
          type="button"
          onClick={() => onNavigateToSection('study')}
          className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-emerald-400/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-[11px] font-medium text-slate-400">
                Çalışma İlerlemesi
              </p>
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                %{studyPercentage}{' '}
                <span className="font-normal text-xs text-slate-400">
                  ({studiedCount}/{topics.length})
                </span>
              </p>
            </div>
          </div>
        </button>

        {/* Sayaç 5: Mezuniyet AKTS & Olası GANO (Lila / Mine Yeşili) */}
        <button
          type="button"
          onClick={() => onNavigateToSection('graduation')}
          className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-emerald-400/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
              <Award className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-[11px] font-medium text-slate-400">
                Mezuniyet & Olası GANO
              </p>
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {projectedGpa}{' '}
                <span className="font-normal text-xs text-slate-400">
                  ({audit.completedEcts}/{audit.targetEcts} AKTS)
                </span>
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Sadeleştirilmiş "Bugün Neye Odaklanmalıyım?" Lila / Lavanta Öneri Kartı */}
      <div className="rounded-2xl border border-violet-200/80 bg-violet-50/55 p-5 shadow-sm dark:border-violet-400/20 dark:bg-violet-950/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-200/70 text-violet-800 dark:bg-violet-400/20 dark:text-violet-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Bugün Neye Odaklanmalıyım?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Yaklaşan sınav ve ödev teslimlerinize göre önceliklendirilen ilk 3 konu
              </p>
            </div>
          </div>

          {onTriggerDailyStudyNotification && (
            <button
              type="button"
              onClick={onTriggerDailyStudyNotification}
              className="inline-flex items-center gap-1.5 self-start rounded-full border border-violet-300/90 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-violet-900 shadow-xs transition hover:bg-violet-100/80 dark:border-violet-400/35 dark:bg-slate-800/90 dark:text-violet-200 dark:hover:bg-violet-400/20 sm:self-center"
            >
              <Bell className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              <span>Günlük Ders Tekrarı Bildirimi Gönder</span>
            </button>
          )}
        </div>

        {smartRecommendations.length === 0 ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            <span>Tüm konularınız tamamlandı! Harika gidiyorsunuz.</span>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {smartRecommendations.map(({ topic, course, reasons }) => {
              const cTheme =
                COURSE_COLOR_THEMES[course?.color] || COURSE_COLOR_THEMES.blue;
              const isMissing = topic.status === 'missing';

              return (
                <div
                  key={topic.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm transition hover:border-violet-300 dark:border-slate-700/70 dark:bg-slate-800/80"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cTheme.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${cTheme.dot}`} />
                        {course?.code || 'Ders'}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                          isMissing
                            ? 'border-rose-200 bg-rose-100/80 text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/15 dark:text-rose-200'
                            : 'border-violet-200 bg-violet-100/80 text-violet-800 dark:border-violet-400/30 dark:bg-violet-400/15 dark:text-violet-200'
                        }`}
                      >
                        {reasons[0] || (isMissing ? 'Eksik Konu' : 'Tekrar')}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-sm font-medium leading-snug text-slate-800 dark:text-slate-100">
                      {topic.title}
                    </h3>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-700/60">
                    <span className="text-[11px] text-slate-400">
                      {topic.unit}
                    </span>

                    <button
                      type="button"
                      onClick={() => onUpdateTopicStatus(topic.id, 'studied')}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100/80 px-2.5 py-1 text-[11px] font-medium text-emerald-800 transition hover:bg-emerald-200/70 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200 dark:hover:bg-emerald-400/25"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Çalışıldı</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
