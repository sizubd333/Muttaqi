import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  PageId,
  ServiceItem,
  TeamMember,
  GalleryItem,
  PrayerTime,
  InquiryItem,
  ReviewItem
} from '../types';
import {
  Settings,
  Clock,
  Briefcase,
  Image as ImageIcon,
  Users,
  BarChart3,
  Inbox,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
  MessageSquareQuote,
  CheckCheck,
  Compass,
  BadgePercent,
  Database
} from 'lucide-react';
import { AdminHajiRegistrations } from '../components/AdminHajiRegistrations';
import { AdminPricingManager } from '../components/AdminPricingManager';
import { AdminSupabaseManager } from '../components/AdminSupabaseManager';

interface AdminDashboardProps {
  setCurrentPage: (page: PageId) => void;
}

type TabType =
  | 'approvals'
  | 'haji-registrations'
  | 'pricing'
  | 'supabase'
  | 'general'
  | 'prayers'
  | 'services'
  | 'gallery'
  | 'team'
  | 'stats'
  | 'inquiries'
  | 'reviews';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentPage }) => {
  const {
    isAdminLoggedIn,
    logout,
    companyInfo,
    updateCompanyInfo,
    prayerSchedule,
    updatePrayerTimes,
    services,
    deleteService,
    toggleServiceApproval,
    teamMembers,
    deleteTeamMember,
    toggleTeamApproval,
    galleryItems,
    deleteGalleryItem,
    toggleGalleryApproval,
    stats,
    updateStats,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    contactMessages,
    deleteMessage,
    reviews,
    deleteReview,
    toggleReviewApproval,
    openServiceModal,
    openGalleryModal,
    openTeamModal,
    openReviewModal,
    openInquiryModal,
    requestConfirm,
    showToast,
    supabaseStatus,
    resetToDefaults
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<TabType>('approvals');

  // General Settings Form state
  const [generalForm, setGeneralForm] = useState(companyInfo);

  // Prayers Form state
  const [prayersForm, setPrayersForm] = useState<PrayerTime[]>(prayerSchedule);

  // Stats Form state
  const [statsForm, setStatsForm] = useState(stats);

  // Haji registrations
  const hajiRegistrations = inquiries.filter(
    (i) => i.registrationType === 'haji' || i.serviceId === 'haji-full-registration'
  );
  const pendingHajiCount = hajiRegistrations.filter((h) => h.status === 'pending').length;

  // Pending counts for badge
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending').length;
  const pendingReviewsCount = reviews.filter((r) => !r.isApproved).length;
  const unapprovedGalleryCount = galleryItems.filter((g) => g.isApproved === false).length;
  const unapprovedServicesCount = services.filter((s) => s.isApproved === false).length;
  const unapprovedTeamCount = teamMembers.filter((t) => t.isApproved === false).length;
  const totalPendingCount =
    pendingInquiriesCount +
    pendingReviewsCount +
    unapprovedGalleryCount +
    unapprovedServicesCount +
    unapprovedTeamCount;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(generalForm);
  };

  const handleSavePrayers = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrayerTimes(prayersForm);
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateStats(statsForm);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-xl text-center border border-stone-200">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">প্রবেশাধিকার সংরক্ষিত</h2>
          <p className="text-sm text-stone-600 mb-6">
            এই ড্যাশবোর্ডটি অ্যাক্সেস করার জন্য আপনাকে এডমিন হিসেবে লগইন করতে হবে।
          </p>
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full py-2.5 bg-[#0f2922] text-[#DCB473] font-semibold rounded-xl"
          >
            হোম পেইজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-800 pb-20">
      {/* Admin Header Bar */}
      <div className="bg-[#0b1f1a] text-white border-b border-[#DCB473]/30 sticky top-10 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCB473] text-[#0f2922] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">মুত্তাকী এডমিন কন্ট্রোল সেন্টার</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>সম্পূর্ণ নিয়ন্ত্রণ সক্রিয়</span>
                </span>
              </div>
              <p className="text-xs text-stone-300">
                এডমিন আইডি: <span className="font-mono text-[#DCB473]">muttaqi.kafela@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('supabase')}
              className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-400/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Supabase ক্লাউড ডাটাবেজ স্ট্যাটাস ও সেটআপ"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Supabase:</span>
              <span className="flex items-center gap-1.5 font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{supabaseStatus.isConnected ? 'সংযুক্ত' : 'কানেক্টেড'}</span>
              </span>
            </button>

            <button
              onClick={() => {
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ওয়েবসাইটে দেখুন</span>
            </button>

            <button
              onClick={() => {
                logout();
                setCurrentPage('home');
              }}
              className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-xs border border-stone-200">
          {[
            {
              id: 'approvals',
              label: `অনুমোদন কেন্দ্র (${totalPendingCount})`,
              icon: ShieldCheck,
              highlight: totalPendingCount > 0
            },
            {
              id: 'haji-registrations',
              label: `হাজী নিবন্ধন (${hajiRegistrations.length})`,
              icon: Compass,
              highlight: pendingHajiCount > 0
            },
            {
              id: 'pricing',
              label: 'মূল্য নির্ধারণ (প্যাকেজ, রুম, বিমান, খরচ)',
              icon: BadgePercent
            },
            {
              id: 'supabase',
              label: 'Supabase ডাটাবেজ',
              icon: Database,
              highlight: true
            },
            { id: 'services', label: `সেবাসমূহ (${services.length})`, icon: Briefcase },
            { id: 'gallery', label: `গ্যালারি (${galleryItems.length})`, icon: ImageIcon },
            { id: 'team', label: `পরিচালনা পর্ষদ (${teamMembers.length})`, icon: Users },
            {
              id: 'inquiries',
              label: `বুকিং ও বার্তা (${inquiries.length + contactMessages.length})`,
              icon: Inbox
            },
            { id: 'reviews', label: `মতামত ও রিভিউ (${reviews.length})`, icon: MessageSquareQuote },
            { id: 'prayers', label: 'নামাজের সময়', icon: Clock },
            { id: 'stats', label: 'পরিসংখ্যান', icon: BarChart3 },
            { id: 'general', label: 'সাধারণ সেটিংস', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#0f2922] text-[#DCB473] shadow-md'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                } ${tab.highlight && !isActive ? 'border border-amber-400 bg-amber-50/60 text-amber-900' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* TAB 0: APPROVAL CENTER (অনুমোদন কেন্দ্র)                 */}
        {/* ======================================================== */}
        {activeTab === 'approvals' && (
          <div className="space-y-8">
            {/* Summary Banner */}
            <div className="bg-gradient-to-r from-[#0f2922] to-[#164438] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#DCB473]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#DCB473] font-bold block mb-1">
                  কেন্দ্রীয় নিয়ন্ত্রণ
                </span>
                <h2 className="text-2xl font-bold">সকল ডাটা অনুমোদন ও নিয়ন্ত্রণ কেন্দ্র</h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                  এখানে আপনি বুকিং অনুরোধ, রিভিউ, নতুন সেবা, গ্যালারি ছবি ও টিম মেম্বার অনুমোদন, সম্পাদন অথবা মুছে ফেলতে পারবেন।
                </p>
              </div>

              <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/20 text-center shrink-0">
                <span className="block text-2xl font-extrabold text-[#DCB473]">{totalPendingCount}</span>
                <span className="text-[11px] text-stone-200">অপেক্ষমাণ আইটেম</span>
              </div>
            </div>

            {/* Quick Haji Registration Alert Banner in Approvals */}
            {pendingHajiCount > 0 && (
              <div className="p-4 bg-gradient-to-r from-emerald-950 to-[#0f2922] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border-2 border-[#DCB473]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DCB473] text-[#0f2922] flex items-center justify-center font-bold shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#DCB473]">
                      {pendingHajiCount} টি নতুন হাজী প্রাক-নিবন্ধন আবেদন অনুমোদনের অপেক্ষায়!
                    </h4>
                    <p className="text-xs text-stone-200">
                      আবেদনকারীদের ছবি, পাসপোর্ট ও NID যাচাইপূর্বক এক ক্লিকে অনুমোদন, এডিট বা ডিলিট করুন।
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('haji-registrations')}
                  className="px-4 py-2 bg-[#DCB473] hover:bg-[#c99f5e] text-[#0f2922] font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  <span>হাজী নিবন্ধন প্যানেলে যান</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Pending Inquiries Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-lg text-[#0f2922] flex items-center gap-2">
                  <span>অনুমোদনের অপেক্ষায় বুকিং ও অনুসন্ধানসমূহ</span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {pendingInquiriesCount}
                  </span>
                </h3>
              </div>

              {inquiries.filter((i) => i.status === 'pending').length === 0 ? (
                <p className="text-xs text-stone-500 py-3">বর্তমানে কোনো বুকিং অনুরোধ অনুমোদনের অপেক্ষায় নেই।</p>
              ) : (
                <div className="space-y-3">
                  {inquiries
                    .filter((i) => i.status === 'pending')
                    .map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900">{inq.name}</span>
                            <span className="font-mono text-xs font-bold text-[#0f2922] bg-white px-2 py-0.5 rounded-md border">
                              {inq.phone}
                            </span>
                            <span className="text-xs text-stone-400">({inq.date})</span>
                          </div>
                          <p className="text-xs text-stone-700">
                            <strong>সেবা:</strong> {inq.serviceName} | <strong>যাত্রী:</strong> {inq.travelers}
                          </p>
                          {inq.message && (
                            <p className="text-xs text-stone-600 bg-white p-2 rounded-lg border border-amber-200 max-w-xl">
                              &ldquo;{inq.message}&rdquo;
                            </p>
                          )}
                          {inq.adminNotes && (
                            <p className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                              <strong>এডমিন নোট:</strong> {inq.adminNotes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              updateInquiryStatus(inq.id, 'approved');
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন করুন</span>
                          </button>
                          <button
                            onClick={() => openInquiryModal(inq)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>সম্পাদন</span>
                          </button>
                          <button
                            onClick={() => {
                              requestConfirm({
                                title: 'বুকিং মুছে ফেলা',
                                message: `আপনি কি "${inq.name}" এর বুকিং অনুরোধটি মুছে ফেলতে চান?`,
                                confirmText: 'হ্যাঁ, মুছে ফেলুন',
                                onConfirm: () => deleteInquiry(inq.id)
                              });
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Pending Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-lg text-[#0f2922] flex items-center gap-2">
                  <span>অনুমোদনের অপেক্ষায় গ্রাহক মতামত / রিভিউ</span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {pendingReviewsCount}
                  </span>
                </h3>
              </div>

              {reviews.filter((r) => !r.isApproved).length === 0 ? (
                <p className="text-xs text-stone-500 py-3">বর্তমানে কোনো রিভিউ অনুমোদনের অপেক্ষায় নেই।</p>
              ) : (
                <div className="space-y-3">
                  {reviews
                    .filter((r) => !r.isApproved)
                    .map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900">{rev.name}</span>
                            <span className="text-xs text-stone-500">({rev.location})</span>
                            <span className="text-xs text-amber-600 font-bold flex items-center">
                              ★ {rev.rating}/৫
                            </span>
                          </div>
                          <p className="text-xs text-stone-600">
                            <strong>প্যাকেজ:</strong> {rev.packageTaken}
                          </p>
                          <p className="text-xs text-stone-700 bg-white p-2 rounded-lg border border-amber-200 max-w-xl">
                            &ldquo;{rev.comment}&rdquo;
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              toggleReviewApproval(rev.id);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন ও লাইভ করুন</span>
                          </button>
                          <button
                            onClick={() => openReviewModal(rev)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>সম্পাদন</span>
                          </button>
                          <button
                            onClick={() => {
                              requestConfirm({
                                title: 'রিভিউ মুছে ফেলা',
                                message: `আপনি কি "${rev.name}" এর রিভিউটি মুছে ফেলতে চান?`,
                                confirmText: 'হ্যাঁ, মুছে ফেলুন',
                                onConfirm: () => deleteReview(rev.id)
                              });
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl cursor-pointer"
                            title="মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Unapproved / Hidden Services & Gallery Images */}
            {(unapprovedGalleryCount > 0 || unapprovedServicesCount > 0 || unapprovedTeamCount > 0) && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-[#0f2922]">
                  অন্যান্য ড্রাফট / লুকানো আইটেম
                </h3>

                {unapprovedServicesCount > 0 && (
                  <div className="p-4 bg-stone-50 rounded-2xl border space-y-2">
                    <span className="text-xs font-bold text-stone-700">ড্রাফট সেবাসমূহ:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {services
                        .filter((s) => s.isApproved === false)
                        .map((s) => (
                          <div
                            key={s.id}
                            className="p-3 bg-white border rounded-xl text-xs flex items-center justify-between gap-2 shadow-2xs"
                          >
                            <span className="font-semibold text-stone-900">{s.title}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => toggleServiceApproval(s.id)}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                অনুমোদন
                              </button>
                              <button
                                onClick={() => openServiceModal(s)}
                                className="p-1 bg-stone-100 text-stone-700 rounded-lg cursor-pointer"
                                title="সম্পাদন"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  requestConfirm({
                                    title: 'সেবা মুছে ফেলা',
                                    message: `আপনি কি "${s.title}" সেবাটি মুছে ফেলতে চান?`,
                                    confirmText: 'হ্যাঁ, মুছে ফেলুন',
                                    onConfirm: () => deleteService(s.id)
                                  });
                                }}
                                className="p-1 bg-rose-50 text-rose-600 rounded-lg cursor-pointer"
                                title="মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {unapprovedGalleryCount > 0 && (
                  <div className="p-4 bg-stone-50 rounded-2xl border space-y-2">
                    <span className="text-xs font-bold text-stone-700">ড্রাফট গ্যালারি ছবি:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {galleryItems
                        .filter((g) => g.isApproved === false)
                        .map((g) => (
                          <div
                            key={g.id}
                            className="p-3 bg-white border rounded-xl text-xs flex items-center justify-between gap-2 shadow-2xs"
                          >
                            <div className="flex items-center gap-2">
                              <img src={g.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                              <span className="font-semibold text-stone-900 line-clamp-1">{g.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => toggleGalleryApproval(g.id)}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                অনুমোদন
                              </button>
                              <button
                                onClick={() => openGalleryModal(g)}
                                className="p-1 bg-stone-100 text-stone-700 rounded-lg cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  requestConfirm({
                                    title: 'ছবি মুছে ফেলা',
                                    message: `আপনি কি "${g.title}" ছবিটি মুছে ফেলতে চান?`,
                                    confirmText: 'হ্যাঁ, মুছে ফেলুন',
                                    onConfirm: () => deleteGalleryItem(g.id)
                                  });
                                }}
                                className="p-1 bg-rose-50 text-rose-600 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: HAJI REGISTRATIONS MANAGEMENT                     */}
        {/* ======================================================== */}
        {activeTab === 'haji-registrations' && (
          <AdminHajiRegistrations />
        )}

        {/* ======================================================== */}
        {/* TAB: PRICING MANAGEMENT (Packages, Rooms, Flights, Etc.) */}
        {/* ======================================================== */}
        {activeTab === 'pricing' && (
          <AdminPricingManager />
        )}

        {/* ======================================================== */}
        {/* TAB: SUPABASE CLOUD DATABASE STORAGE                     */}
        {/* ======================================================== */}
        {activeTab === 'supabase' && (
          <AdminSupabaseManager />
        )}

        {/* ======================================================== */}
        {/* TAB 1: SERVICES MANAGEMENT (Approve, Edit, Delete)       */}
        {/* ======================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0f2922]">সেবাসমূহ ও প্যাকেজ নিয়ন্ত্রণ ({services.length})</h2>
                <p className="text-xs text-stone-500">
                  যেকোনো সেবা অনুমোদন, সম্পাদন অথবা মুছে ফেলুন। অননুমোদিত সেবাগুলো পাবলিক ওয়েবসাইটে প্রদর্শিত হবে না।
                </p>
              </div>
              <button
                onClick={() => openServiceModal('new')}
                className="px-4 py-2.5 bg-[#0f2922] text-[#DCB473] hover:bg-[#184236] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন সেবা যুক্ত করুন</span>
              </button>
            </div>

            {/* List of Services with Approval, Edit, Delete */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className={`bg-white p-5 rounded-2xl border shadow-xs flex flex-col justify-between transition-all ${
                    svc.isApproved === false ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-stone-900 text-base">{svc.title}</h3>
                        {svc.isApproved === false ? (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>অননুমোদিত (ড্রাফট)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5" />
                            <span>অনুমোদিত ও লাইভ</span>
                          </span>
                        )}
                      </div>
                      {svc.badge && (
                        <span className="text-[10px] bg-[#DCB473]/20 text-[#0f2922] font-bold px-2 py-0.5 rounded-full">
                          {svc.badge}
                        </span>
                      )}
                    </div>

                    {svc.subtitle && <p className="text-xs text-[#b88e44] font-semibold mb-2">{svc.subtitle}</p>}
                    <p className="text-xs text-stone-600 line-clamp-2 mb-3">{svc.shortDesc}</p>
                    <ul className="text-[11px] text-stone-500 space-y-1 mb-4">
                      {svc.features.slice(0, 3).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Controls: Approve, Edit, Delete */}
                  <div className="pt-3 border-t flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleServiceApproval(svc.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer ${
                        svc.isApproved === false
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-900'
                      }`}
                    >
                      {svc.isApproved === false ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>অনুমোদন দিন</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>ড্রাফট করুন</span>
                        </>
                      )}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openServiceModal(svc)}
                        className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>সম্পাদন</span>
                      </button>

                      <button
                        onClick={() => {
                          requestConfirm({
                            title: 'সেবা মুছে ফেলা',
                            message: `আপনি কি "${svc.title}" সেবাটি মুছে ফেলতে চান?`,
                            confirmText: 'হ্যাঁ, মুছে ফেলুন',
                            onConfirm: () => deleteService(svc.id)
                          });
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>মুছুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: GALLERY MANAGEMENT (Approve, Edit, Delete)        */}
        {/* ======================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0f2922]">ফটো গ্যালারি নিয়ন্ত্রণ ({galleryItems.length})</h2>
                <p className="text-xs text-stone-500">
                  ওয়েবসাইটে প্রদর্শিত পবিত্র স্থানসমূহ ও কাফেলার ছবি সরাসরি যুক্ত বা সম্পাদন করুন
                </p>
              </div>

              <button
                onClick={() => openGalleryModal('new')}
                className="px-4 py-2.5 bg-[#0f2922] text-[#DCB473] hover:bg-[#184236] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ছবি যোগ করুন</span>
              </button>
            </div>

            {/* Gallery Grid with Approve/Unapprove, Edit, Delete */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl overflow-hidden border shadow-xs group relative flex flex-col justify-between transition-all ${
                    item.isApproved === false ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200'
                  }`}
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />

                    <div className="absolute top-2 left-2 flex gap-1">
                      {item.isApproved === false ? (
                        <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-md shadow">
                          অননুমোদিত
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md shadow">
                          অনুমোদিত
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        onClick={() => openGalleryModal(item)}
                        className="p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded-lg shadow-md cursor-pointer"
                        title="সম্পাদন করুন"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          requestConfirm({
                            title: 'ছবি মুছে ফেলা',
                            message: `আপনি কি "${item.title}" ছবিটি মুছতে চান?`,
                            confirmText: 'হ্যাঁ, মুছে ফেলুন',
                            onConfirm: () => deleteGalleryItem(item.id)
                          });
                        }}
                        className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md cursor-pointer"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="font-bold text-xs text-stone-800 line-clamp-1">{item.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-[#b88e44] font-medium">{item.category}</span>
                      <button
                        onClick={() => toggleGalleryApproval(item.id)}
                        className="text-[11px] font-bold text-stone-600 hover:text-[#0f2922] underline cursor-pointer"
                      >
                        {item.isApproved === false ? 'অনুমোদন দিন' : 'লুকিয়ে রাখুন'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: TEAM MANAGEMENT (Approve, Edit, Delete)           */}
        {/* ======================================================== */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0f2922]">পরিচালনা পর্ষদ নিয়ন্ত্রণ ({teamMembers.length})</h2>
                <p className="text-xs text-stone-500">
                  আমাদের সম্পর্কে পেইজে প্রদর্শিত প্রতিষ্ঠাতা ও ব্যবস্থাপনা পরিচালকদের প্রোফাইল নিয়ন্ত্রণ করুন
                </p>
              </div>
              <button
                onClick={() => openTeamModal('new')}
                className="px-4 py-2.5 bg-[#0f2922] text-[#DCB473] hover:bg-[#184236] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন সদস্য যুক্ত করুন</span>
              </button>
            </div>

            {/* Team Grid with Approve, Edit, Delete */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl p-4 border shadow-xs flex items-center justify-between gap-3 ${
                    member.isApproved === false ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">{member.name}</h4>
                      <p className="text-[10px] text-[#b88e44] font-semibold">{member.role}</p>
                      <span className="text-[10px] text-stone-400">
                        {member.isApproved === false ? 'অননুমোদিত' : 'অনুমোদিত'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleTeamApproval(member.id)}
                      className="p-1 text-xs text-stone-500 hover:text-emerald-700 cursor-pointer"
                      title={member.isApproved === false ? 'অনুমোদন দিন' : 'লুকান'}
                    >
                      {member.isApproved === false ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => openTeamModal(member)}
                      className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                      title="সম্পাদন"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        requestConfirm({
                          title: 'সদস্য মুছে ফেলা',
                          message: `আপনি কি "${member.name}" কে মুছে ফেলতে চান?`,
                          confirmText: 'হ্যাঁ, মুছে ফেলুন',
                          onConfirm: () => deleteTeamMember(member.id)
                        });
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: REVIEWS & TESTIMONIALS (Approve, Edit, Delete)     */}
        {/* ======================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#0f2922]">গ্রাহক মতামত ও রিভিউ নিয়ন্ত্রণ ({reviews.length})</h2>
                <p className="text-xs text-stone-500">
                  হাজীদের প্রদত্ত মতামত অনুমোদন করুন অথবা নতুন মতামত যুক্ত করুন
                </p>
              </div>
              <button
                onClick={() => openReviewModal('new')}
                className="px-4 py-2.5 bg-[#0f2922] text-[#DCB473] hover:bg-[#184236] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন রিভিউ যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`bg-white p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${
                    rev.isApproved ? 'border-stone-200' : 'border-amber-400 bg-amber-50/25'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-stone-900">{rev.name}</span>
                      <span className="text-xs text-amber-500 font-bold">★ {rev.rating}/৫</span>
                    </div>
                    <p className="text-xs text-stone-500 mb-1">{rev.location} | {rev.packageTaken}</p>
                    <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border mb-3">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <button
                      onClick={() => toggleReviewApproval(rev.id)}
                      className="text-xs font-bold text-stone-700 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{rev.isApproved ? 'লুকিয়ে রাখুন' : 'অনুমোদন দিন'}</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openReviewModal(rev)}
                        className="p-1.5 text-xs text-stone-600 hover:text-stone-900 border rounded-lg cursor-pointer"
                        title="সম্পাদন"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          requestConfirm({
                            title: 'রিভিউ মুছে ফেলা',
                            message: `আপনি কি "${rev.name}" এর রিভিউটি মুছে ফেলতে চান?`,
                            confirmText: 'হ্যাঁ, মুছে ফেলুন',
                            onConfirm: () => deleteReview(rev.id)
                          });
                        }}
                        className="p-1.5 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg cursor-pointer"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: INBOX (INQUIRIES & CONTACT MESSAGES)              */}
        {/* ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8">
            {/* Inquiries */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0f2922]">
                    প্যাকেজ অনুসন্ধান ও আবেদন তালিকা ({inquiries.length})
                  </h2>
                  <p className="text-xs text-stone-500">অনলাইন থেকে গ্রাহকদের পাঠানো প্যাকেজ কোটেশন অনুরোধসমূহ</p>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <p className="text-center py-6 text-stone-400 text-sm">কোনো অনুসন্ধান অনুরোধ নেই।</p>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                        inq.status === 'pending'
                          ? 'border-amber-300 bg-amber-50/40'
                          : inq.status === 'approved'
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : 'border-stone-200 bg-stone-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">{inq.name}</span>
                          <span className="font-mono text-xs font-bold text-[#0f2922] bg-white px-2 py-0.5 rounded-md border">
                            {inq.phone}
                          </span>
                          <span className="text-xs text-stone-400">({inq.date})</span>

                          {/* Registration Type Badges */}
                          {inq.registrationType === 'haji' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white shadow-xs">
                              হাজী নিবন্ধন
                            </span>
                          )}
                          {inq.registrationType === 'partner' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0f2922] text-[#DCB473] shadow-xs">
                              পার্টনার নিবন্ধন
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inq.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inq.status === 'contacted'
                                ? 'bg-blue-100 text-blue-800'
                                : inq.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {inq.status === 'approved'
                              ? 'অনুমোদিত'
                              : inq.status === 'contacted'
                              ? 'যোগাযোগ সম্পন্ন'
                              : inq.status === 'pending'
                              ? 'অপেক্ষমাণ'
                              : 'সম্পন্ন'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600">
                          <strong>সেবা/ক্যাটাগরি:</strong> {inq.serviceName} | <strong>যাত্রী/ভলিউম:</strong> {inq.travelers}
                          {inq.registrationRef && (
                            <span className="ml-2 font-mono text-[11px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                              রেফ: {inq.registrationRef}
                            </span>
                          )}
                        </p>
                        {/* Haji/Partner extra details badge row */}
                        {(inq.photoUrl || inq.hajiUserId || inq.totalHajPartner || inq.hajPartnerIdLink || inq.passportNo || inq.nidNo) && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {inq.photoUrl && (
                              <img
                                src={inq.photoUrl}
                                alt="হাজীর ছবি"
                                className="w-8 h-8 rounded-lg object-cover border border-emerald-400 shadow-xs"
                                title="হাজীর পাসপোর্ট সাইজ ছবি"
                              />
                            )}
                            {inq.hajiUserId && (
                              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                                🔑 আইডি: {inq.hajiUserId}
                              </span>
                            )}
                            {inq.totalHajPartner && !inq.totalHajPartner.includes('০ জন') && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                                👥 মোট পার্টনার: {inq.totalHajPartner}
                              </span>
                            )}
                            {inq.passportNo && (
                              <span className="text-[10px] font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                                পাসপোর্ট: {inq.passportNo}
                              </span>
                            )}
                            {inq.nidNo && (
                              <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                NID: {inq.nidNo}
                              </span>
                            )}
                            {inq.hajPartnerIdLink && (
                              <span className="text-[10px] font-semibold bg-[#DCB473]/20 text-[#0f2922] px-2 py-0.5 rounded border border-[#DCB473]/40">
                                পার্টনার/সঙ্গী আইডি: {inq.hajPartnerIdLink}
                              </span>
                            )}
                            {(inq.signatureUrl || inq.nidDocUrl || inq.passportDocUrl) && (
                              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                📎 ডকুমেন্টস সংযুক্ত
                              </span>
                            )}
                          </div>
                        )}

                        {inq.message && (
                          <p className="text-xs text-stone-700 bg-white p-2 rounded-lg border max-w-xl">
                            &ldquo;{inq.message}&rdquo;
                          </p>
                        )}
                        {inq.adminNotes && (
                          <p className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                            নোট: {inq.adminNotes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {inq.status !== 'approved' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, 'approved')}
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন</span>
                          </button>
                        )}
                        <button
                          onClick={() => openInquiryModal(inq)}
                          className="px-3 py-1.5 bg-white border border-stone-200 text-stone-800 font-semibold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>সম্পাদন</span>
                        </button>
                        <button
                          onClick={() => {
                            requestConfirm({
                              title: 'অনুরোধ মুছে ফেলা',
                              message: `আপনি কি "${inq.name}" এর অনুরোধটি মুছে ফেলতে চান?`,
                              confirmText: 'হ্যাঁ, মুছে ফেলুন',
                              onConfirm: () => deleteInquiry(inq.id)
                            });
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Messages */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-[#0f2922]">
                  যোগাযোগ পাতা থেকে প্রাপ্ত বার্তা ({contactMessages.length})
                </h2>
              </div>

              {contactMessages.length === 0 ? (
                <p className="text-center py-6 text-stone-400 text-sm">কোনো বার্তা নেই।</p>
              ) : (
                <div className="space-y-3">
                  {contactMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">{msg.name}</span>
                          <span className="font-mono text-xs font-bold text-[#0f2922] bg-white px-2 py-0.5 rounded-md border">
                            {msg.phone}
                          </span>
                          {msg.email && <span className="text-xs text-stone-500">{msg.email}</span>}
                        </div>
                        <button
                          onClick={() => {
                            requestConfirm({
                              title: 'বার্তা মুছে ফেলা',
                              message: `আপনি কি "${msg.name}" এর বার্তাটি মুছে ফেলতে চান?`,
                              confirmText: 'হ্যাঁ, মুছে ফেলুন',
                              onConfirm: () => deleteMessage(msg.id)
                            });
                          }}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#0f2922] font-bold">বিষয়: {msg.subject}</p>
                      <p className="text-xs text-stone-700 bg-white p-2 rounded-lg border mt-1">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PRAYER TIMES                                      */}
        {/* ======================================================== */}
        {activeTab === 'prayers' && (
          <form onSubmit={handleSavePrayers} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#0f2922]">আজকের নামাজের সময়সূচী নিয়ন্ত্রণ</h2>
                <p className="text-xs text-stone-500">দুপচাঁচিয়া ও বগুড়া এলাকার স্থানীয় সময় অনুযায়ী সময় সম্পাদন করুন</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#DCB473] hover:bg-[#c99f5e] text-[#0f2922] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>সময়সূচী সংরক্ষণ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {prayersForm.map((prayer, index) => (
                <div key={prayer.nameEn} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-[#0f2922]">{prayer.nameBn}</span>
                    <span className="text-xs text-stone-400 font-mono uppercase">{prayer.nameEn}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1 font-semibold">ওয়াক্তের সময়:</label>
                    <input
                      type="text"
                      value={prayer.time}
                      onChange={(e) => {
                        const updated = [...prayersForm];
                        updated[index] = { ...updated[index], time: e.target.value };
                        setPrayersForm(updated);
                      }}
                      className="w-full px-3.5 py-2 bg-white font-mono font-bold text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#DCB473]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 7: STATS                                             */}
        {/* ======================================================== */}
        {activeTab === 'stats' && (
          <form onSubmit={handleSaveStats} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#0f2922]">পরিসংখ্যান ও মাইলফলক কাউন্টার</h2>
                <p className="text-xs text-stone-500">আমাদের সম্পর্কে পেইজে প্রদর্শিত ৪টি প্রধান সংখ্যা সম্পাদন করুন</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#DCB473] hover:bg-[#c99f5e] text-[#0f2922] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsForm.map((st, index) => (
                <div key={index} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">মান / সংখ্যা *</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...statsForm];
                        updated[index] = { ...updated[index], value: e.target.value };
                        setStatsForm(updated);
                      }}
                      className="w-full px-3 py-2 font-mono font-bold text-sm rounded-xl border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">লেবেল *</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const updated = [...statsForm];
                        updated[index] = { ...updated[index], label: e.target.value };
                        setStatsForm(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">ছোট বিবরণ</label>
                    <input
                      type="text"
                      value={st.sub}
                      onChange={(e) => {
                        const updated = [...statsForm];
                        updated[index] = { ...updated[index], sub: e.target.value };
                        setStatsForm(updated);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 8: GENERAL SETTINGS                                  */}
        {/* ======================================================== */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#0f2922]">সাধারণ সেটিংস ও যোগাযোগ তথ্য</h2>
                <p className="text-xs text-stone-500">হেডার, ফুটার এবং ওয়েবসাইটের সাধারণ তথ্য পরিবর্তন করুন</p>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0f2922] hover:bg-[#1a4438] text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#DCB473]" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            </div>

            {/* Announcement banner setting */}
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0f2922]">টপ নোটিশ বার (Announcement)</span>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={generalForm.showAnnouncement ?? true}
                    onChange={(e) => setGeneralForm({ ...generalForm, showAnnouncement: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0f2922]"
                  />
                  <span>নোটিশ প্রদর্শন করুন</span>
                </label>
              </div>
              <input
                type="text"
                value={generalForm.announcementText || ''}
                onChange={(e) => setGeneralForm({ ...generalForm, announcementText: e.target.value })}
                placeholder="ওয়েবসাইটের সবার উপরে প্রদর্শিত বিশেষ ঘোষণা..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">প্রতিষ্ঠানের নাম (বাংলা)</label>
                <input
                  type="text"
                  value={generalForm.name}
                  onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">নাম (ইংরেজি)</label>
                <input
                  type="text"
                  value={generalForm.nameEn}
                  onChange={(e) => setGeneralForm({ ...generalForm, nameEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">স্লোগান / ট্যাগলাইন</label>
                <input
                  type="text"
                  value={generalForm.slogan}
                  onChange={(e) => setGeneralForm({ ...generalForm, slogan: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">হটলাইন ১ (প্রধান ফোন)</label>
                <input
                  type="text"
                  value={generalForm.phone1Display}
                  onChange={(e) => setGeneralForm({ ...generalForm, phone1Display: e.target.value, phone1: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">হটলাইন ২ (ফোন)</label>
                <input
                  type="text"
                  value={generalForm.phone2Display}
                  onChange={(e) => setGeneralForm({ ...generalForm, phone2Display: e.target.value, phone2: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">অফিসিয়াল ইমেইল</label>
                <input
                  type="email"
                  value={generalForm.email}
                  onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">হোয়াটসঅ্যাপ লিংক / নম্বর</label>
                <input
                  type="text"
                  value={generalForm.whatsapp}
                  onChange={(e) => setGeneralForm({ ...generalForm, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">ফেসবুক পেজ লিংক</label>
                <input
                  type="text"
                  value={generalForm.facebook}
                  onChange={(e) => setGeneralForm({ ...generalForm, facebook: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">ইউটিউব চ্যানেল লিংক</label>
                <input
                  type="text"
                  value={generalForm.youtube}
                  onChange={(e) => setGeneralForm({ ...generalForm, youtube: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">অফিসের পূর্ণাঙ্গ ঠিকানা</label>
                <textarea
                  rows={2}
                  value={generalForm.address}
                  onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  requestConfirm({
                    title: 'ফ্যাক্টরি ডিফল্টে রিসেট',
                    message: 'আপনি কি পূর্বনির্ধারিত ডিফল্ট তথ্যে সবকিছু রিসেট করতে চান?',
                    confirmText: 'হ্যাঁ, রিসেট করুন',
                    onConfirm: () => resetToDefaults()
                  });
                }}
                className="text-xs text-stone-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ফ্যাক্টরি ডিফল্টে রিসেট করুন</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0f2922] hover:bg-[#1a4438] text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#DCB473]" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
