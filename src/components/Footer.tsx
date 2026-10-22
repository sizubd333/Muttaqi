import React from 'react';
import { PageId } from '../types';
import { useAdmin } from '../context/AdminContext';
import { Phone, Mail, MapPin, Compass, Heart, ArrowUp, Lock, ShieldCheck } from 'lucide-react';
import { FacebookIcon, YoutubeIcon } from './BrandIcons';

interface FooterProps {
  setCurrentPage: (page: PageId) => void;
  onOpenLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenLogin }) => {
  const { companyInfo, isAdminLoggedIn } = useAdmin();

  const handleNavClick = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1e19] text-stone-300 pt-16 pb-8 border-t border-[#DCB473]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#DCB473] flex items-center justify-center text-[#0f2922]">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                মুত্তাকী <span className="text-[#DCB473]">হজ্ব ও কন্সাল্টেন্সি</span>
              </span>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              {companyInfo.slogan}। আপনার আধ্যাত্মিক যাত্রাকে সহজ, নিরাপদ ও স্মরণীয় করে তোলাই আমাদের সর্বোচ্চ অঙ্গীকার।
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-[#DCB473] font-semibold block mb-2">
                যোগাযোগের তথ্য
              </span>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={`tel:${companyInfo.phone1}`}
                    className="flex items-start gap-2.5 hover:text-[#DCB473] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#DCB473] mt-0.5 shrink-0" />
                    <span>{companyInfo.phone1Display} / {companyInfo.phone2Display}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="flex items-start gap-2.5 hover:text-[#DCB473] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#DCB473] mt-0.5 shrink-0" />
                    <span>{companyInfo.email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-stone-300">
                  <MapPin className="w-4 h-4 text-[#DCB473] mt-0.5 shrink-0" />
                  <span>{companyInfo.address}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 border-l-2 border-[#DCB473] pl-3">
              দ্রুত লিংক
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="hover:text-[#DCB473] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-[#DCB473]">›</span> হোম পেইজ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('services')}
                  className="hover:text-[#DCB473] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-[#DCB473]">›</span> আমাদের সেবাসমূহ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('gallery')}
                  className="hover:text-[#DCB473] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-[#DCB473]">›</span> ফটো গ্যালারি
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-[#DCB473] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-[#DCB473]">›</span> আমাদের সম্পর্কে ও পরিচালনা পর্ষদ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-[#DCB473] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-[#DCB473]">›</span> যোগাযোগ ও ঠিকানা
                </button>
              </li>
              {isAdminLoggedIn ? (
                <li>
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="text-[#DCB473] font-bold hover:underline flex items-center gap-2 cursor-pointer pt-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>এডমিন কন্ট্রোল সেন্টার</span>
                  </button>
                </li>
              ) : onOpenLogin ? (
                <li>
                  <button
                    onClick={onOpenLogin}
                    className="text-stone-400 hover:text-[#DCB473] flex items-center gap-2 cursor-pointer pt-1 text-xs"
                  >
                    <Lock className="w-3 h-3 text-[#DCB473]" />
                    <span>এডমিন লগইন</span>
                  </button>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Social & Resources */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 border-l-2 border-[#DCB473] pl-3">
              দরকারী লিংক
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={companyInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#DCB473] transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-400" />
                  <span>ফেসবুক পেজ (মুত্তাকী কাফেলা)</span>
                </a>
              </li>
              <li>
                <a
                  href={companyInfo.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#DCB473] transition-colors"
                >
                  <YoutubeIcon className="w-4 h-4 text-red-400" />
                  <span>ইউটিউব চ্যানেল (@muttaqi.kafela)</span>
                </a>
              </li>
              <li>
                <a
                  href={companyInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন</span>
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[#DCB473] font-semibold block mb-1">অফিস সময়সূচী:</span>
              <p className="text-stone-300">শনিবার – বৃহস্পতিবার: সকাল ৯:০০ – রাত ৮:০০</p>
              <p className="text-stone-400">শুক্রবার: জুম্মার পর থেকে সন্ধ্যা পর্যন্ত</p>
            </div>
          </div>

          {/* Alhamdulillah Quote */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4 border-l-2 border-[#DCB473] pl-3">
              আলহামদুলিল্লাহ
            </h3>
            <div className="bg-[#123129] p-4 rounded-xl border border-[#DCB473]/20 relative">
              <p className="text-sm italic text-stone-200 leading-relaxed font-serif">
                &ldquo;হজ্ব শুধু মাইল দূরত্বের যাত্রা নয়; এটি হৃদয়ের যাত্রা, বিশ্বাসের যাত্রা এবং আত্মার রূপান্তর।&rdquo;
              </p>
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-[#DCB473] font-medium text-right">
                — মুত্তাকী কাফেলা পরিবার
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-stone-400">শীর্ষে ফিরে যান</span>
              <button
                onClick={scrollToTop}
                className="w-8 h-8 rounded-full bg-[#DCB473] text-[#0f2922] flex items-center justify-center hover:bg-[#c99f5e] transition-colors cursor-pointer"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright info */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} {companyInfo.nameEn}. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>পবিত্রতা ও বিশ্বস্ততার সাথে পরিচালিত</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline mx-0.5" />
            <span>বাংলাদেশ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
