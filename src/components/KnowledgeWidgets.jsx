import React, { useState } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  Plus,
  X,
  Trash2,
  BookOpen,
  Sigma,
} from 'lucide-react';
import { COURSE_COLOR_THEMES } from '../data/initialData';

const PALETTE_STYLES = {
  sky: {
    card: 'border-sky-200/85 bg-sky-50/50 hover:border-sky-300 dark:border-sky-400/25 dark:bg-sky-950/20 dark:hover:border-sky-400/50',
    symbol: 'bg-sky-100/90 text-sky-800 border-sky-200 dark:bg-sky-400/20 dark:text-sky-200 dark:border-sky-400/30',
    formula: 'border-sky-200/80 bg-white/90 text-sky-950 dark:border-sky-400/20 dark:bg-slate-900/80 dark:text-sky-100',
    action: 'text-sky-700 dark:text-sky-300',
  },
  mint: {
    card: 'border-emerald-200/85 bg-emerald-50/50 hover:border-emerald-300 dark:border-emerald-400/25 dark:bg-emerald-950/20 dark:hover:border-emerald-400/50',
    symbol: 'bg-emerald-100/90 text-emerald-800 border-emerald-200 dark:bg-emerald-400/20 dark:text-emerald-200 dark:border-emerald-400/30',
    formula: 'border-emerald-200/80 bg-white/90 text-emerald-950 dark:border-emerald-400/20 dark:bg-slate-900/80 dark:text-emerald-100',
    action: 'text-emerald-700 dark:text-emerald-300',
  },
  lilac: {
    card: 'border-violet-200/85 bg-violet-50/50 hover:border-violet-300 dark:border-violet-400/25 dark:bg-violet-950/20 dark:hover:border-violet-400/50',
    symbol: 'bg-violet-100/90 text-violet-800 border-violet-200 dark:bg-violet-400/20 dark:text-violet-200 dark:border-violet-400/30',
    formula: 'border-violet-200/80 bg-white/90 text-violet-950 dark:border-violet-400/20 dark:bg-slate-900/80 dark:text-violet-100',
    action: 'text-violet-700 dark:text-violet-300',
  },
  blush: {
    card: 'border-rose-200/85 bg-rose-50/50 hover:border-rose-300 dark:border-rose-400/25 dark:bg-rose-950/20 dark:hover:border-rose-400/50',
    symbol: 'bg-rose-100/90 text-rose-800 border-rose-200 dark:bg-rose-400/20 dark:text-rose-200 dark:border-rose-400/30',
    formula: 'border-rose-200/80 bg-white/90 text-rose-950 dark:border-rose-400/20 dark:bg-slate-900/80 dark:text-rose-100',
    action: 'text-rose-700 dark:text-rose-300',
  },
};

export default function KnowledgeWidgets({
  knowledgeCards = [],
  courses = [],
  exams = [],
  onSelectCard,
  onAddKnowledgeCard,
  onDeleteKnowledgeCard,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterCourseId, setFilterCourseId] = useState('all');
  const [form, setForm] = useState({
    courseId: courses[0]?.id || '',
    category: 'Kritik Formül',
    symbol: '∑ f(x)',
    title: '',
    formula: '',
    summary: '',
    palette: 'lilac',
  });

  const visibleCards = knowledgeCards.filter(
    (card) => filterCourseId === 'all' || card.courseId === filterCourseId
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.formula.trim()) return;
    const relatedExam = exams.find((ex) => ex.courseId === form.courseId);
    onAddKnowledgeCard({
      courseId: form.courseId || courses[0]?.id || '',
      examId: relatedExam?.id || '',
      category: form.category.trim() || 'Formül Notu',
      symbol: form.symbol.trim() || 'f(x)',
      title: form.title.trim(),
      formula: form.formula.trim(),
      summary: form.summary.trim() || 'Sınav cheatsheet özeti.',
      palette: form.palette || 'lilac',
    });
    setForm({
      courseId: courses[0]?.id || '',
      category: 'Kritik Formül',
      symbol: '∑ f(x)',
      title: '',
      formula: '',
      summary: '',
      palette: 'lilac',
    });
    setIsAddOpen(false);
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/60">
      {/* Üst Başlık ve Filtreler */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100/90 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200">
            <Sigma className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Hızlı Bilgi ve Formül Kartları (Knowledge Widgets)
              </h2>
              <span className="rounded-full border border-emerald-200/80 bg-emerald-100/70 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200">
                {visibleCards.length} Kart
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cheatsheet ve ders notlarından kritik formüller — karta tıklayarak doğrudan ilgili dersin sınav notuna gidin
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCourseId}
            onChange={(e) => setFilterCourseId(e.target.value)}
            className="rounded-full border border-slate-200/90 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="all">Tüm Dersler</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                courseId: prev.courseId || courses[0]?.id || '',
              }));
              setIsAddOpen(!isAddOpen);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-100/90 px-3.5 py-1.5 text-xs font-medium text-sky-900 transition hover:bg-sky-200/80 dark:border-sky-400/30 dark:bg-sky-400/20 dark:text-sky-100"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Formül Kartı Ekle</span>
          </button>
        </div>
      </div>

      {/* Yeni Formül Bilgi Kartı Ekleme Formu */}
      {isAddOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/60"
        >
          <div className="flex items-center justify-between pb-2.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Yeni Hızlı Bilgi / Formül Kartı Oluştur
            </span>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              required
              placeholder="Başlık (Örn: Bayes Teoremi)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />

            <input
              type="text"
              placeholder="Sembol (Örn: P(A|B))"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />

            <select
              value={form.palette}
              onChange={(e) => setForm({ ...form, palette: e.target.value })}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="sky">Bebek Mavisi (Baby Blue)</option>
              <option value="mint">Mine Yeşili (Mint Green)</option>
              <option value="lilac">Lila / Lavanta (Lilac)</option>
              <option value="blush">Açık Pembe (Soft Blush)</option>
            </select>

            <input
              type="text"
              required
              placeholder="Formül (Örn: P(A|B) = P(B|A)·P(A) / P(B))"
              value={form.formula}
              onChange={(e) => setForm({ ...form, formula: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />

            <input
              type="text"
              placeholder="Kısa açıklama / ipucu..."
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="rounded-full px-3 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-full bg-sky-100 px-3.5 py-1 text-xs font-medium text-sky-900 hover:bg-sky-200 dark:bg-sky-400/20 dark:text-sky-100"
            >
              Kartı Kaydet
            </button>
          </div>
        </form>
      )}

      {/* Yatay Kaydırılabilir & Grid Bilgi Kartları */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((card) => {
          const course = courses.find((c) => c.id === card.courseId);
          const cTheme =
            COURSE_COLOR_THEMES[course?.color] || COURSE_COLOR_THEMES.blue;
          const pStyle = PALETTE_STYLES[card.palette] || PALETTE_STYLES.lilac;

          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCard(card);
                }
              }}
              className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${pStyle.card}`}
            >
              <div>
                {/* Üst Satır: Ders Rozeti + Sembol Rozeti + Sil */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cTheme.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cTheme.dot}`} />
                      {course?.code || 'DERS'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {card.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${pStyle.symbol}`}
                    >
                      {card.symbol}
                    </span>
                    {onDeleteKnowledgeCard && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteKnowledgeCard(card.id);
                        }}
                        title="Kartı Sil"
                        className="rounded-full p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-rose-100/70 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Başlık */}
                <h3 className="mt-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {card.title}
                </h3>

                {/* Formül Kutusu */}
                <div
                  className={`mt-2 rounded-xl border px-3 py-2 font-mono text-xs font-medium ${pStyle.formula}`}
                >
                  {card.formula}
                </div>

                {/* Açıklama */}
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {card.summary}
                </p>
              </div>

              {/* Alt Aksiyon: Cheatsheet / Nota Git */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5 dark:border-slate-700/50">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <BookOpen className="h-3 w-3" />
                  <span>{course?.name || 'Ders Notu'}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold transition group-hover:translate-x-0.5 ${pStyle.action}`}
                >
                  <span>Cheatsheet'e Git</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
