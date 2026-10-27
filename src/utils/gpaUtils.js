// Harf Notu Katsayı Tablosu (4.00'lük Üniversite Sistemi)
export const LETTER_GRADE_SCALE = [
  { grade: 'AA', coeff: 4.0, minScore: 90, maxScore: 100, label: 'AA (4.00)', color: 'emerald' },
  { grade: 'BA', coeff: 3.5, minScore: 85, maxScore: 89.99, label: 'BA (3.50)', color: 'emerald' },
  { grade: 'BB', coeff: 3.0, minScore: 80, maxScore: 84.99, label: 'BB (3.00)', color: 'sky' },
  { grade: 'CB', coeff: 2.5, minScore: 75, maxScore: 79.99, label: 'CB (2.50)', color: 'sky' },
  { grade: 'CC', coeff: 2.0, minScore: 70, maxScore: 74.99, label: 'CC (2.00)', color: 'violet' },
  { grade: 'DC', coeff: 1.5, minScore: 60, maxScore: 69.99, label: 'DC (1.50)', color: 'amber' },
  { grade: 'DD', coeff: 1.0, minScore: 50, maxScore: 59.99, label: 'DD (1.00)', color: 'amber' },
  { grade: 'FF', coeff: 0.0, minScore: 0, maxScore: 49.99, label: 'FF (0.00)', color: 'rose' },
];

export const GRADE_COEFF_MAP = {
  AA: 4.0,
  BA: 3.5,
  BB: 3.0,
  CB: 2.5,
  CC: 2.0,
  DC: 1.5,
  DD: 1.0,
  FF: 0.0,
};

/**
 * 100 üzerinden puana göre harf notu ve katsayı döndürür
 */
export function scoreToLetterGrade(score) {
  if (score === null || score === undefined || Number.isNaN(Number(score))) {
    return { grade: 'CC', coeff: 2.0, color: 'violet' };
  }
  const num = Math.max(0, Math.min(100, Number(score)));
  for (const item of LETTER_GRADE_SCALE) {
    if (num >= item.minScore) {
      return item;
    }
  }
  return LETTER_GRADE_SCALE[LETTER_GRADE_SCALE.length - 1];
}

/**
 * Harf notu rozeti için pastel Tailwind sınıfları
 */
export function getGradeBadgeClasses(grade) {
  switch (grade) {
    case 'AA':
    case 'BA':
      return 'bg-emerald-100/90 text-emerald-800 border-emerald-200/90 dark:bg-emerald-400/15 dark:text-emerald-200 dark:border-emerald-400/30';
    case 'BB':
    case 'CB':
      return 'bg-sky-100/90 text-sky-800 border-sky-200/90 dark:bg-sky-400/15 dark:text-sky-200 dark:border-sky-400/30';
    case 'CC':
      return 'bg-violet-100/90 text-violet-800 border-violet-200/90 dark:bg-violet-400/15 dark:text-violet-200 dark:border-violet-400/30';
    case 'DC':
    case 'DD':
      return 'bg-amber-100/90 text-amber-800 border-amber-200/90 dark:bg-amber-400/15 dark:text-amber-200 dark:border-amber-400/30';
    case 'FF':
      return 'bg-rose-100/90 text-rose-800 border-rose-200/90 dark:bg-rose-400/15 dark:text-rose-200 dark:border-rose-400/30';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

/**
 * Bir dersin değerlendirme kriterlerine (assessments) göre ağırlıklı ortalamasını ve harf notunu hesaplar
 */
export function calculateCourseGradeSummary(assessments = [], targetGradeOverride = '') {
  const validItems = (assessments || []).filter(
    (item) => Number(item.weight) > 0
  );
  const totalWeight = validItems.reduce(
    (acc, item) => acc + (Number(item.weight) || 0),
    0
  );

  let weightedSum = 0;
  let completedWeight = 0;

  validItems.forEach((item) => {
    const w = Number(item.weight) || 0;
    const hasScore =
      item.score !== '' &&
      item.score !== null &&
      item.score !== undefined &&
      !Number.isNaN(Number(item.score));
    if (hasScore) {
      const s = Math.max(0, Math.min(100, Number(item.score)));
      weightedSum += (s * w) / 100;
      completedWeight += w;
    }
  });

  // Eğer bazı kalemler henüz girilmediyse hem mevcut toplamı hem de 100'e normalize edilmiş tahmini hesapla
  const normalizedScore =
    completedWeight > 0
      ? Number(((weightedSum / completedWeight) * 100).toFixed(1))
      : null;
  const rawTotalScore = Number(weightedSum.toFixed(1));

  // Tüm ağırlıklar girildiyse rawTotalScore, kısmi girildiyse normalizedScore baz alınır
  const effectiveScore =
    completedWeight >= 99.5 ? rawTotalScore : normalizedScore;

  const computedLetter =
    effectiveScore !== null
      ? scoreToLetterGrade(effectiveScore)
      : { grade: 'BB', coeff: 3.0, color: 'sky' };

  const finalGrade =
    targetGradeOverride && GRADE_COEFF_MAP[targetGradeOverride] !== undefined
      ? targetGradeOverride
      : computedLetter.grade;

  const finalCoeff = GRADE_COEFF_MAP[finalGrade] ?? computedLetter.coeff;

  return {
    totalWeight,
    completedWeight,
    rawTotalScore,
    normalizedScore,
    effectiveScore,
    computedGrade: computedLetter.grade,
    finalGrade,
    finalCoeff,
  };
}

/**
 * Transkript ders listesinden GANO, tamamlanan AKTS ve harf notu dağılımını hesaplar
 */
export function calculateTranscriptAudit(transcriptCourses = [], graduationGoals = {}) {
  const targetEcts = Number(graduationGoals.totalEctsRequired) || 240;
  const targetMandatoryCount = Number(graduationGoals.mandatoryCoursesRequired) || 32;
  const targetElectiveCount = Number(graduationGoals.electiveCoursesRequired) || 10;

  const gradeDistribution = {
    AA: 0,
    BA: 0,
    BB: 0,
    CB: 0,
    CC: 0,
    DC: 0,
    DD: 0,
    FF: 0,
  };

  let totalQualityPoints = 0;
  let totalGpaCredits = 0;
  let completedEcts = 0;
  let failedEcts = 0;
  let completedMandatoryCount = 0;
  let completedElectiveCount = 0;

  transcriptCourses.forEach((item) => {
    const credits = Number(item.credits) || 0;
    const grade = (item.grade || 'CC').toUpperCase();
    const coeff = GRADE_COEFF_MAP[grade] ?? 0;

    if (gradeDistribution[grade] !== undefined) {
      gradeDistribution[grade] += 1;
    }

    totalQualityPoints += credits * coeff;
    totalGpaCredits += credits;

    if (grade === 'FF') {
      failedEcts += credits;
    } else {
      completedEcts += credits;
      if (item.category === 'elective') {
        completedElectiveCount += 1;
      } else {
        completedMandatoryCount += 1;
      }
    }
  });

  const currentGpa =
    totalGpaCredits > 0
      ? Number((totalQualityPoints / totalGpaCredits).toFixed(2))
      : 0;

  const remainingEcts = Math.max(0, targetEcts - completedEcts);
  const ectsProgressPercent =
    targetEcts > 0
      ? Math.min(100, Math.round((completedEcts / targetEcts) * 100))
      : 0;

  const remainingMandatory = Math.max(0, targetMandatoryCount - completedMandatoryCount);
  const remainingElective = Math.max(0, targetElectiveCount - completedElectiveCount);
  const totalRemainingCourses = remainingMandatory + remainingElective;

  return {
    currentGpa,
    totalGpaCredits,
    totalQualityPoints,
    completedEcts,
    failedEcts,
    remainingEcts,
    targetEcts,
    ectsProgressPercent,
    completedMandatoryCount,
    completedElectiveCount,
    remainingMandatory,
    remainingElective,
    totalRemainingCourses,
    targetMandatoryCount,
    targetElectiveCount,
    gradeDistribution,
    passedCourseCount: completedMandatoryCount + completedElectiveCount,
    totalCourseCount: transcriptCourses.length,
  };
}

/**
 * Satır bazlı metin transkripti ayrıştırıcı
 * Örn: "MAT101 | Kalkülüs I | 6 | AA | Zorunlu | 1. Yarıyıl"
 */
export function parseTranscriptText(rawText) {
  if (!rawText || !rawText.trim()) return [];
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const parsed = [];
  lines.forEach((line, idx) => {
    const parts = line.includes('|')
      ? line.split('|').map((s) => s.trim())
      : line.split(/[,;\t]+/).map((s) => s.trim());

    if (parts.length >= 2) {
      const code = (parts[0] || `DRS${idx + 1}`).toUpperCase();
      const name = parts[1] || 'Üniversite Dersi';
      const credits = Number(parts[2]) || 5;
      const rawGrade = (parts[3] || 'BB').toUpperCase();
      const grade = GRADE_COEFF_MAP[rawGrade] !== undefined ? rawGrade : 'BB';
      const rawCat = (parts[4] || '').toLowerCase();
      const category =
        rawCat.includes('seç') || rawCat.includes('elective')
          ? 'elective'
          : 'mandatory';
      const semester = parts[5] || 'Geçmiş Dönem';

      parsed.push({
        id: `tr-imp-${Date.now()}-${idx}`,
        code,
        name,
        credits,
        grade,
        category,
        semester,
      });
    }
  });
  return parsed;
}
