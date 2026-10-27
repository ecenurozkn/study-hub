import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import KnowledgeWidgets from './components/KnowledgeWidgets';
import ExamCountdownHub from './components/ExamCountdownHub';
import CoursesSection from './components/CoursesSection';
import AssignmentsSection from './components/AssignmentsSection';
import StudyTrackerSection from './components/StudyTrackerSection';
import ExamsCheatsheetSection from './components/ExamsCheatsheetSection';
import GraduationTranscriptSection from './components/GraduationTranscriptSection';
import NotificationCenterDrawer from './components/NotificationCenterDrawer';
import {
  createInitialData,
  createSampleTranscriptCourses,
  createDefaultKnowledgeCards,
} from './data/initialData';
import {
  getUrgent24hAlerts,
  getSmartStudyRecommendations,
} from './utils/dateUtils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'academic_course_exam_hub_v1';
const THEME_STORAGE_KEY = 'academic_course_exam_hub_theme_v1';

function migrateAndLoadInitialState() {
  const defaults = createInitialData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Array.isArray(parsed.courses) &&
        Array.isArray(parsed.assignments) &&
        Array.isArray(parsed.topics) &&
        Array.isArray(parsed.exams)
      ) {
        // Mevcut derslerde assessments alanı yoksa varsayılan değerlendirme ağırlıklarını ekle
        const migratedCourses = parsed.courses.map((c) => {
          if (Array.isArray(c.assessments) && c.assessments.length > 0) {
            return c;
          }
          const matchingDefault = defaults.courses.find(
            (dc) => dc.id === c.id || dc.code === c.code
          );
          return {
            ...c,
            targetGradeOverride: c.targetGradeOverride || '',
            assessments: matchingDefault?.assessments || [
              { id: `asm-${c.id}-1`, name: 'Ara Sınav (Vize)', weight: 30, score: 82 },
              { id: `asm-${c.id}-2`, name: 'Ödev 1', weight: 15, score: 88 },
              { id: `asm-${c.id}-3`, name: 'Ödev 2', weight: 15, score: 85 },
              { id: `asm-${c.id}-4`, name: 'Final (Beklenen)', weight: 40, score: 84 },
            ],
          };
        });

        return {
          ...defaults,
          ...parsed,
          courses: migratedCourses,
          graduation:
            parsed.graduation &&
            Array.isArray(parsed.graduation.transcriptCourses)
              ? parsed.graduation
              : defaults.graduation,
          knowledgeCards:
            Array.isArray(parsed.knowledgeCards) &&
            parsed.knowledgeCards.length > 0
              ? parsed.knowledgeCards
              : defaults.knowledgeCards,
          notificationSettings:
            parsed.notificationSettings || defaults.notificationSettings,
          notificationHistory: Array.isArray(parsed.notificationHistory)
            ? parsed.notificationHistory
            : defaults.notificationHistory,
        };
      }
    }
  } catch (err) {
    console.warn('localStorage okuma hatası, varsayılan veriler yükleniyor:', err);
  }
  return defaults;
}

function loadInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'light';
}

export default function App() {
  const [data, setData] = useState(migrateAndLoadInitialState);
  const [theme, setTheme] = useState(loadInitialTheme);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [highlightedExamId, setHighlightedExamId] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [, setTick] = useState(0);

  // 1. KARANLIK MOD: Tema değiştiğinde <html> ve <body> etiketlerine .dark sınıfını uygula ve localStorage'da sakla
  useEffect(() => {
    const isDark = theme === 'dark';
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
    if (document.body) {
      document.body.classList.toggle('dark', isDark);
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Verileri localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('localStorage kaydetme hatası:', err);
    }
  }, [data]);

  // Sayfa açıldığında Web Notifications API izni iste
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission()
          .then((perm) => {
            setNotificationPermission(perm);
          })
          .catch(() => {
            // ignore
          });
      }
    }
  }, []);

  // Periyodik sayaç yenileme
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // --- ACİL 24 SAAT UYARILARI & AKILLI ÖNERİLER ---
  const urgentAlerts = useMemo(
    () => getUrgent24hAlerts(data.assignments, data.exams, data.courses),
    [data.assignments, data.exams, data.courses]
  );

  const smartRecommendations = useMemo(
    () =>
      getSmartStudyRecommendations(
        data.topics,
        data.courses,
        data.exams,
        data.assignments
      ),
    [data.topics, data.courses, data.exams, data.assignments]
  );

  // --- WEB NOTIFICATIONS API & E-POSTA SİSTEMİ ---
  const handleRequestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showNotification(
        'Tarayıcınız masaüstü bildirimlerini desteklemiyor, uygulama içi bildirim aktif.',
        'error'
      );
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        showNotification('Masaüstü bildirim izni verildi!');
      } else {
        showNotification(
          'Tarayıcı bildirimi engellendi; bildirimler uygulama içi merkezde gösterilecek.'
        );
      }
    } catch {
      // ignore
    }
  };

  const handleTriggerDailyStudyNotification = () => {
    const topTitles =
      smartRecommendations.length > 0
        ? smartRecommendations
            .map((r, i) => `${i + 1}) [${r.course?.code || 'Ders'}] ${r.topic.title}`)
            .join(' • ')
        : 'Tüm konularınız tamamlandı!';

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification('Günlük Ders Tekrarı Önerileri 📚', {
          body: topTitles,
        });
      } catch {
        // Fallback to in-app notification
      }
    }

    const newLog = {
      id: `notif-${Date.now()}`,
      type: 'desktop_daily',
      title: 'Günlük Ders Tekrarı Masaüstü Bildirimi Tetiklendi',
      summary: topTitles,
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      notificationHistory: [newLog, ...(prev.notificationHistory || [])],
    }));

    showNotification(`Günlük Ders Tekrarı: ${topTitles}`);
  };

  const handleUpdateNotificationSettings = (updates) => {
    setData((prev) => ({
      ...prev,
      notificationSettings: {
        ...(prev.notificationSettings || {}),
        ...updates,
      },
    }));
  };

  const handleSendUrgentEmail = ({ recipient, subject, alertCount }) => {
    const newLog = {
      id: `email-${Date.now()}`,
      type: 'email_manual',
      title: subject,
      recipient,
      summary: `${alertCount} adet 24 saat altı acil sınav/ödev ve günlük çalışma planı ${recipient} adresine gönderildi.`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      notificationHistory: [newLog, ...(prev.notificationHistory || [])],
    }));
    showNotification(`Acil hatırlatma e-postası (${recipient}) gönderildi ve geçmişe kaydedildi!`);
  };

  const handleClearNotificationHistory = () => {
    setData((prev) => ({
      ...prev,
      notificationHistory: [],
    }));
    showNotification('Bildirim geçmişi temizlendi.');
  };

  const handleNavigateToAlert = (alert) => {
    if (alert.type === 'exam') {
      setActiveTab('exams');
      setHighlightedExamId(alert.itemId);
      setTimeout(() => {
        const el = document.getElementById(`exam-card-${alert.itemId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      setActiveTab('assignments');
    }
  };

  // --- 1. DERS YÖNETİMİ İŞLEMLERİ ---
  const handleAddCourse = (coursePayload) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      ...coursePayload,
      targetGradeOverride: '',
      assessments: [
        { id: `asm-${Date.now()}-1`, name: 'Ara Sınav (Vize)', weight: 30, score: 80 },
        { id: `asm-${Date.now()}-2`, name: 'Ödev 1', weight: 15, score: 85 },
        { id: `asm-${Date.now()}-3`, name: 'Ödev 2', weight: 15, score: 85 },
        { id: `asm-${Date.now()}-4`, name: 'Final (Beklenen)', weight: 40, score: 80 },
      ],
      links: [],
    };
    setData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
    showNotification(`${newCourse.code} dersi eklendi.`);
  };

  const handleUpdateCourse = (courseId, updates) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId ? { ...c, ...updates } : c
      ),
    }));
  };

  const handleDeleteCourse = (courseId) => {
    const target = data.courses.find((c) => c.id === courseId);
    setData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== courseId),
      assignments: prev.assignments.filter((a) => a.courseId !== courseId),
      topics: prev.topics.filter((t) => t.courseId !== courseId),
      exams: prev.exams.filter((e) => e.courseId !== courseId),
      knowledgeCards: (prev.knowledgeCards || []).filter(
        (k) => k.courseId !== courseId
      ),
    }));
    if (selectedCourseId === courseId) {
      setSelectedCourseId('all');
    }
    showNotification(`${target?.code || 'Ders'} silindi.`);
  };

  const handleAddCourseLink = (courseId, linkPayload) => {
    const newLink = {
      id: `lnk-${Date.now()}`,
      ...linkPayload,
    };
    setData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? { ...c, links: [...(c.links || []), newLink] }
          : c
      ),
    }));
    showNotification('Ders bağlantısı eklendi.');
  };

  const handleDeleteCourseLink = (courseId, linkId) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? { ...c, links: (c.links || []).filter((l) => l.id !== linkId) }
          : c
      ),
    }));
  };

  // --- 2. ÖDEV & PROJE İŞLEMLERİ ---
  const handleAddAssignment = (payload) => {
    const newAsg = {
      id: `asg-${Date.now()}`,
      ...payload,
    };
    setData((prev) => ({
      ...prev,
      assignments: [...prev.assignments, newAsg],
    }));
    showNotification('Yeni ödev eklendi.');
  };

  const handleUpdateAssignment = (assignmentId, updates) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === assignmentId ? { ...a, ...updates } : a
      ),
    }));
  };

  const handleDeleteAssignment = (assignmentId) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== assignmentId),
    }));
    showNotification('Ödev silindi.');
  };

  // --- 3. ÇALIŞMA PLANI (SYLLABUS) İŞLEMLERİ ---
  const handleAddTopic = (payload) => {
    const newTopic = {
      id: `top-${Date.now()}`,
      ...payload,
    };
    setData((prev) => ({
      ...prev,
      topics: [...prev.topics, newTopic],
    }));
    showNotification('Konu çalışma planına eklendi.');
  };

  const handleUpdateTopic = (topicId, updates) => {
    setData((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === topicId ? { ...t, ...updates } : t
      ),
    }));
  };

  const handleDeleteTopic = (topicId) => {
    setData((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t.id !== topicId),
    }));
    showNotification('Konu silindi.');
  };

  // --- 4. SINAV & CHEATSHEET İŞLEMLERİ ---
  const handleAddExam = (payload) => {
    const newExam = {
      id: `exm-${Date.now()}`,
      ...payload,
    };
    setData((prev) => ({
      ...prev,
      exams: [...prev.exams, newExam],
    }));
    showNotification('Yeni sınav kartı oluşturuldu.');
  };

  const handleUpdateExam = (examId, updates) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.map((ex) =>
        ex.id === examId ? { ...ex, ...updates } : ex
      ),
    }));
  };

  const handleDeleteExam = (examId) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.filter((ex) => ex.id !== examId),
    }));
    showNotification('Sınav kartı silindi.');
  };

  // --- 5. BİLGİ & FORMÜL KARTLARI (KNOWLEDGE WIDGETS) İŞLEMLERİ ---
  const handleAddKnowledgeCard = (payload) => {
    const newCard = {
      id: `kw-${Date.now()}`,
      ...payload,
    };
    setData((prev) => ({
      ...prev,
      knowledgeCards: [newCard, ...(prev.knowledgeCards || [])],
    }));
    showNotification('Yeni formül bilgi kartı eklendi.');
  };

  const handleDeleteKnowledgeCard = (cardId) => {
    setData((prev) => ({
      ...prev,
      knowledgeCards: (prev.knowledgeCards || []).filter((k) => k.id !== cardId),
    }));
    showNotification('Formül kartı silindi.');
  };

  const handleSelectKnowledgeCard = (card) => {
    // İlgili dersin sınav cheatsheet kartına yönlendir ve vurgula
    const targetExam =
      data.exams.find((e) => e.id === card.examId) ||
      data.exams.find((e) => e.courseId === card.courseId);

    if (targetExam) {
      setSelectedCourseId('all');
      if (activeTab !== 'all' && activeTab !== 'exams') {
        setActiveTab('exams');
      }
      setHighlightedExamId(targetExam.id);
      setTimeout(() => {
        const el = document.getElementById(`exam-card-${targetExam.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
      showNotification(`${card.title} için ilgili dersin Cheatsheet alanına gidildi.`);
    } else {
      setSelectedCourseId(card.courseId || 'all');
      setActiveTab('study');
    }
  };

  const handleSelectExamFromCountdown = (exam) => {
    setHighlightedExamId(exam.id);
    if (activeTab !== 'all' && activeTab !== 'exams') {
      setActiveTab('exams');
    }
    setTimeout(() => {
      const el = document.getElementById(`exam-card-${exam.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // --- 6. MEZUNİYET & TRANSKRİPT İŞLEMLERİ ---
  const handleUpdateGraduationGoals = (goalUpdates) => {
    setData((prev) => ({
      ...prev,
      graduation: {
        ...(prev.graduation || {}),
        goals: {
          ...(prev.graduation?.goals || {}),
          ...goalUpdates,
        },
      },
    }));
  };

  const handleAddTranscriptCourse = (courseItem) => {
    const newItem = {
      id: `tr-${Date.now()}`,
      ...courseItem,
    };
    setData((prev) => ({
      ...prev,
      graduation: {
        ...(prev.graduation || {}),
        transcriptCourses: [
          newItem,
          ...(prev.graduation?.transcriptCourses || []),
        ],
      },
    }));
    showNotification(`${newItem.code} transkripte eklendi.`);
  };

  const handleDeleteTranscriptCourse = (id) => {
    setData((prev) => ({
      ...prev,
      graduation: {
        ...(prev.graduation || {}),
        transcriptCourses: (prev.graduation?.transcriptCourses || []).filter(
          (item) => item.id !== id
        ),
      },
    }));
  };

  const handleImportTranscriptCourses = (items, mode = 'append') => {
    setData((prev) => ({
      ...prev,
      graduation: {
        ...(prev.graduation || {}),
        transcriptCourses:
          mode === 'replace'
            ? items
            : [...items, ...(prev.graduation?.transcriptCourses || [])],
      },
    }));
    showNotification(`${items.length} transkript dersi başarıyla aktarıldı!`);
  };

  const handleResetSampleTranscript = () => {
    setData((prev) => ({
      ...prev,
      graduation: {
        ...(prev.graduation || {}),
        transcriptCourses: createSampleTranscriptCourses(),
      },
    }));
    showNotification('Örnek transkript verileri yüklendi.');
  };

  // --- 7. JSON YEDEKLEME (EXPORT) & GERİ YÜKLEME (IMPORT) ---
  const handleExportJson = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      app: 'Akademik Ders ve Sınav Takip Merkezi',
      version: '2.0.0',
      ...data,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const datePart = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `akademik-takip-yedek-${datePart}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Tüm verileriniz JSON olarak indirildi.');
  };

  const handleImportJson = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result || '{}'));
        if (
          !Array.isArray(parsed.courses) ||
          !Array.isArray(parsed.assignments) ||
          !Array.isArray(parsed.topics) ||
          !Array.isArray(parsed.exams)
        ) {
          throw new Error(
            'Geçersiz JSON şeması: courses, assignments, topics ve exams dizileri gereklidir.'
          );
        }
        setData((prev) => ({
          ...prev,
          courses: parsed.courses,
          assignments: parsed.assignments,
          topics: parsed.topics,
          exams: parsed.exams,
          graduation: parsed.graduation || prev.graduation,
          knowledgeCards: parsed.knowledgeCards || prev.knowledgeCards || createDefaultKnowledgeCards(),
        }));
        setSelectedCourseId('all');
        showNotification('JSON yedeği başarıyla geri yüklendi!');
      } catch (err) {
        showNotification(
          `JSON yükleme hatası: ${err.message || 'Dosya okunamadı'}`,
          'error'
        );
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    const fresh = createInitialData();
    setData(fresh);
    setSelectedCourseId('all');
    setSearchQuery('');
    showNotification('Örnek veriler sıfırlandı.');
  };

  // --- ARAMA VE DERS FİLTRESİ ---
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCourses = useMemo(() => {
    return data.courses.filter((c) => {
      if (selectedCourseId !== 'all' && c.id !== selectedCourseId) return false;
      if (!normalizedQuery) return true;
      return (
        c.code.toLowerCase().includes(normalizedQuery) ||
        c.name.toLowerCase().includes(normalizedQuery) ||
        (c.instructor || '').toLowerCase().includes(normalizedQuery)
      );
    });
  }, [data.courses, selectedCourseId, normalizedQuery]);

  const filteredAssignments = useMemo(() => {
    return data.assignments.filter((a) => {
      if (selectedCourseId !== 'all' && a.courseId !== selectedCourseId)
        return false;
      if (!normalizedQuery) return true;
      return (
        a.title.toLowerCase().includes(normalizedQuery) ||
        (a.description || '').toLowerCase().includes(normalizedQuery)
      );
    });
  }, [data.assignments, selectedCourseId, normalizedQuery]);

  const filteredTopics = useMemo(() => {
    return data.topics.filter((t) => {
      if (selectedCourseId !== 'all' && t.courseId !== selectedCourseId)
        return false;
      if (!normalizedQuery) return true;
      return (
        t.title.toLowerCase().includes(normalizedQuery) ||
        (t.unit || '').toLowerCase().includes(normalizedQuery) ||
        (t.notes || '').toLowerCase().includes(normalizedQuery)
      );
    });
  }, [data.topics, selectedCourseId, normalizedQuery]);

  const filteredExams = useMemo(() => {
    return data.exams.filter((e) => {
      if (selectedCourseId !== 'all' && e.courseId !== selectedCourseId)
        return false;
      if (!normalizedQuery) return true;
      return (
        e.examType.toLowerCase().includes(normalizedQuery) ||
        (e.location || '').toLowerCase().includes(normalizedQuery) ||
        (e.cheatsheetContent || '').toLowerCase().includes(normalizedQuery) ||
        (e.scopeTopics || []).some((s) =>
          s.toLowerCase().includes(normalizedQuery)
        )
      );
    });
  }, [data.exams, selectedCourseId, normalizedQuery]);

  return (
    <div
      className={`${
        theme === 'dark' ? 'dark ' : ''
      }min-h-screen flex flex-col bg-[#f8fafc] text-slate-700 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200`}
    >
      {/* Pastel Bildirim Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2.5 text-xs font-medium text-slate-700 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-100">
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Acil Bildirim & 24 Saat E-posta Çekmecesi */}
      <NotificationCenterDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        urgentAlerts={urgentAlerts}
        smartRecommendations={smartRecommendations}
        notificationPermission={notificationPermission}
        onRequestPermission={handleRequestNotificationPermission}
        onTriggerDailyStudyNotification={handleTriggerDailyStudyNotification}
        notificationSettings={data.notificationSettings}
        onUpdateNotificationSettings={handleUpdateNotificationSettings}
        notificationHistory={data.notificationHistory || []}
        onSendUrgentEmail={handleSendUrgentEmail}
        onClearNotificationHistory={handleClearNotificationHistory}
        onNavigateToAlert={handleNavigateToAlert}
      />

      {/* Üst Menü */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
        courses={data.courses}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetDemo={handleResetDemo}
        urgentAlertCount={urgentAlerts.length}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Ferah Ana İçerik Alanı */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* Genel Bakış Sayaçları + "Bugün Neye Odaklanmalıyım?" Akıllı Öneri Kartı */}
        <DashboardStats
          courses={data.courses}
          assignments={data.assignments}
          topics={data.topics}
          exams={data.exams}
          graduation={data.graduation}
          onUpdateTopicStatus={(topicId, newStatus) =>
            handleUpdateTopic(topicId, { status: newStatus })
          }
          onNavigateToSection={(sectionId) => setActiveTab(sectionId)}
          onTriggerDailyStudyNotification={handleTriggerDailyStudyNotification}
        />

        {/* Ana Ekranda Hızlı Bilgi ve Formül Kartları (Knowledge Widgets) */}
        {activeTab === 'all' && (
          <KnowledgeWidgets
            knowledgeCards={data.knowledgeCards || []}
            courses={data.courses}
            exams={data.exams}
            onSelectCard={handleSelectKnowledgeCard}
            onAddKnowledgeCard={handleAddKnowledgeCard}
            onDeleteKnowledgeCard={handleDeleteKnowledgeCard}
          />
        )}

        {/* Merkezi Sınav Takvimi ve Canlı Geri Sayım (Hem Genel Görünümde hem Sınavlar Sekmesinde) */}
        {(activeTab === 'all' || activeTab === 'exams') && (
          <ExamCountdownHub
            exams={filteredExams}
            courses={data.courses}
            onSelectExam={handleSelectExamFromCountdown}
          />
        )}

        {/* Mezuniyet Şartları & Transkript & Olası GANO Simülatörü */}
        {(activeTab === 'all' || activeTab === 'graduation') && (
          <GraduationTranscriptSection
            courses={data.courses}
            graduation={data.graduation}
            onUpdateCourse={handleUpdateCourse}
            onUpdateGraduationGoals={handleUpdateGraduationGoals}
            onAddTranscriptCourse={handleAddTranscriptCourse}
            onDeleteTranscriptCourse={handleDeleteTranscriptCourse}
            onImportTranscriptCourses={handleImportTranscriptCourses}
            onResetSampleTranscript={handleResetSampleTranscript}
          />
        )}

        {/* 1. Ders Yönetimi ve Not Ağırlıkları */}
        {(activeTab === 'all' || activeTab === 'courses') && (
          <CoursesSection
            courses={filteredCourses}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddCourseLink={handleAddCourseLink}
            onDeleteCourseLink={handleDeleteCourseLink}
            onSelectCourseFilter={setSelectedCourseId}
            selectedCourseId={selectedCourseId}
          />
        )}

        {/* 2. Ödev ve Proje Takipçisi */}
        {(activeTab === 'all' || activeTab === 'assignments') && (
          <AssignmentsSection
            assignments={filteredAssignments}
            courses={data.courses}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        )}

        {/* 3. Çalışma Planı (Study Tracker) */}
        {(activeTab === 'all' || activeTab === 'study') && (
          <StudyTrackerSection
            topics={filteredTopics}
            courses={
              selectedCourseId === 'all'
                ? data.courses
                : data.courses.filter((c) => c.id === selectedCourseId)
            }
            onAddTopic={handleAddTopic}
            onUpdateTopic={handleUpdateTopic}
            onDeleteTopic={handleDeleteTopic}
          />
        )}

        {/* 4. Sınav Detayları ve Cheatsheet Merkezi */}
        {(activeTab === 'all' || activeTab === 'exams') && (
          <ExamsCheatsheetSection
            exams={filteredExams}
            courses={data.courses}
            onAddExam={handleAddExam}
            onUpdateExam={handleUpdateExam}
            onDeleteExam={handleDeleteExam}
            highlightedExamId={highlightedExamId}
          />
        )}
      </main>

      {/* Minimal Alt Bilgi */}
      <footer className="mt-12 border-t border-slate-200/70 bg-white/60 py-5 text-center text-xs text-slate-400 dark:border-slate-800/70 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Akademik Ders ve Sınav Takip Merkezi • Verileriniz tarayıcınızda (<code>localStorage</code>) saklanır.
          </span>
          <span>
            Pastel Minimalist Arayüz • Aydınlık & Karanlık Mod • Mezuniyet & GANO Simülatörü
          </span>
        </div>
      </footer>
    </div>
  );
}
