import React from 'react';
import { PageId } from '../types';
import { useAdmin } from '../context/AdminContext';
import { Phone, ArrowRight, Sparkles, Moon, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

interface HeroProps {
  setCurrentPage: (page: PageId) => void;
  onOpenInquiry: (serviceId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setCurrentPage, onOpenInquiry }) => {
  const { companyInfo } = useAdmin();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a201a] via-[#0f2e26] to-[#0a201a] text-white py-16 sm:py-24 lg:py-28">
      {/* Background Islamic Geometric and Glow Accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DCB473_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#DCB473]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#185343]/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Arabic Dua Banner */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#DCB473]/15 border border-[#DCB473]/40 text-[#DCB473] mb-6 shadow-sm">
          <Moon className="w-4 h-4" />
          <span className="font-arabic text-lg sm:text-2xl tracking-wide font-medium">
            {companyInfo.taglineAr}
          </span>
          <Sparkles className="w-4 h-4 text-[#DCB473]" />
        </div>

        {/* Main Bengali Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          মুত্তাকী <span className="text-[#DCB473]">হজ্ব ও কন্সাল্টেন্সি</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-stone-200 leading-relaxed mb-8">
          {companyInfo.slogan}। অভিজ্ঞ আলেম ও মোয়াল্লিমদের দিকনির্দেশনায় হজ্ব, ওমরাহ, ভিসা ও বৈশ্বিক ভ্রমণ সেবায় আপনার সবচেয়ে বিশ্বস্ত প্রতিষ্ঠান।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-14">
          <button
            onClick={() => onOpenInquiry('hajj-umrah')}
            className="px-7 py-3.5 bg-[#DCB473] hover:bg-[#cba05f] text-[#0f2922] font-bold text-base rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span>প্যাকেজ অনুসন্ধান করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setCurrentPage('services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium text-base rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
          >
            সকল সেবাসমূহ দেখুন
          </button>

          <a
            href={`tel:${companyInfo.phone1}`}
            className="px-6 py-3.5 bg-emerald-800/80 hover:bg-emerald-700 text-white font-medium text-base rounded-full border border-emerald-500/30 transition-all duration-200 flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#DCB473]" />
            <span>সরাসরি কথা বলুন</span>
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-left">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
            <ShieldCheck className="w-7 h-7 text-[#DCB473] shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">১০০% নির্ভরযোগ্য</h4>
              <p className="text-xs text-stone-300">নিরাপদ ও নির্ভুল প্রসেসিং</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
            <HeartHandshake className="w-7 h-7 text-[#DCB473] shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">অভিজ্ঞ মোয়াল্লিম</h4>
              <p className="text-xs text-stone-300">সরাসরি সার্বক্ষণিক সহায়তা</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
            <Award className="w-7 h-7 text-[#DCB473] shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">প্রিমিয়াম হোটেল</h4>
              <p className="text-xs text-stone-300">হেরেমের নিকটে আবাসন</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
            <Phone className="w-7 h-7 text-[#DCB473] shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white">২৪/৭ সেবা</h4>
              <p className="text-xs text-stone-300">যেকোনো তথ্যে পরামর্শ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
