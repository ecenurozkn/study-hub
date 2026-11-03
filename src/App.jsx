import React, { useState, useEffect, useMemo } from 'react';
import AuthScreen from './components/AuthScreen';
import WelcomeEmptyState from './components/WelcomeEmptyState';
import Header from './components/Header';
import WeeklyScheduleSection from './components/WeeklyScheduleSection';
import CoursesSection from './components/CoursesSection';
import ExamsCheatsheetSection from './components/ExamsCheatsheetSection';
import { FlameMascot } from './components/MascotIcons';
import { createEmptyUserData } from './data/initialData';
import {
  CheckCircle2,
  AlertCircle,
  LogOut,
  RotateCcw,
  Mail,
  BookOpen,
  CalendarDays,
  FileSpreadsheet,
} from 'lucide-react';

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
          exams: Array.isArray(parsed.exams) ? parsed.exams : [],
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
  const [toast, setToast] = useState(null);
  const [highlightedExamId, setHighlightedExamId] = useState(null);
  const [forceOpenCourseFormCounter, setForceOpenCourseFormCounter] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const [, setTick] = useState(0);

  // Aydınlık pastel mod garantisi
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

  // Periyodik geri sayım yenileme
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
    }, 3400);
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
    setSelectedCourseId('all');
    setConfirmReset(false);
  };

  const handleResetAllData = () => {
    if (!currentUser?.email) return;
    const freshData = createEmptyUserData(currentUser.email);
    setData(freshData);
    setSelectedCourseId('all');
    setConfirmReset(false);
    try {
      localStorage.setItem(
        getUserStorageKey(currentUser.email),
        JSON.stringify(freshData)
      );
    } catch {
      // ignore
    }
    showNotification('Tüm ders, sınav ve arşiv verileriniz sıfırlandı.');
  };

  // --- 1. DERS YÖNETİMİ VE MATERYAL ARŞİVİ İŞLEMLERİ ---
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
      examPdfs: [],
      studyNotesText: '',
      studyNoteItems: [],
      links: [],
    };
    setData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
    showNotification(`${newCourse.code} dersi ve arşivi oluşturuldu.`);
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
      exams: prev.exams.filter((e) => e.courseId !== courseId),
    }));
    if (selectedCourseId === courseId) {
      setSelectedCourseId('all');
    }
    showNotification(`${target?.code || 'Ders'} silindi.`);
  };

  // --- 2. SINAV TAKVİMİ & 0-100 SONUÇ İŞLEMLERİ ---
  const handleAddExam = (payload) => {
    const newExam = {
      id: `exm-${Date.now()}`,
      ...payload,
    };
    setData((prev) => ({
      ...prev,
      exams: [...prev.exams, newExam],
    }));
    showNotification('Yeni sınav takvime eklendi.');
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
    showNotification('Sınav silindi.');
  };

  // Seçili derse göre filtreleme
  const filteredCourses = useMemo(() => {
    if (selectedCourseId === 'all') return data.courses;
    return data.courses.filter((c) => c.id === selectedCourseId);
  }, [data.courses, selectedCourseId]);

  const filteredExams = useMemo(() => {
    if (selectedCourseId === 'all') return data.exams;
    return data.exams.filter((e) => e.courseId === selectedCourseId);
  }, [data.exams, selectedCourseId]);

  // Oturum açılmamışsa Giriş Yap / Kayıt Ol ekranını göster
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F3F0FF] via-[#EDE9FE] to-[#F3F0FF] pb-28 text-slate-700">
      {/* Pastel Bildirim Toast */}
      {toast && (
        <div className="fixed bottom-24 right-5 z-50 flex items-center gap-2.5 rounded-full border border-white/95 bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-habitz backdrop-blur-md">
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Minimalist ve Sevimli Yeni Üst Başlık + Yüzen Alt Menü (Floating Dock) */}
      <Header
        currentUser={currentUser}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setConfirmReset(false);
        }}
      />

      {/* Ferah Ana İçerik Alanı */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-4 sm:px-6 lg:px-8">
        {/* 🏠 GENEL BAKIŞ: Merkezi "Hoş Geldiniz" Kartı ve 3 Adımlı Rehber */}
        {activeTab === 'all' && (
          <WelcomeEmptyState
            userName={currentUser.name}
            userEmail={currentUser.email}
            courseCount={data.courses.length}
            examCount={data.exams.length}
            onStartAddCourse={handleStartFirstCourse}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* 👤 PROFİL: Kullanıcı Bilgileri ve Veri Sıfırlama */}
        {activeTab === 'profile' && (
          <section className="rounded-3xl border border-white/95 bg-white p-6 sm:p-8 shadow-habitz">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] border border-[#C4B5FD]/60">
                  <FlameMascot className="h-12 w-12" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-0.5 text-[11px] font-bold text-purple-700">
                    Aktif Öğrenci Profili
                  </span>
                  <h2 className="mt-1 text-lg font-extrabold text-slate-800">
                    {currentUser.name || 'Öğrenci'}
                  </h2>
                  <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Mail className="h-3.5 w-3.5 text-purple-600" />
                    <span>{currentUser.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                    <span>Verileri Sıfırla</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-1.5">
                    <span className="text-xs font-bold text-rose-800">
                      Tüm veriler silinsin mi?
                    </span>
                    <button
                      type="button"
                      onClick={handleResetAllData}
                      className="rounded-xl bg-rose-500 px-3 py-1 text-xs font-bold text-white hover:bg-rose-600"
                    >
                      Evet, Sıfırla
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="rounded-xl bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Vazgeç
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>

            {/* Hızlı Modül Geçiş Kartları */}
            <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setActiveTab('courses')}
                className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50/50 p-4 text-left transition hover:border-purple-300"
              >
                <BookOpen className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    Ders & Arşiv
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {data.courses.length} kayıtlı ders
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 p-4 text-left transition hover:border-sky-300"
              >
                <CalendarDays className="h-5 w-5 text-sky-600" />
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    Haftalık Program
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Gün ve saat sıralı akış
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('exams')}
                className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-left transition hover:border-rose-300"
              >
                <FileSpreadsheet className="h-5 w-5 text-rose-500" />
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    Sınavlar & Sonuçlar
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {data.exams.length} sınav kaydı
                  </p>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* 📚 DERS & ARŞİV: Zorunlu/Seçmeli Dersler, 0 Kredi/AKTS ve PDF/Not Arşivi */}
        {(activeTab === 'all' || activeTab === 'courses') && (
          <CoursesSection
            courses={filteredCourses}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onSelectCourseFilter={setSelectedCourseId}
            selectedCourseId={selectedCourseId}
            forceOpenCreateCounter={forceOpenCourseFormCounter}
            onNotify={showNotification}
          />
        )}

        {/* 🗓️ PROGRAM: Haftalık Ders Programı */}
        {(activeTab === 'all' || activeTab === 'schedule') && (
          <WeeklyScheduleSection
            courses={filteredCourses}
            onSelectCourse={(courseId) => {
              setSelectedCourseId(
                selectedCourseId === courseId ? 'all' : courseId
              );
              setActiveTab('courses');
            }}
            onOpenAddCourse={handleStartFirstCourse}
          />
        )}

        {/* 📝 SINAVLAR: Sınav Takvimi ve 0–100 Sınav Sonuçları */}
        {(activeTab === 'all' || activeTab === 'exams') && (
          <ExamsCheatsheetSection
            exams={filteredExams}
            courses={data.courses}
            onAddExam={handleAddExam}
            onUpdateExam={handleUpdateExam}
            onDeleteExam={handleDeleteExam}
            highlightedExamId={highlightedExamId}
            onNotify={showNotification}
          />
        )}
      </main>
    </div>
  );
}
