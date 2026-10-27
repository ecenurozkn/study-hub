import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  Clock,
  Trash2,
  Pencil,
  CheckCircle2,
  CircleDot,
  Circle,
  X,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';
import { getCountdownInfo, formatTurkishDateTime } from '../utils/dateUtils';

const PRIORITY_CONFIG = {
  high: {
    label: 'Öncelikli',
    badge:
      'bg-rose-100/80 text-rose-800 border-rose-200/90 dark:bg-rose-400/15 dark:text-rose-200 dark:border-rose-400/30',
  },
  medium: {
    label: 'Orta',
    badge:
      'bg-violet-100/80 text-violet-800 border-violet-200/90 dark:bg-violet-400/15 dark:text-violet-200 dark:border-violet-400/30',
  },
  low: {
    label: 'Normal',
    badge:
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  },
};

const STATUS_OPTIONS = [
  {
    id: 'todo',
    label: 'Yapılacak',
    icon: Circle,
    pillClass:
      'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
    activeClass:
      'border-slate-300 bg-slate-200/80 text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100',
  },
  {
    id: 'in_progress',
    label: 'Devam Ediyor',
    icon: CircleDot,
    pillClass:
      'border-slate-200 bg-slate-50 text-slate-500 hover:border-sky-200 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
    activeClass:
      'border-sky-200 bg-sky-100/90 text-sky-900 dark:border-sky-400/35 dark:bg-sky-400/20 dark:text-sky-100',
  },
  {
    id: 'done',
    label: 'Teslim Edildi',
    icon: CheckCircle2,
    pillClass:
      'border-slate-200 bg-slate-50 text-slate-500 hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
    activeClass:
      'border-emerald-200 bg-emerald-100/90 text-emerald-900 dark:border-emerald-400/35 dark:bg-emerald-400/20 dark:text-emerald-100',
  },
];

export default function AssignmentsSection({
  assignments,
  courses,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const defaultDue = () => {
    const d = new Date(Date.now() + 48 * 3600 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T23:59`;
  };

  const [formData, setFormData] = useState({
    courseId: courses[0]?.id || '',
    title: '',
    description: '',
    dueDate: defaultDue(),
    priority: 'high',
    status: 'todo',
  });

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({
      courseId: courses[0]?.id || '',
      title: '',
      description: '',
      dueDate: defaultDue(),
      priority: 'high',
      status: 'todo',
    });
    setIsFormOpen(true);
  };

  const openEditForm = (asg) => {
    setEditingId(asg.id);
    setFormData({
      courseId: asg.courseId,
      title: asg.title,
      description: asg.description || '',
      dueDate: asg.dueDate,
      priority: asg.priority || 'medium',
      status: asg.status || 'todo',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.courseId) return;

    const payload = {
      courseId: formData.courseId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
    };

    if (editingId) {
      onUpdateAssignment(editingId, payload);
    } else {
      onAddAssignment(payload);
    }

    setIsFormOpen(false);
    setEditingId(null);
  };

  const filteredAssignments = [...assignments]
    .filter((a) => (statusFilter === 'all' ? true : a.status === statusFilter))
    .sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  return (
    <section className="space-y-4">
      {/* Başlık + Durum Filtresi + Yeni Ödev */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100/80 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Ödev ve Proje Takipçisi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Teslim tarihine kalan süre sayaçları ve tamamlanma durumları
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-slate-200/90 bg-white p-1 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'todo', label: 'Yapılacak' },
              { id: 'in_progress', label: 'Devam Ediyor' },
              { id: 'done', label: 'Teslim Edildi' },
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
            onClick={openCreateForm}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-100/90 px-4 py-1.5 text-xs font-medium text-sky-900 shadow-sm transition hover:bg-sky-200/80 dark:border-sky-400/30 dark:bg-sky-400/20 dark:text-sky-100"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Yeni Ödev Ekle</span>
          </button>
        </div>
      </div>

      {/* Ödev Ekle / Düzenle Formu */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700/70">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {editingId ? 'Ödevi Düzenle' : 'Yeni Ödev / Proje Ekle'}
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
                İlgili Ders *
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

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Ödev / Proje Başlığı *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: AVL Ağacı Performans Analizi Raporu"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Son Teslim Tarihi ve Saati *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Açıklama / Teslim Notu
              </label>
              <input
                type="text"
                placeholder="Örn: PDF rapor + kaynak kod zip dosyası yüklenecek"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Önem Derecesi
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                <option value="high">Öncelikli</option>
                <option value="medium">Orta</option>
                <option value="low">Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Durum
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                <option value="todo">Yapılacak</option>
                <option value="in_progress">Devam Ediyor</option>
                <option value="done">Teslim Edildi</option>
              </select>
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
              {editingId ? 'Güncelle' : 'Ödevi Kaydet'}
            </button>
          </div>
        </form>
      )}

      {/* Ödev Kartları Listesi */}
      {filteredAssignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Seçili filtreye uygun ödev bulunamadı.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((asg) => {
            const course = courses.find((c) => c.id === asg.courseId);
            const theme =
              COURSE_COLOR_THEMES[course?.color] || COURSE_COLOR_THEMES.blue;
            const countdown = getCountdownInfo(
              asg.dueDate,
              asg.status === 'done'
            );
            const priorityInfo =
              PRIORITY_CONFIG[asg.priority] || PRIORITY_CONFIG.medium;

            return (
              <div
                key={asg.id}
                className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition dark:bg-slate-800/60 ${
                  asg.status === 'done'
                    ? 'border-slate-200/60 opacity-75 dark:border-slate-800'
                    : 'border-slate-200/80 hover:border-slate-300 dark:border-slate-700/70'
                }`}
              >
                <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${theme.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                        {course?.code || 'DERS'}
                      </span>

                      {/* Dinamik Kalan Süre Sayacı */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium ${countdown.badgeClass}`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>{countdown.label}</span>
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${priorityInfo.badge}`}
                      >
                        {priorityInfo.label}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-semibold sm:text-base ${
                        asg.status === 'done'
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {asg.title}
                    </h3>

                    {asg.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {asg.description}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-400">
                      Teslim: <span className="font-medium text-slate-600 dark:text-slate-300">{formatTurkishDateTime(asg.dueDate)}</span>
                    </p>
                  </div>

                  {/* Durum Hapları + Düzenle/Sil */}
                  <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
                    <div className="flex items-center gap-1.5">
                      {STATUS_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = asg.status === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              onUpdateAssignment(asg.id, { status: opt.id })
                            }
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                              active ? opt.activeClass : opt.pillClass
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1 border-l border-slate-100 pl-2 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => openEditForm(asg)}
                        title="Ödevi Düzenle"
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAssignment(asg.id)}
                        title="Ödevi Sil"
                        className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
