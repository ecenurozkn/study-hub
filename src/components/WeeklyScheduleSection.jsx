import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  BookOpen,
} from 'lucide-react';
import {
  COURSE_COLOR_THEMES,
  COURSE_TYPES,
  WEEK_DAYS,
} from '../data/initialData';
import { CourseMascotBadge, CloudMascot, StarMascot } from './MascotIcons';

/**
 * Dersin gününü ve başlangıç saatini ayrıştırır.
 * Hem yeni yapılandırılmış alanları (course.day, course.startTime, course.endTime)
 * hem de eski metin formatını (örn. "Salı 10:00 - 12:00") destekler.
 */
export function parseCourseSchedule(course) {
  let day = course.day || '';
  let startTime = course.startTime || '';
  let endTime = course.endTime || '';

  if (!day && course.schedule) {
    const foundDay = WEEK_DAYS.find((d) =>
      course.schedule.toLowerCase().includes(d.toLowerCase())
    );
    if (foundDay) day = foundDay;
  }

  if (!startTime && course.schedule) {
    const timeMatch = course.schedule.match(/(\d{1,2}:\d{2})(?:\s*-\s*(\d{1,2}:\d{2}))?/);
    if (timeMatch) {
      startTime = timeMatch[1].padStart(5, '0');
      if (timeMatch[2]) endTime = timeMatch[2].padStart(5, '0');
    }
  }

  const displayTime =
    startTime && endTime
      ? `${startTime} - ${endTime}`
      : startTime || course.schedule || 'Saat Belirtilmedi';

  const sortMinutes = (() => {
    if (!startTime) return 9999;
    const [h, m] = startTime.split(':').map(Number);
    if (Number.isNaN(h)) return 9999;
    return h * 60 + (Number.isNaN(m) ? 0 : m);
  })();

  return {
    day: day || 'Pazartesi',
    startTime: startTime || '09:00',
    endTime: endTime || '11:00',
    displayTime,
    sortMinutes,
  };
}

export default function WeeklyScheduleSection({
  courses = [],
  onSelectCourse,
  onOpenAddCourse,
}) {
  const [selectedDayMobile, setSelectedDayMobile] = useState('ALL');

  const scheduleByDay = useMemo(() => {
    const map = {};
    WEEK_DAYS.forEach((d) => {
      map[d] = [];
    });

    courses.forEach((course) => {
      const parsed = parseCourseSchedule(course);
      const targetDay = WEEK_DAYS.includes(parsed.day)
        ? parsed.day
        : 'Pazartesi';
      map[targetDay].push({
        course,
        ...parsed,
      });
    });

    WEEK_DAYS.forEach((d) => {
      map[d].sort((a, b) => a.sortMinutes - b.sortMinutes);
    });

    return map;
  }, [courses]);

  const visibleDaysMobile =
    selectedDayMobile === 'ALL' ? WEEK_DAYS : [selectedDayMobile];

  return (
    <section id="schedule-section" className="space-y-4">
      {/* Üst Başlık Kartı */}
      <div className="flex flex-col gap-3 rounded-3xl border border-white/95 bg-white px-5 py-4 shadow-habitz-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#8B5CF6]">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800">
              Haftalık Ders Programı (Schedule)
            </h2>
            <p className="text-xs text-slate-500">
              Pazartesi – Cumartesi günlerine ve saat sırasına göre dizilmiş ders akışınız
            </p>
          </div>
        </div>

        {onOpenAddCourse && (
          <button
            type="button"
            onClick={onOpenAddCourse}
            className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-violet-600 sm:self-center"
          >
            <Plus className="h-4 w-4" />
            <span>Programa Ders Ekle</span>
          </button>
        )}
      </div>

      {/* Mobil / Tablet İçin Gün Seçici Yatay Kaydırılabilir Sekmeler */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:hidden">
        <button
          type="button"
          onClick={() => setSelectedDayMobile('ALL')}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
            selectedDayMobile === 'ALL'
              ? 'bg-[#8B5CF6] text-white shadow-xs'
              : 'border border-white bg-white/90 text-slate-600 hover:bg-white'
          }`}
        >
          Tüm Hafta ({courses.length})
        </button>
        {WEEK_DAYS.map((day) => {
          const count = scheduleByDay[day]?.length || 0;
          const isActive = selectedDayMobile === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDayMobile(day)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                isActive
                  ? 'bg-[#8B5CF6] text-white shadow-xs'
                  : 'border border-white bg-white/90 text-slate-600 hover:bg-white'
              }`}
            >
              <span>{day}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-violet-100 text-[#8B5CF6]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ders Yoksa Sevimli Maskotlu Boş Durum */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/95 bg-white p-8 text-center shadow-habitz">
          <CloudMascot className="h-14 w-14" />
          <h3 className="mt-3 text-sm font-extrabold text-slate-800">
            Haftalık Programınız Henüz Boş
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-500">
            Derslerinizi gün ve saat bilgileriyle (örn. Salı 10:00 - 12:00) eklediğinizde burada otomatik olarak saat sırasına göre dizilir.
          </p>
          {onOpenAddCourse && (
            <button
              type="button"
              onClick={onOpenAddCourse}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-violet-600"
            >
              <Plus className="h-4 w-4" />
              <span>İlk Dersinizi Ekleyin</span>
            </button>
          )}
        </div>
      ) : (
        /* Masaüstünde Yan Yana 6 Ferah Kolon, Mobilde Seçili Gün veya Akış */
        <div
          className={`grid grid-cols-1 gap-3.5 ${
            selectedDayMobile === 'ALL'
              ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
              : 'max-w-xl'
          }`}
        >
          {visibleDaysMobile.map((day) => {
            const dayItems = scheduleByDay[day] || [];
            return (
              <div
                key={day}
                className="flex flex-col rounded-3xl border border-white/95 bg-white p-4 shadow-habitz"
              >
                {/* Gün Başlığı */}
                <div className="flex items-center justify-between border-b border-violet-100/80 pb-2.5">
                  <span className="text-xs font-extrabold tracking-tight text-slate-800">
                    {day}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      dayItems.length > 0
                        ? 'bg-[#F5F3FF] text-[#8B5CF6]'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {dayItems.length} Ders
                  </span>
                </div>

                {/* O Güne Ait Saat Sıralı Dersler */}
                {dayItems.length === 0 ? (
                  <div className="my-auto flex flex-col items-center justify-center py-7 text-center">
                    <StarMascot className="h-8 w-8 opacity-65" />
                    <span className="mt-1.5 text-[11px] font-medium text-slate-400">
                      Bu gün ders yok
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2.5">
                    {dayItems.map(({ course, displayTime }) => {
                      const theme =
                        COURSE_COLOR_THEMES[course.color] ||
                        COURSE_COLOR_THEMES.blue;
                      const cType =
                        COURSE_TYPES[course.courseType] ||
                        COURSE_TYPES.mandatory;
                      const creditsVal =
                        course.credits !== undefined && course.credits !== ''
                          ? Number(course.credits)
                          : 0;
                      const ectsVal =
                        course.ects !== undefined && course.ects !== ''
                          ? Number(course.ects)
                          : creditsVal;

                      return (
                        <div
                          key={course.id}
                          onClick={() =>
                            onSelectCourse && onSelectCourse(course.id)
                          }
                          role={onSelectCourse ? 'button' : undefined}
                          tabIndex={onSelectCourse ? 0 : undefined}
                          onKeyDown={(e) => {
                            if (
                              onSelectCourse &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              onSelectCourse(course.id);
                            }
                          }}
                          className={`group rounded-2xl border border-violet-100/80 p-3 transition hover:-translate-y-0.5 hover:border-[#8B5CF6] ${
                            theme.pillGradient
                          } ${onSelectCourse ? 'cursor-pointer' : ''}`}
                        >
                          {/* Saat Rozeti */}
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-[#8B5CF6] shadow-2xs">
                              <Clock className="h-2.5 w-2.5" />
                              <span>{displayTime}</span>
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${cType.badgeClass}`}
                            >
                              {cType.shortLabel}
                            </span>
                          </div>

                          {/* Maskot + Ders Kodu ve Adı */}
                          <div className="mt-2 flex items-start gap-2">
                            <CourseMascotBadge course={course} size="xs" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-extrabold text-slate-800">
                                {course.code}
                              </p>
                              <p className="line-clamp-2 text-[11px] font-medium leading-snug text-slate-600">
                                {course.name}
                              </p>
                            </div>
                          </div>

                          {/* Alt Bilgi: Derslik ve Kredi/AKTS */}
                          <div className="mt-2 flex items-center justify-between border-t border-slate-200/50 pt-1.5 text-[10px] text-slate-500">
                            <span className="inline-flex items-center gap-1 truncate">
                              <MapPin className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                              <span className="truncate">
                                {course.room || 'Amfi'}
                              </span>
                            </span>
                            <span className="shrink-0 font-bold text-slate-600">
                              {creditsVal} Kr • {ectsVal} AKTS
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
