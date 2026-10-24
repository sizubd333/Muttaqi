import React from 'react';
import { InquiryItem } from '../types';
import {
  X,
  Compass,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  Home,
  Users,
  Link as LinkIcon,
  FileText,
  LogOut,
  MapPin,
  Calendar,
  Shield,
  Download,
  AlertCircle
} from 'lucide-react';

interface HajiPortalModalProps {
  haji: InquiryItem;
  onClose: () => void;
  onLogout: () => void;
}

export const HajiPortalModal: React.FC<HajiPortalModalProps> = ({
  haji,
  onClose,
  onLogout
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative border border-[#DCB473]/30 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Haji status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-stone-200 gap-3">
          <div className="flex items-center gap-3">
            {haji.photoUrl ? (
              <img
                src={haji.photoUrl}
                alt="হাজীর ছবি"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#DCB473] shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#0f2922] text-[#DCB473] flex items-center justify-center font-bold text-lg shadow-xs">
                <Compass className="w-7 h-7" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#0f2922]">
                  {haji.nameBn || haji.name}
                </h3>
                {haji.status === 'approved' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    অনুমোদিত
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-300">
                    <Clock className="w-3 h-3 text-amber-600" />
                    যাচাই প্রক্রিয়াধীন
                  </span>
                )}
              </div>
              {haji.nameEn && (
                <p className="text-xs font-mono font-medium text-stone-500 uppercase">
                  {haji.nameEn}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs font-mono">
                {haji.hajiUserId && (
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ইউজার আইডি: {haji.hajiUserId}
                  </span>
                )}
                <span className="text-[#b88e44] font-bold">
                  রেফারেন্স: {haji.registrationRef || haji.id}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="self-start sm:self-center px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>

        {/* Status Alert Banner */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl mb-4 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-950">
                মুত্তাকী হজ্ব ও ওমরাহ কাফেলায় স্বাগতম!
              </p>
              <p className="text-stone-600 mt-0.5 leading-relaxed">
                আপনার আবেদনটি আমাদের কেন্দ্রীয় সিস্টেমে সংরক্ষিত আছে। কাফেলা মোয়াল্লিম ও প্রশাসনিক টিম আপনার ডকুমেন্টসমূহ পর্যালোচনা করছেন।
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Package & Pilgrimage Details */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
            <h4 className="font-bold text-[#0f2922] uppercase tracking-wider text-[11px] pb-1.5 border-b border-stone-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#DCB473]" />
              নির্বাচিত প্যাকেজ ও কাফেলা বিবরণ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <span className="text-stone-500 block">প্যাকেজের নাম:</span>
                <span className="font-bold text-stone-900">{haji.serviceName}</span>
              </div>
              {haji.selectedGroup && (
                <div>
                  <span className="text-stone-500 block">কাফেলা গ্রুপ:</span>
                  <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded text-[11px] inline-block border border-purple-200">
                    🏷️ {haji.selectedGroup} (সর্বোচ্চ ৫০ জন)
                  </span>
                </div>
              )}
              <div>
                <span className="text-stone-500 block">রুম পছন্দ:</span>
                <span className="font-semibold text-stone-800">{haji.roomPreference || 'সাধারণ রুম'}</span>
              </div>
              <div>
                <span className="text-stone-500 block">নিবন্ধনের তারিখ:</span>
                <span className="font-mono text-stone-800">{haji.date}</span>
              </div>
              <div>
                <span className="text-stone-500 block">জরুরি যোগাযোগ / ফোন:</span>
                <span className="font-mono font-bold text-stone-800">{haji.phone}</span>
              </div>
            </div>
          </div>

          {/* Haj Partner & Total Partner Details */}
          {(haji.totalHajPartner || haji.hajPartnerIdLink || haji.partnerDetails) && (
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2 text-xs">
              <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px] pb-1.5 border-b border-amber-200/80 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                হজ্ব পার্টনার ও সহযাত্রী তথ্য (Haj Partner Details)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <span className="text-amber-800 block">মোট হজ্ব পার্টনার:</span>
                  <span className="font-bold text-amber-950 bg-amber-200/60 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                    {haji.totalHajPartner || 'একক'}
                  </span>
                </div>
                {haji.hajPartnerIdLink && (
                  <div>
                    <span className="text-amber-800 block">পার্টনার রেফারেন্স/আইডি:</span>
                    <span className="font-mono font-bold text-[#0f2922] bg-[#DCB473]/30 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                      {haji.hajPartnerIdLink}
                    </span>
                  </div>
                )}
              </div>

              {haji.partnerDetails && (
                <div className="pt-1.5 border-t border-amber-200/60">
                  <span className="text-amber-800 block mb-0.5 font-medium">সহযাত্রীদের নাম ও পরিচিতি:</span>
                  <p className="bg-white/80 p-2 rounded-lg text-stone-800">
                    {haji.partnerDetails}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Personal & Parent Information */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
            <h4 className="font-bold text-[#0f2922] uppercase tracking-wider text-[11px] pb-1.5 border-b border-stone-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#DCB473]" />
              ব্যক্তিগত ও পরিচয়পত্র তথ্য
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {haji.fatherNameBn && (
                <div>
                  <span className="text-stone-500 block">পিতার নাম:</span>
                  <span className="font-semibold text-stone-800">{haji.fatherNameBn}</span>
                </div>
              )}
              {haji.motherNameBn && (
                <div>
                  <span className="text-stone-500 block">মাতার নাম:</span>
                  <span className="font-semibold text-stone-800">{haji.motherNameBn}</span>
                </div>
              )}
              {haji.passportNo && (
                <div>
                  <span className="text-stone-500 block">পাসপোর্ট নম্বর:</span>
                  <span className="font-mono font-bold text-stone-800">{haji.passportNo}</span>
                </div>
              )}
              {haji.nidNo && (
                <div>
                  <span className="text-stone-500 block">এনআইডি নম্বর:</span>
                  <span className="font-mono font-bold text-stone-800">{haji.nidNo}</span>
                </div>
              )}
              {haji.guardianPhone && (
                <div>
                  <span className="text-stone-500 block">অভিভাবকের মোবাইল:</span>
                  <span className="font-mono text-stone-800">{haji.guardianPhone}</span>
                </div>
              )}
              {haji.dateOfBirth && (
                <div>
                  <span className="text-stone-500 block">জন্ম তারিখ:</span>
                  <span className="font-mono text-stone-800">{haji.dateOfBirth}</span>
                </div>
              )}
            </div>

            {haji.presentAddress && (
              <div className="pt-2 border-t border-stone-200">
                <span className="text-stone-500 block">বর্তমান ঠিকানা:</span>
                <span className="text-stone-800 font-medium">
                  {haji.presentAddress} {haji.presentPostCode ? `(পোস্ট কোড: ${haji.presentPostCode})` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Attached Documents Gallery */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
            <h4 className="font-bold text-[#0f2922] uppercase tracking-wider text-[11px] pb-1.5 border-b border-stone-200 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#DCB473]" />
              আপনার আপলোডকৃত ডকুমেন্টস
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-stone-600 block mb-1">পাসপোর্ট ছবি</span>
                {haji.photoUrl ? (
                  <a href={haji.photoUrl} target="_blank" rel="noreferrer" className="block group">
                    <img src={haji.photoUrl} alt="হাজীর ছবি" className="w-14 h-14 mx-auto rounded-lg object-cover border group-hover:opacity-80 transition-opacity" />
                    <span className="text-[9px] text-blue-600 underline mt-1 block">বড় করে দেখুন</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-stone-400 block py-3">সংযুক্ত নেই</span>
                )}
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-stone-600 block mb-1">স্বাক্ষর</span>
                {haji.signatureUrl ? (
                  <a href={haji.signatureUrl} target="_blank" rel="noreferrer" className="block group">
                    <img src={haji.signatureUrl} alt="স্বাক্ষর" className="w-14 h-14 mx-auto rounded-lg object-contain bg-stone-50 border group-hover:opacity-80 transition-opacity" />
                    <span className="text-[9px] text-blue-600 underline mt-1 block">বড় করে দেখুন</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-stone-400 block py-3">সংযুক্ত নেই</span>
                )}
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-stone-600 block mb-1">এনআইডি কপি</span>
                {haji.nidDocUrl ? (
                  <a href={haji.nidDocUrl} target="_blank" rel="noreferrer" className="block group">
                    <img src={haji.nidDocUrl} alt="NID" className="w-14 h-14 mx-auto rounded-lg object-cover border group-hover:opacity-80 transition-opacity" />
                    <span className="text-[9px] text-blue-600 underline mt-1 block">বড় করে দেখুন</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-stone-400 block py-3">সংযুক্ত নেই</span>
                )}
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-center">
                <span className="text-[10px] font-bold text-stone-600 block mb-1">পাসপোর্ট কপি</span>
                {haji.passportDocUrl ? (
                  <a href={haji.passportDocUrl} target="_blank" rel="noreferrer" className="block group">
                    <img src={haji.passportDocUrl} alt="Passport" className="w-14 h-14 mx-auto rounded-lg object-cover border group-hover:opacity-80 transition-opacity" />
                    <span className="text-[9px] text-blue-600 underline mt-1 block">বড় করে দেখুন</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-stone-400 block py-3">সংযুক্ত নেই</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-stone-200 flex justify-between items-center text-xs">
          <span className="text-stone-500 font-medium">
            জরুরি সহায়তা: <a href="tel:01712497676" className="font-bold text-[#0f2922] hover:underline">০১৭২৪-৯৭৬৭৭৬</a>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0f2922] text-[#DCB473] font-bold rounded-xl hover:bg-[#163f34] transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
