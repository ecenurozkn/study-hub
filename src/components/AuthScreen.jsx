import React, { useState } from 'react';
import {
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
import {
  FlameMascot,
  CloudMascot,
  PentagonMascot,
  StarMascot,
  DropMascot,
} from './MascotIcons';

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
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#DDD6FE] via-[#E0E7FF] to-[#EDE9FE] px-4 py-8 text-slate-700">
      {/* Üst Minimal Marka Alanı */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white shadow-habitz-sm">
            <FlameMascot className="h-9 w-9" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 sm:text-lg">
              Habitz Akademik Ders & Sınav Merkezi
            </h1>
            <p className="text-xs text-slate-600">
              Çok Kullanıcılı Kişisel Akademik Çalışma Alanı
            </p>
          </div>
        </div>

        <span className="hidden rounded-full border border-white bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#8B5CF6] shadow-2xs sm:inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>Kişisel Veri İzolasyonu Aktif</span>
        </span>
      </div>

      {/* Orta Kart: Giriş Yap / Kayıt Ol */}
      <div className="mx-auto my-8 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-white/95 bg-white shadow-habitz lg:grid-cols-12">
        {/* Sol Habitz Tanıtım Paneli (5/12) */}
        <div className="flex flex-col justify-between border-b border-violet-100 bg-gradient-to-br from-[#F5F3FF] via-[#EFF6FF] to-[#FFF1F2] p-7 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C4B5FD] bg-white px-3 py-1 text-xs font-bold text-[#8B5CF6] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span>Habitz Tasarım Dili • Akademik Asistan</span>
            </span>

            {/* Sevimli Karakter Ailesi */}
            <div className="flex items-center gap-2 pt-1">
              <div className="rounded-2xl bg-white p-2 shadow-2xs">
                <FlameMascot className="h-9 w-9" />
              </div>
              <div className="rounded-2xl bg-white p-2 shadow-2xs">
                <CloudMascot className="h-8 w-8" />
              </div>
              <div className="rounded-2xl bg-white p-2 shadow-2xs">
                <PentagonMascot className="h-8 w-8" />
              </div>
              <div className="rounded-2xl bg-white p-2 shadow-2xs">
                <StarMascot className="h-8 w-8" />
              </div>
              <div className="rounded-2xl bg-white p-2 shadow-2xs">
                <DropMascot className="h-8 w-8" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold leading-snug text-slate-800">
              Derslerinizi, Haftalık Programınızı ve Sınavlarınızı Keyifle Yönetin
            </h2>

            <p className="text-xs leading-relaxed text-slate-600">
              Her öğrenci hesabı kendi e-posta adresine özel izole hafızada (
              <code className="rounded bg-white/90 px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#8B5CF6]">
                studyhub_user_&#123;email&#125;_data
              </code>
              ) saklanır ve sıfırdan temiz bir başlangıç sunar.
            </p>

            <ul className="space-y-2.5 pt-1 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6EE7B7]" />
                <span>Zorunlu & Seçmeli dersler (OC 0 Kredi/AKTS destekli)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#93C5FD]" />
                <span>Haftalık ders programı ve sevimli Kawaii maskotlar</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FDA4AF]" />
                <span>Ayrı sınav takvimi, geri sayım ve 0–100 sınav sonuçları</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
                <span>Ders bazlı Çıkmış Soru PDF & Çalışma Notları arşivi</span>
              </li>
            </ul>
          </div>

          {/* Bu Tarayıcıda Kayıtlı Hesaplar (Hızlı Seçim) */}
          {registeredUsers.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white bg-white/90 p-3.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                <Users className="h-3.5 w-3.5 text-[#8B5CF6]" />
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C4B5FD] bg-[#F5F3FF] px-3 py-1 text-[11px] font-bold text-violet-900 transition hover:bg-[#EDE9FE]"
                  >
                    <span>{u.name}</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      ({u.email})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ Form Paneli (7/12) */}
        <div className="p-7 sm:p-8 lg:col-span-7">
          {/* Giriş Yap / Kayıt Ol Sekme Seçici */}
          <div className="inline-flex rounded-full border border-violet-100 bg-[#F5F3FF] p-1">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                mode === 'signin'
                  ? 'bg-[#8B5CF6] text-white shadow-2xs'
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
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                mode === 'signup'
                  ? 'bg-[#8B5CF6] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Yeni Hesap Oluştur (Sign Up)</span>
            </button>
          </div>

          <div className="mt-5">
            <h3 className="text-base font-extrabold text-slate-800">
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
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#FDA4AF] bg-[#FFF1F2] px-3.5 py-2.5 text-xs font-bold text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-600">
                  Ad Soyad veya Kullanıcı Adı *
                </label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Ece Yılmaz"
                    className="w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/60 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-[#8B5CF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C4B5FD]/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600">
                {mode === 'signin'
                  ? 'E-posta Adresi veya Kullanıcı Adı *'
                  : 'Öğrenci E-posta Adresi * (24 Saat Hatırlatmaları Bu Adrese Gönderilir)'}
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400" />
                <input
                  type={mode === 'signup' ? 'email' : 'text'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@universite.edu.tr"
                  className="w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/60 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-[#8B5CF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C4B5FD]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600">
                Şifre *
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-violet-100 bg-[#F5F3FF]/60 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-[#8B5CF6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C4B5FD]/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#8B5CF6] py-3 px-5 text-xs font-extrabold text-white shadow-habitz-sm transition hover:bg-violet-600"
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
                  className="font-bold text-[#8B5CF6] hover:underline"
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
                  className="font-bold text-[#8B5CF6] hover:underline"
                >
                  Giriş ekranına dönün
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="mx-auto w-full max-w-5xl text-center text-xs font-medium text-slate-600">
        Akademik Ders ve Sınav Takip Merkezi • Habitz Pastel Arayüz Sistemi
      </div>
    </div>
  );
}
