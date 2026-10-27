import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';

export default function AuthScreen({
  registeredUsers = [],
  onSignIn,
  onSignUp,
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Lütfen e-posta adresinizi ve şifrenizi girin.');
      return;
    }

    if (mode === 'signup') {
      if (!trimmedName) {
        setError('Lütfen adınızı veya kullanıcı adınızı girin.');
        return;
      }
      if (trimmedPassword.length < 4) {
        setError('Şifreniz en az 4 karakter olmalıdır.');
        return;
      }
      const result = onSignUp({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });
      if (!result.ok) {
        setError(result.error || 'Kayıt işlemi başarısız oldu.');
      }
    } else {
      const result = onSignIn({
        identifier: trimmedEmail,
        password: trimmedPassword,
      });
      if (!result.ok) {
        setError(result.error || 'Giriş yapılamadı.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc] px-4 py-8 text-slate-700">
      {/* Üst Minimal Marka Alanı */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200/80 bg-sky-100 text-sky-700 shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-800">
              Akademik Ders & Sınav Takip Merkezi
            </h1>
            <p className="text-xs text-slate-500">
              Çok Kullanıcılı Kişisel Akademik Çalışma Alanı
            </p>
          </div>
        </div>

        <span className="hidden rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-xs font-medium text-emerald-800 sm:inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Kişisel Veri İzolasyonu Aktif</span>
        </span>
      </div>

      {/* Orta Kart: Giriş Yap / Kayıt Ol */}
      <div className="mx-auto my-8 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm lg:grid-cols-12">
        {/* Sol Pastel Tanıtım Paneli (5/12) */}
        <div className="flex flex-col justify-between border-b border-slate-100 bg-gradient-to-br from-sky-50/90 via-violet-50/70 to-emerald-50/80 p-7 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-white/90 px-3 py-1 text-xs font-medium text-violet-800 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span>Ferah Pastel Akademik Asistan</span>
            </span>

            <h2 className="text-xl font-bold leading-snug text-slate-800">
              Derslerinizi, Sınavlarınızı ve Mezuniyet Hedefinizi Tek Ekranda Yönetin
            </h2>

            <p className="text-xs leading-relaxed text-slate-600">
              Her öğrenci hesabı kendi e-posta adresine özel izole hafızada (
              <code className="rounded bg-white/80 px-1 py-0.5 font-mono text-[11px] text-violet-800">
                studyhub_user_&#123;email&#125;_data
              </code>
              ) saklanır ve sıfırdan temiz bir başlangıç sunar.
            </p>

            <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Tamamen boş ve temiz başlangıç (Sıfır yapay veri)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>Çoklu kullanıcı oturumu ve izole ders/not verileri</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Giriş yapılan e-postaya özel 24 saat acil hatırlatıcı</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <span>Transkript denetimi ve What-If GANO simülatörü</span>
              </li>
            </ul>
          </div>

          {/* Bu Tarayıcıda Kayıtlı Hesaplar (Hızlı Seçim) */}
          {registeredUsers.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white/80 bg-white/80 p-3.5 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                <Users className="h-3.5 w-3.5 text-sky-600" />
                <span>Bu Cihazdaki Kayıtlı Hesaplar ({registeredUsers.length})</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {registeredUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setEmail(u.email);
                      setError('');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-sky-50/80 px-2.5 py-1 text-[11px] font-medium text-sky-900 transition hover:bg-sky-100"
                  >
                    <span>{u.name}</span>
                    <span className="text-[10px] text-slate-500">({u.email})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ Form Paneli (7/12) */}
        <div className="p-7 sm:p-8 lg:col-span-7">
          {/* Giriş Yap / Kayıt Ol Sekme Seçici */}
          <div className="inline-flex rounded-full border border-slate-200/90 bg-slate-100/80 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                mode === 'signin'
                  ? 'bg-sky-100 text-sky-900 border border-sky-200/90 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Giriş Yap (Sign In)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                mode === 'signup'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200/90 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Yeni Hesap Oluştur (Sign Up)</span>
            </button>
          </div>

          <div className="mt-5">
            <h3 className="text-base font-semibold text-slate-800">
              {mode === 'signin'
                ? 'Hesabınıza Giriş Yapın'
                : 'Yeni Öğrenci Hesabı Oluşturun'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {mode === 'signin'
                ? 'Kayıtlı e-posta adresiniz ve şifrenizle kendi çalışma alanınıza erişin.'
                : 'E-posta adresinizle sıfırdan temiz bir akademik takip hesabı oluşturun.'}
            </p>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/90 px-3.5 py-2.5 text-xs font-medium text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Ad Soyad veya Kullanıcı Adı *
                </label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Ece Yılmaz"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600">
                {mode === 'signin'
                  ? 'E-posta Adresi veya Kullanıcı Adı *'
                  : 'Öğrenci E-posta Adresi * (24 Saat Hatırlatmaları Bu Adrese Gönderilir)'}
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={mode === 'signup' ? 'email' : 'text'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@universite.edu.tr"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600">
                Şifre *
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-full border py-2.5 px-5 text-xs font-semibold shadow-xs transition ${
                mode === 'signin'
                  ? 'border-sky-200 bg-sky-100/95 text-sky-900 hover:bg-sky-200/80'
                  : 'border-emerald-200 bg-emerald-100/95 text-emerald-900 hover:bg-emerald-200/80'
              }`}
            >
              {mode === 'signin' ? (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Giriş Yap ve Çalışma Alanımı Aç</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Hesap Oluştur ve Temiz Başlangıç Yap</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <span>
                Henüz bir hesabınız yok mu?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className="font-semibold text-sky-700 hover:underline"
                >
                  Hemen yeni hesap oluşturun
                </button>
              </span>
            ) : (
              <span>
                Zaten bir hesabınız var mı?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError('');
                  }}
                  className="font-semibold text-sky-700 hover:underline"
                >
                  Giriş ekranına dönün
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="mx-auto w-full max-w-5xl text-center text-xs text-slate-400">
        Akademik Ders ve Sınav Takip Merkezi • Aydınlık Pastel Minimalist Arayüz
      </div>
    </div>
  );
}
