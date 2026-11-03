import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  User,
  Clock,
  MapPin,
  ExternalLink,
  FileText,
  NotebookPen,
  FolderArchive,
  X,
  Check,
  Save,
  Upload,
} from 'lucide-react';
import {
  COURSE_COLOR_THEMES,
  COURSE_TYPES,
  WEEK_DAYS,
} from '../data/initialData';
import { CourseMascotBadge, MASCOT_OPTIONS, CloudMascot } from './MascotIcons';

const EMPTY_COURSE_FORM = {
  code: '',
  name: '',
  courseType: 'mandatory', // 'mandatory' | 'elective'
  credits: 3,
  ects: 5,
  day: 'Salı',
  startTime: '10:00',
  endTime: '12:00',
  instructor: '',
  room: '',
  color: 'blue',
  mascot: 'cloud',
};

export default function CoursesSection({
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onSelectCourseFilter,
  selectedCourseId,
  forceOpenCreateCounter = 0,
  onNotify,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_COURSE_FORM);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'mandatory' | 'elective'

  // Materyal Arşivi A: Sınav PDF'leri ve Çıkmış Sorular form durumu
  const [openPdfFormCourseId, setOpenPdfFormCourseId] = useState(null);
  const [pdfForm, setPdfForm] = useState({
    title: '',
    category: 'Çıkmış Sorular',
    url: '',
    fileName: '',
  });

  // Materyal Arşivi B: Ders Çalışma Notları (Not Defteri & Not Linkleri) durumu
  const [openNoteFormCourseId, setOpenNoteFormCourseId] = useState(null);
  const [noteItemForm, setNoteItemForm] = useState({
    title: '',
    content: '',
    url: '',
  });
  const [draftNotebookByCourse, setDraftNotebookByCourse] = useState({});

  useEffect(() => {
    if (forceOpenCreateCounter > 0) {
      setEditingCourseId(null);
      setFormData(EMPTY_COURSE_FORM);
      setIsFormOpen(true);
    }
  }, [forceOpenCreateCounter]);

  const openCreateForm = () => {
    setEditingCourseId(null);
    setFormData(EMPTY_COURSE_FORM);
    setIsFormOpen(true);
  };

  const openEditForm = (course) => {
    const theme =
      COURSE_COLOR_THEMES[course.color] || COURSE_COLOR_THEMES.blue;
    const parsedCredits =
      course.credits !== undefined && course.credits !== ''
        ? Number(course.credits)
        : 0;
    const parsedEcts =
      course.ects !== undefined && course.ects !== ''
        ? Number(course.ects)
        : parsedCredits;

    setEditingCourseId(course.id);
    setFormData({
      code: course.code || '',
      name: course.name || '',
      courseType:
        course.courseType === 'elective' ? 'elective' : 'mandatory',
      credits: Number.isNaN(parsedCredits) ? 0 : parsedCredits,
      ects: Number.isNaN(parsedEcts) ? 0 : parsedEcts,
      day: course.day || 'Salı',
      startTime: course.startTime || '10:00',
      endTime: course.endTime || '12:00',
      instructor: course.instructor || '',
      room: course.room || '',
      color: course.color || 'blue',
      mascot: course.mascot || theme.mascot || 'cloud',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) return;

    // 0 Kredi ve 0 AKTS ("OC" Online/Ortak dersler için) kesinlikle korunur!
    const rawCredits =
      formData.credits === '' || formData.credits === null
        ? 0
        : Number(formData.credits);
    const rawEcts =
      formData.ects === '' || formData.ects === null
        ? 0
        : Number(formData.ects);

    const safeCredits =
      Number.isFinite(rawCredits) && rawCredits >= 0 ? rawCredits : 0;
    const safeEcts =
      Number.isFinite(rawEcts) && rawEcts >= 0 ? rawEcts : 0;

    const cleanDay = formData.day || 'Pazartesi';
    const cleanStart = formData.startTime || '10:00';
    const cleanEnd = formData.endTime || '12:00';
    const formattedSchedule = `${cleanDay} ${cleanStart} - ${cleanEnd}`;

    const payload = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      courseType:
        formData.courseType === 'elective' ? 'elective' : 'mandatory',
      credits: safeCredits,
      ects: safeEcts,
      day: cleanDay,
      startTime: cleanStart,
      endTime: cleanEnd,
      schedule: formattedSchedule,
      instructor: formData.instructor.trim() || 'Belirtilmedi',
      room: formData.room.trim() || 'Amfi / Online',
      color: formData.color,
      mascot: formData.mascot,
    };

    if (editingCourseId) {
      onUpdateCourse(editingCourseId, payload);
      onNotify && onNotify(`${payload.code} ders bilgileri güncellendi.`);
    } else {
      onAddCourse(payload);
    }

    setIsFormOpen(false);
    setEditingCourseId(null);
    setFormData(EMPTY_COURSE_FORM);
  };

  // --- MATERYAL ARŞİVİ A: SINAV PDF'LERİ VE ÇIKMIŞ SORULAR İŞLEMLERİ ---
  const handleLocalPdfSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfForm((prev) => ({
      ...prev,
      fileName: file.name,
      title: prev.title.trim() ? prev.title : file.name.replace(/\.pdf$/i, ''),
    }));
  };

  const handleAddExamPdf = (e, course) => {
    e.preventDefault();
    if (!pdfForm.title.trim() && !pdfForm.fileName.trim()) return;

    let normalizedUrl = pdfForm.url.trim();
    if (normalizedUrl && !/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const newPdfItem = {
      id: `pdf-${Date.now()}`,
      title: pdfForm.title.trim() || pdfForm.fileName.trim(),
      category: pdfForm.category || 'Çıkmış Sorular',
      url: normalizedUrl,
      fileName: pdfForm.fileName.trim() || '',
      createdAt: new Date().toISOString(),
    };

    const existingPdfs = Array.isArray(course.examPdfs)
      ? course.examPdfs
      : Array.isArray(course.links)
      ? course.links
      : [];

    onUpdateCourse(course.id, {
      examPdfs: [newPdfItem, ...existingPdfs],
    });

    setPdfForm({
      title: '',
      category: 'Çıkmış Sorular',
      url: '',
      fileName: '',
    });
    setOpenPdfFormCourseId(null);
    onNotify &&
      onNotify('Sınav PDF / Çıkmış soru belgesi arşive eklendi.');
  };

  const handleDeleteExamPdf = (course, pdfId) => {
    const existingPdfs = Array.isArray(course.examPdfs)
      ? course.examPdfs
      : Array.isArray(course.links)
      ? course.links
      : [];
    onUpdateCourse(course.id, {
      examPdfs: existingPdfs.filter((item) => item.id !== pdfId),
      links: (course.links || []).filter((item) => item.id !== pdfId),
    });
    onNotify && onNotify('PDF belgesi arşivden kaldırıldı.');
  };

  // --- MATERYAL ARŞİVİ B: DERS ÇALIŞMA NOTLARI İŞLEMLERİ ---
  const handleSaveCourseNotebook = (course) => {
    const nextText =
      draftNotebookByCourse[course.id] !== undefined
        ? draftNotebookByCourse[course.id]
        : course.studyNotesText || '';
    onUpdateCourse(course.id, { studyNotesText: nextText });
    onNotify && onNotify(`${course.code} ders çalışma notları kaydedildi.`);
  };

  const handleAddStudyNoteItem = (e, course) => {
    e.preventDefault();
    if (!noteItemForm.title.trim() && !noteItemForm.content.trim()) return;

    let normalizedUrl = noteItemForm.url.trim();
    if (normalizedUrl && !/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const newItem = {
      id: `note-${Date.now()}`,
      title: noteItemForm.title.trim() || 'Ders Özeti',
      content: noteItemForm.content.trim(),
      url: normalizedUrl,
      createdAt: new Date().toISOString(),
    };

    const existingNotes = Array.isArray(course.studyNoteItems)
      ? course.studyNoteItems
      : [];

    onUpdateCourse(course.id, {
      studyNoteItems: [newItem, ...existingNotes],
    });

    setNoteItemForm({ title: '', content: '', url: '' });
    setOpenNoteFormCourseId(null);
    onNotify && onNotify('Ders çalışma notu eklendi.');
  };

  const handleDeleteStudyNoteItem = (course, noteId) => {
    const existingNotes = Array.isArray(course.studyNoteItems)
      ? course.studyNoteItems
      : [];
    onUpdateCourse(course.id, {
      studyNoteItems: existingNotes.filter((n) => n.id !== noteId),
    });
    onNotify && onNotify('Çalışma notu silindi.');
  };

  const filteredByType = courses.filter((c) => {
    if (typeFilter === 'all') return true;
    const resolvedType =
      c.courseType === 'elective' ? 'elective' : 'mandatory';
    return resolvedType === typeFilter;
  });

  const mandatoryCount = courses.filter(
    (c) => c.courseType !== 'elective'
  ).length;
  const electiveCount = courses.filter(
    (c) => c.courseType === 'elective'
  ).length;

  return (
    <section id="courses-section" className="space-y-4">
      {/* Üst Başlık + Zorunlu/Seçmeli Filtresi + Yeni Ders Ekle */}
      <div className="flex flex-col gap-3 rounded-3xl border border-white/95 bg-white px-5 py-4 shadow-habitz-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFF6FF] text-sky-600 shadow-2xs">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800">
              Ders Yönetimi & Materyal Arşivi (PDF ve Notlar)
            </h2>
            <p className="text-xs text-slate-500">
              Zorunlu ve Seçmeli dersleriniz, Kredi/AKTS (OC 0 Kredi destekli), Sınav PDF arşivi ve çalışma notlarınız
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Zorunlu / Seçmeli Filtre Hapları */}
          <div className="flex items-center rounded-full border border-violet-100 bg-[#F5F3FF] p-1">
            {[
              { id: 'all', label: `Tümü (${courses.length})` },
              { id: 'mandatory', label: `Zorunlu (${mandatoryCount})` },
              { id: 'elective', label: `Seçmeli (${electiveCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  typeFilter === tab.id
                    ? 'bg-[#8B5CF6] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-violet-600"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Ders Ekle</span>
          </button>
        </div>
      </div>

      {/* Yeni / Düzenle Ders Formu */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="rounded-3xl border border-white/95 bg-white p-6 shadow-habitz"
        >
          <div className="flex items-center justify-between border-b border-violet-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800">
              {editingCourseId ? 'Dersi Düzenle' : 'Yeni Ders Oluştur'}
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
            {/* Ders Kodu */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                Ders Kodu * (Örn: MAT101 veya OC101)
              </label>
              <input
                type="text"
                required
                placeholder="Örn: MAT101"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Ders Adı */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600">
                Ders Adı *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Matematik I"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Ders Türü: Sadece Zorunlu veya Seçmeli */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                Ders Türü *
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {Object.values(COURSE_TYPES).map((ct) => {
                  const active = formData.courseType === ct.id;
                  return (
                    <button
                      key={ct.id}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, courseType: ct.id })
                      }
                      className={`rounded-2xl border py-2 text-xs font-extrabold transition ${
                        active
                          ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-2xs'
                          : 'border-violet-100 bg-[#F5F3FF]/60 text-slate-600 hover:bg-[#EDE9FE]'
                      }`}
                    >
                      {ct.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bağımsız Kredi ve AKTS Alanları (0 Kredi & 0 AKTS OC Ders Desteği) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-600">
                  Kredi ve AKTS (OC Dersler İçin 0 Girilebilir)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, credits: 0, ects: 0 })
                  }
                  className="rounded-full border border-[#6EE7B7] bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-900 transition hover:bg-[#D1FAE5]"
                >
                  OC Dersi Yap (0 Kredi / 0 AKTS)
                </button>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="1"
                    required
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits:
                          e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 py-2 pl-3.5 pr-14 text-xs font-extrabold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                    Kredi
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="1"
                    required
                    value={formData.ects}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ects:
                          e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 py-2 pl-3.5 pr-14 text-xs font-extrabold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                    AKTS
                  </span>
                </div>
              </div>
            </div>

            {/* Ders Günü ve Başlangıç/Bitiş Saati */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                Ders Günü
              </label>
              <select
                value={formData.day}
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
              >
                {WEEK_DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600">
                Başlangıç & Bitiş Saati
              </label>
              <div className="mt-1 grid grid-cols-2 gap-1.5">
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                />
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Öğretim Görevlisi ve Derslik */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600">
                Öğretim Görevlisi (İsteğe Bağlı)
              </label>
              <input
                type="text"
                placeholder="Örn: Prof. Dr. Kerem Aydın"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3.5 py-2 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600">
                Derslik / Amfi / Online
              </label>
              <input
                type="text"
                placeholder="Örn: Amfi-2 veya Online (OC)"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/50 px-3.5 py-2 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Sevimli Karakter Maskotu Seçimi */}
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="mb-1.5 block text-[11px] font-bold text-slate-600">
                Dersin Sevimli Maskot Karakteri & Renk Teması
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(COURSE_COLOR_THEMES).map((theme) => {
                  const isSelected = formData.color === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          color: theme.id,
                          mascot: theme.mascot || formData.mascot,
                        })
                      }
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                        isSelected
                          ? `${theme.badge} ring-2 ring-[#8B5CF6]/40`
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
                      <span>{theme.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5 flex flex-wrap gap-2">
                {MASCOT_OPTIONS.map((m) => {
                  const IconComp = m.component;
                  const isSelected = formData.mascot === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, mascot: m.id })}
                      className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-bold transition ${
                        isSelected
                          ? 'border-[#8B5CF6] bg-[#F5F3FF] text-[#8B5CF6] ring-2 ring-[#C4B5FD]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200'
                      }`}
                    >
                      <IconComp className="h-5 w-5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
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
              {editingCourseId ? 'Değişiklikleri Kaydet' : 'Dersi Kaydet'}
            </button>
          </div>
        </form>
      )}

      {/* Ders Bilgi Kartları Grid */}
      {filteredByType.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/95 bg-white p-8 text-center shadow-habitz">
          <CloudMascot className="h-14 w-14" />
          <h3 className="mt-3 text-sm font-extrabold text-slate-800">
            {courses.length === 0
              ? 'Henüz Ders Eklenmemiş'
              : 'Bu Filtrede Ders Bulunamadı'}
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            Sağ üstteki <strong>"Yeni Ders Ekle"</strong> butonuyla Zorunlu veya Seçmeli derslerinizi (0 Kredi/AKTS OC dersler dahil) hemen oluşturabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredByType.map((course) => {
            const theme =
              COURSE_COLOR_THEMES[course.color] || COURSE_COLOR_THEMES.blue;
            const cType =
              COURSE_TYPES[course.courseType] || COURSE_TYPES.mandatory;
            const isFiltered = selectedCourseId === course.id;

            const creditsVal =
              course.credits !== undefined && course.credits !== ''
                ? Number(course.credits)
                : 0;
            const ectsVal =
              course.ects !== undefined && course.ects !== ''
                ? Number(course.ects)
                : creditsVal;

            const examPdfs = Array.isArray(course.examPdfs)
              ? course.examPdfs
              : Array.isArray(course.links)
              ? course.links
              : [];

            const studyNoteItems = Array.isArray(course.studyNoteItems)
              ? course.studyNoteItems
              : [];

            const currentNotebookText =
              draftNotebookByCourse[course.id] !== undefined
                ? draftNotebookByCourse[course.id]
                : course.studyNotesText || '';

            return (
              <div
                key={course.id}
                className={`flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-5 sm:p-6 shadow-habitz transition ${theme.border}`}
              >
                <div>
                  {/* Üst Satır: Sevimli Karakter + Ders Kodu/Adı + Zorunlu/Seçmeli + Kredi & AKTS */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <CourseMascotBadge course={course} size="md" />
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            onClick={() =>
                              onSelectCourseFilter &&
                              onSelectCourseFilter(
                                isFiltered ? 'all' : course.id
                              )
                            }
                            title="Bu derse göre filtrelemek için tıklayın"
                            className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-extrabold ${theme.badge}`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${theme.dot}`}
                            />
                            {course.code}
                          </span>

                          {/* Zorunlu veya Seçmeli Hap Rozeti */}
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${cType.badgeClass}`}
                          >
                            {cType.shortLabel}
                          </span>

                          {/* Bağımsız Kredi ve AKTS Rozetleri (0 Kredi / 0 AKTS OC Desteği) */}
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                            {creditsVal} Kredi
                          </span>
                          <span className="rounded-full bg-[#F5F3FF] px-2.5 py-0.5 text-[11px] font-bold text-[#8B5CF6]">
                            {ectsVal} AKTS
                          </span>
                        </div>

                        <h3 className="mt-1.5 text-base font-extrabold text-slate-800">
                          {course.code} — {course.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditForm(course)}
                        title="Dersi Düzenle"
                        className="rounded-full p-2 text-slate-400 transition hover:bg-violet-50 hover:text-[#8B5CF6]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCourse(course.id)}
                        title="Dersi Sil"
                        className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ders Günü, Saati, Öğretim Görevlisi ve Derslik */}
                  <div className="mt-4 grid grid-cols-1 gap-2 rounded-2xl bg-[#F5F3FF]/50 p-3 text-xs text-slate-600 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Clock className={`h-3.5 w-3.5 shrink-0 ${theme.text}`} />
                      <span className="font-bold text-slate-800">
                        {course.schedule || 'Belirtilmedi'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className={`h-3.5 w-3.5 shrink-0 ${theme.text}`} />
                      <span className="truncate font-medium">
                        {course.instructor || 'Belirtilmedi'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-3.5 w-3.5 shrink-0 ${theme.text}`} />
                      <span className="truncate font-medium">
                        {course.room || 'Amfi / Online'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* =========================================================
                    5. DERS VE SINAV MATERYAL ARŞİVİ (İKİ AYRI ÖZEL BÖLÜM)
                   ========================================================= */}
                <div className="mt-5 space-y-4 border-t-2 border-violet-100/90 pt-4">
                  {/* BÖLÜM A: Sınav PDF'leri ve Çıkmış Sorular */}
                  <div className="rounded-2xl border border-[#FDA4AF]/50 bg-[#FFF1F2]/45 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FFE4E6] text-rose-600">
                          <FolderArchive className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-rose-950">
                            A) Sınav PDF&apos;leri ve Çıkmış Sorular ({examPdfs.length})
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            Çıkmış sorular, sınav hazırlık PDF&apos;leri ve Drive klasör bağlantıları
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenPdfFormCourseId(
                            openPdfFormCourseId === course.id ? null : course.id
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-[#FDA4AF] bg-white px-3 py-1 text-[11px] font-bold text-rose-800 transition hover:bg-[#FFE4E6]"
                      >
                        <Plus className="h-3 w-3" />
                        <span>PDF / Soru Ekle</span>
                      </button>
                    </div>

                    {openPdfFormCourseId === course.id && (
                      <form
                        onSubmit={(e) => handleAddExamPdf(e, course)}
                        className="mt-3 space-y-2.5 rounded-2xl border border-rose-200/80 bg-white p-3.5"
                      >
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            required={!pdfForm.fileName}
                            placeholder="Belge Adı (Örn: 2024 Vize Çıkmış Sorular.pdf)"
                            value={pdfForm.title}
                            onChange={(e) =>
                              setPdfForm({ ...pdfForm, title: e.target.value })
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                          />
                          <select
                            value={pdfForm.category}
                            onChange={(e) =>
                              setPdfForm({
                                ...pdfForm,
                                category: e.target.value,
                              })
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                          >
                            <option value="Çıkmış Sorular">Çıkmış Sorular</option>
                            <option value="Sınav PDF">Sınav Hazırlık PDF</option>
                            <option value="Çözümlü Sorular">Çözümlü Sorular</option>
                            <option value="Drive Klasörü">Google Drive Klasörü</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="PDF / Drive Linki (İsteğe Bağlı: https://...)"
                            value={pdfForm.url}
                            onChange={(e) =>
                              setPdfForm({ ...pdfForm, url: e.target.value })
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                          />

                          <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-rose-300 bg-[#FFF1F2]/60 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-[#FFE4E6]">
                            <Upload className="h-3.5 w-3.5" />
                            <span className="truncate">
                              {pdfForm.fileName || 'Bilgisayardan PDF Dosyası Seç'}
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.zip"
                              onChange={handleLocalPdfSelect}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenPdfFormCourseId(null)}
                            className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                          >
                            Vazgeç
                          </button>
                          <button
                            type="submit"
                            className="rounded-full bg-[#8B5CF6] px-4 py-1 text-[11px] font-bold text-white hover:bg-violet-600"
                          >
                            Arşive Kaydet
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Eklenen Sınav PDF'leri Listesi */}
                    <div className="mt-3 space-y-1.5">
                      {examPdfs.length === 0 ? (
                        <p className="text-[11px] text-slate-400">
                          Henüz sınav PDF&apos;i veya çıkmış soru eklenmemiş.
                        </p>
                      ) : (
                        examPdfs.map((pdf) => (
                          <div
                            key={pdf.id}
                            className="flex items-center justify-between gap-2 rounded-xl border border-white bg-white px-3 py-2 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                              <span className="shrink-0 rounded-full bg-[#FFF1F2] px-2 py-0.5 text-[10px] font-bold text-rose-800">
                                {pdf.category || 'PDF'}
                              </span>
                              {pdf.url ? (
                                <a
                                  href={pdf.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 truncate font-bold text-slate-800 hover:text-[#8B5CF6]"
                                >
                                  <span className="truncate">{pdf.title}</span>
                                  <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                                </a>
                              ) : (
                                <span className="truncate font-bold text-slate-800">
                                  {pdf.title}
                                  {pdf.fileName ? ` (${pdf.fileName})` : ''}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteExamPdf(course, pdf.id)}
                              title="PDF Belgesini Sil"
                              className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Net Ayırıcı Çizgi */}
                  <div className="border-t border-dashed border-violet-200" />

                  {/* BÖLÜM B: Ders Çalışma Notları (Not Defteri & Not Bağlantıları) */}
                  <div className="rounded-2xl border border-[#93C5FD]/60 bg-[#EFF6FF]/45 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#DBEAFE] text-sky-700">
                          <NotebookPen className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-sky-950">
                            B) Ders Çalışma Notları & Özet Defteri ({studyNoteItems.length})
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            Derse ait özetleriniz, önemli formülleriniz ve çalışma notu linkleriniz
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenNoteFormCourseId(
                            openNoteFormCourseId === course.id
                              ? null
                              : course.id
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-[#93C5FD] bg-white px-3 py-1 text-[11px] font-bold text-sky-900 transition hover:bg-[#DBEAFE]"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Not / Link Ekle</span>
                      </button>
                    </div>

                    {/* Hızlı Serbest Çalışma Notu Defteri */}
                    <div className="mt-3 space-y-2">
                      <textarea
                        rows={3}
                        placeholder={`${course.code} dersi için kendi özetlerinizi, önemli formülleri ve hatırlatmaları buraya yazıp kaydedebilirsiniz...`}
                        value={currentNotebookText}
                        onChange={(e) =>
                          setDraftNotebookByCourse({
                            ...draftNotebookByCourse,
                            [course.id]: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-sky-200/80 bg-white p-3 text-xs leading-relaxed text-slate-700 focus:border-[#8B5CF6] focus:outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSaveCourseNotebook(course)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#8B5CF6] px-3.5 py-1 text-[11px] font-bold text-white shadow-2xs transition hover:bg-violet-600"
                        >
                          <Save className="h-3 w-3" />
                          <span>Çalışma Notunu Kaydet</span>
                        </button>
                      </div>
                    </div>

                    {/* Başlıklı Çalışma Notu / Link Ekleme Formu */}
                    {openNoteFormCourseId === course.id && (
                      <form
                        onSubmit={(e) => handleAddStudyNoteItem(e, course)}
                        className="mt-3 space-y-2.5 rounded-2xl border border-sky-200 bg-white p-3.5"
                      >
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            required
                            placeholder="Not Başlığı (Örn: Hafta 3 Türev Özeti)"
                            value={noteItemForm.title}
                            onChange={(e) =>
                              setNoteItemForm({
                                ...noteItemForm,
                                title: e.target.value,
                              })
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Not / Notion / Drive Linki (İsteğe Bağlı)"
                            value={noteItemForm.url}
                            onChange={(e) =>
                              setNoteItemForm({
                                ...noteItemForm,
                                url: e.target.value,
                              })
                            }
                            className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Kısa formül veya özet açıklama..."
                          value={noteItemForm.content}
                          onChange={(e) =>
                            setNoteItemForm({
                              ...noteItemForm,
                              content: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenNoteFormCourseId(null)}
                            className="rounded-full px-3 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                          >
                            Vazgeç
                          </button>
                          <button
                            type="submit"
                            className="rounded-full bg-[#8B5CF6] px-4 py-1 text-[11px] font-bold text-white hover:bg-violet-600"
                          >
                            Not Maddesini Ekle
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Başlıklı Çalışma Notu Maddeleri Listesi */}
                    {studyNoteItems.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t border-sky-200/60 pt-2.5">
                        {studyNoteItems.map((note) => (
                          <div
                            key={note.id}
                            className="flex items-start justify-between gap-2 rounded-xl border border-white bg-white px-3 py-2 text-xs shadow-2xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                {note.url ? (
                                  <a
                                    href={note.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-bold text-sky-900 hover:text-[#8B5CF6]"
                                  >
                                    <span>{note.title}</span>
                                    <ExternalLink className="h-3 w-3 text-slate-400" />
                                  </a>
                                ) : (
                                  <span className="font-bold text-slate-800">
                                    {note.title}
                                  </span>
                                )}
                              </div>
                              {note.content && (
                                <p className="mt-0.5 text-[11px] text-slate-600">
                                  {note.content}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteStudyNoteItem(course, note.id)
                              }
                              title="Notu Sil"
                              className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
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
