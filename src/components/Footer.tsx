import React from 'react';
import { Pill, ShieldCheck, Heart, PhoneCall, AlertCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'swamedikasi' | 'scan' | 'apoteker' | 'profil' | 'dagusibu') => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <footer className="bg-[#101D34] text-white pt-14 pb-10 border-t-4 border-[#6E56A9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0DBFCD] to-[#77DBAA] flex items-center justify-center">
                <Pill className="w-5 h-5 text-white transform -rotate-45" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                APO<span className="text-[#77DBAA]">MATE</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#83B3C7] max-w-sm leading-relaxed text-justify">
              Platform inovasi telefarmasi digital untuk mendukung gerakan swamedikasi aman dan rasional di Indonesia. Terintegrasi dengan apoteker berlisensi resmi SIPA dan berpedoman pada kaidah DAGUSIBU IAI.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#77DBAA]">
              <ShieldCheck className="w-4 h-4 text-[#77DBAA]" />
              <span className="font-semibold">Bekerjasama dengan Apoteker Ber-SIPA Aktif</span>
            </div>
          </div>

          {/* Navigasi Utama */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#77DBAA] uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs text-[#E4EFE9]/80 font-medium">
              <li>
                <button onClick={() => onNavigate('swamedikasi')} className="hover:text-white transition-colors cursor-pointer">
                  Alur 3 Langkah Swamedikasi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scan')} className="hover:text-white transition-colors cursor-pointer">
                  Scan Kemasan Kamera (OCR)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apoteker')} className="hover:text-white transition-colors cursor-pointer">
                  Daftar Apoteker Berlisensi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dagusibu')} className="hover:text-white transition-colors cursor-pointer">
                  Panduan DAGUSIBU Obat
                </button>
              </li>
            </ul>
          </div>

          {/* Edukasi & Regulasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#77DBAA] uppercase tracking-wider">
              Regulasi & Standar
            </h4>
            <ul className="space-y-2 text-xs text-[#E4EFE9]/80 font-medium">
              <li>Badan Pengawas Obat & Makanan (BPOM)</li>
              <li>Ikatan Apoteker Indonesia (IAI)</li>
              <li>GeMa CerMat Kemenkes RI</li>
              <li>Standar Pelayanan Kefarmasian No. 73/2016</li>
            </ul>
          </div>

          {/* Kontak & Darurat */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#B566C0] uppercase tracking-wider">
              Layanan Darurat
            </h4>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1.5">
              <p className="text-[#83B3C7] text-[11px]">Bila terjadi keracunan / reaksi anafilaksis:</p>
              <div className="flex items-center gap-1.5 font-bold text-red-400">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>SPGDT Kemenkes: 119</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#77DBAA]">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Halo Kemenkes: 1500-567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Medis Resmi */}
        <div className="py-6 border-b border-white/10 text-sm sm:text-base text-slate-100 leading-relaxed flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#B566C0] shrink-0 mt-0.5" />
          <span className="text-justify leading-relaxed">
            <strong className="text-white font-bold">Disclaimer Medis:</strong> Informasi dosis dan swamedikasi pada platform APOMATE ditujukan sebagai panduan edukasi awal untuk keluhan penyakit ringan. Bila gejala tidak kunjung membaik setelah maksimal 3 hari pemakaian obat, atau timbul reaksi alergi berat, segera periksakan diri ke dokter di fasilitas kesehatan terdekat.
          </span>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-200 gap-3 leading-relaxed">
          <p className="font-semibold text-white shrink-0">© {new Date().getFullYear()} APOMATE. Hanya Prototype.</p>
          <p className="flex items-center gap-1 text-slate-200 font-medium">
            <span className="text-justify leading-relaxed">Disclaimer: Hanya merupakan prototipe, segala kekurangan dan kesalahan dalam informasi maupun fitur masih dalam tahap pengembangan dan penyempurnaan</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
