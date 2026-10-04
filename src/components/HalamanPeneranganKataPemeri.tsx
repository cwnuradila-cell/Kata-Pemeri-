import React, { useState } from 'react';
import { ShieldCheck, Volume2, Lightbulb, AlertTriangle, CheckCircle, ArrowRight, Zap, Flame, Car, Home, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { ttsManager } from '../utils/textToSpeech';

interface HalamanPeneranganKataPemeriProps {
  onStartPractice: () => void;
  onAskEva: (question: string) => void;
}

export const HalamanPeneranganKataPemeri: React.FC<HalamanPeneranganKataPemeriProps> = ({
  onStartPractice,
  onAskEva,
}) => {
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3>(3);
  const [activeTabSection, setActiveTabSection] = useState<'penerangan' | 'contohTahun' | 'klinikKesalahan'>('contohTahun');
  const [interactiveQuizState, setInteractiveQuizState] = useState<{ [key: string]: string }>({});

  const playSpeech = (text: string) => {
    soundManager.playRobotChirp();
    ttsManager.speak(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Banner: Tema Keselamatan & Kata Pemeri */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-radial from-white/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-xs mb-3 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-900" />
              Modul Khusus DSKP 5.1.4 (vii) • Tema Keselamatan
            </div>
            <h1 className="font-fun text-2xl md:text-4xl font-extrabold tracking-tight">
              Panduan Teliti Kata Pemeri: <span className="text-amber-300">"ialah"</span> & <span className="text-rose-300">"adalah"</span>
            </h1>
            <p className="text-sm md:text-base text-blue-100 mt-2 leading-relaxed">
              Kuasai peraturan tatabahasa kata pemeri melalui situasi keselamatan jalan raya, keselamatan di rumah/sekolah, serta keselamatan peralatan elektrik (Buku Teks Tahun 3 m/s 57).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() =>
                playSpeech(
                  'Peraturan emas kata pemeri: "ialah" mesti hadir di hadapan Frasa Nama. Manakala "adalah" hadir di hadapan Frasa Adjektif dan Frasa Sendi Nama. Ingat peraturan ini demi keselamatan ayat kamu!'
                )
              }
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white font-fun font-bold text-xs transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              Dengar Penjelasan Sahabat AI
            </button>

            <button
              type="button"
              onClick={onStartPractice}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-fun font-bold text-xs shadow-lg transition cursor-pointer"
            >
              <span>🎮</span>
              Mula Latihan Interaktif
            </button>
          </div>
        </div>
      </div>

      {/* 2 FORMULA EMAS INFOGRAFIK KATA PEMERI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KOTAK 1: IALAH */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-3 border-blue-400 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -z-0 opacity-60"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white font-fun font-bold text-lg shadow-sm">
                1. IALAH
              </span>
              <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-blue-100 text-blue-900 border border-blue-300">
                + FRASA NAMA
              </span>
            </div>

            <h3 className="font-fun text-xl font-bold text-slate-900 mb-2">
              Hadir di hadapan <span className="text-blue-600 underline">Frasa Nama</span> sahaja!
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
              Digunakan untuk menunjukkan <strong>persamaan</strong> atau memberi <strong>huraian/definisi</strong> tentang sesuatu subjek keselamatan.
            </p>

            {/* Formula structure */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2 mb-4 font-mono">
              <div className="font-bold text-blue-900 font-sans">Formula Pembinaan Ayat:</div>
              <div className="bg-white p-2 rounded-xl border border-blue-300">
                [Subjek Keselamatan] + <strong className="text-blue-700 bg-blue-100 px-1 rounded">ialah</strong> + [Frasa Nama]
              </div>
            </div>

            {/* 3 Contoh Tema Keselamatan */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  Lintasan belang <strong className="text-blue-700 font-bold">ialah</strong>{' '}
                  <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">laluan khas melintas jalan</span>. (Tahun 1)
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  Peti pertolongan cemas <strong className="text-blue-700 font-bold">ialah</strong>{' '}
                  <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">kotak rawatan luka ringan</span>. (Tahun 2)
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  Mangsa renjatan elektrik <strong className="text-blue-700 font-bold">ialah</strong>{' '}
                  <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">seorang suri rumah</span>. (Buku Teks Thn 3 m/s 57)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOTAK 2: ADALAH */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-3 border-rose-400 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-full -z-0 opacity-60"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-fun font-bold text-lg shadow-sm">
                2. ADALAH
              </span>
              <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-rose-100 text-rose-900 border border-rose-300">
                + FRASA ADJEKTIF / SENDI NAMA
              </span>
            </div>

            <h3 className="font-fun text-xl font-bold text-slate-900 mb-2">
              Hadir di hadapan <span className="text-rose-600 underline">Frasa Adjektif</span> & <span className="text-rose-600 underline">Frasa Sendi Nama</span>!
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
              Digunakan untuk menerangkan <strong>sifat, keadaan bahaya, atau tujuan/arah/punca</strong> sesuatu tindakan keselamatan.
            </p>

            {/* Formula structure */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-2 mb-4 font-mono">
              <div className="font-bold text-rose-900 font-sans">Formula Pembinaan Ayat:</div>
              <div className="bg-white p-2 rounded-xl border border-rose-300">
                [Tindakan Keselamatan] + <strong className="text-rose-700 bg-rose-100 px-1 rounded">adalah</strong> + [Frasa Adjektif / Sendi Nama]
              </div>
            </div>

            {/* 3 Contoh Tema Keselamatan */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <span className="text-rose-600 font-bold">✓</span>
                <div>
                  Melintas jalan tanpa melihat kiri kanan <strong className="text-rose-700 font-bold">adalah</strong>{' '}
                  <span className="bg-rose-100 text-rose-900 px-1 py-0.5 rounded font-semibold">sangat berbahaya [Frasa Adjektif]</span>. (Tahun 1)
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <span className="text-rose-600 font-bold">✓</span>
                <div>
                  Topi keledar ini <strong className="text-rose-700 font-bold">adalah</strong>{' '}
                  <span className="bg-purple-100 text-purple-900 px-1 py-0.5 rounded font-semibold">untuk keselamatan adik [Frasa Sendi Nama]</span>. (Tahun 2)
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <span className="text-rose-600 font-bold">✓</span>
                <div>
                  Langkah berjaga-jaga itu <strong className="text-rose-700 font-bold">adalah</strong>{' '}
                  <span className="bg-rose-100 text-rose-900 px-1 py-0.5 rounded font-semibold">penting demi keselamatan kita</span>. (Buku Teks Thn 3 m/s 57)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PERINCIAN MENGIKUT TAHUN 1, 2, DAN 3 DENGAN TEMA KESELAMATAN */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-3 border-amber-300">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Perkembangan Aspek Tatabahasa KSSR
            </div>
            <h2 className="font-fun text-2xl font-bold text-slate-900">
              Penerangan Bertahap Mengikut Tahap: Tahun 1, Tahun 2 & Tahun 3
            </h2>
            <p className="text-xs text-slate-500">
              Pilih tahun di bawah untuk melihat aplikasi Kata Pemeri mengikut tahap kognitif murid dan tema keselamatan sekolah:
            </p>
          </div>

          {/* Tahun selector buttons */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[1, 2, 3].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setSelectedYear(yr as 1 | 2 | 3);
                }}
                className={`px-4 py-2 rounded-xl font-fun font-bold text-xs transition cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tahun {yr} SK
              </button>
            ))}
          </div>
        </div>

        {/* TAHUN 1 CONTENT */}
        {selectedYear === 1 && (
          <div className="mt-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-fun text-lg font-bold text-blue-950">
                  Tahun 1: Asas Keselamatan Diri, Jalan Raya & Taman Permainan
                </h3>
                <p className="text-xs text-blue-800">
                  Fokus: Mengenal pasti kata nama konkrit (benda/orang) untuk "ialah" dan kata adjektif sifat mudah (bahaya, selamat, elok) untuk "adalah".
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-blue-600 block mb-2 font-fun">
                  Contoh Penggunaan "IALAH" (Tahun 1):
                </span>
                <ul className="space-y-3 text-xs text-slate-800">
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    1. Lampu hijau <strong className="text-blue-700">ialah</strong>{' '}
                    <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">isyarat kenderaan berjalan</span>.
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    2. Encik Roslan <strong className="text-blue-700">ialah</strong>{' '}
                    <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">pengawal lalu lintas di sekolah kami</span>.
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    3. Buaian besi yang berkarat itu <strong className="text-blue-700">ialah</strong>{' '}
                    <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">alat permainan yang rosak</span>.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-rose-600 block mb-2 font-fun">
                  Contoh Penggunaan "ADALAH" (Tahun 1):
                </span>
                <ul className="space-y-3 text-xs text-slate-800">
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    1. Berlari di tepi jalan raya <strong className="text-rose-700">adalah</strong>{' '}
                    <span className="bg-rose-100 text-rose-900 px-1 py-0.5 rounded font-semibold">sangat bahaya [Frasa Adjektif]</span>.
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    2. Memegang tangan ibu ketika melintas jalan <strong className="text-rose-700">adalah</strong>{' '}
                    <span className="bg-rose-100 text-rose-900 px-1 py-0.5 rounded font-semibold">selamat [Frasa Adjektif]</span>.
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    3. Pesanan cikgu itu <strong className="text-rose-700">adalah</strong>{' '}
                    <span className="bg-purple-100 text-purple-900 px-1 py-0.5 rounded font-semibold">untuk keselamatan murid-murid [Frasa Sendi Nama]</span>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAHUN 2 CONTENT */}
        {selectedYear === 2 && (
          <div className="mt-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-fun text-lg font-bold text-emerald-950">
                  Tahun 2: Keselamatan di Rumah, Bilik Darjah, Makmal & Sukan
                </h3>
                <p className="text-xs text-emerald-800">
                  Fokus: Membezakan Frasa Nama (peralatan perlindungan) dengan Frasa Adjektif pancaindera/keadaan (licin, tajam, panas) dan Frasa Sendi Nama (demi, kepada, daripada).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-blue-600 block mb-2 font-fun">
                  Contoh Penggunaan "IALAH" (Tahun 2):
                </span>
                <ul className="space-y-3 text-xs text-slate-800">
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    1. Jaket keselamatan <strong className="text-blue-700">ialah</strong>{' '}
                    <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">pakaian khas untuk mengapungkan badan</span>.
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    2. Nombor 999 <strong className="text-blue-700">ialah</strong>{' '}
                    <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">talian kecemasan penting di Malaysia</span>.
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    3. Bucu meja yang tajam itu <strong className="text-blue-700">ialah</strong>{' '}
                    <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-semibold">punca dahi adik luka</span>.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-rose-600 block mb-2 font-fun">
                  Contoh Penggunaan "ADALAH" (Tahun 2):
                </span>
                <ul className="space-y-3 text-xs text-slate-800">
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    1. Minyak yang tumpah di atas lantai dapur <strong className="text-rose-700">adalah</strong>{' '}
                    <span className="bg-rose-100 text-rose-900 px-1 py-0.5 rounded font-semibold">sangat licin [Frasa Adjektif]</span>.
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    2. Latihan kebakaran di sekolah <strong className="text-rose-700">adalah</strong>{' '}
                    <span className="bg-purple-100 text-purple-900 px-1 py-0.5 rounded font-semibold">demi keselamatan semua warga sekolah [Frasa Sendi Nama]</span>.
                  </li>
                  <li className="p-2.5 bg-white rounded-xl border border-slate-200">
                    3. Tindakan menyentuh suis dengan tangan basah <strong className="text-rose-700">adalah</strong>{' '}
                    <span className="bg-rose-100 text-rose-900 px-1 py-0.5 rounded font-semibold">tidak wajar [Frasa Nafi/Adjektif]</span>.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAHUN 3 CONTENT (DEEPEST DSKP 5.1.4 BUKU TEKS M/S 57) */}
        {selectedYear === 3 && (
          <div className="mt-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-300">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center text-2xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-fun text-lg font-bold text-amber-950">
                  Tahun 3: Keselamatan Elektrik, Pengecas Telefon & Kebakaran (Buku Teks m/s 57)
                </h3>
                <p className="text-xs text-amber-900">
                  Fokus DSKP: Menguasai kata pemeri mengikut konteks dalam petikan rasmi "Beringat Sebelum Kena" serta menganalisis kesalahan umum dalam ayat majmuk.
                </p>
              </div>
            </div>

            {/* Deep Analysis of Textbook m/s 57 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <h4 className="font-fun font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Bedah Siasat Tatabahasa: Petikan Buku Teks m/s 57 "Beringat Sebelum Kena"
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <div className="font-semibold text-slate-800">
                    Ayat 1: "Mangsa terbaharu <strong className="text-blue-700">ialah</strong> seorang suri rumah."
                  </div>
                  <div className="text-slate-500 mt-1">
                    🔍 <strong>Penerangan:</strong> Menggunakan <em>ialah</em> kerana "seorang suri rumah" ialah <strong>Frasa Nama</strong>.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <div className="font-semibold text-slate-800">
                    Ayat 2: "Peralatan berisiko yang menyebabkan kemalangan <strong className="text-blue-700">ialah</strong> pengecas tiruan dan bateri tiruan."
                  </div>
                  <div className="text-slate-500 mt-1">
                    🔍 <strong>Penerangan:</strong> Menggunakan <em>ialah</em> kerana "pengecas tiruan dan bateri tiruan" ialah <strong>Frasa Nama</strong>.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border-l-4 border-rose-500 shadow-sm">
                  <div className="font-semibold text-slate-800">
                    Ayat 3: "Penggunaan pengecas yang telah diubah suai juga <strong className="text-rose-700">adalah</strong> sangat berbahaya."
                  </div>
                  <div className="text-slate-500 mt-1">
                    🔍 <strong>Penerangan:</strong> Menggunakan <em>adalah</em> kerana "sangat berbahaya" ialah <strong>Frasa Adjektif</strong>.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border-l-4 border-rose-500 shadow-sm">
                  <div className="font-semibold text-slate-800">
                    Ayat 4: "Langkah kedua pula <strong className="text-rose-700">adalah</strong> dari segi penggunaannya."
                  </div>
                  <div className="text-slate-500 mt-1">
                    🔍 <strong>Penerangan:</strong> Menggunakan <em>adalah</em> kerana "dari segi" mengandungi <strong>Frasa Sendi Nama</strong>.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border-l-4 border-rose-500 shadow-sm">
                  <div className="font-semibold text-slate-800">
                    Ayat 5: "Langkah tersebut <strong className="text-rose-700">adalah</strong> penting demi keselamatan pengguna."
                  </div>
                  <div className="text-slate-500 mt-1">
                    🔍 <strong>Penerangan:</strong> Menggunakan <em>adalah</em> kerana "penting" ialah <strong>Frasa Adjektif</strong>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KLINIK TATABAHASA: KESALAHAN LAZIM & PEMBETULAN */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-3 border-rose-300">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h2 className="font-fun text-xl md:text-2xl font-bold text-slate-900">
            Klinik Tatabahasa: Kenal Pasti & Betulkan Kesalahan Lazim
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3 rounded-l-xl">❌ Kesalahan Lazim (Salah)</th>
                <th className="p-3">✅ Bentuk Tatabahasa Tepat</th>
                <th className="p-3 rounded-r-xl">💡 Mengapa & Hukum Tatabahasa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 text-red-600 font-semibold line-through">
                  Pengecas tiruan itu ialah sangat berbahaya.
                </td>
                <td className="p-3 text-emerald-700 font-bold">
                  Pengecas tiruan itu <strong className="underline">adalah</strong> sangat berbahaya.
                </td>
                <td className="p-3 text-slate-600 text-xs">
                  "Sangat berbahaya" ialah <em>Frasa Adjektif</em>. Kata pemeri untuk frasa adjektif WAJIB "adalah".
                </td>
              </tr>
              <tr>
                <td className="p-3 text-red-600 font-semibold line-through">
                  Punca kemalangan renjatan elektrik adalah litar pintas.
                </td>
                <td className="p-3 text-emerald-700 font-bold">
                  Punca kemalangan renjatan elektrik <strong className="underline">ialah</strong> litar pintas.
                </td>
                <td className="p-3 text-slate-600 text-xs">
                  "Litar pintas" ialah <em>Frasa Nama</em>. Kata pemeri untuk frasa nama WAJIB "ialah".
                </td>
              </tr>
              <tr>
                <td className="p-3 text-red-600 font-semibold line-through">
                  Topi keledar ini ialah untuk keselamatan adik.
                </td>
                <td className="p-3 text-emerald-700 font-bold">
                  Topi keledar ini <strong className="underline">adalah</strong> untuk keselamatan adik.
                </td>
                <td className="p-3 text-slate-600 text-xs">
                  "Untuk keselamatan" didahului oleh kata sendi nama "untuk". Kata pemeri WAJIB "adalah".
                </td>
              </tr>
              <tr>
                <td className="p-3 text-red-600 font-semibold line-through">
                  Kenyataan tentang punca letupan itu ialah tidak benar.
                </td>
                <td className="p-3 text-emerald-700 font-bold">
                  Kenyataan tentang punca letupan itu <strong className="underline">adalah</strong> tidak benar.
                </td>
                <td className="p-3 text-slate-600 text-xs">
                  Hadir di hadapan kata nafi "tidak", kata pemeri yang digunakan mestilah "adalah".
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* UJI MINDA KILAT: MINI INTERAKTIF KESELAMATAN */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-8 rounded-3xl border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h3 className="font-fun text-xl font-bold text-indigo-950">
              Uji Minda Kilat: Pilih Kata Pemeri Keselamatan
            </h3>
          </div>
          <span className="text-xs text-indigo-700 font-bold bg-indigo-100 px-3 py-1 rounded-full">
            3 Soalan Pantas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Tahun 1 • Jalan Raya</span>
            <p className="text-xs font-semibold text-slate-800 my-2">
              "Lampu isyarat merah ________ tanda berhenti yang mesti dipatuhi."
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playSuccess();
                  setInteractiveQuizState({ ...interactiveQuizState, q1: 'correct' });
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  interactiveQuizState.q1 === 'correct' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 hover:bg-blue-50'
                }`}
              >
                ialah
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playHint();
                  setInteractiveQuizState({ ...interactiveQuizState, q1: 'wrong' });
                }}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-red-50 text-slate-600 cursor-pointer"
              >
                adalah
              </button>
            </div>
            {interactiveQuizState.q1 === 'correct' && (
              <p className="text-[11px] text-emerald-600 font-bold mt-2">✓ Tepat! Tanda berhenti = Frasa Nama.</p>
            )}
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Tahun 2 • Bilik Air</span>
            <p className="text-xs font-semibold text-slate-800 my-2">
              "Lantai bilik air yang basah ________ sangat licin dan berbahaya."
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playHint();
                  setInteractiveQuizState({ ...interactiveQuizState, q2: 'wrong' });
                }}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-red-50 text-slate-600 cursor-pointer"
              >
                ialah
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playSuccess();
                  setInteractiveQuizState({ ...interactiveQuizState, q2: 'correct' });
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  interactiveQuizState.q2 === 'correct' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 hover:bg-rose-50'
                }`}
              >
                adalah
              </button>
            </div>
            {interactiveQuizState.q2 === 'correct' && (
              <p className="text-[11px] text-emerald-600 font-bold mt-2">✓ Tepat! Sangat licin = Frasa Adjektif.</p>
            )}
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Tahun 3 • Keselamatan Elektrik</span>
            <p className="text-xs font-semibold text-slate-800 my-2">
              "Langkah keselamatan mengecas telefon ini ________ demi mengelakkan letupan."
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playHint();
                  setInteractiveQuizState({ ...interactiveQuizState, q3: 'wrong' });
                }}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-red-50 text-slate-600 cursor-pointer"
              >
                ialah
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playSuccess();
                  setInteractiveQuizState({ ...interactiveQuizState, q3: 'correct' });
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  interactiveQuizState.q3 === 'correct' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 hover:bg-rose-50'
                }`}
              >
                adalah
              </button>
            </div>
            {interactiveQuizState.q3 === 'correct' && (
              <p className="text-[11px] text-emerald-600 font-bold mt-2">✓ Tepat! Demi mengelakkan = Frasa Sendi Nama.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
