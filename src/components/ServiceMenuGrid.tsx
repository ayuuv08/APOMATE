import React from 'react';
import { 
  Pill, 
  Camera, 
  MessageSquare, 
  ShieldAlert, 
  BookOpen, 
  ClipboardList 
} from 'lucide-react';

export interface ServiceMenuGridProps {
  onNavigateTab: (tab: 'swamedikasi' | 'scan' | 'apoteker' | 'dagusibu' | 'interaksi') => void;
  onOpenConsultation: () => void;
  onOpenProfile: () => void;
}

export const ServiceMenuGrid: React.FC<ServiceMenuGridProps> = ({
  onNavigateTab,
  onOpenConsultation,
  onOpenProfile,
}) => {
  const services = [
    {
      id: 'swamedikasi',
      title: 'Swamedikasi Mandiri',
      subtext: 'Skrining gejala & kalkulasi dosis personal',
      icon: Pill,
      cardGradient: 'bg-gradient-to-br from-[#0DBFCD] to-[#1EC5C2]',
      shadowColor: 'shadow-[#0DBFCD]/30 hover:shadow-[#0DBFCD]/45',
      textColor: 'text-white',
      subtextColor: 'text-white font-medium',
      iconContainer: 'bg-white/20 text-white border-white/30',
      onClick: () => onNavigateTab('swamedikasi'),
    },
    {
      id: 'scan',
      title: 'Scan Kemasan Obat',
      subtext: 'Pindai kemasan & cek golongan resmi BPOM',
      icon: Camera,
      cardGradient: 'bg-gradient-to-br from-[#5FD4B3] to-[#77DBAA]',
      shadowColor: 'shadow-[#5FD4B3]/35 hover:shadow-[#5FD4B3]/50',
      textColor: 'text-[#101D34]',
      subtextColor: 'text-[#101D34] font-semibold',
      iconContainer: 'bg-[#101D34]/15 text-[#101D34] border-[#101D34]/20',
      onClick: () => onNavigateTab('scan'),
    },
    {
      id: 'telefarmasi',
      title: 'Telefarmasi & Chat',
      subtext: 'Konsultasi langsung dengan apoteker SIPA',
      icon: MessageSquare,
      cardGradient: 'bg-gradient-to-br from-[#6E56A9] to-[#883EA9]',
      shadowColor: 'shadow-[#6E56A9]/30 hover:shadow-[#6E56A9]/45',
      textColor: 'text-white',
      subtextColor: 'text-white font-medium',
      iconContainer: 'bg-white/20 text-white border-white/30',
      onClick: () => onOpenConsultation(),
    },
    {
      id: 'interaksi',
      title: 'Cek Interaksi Obat',
      subtext: 'Skrining keamanan kombinasi obat mandiri',
      icon: ShieldAlert,
      cardGradient: 'bg-gradient-to-br from-[#883EA9] to-[#B566C0]',
      shadowColor: 'shadow-[#883EA9]/30 hover:shadow-[#883EA9]/45',
      textColor: 'text-white',
      subtextColor: 'text-white font-medium',
      iconContainer: 'bg-white/20 text-white border-white/30',
      onClick: () => onNavigateTab('interaksi'),
    },
    {
      id: 'dagusibu',
      title: 'Direktori Obat & Dagusibu',
      subtext: 'Panduan penggunaan & penyimpanan obat aman',
      icon: BookOpen,
      cardGradient: 'bg-gradient-to-br from-[#101D34] to-[#1E3A8A]',
      shadowColor: 'shadow-[#101D34]/35 hover:shadow-[#101D34]/50',
      textColor: 'text-white',
      subtextColor: 'text-white font-medium',
      iconContainer: 'bg-white/20 text-white border-white/30',
      onClick: () => onNavigateTab('dagusibu'),
    },
    {
      id: 'profil',
      title: 'Riwayat & Profil Pasien',
      subtext: 'Pantau obat rutin & grafik tren kesehatan',
      icon: ClipboardList,
      cardGradient: 'bg-gradient-to-br from-[#6E56A9] to-[#C2A0DD]',
      shadowColor: 'shadow-[#6E56A9]/30 hover:shadow-[#6E56A9]/45',
      textColor: 'text-white',
      subtextColor: 'text-white font-medium',
      iconContainer: 'bg-white/20 text-white border-white/30',
      onClick: () => onOpenProfile(),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header section with brand typography */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101D34] tracking-tight">
            Menu Layanan Kefarmasian
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-800 font-semibold hidden sm:block">
          Pilih modul layanan untuk berpindah halaman secara langsung
        </p>
      </div>

      {/* Grid Layout: 2 columns on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {services.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={`w-full text-left p-4 sm:p-5 rounded-2xl ${item.cardGradient} ${item.textColor} border border-white/25 shadow-lg ${item.shadowColor} hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer group flex flex-col justify-between min-h-[165px] sm:min-h-[185px] select-none relative overflow-hidden`}
            >
              {/* Subtle light sheen highlight on top edge */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/40 pointer-events-none" />

              {/* Translucent icon container with crisp vector icon inside */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${item.iconContainer} backdrop-blur-sm flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-3 shrink-0 border`}
              >
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* High-contrast bold menu title and subtext */}
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-extrabold leading-snug drop-shadow-xs">
                  {item.title}
                </h3>
                <p className={`text-xs sm:text-sm ${item.subtextColor} leading-relaxed line-clamp-2`}>
                  {item.subtext}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
