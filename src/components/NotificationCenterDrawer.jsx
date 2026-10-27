import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  ExternalLink,
  Sparkles,
  History,
  Trash2,
} from 'lucide-react';
import { formatTurkishDateTime } from '../utils/dateUtils';

export default function NotificationCenterDrawer({
  isOpen,
  onClose,
  urgentAlerts = [],
  smartRecommendations = [],
  notificationPermission = 'default',
  onRequestPermission,
  onTriggerDailyStudyNotification,
  notificationSettings = {},
  onUpdateNotificationSettings,
  notificationHistory = [],
  onSendUrgentEmail,
  onClearNotificationHistory,
  onNavigateToAlert,
}) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(
    notificationSettings?.emailAddress || 'ogrenci@universite.edu.tr'
  );
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const buildEmailSubject = () => {
    if (urgentAlerts.length > 0) {
      return `[ACİL <24 Saat] ${urgentAlerts.length} Yaklaşan Sınav/Ödev Hatırlatması - Akademik Takip Merkezi`;
    }
    return `Günlük Çalışma ve Sınav Özeti - Akademik Takip Merkezi`;
  };

  const buildEmailBody = () => {
    const alertLines =
      urgentAlerts.length > 0
        ? urgentAlerts
            .map(
              (a, i) =>
                `${i + 1}. [${a.typeLabel}] ${a.courseCode} - ${a.title}\n   Tarih/Saat: ${formatTurkishDateTime(
                  a.targetDate
                )} (Kalan: ${a.parts.hours} saat ${a.parts.minutes} dk)`
            )
            .join('\n\n')
        : '24 saatten az kalan acil sınav veya ödev bulunmuyor.';

    const studyLines =
      smartRecommendations.length > 0
        ? smartRecommendations
            .map(
              (r, i) =>
                `${i + 1}. [${r.course?.code || 'Ders'}] ${r.topic.title} (${
                  r.reasons[0] || 'Öncelikli'
                })`
            )
            .join('\n')
        : 'Tüm konular tamamlandı.';

    return `Merhaba,

Akademik Ders ve Sınav Takip Merkezi tarafından otomatik hazırlanan 24 Saat Kala Acil Uyarı ve Günlük Çalışma Özeti aşağıdadır:

=== 24 SAATTEN AZ KALAN ACİL SINAV & ÖDEVLER (${urgentAlerts.length}) ===
${alertLines}

=== BUGÜN ODAKLANMANIZ ÖNERİLEN İLK 3 KONU ===
${studyLines}
${customNote.trim() ? `\nEk Not:\n${customNote.trim()}\n` : ''}
Başarılar dileriz!
Akademik Ders & Sınav Takip Merkezi`;
  };

  const handleSimulatedEmailSend = (e) => {
    e.preventDefault();
    const targetEmail = recipientEmail.trim() || 'ogrenci@universite.edu.tr';
    onUpdateNotificationSettings({ emailAddress: targetEmail });
    onSendUrgentEmail({
      recipient: targetEmail,
      subject: buildEmailSubject(),
      body: buildEmailBody(),
      alertCount: urgentAlerts.length,
    });
    setIsEmailModalOpen(false);
  };

  const mailtoHref = `mailto:${encodeURIComponent(
    recipientEmail.trim() || 'ogrenci@universite.edu.tr'
  )}?subject=${encodeURIComponent(buildEmailSubject())}&body=${encodeURIComponent(
    buildEmailBody()
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      {/* Açılır Bildirim Çekmecesi (Drawer) */}
      <div className="flex h-full w-full max-w-lg flex-col justify-between border-l border-slate-200/90 bg-[#f8fafc] shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        {/* Üst Başlık */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-400/20 dark:text-rose-200">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Acil Bildirim & E-posta Merkezi
                </h2>
                {urgentAlerts.length > 0 && (
                  <span className="rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-900 animate-pulse dark:border-rose-400/40 dark:bg-rose-500/25 dark:text-rose-100">
                    {urgentAlerts.length} Acil (&lt;24s)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Web Notifications API, 24 saat kala acil uyarılar ve e-posta hatırlatıcı
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* İçerik Alanı */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* 1. Tarayıcı Masaüstü Bildirimi & Günlük Ders Tekrarı Tetikleyici */}
          <div className="rounded-2xl border border-violet-200/80 bg-violet-50/55 p-4 dark:border-violet-400/25 dark:bg-violet-950/20">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-700 dark:text-violet-300" />
                <span className="text-xs font-semibold text-violet-950 dark:text-violet-100">
                  Masaüstü Bildirimleri & Günlük Ders Tekrarı
                </span>
              </div>

              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                  notificationPermission === 'granted'
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200'
                    : 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-200'
                }`}
              >
                {notificationPermission === 'granted'
                  ? 'Tarayıcı İzni: Aktif'
                  : notificationPermission === 'denied'
                  ? 'İzin Engellendi (Simülasyon Aktif)'
                  : 'İzin Bekleniyor'}
              </span>
            </div>

            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">
              Günün öncelikli çalışma konularını masaüstü bildirimi olarak anında tetikleyebilirsiniz.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onTriggerDailyStudyNotification}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-300 bg-violet-100 px-3.5 py-1.5 text-xs font-semibold text-violet-900 shadow-xs transition hover:bg-violet-200/80 dark:border-violet-400/40 dark:bg-violet-400/25 dark:text-violet-100"
              >
                <Bell className="h-3.5 w-3.5" />
                <span>"Günlük Ders Tekrarı" Bildirimi Gönder</span>
              </button>

              {notificationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={onRequestPermission}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <span>Tarayıcı Bildirim İzni İste</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Son 24 Saat Kalan Ödev ve Sınav Uyarıları */}
          <div className="rounded-2xl border border-rose-200/85 bg-white p-4 shadow-xs dark:border-rose-400/25 dark:bg-slate-800/70">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-300" />
                <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  24 Saatten Az Kalan Sınav & Ödev Uyarıları ({urgentAlerts.length})
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-100/90 px-3 py-1 text-[11px] font-semibold text-rose-900 transition hover:bg-rose-200/80 dark:border-rose-400/35 dark:bg-rose-500/20 dark:text-rose-100"
              >
                <Mail className="h-3 w-3" />
                <span>24 Saat E-postası Hazırla</span>
              </button>
            </div>

            {urgentAlerts.length === 0 ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-3.5 py-2.5 text-xs text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Önümüzdeki 24 saat içinde acil sınav veya ödev teslimi yok.</span>
              </div>
            ) : (
              <div className="mt-3 space-y-2.5">
                {urgentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      if (onNavigateToAlert) {
                        onNavigateToAlert(alert);
                        onClose();
                      }
                    }}
                    className="cursor-pointer rounded-xl border border-rose-200/90 bg-rose-50/65 p-3 transition hover:border-rose-300 dark:border-rose-400/30 dark:bg-rose-950/25"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-900 animate-pulse dark:border-rose-400/50 dark:bg-rose-500/30 dark:text-rose-100">
                          {alert.typeLabel}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
                          {alert.courseCode}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-rose-800 dark:text-rose-200">
                        <Clock className="h-3 w-3" />
                        {alert.isOverdue
                          ? 'Süresi Geçti!'
                          : `${alert.parts.hours} sa ${alert.parts.minutes} dk kaldı`}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs font-medium text-slate-800 dark:text-slate-100">
                      {alert.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Tarih: {formatTurkishDateTime(alert.targetDate)}
                      {alert.location ? ` • Salon: ${alert.location}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Otomatik E-posta Ayarı */}
            <div className="mt-3.5 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Mail className="h-3.5 w-3.5 text-sky-500" />
                <span>Hatırlatma E-postası:</span>
                <strong className="font-mono text-slate-800 dark:text-slate-100">
                  {notificationSettings?.emailAddress || 'ogrenci@universite.edu.tr'}
                </strong>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                <input
                  type="checkbox"
                  checked={Boolean(notificationSettings?.autoEmailUnder24h)}
                  onChange={(e) =>
                    onUpdateNotificationSettings({
                      autoEmailUnder24h: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
                />
                <span>24 Saat Kala Otomatik Hazırla</span>
              </label>
            </div>
          </div>

          {/* 3. Bildirim ve E-posta Gönderim Geçmişi */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  Bildirim & E-posta Geçmişi ({notificationHistory.length})
                </h3>
              </div>

              {notificationHistory.length > 0 && (
                <button
                  type="button"
                  onClick={onClearNotificationHistory}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Temizle</span>
                </button>
              )}
            </div>

            {notificationHistory.length === 0 ? (
              <p className="mt-2.5 text-xs text-slate-400">
                Henüz kayıtlı bildirim veya e-posta gönderimi bulunmuyor.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {notificationHistory.slice(0, 8).map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-2.5 text-xs dark:border-slate-700/60 dark:bg-slate-900/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          log.type?.startsWith('email')
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-400/20 dark:text-rose-200'
                            : 'bg-sky-100 text-sky-800 dark:bg-sky-400/20 dark:text-sky-200'
                        }`}
                      >
                        {log.type?.startsWith('email')
                          ? 'E-posta Hatırlatıcı'
                          : 'Masaüstü Bildirimi'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTurkishDateTime(log.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                      {log.title}
                    </p>
                    {log.recipient && (
                      <p className="text-[11px] text-sky-600 dark:text-sky-300">
                        Alıcı: {log.recipient}
                      </p>
                    )}
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {log.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alt Kapatma Çubuğu */}
        <div className="border-t border-slate-200/80 bg-white/90 px-5 py-3 text-right dark:border-slate-800 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Kapat
          </button>
        </div>
      </div>

      {/* E-posta Gönderim & Önizleme Modalı */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSimulatedEmailSend}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rose-500 dark:text-rose-300" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  24 Saat Kala Acil Hatırlatma E-postası Gönderimi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Alıcı Öğrenci E-posta Adresi *
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="ogrenci@universite.edu.tr"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  E-posta Konusu
                </label>
                <input
                  type="text"
                  readOnly
                  value={buildEmailSubject()}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Otomatik Hazırlanan E-posta İçeriği Önizlemesi
                </label>
                <pre className="mt-1 max-h-52 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {buildEmailBody()}
                </pre>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Kendinize Ek Hatırlatma Notu (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Örn: Kimlik kartını ve A4 el yazısı formül kağıdını çantaya koymayı unutma!"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-300 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-100/80 px-3.5 py-1.5 text-xs font-medium text-sky-900 hover:bg-sky-200/80 dark:border-sky-400/30 dark:bg-sky-400/20 dark:text-sky-100"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>E-posta Uygulamasında Aç (mailto:)</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="rounded-full px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-900 shadow-xs hover:bg-emerald-200 dark:border-emerald-400/35 dark:bg-emerald-400/20 dark:text-emerald-100"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Şimdi Gönder & Geçmişe Kaydet</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
