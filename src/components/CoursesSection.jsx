import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  User,
  Clock,
  MapPin,
  ExternalLink,
  Link2,
  FolderOpen,
  Presentation,
  Globe,
  X,
  Check,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';
import {
  calculateCourseGradeSummary,
  getGradeBadgeClasses,
} from '../utils/gpaUtils';

const LINK_TYPES = [
  { id: 'slides', label: 'Ders Slaytı / PDF', icon: Presentation },
  { id: 'drive', label: 'Google Drive / Klasör', icon: FolderOpen },
  { id: 'portal', label: 'Ders Portali / GitHub', icon: Globe },
];

const EMPTY_COURSE_FORM = {
  code: '',
  name: '',
  instructor: '',
  credits: 5,
  schedule: '',
  room: '',
  color: 'blue',
};

export default function CoursesSection({
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAddCourseLink,
  onDeleteCourseLink,
  onSelectCourseFilter,
  selectedCourseId,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_COURSE_FORM);

  const [activeLinkCourseId, setActiveLinkCourseId] = useState(null);
  const [linkForm, setLinkForm] = useState({ title: '', url: '', type: 'slides' });
  const [openGradeCourseIds, setOpenGradeCourseIds] = useState({});

  const toggleGradePanel = (courseId) => {
    setOpenGradeCourseIds((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const openCreateForm = () => {
    setEditingCourseId(null);
    setFormData(EMPTY_COURSE_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (course) => {
    setEditingCourseId(course.id);
    setFormData({
      code: course.code,
      name: course.name,
      instructor: course.instructor,
      credits: course.credits,
      schedule: course.schedule,
      room: course.room || '',
      color: course.color || 'blue',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) return;

    const payload = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      instructor: formData.instructor.trim() || 'Belirtilmedi',
      credits: Number(formData.credits) || 3,
      schedule: formData.schedule.trim() || 'Belirtilmedi',
      room: formData.room.trim() || 'Amfi / Online',
      color: formData.color,
    };

    if (editingCourseId) {
      onUpdateCourse(editingCourseId, payload);
    } else {
      onAddCourse(payload);
    }

    setIsFormOpen(false);
    setEditingCourseId(null);
    setFormData(EMPTY_COURSE_FORM);
  };

  const handleLinkSubmit = (e, courseId) => {
    e.preventDefault();
    if (!linkForm.title.trim() || !linkForm.url.trim()) return;
    let normalizedUrl = linkForm.url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    onAddCourseLink(courseId, {
      title: linkForm.title.trim(),
      url: normalizedUrl,
      type: linkForm.type,
    });
    setLinkForm({ title: '', url: '', type: 'slides' });
    setActiveLinkCourseId(null);
  };

  const handleAssessmentFieldChange = (course, assessmentId, field, value) => {
    const nextAssessments = (course.assessments || []).map((item) =>
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
    onUpdateCourse(course.id, { assessments: nextAssessments });
  };

  const handleAddAssessmentToCourse = (course) => {
    const nextItem = {
      id: `asm-${Date.now()}`,
      name: `Ödev / Quiz ${(course.assessments?.length || 0) + 1}`,
      weight: 15,
      score: 85,
    };
    onUpdateCourse(course.id, {
      assessments: [...(course.assessments || []), nextItem],
    });
  };

  const handleRemoveAssessmentFromCourse = (course, assessmentId) => {
    onUpdateCourse(course.id, {
      assessments: (course.assessments || []).filter(
        (item) => item.id !== assessmentId
      ),
    });
  };

  const getLinkIcon = (type) => {
    const found = LINK_TYPES.find((t) => t.id === type);
    return found ? found.icon : Link2;
  };

  return (
    <section className="space-y-4">
      {/* Bölüm Başlığı */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Ders Yönetimi, Not Ağırlıkları ve Bilgi Kartları
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ders programı, değerlendirme ağırlıkları (Vize/Ödev/Final), tahmini harf notu ve bağlantılar
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-sky-200 bg-sky-100/90 px-4 py-1.5 text-xs font-medium text-sky-900 shadow-sm transition hover:bg-sky-200/80 dark:border-sky-400/30 dark:bg-sky-400/20 dark:text-sky-100 dark:hover:bg-sky-400/30 sm:self-center"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Yeni Ders Ekle</span>
        </button>
      </div>

      {/* Yeni / Düzenle Ders Formu */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700/70">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {editingCourseId ? 'Dersi Düzenle' : 'Yeni Ders Oluştur'}
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Ders Kodu *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: MAT102"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Ders Adı *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Kalkülüs II (Çok Değişkenli Analiz)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Öğretim Görevlisi
              </label>
              <input
                type="text"
                placeholder="Örn: Prof. Dr. Kerem Aydın"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Ders Günü ve Saati
              </label>
              <input
                type="text"
                placeholder="Örn: Pazartesi 09:30-12:20"
                value={formData.schedule}
                onChange={(e) =>
                  setFormData({ ...formData, schedule: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Kredi / AKTS
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.credits}
                  onChange={(e) =>
                    setFormData({ ...formData, credits: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Derslik / Amfi
                </label>
                <input
                  type="text"
                  placeholder="Örn: Amfi-2"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Pastel Renk Etiketi Seçimi */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Pastel Renk Etiketi
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(COURSE_COLOR_THEMES).map((theme) => {
                  const isSelected = formData.color === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: theme.id })}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        isSelected
                          ? `${theme.badge} ring-1 ring-current`
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
                      <span>{theme.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-full border border-sky-200 bg-sky-100 px-4 py-1.5 text-xs font-medium text-sky-900 hover:bg-sky-200/80 dark:border-sky-400/30 dark:bg-sky-400/20 dark:text-sky-100"
            >
              {editingCourseId ? 'Değişiklikleri Kaydet' : 'Dersi Kaydet'}
            </button>
          </div>
        </form>
      )}

      {/* Ders Bilgi Kartları Grid */}
      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Henüz ders eklenmemiş. Sağ üstteki <strong>"Yeni Ders Ekle"</strong> butonuyla ilk dersinizi oluşturun.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {courses.map((course) => {
            const theme =
              COURSE_COLOR_THEMES[course.color] || COURSE_COLOR_THEMES.blue;
            const isFiltered = selectedCourseId === course.id;
            const gradeSummary = calculateCourseGradeSummary(
              course.assessments || [],
              course.targetGradeOverride || ''
            );
            const isGradeOpen = Boolean(openGradeCourseIds[course.id]);

            return (
              <div
                key={course.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-slate-800/60 ${theme.border}`}
              >
                <div>
                  {/* Üst Satır: Ders Kodu, AKTS, Harf Notu Özeti ve Düzenle/Sil */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          onClick={() =>
                            onSelectCourseFilter(
                              isFiltered ? 'all' : course.id
                            )
                          }
                          title="Bu derse göre filtrelemek için tıklayın"
                          className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium ${theme.badge}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                          {course.code}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
                          {course.credits} AKTS
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getGradeBadgeClasses(
                            gradeSummary.finalGrade
                          )}`}
                        >
                          Ort: {gradeSummary.effectiveScore ?? '—'} • {gradeSummary.finalGrade}
                        </span>
                      </div>
                      <h3 className="mt-2.5 text-base font-semibold text-slate-800 dark:text-slate-100">
                        {course.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditForm(course)}
                        title="Dersi Düzenle"
                        className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCourse(course.id)}
                        title="Dersi Sil"
                        className="rounded-full p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ders Detayları */}
                  <div className="mt-3.5 grid grid-cols-1 gap-1.5 text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <User className={`h-3.5 w-3.5 shrink-0 ${theme.text}`} />
                      <span className="truncate">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-3.5 w-3.5 shrink-0 ${theme.text}`} />
                      <span className="truncate">{course.room || 'Belirtilmedi'}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Clock className={`h-3.5 w-3.5 shrink-0 ${theme.text}`} />
                      <span>{course.schedule}</span>
                    </div>
                  </div>
                </div>

                {/* Değerlendirme Kriterleri ve Not Ağırlıkları (Açılır/Kapanır Alan) */}
                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => toggleGradePanel(course.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-violet-200/70 bg-violet-50/50 px-3 py-2 text-left text-xs font-medium text-violet-900 transition hover:bg-violet-100/60 dark:border-violet-400/20 dark:bg-violet-950/20 dark:text-violet-200"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                      <span>
                        Not Ağırlıkları & Harf Notu ({course.assessments?.length || 0} Kriter)
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="font-semibold">
                        {gradeSummary.effectiveScore ?? '—'}/100 ({gradeSummary.finalGrade})
                      </span>
                      {isGradeOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </button>

                  {isGradeOpen && (
                    <div className="mt-2.5 space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/70">
                      {(course.assessments || []).map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-12 items-center gap-1.5 text-xs"
                        >
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleAssessmentFieldChange(
                                course,
                                item.id,
                                'name',
                                e.target.value
                              )
                            }
                            placeholder="Örn: Vize"
                            className="col-span-6 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                          />
                          <div className="col-span-2 flex items-center gap-0.5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.weight}
                              onChange={(e) =>
                                handleAssessmentFieldChange(
                                  course,
                                  item.id,
                                  'weight',
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-center text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            />
                            <span className="text-[10px] text-slate-400">%</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Not"
                            value={item.score ?? ''}
                            onChange={(e) =>
                              handleAssessmentFieldChange(
                                course,
                                item.id,
                                'score',
                                e.target.value
                              )
                            }
                            className="col-span-3 rounded-lg border border-sky-200 bg-white px-2 py-1 text-center text-xs font-semibold text-sky-900 dark:border-sky-400/30 dark:bg-slate-800 dark:text-sky-100"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveAssessmentFromCourse(course, item.id)
                            }
                            className="col-span-1 flex justify-end text-slate-400 hover:text-rose-500"
                            title="Sil"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">
                          Toplam Ağırlık: %{gradeSummary.totalWeight}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddAssessmentToCourse(course)}
                          className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-medium text-sky-900 hover:bg-sky-200 dark:bg-sky-400/20 dark:text-sky-100"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Kriter Ekle</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Önemli Bağlantılar Alanı */}
                <div className="mt-3.5 border-t border-slate-100 pt-3 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      Bağlantılar ({course.links?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveLinkCourseId(
                          activeLinkCourseId === course.id ? null : course.id
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 transition hover:bg-sky-100 hover:text-sky-800 dark:bg-slate-700/70 dark:text-slate-300 dark:hover:bg-sky-400/20 dark:hover:text-sky-200"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Link Ekle</span>
                    </button>
                  </div>

                  {activeLinkCourseId === course.id && (
                    <form
                      onSubmit={(e) => handleLinkSubmit(e, course.id)}
                      className="mt-2.5 space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-900/70"
                    >
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input
                          type="text"
                          required
                          placeholder="Başlık (Örn: Drive)"
                          value={linkForm.title}
                          onChange={(e) =>
                            setLinkForm({ ...linkForm, title: e.target.value })
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                        <input
                          type="text"
                          required
                          placeholder="URL (https://...)"
                          value={linkForm.url}
                          onChange={(e) =>
                            setLinkForm({ ...linkForm, url: e.target.value })
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        />
                        <select
                          value={linkForm.type}
                          onChange={(e) =>
                            setLinkForm({ ...linkForm, type: e.target.value })
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        >
                          {LINK_TYPES.map((lt) => (
                            <option key={lt.id} value={lt.id}>
                              {lt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveLinkCourseId(null)}
                          className="rounded-full px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400"
                        >
                          Vazgeç
                        </button>
                        <button
                          type="submit"
                          className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-medium text-sky-900 hover:bg-sky-200 dark:bg-sky-400/20 dark:text-sky-100"
                        >
                          Ekle
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {!course.links || course.links.length === 0 ? (
                      <span className="text-[11px] text-slate-400">
                        Henüz bağlantı eklenmemiş.
                      </span>
                    ) : (
                      course.links.map((lnk) => {
                        const IconComp = getLinkIcon(lnk.type);
                        return (
                          <div
                            key={lnk.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/90 pl-2.5 pr-1.5 py-1 text-xs text-slate-600 transition hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
                          >
                            <IconComp className={`h-3 w-3 ${theme.text}`} />
                            <a
                              href={lnk.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium hover:text-slate-900 dark:hover:text-white"
                            >
                              <span>{lnk.title}</span>
                              <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                            </a>
                            <button
                              type="button"
                              onClick={() =>
                                onDeleteCourseLink(course.id, lnk.id)
                              }
                              title="Bağlantıyı kaldır"
                              className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
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
