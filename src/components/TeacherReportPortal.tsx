import React, { useState } from 'react';
import { FileText, Printer, Sparkles, Users, Award, TrendingUp, CheckCircle, AlertTriangle, ArrowRight, RefreshCw, UserPlus, Trash2, Filter } from 'lucide-react';
import { Student, WeeklyReportData, TP_DESCRIPTIONS } from '../types';
import { soundManager } from '../utils/soundEffects';

interface TeacherReportPortalProps {
  students: Student[];
  currentStudent: Student;
  onSelectStudent: (student: Student) => void;
  onOpenAddStudent: () => void;
  onDeleteStudent: (studentId: string) => void;
  className?: string;
}

export const TeacherReportPortal: React.FC<TeacherReportPortalProps> = ({
  students,
  currentStudent,
  onSelectStudent,
  onOpenAddStudent,
  onDeleteStudent,
  className = '3 Cemerlang',
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua');
  const [weekNumber, setWeekNumber] = useState('Minggu 8');
  const [schoolName, setSchoolName] = useState('Sekolah Kebangsaan Seri Melati');
  const [teacherName, setTeacherName] = useState('Cikgu Adila');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'printableReport' | 'studentList'>('analytics');

  // Extract unique classes from students
  const classList = Array.from(new Set(students.map((s) => s.class)));

  // Filter students based on selected class
  const filteredStudents = selectedClassFilter === 'Semua'
    ? students
    : students.filter((s) => s.class === selectedClassFilter);

  const activeClassName = selectedClassFilter === 'Semua' ? 'Keseluruhan Tahun 3' : selectedClassFilter;

  const [weeklyReport, setWeeklyReport] = useState<WeeklyReportData>({
    className: activeClassName,
    weekNumber: 'Minggu 8',
    dateGenerated: new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }),
    teacherName: 'Cikgu Adila',
    schoolName: 'Sekolah Kebangsaan Seri Melati',
    overallSummary:
      'Prestasi murid bagi Kelas Cikgu Adila pada minggu ini menunjukkan perkembangan yang sangat memberangsangkan. Sebanyak 88% murid telah menguasai kemahiran asas 5.1.4 (Kata Pemeri: ialah dan adalah) mengikut modul Buku Teks m/s 57 "Beringat Sebelum Kena" dan tema keselamatan. Bimbingan berdedikasi Cikgu Melati telah berjaya merangsang murid membina ayat gramatis secara spontan.',
    tpDistribution: {
      1: 0,
      2: 1,
      3: 3,
      4: 4,
      5: 2,
      6: 1,
    },
    topPerformers: [
      { name: 'Nur Aisyah Humaira', tp: 6, note: 'Menguasai pembinaan ayat majmuk keselamatan dengan kata pemeri yang jitu.' },
      { name: 'Muhammad Adam Haris', tp: 5, note: 'Sangat tekal dalam membezakan frasa nama dan frasa sendi nama.' },
    ],
    interventionStudents: [
      { name: 'Danish Iskandar', tp: 2, note: 'Masih keliru meletakkan perkataan "ialah" di hadapan frasa adjektif.' },
    ],
    recommendedActivities: [
      'Aktiviti "Detektif Kata Pemeri Keselamatan" menggunakan petikan Buku Teks m/s 57 bersama bimbingan Cikgu Melati.',
      'Stesen Kad Imbasan Keselamatan Jalan Raya secara berpasangan.',
      'Permainan Roda Kata Pemeri (ialah vs adalah) untuk mengukuhkan penguasaan frasa nama dan adjektif.',
    ],
    teacherComment:
      'Objektif DSKP 5.1.4 (vii) Kata Pemeri tercapai. Murid yang berada pada TP 1-2 akan dimasukkan ke dalam Program Intervensi Bimbingan Berfokus (PIBB) bersama Cikgu Adila.',
  });

  // Calculate live TP distribution for filtered students
  const currentTPCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  filteredStudents.forEach((s) => {
    currentTPCounts[s.currentTP] = (currentTPCounts[s.currentTP] || 0) + 1;
  });

  // Call API to generate fresh weekly report using Gemini 3.8 Flash
  const handleGenerateWeeklyReport = async () => {
    setIsGenerating(true);
    soundManager.playPop();

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: filteredStudents,
          className: activeClassName,
          weekNumber,
        }),
      });

      const data = await res.json();
      setIsGenerating(false);

      if (data.report) {
        soundManager.playLevelUp();
        setWeeklyReport({
          ...weeklyReport,
          className: activeClassName,
          overallSummary: data.report.overallSummary || weeklyReport.overallSummary,
          topPerformers: data.report.topPerformers || weeklyReport.topPerformers,
          interventionStudents: data.report.interventionStudents || weeklyReport.interventionStudents,
          recommendedActivities: data.report.recommendedActivities || weeklyReport.recommendedActivities,
          teacherComment: data.report.teacherComment || weeklyReport.teacherComment,
          dateGenerated: new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' }),
        });
      }
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold mb-2 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Portal Guru Bahasa Melayu SK • Penjanaan Automatik PBD
            </div>
            <h1 className="font-fun text-2xl md:text-3xl font-bold tracking-tight">
              Laporan Prestasi Mingguan Kata Pemeri
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Rujukan Pentaksiran Bilik Darjah (PBD) Murid • Bimbingan Cikgu Melati
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Add Student Button */}
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-sm shadow-md transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              + Tambah Murid & Kelas
            </button>

            <button
              type="button"
              onClick={handleGenerateWeeklyReport}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-fun font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Menjana Rumusan AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Jana Laporan Mingguan Baharu
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-fun font-bold text-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak / PDF
            </button>
          </div>
        </div>

        {/* Sub Navigation & Class Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-700/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('analytics')}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSubTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Analisis & Rumusan PBD
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('studentList')}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSubTab === 'studentList' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Senarai Rekod Murid ({filteredStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('printableReport')}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                activeSubTab === 'printableReport' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              Format Borang Rasmi KPM
            </button>
          </div>

          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 font-medium">Tapis Kelas:</span>
            <select
              aria-label="Tapis kelas murid"
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="Semua" className="bg-slate-900 text-white">Semua Kelas ({students.length})</option>
              {classList.map((cls) => (
                <option key={cls} value={cls} className="bg-slate-900 text-white">
                  Kelas {cls} ({students.filter((s) => s.class === cls).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: Analytics & Summary */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Jumlah Murid</span>
              <p className="font-fun text-2xl font-bold text-slate-800 mt-1">{filteredStudents.length} Orang</p>
              <span className="text-[11px] text-emerald-600 font-semibold">{selectedClassFilter === 'Semua' ? 'Semua Kelas' : `Kelas ${selectedClassFilter}`}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Purata Tahap TP</span>
              <p className="font-fun text-2xl font-bold text-blue-600 mt-1">
                TP {(filteredStudents.reduce((acc, s) => acc + s.currentTP, 0) / (filteredStudents.length || 1)).toFixed(1)}
              </p>
              <span className="text-[11px] text-blue-500 font-semibold">Tahap Penguasaan Baik</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Fokus Utama Minggu Ini</span>
              <p className="font-fun text-lg font-bold text-amber-600 mt-1 truncate">Kata Pemeri (ms 57)</p>
              <span className="text-[11px] text-slate-500 font-semibold">ialah vs adalah</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Murid Aktif Semasa</span>
              <p className="font-fun text-lg font-bold text-emerald-700 mt-1 truncate">
                {currentStudent.name}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">{currentStudent.class} • TP {currentStudent.currentTP}</span>
            </div>
          </div>

          {/* TP 1 - TP 6 Distribution Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200">
            <h3 className="font-fun text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Taburan Tahap Penguasaan (TP 1 hingga TP 6) • {selectedClassFilter === 'Semua' ? 'Semua Murid' : `Kelas ${selectedClassFilter}`}
            </h3>

            <div className="grid grid-cols-6 gap-2 md:gap-3 text-center">
              {[1, 2, 3, 4, 5, 6].map((tp) => {
                const count = currentTPCounts[tp] || 0;
                const percentage = filteredStudents.length > 0 ? Math.round((count / filteredStudents.length) * 100) : 0;
                const info = TP_DESCRIPTIONS[tp];

                return (
                  <div key={tp} className="flex flex-col items-center">
                    <div className="w-full h-36 bg-slate-100 rounded-2xl flex flex-col justify-end p-1.5 relative overflow-hidden">
                      <div
                        className={`w-full rounded-xl bg-gradient-to-t ${info.color} transition-all duration-500`}
                        style={{ height: `${Math.max(percentage, 10)}%` }}
                      ></div>
                      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-extrabold text-slate-700">
                        {count}
                      </span>
                    </div>

                    <span className="font-fun font-bold text-xs mt-2 text-slate-800">TP {tp}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Weekly Narrative Summary Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 p-6 rounded-3xl border-2 border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👩‍🏫</span>
              <h3 className="font-fun text-lg font-bold text-rose-950">
                Rumusan Analisis Mingguan oleh Cikgu Melati ({weeklyReport.weekNumber})
              </h3>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed mb-4">
              {weeklyReport.overallSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-200">
              {/* Top Performers */}
              <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Murid Berprestasi Cemerlang (TP 5 - 6)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {weeklyReport.topPerformers.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-emerald-700">• {p.name} (TP {p.tp}):</span>
                      <span>{p.note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Intervention Needed */}
              <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-amber-200">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Murid Perlu Bimbingan Intervensi (TP 1 - 2)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {weeklyReport.interventionStudents.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-amber-700">• {p.name} (TP {p.tp}):</span>
                      <span>{p.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended High-Impact Interventions */}
            <div className="mt-4 p-4 bg-white rounded-2xl border border-indigo-200">
              <span className="text-xs font-bold text-indigo-900 block mb-2">
                Cadangan Aktiviti Intervensi & Pengayaan Berimpak Tinggi (KSSR SK Tahun 3):
              </span>
              <div className="space-y-1.5 text-xs text-slate-700">
                {weeklyReport.recommendedActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher official RPH comment */}
            <div className="mt-3 text-xs text-slate-600 italic">
              <strong>Ulasan Guru Kelas / Pentaksir:</strong> "{weeklyReport.teacherComment}"
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Student Roster List with Add Student action */}
      {activeSubTab === 'studentList' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-fun text-lg font-bold text-slate-900">
                Senarai Rekod Murid ({filteredStudents.length} Orang)
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Klik nama murid untuk mulakan sesi latihan peribadi mereka
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-fun font-bold text-xs shadow transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              + Tambah Nama Murid & Kelas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Nama Murid</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3 text-center">Tahap TP</th>
                  <th className="p-3 text-center">"ialah" + Frasa Nama</th>
                  <th className="p-3 text-center">"adalah" + Adjektif</th>
                  <th className="p-3 text-center">"adalah" + Sendi Nama</th>
                  <th className="p-3 text-center">Analisis Kesalahan</th>
                  <th className="p-3 rounded-r-xl text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className={`hover:bg-blue-50/60 transition cursor-pointer ${
                      currentStudent.id === st.id ? 'bg-blue-50 font-semibold' : ''
                    }`}
                    onClick={() => onSelectStudent(st)}
                  >
                    <td className="p-3 flex items-center gap-2.5">
                      <span className="text-xl">{st.avatar}</span>
                      <div>
                        <p className="text-slate-900">{st.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{st.notes}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        {st.class}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          st.currentTP >= 5
                            ? 'bg-purple-100 text-purple-800'
                            : st.currentTP >= 3
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        TP {st.currentTP}
                      </span>
                    </td>
                    <td className="p-3 text-center font-semibold text-blue-700">
                      {st.grammarStats?.ialahFrasaNama || 85}%
                    </td>
                    <td className="p-3 text-center font-semibold text-rose-700">
                      {st.grammarStats?.adalahFrasaAdjektif || 80}%
                    </td>
                    <td className="p-3 text-center font-semibold text-purple-700">
                      {st.grammarStats?.adalahFrasaSendiNama || 78}%
                    </td>
                    <td className="p-3 text-center font-semibold text-amber-700">
                      {st.grammarStats?.analisisKesalahan || 75}%
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onSelectStudent(st)}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                        >
                          Pilih
                        </button>
                        {students.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onDeleteStudent(st.id)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Padam Murid"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Formatted Printable KPM PBD Assessment Sheet */}
      {activeSubTab === 'printableReport' && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-300 print:shadow-none print:border-none">
          {/* Printable School Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
            <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              KEMENTERIAN PENDIDIKAN MALAYSIA
            </h2>
            <h3 className="text-lg font-bold text-slate-800">{schoolName}</h3>
            <p className="text-xs text-slate-600 uppercase font-semibold mt-1">
              PELAPORAN PENTAKSIRAN BILIK DARJAH (PBD) MINGGUAN • BAHASA MELAYU SK TAHUN 3
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-800 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-bold block">KELAS:</span>
              <span className="font-bold">{activeClassName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">GURU KELAS / MATAPELAJARAN:</span>
              <span className="font-bold">{teacherName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">MINGGU PERSEKOLAHAN:</span>
              <span className="font-bold">{weeklyReport.weekNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">TARIKH JANAAN:</span>
              <span className="font-bold">{weeklyReport.dateGenerated}</span>
            </div>
          </div>

          {/* DSKP Focus Notice */}
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
            <strong>Standard Kandungan:</strong> 5.1 Memahami fungsi dan menggunakan golongan kata mengikut konteks.
            <br />
            <strong>Standard Pembelajaran:</strong> 5.1.1 Kata Nama Am/Khas & Penjodoh Bilangan, 5.1.4 (vii) Kata Pemeri ("ialah" dan "adalah" - Buku Teks m/s 57).
          </div>

          {/* Student Roster Table for PBD Record */}
          <table className="w-full text-xs border-collapse border border-slate-400 mb-6">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold">
                <th className="border border-slate-400 p-2 text-center w-8">BIL</th>
                <th className="border border-slate-400 p-2 text-left">NAMA MURID</th>
                <th className="border border-slate-400 p-2 text-center w-24">KELAS</th>
                <th className="border border-slate-400 p-2 text-center w-20">TAHAP PENGUASAAN (TP)</th>
                <th className="border border-slate-400 p-2 text-left">DESKRIPSI TAHAP PENGUASAAN</th>
                <th className="border border-slate-400 p-2 text-left">CATATAN PENTAKSIR</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st, index) => (
                <tr key={st.id} className="border border-slate-300">
                  <td className="border border-slate-300 p-2 text-center font-bold">{index + 1}</td>
                  <td className="border border-slate-300 p-2 font-bold">{st.name}</td>
                  <td className="border border-slate-300 p-2 text-center font-semibold">{st.class}</td>
                  <td className="border border-slate-300 p-2 text-center font-bold">TP {st.currentTP}</td>
                  <td className="border border-slate-300 p-2 text-slate-700">
                    {TP_DESCRIPTIONS[st.currentTP]?.desc}
                  </td>
                  <td className="border border-slate-300 p-2 text-slate-600">{st.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Official Signatures Row */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-xs text-slate-800">
            <div>
              <p className="font-bold mb-12">Disediakan oleh:</p>
              <div className="border-b border-slate-400 w-48 mb-1"></div>
              <p className="font-bold">({teacherName})</p>
              <p className="text-slate-500">Guru Bahasa Melayu Tahun 3</p>
            </div>
            <div>
              <p className="font-bold mb-12">Disahkan oleh:</p>
              <div className="border-b border-slate-400 w-48 mb-1"></div>
              <p className="font-bold">(Guru Besar / Penolong Kanan Pentadbiran)</p>
              <p className="text-slate-500">{schoolName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
