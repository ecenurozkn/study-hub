// Aydınlık Pastel renk paletiyle uyumlu kalan süre hesaplama ve tarih biçimlendirme yardımcıları

export function getCountdownInfo(targetDateStr, isCompleted = false) {
  if (isCompleted) {
    return {
      label: 'Tamamlandı ✓',
      shortLabel: 'Tamamlandı',
      badgeClass: 'bg-emerald-100/85 text-emerald-800 border-emerald-200',
      dotClass: 'bg-emerald-500',
      urgency: 'completed',
      diffHours: Infinity,
      isUnder24h: false,
    };
  }

  if (!targetDateStr) {
    return {
      label: 'Tarih Belirtilmedi',
      shortLabel: 'Tarihsiz',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      dotClass: 'bg-slate-400',
      urgency: 'none',
      diffHours: Infinity,
      isUnder24h: false,
    };
  }

  const now = new Date();
  const target = new Date(targetDateStr);
  const diffMs = target.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const absHours = Math.abs(diffHours);
  const days = Math.floor(absHours / 24);
  const hours = Math.floor(absHours % 24);
  const minutes = Math.floor((absHours * 60) % 60);

  if (diffMs < 0) {
    const overdueText =
      days > 0
        ? `Süresi Geçti (${days}g ${hours}s önce)`
        : `Süresi Geçti (${hours}s ${minutes}dk önce)`;
    return {
      label: overdueText,
      shortLabel: 'Süresi Geçti',
      badgeClass: 'bg-rose-100/90 text-rose-800 border-rose-200',
      dotClass: 'bg-rose-400',
      urgency: 'overdue',
      diffHours,
      isUnder24h: false,
    };
  }

  if (diffHours <= 24) {
    const labelText =
      hours > 0
        ? `Son ${hours} sa ${minutes} dk • ACİL (<24 Saat)`
        : `Son ${minutes} dakika • ACİL`;
    return {
      label: labelText,
      shortLabel: `${hours}s ${minutes}dk`,
      badgeClass: 'bg-rose-100/95 text-rose-900 border-rose-300 animate-pulse',
      dotClass: 'bg-rose-500 animate-ping',
      urgency: 'critical_24h',
      diffHours,
      isUnder24h: true,
    };
  }

  if (diffHours <= 48) {
    return {
      label: `Son ${days} gün ${hours} saat • Acil`,
      shortLabel: `${days}g ${hours}s`,
      badgeClass: 'bg-rose-100/85 text-rose-800 border-rose-200/90',
      dotClass: 'bg-rose-400',
      urgency: 'critical',
      diffHours,
      isUnder24h: false,
    };
  }

  if (diffHours <= 96) {
    return {
      label: `Son ${days} gün ${hours} saat`,
      shortLabel: `${days}g ${hours}s`,
      badgeClass: 'bg-violet-100/80 text-violet-800 border-violet-200/90',
      dotClass: 'bg-violet-400',
      urgency: 'soon',
      diffHours,
      isUnder24h: false,
    };
  }

  if (diffHours <= 168) {
    return {
      label: `${days} gün ${hours} saat kaldı`,
      shortLabel: `${days} gün`,
      badgeClass: 'bg-sky-100/80 text-sky-800 border-sky-200/90',
      dotClass: 'bg-sky-400',
      urgency: 'this_week',
      diffHours,
      isUnder24h: false,
    };
  }

  return {
    label: `${days} gün ${hours} saat kaldı`,
    shortLabel: `${days} gün`,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    urgency: 'normal',
    diffHours,
    isUnder24h: false,
  };
}

export function getLiveCountdownParts(targetDateStr) {
  if (!targetDateStr) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      diffHours: Infinity,
      isPast: false,
      isUnder24h: false,
      isUnder48h: false,
    };
  }

  const now = new Date();
  const target = new Date(targetDateStr);
  const diffMs = target.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 3600);

  if (diffMs <= 0) {
    const absMs = Math.abs(diffMs);
    const days = Math.floor(absMs / (1000 * 3600 * 24));
    const hours = Math.floor((absMs / (1000 * 3600)) % 24);
    const minutes = Math.floor((absMs / (1000 * 60)) % 60);
    return {
      days,
      hours,
      minutes,
      seconds: 0,
      diffHours,
      isPast: true,
      isUnder24h: false,
      isUnder48h: false,
    };
  }

  const days = Math.floor(diffMs / (1000 * 3600 * 24));
  const hours = Math.floor((diffMs / (1000 * 3600)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
    diffHours,
    isPast: false,
    isUnder24h: diffHours > 0 && diffHours <= 24,
    isUnder48h: diffHours > 0 && diffHours <= 48,
  };
}

export function formatTurkishDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
