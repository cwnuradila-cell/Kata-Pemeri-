import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK as per skill instructions
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System prompt strictly focused on KATA PEMERI ("ialah" & "adalah") with SAFETY THEMES (Tahun 1, 2, 3)
const SYSTEM_INSTRUCTION = `Anda ialah "Sahabat AI", sebuah robot AI pintar bercirikan robot futuristik EVE dari siri Wall-E yang sangat mesra, ceria, comel dan penyayang. Anda bertindak sebagai pembantu dan pembimbing murid di "Kelas Cikgu Adila" bagi menguasai kemahiran "Kata Pemeri" (ialah & adalah) dengan Tema Keselamatan (Keselamatan di Jalan Raya, Keselamatan di Rumah/Sekolah, dan Keselamatan Elektrik/Kebakaran Buku Teks m/s 57) untuk murid Sekolah Rendah (Tahun 1, 2, dan 3 SK).

Peraturan Emas Kata Pemeri:
1. "ialah" WAJIB hadir di hadapan FRASA NAMA yang bersifat persamaan atau definisi.
   - Contoh Tahun 1: Lintasan belang *ialah* tempat melintas jalan.
   - Contoh Tahun 2: Jaket keselamatan *ialah* pakaian perlindungan di dalam bot.
   - Contoh Tahun 3: Punca kemalangan renjatan elektrik *ialah* penggunaan bateri tiruan.
2. "adalah" WAJIB hadir di hadapan FRASA ADJEKTIF (sifat) dan FRASA SENDI NAMA (tujuan/arah/tempat).
   - Frasa Adjektif: Melintas jalan secara melulu *adalah* sangat berbahaya. / Memakai topi keledar *adalah* wajib.
   - Frasa Sendi Nama: Peti pertolongan cemas ini *adalah* untuk kegunaan kecemasan. / Langkah keselamatan itu *adalah* demi kesejahteraan kita.

Aras Murid Mengikut Tahun:
- Tahun 1: Ayat tunggal asas keselamatan (Lampu isyarat, taman permainan, pejalan kaki).
- Tahun 2: Keselamatan bilik darjah, dapur, kolam renang, tangga (Frasa nama vs frasa adjektif).
- Tahun 3: Keselamatan alatan elektrik, pengecas telefon bimbit (Buku Teks m/s 57 "Beringat Sebelum Kena"), kebakaran, kimia.

Format Penilaian PBD Pentaksiran Bilik Darjah (TP 1 hingga TP 6):
Setiap kali murid membina ayat atau menjawab kuiz Kata Pemeri, nilai jawapan mereka dan berikan Tahap Penguasaan TP 1 - TP 6 berserta ulasan mesra Sahabat AI:
- TP 1: Mengingat kembali asas bahawa kata pemeri terdiri daripada "ialah" dan "adalah".
- TP 2: Memahami fungsi ringkas (mengetahui "ialah" untuk nama, "adalah" untuk sifat/sendi nama).
- TP 3: Mengisi tempat kosong kata pemeri dengan betul dalam ayat tunggal keselamatan.
- TP 4: Mengaplikasikan "ialah" dan "adalah" dalam pelbagai situasi keselamatan secara tepat.
- TP 5: Membina ayat majmuk keselamatan yang gramatis secara tekal dan tepat tanpa kesalahan pemeri.
- TP 6: Menganalisis dan membetulkan kesalahan penggunaan kata pemeri (cth: membetulkan "adalah seorang" kepada "ialah seorang"), kreatif, teliti, dan boleh menjadi contoh teladan.`;

// API endpoint for Sahabat AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], currentStudent, targetSkill } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mesej tidak boleh kosong.' });
    }

    if (ai) {
      try {
        const promptContext = `Maklumat Murid (Kelas Cikgu Adila):
Nama: ${currentStudent?.name || 'Murid'}
Kelas: ${currentStudent?.class || 'Tahun 3'}
Fokus Kemahiran: ${targetSkill || 'Kata Pemeri (ialah & adalah)'}
Tahap Penguasaan Semasa: TP ${currentStudent?.currentTP || 3}

Sejarah Perbualan:
${history.slice(-6).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Murid' : 'Sahabat AI'}: ${h.text}`).join('\n')}

Mesej Terkini Murid:
"${message}"

Sila jawab sebagai Sahabat AI. Sekiranya murid menjawab cabaran/kuiz kata pemeri atau membina ayat:
1. Berikan maklum balas yang membina dan ceria.
2. Jelaskan jika ada pembetulan tatabahasa dengan cara yang santun dan mudah difahami.
3. Cadangkan tahap penguasaan TP (1-6) yang bersesuaian dengan bukti pencapaian jawapannya.
4. Akhiri dengan soalan rangsangan atau pujian bersemangat!`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptContext,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const replyText = response.text || 'Tahniah kerana terus berusaha! Cikgu Eva bangga dengan kamu!';

        // Heuristic detection of TP in response or calculate evaluation
        let detectedTP = null;
        const tpMatch = replyText.match(/TP\s*([1-6])|Tahap Penguasaan\s*([1-6])/i);
        if (tpMatch) {
          detectedTP = parseInt(tpMatch[1] || tpMatch[2], 10);
        }

        return res.json({
          reply: replyText,
          detectedTP: detectedTP,
          status: 'success',
        });
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to intelligent heuristic BM grammar tutor:', geminiError);
      }
    }

    // Heuristic Fallback Engine if API key is not active
    const fallbackResponse = generateHeuristicBMResponse(message, targetSkill);
    return res.json({
      reply: fallbackResponse.text,
      detectedTP: fallbackResponse.tp,
      status: 'fallback',
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Gagal memproses perbualan.' });
  }
});

// API endpoint for Weekly Teacher Report generation
app.post('/api/generate-report', async (req, res) => {
  try {
    const { students, className, weekNumber } = req.body;

    if (ai) {
      try {
        const prompt = `Anda ialah Pegawai Penilai Pentaksiran Bilik Darjah (PBD) Bahasa Melayu Sekolah Rendah KPM.
Sila jana "Laporan Analisis Prestasi Mingguan Guru Kelas":
- Kelas: ${className || '3 Cemerlang'}
- Minggu Persekolahan: Minggu ${weekNumber || 'Minggu 8'}
- Data Murid:
${JSON.stringify(students, null, 2)}

Sila jana rumusan rasmi dalam format JSON yang mengandungi:
1. overallSummary: Rumusan pencapaian keseluruhan kelas dalam tatabahasa (Kata Nama, Kata Kerja, Kata Adjektif, Kata Pemeri).
2. topPerformers: Murid yang mencapai TP 5 atau TP 6 dengan kekuatan mereka.
3. interventionStudents: Murid yang memerlukan bimbingan intervensi (TP 1 - TP 2).
4. recommendedActivities: 3 cadangan aktiviti intervensi & pengayaan berimpak tinggi mengikut Buku Teks BM Tahun 3.
5. teacherComment: Ulasan profesional untuk rekod persediaan mengajar (RPH/PBD).`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ report: parsed, status: 'success' });
      } catch (geminiErr) {
        console.warn('Gemini report error, using standard fallback report:', geminiErr);
      }
    }

    // Default template report
    const fallbackReport = {
      overallSummary: `Prestasi murid bagi ${className || 'Kelas 3 Cemerlang'} pada minggu ini menunjukkan perkembangan yang sangat positif. Majoriti murid telah menguasai penggunaan Kata Pemeri ('ialah' dan 'adalah') serta Kata Nama Am dan Khas dengan tepat melalui bimbingan interaktif Cikgu Eva.`,
      topPerformers: [
        { name: 'Nur Aisyah Humaira', tp: 6, note: 'Menguasai pembinaan ayat majmuk dengan kata hubung dan kata pemeri yang jitu.' },
        { name: 'Muhammad Adam Haris', tp: 5, note: 'Sangat tekal dalam membezakan kata kerja aktif transitif dan pasif.' },
      ],
      interventionStudents: [
        { name: 'Danish Iskandar', tp: 2, note: 'Masih keliru meletakkan perkataan "ialah" di hadapan kata adjektif.' },
      ],
      recommendedActivities: [
        'Aktiviti "Detektif Kata Pemeri" menggunakan petikan Buku Teks m/s 57 "Beringat Sebelum Kena".',
        'Stesen Pembelajaran Berasaskan Kad Imbasan Penjodoh Bilangan dan Kata Nama.',
        'Permainan Roda Kata Adjektif (Pancaindera & Perasaan) secara berpasangan.',
      ],
      teacherComment: 'Objektif pembelajaran aspek tatabahasa 5.1 tercapai pada tahap 86%. Murid yang berada di TP 1 dan 2 akan diberi modul bimbingan intervensi khusus.',
    };

    return res.json({ report: fallbackReport, status: 'fallback' });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Gagal menjana laporan mingguan.' });
  }
});

// Heuristic response generator for KSSR BM SK Tahun 3
function generateHeuristicBMResponse(userMsg: string, targetSkill?: string) {
  const lower = userMsg.toLowerCase().trim();

  // Kata Pemeri: ialah vs adalah
  if (lower.includes('ialah') || lower.includes('adalah') || targetSkill === 'kata_pemeri') {
    if (lower.includes('ialah') && (lower.includes('nama') || lower.includes('cikgu') || lower.includes('suri rumah') || lower.includes('doktor') || lower.includes('seorang') || lower.includes('tanda') || lower.includes('punca'))) {
      return {
        text: `Wah, tepat sekali! 🌟 Murid yang bijak di Kelas Cikgu Adila! Perkataan "ialah" mesti hadir di hadapan frasa nama (seperti "ialah seorang suri rumah" atau "ialah laluan khas"). Sahabat AI bagi 5 bintang untuk kamu! Kamu layak mendapat Tahap Penguasaan TP 5! Cuba bina satu lagi ayat menggunakan "adalah" di hadapan kata adjektif?`,
        tp: 5,
      };
    } else if (lower.includes('adalah') && (lower.includes('sangat') || lower.includes('penting') || lower.includes('bahaya') || lower.includes('untuk') || lower.includes('daripada') || lower.includes('demi'))) {
      return {
        text: `Tepat sekali, anak murid yang cemerlang! 👏 "Adalah" digunakan di hadapan frasa adjektif (seperti "adalah sangat berbahaya") atau frasa sendi nama (seperti "adalah demi keselamatan"). Sahabat AI mengiktiraf kamu telah membuktikan kefahaman TP 5!`,
        tp: 5,
      };
    } else {
      return {
        text: `Mari Sahabat AI kongsikan tips rahsia dari Kelas Cikgu Adila (Buku Teks m/s 57) ya:
💡 **Formula Emas Kata Pemeri**:
1. Gunakan **"ialah"** di hadapan Frasa Nama. (Contoh: Lintasan belang *ialah* tempat melintas jalan.)
2. Gunakan **"adalah"** di hadapan Frasa Adjektif atau Frasa Sendi Nama. (Contoh: Menyeberang jalan tanpa melihat kiri kanan *adalah* sangat bahaya. Peti ubat ini *adalah* untuk rawatan kecemasan.)

Bolehkah adik cuba isi tempat kosong keselamatan ini:
"Peralatan berisiko yang menyebabkan renjatan elektrik itu ________ pengecas tiruan." (ialah / adalah)?`,
        tp: 3,
      };
    }
  }

  // Greeting
  if (lower.includes('hai') || lower.includes('halo') || lower.includes('assalamualaikum') || lower.includes('selamat')) {
    return {
      text: `Hai! Selamat datang ke Kelas Cikgu Adila! 🤖✨ Sahabat AI sangat gembira dapat belajar bersama kamu hari ini. Sahabat AI ialah robot pembimbing khas Kata Pemeri ("ialah" & "adalah"). Mari kita mulakan latihan bertema keselamatan!`,
      tp: 3,
    };
  }

  // Default encouraging reply
  return {
    text: `Bagus sekali respon kamu! 🌈 Sahabat AI sangat suka murid yang rajin mencuba di Kelas Cikgu Adila. Dalam aspek Kata Pemeri, ketelitian membezakan frasa nama dengan frasa adjektif sangat penting. Berdasarkan usaha kamu, Sahabat AI mengiktiraf Tahap Penguasaan TP 3! Teruskan semangat belajar!`,
    tp: 3,
  };
}

// Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
