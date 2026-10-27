import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  CheckCircle2,
  RotateCw,
  AlertOctagon,
  Trash2,
  BookmarkCheck,
  X,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';

const TOPIC_STATUSES = [
  {
    id: 'studied',
    label: 'Çalışıldı',
    icon: CheckCircle2,
    activeClass:
      'border-emerald-200 bg-emerald-100/90 text-emerald-900 dark:border-emerald-400/35 dark:bg-emerald-400/20 dark:text-emerald-100',
    idleClass:
      'border-slate-200 bg-slate-50 text-slate-500 hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
  },
  {
    id: 'review',
    label: 'Tekrar Edilecek',
    icon: RotateCw,
    activeClass:
      'border-violet-200 bg-violet-100/90 text-violet-900 dark:border-violet-400/35 dark:bg-violet-400/20 dark:text-violet-100',
    idleClass:
      'border-slate-200 bg-slate-50 text-slate-500 hover:border-violet-200 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
  },
  {
    id: 'missing',
    label: 'Eksik / Anlaşılmadı',
    icon: AlertOctagon,
    activeClass:
      'border-rose-200 bg-rose-100/90 text-rose-900 dark:border-rose-400/35 dark:bg-rose-400/20 dark:text-rose-100',
    idleClass:
      'border-slate-200 bg-slate-50 text-slate-500 hover:border-rose-200 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
  },
];

export default function StudyTrackerSection({
  topics,
  courses,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    courseId: courses[0]?.id || '',
    unit: 'Ünite 1',
    title: '',
    notes: '',
    status: 'missing',
    inExamScope: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.courseId) return;

    onAddTopic({
      courseId: formData.courseId,
      unit: formData.unit.trim() || 'Genel',
      title: formData.title.trim(),
      notes: formData.notes.trim(),
      status: formData.status,
      inExamScope: Boolean(formData.inExamScope),
    });

    setFormData({
      ...formData,
      title: '',
      notes: '',
    });
    setIsFormOpen(false);
  };

  const filteredTopics = topics.filter((t) =>
    statusFilter === 'all' ? true : t.status === statusFilter
  );

  return (
    <section className="space-y-4">
      {/* Başlık + Filtre + Yeni Konu Ekle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              "Neleri Çalışmalıyım?" Çalışma Planı
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ders müfredatlarını (Syllabus) Çalışıldı, Tekrar Edilecek veya Eksik/Anlaşılmadı olarak yönetin
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-slate-200/90 bg-white p-1 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'missing', label: 'Eksik' },
              { id: 'review', label: 'Tekrar' },
              { id: 'studied', label: 'Çalışıldı' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  statusFilter === st.id
                    ? 'bg-sky-100 text-sky-900 dark:bg-sky-400/20 dark:text-sky-100'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                courseId: prev.courseId || courses[0]?.id || '',
              }));
              setIsFormOpen(!isFormOpen);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-100/90 px-4 py-1.5 text-xs font-medium text-sky-900 shadow-sm transition hover:bg-sky-200/80 dark:border-sky-400/30 dark:bg-sky-400/20 dark:text-sky-100"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Konu Ekle</span>
          </button>
        </div>
      </div>

      {/* Yeni Konu Ekleme Formu */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700/70">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Yeni Müfredat Konusu (Syllabus) Ekle
            </h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
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
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
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
                Ünite / Hafta
              </label>
              <input
                type="text"
                placeholder="Örn: Ünite 4 veya Hafta 7"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Konu Başlığı *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Green Teoremi ve Çizgi İntegralleri"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Çalışma Notu
              </label>
              <input
                type="text"
                placeholder="Örn: Kapalı eğri yönelimi örnekleri çözülecek"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Mevcut Durum
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                <option value="missing">Eksik / Anlaşılmadı</option>
                <option value="review">Tekrar Edilecek</option>
                <option value="studied">Çalışıldı</option>
              </select>
            </div>

            <div className="flex items-end pb-1">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.inExamScope}
                  onChange={(e) =>
                    setFormData({ ...formData, inExamScope: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-300"
                />
                <span>Sınav kapsamında</span>
              </label>
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
              Konuyu Ekle
            </button>
          </div>
        </form>
      )}

      {/* Ders Bazlı Gruplanmış Konu Listeleri */}
      <div className="space-y-4">
        {courses.map((course) => {
          const courseTopics = filteredTopics.filter(
            (t) => t.courseId === course.id
          );
          const allCourseTopics = topics.filter((t) => t.courseId === course.id);
          if (courseTopics.length === 0 && statusFilter !== 'all') return null;

          const theme =
            COURSE_COLOR_THEMES[course.color] || COURSE_COLOR_THEMES.blue;
          const studiedInCourse = allCourseTopics.filter(
            (t) => t.status === 'studied'
          ).length;
          const progressPct =
            allCourseTopics.length > 0
              ? Math.round((studiedInCourse / allCourseTopics.length) * 100)
              : 0;

          return (
            <div
              key={course.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-slate-800/60"
            >
              {/* Ders Başlığı ve Mine Yeşili İlerleme Çubuğu */}
              <div className="flex flex-col gap-2.5 border-b border-slate-100 pb-3.5 dark:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium ${theme.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                    {course.code}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {course.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-emerald-300 dark:bg-emerald-400 transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
                    %{progressPct} ({studiedInCourse}/{allCourseTopics.length})
                  </span>
                </div>
              </div>

              {/* Konu Satırları */}
              {courseTopics.length === 0 ? (
                <p className="mt-3 text-xs text-slate-400">
                  Bu ders için henüz konu eklenmemiş.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-700/50">
                  {courseTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex flex-col gap-2.5 py-3 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-700/70 dark:text-slate-300">
                            {topic.unit}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              topic.status === 'studied'
                                ? 'text-slate-400 line-through dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            {topic.title}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateTopic(topic.id, {
                                inExamScope: !topic.inExamScope,
                              })
                            }
                            title="Sınav kapsamı durumunu değiştir"
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition ${
                              topic.inExamScope
                                ? 'border-violet-200 bg-violet-100/70 text-violet-800 dark:border-violet-400/30 dark:bg-violet-400/15 dark:text-violet-200'
                                : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800'
                            }`}
                          >
                            <BookmarkCheck className="h-3 w-3" />
                            <span>
                              {topic.inExamScope
                                ? 'Sınav Kapsamında'
                                : 'Kapsam Dışı'}
                            </span>
                          </button>
                        </div>

                        {topic.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {topic.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {TOPIC_STATUSES.map((st) => {
                          const Icon = st.icon;
                          const isActive = topic.status === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() =>
                                onUpdateTopic(topic.id, { status: st.id })
                              }
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                                isActive ? st.activeClass : st.idleClass
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span>{st.label}</span>
                            </button>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => onDeleteTopic(topic.id)}
                          title="Konuyu Sil"
                          className="ml-1 rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
