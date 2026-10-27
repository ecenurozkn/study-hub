import React, { useState, useEffect } from 'react';
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
  currentUser,
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
  const activeEmail =
    currentUser?.email ||
    notificationSettings?.emailAddress ||
    '';

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(activeEmail);
  const [customNote, setCustomNote] = useState('');

  useEffect(() => {
    if (currentUser?.email) {
      setRecipientEmail(currentUser.email);
    }
  }, [currentUser?.email]);

  if (!isOpen) return null;

  const targetRecipient = (recipientEmail || activeEmail || '').trim();

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
        : 'Önümüzdeki 24 saat içinde teslimi olan acil ödev veya sınav bulunmuyor.';

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
        : 'Henüz bekleyen çalışma konusu bulunmuyor.';

    return `Merhaba ${currentUser?.name || targetRecipient},

Akademik Ders ve Sınav Takip Merkezi hesabınız (${targetRecipient}) için hazırlanan 24 Saat Kala Acil Uyarı ve Günlük Çalışma Özeti aşağıdadır:

=== 24 SAATTEN AZ KALAN ACİL SINAV & ÖDEVLER (${urgentAlerts.length}) ===
${alertLines}

=== BUGÜN ODAKLANMANIZ ÖNERİLEN İLK 3 KONU ===
${studyLines}
${customNote.trim() ? `\nEk Not:\n${customNote.trim()}\n` : ''}
Başarılar dileriz!
Akademik Ders & Sınav Takip Merkezi`;
  };

  const mailtoHref = `mailto:${encodeURIComponent(
    targetRecipient
  )}?subject=${encodeURIComponent(
    buildEmailSubject()
  )}&body=${encodeURIComponent(buildEmailBody())}`;

  const handleDirect24hReminderTrigger = () => {
    const toAddress = targetRecipient;
    onUpdateNotificationSettings({ emailAddress: toAddress });
    onSendUrgentEmail({
      recipient: toAddress,
      subject: buildEmailSubject(),
      body: buildEmailBody(),
      alertCount: urgentAlerts.length,
    });
    // Kullanıcının yerel e-posta istemcisini (Apple Mail, Gmail, Outlook) otomatik aç
    window.location.href = mailtoHref;
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const toAddress = targetRecipient;
    onUpdateNotificationSettings({ emailAddress: toAddress });
    onSendUrgentEmail({
      recipient: toAddress,
      subject: buildEmailSubject(),
      body: buildEmailBody(),
      alertCount: urgentAlerts.length,
    });
    window.location.href = mailtoHref;
    setIsEmailModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity">
      {/* Açılır Bildirim Çekmecesi (Drawer) */}
      <div className="flex h-full w-full max-w-lg flex-col justify-between border-l border-slate-200/90 bg-[#f8fafc] shadow-2xl">
        {/* Üst Başlık */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Acil Bildirim & 24 Saat E-posta Merkezi
                </h2>
                {urgentAlerts.length > 0 && (
                  <span className="rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-900 animate-pulse">
                    {urgentAlerts.length} Acil (&lt;24s)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Aktif Hesap Alıcısı: <strong className="text-slate-700">{targetRecipient}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* İçerik Alanı */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* 1. Giriş Yapılan E-postaya Özel 24 Saat Hatırlatma Kartı */}
          <div className="rounded-2xl border border-rose-200/90 bg-rose-50/55 p-4 shadow-2xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rose-600 shrink-0" />
                <div>
                  <h3 className="text-xs font-semibold text-rose-950">
                    Giriş Yapılan E-postaya Özel 24 Saat Hatırlatıcı
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Alıcı (To): <code className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-rose-900">{targetRecipient}</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDirect24hReminderTrigger}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-100 px-4 py-1.5 text-xs font-semibold text-rose-900 shadow-2xs transition hover:bg-rose-200/80"
              >
                <Send className="h-3.5 w-3.5" />
                <span>24 Saat Hatırlatması Gönder ({targetRecipient})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-sky-300"
              >
                <ExternalLink className="h-3.5 w-3.5 text-sky-600" />
                <span>Şablonu Önizle / Düzenle</span>
              </button>
            </div>
          </div>

          {/* 2. Son 24 Saat Kalan Ödev ve Sınav Uyarıları */}
          <div className="rounded-2xl border border-slate-200/85 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <h3 className="text-xs font-semibold text-slate-800">
                  24 Saatten Az Kalan Sınav & Ödev Uyarıları ({urgentAlerts.length})
                </h3>
              </div>
            </div>

            {urgentAlerts.length === 0 ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-3.5 py-2.5 text-xs text-emerald-800">
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
                    className="cursor-pointer rounded-xl border border-rose-200/90 bg-rose-50/65 p-3 transition hover:border-rose-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-900 animate-pulse">
                          {alert.typeLabel}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {alert.courseCode}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-rose-800">
                        <Clock className="h-3 w-3" />
                        {alert.isOverdue
                          ? 'Süresi Geçti!'
                          : `${alert.parts.hours} sa ${alert.parts.minutes} dk kaldı`}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs font-medium text-slate-800">
                      {alert.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Tarih: {formatTurkishDateTime(alert.targetDate)}
                      {alert.location ? ` • Salon: ${alert.location}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Tarayıcı Masaüstü Bildirimi & Günlük Ders Tekrarı Tetikleyici */}
          <div className="rounded-2xl border border-violet-200/80 bg-violet-50/55 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-700" />
                <span className="text-xs font-semibold text-violet-950">
                  Masaüstü Bildirimleri & Günlük Ders Tekrarı
                </span>
              </div>

              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                  notificationPermission === 'granted'
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                    : 'border-amber-200 bg-amber-100 text-amber-800'
                }`}
              >
                {notificationPermission === 'granted'
                  ? 'Tarayıcı İzni: Aktif'
                  : notificationPermission === 'denied'
                  ? 'Uygulama İçi Bildirim Aktif'
                  : 'İzin Bekleniyor'}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onTriggerDailyStudyNotification}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-300 bg-violet-100 px-3.5 py-1.5 text-xs font-semibold text-violet-900 shadow-2xs transition hover:bg-violet-200/80"
              >
                <Bell className="h-3.5 w-3.5" />
                <span>"Günlük Ders Tekrarı" Bildirimi Gönder</span>
              </button>

              {notificationPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={onRequestPermission}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-sky-300"
                >
                  <span>Tarayıcı Bildirim İzni İste</span>
                </button>
              )}
            </div>
          </div>

          {/* 4. Bildirim ve E-posta Gönderim Geçmişi */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-sky-600" />
                <h3 className="text-xs font-semibold text-slate-800">
                  Kişisel Bildirim & E-posta Geçmişi ({notificationHistory.length})
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
                    className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          log.type?.startsWith('email')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-sky-100 text-sky-800'
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
                    <p className="mt-1 font-semibold text-slate-800">
                      {log.title}
                    </p>
                    {log.recipient && (
                      <p className="text-[11px] text-sky-600">
                        Alıcı: {log.recipient}
                      </p>
                    )}
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {log.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alt Kapatma Çubuğu */}
        <div className="border-t border-slate-200/80 bg-white/95 px-5 py-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            Kapat
          </button>
        </div>
      </div>

      {/* E-posta Gönderim & Önizleme Modalı */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleModalSubmit}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-semibold text-slate-800">
                  24 Saat Kala Acil Hatırlatma E-postası Şablonu
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
                <label className="block text-[11px] font-medium text-slate-500">
                  Alıcı (Oturum Açmış Kullanıcı E-postası) *
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-sky-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500">
                  E-posta Konusu
                </label>
                <input
                  type="text"
                  readOnly
                  value={buildEmailSubject()}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-1.5 text-xs font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500">
                  Hazır E-posta Şablonu Önizlemesi
                </label>
                <pre className="mt-1 max-h-52 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700">
                  {buildEmailBody()}
                </pre>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500">
                  Ek Hatırlatma Notu (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Örn: Sınav giriş belgesini ve A4 formül kağıdını yanına al!"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-100/80 px-3.5 py-1.5 text-xs font-medium text-sky-900 hover:bg-sky-200/80"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Doğrudan Mail İstemcisini Aç (mailto:)</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="rounded-full px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-900 shadow-2xs hover:bg-emerald-200"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>24 Saat Hatırlatması Gönder</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
