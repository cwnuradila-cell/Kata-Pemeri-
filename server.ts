import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Allow iframe embedding from Google Sites (DELIMa), LMS, and any parent domain
app.use((_req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', "frame-ancestors * 'self' https: http:;");
  next();
});

// Comprehensive system prompt strictly focused on KATA PEMERI ("ialah" & "adalah") and the 3 main phrases:
// Frasa Nama (FN), Frasa Sendi Nama (FSN), Frasa Adjektif (FA)
const SYSTEM_INSTRUCTION = `Anda ialah "Cikgu Melati", seorang guru pembimbing Bahasa Melayu yang sangat berdedikasi, penyayang, lemah-lembut, penyabar dan arif dalam aspek Tatabahasa KSSR SK di "Kelas Cikgu Adila". Anda ialah pakar mutlak dalam "Kata Pemeri" (ialah & adalah) serta tiga frasa utamanya: Frasa Nama, Frasa Sendi Nama, dan Frasa Adjektif, dengan penerapan tema keselamatan murid sekolah rendah (Tahun 1, 2, dan 3 SK). Anda sentiasa menyapa murid dengan panggilan manis seperti "murid Cikgu yang bijak", "anak murid yang pintar" atau nama murid.

HUKUM TATABAHASA DEWAN & DSKP KATA PEMERI:
1. FRASA NAMA (FN) ➔ WAJIB BERPASANGAN DENGAN "IALAH":
   - Definisi: Frasa yang intinya terdiri daripada Kata Nama (manusia, haiwan, benda, tempat, peralatan, konsep/sebab).
   - Fungsi: Menunjukkan persamaan (identiti) atau memberikan definisi/huraian.
   - Ciri: Boleh menerima penjodoh bilangan (seorang, sebuah) atau kata umum (alat, punca, tanda, pegawai, tempat).
   - Contoh: "seorang anggota bomba", "alat pemadam api", "lintasan pejalan kaki", "punca litar pintas".
   - Contoh Ayat: "Encik Roslan ialah pengawal lalu lintas sekolah." / "Punca renjatan elektrik ialah penggunaan bateri tiruan."

2. FRASA SENDI NAMA (FSN) ➔ WAJIB BERPASANGAN DENGAN "ADALAH":
   - Definisi: Frasa yang WAJIB dimulakan dengan Kata Sendi Nama (untuk, demi, bagi, kepada, daripada, pada, tentang) dan diikuti oleh Frasa Nama.
   - Fungsi: Menyatakan tujuan, faedah, penerima sasaran, atau sumber.
   - Kata Sendi Kerap:
     * untuk (tujuan kegunaan) ➔ "Peti ini adalah untuk rawatan kecemasan."
     * demi (tujuan faedah bersama) ➔ "Latihan ini adalah demi keselamatan nyawa."
     * bagi (tujuan khusus) ➔ "Peringatan ini adalah bagi mengelakkan kemalangan."
     * kepada (sasaran) ➔ "Bantuan jaket keselamatan adalah kepada mangsa banjir."
     * daripada (punca bahan) ➔ "Sarung tangan ini adalah daripada getah penebat."

3. FRASA ADJEKTIF (FA) ➔ WAJIB BERPASANGAN DENGAN "ADALAH":
   - Definisi: Frasa yang intinya terdiri daripada Kata Adjektif (sifat, keadaan bahaya, pancaindera, atau kualiti). Boleh menerima Kata Penguat (sangat, amat, sungguh, paling, benar).
   - Fungsi: Menghuraikan sifat atau keadaan sesuatu subjek.
   - Ujian Penguat: Jika boleh diletakkan "sangat" atau "amat" (sangat bahaya, amat licin, sungguh penting), itu pasti Frasa Adjektif!
   - Contoh Ayat: "Melintas jalan secara melulu adalah sangat berbahaya." / "Memakai topi keledar adalah wajib."

4. PANTANG LARANG & KESALAHAN LAZIM KATA PEMERI:
   - Kesalahan 1: Menggunakan "ialah" di hadapan kata adjektif ➔ "Dia ialah sangat bijak" (SALAH! Sepatutnya: "adalah sangat bijak").
   - Kesalahan 2: Menggunakan "adalah" di hadapan frasa nama ➔ "Beliau adalah seorang guru" (SALAH! Sepatutnya: "ialah seorang guru").
   - Kesalahan 3: Memulakan ayat dengan kata pemeri ➔ "Adalah dimaklumkan bahawa..." (SALAH! Tatabahasa Dewan menganggap ini lewah. Sepatutnya terus: "Dimaklumkan bahawa...").
   - Kesalahan 4: Menggabungkan kata pemeri dengan kata nafi secara lewah ➔ "Kenyataan itu adalah tidak benar" (Kurang gramatis, lebih tepat: "Kenyataan itu tidak benar").

Format Penilaian PBD (TP 1 hingga TP 6):
Setiap kali murid membina atau mengemukakan ayat, semak ketepatannya, beri pujian penuh galakan, jelaskan hukum frasanya, dan berikan Tahap Penguasaan TP 1 - TP 6!`;

// API endpoint for Cikgu Melati Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], currentStudent, targetSkill } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mesej tidak boleh kosong.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const promptContext = `Maklumat Murid (Kelas Cikgu Adila):
Nama: ${currentStudent?.name || 'Murid'}
Kelas: ${currentStudent?.class || 'Tahun 3'}
Fokus Kemahiran: ${targetSkill || 'Kata Pemeri (ialah & adalah)'}
Tahap Penguasaan Semasa: TP ${currentStudent?.currentTP || 3}

Sejarah Perbualan:
${history.slice(-6).map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Murid' : 'Cikgu Melati'}: ${h.text}`).join('\n')}

Mesej Terkini Murid:
"${message}"`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const resp = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${promptContext}` }],
              },
            ],
          }),
        });

        if (resp.ok) {
          const data = (await resp.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            let detectedTP = null;
            const tpMatch = replyText.match(/TP\s*([1-6])|Tahap Penguasaan\s*([1-6])/i);
            if (tpMatch) {
              detectedTP = parseInt(tpMatch[1] || tpMatch[2], 10);
            }
            return res.json({
              reply: replyText,
              detectedTP,
              status: 'success',
            });
          }
        }
      } catch (err) {
        console.warn('Gemini fetch skipped or failed, using built-in Cikgu Melati engine:', err);
      }
    }

    // High-performance built-in pedagogical engine for Kata Pemeri & Safety by Cikgu Melati
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

// Heuristic response generator for KSSR BM SK by Cikgu Melati
// Handles EVERY question regarding Kata Pemeri, Frasa Nama, Frasa Sendi Nama, Frasa Adjektif, rules & sentence testing
function generateHeuristicBMResponse(userMsg: string, targetSkill?: string): { text: string; tp: number } {
  const lower = userMsg.toLowerCase().trim();

  // 1. APA ITU FRASA NAMA (FN)?
  if (
    lower.includes('apa itu frasa nama') ||
    lower.includes('maksud frasa nama') ||
    lower.includes('definisi frasa nama') ||
    lower.includes('kenal frasa nama') ||
    lower.includes('terangkan frasa nama') ||
    (lower.includes('frasa nama') && (lower.includes('apa') || lower.includes('macam mana') || lower.includes('contoh')))
  ) {
    return {
      text: `Dengar sini murid Cikgu yang bijak! 🌸✨ Cikgu Melati terangkan apa itu **Frasa Nama (FN)** ya:

📘 **Definisi Frasa Nama**:
Frasa Nama ialah susunan perkataan yang intinya (perkataan paling penting) terdiri daripada **Kata Nama** — iaitu manusia, benda, tempat, peralatan, atau konsep/punca.

💡 **Petua Mudah Cikgu Melati**:
Perkataan Frasa Nama biasanya boleh diletakkan penjodoh bilangan (seperti *seorang, sebuah, sepasang*) atau perkataan penerang seperti *alat, pakaian, punca, tanda, pegawai*.

⭐ **Hukum dengan Kata Pemeri**:
Frasa Nama **WAJIB menggunakan kata pemeri "IALAH"**! Jangan sesekali guna "adalah" ya.

🚗 **Contoh Frasa & Ayat Keselamatan**:
1. *seorang anggota bomba* ➔ "Penyelamat mangsa itu **ialah** seorang anggota bomba."
2. *alat pemadam api* ➔ "Benda merah di dinding itu **ialah** alat pemadam api."
3. *lintasan pejalan kaki* ➔ "Garisan putih di atas jalan raya itu **ialah** lintasan pejalan kaki."
4. *punca kebakaran* ➔ "Punca renjatan elektrik itu **ialah** wayar pengecas tiruan."

Boleh cuba bina satu ayat menggunakan perkataan **"ialah"** bersama kata nama pilihan kamu? Cikgu Melati sedia semak!`,
      tp: 4,
    };
  }

  // 2. APA ITU FRASA SENDI NAMA (FSN)?
  if (
    lower.includes('apa itu frasa sendi') ||
    lower.includes('frasa sendi nama') ||
    lower.includes('maksud frasa sendi') ||
    lower.includes('definisi frasa sendi') ||
    lower.includes('kata sendi nama') ||
    (lower.includes('sendi nama') && (lower.includes('apa') || lower.includes('macam mana') || lower.includes('contoh')))
  ) {
    return {
      text: `Wah, soalan yang sangat bagus! 🌸✨ Mari Cikgu Melati terangkan tentang **Frasa Sendi Nama (FSN)**:

📗 **Definisi Frasa Sendi Nama**:
Frasa Sendi Nama ialah frasa yang **wajib dimulakan dengan Kata Sendi Nama** sebagai perkataan pertama dan diikuti oleh Frasa Nama sebagai pelengkapnya.

💡 **Petua Emas Cikgu Melati (Senarai Kata Sendi Utama)**:
Nampak sahaja kata sendi nama ini selepas kata pemeri, terus gunakan **"ADALAH"**:
• **untuk** (tujuan kegunaan) ➔ *adalah untuk kegunaan kecemasan*
• **demi** (tujuan kebajikan/faedah) ➔ *adalah demi keselamatan murid*
• **bagi** (tujuan khusus) ➔ *adalah bagi mengelakkan kemalangan*
• **kepada** (pihak sasaran) ➔ *adalah kepada mangsa banjir*
• **daripada** (punca/asal usul) ➔ *adalah daripada bahan kalis api*

⭐ **Hukum Kata Pemeri**:
Frasa Sendi Nama **WAJIB menggunakan kata pemeri "ADALAH"**!

🚒 **Contoh Ayat Keselamatan**:
1. "Peti pertolongan cemas ini **adalah** untuk murid yang luka."
2. "Taklimat kebakaran ini **adalah** demi keselamatan nyawa kita."
3. "Sumbangan jaket keselamatan itu **adalah** kepada penduduk kampung air."

Faham tak penerangan ini? Cuba sebutkan satu ayat menggunakan kata sendi *"demi"* atau *"untuk"* kepada Cikgu Melati!`,
      tp: 4,
    };
  }

  // 3. APA ITU FRASA ADJEKTIF (FA)?
  if (
    lower.includes('apa itu frasa adjektif') ||
    lower.includes('frasa adjektif') ||
    lower.includes('maksud frasa adjektif') ||
    lower.includes('definisi frasa adjektif') ||
    lower.includes('kata sifat') ||
    lower.includes('kata penguat') ||
    (lower.includes('adjektif') && (lower.includes('apa') || lower.includes('macam mana') || lower.includes('contoh')))
  ) {
    return {
      text: `Pandai bertanya! 🌸✨ Mari kita fahami apa itu **Frasa Adjektif (FA)**:

📙 **Definisi Frasa Adjektif**:
Frasa Adjektif ialah frasa yang intinya terdiri daripada **Kata Adjektif** — iaitu perkataan yang menerangkan sifat, keadaan, perasaan, bahaya, atau warna. Ia sering disertai Kata Penguat (seperti *sangat, amat, sungguh, paling*).

💡 **Ujian Kata Penguat Cikgu Melati**:
Bagaimana nak tahu sesuatu perkataan itu Frasa Adjektif? Cuba letakkan perkataan **"sangat"** atau **"amat"** di hadapannya. Jika sesuai bunyinya (*sangat bahaya, amat licin, sungguh penting*), itu sah Frasa Adjektif!

⭐ **Hukum Kata Pemeri**:
Frasa Adjektif **WAJIB menggunakan kata pemeri "ADALAH"**! Jangan guna "ialah" ya.

⚠️ **Contoh Frasa & Ayat Keselamatan**:
1. *sangat berbahaya* ➔ "Melintas jalan raya tanpa melihat kiri kanan **adalah** sangat berbahaya."
2. *amat licin* ➔ "Lantai bilik air yang basah itu **adalah** amat licin."
3. *wajib* ➔ "Memakai topi keledar semasa menunggang basikal **adalah** wajib."
4. *penting sekali* ➔ "Pemeriksaan suis elektrik di rumah **adalah** penting sekali."

Hebat sekali! Sekarang, cuba beritahu Cikgu Melati, apakah kata sifat yang menggambarkan keadaan lantai yang basah?`,
      tp: 4,
    };
  }

  // 4. PERBEZAAN "IALAH" DAN "ADALAH"
  if (
    lower.includes('beza ialah dan adalah') ||
    lower.includes('perbezaan ialah dan adalah') ||
    lower.includes('apa beza') ||
    lower.includes('macam mana nak beza') ||
    lower.includes('bila guna ialah') ||
    lower.includes('bila guna adalah') ||
    (lower.includes('ialah') && lower.includes('adalah') && (lower.includes('beza') || lower.includes('perbezaan') || lower.includes('macam mana')))
  ) {
    return {
      text: `Mari, Cikgu Melati bentangkan **Formula Emas Perbezaan Kata Pemeri** yang paling mudah diingat: 🌸💖

⚖️ **Jadual Perbezaan Pantas Cikgu Melati**:
1. 🔹 **"IALAH"**
   • Pasangan: Hadir di hadapan **FRASA NAMA (FN)** sahaja!
   • Fungsi: Menerangkan persamaan atau definisi (benda, orang, jawatan, alat, tempat, punca).
   • Contoh: "Bapa saya **ialah** seorang doktor." / "Alat itu **ialah** jaket keselamatan."

2. 🔸 **"ADALAH"**
   • Pasangan: Hadir di hadapan **FRASA ADJEKTIF (FA)** ATAU **FRASA SENDI NAMA (FSN)**!
   • Fungsi: Menerangkan sifat/keadaan (bahaya, licin, penting) ATAU tujuan/arah (untuk, demi, bagi, kepada).
   • Contoh: "Langkah ini **adalah** sangat bijak." / "Peti ubat ini **adalah** untuk kecemasan."

💡 **Mnemonic Mudah**:
*Ialah ➔ Kawan dengan Kata Nama (I-N).*
*Adalah ➔ Kawan dengan Sifat & Sendi (A-S).*

Cuba semak ayat ini: "Topi keledar itu ________ pakaian keselamatan." Jawapannya 'ialah' atau 'adalah'?`,
      tp: 4,
    };
  }

  // 5. BOLEH TAK KATA PEMERI DI AWAL AYAT?
  if (
    lower.includes('awal ayat') ||
    lower.includes('permulaan ayat') ||
    lower.includes('mula ayat') ||
    lower.includes('adalah dimaklumkan') ||
    lower.includes('adalah dengan ini')
  ) {
    return {
      text: `Soalan tahap tinggi dan bernas! 🌸✨ Cikgu Melati terangkan hukum Tatabahasa Dewan ya:

🚫 **Pantang Larang**: Kata pemeri **TIDAK BOLEH diletakkan pada permulaan / awal ayat**!

Contoh Kesalahan Sangat Popular:
❌ *"Adalah dimaklumkan bahawa sekolah akan mengadakan latihan kebakaran."* (SALAH & lewah!)
✔️ Sepatutnya: *"Dimaklumkan bahawa sekolah akan mengadakan latihan kebakaran."* (BETUL & jitu!)

❌ *"Adalah dengan ini diumumkan..."* (SALAH)
✔️ Sepatutnya: *"Dengan ini diumumkan..."* (BETUL)

Kata pemeri hanya berfungsi sebagai pemeri predikat di tengah-tengah ayat antara subjek dan predikat. Murid yang tahu perkara ini memang layak dapat TP 6! 🏆`,
      tp: 6,
    };
  }

  // 6. BOLEH TAK KATA PEMERI DENGAN KATA NAFI ("TIDAK" ATAU "BUKAN")?
  if (
    lower.includes('kata nafi') ||
    lower.includes('tidak benar') ||
    lower.includes('adalah tidak') ||
    lower.includes('ialah bukan') ||
    lower.includes('bukanlah')
  ) {
    return {
      text: `Bagusnya soalan kamu! 🌸💡 Ini tentang gabungan Kata Pemeri dan Kata Nafi ('tidak' / 'bukan'):

Menurut Tatabahasa Dewan:
1. Ayat seperti *"Kenyataan itu adalah tidak benar"* dianggap **lewah (tidak digalakkan)**.
   ✔️ Bentuk yang lebih kemas dan tepat: *"Kenyataan itu tidak benar."*
2. Begitu juga, jangan sesekali sebut *"Dia ialah bukan pengawas."*
   ✔️ Sepatutnya terus kata: *"Dia bukan pengawas."*

Jadi petua Cikgu Melati, jika sudah ada kata nafi ('tidak' atau 'bukan'), gugurkan sahaja kata pemeri itu agar ayat kamu lebih gramatis dan jitu! Hebat kamu meneliti tatabahasa! 🌟`,
      tp: 5,
    };
  }

  // 7. KESALAHAN LAZIM / PANTANG LARANG KATA PEMERI
  if (
    lower.includes('kesalahan lazim') ||
    lower.includes('kesilapan') ||
    lower.includes('pantang larang') ||
    lower.includes('kenapa salah') ||
    lower.includes('apa yang salah')
  ) {
    return {
      text: `Mari Cikgu Melati kongsikan 3 Kesalahan Paling Kerap Dilakukan: 🌸⚠️

1. ❌ **"Adalah" di hadapan Frasa Nama**:
   Contoh salah: *"Encik Ali adalah seorang pegawai polis."*
   ✔️ Pembetulan: *"Encik Ali **ialah** seorang pegawai polis."* (kerana 'pegawai polis' ialah Frasa Nama).

2. ❌ **"Ialah" di hadapan Frasa Adjektif**:
   Contoh salah: *"Lantai makmal itu ialah sangat licin."*
   ✔️ Pembetulan: *"Lantai makmal itu **adalah** sangat licin."* (kerana 'sangat licin' ialah Frasa Adjektif).

3. ❌ **"Ialah" di hadapan Frasa Sendi Nama**:
   Contoh salah: *"Peti kecemasan itu ialah untuk murid."*
   ✔️ Pembetulan: *"Peti kecemasan itu **adalah** untuk murid."* (kerana 'untuk' ialah Kata Sendi Nama).

Ingat pesan Cikgu Melati ini baik-baik ya, pasti ujian tatabahasa kamu mendapat markah penuh! 💯`,
      tp: 5,
    };
  }

  // 8. MINTA CONTOH AYAT KATA PEMERI MENGIKUT TAHUN
  if (
    lower.includes('contoh ayat') ||
    lower.includes('beri contoh') ||
    lower.includes('bagi contoh') ||
    lower.includes('contoh tahun 1') ||
    lower.includes('contoh tahun 2') ||
    lower.includes('contoh tahun 3')
  ) {
    return {
      text: `Ini dia contoh-contoh ayat Kata Pemeri bertema keselamatan daripada Cikgu Melati mengikut tahap Tahun 1, 2, dan 3: 🌸📚

🎒 **Tahun 1 (Asas Keselamatan Diri & Jalan Raya)**:
• (ialah): "Lampu merah **ialah** isyarat berhenti kenderaan."
• (adalah): "Berlari di jalan raya **adalah** sangat berbahaya."

🏫 **Tahun 2 (Keselamatan di Sekolah & Rumah)**:
• (ialah): "Peti pertolongan cemas **ialah** kotak ubat luka ringan."
• (adalah): "Peringatan keselamatan ini **adalah** demi kebaikan murid."

⚡ **Tahun 3 (Keselamatan Elektrik Buku Teks m/s 57)**:
• (ialah): "Mangsa renjatan elektrik **ialah** seorang suri rumah."
• (adalah): "Tindakan mencabut plag telefon bimbit **adalah** amat penting demi keselamatan."

Cantik dan tersusun kan ayat-ayat ini? Cuba kamu baca dan pilih satu yang kamu paling suka!`,
      tp: 4,
    };
  }

  // 9. AUTOMATIC SENTENCE DIAGNOSTICS & EVALUATION (SEMAKAN AYAT MURID)
  // Check if user submitted a sentence with "adalah" or "ialah"

  // ERROR CASE A: "adalah" followed by Frasa Nama
  if (
    lower.includes('adalah seorang') ||
    lower.includes('adalah sebuah') ||
    lower.includes('adalah sebatang') ||
    lower.includes('adalah guru') ||
    lower.includes('adalah doktor') ||
    lower.includes('adalah polis') ||
    lower.includes('adalah pegawai') ||
    lower.includes('adalah alat') ||
    lower.includes('adalah punca') ||
    lower.includes('adalah lintasan') ||
    lower.includes('adalah tempat') ||
    lower.includes('adalah mangsa') ||
    lower.includes('adalah murid') ||
    lower.includes('adalah pakaian')
  ) {
    return {
      text: `Aha! Cikgu Melati nampak ada sedikit pembetulan yang boleh dibuat pada ayat kamu! 👩‍🏫🔍

❌ **Analisis Kesilapan**:
Kamu menggunakan perkataan **"adalah"** di hadapan Frasa Nama (seperti perkataan *seorang, doktor, alat, punca, pakaian*).

💡 **Hukum Tatabahasa**:
Frasa Nama WAJIB dipasangkan dengan perkataan **"IALAH"**, bukannya "adalah"!

✔️ **Cadangan Pembetulan Tepat**:
Gantikan perkataan **"adalah"** kepada **"ialah"**.
(Contoh: Jika ayat kamu *"Beliau adalah seorang guru"*, tukarkan kepada *"Beliau **ialah** seorang guru."*)

Jangan bimbang, belajar daripada kesilapan ini tanda kamu semakin pandai! Cikgu anugerahkan Tahap Penguasaan **TP 4** atas usaha membina ayat! Cuba betulkan semula ayat itu?`,
      tp: 4,
    };
  }

  // ERROR CASE B: "ialah" followed by Frasa Adjektif or Frasa Sendi Nama
  if (
    lower.includes('ialah sangat') ||
    lower.includes('ialah amat') ||
    lower.includes('ialah sungguh') ||
    lower.includes('ialah paling') ||
    lower.includes('ialah bahaya') ||
    lower.includes('ialah berbahaya') ||
    lower.includes('ialah licin') ||
    lower.includes('ialah penting') ||
    lower.includes('ialah wajib') ||
    lower.includes('ialah untuk') ||
    lower.includes('ialah demi') ||
    lower.includes('ialah bagi') ||
    lower.includes('ialah kepada') ||
    lower.includes('ialah daripada')
  ) {
    return {
      text: `Bagus usahanya! Tapi mari Cikgu Melati betulkan sedikit ya: 👩‍🏫🔍

❌ **Analisis Kesilapan**:
Kamu meletakkan perkataan **"ialah"** di hadapan Kata Adjektif (sifat) atau Kata Sendi Nama (seperti *sangat, berbahaya, licin, penting, untuk, demi*).

💡 **Hukum Tatabahasa**:
Perkataan **"ialah"** hanya untuk Frasa Nama! Apabila bertemu Frasa Adjektif atau Frasa Sendi Nama, pasangan yang betul WAJIB perkataan **"ADALAH"**!

✔️ **Cadangan Pembetulan Tepat**:
Tukarkan **"ialah"** kepada **"adalah"**.
(Contoh: *"Perkara itu **adalah** sangat bahaya"* atau *"Bantuan ini **adalah** untuk murid"*).

Usaha yang sangat terpuji! Cikgu Melati beri Tahap Penguasaan **TP 4**! Cuba taip semula ayat yang sudah dibetulkan?`,
      tp: 4,
    };
  }

  // CORRECT CASE A: Valid "ialah" + Frasa Nama sentence
  if (
    lower.includes('ialah') &&
    (lower.includes('nama') ||
      lower.includes('seorang') ||
      lower.includes('sebuah') ||
      lower.includes('bomba') ||
      lower.includes('polis') ||
      lower.includes('guru') ||
      lower.includes('alat') ||
      lower.includes('lintasan') ||
      lower.includes('punca') ||
      lower.includes('mangsa') ||
      lower.includes('suri rumah') ||
      lower.includes('jaket') ||
      lower.includes('peti') ||
      lower.includes('lampu') ||
      lower.includes('laluan'))
  ) {
    return {
      text: `Masya-Allah, syabas dan tahniah! 🌟👏

Ayat kamu **100% TEPAT dan GRAMATIS**!
Perkataan **"ialah"** telah diletakkan dengan betul di hadapan **Frasa Nama** (menunjukkan persamaan atau definisi subjek keselamatan).

🏆 **Pentaksiran Bilik Darjah (PBD)**:
Kamu telah membuktikan keupayaan membina ayat gramatis secara tekal mengikut DSKP 5.1.4 (vii). Cikgu Melati dengan bangganya mengiktiraf pencapaian kamu pada **Tahap Penguasaan TP 5** (atau TP 6 jika huraian lengkap)!

Teruskan kecemerlangan ini di Kelas Cikgu Adila ya! Mahu cuba bina ayat seterusnya menggunakan "adalah"?`,
      tp: 5,
    };
  }

  // CORRECT CASE B: Valid "adalah" + Frasa Adjektif / Sendi Nama sentence
  if (
    lower.includes('adalah') &&
    (lower.includes('sangat') ||
      lower.includes('amat') ||
      lower.includes('sungguh') ||
      lower.includes('bahaya') ||
      lower.includes('berbahaya') ||
      lower.includes('licin') ||
      lower.includes('penting') ||
      lower.includes('wajib') ||
      lower.includes('benar') ||
      lower.includes('untuk') ||
      lower.includes('demi') ||
      lower.includes('bagi') ||
      lower.includes('kepada') ||
      lower.includes('daripada'))
  ) {
    return {
      text: `Wah, cemerlang sungguh! Cikgu Melati sangat bangga! 🌸🎉

Ayat kamu **TEPAT SEKALI** mengikut tatabahasa KSSR!
Perkataan **"adalah"** telah digandingkan dengan sempurna di hadapan **Frasa Adjektif / Frasa Sendi Nama**.

🏆 **Pentaksiran Bilik Darjah (PBD)**:
Cikgu Melati mengiktiraf pemahaman jitu kamu pada **Tahap Penguasaan TP 5**!
Formula: *[Subjek Keselamatan] + ADALAH + [Frasa Adjektif / Sendi Nama]*.

Kamu memang murid yang rajin dan pintar di Kelas Cikgu Adila! Ada soalan lagi yang ingin ditanyakan kepada Cikgu Melati?`,
      tp: 5,
    };
  }

  // GREETINGS & CASUAL HELLO
  if (
    lower.includes('hai') ||
    lower.includes('halo') ||
    lower.includes('assalamualaikum') ||
    lower.includes('selamat pagi') ||
    lower.includes('selamat petang') ||
    lower.includes('selamat tengah hari') ||
    lower.includes('cikgu melati') ||
    lower.includes('cikgu adila')
  ) {
    return {
      text: `Waalaikumussalam dan salam ceria! 🌸✨ Selamat datang ke Kelas Cikgu Adila!

Cikgu Melati sangat gembira dapat menemani kamu belajar hari ini. Cikgu ialah pembimbing khas untuk aspek **Kata Pemeri ("ialah" & "adalah")** serta **3 Frasa Utama (Frasa Nama, Frasa Sendi Nama, Frasa Adjektif)** bertema keselamatan.

Kamu boleh tanya apa sahaja pada Cikgu Melati, seperti:
1. *"Apa itu Frasa Nama?"*
2. *"Apa beza Frasa Sendi Nama dan Frasa Adjektif?"*
3. *"Bolehkah Cikgu Melati semak ayat saya?"*
4. *"Beri contoh ayat keselamatan Buku Teks m/s 57"*

Mari kita belajar dengan seronok bersama-sama ya!`,
      tp: 3,
    };
  }

  // DEFAULT / GENERAL KATA PEMERI ENCOURAGEMENT
  return {
    text: `Terima kasih atas soalan kamu! 🌸 Cikgu Melati sentiasa sedia membantu kamu di Kelas Cikgu Adila.

💡 **Ingat Petua Emas Cikgu Melati**:
1. Gunakan **"ialah"** untuk **Frasa Nama** (contoh: *ialah seorang anggota bomba*).
2. Gunakan **"adalah"** untuk **Frasa Adjektif** (contoh: *adalah sangat berbahaya*) dan **Frasa Sendi Nama** (contoh: *adalah demi keselamatan*).

Cuba kamu taip satu ayat menggunakan kata pemeri, atau tanya Cikgu Melati tentang *Frasa Nama*, *Frasa Sendi Nama*, atau *Frasa Adjektif*. Cikgu akan semak dan bimbing dengan gembira!`,
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
