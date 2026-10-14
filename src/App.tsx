import React, { useState, useEffect } from 'react';
import { GoogleDoodleClassroom } from './components/GoogleDoodleClassroom';
import { RobotEva } from './components/RobotEva';
import { GrammarPracticeArena } from './components/GrammarPracticeArena';
import { HalamanPeneranganKataPemeri } from './components/HalamanPeneranganKataPemeri';
import { HalamanSenaraiSemakAktiviti } from './components/HalamanSenaraiSemakAktiviti';
import { AddStudentModal } from './components/AddStudentModal';
import { Student, TP_DESCRIPTIONS } from './types';
import { Volume2, VolumeX, Sparkles, BookOpen, ShieldCheck, UserPlus, Check, ClipboardCheck } from 'lucide-react';
import { soundManager } from './utils/soundEffects';

// Sample students for SK Tahun 1, 2, 3
const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Nur Aisyah Humaira',
    avatar: '👧',
    class: '3 Cemerlang',
    currentTP: 5,
    grammarStats: {
      ialahFrasaNama: 95,
      adalahFrasaAdjektif: 92,
      adalahFrasaSendiNama: 90,
      analisisKesalahan: 88,
      keseluruhanKataPemeri: 92,
    },
    totalQuestionsAnswered: 24,
    correctAnswers: 22,
    lastActive: 'Hari ini, 9:15 AM',
    notes: 'Sangat teliti membina ayat kata pemeri "ialah" dan "adalah" bertema keselamatan. Layak TP 5.',
  },
  {
    id: 's2',
    name: 'Muhammad Adam Haris',
    avatar: '👦',
    class: '3 Cemerlang',
    currentTP: 4,
    grammarStats: {
      ialahFrasaNama: 88,
      adalahFrasaAdjektif: 82,
      adalahFrasaSendiNama: 80,
      analisisKesalahan: 75,
      keseluruhanKataPemeri: 82,
    },
    totalQuestionsAnswered: 20,
    correctAnswers: 17,
    lastActive: 'Hari ini, 8:40 AM',
    notes: 'Kefahaman baik dalam frasa nama. Sedang mengukuhkan perbezaan dengan frasa sendi nama.',
  },
  {
    id: 's3',
    name: 'Danish Iskandar',
    avatar: '🧒',
    class: '3 Cemerlang',
    currentTP: 2,
    grammarStats: {
      ialahFrasaNama: 55,
      adalahFrasaAdjektif: 45,
      adalahFrasaSendiNama: 40,
      analisisKesalahan: 35,
      keseluruhanKataPemeri: 44,
    },
    totalQuestionsAnswered: 15,
    correctAnswers: 8,
    lastActive: 'Semalam',
    notes: 'Memerlukan bimbingan intervensi bagi mengelakkan penggunaan "ialah" di hadapan frasa adjektif.',
  },
  {
    id: 's4',
    name: 'Kavitha a/p Ramesh',
    avatar: '👧🏽',
    class: '3 Bestari',
    currentTP: 4,
    grammarStats: {
      ialahFrasaNama: 85,
      adalahFrasaAdjektif: 82,
      adalahFrasaSendiNama: 84,
      analisisKesalahan: 78,
      keseluruhanKataPemeri: 82,
    },
    totalQuestionsAnswered: 18,
    correctAnswers: 15,
    lastActive: 'Hari ini, 10:05 AM',
    notes: 'Menguasai formula kata pemeri bagi tema keselamatan jalan raya dan alatan elektrik.',
  },
  {
    id: 's5',
    name: 'Lee Wei Ming',
    avatar: '👦🏻',
    class: '3 Bestari',
    currentTP: 3,
    grammarStats: {
      ialahFrasaNama: 75,
      adalahFrasaAdjektif: 68,
      adalahFrasaSendiNama: 65,
      analisisKesalahan: 60,
      keseluruhanKataPemeri: 67,
    },
    totalQuestionsAnswered: 16,
    correctAnswers: 11,
    lastActive: 'Hari ini, 9:50 AM',
    notes: 'Boleh mengisi tempat kosong kata pemeri dengan betul dalam ayat tunggal keselamatan.',
  },
];

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bm_kssr_pemeri_students_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_STUDENTS;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>('s1');
  const [currentView, setCurrentView] = useState<'panduanKataPemeri' | 'studentArena' | 'senaraiSemak'>('panduanKataPemeri');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [showDskpGuide, setShowDskpGuide] = useState<boolean>(false);
  const [evaSkillFocus, setEvaSkillFocus] = useState<string>('kata_pemeri');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bm_kssr_pemeri_students_v2', JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  // Unique classes for modal dropdown
  const existingClasses = Array.from(new Set(students.map((s) => s.class)));

  // Add new student handler
  const handleAddNewStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    setCurrentStudentId(newStudent.id);
    showToast(`Murid baharu "${newStudent.name}" (${newStudent.class}) berjaya didaftarkan!`);
  };

  // Delete student handler
  const handleDeleteStudent = (studentId: string) => {
    const studentToDelete = students.find((s) => s.id === studentId);
    if (!studentToDelete) return;

    if (window.confirm(`Adakah anda pasti mahu memadam rekod "${studentToDelete.name}"?`)) {
      soundManager.playPop();
      const updated = students.filter((s) => s.id !== studentId);
      setStudents(updated);
      if (currentStudentId === studentId && updated.length > 0) {
        setCurrentStudentId(updated[0].id);
      }
      showToast(`Rekod murid "${studentToDelete.name}" telah dipadam.`);
    }
  };

  // Update student TP
  const handleUpdateStudentTP = (newTP: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === currentStudentId
          ? {
              ...s,
              currentTP: Math.max(s.currentTP, newTP),
              grammarStats: {
                ...s.grammarStats,
                keseluruhanKataPemeri: Math.min(100, (s.grammarStats?.keseluruhanKataPemeri || 70) + 6),
                ialahFrasaNama: Math.min(100, (s.grammarStats?.ialahFrasaNama || 75) + 5),
              },
            }
          : s
      )
    );
  };

  // Switch student
  const handleSelectStudent = (st: Student) => {
    soundManager.playPop();
    setCurrentStudentId(st.id);
  };

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundOn(newState);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <GoogleDoodleClassroom>
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Classroom Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center">
              <span className="text-2xl animate-bounce">👩‍🏫</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-fun text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  <span className="text-[#EA4335]">Cikgu</span>
                  <span className="text-[#4285F4]">Melati</span>
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                  Kelas Cikgu Adila
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Pakar Kata Pemeri "ialah" & "adalah" • Tema Keselamatan
              </p>
            </div>
          </div>

          {/* 3 Main Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setCurrentView('panduanKataPemeri');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-fun font-bold text-xs transition cursor-pointer ${
                currentView === 'panduanKataPemeri'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Panduan Keselamatan
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setCurrentView('studentArena');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-fun font-bold text-xs transition cursor-pointer ${
                currentView === 'studentArena'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎮</span>
              Latihan Interaktif
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setCurrentView('senaraiSemak');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-fun font-bold text-xs transition cursor-pointer ${
                currentView === 'senaraiSemak'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-yellow-300" />
              Senarai Semak & Evidens Bergambar
            </button>
          </div>

          {/* Student Selector, Add Student Button & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Student Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-2xl px-2.5 py-1 shadow-sm">
              <span className="text-base">{currentStudent.avatar}</span>
              <select
                aria-label="Pilih murid untuk sesi pembelajaran"
                value={currentStudent.id}
                onChange={(e) => {
                  const found = students.find((s) => s.id === e.target.value);
                  if (found) handleSelectStudent(found);
                }}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.class})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Add Student Button */}
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                setIsAddStudentOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs shadow-sm transition cursor-pointer"
              title="Tambah Nama Murid & Kelas Baharu"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Murid</span>
            </button>

            {/* DSKP Guide button */}
            <button
              type="button"
              onClick={() => setShowDskpGuide(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="DSKP 5.1.4 (vii) Kata Pemeri"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
            </button>

            {/* Sound toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title={soundOn ? 'Kesan Bunyi Aktif' : 'Kesan Bunyi Dimatikan'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24">
        {/* Prominent Welcome Banner: Selamat Datang ke Kelas Cikgu Adila */}
        <div className="max-w-5xl mx-auto px-4 pt-5 pb-1">
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-5 md:p-6 text-white shadow-lg border-2 border-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/40 flex-shrink-0">
                👩‍🏫
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white font-bold text-xs mb-1">
                  <span>✨</span> Bahasa Melayu KSSR SK
                </div>
                <h2 className="font-fun text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                  Selamat Datang ke Kelas Cikgu Adila
                </h2>
                <p className="text-xs md:text-sm text-amber-50 mt-1 font-medium">
                  Bilik Pembelajaran Interaktif Kata Pemeri ("ialah" & "adalah") bersama <strong className="text-white underline">Cikgu Melati</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-xs font-bold whitespace-nowrap">
              <span>👩‍🏫</span>
              <span>Dibimbing oleh Cikgu Melati</span>
            </div>
          </div>
        </div>

        {currentView === 'panduanKataPemeri' ? (
          /* Halaman Khas: Penerangan Teliti Kata Pemeri Bertema Keselamatan */
          <HalamanPeneranganKataPemeri
            onStartPractice={() => {
              soundManager.playPop();
              setCurrentView('studentArena');
            }}
            onAskEva={(q) => {
              setEvaSkillFocus('kata_pemeri');
            }}
          />
        ) : currentView === 'studentArena' ? (
          /* Bilik Latihan Interaktif Kata Pemeri */
          <div>
            {/* Student Session Card */}
            <div className="max-w-5xl mx-auto px-4 pt-3 pb-2">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-blue-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner">
                    {currentStudent.avatar}
                  </div>
                  <div>
                    <h3 className="font-fun text-lg md:text-xl font-bold text-slate-900">
                      Sesi Latihan: {currentStudent.name}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Kelas Cikgu Adila: <strong className="text-slate-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">{currentStudent.class}</strong> • Bimbingan: <strong className="text-rose-600">Cikgu Melati</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">Tahap Penguasaan PBD</span>
                    <span className="text-sm font-extrabold text-blue-600 font-fun">
                      {TP_DESCRIPTIONS[currentStudent.currentTP]?.badge || `TP ${currentStudent.currentTP}`}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center font-fun font-bold text-base shadow">
                    TP{currentStudent.currentTP}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Grammar Arena (strictly Kata Pemeri) */}
            <GrammarPracticeArena
              currentStudent={currentStudent}
              onUpdateTP={handleUpdateStudentTP}
              onAskEvaAboutTopic={(topic, q) => {
                setEvaSkillFocus(topic);
              }}
            />
          </div>
        ) : (
          /* Halaman Senarai Semak Penglibatan Murid & Ruang Muat Naik Evidens Bergambar */
          <HalamanSenaraiSemakAktiviti students={students} />
        )}
      </main>

      {/* Floating 3D Robot EVE Chatbot (Pakar Khas Kata Pemeri!) */}
      <RobotEva
        currentStudent={currentStudent}
        onUpdateTP={handleUpdateStudentTP}
        skillFocus="kata_pemeri"
      />

      {/* Modal: Tambah Murid & Kelas Baharu */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddNewStudent}
        existingClasses={existingClasses}
      />

      {/* DSKP Standard Reference Modal: 5.1.4 (vii) Kata Pemeri */}
      {showDskpGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border-4 border-blue-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <h3 className="font-fun text-xl font-bold text-slate-900">
                  DSKP KSSR Bahasa Melayu SK (5.1.4 vii: Kata Pemeri)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDskpGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs md:text-sm text-slate-700">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-1">
                  Standard Kandungan 5.1:
                </h4>
                <p className="text-blue-950">
                  Memahami fungsi dan menggunakan golongan kata mengikut konteks.
                </p>
                <h4 className="font-bold text-blue-900 mt-2 mb-1">
                  Standard Pembelajaran 5.1.4 (vii):
                </h4>
                <p className="text-blue-900 font-semibold">
                  Memahami dan menggunakan <strong>kata pemeri</strong> mengikut konteks secara gramatis.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">
                  Formula Kata Pemeri (Buku Teks m/s 57):
                </h4>
                <p className="text-amber-950">
                  • <strong>"ialah"</strong> hadir di hadapan <u>Frasa Nama</u>.
                  <br />
                  • <strong>"adalah"</strong> hadir di hadapan <u>Frasa Adjektif</u> dan <u>Frasa Sendi Nama</u>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">
                  Aplikasi Tema Keselamatan:
                </h4>
                <p className="text-emerald-950">
                  • <strong>Tahun 1:</strong> Keselamatan jalan raya & taman permainan (Lampu isyarat, melintas jalan).
                  <br />
                  • <strong>Tahun 2:</strong> Keselamatan di rumah & sekolah (Lantai licin, jaket keselamatan bot, peti ubat).
                  <br />
                  • <strong>Tahun 3:</strong> Keselamatan peralatan elektrik & kebakaran (Buku Teks m/s 57: Pengecas telefon tiruan, bateri tiruan).
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowDskpGuide(false)}
                className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-fun font-bold text-sm shadow transition cursor-pointer"
              >
                Faham & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </GoogleDoodleClassroom>
  );
}
