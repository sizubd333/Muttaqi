import React, { useState } from 'react';
import { PageId, ServiceItem } from '../types';
import { useAdmin } from '../context/AdminContext';
import { Hero } from '../components/Hero';
import { IslamicPillars } from '../components/IslamicPillars';
import { PrayerTimes } from '../components/PrayerTimes';
import { ServicesGrid } from '../components/ServicesGrid';
import { PackageCalculator } from '../components/PackageCalculator';
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  Sparkles,
  Plane,
  FileCheck,
  Star,
  MessageSquareQuote,
  CheckCircle,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: PageId) => void;
  onSelectService: (service: ServiceItem) => void;
  onOpenInquiry: (serviceId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onSelectService,
  onOpenInquiry
}) => {
  const {
    companyInfo,
    reviews,
    addReview,
    isAdminLoggedIn,
    toggleReviewApproval,
    openReviewModal,
    deleteReview,
    requestConfirm
  } = useAdmin();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewPackage, setReviewPackage] = useState('পবিত্র ওমরাহ প্যাকেজ');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // If public visitor, only show approved reviews. If admin, show all
  const displayReviews = isAdminLoggedIn
    ? reviews
    : reviews.filter((r) => r.isApproved);

  const handleDeleteReview = (rev: any) => {
    requestConfirm({
      title: 'রিভিউ মুছে ফেলার নিশ্চিতকরণ',
      message: `আপনি কি "${rev.name}" এর রিভিউটি স্থায়ীভাবে মুছে ফেলতে চান?`,
      confirmText: 'হ্যাঁ, মুছে ফেলুন',
      onConfirm: () => deleteReview(rev.id)
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({
      name: reviewName.trim(),
      location: reviewLocation.trim() || 'বগুড়া',
      packageTaken: reviewPackage,
      rating: reviewRating,
      comment: reviewComment.trim()
    });
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalOpen(false);
      setReviewName('');
      setReviewLocation('');
      setReviewComment('');
    }, 2000);
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero setCurrentPage={setCurrentPage} onOpenInquiry={onOpenInquiry} />

      {/* 2. About Us Highlight Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Image / Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#DCB473]/20">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="মক্কা মুকাররমা ও মুত্তাকী হজ্ব কাফেলা"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#DCB473] block mb-1">
                    মুত্তাকী হজ্ব ও কন্সাল্টেন্সি
                  </span>
                  <p className="text-sm font-medium text-stone-200">
                    {companyInfo.slogan}। আপনার আধ্যাত্মিক যাত্রাই আমাদের প্রধান লক্ষ্য।
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-[#0f2922] text-white p-4 rounded-2xl shadow-xl border border-[#DCB473]/30">
                <div className="w-10 h-10 rounded-xl bg-[#DCB473] text-[#0f2922] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <span className="block text-xs text-[#DCB473]">সরকারি নিয়মানুযায়ী</span>
                  <span className="text-sm font-bold">বিশ্বস্ত কাফেলা</span>
                </div>
              </div>
            </div>

            {/* Content text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#b88e44] tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-[#DCB473]" />
                <span>মুত্তাকী হজ্ব ও কন্সাল্টেন্সি সম্পর্কে</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2922] leading-tight">
                পবিত্রতার যাত্রা এবং <span className="text-[#b88e44]">তারও বেশি</span>
              </h2>

              <p className="text-stone-700 leading-relaxed text-base">
                মুত্তাকী হজ্ব ও কন্সাল্টেন্সির সাথে নিরাপদ যাত্রা করুন, যেখানে আপনার আধ্যাত্মিক যাত্রাই আমাদের প্রধান লক্ষ্য। আমরা হজ্ব ও ওমরাহ প্যাকেজ, বিমান টিকিট, হোটেল বুকিং, ভিসা প্রক্রিয়াকরণ এবং আরও অনেক সেবা যত্নসহকারে প্রদান করি।
              </p>

              <p className="text-stone-700 leading-relaxed text-base">
                আমাদের সম্মানিত দলের সাথে পরিচিত হন, যার নেতৃত্বে আছেন প্রতিষ্ঠাতা <strong>মোঃ রাজু মিয়া</strong> এবং আমাদের দূরদর্শী ব্যবস্থাপনা পরিচালকবৃন্দ। ব্যক্তিগত ভ্রমণ সমাধানের জন্য আমাদের অফিসে আসুন — <strong>{companyInfo.address}</strong>।
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setCurrentPage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-[#DCB473] hover:bg-[#c99f5e] text-[#0f2922] font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                >
                  <span>আমাদের সম্পর্কে আরও জানুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`tel:${companyInfo.phone1}`}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#b88e44]" />
                  <span>{companyInfo.phone1Display}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Islamic Pillars Section */}
      <IslamicPillars />

      {/* 4. Services Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-semibold text-[#b88e44] uppercase tracking-wider block mb-1">
              ইনশাআল্লাহ আমাদের সাথে নিরাপদ যাত্রা করুন
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2922]">
              মুত্তাকী হজ্ব ও কন্সাল্টেন্সির <span className="text-[#b88e44]">সেবাসমূহ</span>
            </h2>
            <p className="mt-3 text-stone-600 text-base">
              হজ্ব, ওমরাহ, এয়ার টিকিট, ভিসা প্রসেসিং ও যাবতীয় বৈদেশিক ভ্রমণ সম্পর্কিত নির্ভরযোগ্য ও সর্বাধুনিক সমাধান।
            </p>
          </div>

          <ServicesGrid
            onSelectService={onSelectService}
            onInquire={onOpenInquiry}
          />

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                setCurrentPage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0f2922] hover:bg-[#1a4438] text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>সকল সেবার বিস্তারিত ও প্যাকেজ দেখুন</span>
              <ArrowRight className="w-4 h-4 text-[#DCB473]" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Prayer Times Schedule */}
      <PrayerTimes />

      {/* 6. Feature Rows */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Row 1: Spiritual Journey */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80"
                  alt="হজ্ব ও ওমরাহ আধ্যাত্মিক যাত্রা"
                  className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCB473]/20 flex items-center justify-center text-[#b88e44] mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0f2922]">
                আধ্যাত্মিক যাত্রা আবিষ্কার করুন
              </h3>
              <p className="text-stone-700 leading-relaxed text-base">
                <strong>হজ্ব ও ওমরাহ:</strong> আমাদের বিশেষজ্ঞ নির্দেশনার সাথে পবিত্র যাত্রায় অংশ নিন, যা নিরাপদ ও স্মৃতিময় অভিজ্ঞতা নিশ্চিত করে। প্রতিটি রোকন আদায়ের পূর্বে আলেমদের দ্বারা সহিহ প্রশিক্ষণ প্রদান করা হয়।
              </p>
              <ul className="space-y-2 pt-2 text-sm text-stone-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>অভিজ্ঞ মোয়াল্লিমের সার্বক্ষণিক উপস্থিতি ও নির্দেশনা</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>মক্কা ও মদিনার ঐতিহাসিক স্থানসমূহ জিয়ারতের বিশেষ কাফেলা</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2: Seamless Travel Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCB473]/20 flex items-center justify-center text-[#b88e44] mb-2">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0f2922]">
                নিরবিচ্ছিন্ন ভ্রমণ সমাধান
              </h3>
              <p className="text-stone-700 leading-relaxed text-base">
                <strong>বিমান টিকিট ও হোটেল:</strong> আন্তর্জাতিক ও দেশীয় বিমানের জন্য নিশ্চিত হোটেল থাকার ব্যবস্থা সহ ঝামেলামুক্ত বুকিং উপভোগ করুন। <strong>ভ্রমণ প্যাকেজ:</strong> আমাদের সুচিন্তিত ভ্রমণ প্যাকেজের সাথে আকর্ষণীয় গন্তব্যস্থল অন্বেষণ করুন।
              </p>
              <ul className="space-y-2 pt-2 text-sm text-stone-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>সুলভ মূল্যে সাউদিয়া, বিমান বাংলাদেশ সহ যেকোনো এয়ারলাইনসের টিকিট</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>পছন্দসই বাজেটে মক্কা ও মদিনার হোটেল কনফার্মেশন</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80"
                  alt="মসজিদে নববী ও হোটেল সমাধান"
                  className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Smooth Travel Prep */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&auto=format&fit=crop&q=80"
                  alt="ভিসা ও পাসপোর্ট সেবা"
                  className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCB473]/20 flex items-center justify-center text-[#b88e44] mb-2">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0f2922]">
                মসৃণ ভ্রমণ প্রস্তুতি
              </h3>
              <p className="text-stone-700 leading-relaxed text-base">
                <strong>ভিসা ও পাসপোর্ট সেবা:</strong> আমাদের দ্রুত ভিসা প্রক্রিয়াকরণ ও নির্ভুল পাসপোর্ট সহায়তার সাথে আপনার ভ্রমণ পরিকল্পনা সহজ করুন। <strong>মানবসম্পদ ও ইমিগ্রেশন:</strong> দক্ষ মানবসম্পদ নিয়োগ ও নিরবিচ্ছিন্ন ইমিগ্রেশন সহায়তার জন্য আমাদের বিশ্বাস করুন।
              </p>
              <ul className="space-y-2 pt-2 text-sm text-stone-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>সৌদি আরবসহ যেকোনো দেশের দ্রুত ই-ভিসা প্রসেসিং</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>জরুরি ই-পাসপোর্ট ফরম পূরণ ও সাবমিশন সাপোর্ট</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Approved Pilgrim Testimonials / Reviews Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-[#b88e44] uppercase tracking-wider block mb-1">
                গ্রাহকদের সন্তুষ্টি
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2922]">
                হাজীদের অভিজ্ঞতা ও <span className="text-[#b88e44]">মতামত</span>
              </h2>
              <p className="mt-2 text-stone-600 text-sm">
                মুত্তাকী কাফেলার সাথে সফর সম্পন্ন করা সম্মানিত হাজীদের মূল্যবান অনুভূতি।
              </p>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-5 py-2.5 bg-[#0f2922] text-[#DCB473] hover:bg-[#184236] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>আপনার অভিজ্ঞতা জানান</span>
            </button>
          </div>

          {/* Admin quick bar */}
          {isAdminLoggedIn && (
            <div className="mb-6 p-4 bg-[#0f2922]/5 border-2 border-dashed border-[#DCB473] rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0f2922]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>রিভিউ প্রশাসন: মোট {reviews.length}টি মতামত ({reviews.filter(r => !r.isApproved).length}টি অপেক্ষমাণ)</span>
              </div>
              <button
                onClick={() => openReviewModal('new')}
                className="px-4 py-2 bg-[#0f2922] hover:bg-[#184236] text-[#DCB473] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform hover:scale-102"
              >
                <Plus className="w-4 h-4" />
                <span>+ এডমিন রিভিউ যোগ করুন</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayReviews.map((rev) => (
              <div
                key={rev.id}
                className={`bg-stone-50 rounded-2xl p-6 border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ${
                  rev.isApproved ? 'border-stone-200/90' : 'border-amber-400 bg-amber-50/25'
                }`}
              >
                <div>
                  {/* Admin review controls */}
                  {isAdminLoggedIn && (
                    <div className="mb-3 pb-2.5 border-b border-stone-200 flex items-center justify-between text-xs">
                      {rev.isApproved ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                          ✓ লাইভ
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-md">
                          ⏳ অপেক্ষমাণ
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleReviewApproval(rev.id)}
                          className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                            rev.isApproved
                              ? 'text-stone-600 hover:text-amber-800'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {rev.isApproved ? 'ড্রাফট' : 'অনুমোদন দিন'}
                        </button>
                        <button
                          onClick={() => openReviewModal(rev)}
                          className="p-1 text-stone-600 hover:text-stone-900 bg-stone-200 rounded"
                          title="সম্পাদন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev)}
                          className="p-1 text-rose-600 hover:text-rose-800 bg-rose-100 rounded"
                          title="মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{rev.name}</h4>
                      <p className="text-xs text-stone-500">{rev.location}</p>
                    </div>
                    <div className="flex text-amber-500 text-sm">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-stone-200 mb-3">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-semibold text-[#b88e44]">{rev.packageTaken}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Interactive Package Calculator */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PackageCalculator onOpenInquiry={onOpenInquiry} />
        </div>
      </section>

      {/* 9. Call To Action Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#0d2a23] to-[#12382f] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-wider text-[#DCB473] font-bold">
                জীবনের সেরা সফর
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                হজ্ব ও ওমরাহ: পবিত্র যাত্রায় অংশ নিন
              </h2>
              <p className="text-stone-200 text-base leading-relaxed max-w-2xl">
                আমাদের বিশেষজ্ঞ নির্দেশনা ও সূক্ষ্ম পরিকল্পনার সাথে জীবনের সেরা আধ্যাত্মিক যাত্রা উপভোগ করুন। আমরা নিরবিচ্ছিন্ন যাত্রা নিশ্চিত করি, যাতে আপনি পবিত্র স্থানগুলির আধ্যাত্মিক তাৎপর্যের উপর মনোনিবেশ করতে পারেন।
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-sm text-stone-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#DCB473] font-bold">✓</span>
                  <span>ঐতিহাসিক গুরুত্বের বিস্ময় অন্বেষণ করুন।</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#DCB473] font-bold">✓</span>
                  <span>পবিত্র গন্তব্যস্থলের প্রশান্তিতে নিমজ্জিত হন।</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#DCB473] font-bold">✓</span>
                  <span>বিশ্বাস ও ভক্তির সারমর্ম আবিষ্কার করুন।</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#DCB473] font-bold">✓</span>
                  <span>সার্বক্ষণিক সহায়তা ও সঠিক গাইডলাইন।</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5">
              <button
                onClick={() => onOpenInquiry('hajj-umrah')}
                className="w-full py-3.5 px-6 bg-[#DCB473] hover:bg-[#c99f5e] text-[#0f2922] font-bold rounded-2xl text-center shadow-lg transition-transform hover:scale-102 cursor-pointer"
              >
                প্যাকেজ বুকিং আবেদন
              </button>
              <a
                href={`tel:${companyInfo.phone1}`}
                className="w-full py-3.5 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-center border border-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#DCB473]" />
                <span>সরাসরি কল: {companyInfo.phone1Display}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Review Submission Modal for Pilgrims */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#DCB473]/30">
            {reviewSubmitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-stone-900 mb-1">ধন্যবাদ!</h3>
                <p className="text-xs text-stone-600">
                  আপনার মতামত সফলভাবে জমা হয়েছে। এডমিন দ্বারা অনুমোদনের পর তা ওয়েবসাইটে প্রদর্শিত হবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-base text-[#0f2922]">আপনার মূল্যবান মতামত দিন</h3>
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="উদাঃ মোঃ আব্দুল করিম"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">এলাকা / জেলা</label>
                    <input
                      type="text"
                      value={reviewLocation}
                      onChange={(e) => setReviewLocation(e.target.value)}
                      placeholder="উদাঃ দুপচাঁচিয়া"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">রেটিং</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    >
                      <option value={5}>★★★★★ (৫)</option>
                      <option value={4}>★★★★☆ (৪)</option>
                      <option value={3}>★★★☆☆ (৩)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">গৃহীত সেবা / প্যাকেজ</label>
                  <input
                    type="text"
                    value={reviewPackage}
                    onChange={(e) => setReviewPackage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">আপনার অভিজ্ঞতা লিখুন *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="মুত্তাকী কাফেলার সাথে আপনার অভিজ্ঞতা কেমন ছিল..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-3 py-1.5 border rounded-lg text-xs"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0f2922] text-[#DCB473] font-bold rounded-lg text-xs"
                  >
                    মতামত জমা দিন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
