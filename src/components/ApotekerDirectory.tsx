import React from 'react';
import { ShieldCheck, Star, MessageSquare, GraduationCap, Award, Stethoscope, Sparkles } from 'lucide-react';
import { Pharmacist } from '../types';
import { PHARMACISTS_DATABASE } from '../data/pharmacists';

interface ApotekerDirectoryProps {
  onSelectPharmacist: (pharm: Pharmacist) => void;
}

export const ApotekerDirectory: React.FC<ApotekerDirectoryProps> = ({ onSelectPharmacist }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4EFE9] text-xs font-bold text-[#6E56A9] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0DBFCD]" />
            <span>Verifikasi Surat Izin Praktik Apoteker (SIPA)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101D34] tracking-tight">
            Tim Apoteker Pendamping Telefarmasi
          </h2>
          <p className="text-base sm:text-lg text-slate-800 font-medium mt-2 leading-relaxed">
            Konsultasikan keluhan obat Anda secara gratis dan langsung dengan tenaga kefarmasian profesional lulusan perguruan tinggi farmasi terkemuka di Indonesia.
          </p>
        </div>

        {/* Pharmacist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PHARMACISTS_DATABASE.map((pharm) => (
            <div
              key={pharm.id}
              className="rounded-3xl bg-[#E4EFE9]/50 border-2 border-slate-300/80 p-6 flex flex-col justify-between hover:border-[#0DBFCD] hover:shadow-xl transition-all"
            >
              <div>
                {/* Clean Vector Avatar with Status badge */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-[#6E56A9] via-[#883EA9] to-[#0DBFCD] flex items-center justify-center text-white font-extrabold text-xl shadow-md border-2 border-white">
                    {pharm.name.replace('Apt. ', '').split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border-2 border-white text-white ${
                      pharm.status === 'online' ? 'bg-[#15803D]' : 'bg-amber-600'
                    }`}
                  >
                    {pharm.status === 'online' ? 'Online' : 'Sibuk'}
                  </span>
                </div>

                <div className="text-center mb-3">
                  <h3 className="font-extrabold text-[#101D34] text-xl leading-snug">
                    {pharm.name}
                  </h3>
                  <p className="text-base font-extrabold text-[#6E56A9] mt-0.5">
                    {pharm.specialty}
                  </p>
                </div>

                {/* Badges / Metrics */}
                <div className="flex items-center justify-center gap-3 py-2.5 border-y border-slate-300/80 text-sm mb-4">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{pharm.rating}</span>
                  </div>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-900 font-bold">{pharm.consultationCount}+ Konseling</span>
                </div>

                {/* Alma Mater & SIPA */}
                <div className="space-y-2 text-sm text-slate-900 mb-4">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-[#0DBFCD] shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">{pharm.almaMater}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-[#6E56A9] shrink-0 mt-0.5" />
                    <span className="font-mono text-xs sm:text-sm text-slate-800 font-semibold">{pharm.sipa}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-900 leading-relaxed italic line-clamp-3 mb-5 font-semibold">
                  "{pharm.bio}"
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPharmacist(pharm)}
                className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-[#883EA9] to-[#B566C0] hover:from-[#6E56A9] hover:to-[#883EA9] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-[#77DBAA]" />
                <span>Mulai Konsultasi</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
