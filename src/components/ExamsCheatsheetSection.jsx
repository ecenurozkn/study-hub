import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Pencil,
  Clock,
  Check,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  COURSE_COLOR_THEMES,
  EXAM_TYPES,
} from '../data/initialData';
import {
  getCountdownInfo,
  getLiveCountdownParts,
  formatTurkishDateTime,
} from '../utils/dateUtils';
import {
  CourseMascotBadge,
  FlameMascot,
  StarMascot,
} from './MascotIcons';

export default function ExamsCheatsheetSection({
  exams,
  courses,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  highlightedExamId = null,
  onNotify,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [filterExamType, setFilterExamType] = useState('all');
  const [scoreDrafts, setScoreDrafts] = useState({});
  const [openCheatsheetIds, setOpenCheatsheetIds] = useState({});
  const [, setSecondTick] = useState(0);

  // Canlı gün ve saat geri sayımı için periyodik güncelleme
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondTick((t) => t + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const defaultExamDate = () => {
    const d = new Date(Date.now() + 48 * 3600 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00`;
  };

  const [examForm, setExamForm] = useState({
    courseId: courses[0]?.id || '',
    examType: 'Vize',
    examDate: defaultExamDate(),
    location: 'Merkezi Amfi-1',
    score: '',
    cheatsheetContent: '',
  });

  const openCreateForm = () => {
    setEditingExamId(null);
    setExamForm({
      courseId: courses[0]?.id || '',
      examType: 'Vize',
      examDate: defaultExamDate(),
      location: 'Merkezi Amfi-1',
      score: '',
      cheatsheetContent: '',
    });
    setIsFormOpen(true);
  };

  const openEditForm = (exam) => {
    setEditingExamId(exam.id);
    setExamForm({
      courseId: exam.courseId || courses[0]?.id || '',
      examType: exam.examType || 'Vize',
      examDate: exam.examDate || defaultExamDate(),
      location: exam.location || 'Amfi',
      score:
        exam.score !== undefined && exam.score !== null && exam.score !== ''
          ? String(exam.score)
          : '',
      cheatsheetContent: exam.cheatsheetContent || '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!examForm.courseId || !examForm.examType.trim()) return;

    let cleanScore = '';
    if (examForm.score !== '' && examForm.score !== null) {
      const numeric = Number(examForm.score);
      if (Number.isFinite(numeric)) {
        cleanScore = Math.min(100, Math.max(0, numeric));
      }
    }

    const payload = {
      courseId: examForm.courseId,
      examType: examForm.examType.trim(),
      examDate: examForm.examDate,
      location: examForm.location.trim() || 'Belirtilmedi',
      score: cleanScore,
      cheatsheetContent: examForm.cheatsheetContent || '',
    };

    if (editingExamId) {
      onUpdateExam(editingExamId, payload);
      onNotify && onNotify('Sınav bilgileri güncellendi.');
    } else {
      onAddExam(payload);
    }

    setIsFormOpen(false);
    setEditingExamId(null);
  };

  const handleSaveScore = (exam, rawValue) => {
    if (rawValue === '' || rawValue === null || rawValue === undefined) {
      onUpdateExam(exam.id, { score: '' });
      onNotify && onNotify('Sınav sonucu temizlendi.');
      return;
    }
    const num = Number(rawValue);
    if (!Number.isFinite(num) || num < 0 || num > 100) {
      onNotify &&
        onNotify('Lütfen 0 ile 100 arasında geçerli bir not girin.', 'error');
      return;
    }
    const clamped = Math.min(100, Math.max(0, Math.round(num * 100) / 100));
    onUpdateExam(exam.id, { score: clamped });
    onNotify && onNotify(`Sınav notu (${clamped}) kaydedildi.`);
  };

  const sortedExams = [...exams]
    .filter((ex) => {
      if (filterExamType === 'all') return true;
      return ex.examType.toLowerCase().includes(filterExamType.toLowerCase());
    })
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

  const announcedExams = sortedExams.filter(
    (ex) => ex.score !== undefined && ex.score !== null && ex.score !== ''
  );

  return (
    <section id="exams-section" className="space-y-5">
      {/* Başlık + Sınav Türü Filtresi + Yeni Sınav Ekle */}
      <div className="flex flex-col gap-3 rounded-3xl border border-white/95 bg-white px-5 py-4 shadow-habitz-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF7ED]">
            <FlameMascot className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800">
              Sınav Takvimi & Sınav Sonuçları
            </h2>
            <p className="text-xs text-slate-500">
              Vize, Final, Büt ve Quiz tarihleri, gün/saat geri sayım rozetleri ve 0–100 sınav sonucu kayıtları
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-violet-100 bg-[#F5F3FF] p-1">
            {['all', ...EXAM_TYPES].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterExamType(type)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  filterExamType === type
                    ? 'bg-[#8B5CF6] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? 'Tümü' : type}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={courses.length === 0}
            onClick={openCreateForm}
            title={
              courses.length === 0
                ? 'Sınav eklemek için önce bir ders oluşturun'
                : 'Yeni Sınav Ekle'
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Sınav Ekle</span>
          </button>
        </div>
      </div>

      {/* Yeni Sınav Ekle / Düzenle Formu */}
      {isFormOpen && courses.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/95 bg-white p-6 shadow-habitz"
        >
          <div className="flex items-center justify-between border-b border-violet-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800">
              {editingExamId ? 'Sınavı Düzenle' : 'Yeni Sınav Ekle'}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Ders Seçimi */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                Ders Seçin *
              </label>
              <select
                required
                value={examForm.courseId}
                onChange={(e) =>
                  setExamForm({ ...examForm, courseId: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sınav Türü: Vize, Final, Büt, Quiz */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                Sınav Türü *
              </label>
              <div className="mt-1 grid grid-cols-4 gap-1.5">
                {EXAM_TYPES.map((t) => {
                  const active = examForm.examType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setExamForm({ ...examForm, examType: t })}
                      className={`rounded-xl border py-2 text-xs font-extrabold transition ${
                        active
                          ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-2xs'
                          : 'border-violet-100 bg-[#F5F3FF]/60 text-slate-600 hover:bg-[#EDE9FE]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sınav Tarihi ve Saati */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                Sınav Tarihi ve Saati *
              </label>
              <input
                type="datetime-local"
                required
                value={examForm.examDate}
                onChange={(e) =>
                  setExamForm({ ...examForm, examDate: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Sınav Yeri / Amfi ve Sonuç Notu (0-100) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-600">
                  Sınav Yeri / Amfi
                </label>
                <input
                  type="text"
                  placeholder="Örn: Amfi-1"
                  value={examForm.location}
                  onChange={(e) =>
                    setExamForm({ ...examForm, location: e.target.value })
                  }
                  className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3 py-2 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600">
                  Not (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="—"
                  value={examForm.score}
                  onChange={(e) =>
                    setExamForm({ ...examForm, score: e.target.value })
                  }
                  className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-2.5 py-2 text-center text-xs font-extrabold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Kısa Sınav Hazırlık / Konu Notu */}
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600">
                Sınav Kapsamı / Kısa Formül Notu (İsteğe Bağlı)
              </label>
              <textarea
                rows={2}
                placeholder="Sınavda çıkacak konular veya hatırlanacak önemli formüller..."
                value={examForm.cheatsheetContent}
                onChange={(e) =>
                  setExamForm({
                    ...examForm,
                    cheatsheetContent: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3.5 py-2 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#8B5CF6] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-violet-600"
            >
              {editingExamId ? 'Güncelle' : 'Sınavı Kaydet'}
            </button>
          </div>
        </form>
      )}

      {/* Sınav Kartları Listesi */}
      {sortedExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/95 bg-white p-8 text-center shadow-habitz">
          <StarMascot className="h-14 w-14" />
          <h3 className="mt-3 text-sm font-extrabold text-slate-800">
            {courses.length === 0
              ? 'Sınav Eklemek İçin Önce Ders Oluşturun'
              : 'Henüz Sınav Eklenmemiş'}
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            Vize, Final, Büt veya Quiz tarihlerinizi ekleyerek gün/saat geri sayımını başlatabilir ve sınav açıklandığında 0–100 notunuzu kaydedebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sortedExams.map((exam) => {
            const course = courses.find((c) => c.id === exam.courseId);
            const theme =
              COURSE_COLOR_THEMES[course?.color] || COURSE_COLOR_THEMES.blue;
            const countdown = getCountdownInfo(exam.examDate, false);
            const parts = getLiveCountdownParts(exam.examDate);
            const isHighlighted = highlightedExamId === exam.id;

            const hasScore =
              exam.score !== undefined &&
              exam.score !== null &&
              exam.score !== '';

            const currentDraftScore =
              scoreDrafts[exam.id] !== undefined
                ? scoreDrafts[exam.id]
                : hasScore
                ? String(exam.score)
                : '';

            const isNotesOpen = Boolean(openCheatsheetIds[exam.id]);

            return (
              <div
                key={exam.id}
                id={`exam-card-${exam.id}`}
                className={`flex flex-col justify-between rounded-3xl border bg-white p-5 shadow-habitz transition ${
                  isHighlighted
                    ? 'border-[#8B5CF6] ring-2 ring-[#C4B5FD]'
                    : 'border-white/95'
                }`}
              >
                <div>
                  {/* Üst Degrade Hap Başlık */}
                  <div
                    className={`flex flex-col gap-3 rounded-2xl border border-white p-4 sm:flex-row sm:items-center sm:justify-between ${theme.pillGradient}`}
                  >
                    <div className="flex items-start gap-3">
                      <CourseMascotBadge course={course} size="sm" />
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${theme.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${theme.dot}`}
                            />
                            {course?.code || 'DERS'}
                          </span>
                          <span className="rounded-full bg-[#8B5CF6] px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                            {exam.examType}
                          </span>
                        </div>
                        <h3 className="mt-1 text-sm font-extrabold text-slate-800 sm:text-base">
                          {course?.name || 'Ders'}
                        </h3>
                      </div>
                    </div>

                    {/* Sevimli Gün & Saat Geri Sayım Rozeti */}
                    <div className="flex items-center gap-1.5 self-start sm:self-center">
                      {!parts.isPast ? (
                        <div className="inline-flex items-center gap-1.5 rounded-2xl border border-violet-200/80 bg-white px-3 py-1.5 text-xs font-extrabold text-[#8B5CF6] shadow-2xs">
                          <Clock className="h-3.5 w-3.5 text-orange-500" />
                          <span>
                            {parts.days} Gün {parts.hours} Saat Kaldı
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${countdown.badgeClass}`}
                        >
                          Sınav Tamamlandı
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditForm(exam)}
                        title="Sınavı Düzenle"
                        className="rounded-full bg-white/90 p-1.5 text-slate-400 hover:text-[#8B5CF6]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteExam(exam.id)}
                        title="Sınavı Sil"
                        className="rounded-full bg-white/90 p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sınav Tarihi, Saati ve Yeri */}
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
                      <Calendar className={`h-3.5 w-3.5 ${theme.text}`} />
                      <span>{formatTurkishDateTime(exam.examDate)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <MapPin className={`h-3.5 w-3.5 ${theme.text}`} />
                      <span>{exam.location}</span>
                    </span>
                  </div>
                </div>

                {/* Sınav Sonucu Alanı (0-100 Not Girişi - Ortalama Hesabı Olmadan Saf Not Kaydı) */}
                <div className="mt-4 flex flex-col gap-2.5 rounded-2xl border border-[#6EE7B7]/60 bg-[#ECFDF5]/55 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <StarMascot className="h-7 w-7 shrink-0" />
                    <div>
                      <span className="block text-xs font-extrabold text-emerald-950">
                        Sınav Sonucu (0 – 100)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {hasScore
                          ? `Açıklanan Notunuz: ${exam.score} / 100`
                          : 'Sınav açıklandığında aldığınız notu girin'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={currentDraftScore}
                      onChange={(e) =>
                        setScoreDrafts({
                          ...scoreDrafts,
                          [exam.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveScore(exam, currentDraftScore);
                        }
                      }}
                      className="w-20 rounded-xl border border-[#6EE7B7] bg-white px-2.5 py-1.5 text-center text-xs font-extrabold text-emerald-950 focus:border-[#8B5CF6] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveScore(exam, currentDraftScore)}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#6EE7B7] px-3 py-1.5 text-xs font-extrabold text-emerald-950 shadow-2xs transition hover:bg-emerald-300"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Kaydet</span>
                    </button>
                  </div>
                </div>

                {/* Sınava Özel Kısa Çalışma / Formül Notu (Açılır/Kapanır) */}
                <div className="mt-3 border-t border-slate-100 pt-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCheatsheetIds((prev) => ({
                        ...prev,
                        [exam.id]: !prev[exam.id],
                      }))
                    }
                    className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-500 hover:text-[#8B5CF6]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-[#8B5CF6]" />
                      <span>Sınav Kapsamı & Hazırlık Notları</span>
                    </span>
                    {isNotesOpen ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {isNotesOpen && (
                    <div className="mt-2">
                      <textarea
                        rows={3}
                        placeholder="Bu sınav için çalışılacak üniteler veya formül notları..."
                        value={exam.cheatsheetContent || ''}
                        onChange={(e) =>
                          onUpdateExam(exam.id, {
                            cheatsheetContent: e.target.value,
                          })
                        }
                        className="w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/40 p-3 text-xs text-slate-700 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Açıklanan Sınav Sonuçları Özet Listesi (Ortalama Hesabı Olmadan Temiz Not Tablosu) */}
      {announcedExams.length > 0 && (
        <div className="rounded-3xl border border-white/95 bg-white p-5 sm:p-6 shadow-habitz">
          <div className="flex items-center gap-2.5 border-b border-violet-100 pb-3">
            <StarMascot className="h-7 w-7" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Açıklanan Sınav Sonuçlarım ({announcedExams.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Kaydettiğiniz sınav notlarının ders bazlı temiz listesi
              </p>
            </div>
          </div>

          <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {announcedExams.map((ex) => {
              const course = courses.find((c) => c.id === ex.courseId);
              const theme =
                COURSE_COLOR_THEMES[course?.color] || COURSE_COLOR_THEMES.blue;
              return (
                <div
                  key={`res-${ex.id}`}
                  className="flex items-center justify-between rounded-2xl border border-violet-100 bg-[#F5F3FF]/45 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CourseMascotBadge course={course} size="xs" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold text-slate-800">
                        {course?.code || 'DERS'} • {ex.examType}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {course?.name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`ml-2 shrink-0 rounded-2xl border px-3 py-1 text-sm font-extrabold ${theme.badge}`}
                  >
                    {ex.score} / 100
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
