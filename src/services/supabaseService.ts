import { supabase, SUPABASE_PROJECT_ID, SUPABASE_URL } from '../lib/supabase';
import {
  InquiryItem,
  ContactMessage,
  ReviewItem,
  CompanyInfo,
  KafelaPricingConfig,
  ServiceItem,
  TeamMember,
  GalleryItem
} from '../types';

export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- MUTTAQI HAJJ & UMRAH KAFELA - SUPABASE DATABASE SCHEMA
-- Project ID: ${SUPABASE_PROJECT_ID}
-- Run this in Supabase Dashboard -> SQL Editor
-- URL: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new
-- ========================================================

-- 1. Inquiries & Haji Registration Table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  registration_ref TEXT,
  haji_user_id TEXT,
  haji_password TEXT,
  name TEXT,
  name_bn TEXT,
  name_en TEXT,
  phone TEXT,
  email TEXT,
  service_id TEXT,
  service_name TEXT,
  travelers TEXT,
  total_haj_partner TEXT,
  haj_partner_id_link TEXT,
  partner_details TEXT,
  nid_no TEXT,
  passport_no TEXT,
  date_of_birth TEXT,
  guardian_phone TEXT,
  father_name_bn TEXT,
  father_name_en TEXT,
  mother_name_bn TEXT,
  mother_name_en TEXT,
  present_address TEXT,
  present_post_code TEXT,
  permanent_address TEXT,
  permanent_post_code TEXT,
  room_preference TEXT,
  registration_type TEXT,
  photo_url TEXT,
  signature_url TEXT,
  nid_doc_url TEXT,
  passport_doc_url TEXT,
  package_base_price NUMERIC,
  room_price NUMERIC,
  airfare_option TEXT,
  airfare_price NUMERIC,
  incidental_items JSONB,
  incidental_price NUMERIC,
  per_person_total NUMERIC,
  travelers_count NUMERIC,
  subtotal_amount NUMERIC,
  discount_percent NUMERIC,
  discount_amount NUMERIC,
  final_total_amount NUMERIC,
  discount_note TEXT,
  message TEXT,
  date TEXT,
  status TEXT DEFAULT 'pending',
  approved_at TEXT,
  admin_notes TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  date TEXT,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customer Reviews & Testimonials Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  name TEXT,
  location TEXT,
  package_taken TEXT,
  rating NUMERIC,
  comment TEXT,
  date TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Kafela Pricing Configuration Table
CREATE TABLE IF NOT EXISTS public.pricing_config (
  id TEXT PRIMARY KEY DEFAULT 'current',
  packages JSONB,
  rooms JSONB,
  airfares JSONB,
  incidentals JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Company Info & Announcements Table
CREATE TABLE IF NOT EXISTS public.company_info (
  id TEXT PRIMARY KEY DEFAULT 'current',
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Universal App Storage (Dynamic Key-Value Store for all state)
CREATE TABLE IF NOT EXISTS public.app_storage (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable Row Level Security (RLS) & Public Policies for App Access
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_storage ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for app integration
DROP POLICY IF EXISTS "Public access for inquiries" ON public.inquiries;
CREATE POLICY "Public access for inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for contact_messages" ON public.contact_messages;
CREATE POLICY "Public access for contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for reviews" ON public.reviews;
CREATE POLICY "Public access for reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for pricing_config" ON public.pricing_config;
CREATE POLICY "Public access for pricing_config" ON public.pricing_config FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for company_info" ON public.company_info;
CREATE POLICY "Public access for company_info" ON public.company_info FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for app_storage" ON public.app_storage;
CREATE POLICY "Public access for app_storage" ON public.app_storage FOR ALL USING (true) WITH CHECK (true);
`;

export interface SupabaseSyncStatus {
  isConnected: boolean;
  isTablesReady: boolean;
  lastSyncTime: string | null;
  pendingSyncCount: number;
  errorMessage: string | null;
}

// Convert InquiryItem camelCase to Supabase snake_case
const inquiryToDb = (item: InquiryItem) => ({
  id: item.id,
  registration_ref: item.registrationRef || null,
  haji_user_id: item.hajiUserId || null,
  haji_password: item.hajiPassword || null,
  name: item.name || '',
  name_bn: item.nameBn || null,
  name_en: item.nameEn || null,
  phone: item.phone || '',
  email: item.email || null,
  service_id: item.serviceId || null,
  service_name: item.serviceName || null,
  travelers: item.travelers || null,
  total_haj_partner: item.totalHajPartner || null,
  haj_partner_id_link: item.hajPartnerIdLink || null,
  partner_details: item.partnerDetails || null,
  nid_no: item.nidNo || null,
  passport_no: item.passportNo || null,
  date_of_birth: item.dateOfBirth || null,
  guardian_phone: item.guardianPhone || null,
  father_name_bn: item.fatherNameBn || null,
  father_name_en: item.fatherNameEn || null,
  mother_name_bn: item.motherNameBn || null,
  mother_name_en: item.motherNameEn || null,
  present_address: item.presentAddress || null,
  present_post_code: item.presentPostCode || null,
  permanent_address: item.permanentAddress || null,
  permanent_post_code: item.permanentPostCode || null,
  room_preference: item.roomPreference || null,
  registration_type: item.registrationType || 'general',
  photo_url: item.photoUrl || null,
  signature_url: item.signatureUrl || null,
  nid_doc_url: item.nidDocUrl || null,
  passport_doc_url: item.passportDocUrl || null,
  package_base_price: item.packageBasePrice ?? null,
  room_price: item.roomPrice ?? null,
  airfare_option: item.airfareOption || null,
  airfare_price: item.airfarePrice ?? null,
  incidental_items: item.incidentalItems || [],
  incidental_price: item.incidentalPrice ?? null,
  per_person_total: item.perPersonTotal ?? null,
  travelers_count: item.travelersCount ?? null,
  subtotal_amount: item.subtotalAmount ?? null,
  discount_percent: item.discountPercent ?? null,
  discount_amount: item.discountAmount ?? null,
  final_total_amount: item.finalTotalAmount ?? null,
  discount_note: item.discountNote || null,
  message: item.message || '',
  date: item.date || new Date().toISOString().split('T')[0],
  status: item.status || 'pending',
  approved_at: item.approvedAt || null,
  admin_notes: item.adminNotes || null,
  raw_data: item,
  updated_at: new Date().toISOString()
});

// Convert Supabase row to InquiryItem
const dbToInquiry = (row: any): InquiryItem => {
  if (row.raw_data && typeof row.raw_data === 'object') {
    return {
      ...row.raw_data,
      id: row.id,
      status: row.status || row.raw_data.status || 'pending',
      adminNotes: row.admin_notes || row.raw_data.adminNotes,
      approvedAt: row.approved_at || row.raw_data.approvedAt,
      discountPercent: row.discount_percent ?? row.raw_data.discountPercent,
      discountAmount: row.discount_amount ?? row.raw_data.discountAmount,
      finalTotalAmount: row.final_total_amount ?? row.raw_data.finalTotalAmount
    };
  }

  return {
    id: row.id,
    registrationRef: row.registration_ref,
    hajiUserId: row.haji_user_id,
    hajiPassword: row.haji_password,
    name: row.name,
    nameBn: row.name_bn,
    nameEn: row.name_en,
    phone: row.phone,
    email: row.email,
    serviceId: row.service_id,
    serviceName: row.service_name,
    travelers: row.travelers,
    totalHajPartner: row.total_haj_partner,
    hajPartnerIdLink: row.haj_partner_id_link,
    partnerDetails: row.partner_details,
    nidNo: row.nid_no,
    passportNo: row.passport_no,
    dateOfBirth: row.date_of_birth,
    guardianPhone: row.guardian_phone,
    fatherNameBn: row.father_name_bn,
    fatherNameEn: row.father_name_en,
    motherNameBn: row.mother_name_bn,
    motherNameEn: row.mother_name_en,
    presentAddress: row.present_address,
    presentPostCode: row.present_post_code,
    permanentAddress: row.permanent_address,
    permanentPostCode: row.permanent_post_code,
    roomPreference: row.room_preference,
    registrationType: row.registration_type,
    photoUrl: row.photo_url,
    signatureUrl: row.signature_url,
    nidDocUrl: row.nid_doc_url,
    passportDocUrl: row.passport_doc_url,
    packageBasePrice: row.package_base_price ? Number(row.package_base_price) : undefined,
    roomPrice: row.room_price ? Number(row.room_price) : undefined,
    airfareOption: row.airfare_option,
    airfarePrice: row.airfare_price ? Number(row.airfare_price) : undefined,
    incidentalItems: row.incidental_items || [],
    incidentalPrice: row.incidental_price ? Number(row.incidental_price) : undefined,
    perPersonTotal: row.per_person_total ? Number(row.per_person_total) : undefined,
    travelersCount: row.travelers_count ? Number(row.travelers_count) : undefined,
    subtotalAmount: row.subtotal_amount ? Number(row.subtotal_amount) : undefined,
    discountPercent: row.discount_percent ? Number(row.discount_percent) : undefined,
    discountAmount: row.discount_amount ? Number(row.discount_amount) : undefined,
    finalTotalAmount: row.final_total_amount ? Number(row.final_total_amount) : undefined,
    discountNote: row.discount_note,
    message: row.message,
    date: row.date,
    status: row.status,
    approvedAt: row.approved_at,
    adminNotes: row.admin_notes
  };
};

export const SupabaseService = {
  getProjectId: () => SUPABASE_PROJECT_ID,
  getUrl: () => SUPABASE_URL,

  // Test Supabase Connection & Table Availability
  async checkConnection(): Promise<{
    connected: boolean;
    tablesReady: boolean;
    message: string;
  }> {
    try {
      // Test querying the inquiries table
      const { error: inqError } = await supabase.from('inquiries').select('id').limit(1);

      if (!inqError) {
        return {
          connected: true,
          tablesReady: true,
          message: 'Supabase ডাটাবেজ সফলভাবে সংযুক্ত এবং টেবিলসমূহ সক্রিয় রয়েছে।'
        };
      }

      // Check if table missing error (PGRST205 or PGRST204)
      if (inqError.code === 'PGRST205' || inqError.message?.includes('Could not find the table')) {
        // Also test app_storage
        const { error: storageError } = await supabase.from('app_storage').select('key').limit(1);
        if (!storageError) {
          return {
            connected: true,
            tablesReady: true,
            message: 'Supabase সংযোগ সফল (app_storage স্টোরেজ সক্রিয়)।'
          };
        }

        return {
          connected: true,
          tablesReady: false,
          message: 'Supabase প্রজেক্ট কানেক্টেড, কিন্তু টেবিল তৈরি করা প্রয়োজন। নিচের SQL স্ক্রিপ্টটি চালান।'
        };
      }

      return {
        connected: false,
        tablesReady: false,
        message: inqError.message || 'Supabase এ কানেক্ট করতে সমস্যা হচ্ছে।'
      };
    } catch (err: any) {
      return {
        connected: false,
        tablesReady: false,
        message: err?.message || 'Supabase নেটওয়ার্ক ত্রুটি।'
      };
    }
  },

  // Save an inquiry or Haji registration to Supabase
  async saveInquiry(inquiry: InquiryItem): Promise<boolean> {
    try {
      const payload = inquiryToDb(inquiry);
      const { error } = await supabase
        .from('inquiries')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        // Fallback to app_storage if inquiries table doesn't exist
        if (error.code === 'PGRST205' || error.message?.includes('Could not find')) {
          await this.saveAppStorageItem('inquiries_backup', inquiry);
        } else {
          console.warn('Supabase inquiries upsert error:', error);
        }
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveInquiry exception:', err);
      return false;
    }
  },

  // Delete an inquiry from Supabase
  async deleteInquiry(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) {
        console.warn('Supabase deleteInquiry error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase deleteInquiry exception:', err);
      return false;
    }
  },

  // Fetch all inquiries from Supabase
  async fetchInquiries(): Promise<InquiryItem[] | null> {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code !== 'PGRST205') {
          console.warn('Supabase fetchInquiries error:', error);
        }
        return null;
      }

      if (data && Array.isArray(data)) {
        return data.map(dbToInquiry);
      }
      return [];
    } catch (err) {
      console.warn('Supabase fetchInquiries exception:', err);
      return null;
    }
  },

  // Save Pricing Configuration to Supabase
  async savePricingConfig(config: KafelaPricingConfig): Promise<boolean> {
    try {
      const { error } = await supabase.from('pricing_config').upsert({
        id: 'current',
        packages: config.packages,
        rooms: config.rooms,
        airfares: config.airfares,
        incidentals: config.incidentals,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) {
        if (error.code === 'PGRST205') {
          await this.saveAppStorageItem('pricing_config', config);
        } else {
          console.warn('Supabase savePricingConfig error:', error);
        }
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase savePricingConfig exception:', err);
      return false;
    }
  },

  // Fetch Pricing Configuration from Supabase
  async fetchPricingConfig(): Promise<KafelaPricingConfig | null> {
    try {
      const { data, error } = await supabase
        .from('pricing_config')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        packages: data.packages || [],
        rooms: data.rooms || [],
        airfares: data.airfares || [],
        incidentals: data.incidentals || []
      };
    } catch (err) {
      console.warn('Supabase fetchPricingConfig exception:', err);
      return null;
    }
  },

  // Save Contact Message to Supabase
  async saveContactMessage(msg: ContactMessage): Promise<boolean> {
    try {
      const { error } = await supabase.from('contact_messages').upsert({
        id: msg.id,
        name: msg.name,
        email: msg.email || null,
        phone: msg.phone,
        subject: msg.subject,
        message: msg.message,
        date: msg.date,
        status: msg.status || 'pending',
        admin_notes: msg.adminNotes || null,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase saveContactMessage error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveContactMessage exception:', err);
      return false;
    }
  },

  // Delete Contact Message from Supabase
  async deleteContactMessage(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // Fetch Contact Messages from Supabase
  async fetchContactMessages(): Promise<ContactMessage[] | null> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        subject: row.subject,
        message: row.message,
        date: row.date,
        status: row.status,
        adminNotes: row.admin_notes
      }));
    } catch {
      return null;
    }
  },

  // Save Review to Supabase
  async saveReview(review: ReviewItem): Promise<boolean> {
    try {
      const { error } = await supabase.from('reviews').upsert({
        id: review.id,
        name: review.name,
        location: review.location,
        package_taken: review.packageTaken,
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        is_approved: review.isApproved,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });

      return !error;
    } catch {
      return false;
    }
  },

  // Delete Review from Supabase
  async deleteReview(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // Fetch Reviews from Supabase
  async fetchReviews(): Promise<ReviewItem[] | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        location: row.location,
        packageTaken: row.package_taken,
        rating: Number(row.rating),
        comment: row.comment,
        date: row.date,
        isApproved: row.is_approved
      }));
    } catch {
      return null;
    }
  },

  // Save Company Info to Supabase
  async saveCompanyInfo(info: CompanyInfo): Promise<boolean> {
    try {
      const { error } = await supabase.from('company_info').upsert({
        id: 'current',
        data: info,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      return !error;
    } catch {
      return false;
    }
  },

  // Fetch Company Info from Supabase
  async fetchCompanyInfo(): Promise<CompanyInfo | null> {
    try {
      const { data, error } = await supabase
        .from('company_info')
        .select('data')
        .eq('id', 'current')
        .maybeSingle();

      if (error || !data?.data) return null;
      return data.data as CompanyInfo;
    } catch {
      return null;
    }
  },

  // Generic app_storage helper
  async saveAppStorageItem(key: string, value: any): Promise<boolean> {
    try {
      const { error } = await supabase.from('app_storage').upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

      return !error;
    } catch {
      return false;
    }
  },

  // Mass sync all local application data to Supabase
  async syncAllToSupabase(data: {
    inquiries: InquiryItem[];
    pricingConfig: KafelaPricingConfig;
    contactMessages: ContactMessage[];
    reviews: ReviewItem[];
    companyInfo: CompanyInfo;
  }): Promise<{
    success: boolean;
    syncedInquiries: number;
    syncedMessages: number;
    syncedReviews: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let syncedInquiries = 0;
    let syncedMessages = 0;
    let syncedReviews = 0;

    // 1. Sync Inquiries
    for (const inq of data.inquiries) {
      const ok = await this.saveInquiry(inq);
      if (ok) syncedInquiries++;
    }
    if (syncedInquiries < data.inquiries.length) {
      errors.push(`হাজী নিবন্ধন: ${data.inquiries.length - syncedInquiries} টি সিঙ্ক হয়নি (টেবিল তৈরি করা আছে কি না চেক করুন)`);
    }

    // 2. Sync Pricing
    const pricingOk = await this.savePricingConfig(data.pricingConfig);
    if (!pricingOk) {
      errors.push('প্যাকেজ ও মূল্য তালিকা সিঙ্ক হয়নি');
    }

    // 3. Sync Contact Messages
    for (const msg of data.contactMessages) {
      const ok = await this.saveContactMessage(msg);
      if (ok) syncedMessages++;
    }

    // 4. Sync Reviews
    for (const rev of data.reviews) {
      const ok = await this.saveReview(rev);
      if (ok) syncedReviews++;
    }

    // 5. Sync Company Info
    await this.saveCompanyInfo(data.companyInfo);

    // 6. Also save full snapshot in app_storage if available
    await this.saveAppStorageItem('full_backup_snapshot', {
      timestamp: new Date().toISOString(),
      inquiriesCount: data.inquiries.length,
      pricing: data.pricingConfig
    });

    return {
      success: errors.length === 0,
      syncedInquiries,
      syncedMessages,
      syncedReviews,
      errors
    };
  }
};
