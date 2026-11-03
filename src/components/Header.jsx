import React from 'react';
import {
  Home,
  BookOpen,
  CalendarDays,
  FileSpreadsheet,
  User,
  LogOut,
} from 'lucide-react';
import { FlameMascot } from './MascotIcons';

export const DOCK_NAV_ITEMS = [
  { id: 'all', label: 'Genel Bakış', emoji: '🏠', icon: Home },
  { id: 'courses', label: 'Ders & Arşiv', emoji: '📚', icon: BookOpen },
  { id: 'schedule', label: 'Program', emoji: '🗓️', icon: CalendarDays },
  { id: 'exams', label: 'Sınavlar', emoji: '📝', icon: FileSpreadsheet },
  { id: 'profile', label: 'Profil', emoji: '👤', icon: User },
];

export default function Header({
  currentUser,
  onSignOut,
  activeTab,
  setActiveTab,
}) {
  const displayName =
    currentUser?.name?.trim() ||
    (currentUser?.email ? currentUser.email.split('@')[0] : 'Ece Nur');

  const avatarLetter = (currentUser?.email || displayName || 'E')
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* 2. MİNİMALİST VE SEVİMLİ YENİ ÜST BAŞLIK (TEK SATIRLIK FERAH KARŞILAMA) */}
      <header className="w-full pt-5 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          {/* Sol: Minik Sevimli Gülümseyen Alev Maskotu + Merhaba Başlığı + Alt Yazı */}
          <div
            onClick={() => setActiveTab('all')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveTab('all');
              }
            }}
            className="flex cursor-pointer items-center gap-3 group"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-xs ring-1 ring-purple-100 transition-transform group-hover:scale-105">
              <FlameMascot className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-800 sm:text-lg">
                Merhaba, {displayName} ✨
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Bugün neye odaklanıyoruz?
              </p>
            </div>
          </div>

          {/* Sağ: Kullanıcının E-posta Avatarı ve Zarif Mini "Çıkış Yap" Butonu */}
          {currentUser && (
            <div className="flex items-center gap-2 rounded-full bg-white/75 backdrop-blur-md pl-2 pr-2 py-1.5 shadow-xs ring-1 ring-purple-100/90">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                title={currentUser.email}
                className="flex items-center gap-2 text-left"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-extrabold text-purple-700">
                  {avatarLetter}
                </div>
                <span className="hidden max-w-[160px] truncate text-xs font-bold text-slate-700 sm:inline-block">
                  {currentUser.email}
                </span>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                title="Oturumu Kapat (Çıkış Yap)"
                className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700 transition hover:bg-rose-100"
              >
                <LogOut className="h-3 w-3" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 3. TEK VE MERKEZİ GEZİNME: ALTTAKİ YÜZEN MENÜ (FLOATING DOCK BAR) */}
      <nav
        aria-label="Ana Yüzen Menü"
        className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 rounded-full border border-white/90 bg-white/90 px-2.5 py-2 shadow-habitz backdrop-blur-md"
      >
        <div className="grid grid-cols-5 items-center gap-1">
          {DOCK_NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 rounded-full py-2 px-2 text-center transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-100 text-purple-700 font-extrabold shadow-2xs scale-[1.02]'
                    : 'text-slate-500 font-semibold hover:bg-purple-50/60 hover:text-purple-700'
                }`}
              >
                <span className="text-sm leading-none" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="truncate text-[10px] sm:text-xs leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
