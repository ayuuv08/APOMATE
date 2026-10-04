import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI with server-side key
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Telepharmacy Multi-Turn Chatbot with Search Grounding
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, patientContext, medicineContext, pharmacistName, pharmacistSipa } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!ai) {
      return res.status(503).json({ 
        error: 'Gemini API Key is not configured.',
        fallback: true 
      });
    }

    const patientDesc = patientContext ? `
Data Pasien:
- Nama: ${patientContext.fullName || 'Pasien'}
- Usia: ${patientContext.ageYears || '-'} tahun
- Berat Badan: ${patientContext.weightKg || '-'} kg
- Riwayat Alergi: ${(patientContext.allergies || []).join(', ') || 'Tidak ada'}
- Riwayat Maag/Penyakit: ${(patientContext.existingConditions || []).join(', ') || 'Tidak ada'}
- Keluhan: ${(patientContext.symptoms || []).join(', ') || '-'} (durasi: ${patientContext.symptomDurationDays || 1} hari)
- Catatan: ${patientContext.notes || '-'}
` : 'Data pasien umum.';

    const medDesc = medicineContext ? `
Obat yang sedang dikonsultasikan:
- Nama Obat: ${medicineContext.name} (${medicineContext.brandName || ''})
- Golongan BPOM: ${medicineContext.bpomClassification}
- Zat Aktif: ${medicineContext.activeIngredients}
- Indikasi: ${medicineContext.indication}
- Bentuk Sediaan: ${medicineContext.form}
- Dosis Standar: ${medicineContext.standardDosage}
` : 'Pertanyaan swamedikasi umum.';

    const systemInstruction = `Anda adalah Apoteker Klinis Terverifikasi SIPA di platform APOMATE (${pharmacistName || 'Apt. Savitri Swandewi, S.Farm.'}, SIPA: ${pharmacistSipa || '19980512/SIPA-31.74/2023/1042'}).
Peran Anda:
1. Memberikan konseling swamedikasi yang empatik, ilmiah, akurat, dan mudah dipahami masyarakat Indonesia.
2. Membantu menghitung dosis berdasarkan berat badan (mg/kgBB) jika pasien anak/pediatrik.
3. Memperingatkan interaksi obat, kontraindikasi alergi, dan efek samping secara transparan.
4. Menjelaskan aturan minum sebelum/sesudah makan dan panduan DAGUSIBU (Dapatkan, Gunakan, Simpan, Buang obat dengan benar).
5. Gunakan data Google Search grounding untuk menyajikan informasi terkini resmi BPOM RI / Kemenkes bila diperlukan.
6. Berikan red-flag peringatan jika pasien perlu segera dirujuk ke faskes/dokter (misal demam tinggi berulang, kejang, perdarahan lambung).

Konteks Pasien:
${patientDesc}

Konteks Obat:
${medDesc}
`;

    // Map conversation history
    const contents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Use gemini-3.5-flash with googleSearch tool
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const replyText = response.text || 'Maaf, saya tidak dapat merumuskan jawaban saat ini. Silakan ulangi pertanyaan Anda.';

    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks ? groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || 'Referensi Resmi Farmasi',
      uri: chunk.web?.uri || '',
    })).filter((s: any) => s.uri) : [];

    return res.json({
      reply: replyText,
      sources,
    });
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Gagal memproses pesan AI',
      fallback: true
    });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
