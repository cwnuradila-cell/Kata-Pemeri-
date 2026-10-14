import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertCircle, Award, ArrowRight, RotateCcw, Lightbulb, Sparkles, ShieldCheck, Zap, Car, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { ttsManager } from '../utils/textToSpeech';
import { Student, TP_DESCRIPTIONS } from '../types';

interface GrammarPracticeArenaProps {
  currentStudent: Student;
  onUpdateTP: (newTP: number) => void;
  onAskEvaAboutTopic: (topicTitle: string, questionText: string) => void;
}

export const GrammarPracticeArena: React.FC<GrammarPracticeArenaProps> = ({
  currentStudent,
  onUpdateTP,
  onAskEvaAboutTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'bukuTeksKataPemeri' | 'cabaranTahun12' | 'klinikKesalahan' | 'ujianPBD'>('bukuTeksKataPemeri');

  // Challenge 1: Buku Teks m/s 57 "Beringat Sebelum Kena" (Kata Pemeri: ialah vs adalah)
  const [pemeriAnswers, setPemeriAnswers] = useState<{ [key: string]: string }>({});
  const [pemeriSubmitted, setPemeriSubmitted] = useState(false);

  // Challenge 2: Cabaran Kata Pemeri Tahun 1 & 2 (Keselamatan Jalan Raya & Rumah)
  const safetyQuestionsTahun12 = [
    {
      id: 's1',
      context: 'Tahun 1 • Keselamatan Jalan Raya',
      sentence: 'Lampu isyarat merah ________ tanda berhenti bagi semua kenderaan di jalan raya.',
      afterType: 'Frasa Nama [tanda berhenti]',
      options: ['ialah', 'adalah'],
      correct: 'ialah',
      explanation: 'Gunakan "ialah" kerana hadir di hadapan frasa nama "tanda berhenti".',
    },
    {
      id: 's2',
      context: 'Tahun 1 • Keselamatan Pejalan Kaki',
      sentence: 'Melintas jalan tanpa menggunakan jejantas ________ sangat berbahaya kepada kanak-kanak.',
      afterType: 'Frasa Adjektif [sangat berbahaya]',
      options: ['ialah', 'adalah'],
      correct: 'adalah',
      explanation: 'Gunakan "adalah" kerana hadir di hadapan frasa adjektif "sangat berbahaya".',
    },
    {
      id: 's3',
      context: 'Tahun 2 • Keselamatan di Bilik Air / Dapur',
      sentence: 'Lantai bilik air yang dipenuhi buih sabun ________ sangat licin dan boleh menyebabkan tergelincir.',
      afterType: 'Frasa Adjektif [sangat licin]',
      options: ['ialah', 'adalah'],
      correct: 'adalah',
      explanation: 'Gunakan "adalah" kerana hadir di hadapan kata adjektif keadaan "sangat licin".',
    },
    {
      id: 's4',
      context: 'Tahun 2 • Keselamatan di Air / Bot',
      sentence: 'Jaket keselamatan berwana jingga itu ________ untuk adik semasa menaiki bot penambang.',
      afterType: 'Frasa Sendi Nama [untuk adik]',
      options: ['ialah', 'adalah'],
      correct: 'adalah',
      explanation: 'Gunakan "adalah" kerana hadir di hadapan frasa sendi nama "untuk adik".',
    },
    {
      id: 's5',
      context: 'Tahun 2 • Keselamatan Bilik Darjah',
      sentence: 'Peti pertolongan cemas yang digantung di dinding kelas ________ peti simpanan ubat luka.',
      afterType: 'Frasa Nama [peti simpanan ubat]',
      options: ['ialah', 'adalah'],
      correct: 'ialah',
      explanation: 'Gunakan "ialah" kerana hadir di hadapan frasa nama "peti simpanan ubat".',
    },
  ];
  const [safetyAnswers, setSafetyAnswers] = useState<{ [key: string]: string }>({});

  // Challenge 3: Detektif Kesalahan Kata Pemeri (Betulkan Ayat)
  const mistakeCorrectionTasks = [
    {
      id: 'm1',
      wrongSentence: 'Pengecas tiruan itu ialah sangat berbahaya kepada keselamatan keluarga.',
      wordWrong: 'ialah',
      correctWord: 'adalah',
      options: ['adalah', 'ialah'],
      explanation: '"Sangat berbahaya" ialah frasa adjektif. Oleh itu, kata pemeri yang betul ialah "adalah".',
    },
    {
      id: 'm2',
      wrongSentence: 'Punca utama kebakaran rumah itu adalah litar pintas di bahagian dapur.',
      wordWrong: 'adalah',
      correctWord: 'ialah',
      options: ['ialah', 'adalah'],
      explanation: '"Litar pintas" ialah frasa nama. Kata pemeri yang betul ialah "ialah".',
    },
    {
      id: 'm3',
      wrongSentence: 'Langkah pencegahan kebakaran ini ialah untuk warga sekolah.',
      wordWrong: 'ialah',
      correctWord: 'adalah',
      options: ['adalah', 'ialah'],
      explanation: '"Untuk warga sekolah" ialah frasa sendi nama. Kata pemeri yang betul ialah "adalah".',
    },
  ];
  const [mistakeSelections, setMistakeSelections] = useState<{ [key: string]: string }>({});

  // Challenge 4: Ujian Diagnostik Penentuan TP 1 hingga 6 Khusus KATA PEMERI
  const [diagnosticCurrentIndex, setDiagnosticCurrentIndex] = useState(0);
  const [diagnosticScore, setDiagnosticScore] = useState(0);
  const [diagnosticFinished, setDiagnosticFinished] = useState(false);
  const [selectedDiagnosticOption, setSelectedDiagnosticOption] = useState<string | null>(null);

  const diagnosticQuestionsKataPemeri = [
    {
      tpLevel: 1,
      question: 'Apakah dua perkataan yang tergolong dalam "Kata Pemeri" Bahasa Melayu?',
      options: ['ialah dan adalah', 'dan dan atau', 'sambil dan kerana', 'di dan ke'],
      correct: 'ialah dan adalah',
      hint: 'Kata pemeri bertindak sebagai penghubung subjek dengan frasa nama, adjektif, atau sendi nama.',
    },
    {
      tpLevel: 2,
      question: 'Kata pemeri "ialah" WAJIB hadir di hadapan frasa apakah?',
      options: ['Frasa Nama', 'Frasa Adjektif', 'Frasa Sendi Nama', 'Kata Kerja Pasif'],
      correct: 'Frasa Nama',
      hint: 'Contoh: Beliau ialah seorang anggota bomba.',
    },
    {
      tpLevel: 3,
      question: 'Lengkapkan ayat keselamatan Tahun 1: "Topi keledar itu ________ untuk adik saya."',
      options: ['adalah', 'ialah'],
      correct: 'adalah',
      hint: '"Untuk adik" ialah Frasa Sendi Nama.',
    },
    {
      tpLevel: 4,
      question: 'Lengkapkan ayat keselamatan Tahun 2: "Tindakan menyentuh wayar elektrik yang terdedah ________ sangat berbahaya."',
      options: ['adalah', 'ialah'],
      correct: 'adalah',
      hint: '"Sangat berbahaya" ialah Frasa Adjektif keadaan.',
    },
    {
      tpLevel: 5,
      question: 'Pilih ayat majmuk keselamatan Tahun 3 yang menggunakan Kata Pemeri dengan paling jitu:',
      options: [
        'Punca kebakaran kilang itu ialah litar pintas dan keadaannya adalah sangat membimbangkan.',
        'Punca kebakaran kilang itu adalah litar pintas dan keadaannya ialah sangat membimbangkan.',
        'Punca kebakaran kilang itu ialah sangat bahaya dan keadaannya adalah litar pintas.',
        'Punca kebakaran kilang itu adalah seorang anggota bomba dan keadaannya ialah untuk murid.',
      ],
      correct: 'Punca kebakaran kilang itu ialah litar pintas dan keadaannya adalah sangat membimbangkan.',
      hint: '"Litar pintas" (Frasa Nama -> ialah); "Sangat membimbangkan" (Frasa Adjektif -> adalah).',
    },
    {
      tpLevel: 6,
      question: 'Analisis dan betulkan kesalahan ayat: "Tujuan taklimat keselamatan kebakaran ini ialah demi menyelamatkan nyawa murid." Apakah pembetulan paling tepat?',
      options: [
        'Tukarkan "ialah" kepada "adalah" kerana hadir di hadapan frasa sendi nama "demi".',
        'Tukarkan "demi" kepada "untuk" dan kekalkan "ialah".',
        'Gugurkan perkataan "kebakaran" dan kekalkan "ialah".',
        'Ayat tersebut sudah sempurna dan tiada kesalahan tatabahasa.',
      ],
      correct: 'Tukarkan "ialah" kepada "adalah" kerana hadir di hadapan frasa sendi nama "demi".',
      hint: 'Tahap 6: Berupaya menganalisis hukum frasa sendi nama dan memperbetulkan kata pemeri dengan jitu.',
    },
  ];

  // Submit Kata Pemeri Buku Teks
  const handleCheckKataPemeri = () => {
    soundManager.playPop();
    setPemeriSubmitted(true);
    const correctCount =
      (pemeriAnswers['q1'] === 'ialah' ? 1 : 0) +
      (pemeriAnswers['q2'] === 'ialah' ? 1 : 0) +
      (pemeriAnswers['q3'] === 'adalah' ? 1 : 0);

    if (correctCount === 3) {
      soundManager.playLevelUp();
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      if (currentStudent.currentTP < 4) {
        onUpdateTP(4);
      }
      ttsManager.speak('Syabas! Semua jawapan Kata Pemeri keselamatan kamu betul! Cikgu Melati sangat bangga dengan usaha kamu!');
    } else {
      soundManager.playHint();
      ttsManager.speak('Bagus usahanya! Ingat: ialah untuk frasa nama, adalah untuk frasa adjektif atau sendi nama!');
    }
  };

  // Diagnostic handler
  const handleAnswerDiagnostic = (opt: string) => {
    setSelectedDiagnosticOption(opt);
    const q = diagnosticQuestionsKataPemeri[diagnosticCurrentIndex];
    const isCorrect = opt === q.correct;

    if (isCorrect) {
      soundManager.playSuccess();
      setDiagnosticScore((prev) => prev + 1);
    } else {
      soundManager.playHint();
    }

    setTimeout(() => {
      setSelectedDiagnosticOption(null);
      if (diagnosticCurrentIndex < diagnosticQuestionsKataPemeri.length - 1) {
        setDiagnosticCurrentIndex((prev) => prev + 1);
      } else {
        // Finished
        const finalScore = isCorrect ? diagnosticScore + 1 : diagnosticScore;
        const awardedTP = Math.max(1, Math.min(6, finalScore));
        setDiagnosticFinished(true);
        soundManager.playLevelUp();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        onUpdateTP(awardedTP);
        ttsManager.speak(`Tahniah ${currentStudent.name}! Berdasarkan ujian diagnostik PBD Kata Pemeri, kamu telah berjaya mencapai Tahap Penguasaan TP ${awardedTP}!`);
      }
    }, 900);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Navigation tabs strictly for Kata Pemeri */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            setActiveTab('bukuTeksKataPemeri');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-fun font-bold text-sm transition shadow-sm cursor-pointer ${
            activeTab === 'bukuTeksKataPemeri'
              ? 'bg-[#4285F4] text-white shadow-blue-300 shadow-md scale-105'
              : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          Buku Teks m/s 57: Pengecas & Elektrik
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            setActiveTab('cabaranTahun12');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-fun font-bold text-sm transition shadow-sm cursor-pointer ${
            activeTab === 'cabaranTahun12'
              ? 'bg-[#34A853] text-white shadow-green-300 shadow-md scale-105'
              : 'bg-white hover:bg-green-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Car className="w-4 h-4 text-yellow-300" />
          Cabaran Keselamatan Tahun 1 & 2
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            setActiveTab('klinikKesalahan');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-fun font-bold text-sm transition shadow-sm cursor-pointer ${
            activeTab === 'klinikKesalahan'
              ? 'bg-[#FBBC05] text-slate-900 shadow-amber-300 shadow-md scale-105'
              : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-blue-700" />
          Detektif Betulkan Kesalahan
        </button>

        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            setActiveTab('ujianPBD');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-fun font-bold text-sm transition shadow-sm cursor-pointer ${
            activeTab === 'ujianPBD'
              ? 'bg-[#EA4335] text-white shadow-red-300 shadow-md scale-105'
              : 'bg-white hover:bg-red-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-yellow-300" />
          Ujian PBD Kata Pemeri (TP 1 - 6)
        </button>
      </div>

      {/* TAB 1: Buku Teks m/s 57 "Beringat Sebelum Kena" */}
      {activeTab === 'bukuTeksKataPemeri' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border-4 border-blue-200/80">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
                <span>📖</span> KSSR Bahasa Melayu SK Tahun 3 • Muka Surat 57
              </div>
              <h2 className="font-fun text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                Kata Pemeri: <span className="text-blue-600">Beringat Sebelum Kena</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onAskEvaAboutTopic('Kata Pemeri Buku Teks', 'Cikgu Melati, terangkan petikan Buku Teks m/s 57 Beringat Sebelum Kena dan mengapa jawapan ialah dan adalah dipilih?')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 text-white text-xs font-bold shadow hover:shadow-md transition cursor-pointer"
            >
              <span>👩‍🏫</span> Bimbingan Cikgu Melati
            </button>
          </div>

          {/* Golden Rule Formula Box with 3 Phrase Pills */}
          <div className="my-5 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300/80 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
              💡
            </div>
            <div className="flex-1 text-xs md:text-sm text-slate-800 leading-relaxed">
              <span className="font-bold text-amber-900 block text-sm md:text-base font-fun mb-1">
                Info Bahasa (Buku Teks m/s 57) • 3 Frasa Utama:
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded-xl bg-blue-100 text-blue-900 font-bold border border-blue-300 text-xs">
                  📘 Frasa Nama ➔ <strong className="text-blue-700">ialah</strong>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 font-bold border border-purple-300 text-xs">
                  📗 Frasa Sendi Nama ➔ <strong className="text-purple-700">adalah</strong>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-900 font-bold border border-rose-300 text-xs">
                  📙 Frasa Adjektif ➔ <strong className="text-rose-700">adalah</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Passage Exercise */}
          <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-200 text-slate-800 leading-loose text-base md:text-lg">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Petikan Berita Keselamatan Elektrik:
            </div>
            <p className="mb-4">
              <strong>JOHOR BAHRU, 6 Mac</strong> — Kecederaan ketika menggunakan telefon bimbit yang sedang dicas berlaku lagi. Mangsa terbaharu <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">ialah</span> seorang suri rumah. Mangsa dihantar ke hospital berdekatan untuk mendapatkan rawatan.
            </p>
            <p className="mb-4">
              Menurut pegawai bomba, peralatan berisiko yang menyebabkan kemalangan{' '}
              <select
                aria-label="Pilih kata pemeri untuk soalan 1"
                value={pemeriAnswers['q1'] || ''}
                onChange={(e) => setPemeriAnswers({ ...pemeriAnswers, q1: e.target.value })}
                className={`mx-1.5 px-3 py-1 rounded-xl font-bold border-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer ${
                  pemeriSubmitted
                    ? pemeriAnswers['q1'] === 'ialah'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : 'bg-red-100 border-red-500 text-red-900'
                    : 'bg-white border-blue-400 text-slate-800'
                }`}
              >
                <option value="">(Pilih)</option>
                <option value="ialah">ialah</option>
                <option value="adalah">adalah</option>
              </select>{' '}
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-sm font-semibold">
                pengecas tiruan dan bateri tiruan [Frasa Nama]
              </span>
              . Penggunaan pengecas yang telah diubah suai juga <span className="bg-red-100 text-red-900 px-2 py-0.5 rounded font-bold">adalah</span> <span className="text-emerald-700 font-semibold">sangat berbahaya [Frasa Adjektif]</span>.
            </p>
            <p>
              Pegawai bomba juga menasihati pengguna agar mematuhi dua langkah keselamatan. Langkah pertama{' '}
              <select
                aria-label="Pilih kata pemeri untuk soalan 2"
                value={pemeriAnswers['q2'] || ''}
                onChange={(e) => setPemeriAnswers({ ...pemeriAnswers, q2: e.target.value })}
                className={`mx-1.5 px-3 py-1 rounded-xl font-bold border-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer ${
                  pemeriSubmitted
                    ? pemeriAnswers['q2'] === 'ialah'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : 'bg-red-100 border-red-500 text-red-900'
                    : 'bg-white border-blue-400 text-slate-800'
                }`}
              >
                <option value="">(Pilih)</option>
                <option value="ialah">ialah</option>
                <option value="adalah">adalah</option>
              </select>{' '}
              pengguna perlu merujuk manual sebelum mengecas. Langkah kedua pula <span className="bg-red-100 text-red-900 px-2 py-0.5 rounded font-bold">adalah</span> dari segi penggunaannya. Pastikan satu soket untuk satu pengecas. Langkah tersebut{' '}
              <select
                aria-label="Pilih kata pemeri untuk soalan 3"
                value={pemeriAnswers['q3'] || ''}
                onChange={(e) => setPemeriAnswers({ ...pemeriAnswers, q3: e.target.value })}
                className={`mx-1.5 px-3 py-1 rounded-xl font-bold border-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer ${
                  pemeriSubmitted
                    ? pemeriAnswers['q3'] === 'adalah'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : 'bg-red-100 border-red-500 text-red-900'
                    : 'bg-white border-blue-400 text-slate-800'
                }`}
              >
                <option value="">(Pilih)</option>
                <option value="ialah">ialah</option>
                <option value="adalah">adalah</option>
              </select>{' '}
              <span className="bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded text-sm font-semibold">
                penting demi keselamatan pengguna [Frasa Adjektif & Sendi Nama]
              </span>
              .
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCheckKataPemeri}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-fun font-bold text-base shadow-lg hover:shadow-xl transition cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-green-300" />
                Semak Jawapan Bersama Cikgu Melati
              </button>

              <button
                type="button"
                onClick={() => {
                  setPemeriAnswers({});
                  setPemeriSubmitted(false);
                }}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Cuba Semula"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {pemeriSubmitted && (
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <span>Skor:</span>
                <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-base">
                  {(pemeriAnswers['q1'] === 'ialah' ? 1 : 0) +
                    (pemeriAnswers['q2'] === 'ialah' ? 1 : 0) +
                    (pemeriAnswers['q3'] === 'adalah' ? 1 : 0)}{' '}
                  / 3 Betul
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Cabaran Kata Pemeri Tahun 1 & 2 (Keselamatan Jalan Raya & Rumah) */}
      {activeTab === 'cabaranTahun12' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border-4 border-green-200/80">
          <div className="pb-4 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold mb-2">
              <Car className="w-3.5 h-3.5 text-green-700" />
              Tema Keselamatan Sekolah & Jalan Raya (Tahun 1 & 2)
            </div>
            <h2 className="font-fun text-2xl md:text-3xl font-bold text-slate-900">
              Lengkapkan Kata Pemeri: <span className="text-green-600">Keselamatan Diri & Persekitaran</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Perhatikan perkataan selepas tempat kosong sama ada <strong>Frasa Nama (ialah)</strong> atau <strong>Frasa Adjektif / Sendi Nama (adalah)</strong>:
            </p>
          </div>

          <div className="space-y-4 my-6">
            {safetyQuestionsTahun12.map((q, idx) => {
              const selected = safetyAnswers[q.id];
              const isCorrect = selected === q.correct;

              return (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500">{q.context}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Petunjuk: {q.afterType}
                    </span>
                  </div>

                  <p className="text-sm md:text-base font-semibold text-slate-800 mb-3">
                    {q.sentence}
                  </p>

                  <div className="flex gap-3">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSafetyAnswers({ ...safetyAnswers, [q.id]: opt });
                          if (opt === q.correct) {
                            soundManager.playSuccess();
                          } else {
                            soundManager.playHint();
                          }
                        }}
                        className={`px-6 py-2 rounded-xl font-fun font-bold text-sm border-2 transition cursor-pointer ${
                          selected === opt
                            ? opt === q.correct
                              ? 'bg-emerald-500 border-emerald-600 text-white'
                              : 'bg-red-500 border-red-600 text-white'
                            : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {selected && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Detektif Betulkan Kesalahan Kata Pemeri */}
      {activeTab === 'klinikKesalahan' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border-4 border-yellow-200/80">
          <div className="pb-4 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              Klinik Tatabahasa Keselamatan
            </div>
            <h2 className="font-fun text-2xl md:text-3xl font-bold text-slate-900">
              Detektif Cilik: <span className="text-amber-600">Betulkan Kesalahan Kata Pemeri</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ayat di bawah mengandungi kesalahan kata pemeri yang lazim dilakukan murid. Pilih kata pemeri yang tepat untuk membetulkannya!
            </p>
          </div>

          <div className="space-y-4 my-6">
            {mistakeCorrectionTasks.map((t, idx) => {
              const selected = mistakeSelections[t.id];
              const isCorrect = selected === t.correctWord;

              return (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-red-600 uppercase block mb-1">
                    Ayat dengan kesalahan kata pemeri:
                  </span>
                  <p className="text-base font-bold text-slate-800 mb-3 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    "{t.wrongSentence}"
                  </p>

                  <p className="text-xs text-slate-600 font-semibold mb-2">
                    Gantikan perkataan salah "{t.wordWrong}" dengan:
                  </p>

                  <div className="flex gap-3">
                    {t.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setMistakeSelections({ ...mistakeSelections, [t.id]: opt });
                          if (opt === t.correctWord) {
                            soundManager.playSuccess();
                          } else {
                            soundManager.playHint();
                          }
                        }}
                        className={`px-6 py-2 rounded-xl font-fun font-bold text-sm border-2 transition cursor-pointer ${
                          selected === opt
                            ? opt === t.correctWord
                              ? 'bg-emerald-500 border-emerald-600 text-white'
                              : 'bg-red-500 border-red-600 text-white'
                            : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {selected && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      💡 <strong>Ulasan Guru:</strong> {t.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Ujian Diagnostik Penentuan Tahap Penguasaan TP 1 - TP 6 */}
      {activeTab === 'ujianPBD' && (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border-4 border-red-200/80">
          <div className="pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-2">
                <span>🏆</span> Pentaksiran Bilik Darjah (PBD KSSR) • Kata Pemeri
              </div>
              <h2 className="font-fun text-2xl md:text-3xl font-bold text-slate-900">
                Ujian Diagnostik <span className="text-red-600">Kata Pemeri (TP 1 - TP 6)</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">TP Semasa:</span>
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-fun font-bold text-sm">
                TP {currentStudent.currentTP}
              </span>
            </div>
          </div>

          {!diagnosticFinished ? (
            <div className="my-6">
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
                <span>Soalan {diagnosticCurrentIndex + 1} daripada {diagnosticQuestionsKataPemeri.length}</span>
                <span>Menguji Aras TP {diagnosticQuestionsKataPemeri[diagnosticCurrentIndex].tpLevel}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${((diagnosticCurrentIndex + 1) / diagnosticQuestionsKataPemeri.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-inner">
                <div className="inline-block px-3 py-1 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold mb-3">
                  Ujian Aras TP {diagnosticQuestionsKataPemeri[diagnosticCurrentIndex].tpLevel}:{' '}
                  {TP_DESCRIPTIONS[diagnosticQuestionsKataPemeri[diagnosticCurrentIndex].tpLevel]?.title}
                </div>

                <h3 className="font-fun text-lg md:text-xl font-bold text-slate-900 mb-5 leading-relaxed">
                  {diagnosticQuestionsKataPemeri[diagnosticCurrentIndex].question}
                </h3>

                <div className="space-y-3">
                  {diagnosticQuestionsKataPemeri[diagnosticCurrentIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswerDiagnostic(opt)}
                      disabled={selectedDiagnosticOption !== null}
                      className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all border-2 flex items-center justify-between cursor-pointer ${
                        selectedDiagnosticOption === opt
                          ? opt === diagnosticQuestionsKataPemeri[diagnosticCurrentIndex].correct
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                            : 'bg-red-500 text-white border-red-600 shadow-md'
                          : 'bg-white hover:bg-red-50 text-slate-800 border-slate-200 hover:border-red-300'
                      }`}
                    >
                      <span>{opt}</span>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <span>Petunjuk Cikgu Melati: {diagnosticQuestionsKataPemeri[diagnosticCurrentIndex].hint}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Finished Result Card */
            <div className="my-8 text-center p-8 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 border-3 border-amber-300">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-white flex items-center justify-center text-4xl shadow-xl animate-bounce">
                👑
              </div>

              <h3 className="font-fun text-2xl md:text-3xl font-extrabold text-slate-900 mt-4">
                Tahniah, {currentStudent.name}!
              </h3>

              <div className="inline-block mt-3 px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-fun font-bold text-xl shadow-lg">
                Pencapaian: Tahap Penguasaan TP {Math.max(1, Math.min(6, diagnosticScore))} (Kata Pemeri)
              </div>

              <p className="mt-4 text-slate-700 max-w-lg mx-auto text-sm leading-relaxed">
                {TP_DESCRIPTIONS[Math.max(1, Math.min(6, diagnosticScore))]?.desc}
              </p>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDiagnosticCurrentIndex(0);
                    setDiagnosticScore(0);
                    setDiagnosticFinished(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition cursor-pointer"
                >
                  Uji Semula
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
