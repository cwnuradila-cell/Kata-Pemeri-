export interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  currentTP: number; // 1 to 6
  grammarStats: {
    ialahFrasaNama: number; // % mastery for 'ialah' + Frasa Nama
    adalahFrasaAdjektif: number; // % mastery for 'adalah' + Frasa Adjektif
    adalahFrasaSendiNama: number; // % mastery for 'adalah' + Frasa Sendi Nama
    analisisKesalahan: number; // % identifying & fixing common mistakes
    keseluruhanKataPemeri: number; // overall kata pemeri score
  };
  totalQuestionsAnswered: number;
  correctAnswers: number;
  lastActive: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'eva';
  text: string;
  timestamp: string;
  detectedTP?: number;
  feedbackType?: 'correct' | 'hint' | 'praise' | 'neutral';
  suggestedAction?: string;
}

export interface GrammarTopic {
  id: string;
  dskpCode: string;
  title: string;
  category: 'Kata Nama' | 'Kata Kerja' | 'Kata Adjektif' | 'Kata Tugas';
  description: string;
  rules: string[];
  examples: { text: string; highlight: string; explanation: string }[];
  challengeQuestions: ChallengeQuestion[];
}

export interface ChallengeQuestion {
  id: string;
  sentenceBefore: string;
  sentenceAfter: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  ruleHint: string;
  tpLevel: number;
  targetSkill: string;
}

export interface WeeklyReportData {
  className: string;
  weekNumber: string;
  dateGenerated: string;
  teacherName: string;
  schoolName: string;
  overallSummary: string;
  tpDistribution: { [key: number]: number };
  topPerformers: { name: string; tp: number; note: string }[];
  interventionStudents: { name: string; tp: number; note: string }[];
  recommendedActivities: string[];
  teacherComment: string;
}

export const TP_DESCRIPTIONS: Record<number, { title: string; badge: string; color: string; desc: string; criteria: string }> = {
  1: {
    title: 'Tahap 1: Sangat Terhad',
    badge: '🌱 Tunas Bahasa',
    color: 'from-amber-400 to-amber-500 text-amber-950',
    desc: 'Murid berupaya mengingat kembali asas tatabahasa dengan bimbingan penuh.',
    criteria: 'Mengenal pasti dan menyebut kata nama, kata kerja, atau kata tugas mudah.',
  },
  2: {
    title: 'Tahap 2: Terhad',
    badge: '🌿 Pemula Bijak',
    color: 'from-orange-400 to-orange-500 text-orange-950',
    desc: 'Murid memahami fungsi golongan kata dan berupaya memberi contoh ringkas.',
    criteria: 'Menjelaskan fungsi kata asas seperti membezakan kata nama am dan khas.',
  },
  3: {
    title: 'Tahap 3: Memuaskan',
    badge: '⭐ Murid Harapan',
    color: 'from-emerald-400 to-teal-500 text-emerald-950',
    desc: 'Murid mengaplikasikan tatabahasa dalam ayat tunggal mengikut konteks.',
    criteria: 'Mengisi tempat kosong dengan kata pemeri (ialah/adalah) atau penjodoh bilangan dengan betul.',
  },
  4: {
    title: 'Tahap 4: Baik',
    badge: '🏅 Jagoan Bahasa',
    color: 'from-blue-400 to-indigo-500 text-white',
    desc: 'Murid mengaplikasikan tatabahasa dalam pelbagai situasi secara betul dan bersistem.',
    criteria: 'Membina dan membetulkan ayat tatabahasa dengan tepat dalam pelbagai bentuk ayat.',
  },
  5: {
    title: 'Tahap 5: Sangat Baik',
    badge: '💎 Bintang Cemerlang',
    color: 'from-purple-500 to-pink-500 text-white',
    desc: 'Murid membina ayat secara tekal, tepat, dan bermakna dengan yakin.',
    criteria: 'Menggunakan tatabahasa dengan jitu tanpa kesalahan ketara dalam karangan dan perbualan.',
  },
  6: {
    title: 'Tahap 6: Cemerlang',
    badge: '👑 Pendeta Cilik',
    color: 'from-amber-300 via-yellow-400 to-amber-500 text-slate-900',
    desc: 'Murid menguasai tatabahasa secara kreatif, teliti, serta boleh menjadi teladan rakan sebaya.',
    criteria: 'Mampu menerangkan hukum tatabahasa, membina perenggan kreatif, dan membantu rakan lain.',
  },
};
