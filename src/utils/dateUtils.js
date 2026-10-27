// Aydınlık Pastel renk paletiyle uyumlu kalan süre hesaplama, canlı geri sayım ve akıllı çalışma öneri motoru

export function getCountdownInfo(targetDateStr, isCompleted = false) {
  // Mine Yeşili (Mint): Tamamlananlar için
  if (isCompleted) {
    return {
      label: 'Teslim Edildi ✓',
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

  // Süresi geçenler: Açık Pembe (Soft Blush Pink)
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

  // Son 24 saat: Açık Pembe + Yanıp Sönen (Pulse) Acil Durum
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

  // 24 - 48 saat arası: Açık Pembe (Soft Blush Pink)
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

  // 2 - 4 gün arası: Pastel Lavanta / Lila
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

  // Bu hafta: Bebek Mavisi (Baby Blue)
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

/**
 * Merkezi Sınav Takvimi için Gün / Saat / Dakika / Saniye canlı kırılımı döndürür
 */
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

/**
 * 24 saatten az kalan (veya yeni gecikmiş) tüm sınav ve ödevleri tespit eder
 */
export function getUrgent24hAlerts(assignments = [], exams = [], courses = []) {
  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const now = new Date();
  const alerts = [];

  assignments.forEach((asg) => {
    if (asg.status === 'done' || !asg.dueDate) return;
    const diffHours = (new Date(asg.dueDate) - now) / (1000 * 3600);
    if (diffHours <= 24 && diffHours >= -24) {
      const course = courseMap.get(asg.courseId);
      const parts = getLiveCountdownParts(asg.dueDate);
      alerts.push({
        id: `alert-asg-${asg.id}`,
        itemId: asg.id,
        type: 'assignment',
        typeLabel: 'Ödev Teslimi',
        courseId: asg.courseId,
        courseCode: course?.code || 'DERS',
        courseName: course?.name || 'Ders',
        courseColor: course?.color || 'rose',
        title: asg.title,
        targetDate: asg.dueDate,
        diffHours,
        parts,
        isOverdue: diffHours < 0,
      });
    }
  });

  exams.forEach((exm) => {
    if (!exm.examDate) return;
    const diffHours = (new Date(exm.examDate) - now) / (1000 * 3600);
    if (diffHours <= 24 && diffHours >= -6) {
      const course = courseMap.get(exm.courseId);
      const parts = getLiveCountdownParts(exm.examDate);
      alerts.push({
        id: `alert-exm-${exm.id}`,
        itemId: exm.id,
        type: 'exam',
        typeLabel: 'Sınav Uyarısı',
        courseId: exm.courseId,
        courseCode: course?.code || 'DERS',
        courseName: course?.name || 'Ders',
        courseColor: course?.color || 'violet',
        title: `${course?.code || ''} ${exm.examType}`,
        location: exm.location,
        targetDate: exm.examDate,
        diffHours,
        parts,
        isOverdue: diffHours < 0,
      });
    }
  });

  alerts.sort((a, b) => a.diffHours - b.diffHours);
  return alerts;
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

/**
 * "Bugün Neye Odaklanmalıyım?" Akıllı Öneri Algoritması:
 * Yaklaşan sınavlara, teslimi yakın ödevlere, dersin kredi ağırlığına ve
 * konunun durumuna ("missing" > "review") göre tüm konuları puanlar ve ilk 3 konuyu döndürür.
 */
export function getSmartStudyRecommendations(topics, courses, exams, assignments) {
  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const now = new Date();

  const candidateTopics = topics.filter((t) => t.status !== 'studied');

  const scored = candidateTopics.map((topic) => {
    const course = courseMap.get(topic.courseId);
    let score = 0;
    const reasons = [];

    if (topic.status === 'missing') {
      score += 55;
      reasons.push('Eksik konu');
    } else if (topic.status === 'review') {
      score += 30;
      reasons.push('Tekrar gerekli');
    }

    if (topic.inExamScope) {
      score += 18;
    }

    const courseExams = exams
      .filter((e) => e.courseId === topic.courseId && new Date(e.examDate) > now)
      .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

    let nearestExamHours = Infinity;
    if (courseExams.length > 0) {
      const nextExam = courseExams[0];
      nearestExamHours = (new Date(nextExam.examDate) - now) / (1000 * 3600);
      const examDays = Math.max(1, Math.ceil(nearestExamHours / 24));
      if (nearestExamHours <= 24) {
        score += 75;
        reasons.push('Sınav <24 saat!');
      } else if (nearestExamHours <= 72) {
        score += 50;
        reasons.push(`Sınava ${examDays} gün`);
      } else if (nearestExamHours <= 168) {
        score += 35;
        reasons.push(`Sınava ${examDays} gün`);
      } else if (nearestExamHours <= 336) {
        score += 20;
        reasons.push(`Sınav ${examDays} gün sonra`);
      }
    }

    const activeAssignments = assignments
      .filter((a) => a.courseId === topic.courseId && a.status !== 'done')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (activeAssignments.length > 0) {
      const nextAsg = activeAssignments[0];
      const asgHours = (new Date(nextAsg.dueDate) - now) / (1000 * 3600);
      if (asgHours <= 24) {
        score += 40;
        reasons.push('Ödev <24 saat!');
      } else if (asgHours <= 72) {
        score += 28;
        reasons.push('Yakın ödev teslimi');
      } else if (asgHours <= 168) {
        score += 14;
        reasons.push('Bu hafta ödev var');
      }
    }

    if (course?.credits) {
      score += Number(course.credits) * 2;
    }

    return {
      topic,
      course,
      score,
      reasons,
      nearestExamHours,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}
