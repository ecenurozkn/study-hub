import React, { useState, useEffect, useMemo } from 'react';
import AuthScreen from './components/AuthScreen';
import WelcomeEmptyState from './components/WelcomeEmptyState';
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
import { createEmptyUserData } from './data/initialData';
import {
  getUrgent24hAlerts,
  getSmartStudyRecommendations,
} from './utils/dateUtils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const USERS_REGISTRY_KEY = 'studyhub_registered_users_v1';
const ACTIVE_SESSION_KEY = 'studyhub_active_session_v1';

function getUserStorageKey(email) {
  const normalized = String(email || '')
    .trim()
    .toLowerCase();
  return `studyhub_user_${normalized}_data`;
}

function loadRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

function loadActiveSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

function loadUserData(email) {
  const emptyDefaults = createEmptyUserData(email);
  if (!email) return emptyDefaults;

  try {
    const raw = localStorage.getItem(getUserStorageKey(email));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...emptyDefaults,
          courses: Array.isArray(parsed.courses) ? parsed.courses : [],
          assignments: Array.isArray(parsed.assignments)
            ? parsed.assignments
            : [],
          topics: Array.isArray(parsed.topics) ? parsed.topics : [],
          exams: Array.isArray(parsed.exams) ? parsed.exams : [],
          knowledgeCards: Array.isArray(parsed.knowledgeCards)
            ? parsed.knowledgeCards
            : [],
          graduation:
            parsed.graduation &&
            Array.isArray(parsed.graduation.transcriptCourses)
              ? parsed.graduation
              : emptyDefaults.graduation,
          notificationSettings: {
            ...emptyDefaults.notificationSettings,
            ...(parsed.notificationSettings || {}),
            emailAddress: email,
          },
          notificationHistory: Array.isArray(parsed.notificationHistory)
            ? parsed.notificationHistory
            : [],
        };
      }
    }
  } catch (err) {
    console.warn('Kullanıcı verisi okuma hatası:', err);
  }
  return emptyDefaults;
}

export default function App() {
  const [registeredUsers, setRegisteredUsers] = useState(loadRegisteredUsers);
  const [currentUser, setCurrentUser] = useState(loadActiveSession);
  const [data, setData] = useState(() => {
    const session = loadActiveSession();
    return session ? loadUserData(session.email) : createEmptyUserData('');
  });

  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [highlightedExamId, setHighlightedExamId] = useState(null);
  const [forceOpenCourseFormCounter, setForceOpenCourseFormCounter] = useState(0);
  const [notificationPermission, setNotificationPermission] = useState(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [, setTick] = useState(0);

  // Aydınlık mod garantisi (Tarayıcıda önceden kalmış .dark sınıfı varsa temizle)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    if (document.body) {
      document.body.classList.remove('dark');
    }
  }, []);

  // Aktif kullanıcının verilerini kendi e-posta anahtarına (`studyhub_user_${email}_data`) kaydet
  useEffect(() => {
    if (!currentUser?.email) return;
    try {
      const storageKey = getUserStorageKey(currentUser.email);
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (err) {
      console.error('Kullanıcı verisi kaydetme hatası:', err);
    }
  }, [data, currentUser]);

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

  // --- KULLANICI GİRİŞİ (SIGN IN) & KAYIT OL (SIGN UP) & ÇIKIŞ (SIGN OUT) ---
  const handleSignUp = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (exists) {
      return {
        ok: false,
        error:
          'Bu e-posta adresiyle kayıtlı bir hesap zaten var. Lütfen "Giriş Yap" sekmesini kullanın.',
      };
    }

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...registeredUsers, newUser];
    setRegisteredUsers(nextUsers);
    try {
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(nextUsers));
    } catch {
      // ignore
    }

    const sessionUser = { name: newUser.name, email: newUser.email };
    const freshEmptyData = createEmptyUserData(newUser.email);
    try {
      localStorage.setItem(
        getUserStorageKey(newUser.email),
        JSON.stringify(freshEmptyData)
      );
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));
    } catch {
      // ignore
    }

    setCurrentUser(sessionUser);
    setData(freshEmptyData);
    setActiveTab('all');
    setSelectedCourseId('all');
    showNotification(
      `Hoş geldiniz ${newUser.name}! Hesabınız sıfırdan temiz olarak oluşturuldu.`
    );
    return { ok: true };
  };

  const handleSignIn = ({ identifier, password }) => {
    const norm = identifier.trim().toLowerCase();
    const matched = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === norm ||
        (u.name && u.name.trim().toLowerCase() === norm)
    );

    if (!matched) {
      return {
        ok: false,
        error:
          'Bu e-posta veya kullanıcı adına ait hesap bulunamadı. Lütfen önce "Yeni Hesap Oluştur" sekmesinden kayıt olun.',
      };
    }

    if (matched.password !== password) {
      return {
        ok: false,
        error: 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.',
      };
    }

    const sessionUser = { name: matched.name, email: matched.email };
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(sessionUser));
    } catch {
      // ignore
    }

    const userSavedData = loadUserData(matched.email);
    setCurrentUser(sessionUser);
    setData(userSavedData);
    setActiveTab('all');
    setSelectedCourseId('all');
    showNotification(`Tekrar hoş geldiniz, ${matched.name}!`);
    return { ok: true };
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setIsNotificationDrawerOpen(false);
    setSelectedCourseId('all');
    setSearchQuery('');
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

  // --- WEB NOTIFICATIONS API & GİRİŞ YAPILAN E-POSTAYA ÖZEL HATIRLATMA SİSTEMİ ---
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
            .map(
              (r, i) => `${i + 1}) [${r.course?.code || 'Ders'}] ${r.topic.title}`
            )
            .join(' • ')
        : 'Henüz bekleyen çalışma konusu yok.';

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
      recipient: currentUser?.email || '',
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
    const targetEmail = recipient || currentUser?.email || '';
    const newLog = {
      id: `email-${Date.now()}`,
      type: 'email_manual',
      title: subject,
      recipient: targetEmail,
      summary: `${alertCount} adet 24 saat altı acil sınav/ödev hatırlatması ${targetEmail} adresine mailto: ile hazırlandı.`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      notificationHistory: [newLog, ...(prev.notificationHistory || [])],
    }));
    showNotification(
      `24 saat hatırlatması (${targetEmail}) e-posta istemcinize aktarıldı ve geçmişe kaydedildi!`
    );
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
  const handleStartFirstCourse = () => {
    setActiveTab('courses');
    setForceOpenCourseFormCounter((c) => c + 1);
    setTimeout(() => {
      const el = document.getElementById('courses-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleAddCourse = (coursePayload) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      ...coursePayload,
      targetGradeOverride: '',
      assessments: [
        { id: `asm-${Date.now()}-1`, name: 'Ara Sınav (Vize)', weight: 40, score: '' },
        { id: `asm-${Date.now()}-2`, name: 'Final Sınavı', weight: 60, score: '' },
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
      showNotification(
        `${card.title} için ilgili dersin Cheatsheet alanına gidildi.`
      );
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

  // --- 7. JSON YEDEKLEME (EXPORT) & GERİ YÜKLEME (IMPORT) ---
  const handleExportJson = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      userEmail: currentUser?.email || '',
      app: 'Akademik Ders ve Sınav Takip Merkezi',
      version: '3.0.0',
      ...data,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const datePart = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `akademik-takip-${currentUser?.email || 'yedek'}-${datePart}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Kişisel verileriniz JSON olarak indirildi.');
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
          knowledgeCards: parsed.knowledgeCards || prev.knowledgeCards || [],
        }));
        setSelectedCourseId('all');
        showNotification('JSON yedeği hesabınıza başarıyla yüklendi!');
      } catch (err) {
        showNotification(
          `JSON yükleme hatası: ${err.message || 'Dosya okunamadı'}`,
          'error'
        );
      }
    };
    reader.readAsText(file);
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

  // Oturum açılmamışsa Giriş Yap / Kayıt Ol (Sign In & Sign Up) ekranını göster
  if (!currentUser) {
    return (
      <AuthScreen
        registeredUsers={registeredUsers}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-700">
      {/* Pastel Bildirim Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2.5 text-xs font-medium text-slate-700 shadow-lg backdrop-blur-md">
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Acil Bildirim & Giriş Yapılan E-postaya Özel 24 Saat Hatırlatma Çekmecesi */}
      <NotificationCenterDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        currentUser={currentUser}
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
        currentUser={currentUser}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
        courses={data.courses}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        urgentAlertCount={urgentAlerts.length}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Ferah Ana İçerik Alanı */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* İlk Giriş Boş Durum (Empty State) Rehber Kartı */}
        {data.courses.length === 0 && (
          <WelcomeEmptyState
            userName={currentUser.name}
            userEmail={currentUser.email}
            onStartAddCourse={handleStartFirstCourse}
            onNavigateTab={setActiveTab}
          />
        )}

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

        {/* Merkezi Sınav Takvimi ve Canlı Geri Sayım */}
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
            forceOpenCreateCounter={forceOpenCourseFormCounter}
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
      <footer className="mt-12 border-t border-slate-200/70 bg-white/70 py-5 text-center text-xs text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
          <span>
            Akademik Ders ve Sınav Takip Merkezi • Aktif Hesap:{' '}
            <code className="font-mono text-slate-600">
              {getUserStorageKey(currentUser.email)}
            </code>
          </span>
          <span>
            Aydınlık Pastel Minimalist Arayüz • Çok Kullanıcılı Kişisel Hafıza
          </span>
        </div>
      </footer>
    </div>
  );
}
