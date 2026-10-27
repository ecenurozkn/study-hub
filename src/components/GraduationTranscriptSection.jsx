import React, { useState, useRef } from 'react';
import {
  Award,
  Calculator,
  Upload,
  Plus,
  Trash2,
  Sliders,
  TrendingUp,
  BookCheck,
  FileText,
  X,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';
import {
  LETTER_GRADE_SCALE,
  getGradeBadgeClasses,
  calculateCourseGradeSummary,
  calculateTranscriptAudit,
  parseTranscriptText,
} from '../utils/gpaUtils';

export default function GraduationTranscriptSection({
  courses = [],
  graduation = { goals: {}, transcriptCourses: [] },
  onUpdateCourse,
  onUpdateGraduationGoals,
  onAddTranscriptCourse,
  onDeleteTranscriptCourse,
  onImportTranscriptCourses,
}) {
  const fileInputRef = useRef(null);
  const [isGoalsEditorOpen, setIsGoalsEditorOpen] = useState(false);
  const [isAddTranscriptOpen, setIsAddTranscriptOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');

  const goals = graduation?.goals || {
    totalEctsRequired: 240,
    mandatoryCoursesRequired: 32,
    electiveCoursesRequired: 10,
    minGpaRequired: 2.0,
  };

  const transcriptCourses = graduation?.transcriptCourses || [];

  const [newTranscriptForm, setNewTranscriptForm] = useState({
    code: '',
    name: '',
    credits: 5,
    grade: 'AA',
    category: 'mandatory',
    semester: '1. Yarıyıl',
  });

  // 1. Mezuniyet ve Transkript Denetim Hesaplamaları
  const audit = calculateTranscriptAudit(transcriptCourses, goals);

  // 2. Bu Dönem Aktif Derslerinin Not Ağırlığı ve Olası GANO (What-If GPA) Hesaplamaları
  const activeCourseSummaries = courses.map((course) => {
    const summary = calculateCourseGradeSummary(
      course.assessments || [],
      course.targetGradeOverride || ''
    );
    return {
      course,
      summary,
    };
  });

  const semesterTotalCredits = activeCourseSummaries.reduce(
    (acc, item) => acc + (Number(item.course.credits) || 0),
    0
  );
  const semesterQualityPoints = activeCourseSummaries.reduce(
    (acc, item) =>
      acc + (Number(item.course.credits) || 0) * item.summary.finalCoeff,
    0
  );
  const semesterGpa =
    semesterTotalCredits > 0
      ? Number((semesterQualityPoints / semesterTotalCredits).toFixed(2))
      : 0;

  // Olası Yeni GANO (Mevcut Transkript + Bu Dönem Beklenen Notlar)
  const combinedCredits = audit.totalGpaCredits + semesterTotalCredits;
  const combinedQualityPoints =
    audit.totalQualityPoints + semesterQualityPoints;
  const projectedCumulativeGpa =
    combinedCredits > 0
      ? Number((combinedQualityPoints / combinedCredits).toFixed(2))
      : 0;
  const gpaDelta = Number(
    (projectedCumulativeGpa - audit.currentGpa).toFixed(2)
  );

  const semesterPassingCredits = activeCourseSummaries.reduce(
    (acc, item) =>
      item.summary.finalGrade !== 'FF'
        ? acc + (Number(item.course.credits) || 0)
        : acc,
    0
  );
  const projectedTotalEcts = audit.completedEcts + semesterPassingCredits;

  const handleAssessmentChange = (course, assessmentId, field, value) => {
    const updated = (course.assessments || []).map((item) =>
      item.id === assessmentId
        ? {
            ...item,
            [field]:
              field === 'name'
                ? value
                : value === ''
                ? ''
                : Number(value),
          }
        : item
    );
    onUpdateCourse(course.id, { assessments: updated });
  };

  const handleAddAssessment = (course) => {
    const nextItem = {
      id: `asm-${Date.now()}`,
      name: `Değerlendirme ${(course.assessments?.length || 0) + 1}`,
      weight: 10,
      score: 80,
    };
    onUpdateCourse(course.id, {
      assessments: [...(course.assessments || []), nextItem],
    });
  };

  const handleDeleteAssessment = (course, assessmentId) => {
    const updated = (course.assessments || []).filter(
      (item) => item.id !== assessmentId
    );
    onUpdateCourse(course.id, { assessments: updated });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || '');
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          const list = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed.transcriptCourses)
            ? parsed.transcriptCourses
            : [];
          if (list.length > 0) {
            onImportTranscriptCourses(list, 'replace');
          }
        } else {
          const parsedLines = parseTranscriptText(content);
          if (parsedLines.length > 0) {
            onImportTranscriptCourses(parsedLines, 'append');
          }
        }
      } catch {
        const parsedLines = parseTranscriptText(content);
        if (parsedLines.length > 0) {
          onImportTranscriptCourses(parsedLines, 'append');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePasteImport = (e) => {
    e.preventDefault();
    const parsed = parseTranscriptText(pasteText);
    if (parsed.length > 0) {
      onImportTranscriptCourses(parsed, 'append');
      setPasteText('');
      setIsPasteModalOpen(false);
    }
  };

  const handleAddTranscriptSubmit = (e) => {
    e.preventDefault();
    if (!newTranscriptForm.code.trim() || !newTranscriptForm.name.trim()) return;
    onAddTranscriptCourse({
      code: newTranscriptForm.code.trim().toUpperCase(),
      name: newTranscriptForm.name.trim(),
      credits: Number(newTranscriptForm.credits) || 5,
      grade: newTranscriptForm.grade,
      category: newTranscriptForm.category,
      semester: newTranscriptForm.semester.trim() || '1. Yarıyıl',
    });
    setNewTranscriptForm({
      code: '',
      name: '',
      credits: 5,
      grade: 'AA',
      category: 'mandatory',
      semester: '1. Yarıyıl',
    });
    setIsAddTranscriptOpen(false);
  };

  const uniqueSemesters = Array.from(
    new Set(transcriptCourses.map((c) => c.semester || 'Diğer'))
  );

  const filteredTranscript = transcriptCourses.filter(
    (c) => semesterFilter === 'all' || c.semester === semesterFilter
  );

  return (
    <section className="space-y-8">
      {/* BÖLÜM 1: MEZUNİYET ŞARTLARI TAKİPÇİSİ (GRADUATION AUDIT CARD) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100/90 text-emerald-700">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-800">
                  Mezuniyet Şartları & Transkript Denetimi (Graduation Audit)
                </h2>
                <span className="rounded-full border border-emerald-200/80 bg-emerald-100/75 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
                  Mevcut GANO: {audit.currentGpa.toFixed(2)} / 4.00
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tamamlanan AKTS, mezuniyete kalan zorunlu/seçmeli ders kotası ve harf notu dağılımı
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGoalsEditorOpen(!isGoalsEditorOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-100/80 px-3.5 py-1.5 text-xs font-medium text-violet-900 transition hover:bg-violet-200/70"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Mezuniyet Hedefleri ({goals.totalEctsRequired} AKTS)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-100/80 px-3.5 py-1.5 text-xs font-medium text-sky-900 transition hover:bg-sky-200/70"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Dosyadan Transkript Yükle</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPasteModalOpen(!isPasteModalOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-sky-300"
            >
              <FileText className="h-3.5 w-3.5 text-sky-500" />
              <span>Metin Yapıştır</span>
            </button>
          </div>
        </div>

        {/* Mezuniyet Hedefleri Düzenleme Kutusu */}
        {isGoalsEditorOpen && (
          <div className="mt-4 rounded-2xl border border-violet-200/80 bg-violet-50/50 p-4">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold text-violet-900">
                Mezuniyet Kriterleri ve Kota Hedeflerini Belirle
              </span>
              <button
                type="button"
                onClick={() => setIsGoalsEditorOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-600">
                  Toplam Gereken AKTS
                </label>
                <input
                  type="number"
                  min="60"
                  max="360"
                  value={goals.totalEctsRequired}
                  onChange={(e) =>
                    onUpdateGraduationGoals({
                      totalEctsRequired: Number(e.target.value) || 240,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">
                  Zorunlu Ders Sayısı Hedefi
                </label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={goals.mandatoryCoursesRequired}
                  onChange={(e) =>
                    onUpdateGraduationGoals({
                      mandatoryCoursesRequired: Number(e.target.value) || 32,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">
                  Seçmeli Ders Kotası Hedefi
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={goals.electiveCoursesRequired}
                  onChange={(e) =>
                    onUpdateGraduationGoals({
                      electiveCoursesRequired: Number(e.target.value) || 10,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600">
                  Minimum Mezuniyet GANO
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="1.0"
                  max="4.0"
                  value={goals.minGpaRequired}
                  onChange={(e) =>
                    onUpdateGraduationGoals({
                      minGpaRequired: Number(e.target.value) || 2.0,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Metin Yapıştırarak Transkript Aktarma Kutusu */}
        {isPasteModalOpen && (
          <form
            onSubmit={handlePasteImport}
            className="mt-4 rounded-2xl border border-sky-200/80 bg-sky-50/50 p-4"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-sky-900">
                Hızlı Metin Transkript Ayrıştırıcı (Her satır: KOD | DERS ADI | AKTS | NOT | KATEGORİ | DÖNEM)
              </span>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Örn: MAT101 | Kalkülüs I | 6 | AA | Zorunlu | 1. Yarıyıl"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full rounded-xl border border-sky-200 bg-white p-3 font-mono text-xs text-slate-800"
            />
            <div className="mt-2.5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="rounded-full px-3 py-1 text-xs text-slate-500"
              >
                İptal
              </button>
              <button
                type="submit"
                className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-medium text-sky-900 hover:bg-sky-200"
              >
                Satırları Transkripte Ekle
              </button>
            </div>
          </form>
        )}

        {/* Mezuniyet Durumu 3'lü Ana Özet Kartı */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Kart 1: Tamamlanan AKTS / Kalan AKTS ve İlerleme Çubuğu */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/45 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-900">
                Tamamlanan AKTS / Kalan AKTS
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                %{audit.ectsProgressPercent}
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <p className="text-xl font-bold text-slate-800">
                {audit.completedEcts}{' '}
                <span className="text-sm font-normal text-slate-500">
                  / {audit.targetEcts} AKTS
                </span>
              </p>
              <span className="text-xs font-medium text-rose-700">
                Kalan: {audit.remainingEcts} AKTS
              </span>
            </div>

            {/* Mine Yeşili İlerleme Çubuğu */}
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/90">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${audit.ectsProgressPercent}%` }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Bu dönem sonu olası: <strong>{projectedTotalEcts} AKTS</strong>
              </span>
              {audit.failedEcts > 0 && (
                <span className="text-rose-600">
                  ({audit.failedEcts} AKTS FF)
                </span>
              )}
            </div>
          </div>

          {/* Kart 2: Mezuniyete Kalan Ders Sayısı (Zorunlu & Seçmeli Kotası) */}
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/45 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-900">
                Mezuniyete Kalan Ders Sayısı
              </span>
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800">
                {audit.totalRemainingCourses} Ders Kaldı
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Zorunlu Dersler:</span>
                  <span className="font-semibold text-slate-800">
                    {audit.completedMandatoryCount} / {audit.targetMandatoryCount} tamamlandı{' '}
                    <span className="text-rose-600">
                      ({audit.remainingMandatory} kaldı)
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/90">
                  <div
                    className="h-full rounded-full bg-sky-400"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (audit.completedMandatoryCount /
                            Math.max(1, audit.targetMandatoryCount)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Seçmeli Ders Kotası:</span>
                  <span className="font-semibold text-slate-800">
                    {audit.completedElectiveCount} / {audit.targetElectiveCount} tamamlandı{' '}
                    <span className="text-violet-700">
                      ({audit.remainingElective} kaldı)
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/90">
                  <div
                    className="h-full rounded-full bg-violet-400"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (audit.completedElectiveCount /
                            Math.max(1, audit.targetElectiveCount)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kart 3: Alınan Derslerin Harf Notu Dökümü */}
          <div className="rounded-2xl border border-violet-200/80 bg-violet-50/45 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-violet-900">
                Harf Notu Dökümü (AA – FF)
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Toplam {audit.totalCourseCount} Ders
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {LETTER_GRADE_SCALE.map(({ grade }) => {
                const count = audit.gradeDistribution[grade] || 0;
                return (
                  <div
                    key={grade}
                    className={`flex flex-col items-center justify-center rounded-xl border px-2 py-1.5 ${getGradeBadgeClasses(
                      grade
                    )}`}
                  >
                    <span className="text-xs font-bold">{grade}</span>
                    <span className="text-[11px] font-medium opacity-85">
                      {count} ders
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BÖLÜM 2: NOT AĞIRLIKLARI, NOT GİRİŞİ VE OLASI GANO SİMÜLATÖRÜ (WHAT-IF GPA CALCULATOR) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100/90 text-violet-700">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                Not Ağırlıkları, Başarı Notu & Olası GANO Simülatörü (What-If GPA)
              </h2>
              <p className="text-xs text-slate-500">
                Vize, Ödev ve Final ağırlıklarına göre 100 üzerinden ders ortalamasını, harf notunu ve yeni GANO senaryosunu canlı hesaplayın
              </p>
            </div>
          </div>

          {/* Canlı GANO Senaryo Özeti Rozetleri */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-3.5 py-2 text-xs">
              <span className="text-slate-400">Mevcut GANO: </span>
              <strong className="font-semibold text-slate-800">
                {audit.currentGpa.toFixed(2)}
              </strong>
            </div>

            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-2 text-xs">
              <span className="text-sky-700">Bu Dönem (YANO): </span>
              <strong className="font-bold text-sky-900">
                {semesterGpa.toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200/90 bg-emerald-50/90 px-4 py-2 text-xs">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="text-emerald-800">Olası Yeni GANO: </span>
                <strong className="text-sm font-bold text-emerald-950">
                  {projectedCumulativeGpa.toFixed(2)}
                </strong>
                <span
                  className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    gpaDelta >= 0
                      ? 'bg-emerald-200/70 text-emerald-900'
                      : 'bg-rose-200/70 text-rose-900'
                  }`}
                >
                  {gpaDelta >= 0
                    ? `+${gpaDelta.toFixed(2)} ↑`
                    : `${gpaDelta.toFixed(2)} ↓`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Aktif Derslerin Değerlendirme Kriterleri ve Not Simülasyon Kartları */}
        {activeCourseSummaries.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-6 text-center text-xs text-slate-500">
            Not ağırlıklarını ve dönem ortalamasını simüle etmek için önce aktif derslerinizi ekleyin.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {activeCourseSummaries.map(({ course, summary }) => {
              const cTheme =
                COURSE_COLOR_THEMES[course.color] || COURSE_COLOR_THEMES.blue;
              const assessments = course.assessments || [];

              return (
                <div
                  key={course.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4"
                >
                  <div>
                    {/* Üst Bilgi: Ders Kodu, Başarı Puanı ve Harf Notu */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cTheme.badge}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${cTheme.dot}`} />
                          {course.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {course.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({course.credits} AKTS)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                          Ort: {summary.effectiveScore ?? '—'} / 100
                        </span>

                        <select
                          value={course.targetGradeOverride || ''}
                          onChange={(e) =>
                            onUpdateCourse(course.id, {
                              targetGradeOverride: e.target.value,
                            })
                          }
                          title="Otomatik hesaplanan harf notunu veya senaryo hedefini seçin"
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold focus:outline-none ${getGradeBadgeClasses(
                            summary.finalGrade
                          )}`}
                        >
                          <option value="">
                            Oto: {summary.computedGrade} ({summary.finalCoeff.toFixed(2)})
                          </option>
                          {LETTER_GRADE_SCALE.map((g) => (
                            <option key={g.grade} value={g.grade}>
                              Hedef: {g.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Değerlendirme Kriterleri (Vize, Ödev, Final) Tablosu */}
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-12 gap-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        <span className="col-span-6">Kriter (Vize / Ödev / Final)</span>
                        <span className="col-span-2 text-center">Ağırlık %</span>
                        <span className="col-span-3 text-center">Not (0-100)</span>
                        <span className="col-span-1" />
                      </div>

                      {assessments.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-12 items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-2.5 py-1.5"
                        >
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleAssessmentChange(
                                course,
                                item.id,
                                'name',
                                e.target.value
                              )
                            }
                            placeholder="Örn: Vize"
                            className="col-span-6 bg-transparent text-xs font-medium text-slate-700 focus:outline-none"
                          />

                          <div className="col-span-2 flex items-center justify-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.weight}
                              onChange={(e) =>
                                handleAssessmentChange(
                                  course,
                                  item.id,
                                  'weight',
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-1 text-center text-xs font-medium text-slate-700 focus:border-sky-300 focus:outline-none"
                            />
                          </div>

                          <div className="col-span-3 flex items-center justify-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Not gir"
                              value={item.score ?? ''}
                              onChange={(e) =>
                                handleAssessmentChange(
                                  course,
                                  item.id,
                                  'score',
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border border-sky-200/80 bg-sky-50/50 px-2 py-1 text-center text-xs font-semibold text-sky-900 focus:border-sky-400 focus:outline-none"
                            />
                          </div>

                          <div className="col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteAssessment(course, item.id)
                              }
                              title="Kriteri sil"
                              className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alt Satır: Toplam Ağırlık Kontrolü ve Yeni Kriter Ekle */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5 text-[11px]">
                    <span
                      className={
                        summary.totalWeight === 100
                          ? 'text-emerald-700'
                          : 'text-rose-600'
                      }
                    >
                      Toplam Ağırlık: %{summary.totalWeight}{' '}
                      {summary.totalWeight !== 100 && '(100% önerilir)'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddAssessment(course)}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-sky-700 shadow-2xs hover:bg-sky-50"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Kriter Ekle</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BÖLÜM 3: TAMAMLANAN TRANSKRİPT DERSLERİ LİSTESİ */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100/90 text-sky-700">
              <BookCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Transkript Ders Kayıtları ({transcriptCourses.length} Ders)
              </h3>
              <p className="text-xs text-slate-500">
                Geçmiş dönemlerde tamamladığınız dersleri ekleyin veya dosyadan yükleyin
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {uniqueSemesters.length > 0 && (
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
              >
                <option value="all">Tüm Dönemler ({transcriptCourses.length})</option>
                {uniqueSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => setIsAddTranscriptOpen(!isAddTranscriptOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-100/90 px-3.5 py-1.5 text-xs font-medium text-sky-900 transition hover:bg-sky-200/80"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Transkripte Ders Ekle</span>
            </button>
          </div>
        </div>

        {/* Manuel Transkript Dersi Ekleme Formu */}
        {isAddTranscriptOpen && (
          <form
            onSubmit={handleAddTranscriptSubmit}
            className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-6">
              <input
                type="text"
                required
                placeholder="Kod (Örn: MAT101)"
                value={newTranscriptForm.code}
                onChange={(e) =>
                  setNewTranscriptForm({
                    ...newTranscriptForm,
                    code: e.target.value,
                  })
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
              />
              <input
                type="text"
                required
                placeholder="Ders Adı"
                value={newTranscriptForm.name}
                onChange={(e) =>
                  setNewTranscriptForm({
                    ...newTranscriptForm,
                    name: e.target.value,
                  })
                }
                className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
              />
              <input
                type="number"
                min="1"
                max="30"
                placeholder="AKTS"
                value={newTranscriptForm.credits}
                onChange={(e) =>
                  setNewTranscriptForm({
                    ...newTranscriptForm,
                    credits: e.target.value,
                  })
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
              />
              <select
                value={newTranscriptForm.grade}
                onChange={(e) =>
                  setNewTranscriptForm({
                    ...newTranscriptForm,
                    grade: e.target.value,
                  })
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
              >
                {LETTER_GRADE_SCALE.map((g) => (
                  <option key={g.grade} value={g.grade}>
                    {g.label}
                  </option>
                ))}
              </select>
              <select
                value={newTranscriptForm.category}
                onChange={(e) =>
                  setNewTranscriptForm({
                    ...newTranscriptForm,
                    category: e.target.value,
                  })
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
              >
                <option value="mandatory">Zorunlu Ders</option>
                <option value="elective">Seçmeli Ders</option>
              </select>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddTranscriptOpen(false)}
                className="rounded-full px-3 py-1 text-xs text-slate-500"
              >
                İptal
              </button>
              <button
                type="submit"
                className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-200"
              >
                Transkripte Kaydet
              </button>
            </div>
          </form>
        )}

        {/* Transkript Tablosu */}
        {filteredTranscript.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-6 text-center text-xs text-slate-500">
            Henüz transkript dersi eklenmemiş. Sağ üstteki <strong>"Transkripte Ders Ekle"</strong> veya <strong>"Metin Yapıştır"</strong> butonuyla geçmiş dönem derslerinizi girebilirsiniz.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 pr-3">Dönem</th>
                  <th className="py-2.5 px-3">Kod</th>
                  <th className="py-2.5 px-3">Ders Adı</th>
                  <th className="py-2.5 px-3">Tür</th>
                  <th className="py-2.5 px-3 text-center">AKTS</th>
                  <th className="py-2.5 px-3 text-center">Harf Notu</th>
                  <th className="py-2.5 pl-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTranscript.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 pr-3 text-slate-500">
                      {item.semester}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      {item.code}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                          item.category === 'elective'
                            ? 'border-violet-200 bg-violet-100/70 text-violet-800'
                            : 'border-sky-200 bg-sky-100/70 text-sky-800'
                        }`}
                      >
                        {item.category === 'elective' ? 'Seçmeli' : 'Zorunlu'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                      {item.credits}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${getGradeBadgeClasses(
                          item.grade
                        )}`}
                      >
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteTranscriptCourse(item.id)}
                        className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Dersten sil"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
