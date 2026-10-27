import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Calculator,
  FileText,
  Copy,
  Check,
  Trash2,
  Eye,
  Edit3,
  ListChecks,
  X,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';
import { getCountdownInfo, formatTurkishDateTime } from '../utils/dateUtils';

function renderCheatsheetPreview(text) {
  if (!text) {
    return (
      <p className="italic text-slate-400 text-xs">
        Henüz formül veya not yazılmamış. "Düzenle" moduna geçerek formüllerinizi ekleyebilirsiniz.
      </p>
    );
  }

  return text.split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return (
        <h4
          key={index}
          className="mt-2 mb-1.5 border-b border-violet-200/70 pb-1 text-sm font-semibold text-violet-800 dark:border-violet-400/20 dark:text-violet-200 first:mt-0"
        >
          {trimmed.slice(2)}
        </h4>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h5
          key={index}
          className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300"
        >
          {trimmed.slice(3)}
        </h5>
      );
    }
    if (trimmed.startsWith('- ')) {
      const content = trimmed.slice(2);
      const parts = content.split(/(\*\*.*?\*\*)/g);
      return (
        <div
          key={index}
          className="flex items-start gap-2 py-0.5 text-xs text-slate-700 dark:text-slate-200"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 dark:bg-violet-300" />
          <span className="font-mono leading-relaxed">
            {parts.map((part, i) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong
                  key={i}
                  className="rounded bg-violet-100/80 px-1 font-semibold text-violet-900 dark:bg-violet-400/20 dark:text-violet-100"
                >
                  {part.slice(2, -2)}
                </strong>
              ) : (
                part
              )
            )}
          </span>
        </div>
      );
    }
    if (trimmed === '') {
      return <div key={index} className="h-1.5" />;
    }
    return (
      <p
        key={index}
        className="py-0.5 font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-300"
      >
        {line}
      </p>
    );
  });
}

export default function ExamsCheatsheetSection({
  exams,
  courses,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  highlightedExamId = null,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedExamId, setCopiedExamId] = useState(null);
  const [cheatsheetModeByExam, setCheatsheetModeByExam] = useState({});
  const [newScopeInputByExam, setNewScopeInputByExam] = useState({});

  const defaultExamDate = () => {
    const d = new Date(Date.now() + 5 * 24 * 3600 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`;
  };

  const [newExamForm, setNewExamForm] = useState({
    courseId: courses[0]?.id || '',
    examType: 'Ara Sınav (Vize)',
    examDate: defaultExamDate(),
    location: 'Merkezi Amfi-1',
    weight: 35,
    scopeText: '',
    cheatsheetAllowed: true,
    cheatsheetRules: '1 Sayfa Tek Yüz A4 El Yazısı',
    calculatorRule: 'Bilimsel Hesap Makinesi Serbest',
    cheatsheetContent: '# Sınav Formül Kağıdı\n- **Temel Formül:** F = m · a',
  });

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!newExamForm.courseId || !newExamForm.examType.trim()) return;

    const scopeTopics = newExamForm.scopeText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    onAddExam({
      courseId: newExamForm.courseId,
      examType: newExamForm.examType.trim(),
      examDate: newExamForm.examDate,
      location: newExamForm.location.trim() || 'Belirtilmedi',
      weight: Number(newExamForm.weight) || 30,
      scopeTopics:
        scopeTopics.length > 0
          ? scopeTopics
          : ['Ünite 1-4 arası tüm konular'],
      cheatsheetAllowed: Boolean(newExamForm.cheatsheetAllowed),
      cheatsheetRules:
        newExamForm.cheatsheetRules.trim() ||
        (newExamForm.cheatsheetAllowed
          ? '1 Sayfa Tek Yüz A4 El Yazısı'
          : 'Cheatsheet İzni Yok'),
      calculatorRule: newExamForm.calculatorRule.trim() || 'Belirtilmedi',
      cheatsheetContent: newExamForm.cheatsheetContent,
    });

    setIsCreateOpen(false);
  };

  const handleAddScopeItem = (exam) => {
    const text = (newScopeInputByExam[exam.id] || '').trim();
    if (!text) return;
    onUpdateExam(exam.id, {
      scopeTopics: [...(exam.scopeTopics || []), text],
    });
    setNewScopeInputByExam({ ...newScopeInputByExam, [exam.id]: '' });
  };

  const handleRemoveScopeItem = (exam, idx) => {
    const next = (exam.scopeTopics || []).filter((_, i) => i !== idx);
    onUpdateExam(exam.id, { scopeTopics: next });
  };

  const handleCopyCheatsheet = async (exam) => {
    try {
      await navigator.clipboard.writeText(exam.cheatsheetContent || '');
      setCopiedExamId(exam.id);
      setTimeout(() => setCopiedExamId(null), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.examDate) - new Date(b.examDate)
  );

  return (
    <section className="space-y-4">
      {/* Başlık ve Yeni Sınav Ekle */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100/80 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Sınav Detayları ve Cheatsheet (Formül Kağıdı) Merkezi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sınav tarihi/yeri, sınav kapsamı, cheatsheet izin kuralları ve dijital formül alanı
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewExamForm((prev) => ({
              ...prev,
              courseId: prev.courseId || courses[0]?.id || '',
            }));
            setIsCreateOpen(!isCreateOpen);
          }}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-sky-200 bg-sky-100/90 px-4 py-1.5 text-xs font-medium text-sky-900 shadow-sm transition hover:bg-sky-200/80 dark:border-sky-400/30 dark:bg-sky-400/20 dark:text-sky-100 sm:self-center"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Yeni Sınav Kartı Ekle</span>
        </button>
      </div>

      {/* Yeni Sınav Ekleme Formu */}
      {isCreateOpen && (
        <form
          onSubmit={handleCreateExam}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700/70">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Yeni Sınav ve Cheatsheet Kartı Oluştur
            </h3>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Ders *
              </label>
              <select
                required
                value={newExamForm.courseId}
                onChange={(e) =>
                  setNewExamForm({ ...newExamForm, courseId: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Sınav Türü *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Ara Sınav (Vize) / Final"
                value={newExamForm.examType}
                onChange={(e) =>
                  setNewExamForm({ ...newExamForm, examType: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Sınav Tarihi ve Saati *
              </label>
              <input
                type="datetime-local"
                required
                value={newExamForm.examDate}
                onChange={(e) =>
                  setNewExamForm({ ...newExamForm, examDate: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Sınav Yeri & Ağırlık (%)
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Amfi / Salon"
                  value={newExamForm.location}
                  onChange={(e) =>
                    setNewExamForm({ ...newExamForm, location: e.target.value })
                  }
                  className="w-2/3 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                />
                <input
                  type="number"
                  min="5"
                  max="100"
                  placeholder="%"
                  value={newExamForm.weight}
                  onChange={(e) =>
                    setNewExamForm({ ...newExamForm, weight: e.target.value })
                  }
                  className="w-1/3 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Cheatsheet İzni Var mı?
              </label>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setNewExamForm({ ...newExamForm, cheatsheetAllowed: true })
                  }
                  className={`flex-1 rounded-full border py-1.5 text-xs font-medium transition ${
                    newExamForm.cheatsheetAllowed
                      ? 'border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-400/35 dark:bg-emerald-400/20 dark:text-emerald-100'
                      : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900'
                  }`}
                >
                  Evet (Serbest)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewExamForm({ ...newExamForm, cheatsheetAllowed: false })
                  }
                  className={`flex-1 rounded-full border py-1.5 text-xs font-medium transition ${
                    !newExamForm.cheatsheetAllowed
                      ? 'border-rose-200 bg-rose-100 text-rose-900 dark:border-rose-400/35 dark:bg-rose-400/20 dark:text-rose-100'
                      : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-900'
                  }`}
                >
                  Hayır (Yasak)
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Cheatsheet Sayfa & Format Kuralı
              </label>
              <input
                type="text"
                placeholder="Örn: 1 Sayfa Tek Yüz A4 El Yazısı / Önlü Arkalı A4"
                value={newExamForm.cheatsheetRules}
                onChange={(e) =>
                  setNewExamForm({
                    ...newExamForm,
                    cheatsheetRules: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Hesap Makinesi Kuralı
              </label>
              <input
                type="text"
                placeholder="Örn: Serbest / Yasak"
                value={newExamForm.calculatorRule}
                onChange={(e) =>
                  setNewExamForm({
                    ...newExamForm,
                    calculatorRule: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Sınav Kapsamı (Her satıra bir ünite/konu)
              </label>
              <textarea
                rows={3}
                placeholder={'Ünite 1: Limit ve Süreklilik\nÜnite 2: Kısmi Türevler'}
                value={newExamForm.scopeText}
                onChange={(e) =>
                  setNewExamForm({ ...newExamForm, scopeText: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Başlangıç Dijital Cheatsheet Notları (Markdown / Formül)
              </label>
              <textarea
                rows={3}
                value={newExamForm.cheatsheetContent}
                onChange={(e) =>
                  setNewExamForm({
                    ...newExamForm,
                    cheatsheetContent: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 font-mono text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-full border border-sky-200 bg-sky-100 px-4 py-1.5 text-xs font-medium text-sky-900 hover:bg-sky-200/80 dark:border-sky-400/30 dark:bg-sky-400/20 dark:text-sky-100"
            >
              Sınav Kartını Kaydet
            </button>
          </div>
        </form>
      )}

      {/* Sınav Kartları Listesi */}
      {sortedExams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Henüz sınav kartı bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedExams.map((exam) => {
            const course = courses.find((c) => c.id === exam.courseId);
            const theme =
              COURSE_COLOR_THEMES[course?.color] || COURSE_COLOR_THEMES.blue;
            const countdown = getCountdownInfo(exam.examDate, false);
            const mode = cheatsheetModeByExam[exam.id] || 'preview';

            const isHighlighted = highlightedExamId === exam.id;

            return (
              <div
                key={exam.id}
                id={`exam-card-${exam.id}`}
                className={`overflow-hidden rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition dark:bg-slate-800/60 ${
                  isHighlighted
                    ? 'border-sky-400 ring-2 ring-sky-300/70 dark:border-sky-400 dark:ring-sky-400/40'
                    : 'border-slate-200/80 dark:border-slate-700/70'
                }`}
              >
                {/* Üst Satır: Ders, Sınav Türü, Tarih/Yer ve Kalan Süre */}
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 dark:border-slate-700/60 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium ${theme.badge}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                        {course?.code || 'DERS'}
                      </span>
                      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 sm:text-lg">
                        {course?.name} — {exam.examType}
                      </h3>
                      {exam.weight && (
                        <span className="rounded-full bg-rose-100/80 px-2.5 py-0.5 text-[11px] font-medium text-rose-800 dark:bg-rose-400/15 dark:text-rose-200">
                          Ağırlık: %{exam.weight}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className={`h-3.5 w-3.5 ${theme.text}`} />
                        <strong className="font-medium text-slate-700 dark:text-slate-200">
                          {formatTurkishDateTime(exam.examDate)}
                        </strong>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className={`h-3.5 w-3.5 ${theme.text}`} />
                        <span>{exam.location}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium ${countdown.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${countdown.dotClass}`} />
                      {countdown.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteExam(exam.id)}
                      title="Sınav Kartını Sil"
                      className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Alt Grid: Sol (Cheatsheet Kuralları + Sınav Kapsamı) | Sağ (Mini Dijital Cheatsheet) */}
                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
                  {/* Sol Sütun (5/12) */}
                  <div className="space-y-4 lg:col-span-5">
                    {/* Lila / Lavanta Cheatsheet & İzin Kuralları Kutusu */}
                    <div className="rounded-2xl border border-violet-200/70 bg-violet-50/40 p-4 dark:border-violet-400/20 dark:bg-violet-950/15">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-violet-900 dark:text-violet-200">
                          Cheatsheet & İzin Kuralları
                        </span>

                        {/* Evet / Hayır İnteraktif Hap Butonu */}
                        <div className="inline-flex rounded-full border border-slate-200/80 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateExam(exam.id, {
                                cheatsheetAllowed: true,
                              })
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                              exam.cheatsheetAllowed
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-200'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Evet</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateExam(exam.id, {
                                cheatsheetAllowed: false,
                              })
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                              !exam.cheatsheetAllowed
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-400/20 dark:text-rose-200'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Hayır</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2.5">
                        <div>
                          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            <FileText className="h-3.5 w-3.5 text-violet-500 dark:text-violet-300" />
                            <span>Sayfa & Format İzni:</span>
                          </label>
                          <input
                            type="text"
                            value={exam.cheatsheetRules || ''}
                            onChange={(e) =>
                              onUpdateExam(exam.id, {
                                cheatsheetRules: e.target.value,
                              })
                            }
                            placeholder="Örn: 1 Sayfa Tek Yüz A4 El Yazısı"
                            className="mt-1 w-full rounded-xl border border-violet-200/70 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-violet-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            <Calculator className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
                            <span>Hesap Makinesi İzni:</span>
                          </label>
                          <input
                            type="text"
                            value={exam.calculatorRule || ''}
                            onChange={(e) =>
                              onUpdateExam(exam.id, {
                                calculatorRule: e.target.value,
                              })
                            }
                            placeholder="Örn: Hesap Makinesi: Serbest / Yasak"
                            className="mt-1 w-full rounded-xl border border-violet-200/70 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-violet-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sınav Kapsamı Listesi */}
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-700/70 dark:bg-slate-900/40">
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Sınav Kapsamı ({exam.scopeTopics?.length || 0} Başlık)
                        </h4>
                      </div>

                      <ul className="mt-2.5 space-y-1.5">
                        {(exam.scopeTopics || []).map((topicText, idx) => (
                          <li
                            key={idx}
                            className="flex items-start justify-between gap-2 rounded-xl border border-slate-200/70 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-200"
                          >
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 text-[11px] font-semibold text-sky-600 dark:text-sky-300">
                                {idx + 1}.
                              </span>
                              <span>{topicText}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveScopeItem(exam, idx)}
                              className="text-slate-400 hover:text-rose-500"
                              title="Kapsamdan çıkar"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-2.5 flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Yeni kapsam başlığı ekle..."
                          value={newScopeInputByExam[exam.id] || ''}
                          onChange={(e) =>
                            setNewScopeInputByExam({
                              ...newScopeInputByExam,
                              [exam.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddScopeItem(exam);
                            }
                          }}
                          className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddScopeItem(exam)}
                          className="rounded-full bg-sky-100 px-3.5 py-1.5 text-xs font-medium text-sky-900 hover:bg-sky-200 dark:bg-sky-400/20 dark:text-sky-100"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sağ Sütun (7/12): Mini Dijital Cheatsheet Alanı */}
                  <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-700/70 dark:bg-slate-900/50 lg:col-span-7">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3 dark:border-slate-700/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                            Mini Dijital Cheatsheet
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                              exam.cheatsheetAllowed
                                ? 'border-emerald-200 bg-emerald-100/80 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200'
                                : 'border-rose-200 bg-rose-100/80 text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/15 dark:text-rose-200'
                            }`}
                          >
                            {exam.cheatsheetAllowed
                              ? 'A4 Kağıda Yazılacak Formüller'
                              : 'Hafızada Tutulacak Formüller'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="inline-flex rounded-full border border-slate-200/90 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
                          <button
                            type="button"
                            onClick={() =>
                              setCheatsheetModeByExam({
                                ...cheatsheetModeByExam,
                                [exam.id]: 'preview',
                              })
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                              mode === 'preview'
                                ? 'bg-sky-100 text-sky-900 dark:bg-sky-400/20 dark:text-sky-100'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                            }`}
                          >
                            <Eye className="h-3 w-3" />
                            <span>Önizleme</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCheatsheetModeByExam({
                                ...cheatsheetModeByExam,
                                [exam.id]: 'edit',
                              })
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                              mode === 'edit'
                                ? 'bg-sky-100 text-sky-900 dark:bg-sky-400/20 dark:text-sky-100'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                            }`}
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Düzenle</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCheatsheet(exam)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {copiedExamId === exam.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-300" />
                              <span className="text-emerald-700 dark:text-emerald-200">
                                Kopyalandı
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-slate-400" />
                              <span>Kopyala</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex-1">
                      {mode === 'edit' ? (
                        <div className="space-y-2">
                          <textarea
                            rows={11}
                            value={exam.cheatsheetContent || ''}
                            onChange={(e) =>
                              onUpdateExam(exam.id, {
                                cheatsheetContent: e.target.value,
                              })
                            }
                            placeholder="Sınav kağıdına yazacağınız formülleri ve kısa notları buraya yazın..."
                            className="w-full rounded-xl border border-sky-200 bg-white p-3.5 font-mono text-xs leading-relaxed text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                            <span>Sembol ekle:</span>
                            <div className="flex flex-wrap gap-1">
                              {[
                                '∇f',
                                '∫',
                                '∑',
                                '∂',
                                'λ',
                                'θ',
                                'π',
                                '⇒',
                                '≈',
                                '≤',
                                '≥',
                                '√',
                              ].map((sym) => (
                                <button
                                  key={sym}
                                  type="button"
                                  onClick={() =>
                                    onUpdateExam(exam.id, {
                                      cheatsheetContent:
                                        (exam.cheatsheetContent || '') + sym,
                                    })
                                  }
                                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 font-mono text-xs text-slate-700 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                  {sym}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            setCheatsheetModeByExam({
                              ...cheatsheetModeByExam,
                              [exam.id]: 'edit',
                            })
                          }
                          title="Düzenlemek için tıklayın"
                          className="min-h-[220px] cursor-pointer rounded-xl border border-slate-200/70 bg-white p-4 transition hover:border-sky-200 dark:border-slate-700/60 dark:bg-slate-900/80"
                        >
                          {renderCheatsheetPreview(exam.cheatsheetContent)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
