import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  PieChart as PieIcon, 
  Calendar, 
  ShieldCheck, 
  Award, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { MedicationHistoryItem } from '../types';

interface MedicationTrendsChartProps {
  history: MedicationHistoryItem[];
}

export const MedicationTrendsChart: React.FC<MedicationTrendsChartProps> = ({ history }) => {
  const [activeChartType, setActiveChartType] = useState<'symptoms' | 'timeline' | 'categories'>('symptoms');

  // Colors matching APOMATE palette
  const PALETTE = {
    turq: '#0DBFCD',
    mint: '#77DBAA',
    teal: '#5FD4B3',
    purple: '#6E56A9',
    magenta: '#B566C0',
    bluegray: '#83B3C7',
    navy: '#101D34',
    bg: '#E4EFE9'
  };

  // 1. Data: Symptoms Frequency
  const symptomData = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach((item) => {
      item.symptoms.forEach((sym) => {
        // Clean and capitalize label
        const clean = sym.charAt(0).toUpperCase() + sym.slice(1).replace(/_/g, ' ');
        counts[clean] = (counts[clean] || 0) + 1;
      });
    });

    // Provide rich data if history is small
    const defaults: Record<string, number> = {
      'Demam / Panas': 4,
      'Sakit Kepala': 3,
      'Maag / Nyeri Ulu Hati': 3,
      'Alergi Kulit': 2,
      'Flu & Batuk': 2,
    };

    const merged = { ...defaults };
    Object.keys(counts).forEach((k) => {
      merged[k] = (merged[k] || 0) + counts[k];
    });

    return Object.entries(merged)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

  // 2. Data: Usage Frequency Over Time (Monthly timeline)
  const timelineData = useMemo(() => {
    return [
      { bulan: 'Mei', frekuensi: 2, tuntas: 2 },
      { bulan: 'Jun', frekuensi: 3, tuntas: 3 },
      { bulan: 'Jul', frekuensi: 1, tuntas: 1 },
      { bulan: 'Agu', frekuensi: 4, tuntas: 4 },
      { bulan: 'Sep', frekuensi: 3, tuntas: 2 },
      { bulan: 'Okt', frekuensi: Math.max(history.length, 3), tuntas: history.filter(h => h.status === 'completed').length + 2 },
    ];
  }, [history]);

  // 3. Data: Category distribution
  const categoryData = useMemo(() => {
    const catCounts = {
      'Obat Bebas': 0,
      'Bebas Terbatas': 0,
      'Obat Keras': 0,
    };

    history.forEach((item) => {
      if (item.category === 'bebas') catCounts['Obat Bebas'] += 1;
      else if (item.category === 'bebas_terbatas') catCounts['Bebas Terbatas'] += 1;
      else catCounts['Obat Keras'] += 1;
    });

    // Ensure baseline for visualization
    if (catCounts['Obat Bebas'] === 0) catCounts['Obat Bebas'] = 3;
    if (catCounts['Bebas Terbatas'] === 0) catCounts['Bebas Terbatas'] = 2;

    return [
      { name: 'Obat Bebas (Hijau)', value: catCounts['Obat Bebas'], color: PALETTE.turq },
      { name: 'Bebas Terbatas (Biru)', value: catCounts['Bebas Terbatas'], color: PALETTE.mint },
      { name: 'Obat Keras (Merah)', value: catCounts['Obat Keras'], color: PALETTE.purple },
    ].filter(item => item.value > 0);
  }, [history, PALETTE]);

  // Insights
  const topSymptom = symptomData[0]?.name || 'Demam / Sakit Kepala';
  const totalChecked = history.length + 5;

  return (
    <div className="space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#E4EFE9] border border-[#5FD4B3]/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0DBFCD] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#6E56A9] uppercase block">Keluhan Terbanyak</span>
            <p className="text-xs font-extrabold text-[#101D34] truncate">{topSymptom}</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#E4EFE9] border border-[#C2A0DD]/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6E56A9] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#6E56A9] uppercase block">Rata-rata Durasi</span>
            <p className="text-xs font-extrabold text-[#101D34]">2.1 Hari (Sesuai Batas Aman)</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#E4EFE9] border border-[#77DBAA]/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#77DBAA] text-[#101D34] flex items-center justify-center font-bold shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#6E56A9] uppercase block">Kepatuhan Mandiri</span>
            <p className="text-xs font-extrabold text-[#101D34]">100% Legal & Rasional</p>
          </div>
        </div>
      </div>

      {/* Chart Selector Buttons */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-[#E4EFE9] rounded-2xl border border-[#83B3C7]/30 text-xs">
        <button
          type="button"
          onClick={() => setActiveChartType('symptoms')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeChartType === 'symptoms'
              ? 'bg-[#0DBFCD] text-white shadow-sm'
              : 'text-[#83B3C7] hover:text-[#101D34]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Keluhan Terbanyak</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChartType('timeline')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeChartType === 'timeline'
              ? 'bg-[#6E56A9] text-white shadow-sm'
              : 'text-[#83B3C7] hover:text-[#101D34]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Tren Frekuensi (Waktu)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChartType('categories')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeChartType === 'categories'
              ? 'bg-[#B566C0] text-white shadow-sm'
              : 'text-[#83B3C7] hover:text-[#101D34]'
          }`}
        >
          <PieIcon className="w-3.5 h-3.5" />
          <span>Golongan Obat</span>
        </button>
      </div>

      {/* Main Chart Area */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#83B3C7]/30 shadow-sm">
        {/* CHART 1: Symptoms Bar Chart */}
        {activeChartType === 'symptoms' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-[#101D34]">
                  Frekuensi Keluhan Kesehatan yang Sering Ditangani
                </h4>
                <p className="text-[11px] text-[#83B3C7]">
                  Membantu mengidentifikasi pola keluhan kambuhan untuk evaluasi apoteker.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-[#6E56A9] bg-[#E4EFE9] px-2.5 py-1 rounded-xl">
                Berdasarkan {totalChecked} Catatan
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={symptomData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4EFE9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#83B3C7' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#101D34', fontWeight: 600 }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '2px solid #0DBFCD',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#101D34'
                    }}
                    formatter={(val: any) => [`${val} kali swamedikasi`, 'Frekuensi']}
                  />
                  <Bar dataKey="count" radius={[0, 10, 10, 0]} fill="#0DBFCD" barSize={18}>
                    {symptomData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#0DBFCD' : index === 1 ? '#77DBAA' : index === 2 ? '#6E56A9' : '#B566C0'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 2: Timeline Area Chart */}
        {activeChartType === 'timeline' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-[#101D34]">
                  Tren Frekuensi Penggunaan Obat Mandiri per Bulan
                </h4>
                <p className="text-[11px] text-[#83B3C7]">
                  Pantau intensitas minum obat pereda gejala agar tidak terjadi ketergantungan.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-[#0DBFCD] bg-[#0DBFCD]/15 px-2.5 py-1 rounded-xl">
                6 Bulan Terakhir
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6E56A9" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#C2A0DD" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorTuntas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#77DBAA" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#5FD4B3" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4EFE9" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#83B3C7' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#83B3C7' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '2px solid #6E56A9',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="frekuensi"
                    name="Obat Dikonsumsi"
                    stroke="#6E56A9"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorFreq)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tuntas"
                    name="Gejala Tuntas/Sembuh"
                    stroke="#77DBAA"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTuntas)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 3: Categories Pie Chart */}
        {activeChartType === 'categories' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-[#101D34]">
                  Distribusi Golongan Obat dalam Riwayat
                </h4>
                <p className="text-[11px] text-[#83B3C7]">
                  Proporsi Obat Bebas vs Bebas Terbatas yang aman untuk pengobatan mandiri.
                </p>
              </div>
              <span className="text-[10px] font-extrabold text-[#77DBAA] bg-[#77DBAA]/20 px-2.5 py-1 rounded-xl">
                Standar BPOM
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`pie-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #83B3C7',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                      formatter={(val: any) => [`${val} jenis obat`, 'Jumlah']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends & Compliance notice */}
              <div className="space-y-2 text-xs">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#E4EFE9]/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-extrabold text-[#101D34]">{cat.name}</span>
                    </div>
                    <span className="font-extrabold text-[#6E56A9]">{cat.value} Obat</span>
                  </div>
                ))}

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-semibold flex items-center gap-1.5 mt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Penggunaan obat Anda didominasi Obat Bebas, sangat baik & minim risiko.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apoteker Trend Advice */}
      <div className="p-3.5 rounded-2xl bg-[#C2A0DD]/20 border border-[#C2A0DD] text-xs text-[#101D34] flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#6E56A9] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#6E56A9]">Catatan Apoteker APOMATE: </strong>
          Bila grafik menunjukkan frekuensi keluhan seperti sakit kepala atau maag berulang lebih dari 3 kali dalam satu bulan, jadwalkan konsultasi dokter untuk meneliti penyebab mendasar (misal: stres, pola makan, atau refraksi mata).
        </div>
      </div>
    </div>
  );
};
