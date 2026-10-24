import React, { useState, useMemo } from 'react';
import { InquiryItem } from '../types';
import { useAdmin } from '../context/AdminContext';
import { getAllGroupsOccupancy, MAX_PILGRIMS_PER_GROUP } from '../data/kafelaGroups';
import {
  Compass,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  Shield,
  FileText,
  Link as LinkIcon,
  Users,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Edit,
  Printer,
  Eye,
  EyeOff,
  Copy,
  KeyRound,
  Lock,
  ExternalLink,
  RotateCcw,
  AlertCircle,
  FileCheck,
  Sparkles,
  Download,
  BadgePercent,
  Calculator,
  Receipt
} from 'lucide-react';

interface AdminHajiRegistrationsProps {
  onOpenHajiForm?: () => void;
}

export const AdminHajiRegistrations: React.FC<AdminHajiRegistrationsProps> = () => {
  const {
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    openInquiryModal,
    requestConfirm,
    showToast,
    applyHajiDiscount,
    removeHajiDiscount
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'contacted' | 'rejected'>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string; hajiName: string } | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [printHaji, setPrintHaji] = useState<InquiryItem | null>(null);

  // Discount Modal State
  const [discountHaji, setDiscountHaji] = useState<InquiryItem | null>(null);
  const [discountPercentInput, setDiscountPercentInput] = useState<number>(0);
  const [discountNoteInput, setDiscountNoteInput] = useState<string>('');

  // Groups Occupancy calculations (max 50 per group)
  const groupsOccupancy = useMemo(() => getAllGroupsOccupancy(inquiries), [inquiries]);

  // Filter only Haji Registrations
  const hajiList = useMemo(() => {
    return inquiries.filter(
      (inq) => inq.registrationType === 'haji' || inq.serviceId === 'haji-full-registration'
    );
  }, [inquiries]);

  // Statistics
  const totalCount = hajiList.length;
  const pendingCount = hajiList.filter((h) => h.status === 'pending').length;
  const approvedCount = hajiList.filter((h) => h.status === 'approved').length;
  const contactedCount = hajiList.filter((h) => h.status === 'contacted').length;
  const rejectedCount = hajiList.filter((h) => h.status === 'rejected').length;

  // Filtered List based on search and filters
  const filteredHajis = useMemo(() => {
    return hajiList.filter((haji) => {
      // Status filter
      if (statusFilter !== 'all' && haji.status !== statusFilter) {
        return false;
      }
      // Package filter
      if (packageFilter !== 'all' && haji.serviceName !== packageFilter) {
        return false;
      }
      // Group filter
      if (groupFilter !== 'all' && haji.selectedGroup !== groupFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = (haji.nameBn || haji.name || '').toLowerCase().includes(query);
        const matchesNameEn = (haji.nameEn || '').toLowerCase().includes(query);
        const matchesPhone = (haji.phone || '').toLowerCase().includes(query);
        const matchesRef = (haji.registrationRef || '').toLowerCase().includes(query);
        const matchesUserId = (haji.hajiUserId || '').toLowerCase().includes(query);
        const matchesNid = (haji.nidNo || '').toLowerCase().includes(query);
        const matchesPassport = (haji.passportNo || '').toLowerCase().includes(query);
        const matchesAddress = (haji.presentAddress || '').toLowerCase().includes(query);

        return (
          matchesName ||
          matchesNameEn ||
          matchesPhone ||
          matchesRef ||
          matchesUserId ||
          matchesNid ||
          matchesPassport ||
          matchesAddress
        );
      }
      return true;
    });
  }, [hajiList, statusFilter, packageFilter, searchTerm]);

  // Distinct packages for filter dropdown
  const packageOptions = useMemo(() => {
    const set = new Set<string>();
    hajiList.forEach((h) => {
      if (h.serviceName) set.add(h.serviceName);
    });
    return Array.from(set);
  }, [hajiList]);

  // Handle Approve
  const handleApprove = (haji: InquiryItem) => {
    updateInquiryStatus(haji.id, 'approved', 'কাফেলা এডমিন কর্তৃক অনুমোদিত');
  };

  // Handle Delete
  const handleDelete = (haji: InquiryItem) => {
    requestConfirm({
      title: 'হাজী নিবন্ধন আবেদন বাতিল ও মুছে ফেলা',
      message: `আপনি কি নিশ্চিতভাবে "${haji.nameBn || haji.name}" এর নিবন্ধন আবেদনটি সম্পূর্ণ মুছে ফেলতে চান? এটি পুনরুদ্ধার করা যাবে না।`,
      confirmText: 'হ্যাঁ, মুছে ফেলুন',
      onConfirm: () => {
        deleteInquiry(haji.id);
      }
    });
  };

  // Toggle Password visibility
  const togglePassword = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy text helper
  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      showToast(`${label} ক্লিপবোর্ডে কপি করা হয়েছে!`);
    } catch {
      showToast(`${label}: ${text}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Summary Stats */}
      <div className="bg-gradient-to-r from-[#0b1f1a] via-[#12362c] to-[#0f2922] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#DCB473]/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DCB473] bg-[#DCB473]/20 px-3 py-1 rounded-full border border-[#DCB473]/40">
                কেন্দ্রীয় ডাটাবেজ
              </span>
              {pendingCount > 0 && (
                <span className="text-xs font-bold text-amber-200 bg-amber-500/30 px-3 py-1 rounded-full border border-amber-400/50 flex items-center gap-1 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pendingCount} টি অপেক্ষমাণ আবেদন!</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-[#DCB473]" />
              <span>হাজী নিবন্ধন আবেদন ও অনুমোদন ব্যবস্থাপনা</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              অনলাইন হাজী ফরম থেকে জমাকৃত সকল প্রাক-নিবন্ধন আবেদন। নতুন আবেদন পেন্ডিং অবস্থায় জমা হয়—যেখান থেকে আপনি তা অনুমোদন, তথ্য সম্পাদন এবং ব্যবস্থাপনা করতে পারবেন।
            </p>
          </div>

          {/* Quick Counter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-xs text-stone-300 block">মোট আবেদন</span>
              <span className="text-2xl font-bold text-white font-mono">{totalCount}</span>
            </div>
            <div className="bg-amber-500/20 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-400/30 text-center">
              <span className="text-xs text-amber-200 font-semibold block">পেন্ডিং আবেদন</span>
              <span className="text-2xl font-bold text-amber-300 font-mono">{pendingCount}</span>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-400/30 text-center">
              <span className="text-xs text-emerald-200 font-semibold block">অনুমোদিত</span>
              <span className="text-2xl font-bold text-emerald-300 font-mono">{approvedCount}</span>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-xs p-3.5 rounded-2xl border border-blue-400/30 text-center">
              <span className="text-xs text-blue-200 font-semibold block">যোগাযোগকৃত</span>
              <span className="text-2xl font-bold text-blue-300 font-mono">{contactedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="হাজীর নাম, ইউজার আইডি, মোবাইল নম্বর, রেফারেন্স, NID বা পাসপোর্ট দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#DCB473] bg-stone-50/50 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Package Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#DCB473] font-medium text-stone-700"
            >
              <option value="all">সকল প্যাকেজ ({hajiList.length})</option>
              {packageOptions.map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>
          </div>

          {/* Kafela Group Filter (৫০ জন সর্বোচ্চ) */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600 shrink-0" />
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-purple-200 bg-purple-50/50 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-purple-900"
            >
              <option value="all">সকল কাফেলা গ্রুপ ({groupsOccupancy.length}টি)</option>
              {groupsOccupancy.map((item) => (
                <option key={item.group.id} value={item.group.name}>
                  {item.group.name} — {item.currentCount}/{MAX_PILGRIMS_PER_GROUP} জন {item.isFull ? '(পূর্ণ)' : `(${item.seatsLeft}টি আসন খালি)`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-stone-100">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#0f2922] text-[#DCB473] shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            সব আবেদন ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>পেন্ডিং / অপেক্ষমাণ ({pendingCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'approved'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>অনুমোদিত ({approvedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'contacted'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            যোগাযোগকৃত ({contactedCount})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            বাতিল ({rejectedCount})
          </button>
        </div>
      </div>

      {/* 2.5. Kafela Groups Capacity Summary Widget (NB: প্রতি গ্রুপে সর্বোচ্চ ৫০ জন) */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-700" />
            <h3 className="text-sm font-bold text-[#0f2922]">
              কাফেলা গ্রুপভিত্তিক হজযাত্রী আসন ট্র্যাকার (প্রতি গ্রুপে সর্বোচ্চ ৫০ জন হাজী)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 self-start sm:self-auto">
            NB: প্রতি গ্রুপ ধারণক্ষমতা ৫০ জন
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {groupsOccupancy.map((item) => {
            const isFull = item.isFull;
            const isCurrentFilter = groupFilter === item.group.name;

            return (
              <div
                key={item.group.id}
                onClick={() => setGroupFilter(isCurrentFilter ? 'all' : item.group.name)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isCurrentFilter
                    ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-300'
                    : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-[#0f2922] truncate">{item.group.name}</span>
                  {isFull ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                      পূর্ণ (৫০/৫০)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {item.seatsLeft} আসন বাকি
                    </span>
                  )}
                </div>

                {/* Progress */}
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden my-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-rose-500' : item.seatsLeft <= 5 ? 'bg-amber-500' : 'bg-purple-600'
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-500">
                  <span>মোয়াল্লিম: {item.group.leader}</span>
                  <span className="font-mono font-bold text-stone-700">{item.currentCount}/{MAX_PILGRIMS_PER_GROUP} জন</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Haji Registrations List */}
      {filteredHajis.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-700 mb-1">কোনো হাজী নিবন্ধন পাওয়া যায়নি</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all' || packageFilter !== 'all'
              ? 'আপনার ফিল্টারের সাথে মিলে এমন কোনো আবেদন পাওয়া যায়নি। ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।'
              : 'এখনও কোনো হাজী প্রাক-নিবন্ধন আবেদন জমা হয়নি। ওয়েবসাইট থেকে নতুন নিবন্ধন আসলে তা স্বয়ংক্রিয়ভাবে এখানে পেন্ডিং অবস্থায় জমা হবে।'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHajis.map((haji) => {
            const isApproved = haji.status === 'approved';
            const isPending = haji.status === 'pending';
            const isPasswordVisible = !!showPasswordMap[haji.id];
            const displayUserId = haji.hajiUserId || haji.registrationRef || haji.phone;

            return (
              <div
                key={haji.id}
                className={`bg-white rounded-3xl border-2 transition-all shadow-xs hover:shadow-md overflow-hidden ${
                  isPending
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : isApproved
                    ? 'border-emerald-300'
                    : 'border-stone-200'
                }`}
              >
                {/* Top Status & Main Identifiers Banner */}
                <div
                  className={`p-4 sm:p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isPending
                      ? 'bg-gradient-to-r from-amber-50/90 to-orange-50/50 border-amber-200'
                      : isApproved
                      ? 'bg-gradient-to-r from-emerald-50/90 to-teal-50/50 border-emerald-200'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  {/* Photo & Name Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {haji.photoUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDoc({
                            url: haji.photoUrl!,
                            title: 'হাজীর পাসপোর্ট সাইজ ছবি',
                            hajiName: haji.nameBn || haji.name
                          })
                        }
                        className="relative group cursor-pointer shrink-0"
                        title="ছবি বড় করে দেখুন"
                      >
                        <img
                          src={haji.photoUrl}
                          alt="হাজীর ছবি"
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#DCB473] shadow-xs group-hover:opacity-90 transition-opacity"
                        />
                        <span className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                          জুম
                        </span>
                      </button>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#0f2922] text-[#DCB473] flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                        <Compass className="w-7 h-7" />
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#0f2922]">
                          {haji.nameBn || haji.name}
                        </h3>
                        {haji.nameEn && (
                          <span className="text-xs font-mono font-semibold text-stone-600 bg-white/80 px-2 py-0.5 rounded border border-stone-200">
                            {haji.nameEn}
                          </span>
                        )}
                        {/* Status Badge */}
                        <span
                          className={`text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs ${
                            isPending
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : isApproved
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : haji.status === 'contacted'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}
                        >
                          {isPending && <Clock className="w-3.5 h-3.5 text-amber-700" />}
                          {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                          <span>
                            {isPending
                              ? 'অপেক্ষমাণ / পেন্ডিং'
                              : isApproved
                              ? 'অনুমোদিত'
                              : haji.status === 'contacted'
                              ? 'যোগাযোগ সম্পন্ন'
                              : 'বাতিলকৃত'}
                          </span>
                        </span>
                      </div>

                      {/* Package Name & Date */}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-600">
                        <span className="font-semibold text-emerald-950 bg-emerald-100/70 px-2 py-0.5 rounded">
                          {haji.serviceName || 'ওমরাহ/হজ্ব কাফেলা'}
                        </span>
                        {haji.selectedGroup && (
                          <span className="font-semibold text-purple-900 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                            <Users className="w-3 h-3 text-purple-700" />
                            <span>গ্রুপ: {haji.selectedGroup}</span>
                          </span>
                        )}
                        <span className="text-stone-400">•</span>
                        <span>রুম: {haji.roomPreference || 'স্ট্যান্ডার্ড'}</span>
                        <span className="text-stone-400">•</span>
                        <span>আবেদনের তারিখ: {haji.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Haji Login Credentials Pill Box */}
                  <div className="bg-white p-2.5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1.5 shrink-0 min-w-[240px]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 pb-1 border-b border-stone-100">
                      <span className="flex items-center gap-1 text-emerald-900">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                        হাজী লগইন একাউন্ট তথ্য
                      </span>
                      <span className="font-mono text-[#b88e44] font-bold">
                        {haji.registrationRef || haji.id}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">ইউজার আইডি:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-[#0f2922] bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200">
                          {displayUserId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(displayUserId, 'হাজী ইউজার আইডি')}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                          title="কপি করুন"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">পাসওয়ার্ড:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-emerald-800 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200">
                          {isPasswordVisible
                            ? haji.hajiPassword || 'Haji12'
                            : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePassword(haji.id)}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                          title={isPasswordVisible ? 'লুকান' : 'দেখুন'}
                        >
                          {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body: 4-Column Detailed Information Grid */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Column 1: Identity & DOB */}
                  <div className="space-y-2 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80">
                    <span className="font-bold text-[#0f2922] flex items-center gap-1.5 border-b border-stone-200 pb-1">
                      <User className="w-3.5 h-3.5 text-[#b88e44]" />
                      পরিচয় ও জন্ম তথ্য
                    </span>
                    <div>
                      <span className="text-stone-500 block">জন্ম তারিখ (DOB):</span>
                      <span className="font-mono font-semibold text-stone-800">
                        {haji.dateOfBirth || 'প্রদান করা হয়নি'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">NID নম্বর:</span>
                      <span className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block">
                        {haji.nidNo || 'নেই'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">পাসপোর্ট নম্বর:</span>
                      <span className="font-mono font-bold text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 inline-block">
                        {haji.passportNo || 'নেই'}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Parents Information */}
                  <div className="space-y-2 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80">
                    <span className="font-bold text-[#0f2922] flex items-center gap-1.5 border-b border-stone-200 pb-1">
                      <Users className="w-3.5 h-3.5 text-[#b88e44]" />
                      পিতা ও মাতার তথ্য
                    </span>
                    <div>
                      <span className="text-stone-500 block">পিতার নাম (বাংলা/ইংরেজি):</span>
                      <span className="font-semibold text-stone-800 block">
                        {haji.fatherNameBn || '—'}
                      </span>
                      {haji.fatherNameEn && (
                        <span className="font-mono text-[11px] text-stone-500 block">
                          {haji.fatherNameEn}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-stone-500 block">মাতার নাম (বাংলা/ইংরেজি):</span>
                      <span className="font-semibold text-stone-800 block">
                        {haji.motherNameBn || '—'}
                      </span>
                      {haji.motherNameEn && (
                        <span className="font-mono text-[11px] text-stone-500 block">
                          {haji.motherNameEn}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Contact & Addresses */}
                  <div className="space-y-2 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80">
                    <span className="font-bold text-[#0f2922] flex items-center gap-1.5 border-b border-stone-200 pb-1">
                      <Phone className="w-3.5 h-3.5 text-[#b88e44]" />
                      যোগাযোগ ও ঠিকানা
                    </span>
                    <div>
                      <span className="text-stone-500 block">মোবাইল নম্বর:</span>
                      <a
                        href={`tel:${haji.phone}`}
                        className="font-mono font-bold text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        {haji.phone}
                      </a>
                    </div>
                    {haji.guardianPhone && (
                      <div>
                        <span className="text-stone-500 block">অভিভাবকের ফোন:</span>
                        <a
                          href={`tel:${haji.guardianPhone}`}
                          className="font-mono font-semibold text-stone-700 hover:underline"
                        >
                          {haji.guardianPhone}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-stone-500 block">বর্তমান ঠিকানা:</span>
                      <span className="text-stone-800 leading-tight block">
                        {haji.presentAddress || 'প্রদান করা হয়নি'}
                        {haji.presentPostCode && ` (পোস্ট: ${haji.presentPostCode})`}
                      </span>
                    </div>
                    {haji.permanentAddress && (
                      <div>
                        <span className="text-stone-500 block">স্থায়ী ঠিকানা:</span>
                        <span className="text-stone-700 leading-tight block text-[11px]">
                          {haji.permanentAddress}
                          {haji.permanentPostCode && ` (পোস্ট: ${haji.permanentPostCode})`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Column 4: Package & Haj Partners */}
                  <div className="space-y-2 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80">
                    <span className="font-bold text-[#0f2922] flex items-center gap-1.5 border-b border-stone-200 pb-1">
                      <Compass className="w-3.5 h-3.5 text-[#b88e44]" />
                      হজ্ব পার্টনার ও গ্রুপ কাফেলা
                    </span>
                    <div>
                      <span className="text-stone-500 block">কাফেলা গ্রুপ:</span>
                      <span className="font-bold text-purple-950 bg-purple-100 px-2 py-0.5 rounded border border-purple-300 inline-block text-[11px]">
                        🏷️ {haji.selectedGroup || 'গ্রুপ বরাদ্দ বাকি'} (সর্বোচ্চ ৫০ জন)
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">মোট হজ্ব পার্টনার:</span>
                      <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block text-[11px]">
                        👥 {haji.totalHajPartner || '০ জন (একক হাজী)'}
                      </span>
                    </div>
                    {haji.hajPartnerIdLink && (
                      <div>
                        <span className="text-stone-500 block">পার্টনার আইডি/লিংক:</span>
                        <span className="font-mono font-bold text-[#0f2922] bg-[#DCB473]/20 px-1.5 py-0.5 rounded border border-[#DCB473]/40 inline-block">
                          {haji.hajPartnerIdLink}
                        </span>
                      </div>
                    )}
                    {haji.partnerDetails && (
                      <div>
                        <span className="text-stone-500 block">সহযাত্রীদের নাম ও তথ্য:</span>
                        <p className="text-stone-700 bg-white p-1.5 rounded border border-stone-200 text-[11px] leading-snug">
                          {haji.partnerDetails}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Haji Pricing & Admin Discount Controller Banner */}
                <div className="mx-4 sm:mx-6 my-3 p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-[#0f2922] to-[#14352b] text-white border border-[#DCB473]/50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#DCB473] bg-[#DCB473]/20 px-2.5 py-0.5 rounded-full border border-[#DCB473]/30 flex items-center gap-1">
                        <Receipt className="w-3 h-3" />
                        প্যাকেজ ও খরচ বিবরণ
                      </span>
                      {haji.discountPercent && haji.discountPercent > 0 ? (
                        <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                          <BadgePercent className="w-3.5 h-3.5" />
                          {haji.discountPercent}% বিশেষ ছাড় কার্যকর
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-300">
                          (কোনো ছাড় প্রয়োগ করা হয়নি)
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-300 flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                      <span>প্যাকেজ: <strong className="text-white">{haji.serviceName || 'ওমরাহ/হজ্ব কাফেলা'}</strong></span>
                      {haji.roomPreference && <span>• রুম: <strong className="text-white">{haji.roomPreference}</strong></span>}
                      {haji.airfareOption && <span>• ফ্লাইট: <strong className="text-white">{haji.airfareOption}</strong></span>}
                      <span>• মোট যাত্রী: <strong className="text-white">{haji.travelersCount || 1} জন</strong></span>
                    </div>

                    {haji.discountNote && (
                      <p className="text-[11px] text-[#DCB473] italic">
                        ছাড়ের কারণ/মন্তব্য: "{haji.discountNote}"
                      </p>
                    )}
                  </div>

                  {/* Pricing Values & Admin Discount Trigger */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                    <div className="text-right">
                      {haji.discountPercent && haji.discountPercent > 0 ? (
                        <div>
                          <div className="text-xs text-stone-400 line-through tabular-nums">
                            মূল প্রাক্কলন: ৳ {(haji.subtotalAmount || (haji.finalTotalAmount ? haji.finalTotalAmount + (haji.discountAmount || 0) : 0)).toLocaleString('bn-BD')}
                          </div>
                          <div className="text-xs text-amber-300 tabular-nums">
                            ছাড় (-{haji.discountPercent}%): - ৳ {(haji.discountAmount || 0).toLocaleString('bn-BD')}
                          </div>
                          <div className="text-lg font-extrabold text-[#DCB473] font-mono tabular-nums">
                            নিট প্রদেয়: ৳ {(haji.finalTotalAmount || 0).toLocaleString('bn-BD')}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[11px] text-stone-300">মোট নির্ধারিত মূল্য:</div>
                          <div className="text-lg font-extrabold text-[#DCB473] font-mono tabular-nums">
                            ৳ {(haji.subtotalAmount || haji.finalTotalAmount || 165000).toLocaleString('bn-BD')}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action button to open Discount Modal */}
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountHaji(haji);
                        setDiscountPercentInput(haji.discountPercent || 0);
                        setDiscountNoteInput(haji.discountNote || '');
                      }}
                      className="px-3.5 py-2 bg-[#DCB473] hover:bg-[#c99f5e] text-[#0f2922] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
                    >
                      <BadgePercent className="w-3.5 h-3.5" />
                      <span>{haji.discountPercent && haji.discountPercent > 0 ? 'ছাড় পরিবর্তন / মুছুন (%)' : 'পার্সেন্ট ছাড় দিন (%)'}</span>
                    </button>
                  </div>
                </div>

                {/* Uploaded Documents Strip */}
                {(haji.photoUrl || haji.signatureUrl || haji.nidDocUrl || haji.passportDocUrl) && (
                  <div className="px-4 sm:px-6 py-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                      সংযুক্ত ডকুমেন্টস:
                    </span>

                    {/* Photo */}
                    {haji.photoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDoc({
                            url: haji.photoUrl!,
                            title: 'হাজীর পাসপোর্ট সাইজ ছবি',
                            hajiName: haji.nameBn || haji.name
                          })
                        }
                        className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>ছবি</span>
                      </button>
                    )}

                    {/* Signature */}
                    {haji.signatureUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDoc({
                            url: haji.signatureUrl!,
                            title: 'আবেদনকারী হাজীর স্বাক্ষর',
                            hajiName: haji.nameBn || haji.name
                          })
                        }
                        className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-800 rounded-xl border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-blue-600" />
                        <span>স্বাক্ষর</span>
                      </button>
                    )}

                    {/* NID */}
                    {haji.nidDocUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDoc({
                            url: haji.nidDocUrl!,
                            title: 'জাতীয় পরিচয়পত্র (NID) কপি',
                            hajiName: haji.nameBn || haji.name
                          })
                        }
                        className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-amber-600" />
                        <span>NID কার্ড</span>
                      </button>
                    )}

                    {/* Passport */}
                    {haji.passportDocUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDoc({
                            url: haji.passportDocUrl!,
                            title: 'পাসপোর্ট মূল কপি',
                            hajiName: haji.nameBn || haji.name
                          })
                        }
                        className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-800 rounded-xl border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-purple-600" />
                        <span>পাসপোর্ট স্ক্যান</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Footer Action Bar: Approve, Edit, Delete, Print */}
                <div className="p-4 sm:p-5 bg-stone-100/70 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Primary Action: APPROVE BUTTON */}
                    {isPending ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(haji)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>আবেদনটি অনুমোদন করুন (Approve)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateInquiryStatus(haji.id, 'pending', 'পুনরায় অপেক্ষমাণ করা হয়েছে')}
                        className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>পেন্ডিংয়ে পরিবর্তন</span>
                      </button>
                    )}

                    {/* Status Select Switcher */}
                    <select
                      value={haji.status}
                      onChange={(e) => updateInquiryStatus(haji.id, e.target.value as InquiryItem['status'])}
                      className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-medium text-stone-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#DCB473]"
                    >
                      <option value="pending">অপেক্ষমাণ (Pending)</option>
                      <option value="approved">অনুমোদিত (Approved)</option>
                      <option value="contacted">যোগাযোগ সম্পন্ন (Contacted)</option>
                      <option value="rejected">বাতিল (Rejected)</option>
                    </select>

                    {haji.approvedAt && (
                      <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        অনুমোদনের তারিখ: {haji.approvedAt}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Discount % Controller Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountHaji(haji);
                        setDiscountPercentInput(haji.discountPercent || 0);
                        setDiscountNoteInput(haji.discountNote || '');
                      }}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="হাজীর মূল্যে ইচ্ছামত পার্সেন্ট ছাড় দিন বা এডিট/ডিলিট করুন"
                    >
                      <BadgePercent className="w-3.5 h-3.5 text-amber-700" />
                      <span>{haji.discountPercent && haji.discountPercent > 0 ? `ছাড় (${haji.discountPercent}%)` : 'পার্সেন্ট ছাড় (%)'}</span>
                    </button>

                    {/* Print Slip */}
                    <button
                      type="button"
                      onClick={() => setPrintHaji(haji)}
                      className="px-3 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title="নিবন্ধন স্লিপ ও সারসংক্ষেপ"
                    >
                      <Printer className="w-3.5 h-3.5 text-stone-600" />
                      <span>স্লিপ প্রিন্ট</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => openInquiryModal(haji)}
                      className="px-3.5 py-2 bg-[#0f2922] hover:bg-[#184236] text-[#DCB473] font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="সম্পূর্ণ তথ্য সম্পাদনা করুন"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>সম্পাদনা (Edit)</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(haji)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="আবেদন মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন (Delete)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative border border-stone-200 space-y-3">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Compass className="w-5 h-5 text-[#b88e44]" />
              <div>
                <h4 className="font-bold text-sm text-[#0f2922]">{previewDoc.title}</h4>
                <p className="text-xs text-stone-500">হাজী: {previewDoc.hajiName}</p>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-stone-900 rounded-2xl p-2">
              <img
                src={previewDoc.url}
                alt={previewDoc.title}
                className="max-h-[65vh] w-auto rounded-xl object-contain shadow-md"
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <a
                href={previewDoc.url}
                target="_blank"
                rel="noreferrer"
                download="haji-doc.jpg"
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>ডাউনলোড / নতুন ট্যাবে ওপেন</span>
              </a>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-[#0f2922] text-[#DCB473] font-bold rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HAJI PRINT SLIP MODAL */}
      {printHaji && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border-2 border-[#DCB473] max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setPrintHaji(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header */}
            <div className="text-center pb-4 border-b-2 border-stone-800 space-y-1">
              <span className="text-xs font-bold text-[#b88e44] uppercase tracking-wider">
                মুত্তাকী হজ্ব কাফেলা ও ট্রাভেলস
              </span>
              <h3 className="text-xl font-bold text-[#0f2922]">
                হাজী প্রাক-নিবন্ধন আবেদন রশিদ ও সারসংক্ষেপ
              </h3>
              <p className="text-xs text-stone-500">
                হেড অফিস: দুপচাঁচিয়া বাসস্ট্যান্ড, বগুড়া | মোবাইল: ০১৭১১-২২৩৩৪৪
              </p>
            </div>

            {/* Slip Details Table */}
            <div className="border border-stone-300 rounded-2xl overflow-hidden text-xs">
              <div className="grid grid-cols-2 bg-stone-100 p-2.5 font-bold border-b border-stone-300">
                <span>রেফারেন্স আইডি: {printHaji.registrationRef || printHaji.id}</span>
                <span className="text-right">আবেদনের তারিখ: {printHaji.date}</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-stone-500">হাজীর নাম:</span>
                  <span className="font-bold text-stone-900">{printHaji.nameBn || printHaji.name}</span>
                </div>
                {printHaji.nameEn && (
                  <div className="flex justify-between border-b pb-1 font-mono">
                    <span className="text-stone-500 font-sans">ইংরেজি নাম:</span>
                    <span className="font-semibold text-stone-800">{printHaji.nameEn}</span>
                  </div>
                )}
                <div className="flex justify-between border-b pb-1">
                  <span className="text-stone-500">ইউজার আইডি (Login User ID):</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {printHaji.hajiUserId || printHaji.registrationRef || printHaji.phone}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-stone-500">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-stone-800">{printHaji.phone}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-stone-500">পাসপোর্ট নম্বর:</span>
                  <span className="font-mono text-stone-800">{printHaji.passportNo || 'নেই'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-stone-500">NID নম্বর:</span>
                  <span className="font-mono text-stone-800">{printHaji.nidNo || 'নেই'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-stone-500">নির্বাচিত প্যাকেজ:</span>
                  <span className="font-semibold text-emerald-900">{printHaji.serviceName}</span>
                </div>
                {printHaji.selectedGroup && (
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-stone-500">কাফেলা গ্রুপ:</span>
                    <span className="font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {printHaji.selectedGroup} (সর্বোচ্চ ৫০ জন)
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b pb-1">
                  <span className="text-stone-500">মোট পার্টনার / যাত্রী:</span>
                  <span className="font-semibold text-stone-800">
                    {printHaji.totalHajPartner || '১ জন (একক)'}
                  </span>
                </div>
                {/* Pricing in Print Slip */}
                <div className="pt-2 border-t border-stone-200 space-y-1 bg-stone-50 p-2.5 rounded-xl text-stone-700">
                  <div className="flex justify-between">
                    <span>মূল প্রাক্কলিত ফি (Subtotal):</span>
                    <span className="font-mono font-bold text-stone-900">
                      ৳ {(printHaji.subtotalAmount || (printHaji.finalTotalAmount ? printHaji.finalTotalAmount + (printHaji.discountAmount || 0) : 0)).toLocaleString('bn-BD')}
                    </span>
                  </div>
                  {printHaji.discountPercent && printHaji.discountPercent > 0 ? (
                    <>
                      <div className="flex justify-between text-amber-700 font-semibold">
                        <span>এডমিন বিশেষ ছাড় ({printHaji.discountPercent}%):</span>
                        <span className="font-mono tabular-nums">
                          - ৳ {(printHaji.discountAmount || 0).toLocaleString('bn-BD')}
                        </span>
                      </div>
                      {printHaji.discountNote && (
                        <div className="text-[10px] text-stone-500 italic">
                          নোট: {printHaji.discountNote}
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-emerald-950 text-sm pt-1 border-t border-stone-200">
                        <span>চূড়ান্ত নিট প্রদেয় ফি:</span>
                        <span className="font-mono font-extrabold text-emerald-800">
                          ৳ {(printHaji.finalTotalAmount || 0).toLocaleString('bn-BD')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-bold text-emerald-950 pt-1 border-t border-stone-200">
                      <span>মোট প্রদেয় ফি:</span>
                      <span className="font-mono font-extrabold text-emerald-800">
                        ৳ {(printHaji.subtotalAmount || printHaji.finalTotalAmount || 0).toLocaleString('bn-BD')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-stone-500">বর্তমান স্ট্যাটাস:</span>
                  <span className="font-bold uppercase text-emerald-800">
                    {printHaji.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ (পেন্ডিং)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Seal and Signatures */}
            <div className="pt-6 flex justify-between items-end text-xs text-stone-600">
              <div className="text-center">
                <div className="w-28 border-b border-stone-400 mb-1" />
                <span>আবেদনকারী হাজীর স্বাক্ষর</span>
              </div>
              <div className="text-center">
                <div className="w-28 border-b border-stone-400 mb-1" />
                <span>কাফেলা পরিচালকের স্বাক্ষর ও সিল</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-[#0f2922] text-[#DCB473] font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>সরাসরি প্রিন্ট করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintHaji(null)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HAJI DISCOUNT CONTROLLER MODAL */}
      {discountHaji && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border-2 border-[#DCB473]">
            <button
              onClick={() => setDiscountHaji(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3 mb-4 space-y-1">
              <span className="text-[10px] font-bold text-[#b88e44] uppercase tracking-wider flex items-center gap-1">
                <BadgePercent className="w-3.5 h-3.5" />
                হাজীর জন্য বিশেষ ছাড় (%) নির্ধারণ ও মূল্য হ্রাস
              </span>
              <h3 className="text-lg font-bold text-[#0f2922]">
                {discountHaji.nameBn || discountHaji.name}
              </h3>
              <p className="text-xs text-stone-500">
                রেফারেন্স: <span className="font-mono font-semibold">{discountHaji.registrationRef || discountHaji.id}</span> | প্যাকেজ: {discountHaji.serviceName}
              </p>
            </div>

            {/* Modal Calculation logic */}
            {(() => {
              const subtotal = discountHaji.subtotalAmount || (discountHaji.finalTotalAmount ? discountHaji.finalTotalAmount + (discountHaji.discountAmount || 0) : 165000);
              const validPercent = Math.max(0, Math.min(100, Number(discountPercentInput) || 0));
              const discountAmt = Math.round((subtotal * validPercent) / 100);
              const finalTotal = Math.max(0, subtotal - discountAmt);

              return (
                <div className="space-y-4">
                  {/* Current Base Price display */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
                    <span className="text-stone-600 font-semibold">মূল প্যাকেজ খরচ (Subtotal):</span>
                    <span className="font-mono text-base font-bold text-stone-900">
                      ৳ {subtotal.toLocaleString('bn-BD')}
                    </span>
                  </div>

                  {/* Discount Percentage Input & Quick Buttons */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                      <span>ছাড়ের হার (Discount Percentage %) *</span>
                      <span className="text-xs font-mono font-bold text-[#b88e44]">
                        {validPercent}% ছাড়
                      </span>
                    </label>

                    <div className="relative mb-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        value={discountPercentInput}
                        onChange={(e) => setDiscountPercentInput(Number(e.target.value) || 0)}
                        placeholder="যেকোনো পার্সেন্ট লিখুন (যেমন: ৫, ১০, ১৫)"
                        className="w-full px-3.5 py-2.5 text-sm font-mono font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#DCB473] bg-white text-stone-900"
                      />
                      <span className="absolute right-3 top-2.5 font-bold text-stone-500 text-sm">
                        %
                      </span>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[0, 5, 10, 15, 20, 25, 30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setDiscountPercentInput(pct)}
                          className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer border ${
                            discountPercentInput === pct
                              ? 'bg-[#0f2922] text-[#DCB473] border-[#0f2922]'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                          }`}
                        >
                          {pct === 0 ? '০% (রিমুভ)' : `${pct}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Calculation Result Preview */}
                  <div className="p-4 bg-gradient-to-br from-[#0c241d] to-[#081813] text-white rounded-2xl border border-[#DCB473]/50 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-stone-300">
                      <span>মূল প্রাক্কলিত খরচ:</span>
                      <span className="font-mono tabular-nums">৳ {subtotal.toLocaleString('bn-BD')}</span>
                    </div>
                    <div className="flex justify-between items-center text-amber-300 font-bold">
                      <span>কর্তনকৃত ছাড়ের পরিমাণ ({validPercent}%):</span>
                      <span className="font-mono tabular-nums">- ৳ {discountAmt.toLocaleString('bn-BD')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/20 font-bold text-sm">
                      <span className="text-[#DCB473]">চূড়ান্ত নিট প্রদেয় মূল্য:</span>
                      <span className="font-mono text-lg font-extrabold text-[#DCB473] tabular-nums">
                        ৳ {finalTotal.toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </div>

                  {/* Optional Discount Note */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ছাড়ের কারণ / রেফারেন্স নোট (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={discountNoteInput}
                      onChange={(e) => setDiscountNoteInput(e.target.value)}
                      placeholder="যেমন: পরিবার ভিত্তিক বিশেষ ছাড়, গ্রুপ কোটা, মুক্তিযোদ্ধা"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#DCB473]"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
                    {discountHaji.discountPercent && discountHaji.discountPercent > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          removeHajiDiscount(discountHaji.id);
                          setDiscountHaji(null);
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ছাড় মুছে ফেলুন (০% রিসেট)</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDiscountHaji(null)}
                        className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          applyHajiDiscount(discountHaji.id, validPercent, discountNoteInput);
                          setDiscountHaji(null);
                        }}
                        className="px-5 py-2 bg-[#0f2922] text-[#DCB473] hover:bg-[#184236] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>ছাড় সংরক্ষণ ও প্রয়োগ করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
