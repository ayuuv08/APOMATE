import React, { useState } from 'react';
import { Pill, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'swamedikasi' | 'scan' | 'apoteker' | 'profil' | 'dagusibu' | 'interaksi';
  onNavigate: (tab: 'home' | 'swamedikasi' | 'scan' | 'apoteker' | 'profil' | 'dagusibu' | 'interaksi') => void;
  onOpenConsultation: () => void;
  hasActivePatient: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenConsultation,
  hasActivePatient,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'swamedikasi', label: 'Swamedikasi' },
    { id: 'scan', label: 'Scan Obat' },
    { id: 'apoteker', label: 'Apoteker' },
    { id: 'dagusibu', label: 'Edukasi Dagusibu' },
    { id: 'profil', label: 'Profil Pasien' },
  ] as const;

  const handleLinkClick = (id: typeof currentTab) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#6E56A9] text-white shadow-md border-b border-[#883EA9]/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#77DBAA] rounded-xl px-1.5 py-1 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0DBFCD] to-[#77DBAA] flex items-center justify-center shadow-sm transform group-hover:scale-105 transition-transform">
            <Pill className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-baseline">
              <span className="text-white">APO</span>
              <span className="text-[#77DBAA]">MATE</span>
              <span className="w-2 h-2 rounded-full bg-[#0DBFCD] ml-1 inline-block animate-pulse" />
            </div>
            <p className="text-[10px] font-medium text-[#C2A0DD] -mt-1 hidden sm:block tracking-wide">
              Your "Apoteker Mate"
            </p>
          </div>
        </button>

        {/* Zone 2: Clean Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#883EA9] text-white shadow-inner font-bold'
                    : 'text-[#E4EFE9]/90 hover:text-white hover:bg-[#B566C0]/40'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-[#883EA9] focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#6E56A9] border-t border-[#883EA9] px-4 pt-3 pb-5 space-y-1.5 shadow-xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                currentTab === link.id
                  ? 'bg-[#883EA9] text-white'
                  : 'text-[#E4EFE9] hover:bg-[#B566C0]/30'
              }`}
            >
              <span>{link.label}</span>
              {currentTab === link.id && (
                <span className="w-2 h-2 rounded-full bg-[#77DBAA]" />
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
