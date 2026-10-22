export type PageId = 'home' | 'services' | 'about' | 'gallery' | 'contact' | 'admin';

export interface ServiceItem {
  id: string;
  title: string;
  subtitle?: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  badge?: string;
  features: string[];
  isApproved?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  initials: string;
  phone?: string;
  isApproved?: boolean;
}

export interface IslamicPillar {
  id: number;
  nameBn: string;
  nameAr: string;
  meaning: string;
  description: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'hajj' | 'umrah' | 'holysites' | 'groups';
  image: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  description?: string;
  isApproved?: boolean;
  submittedBy?: string;
}

export interface PrayerTime {
  nameBn: string;
  nameEn: string;
  time: string;
  isPassed?: boolean;
  isNext?: boolean;
}

export interface CompanyInfo {
  name: string;
  nameEn: string;
  slogan: string;
  taglineAr: string;
  address: string;
  phone1: string;
  phone1Display: string;
  phone2: string;
  phone2Display: string;
  email: string;
  facebook: string;
  youtube: string;
  whatsapp: string;
  mapEmbedUrl: string;
  announcementText?: string;
  showAnnouncement?: boolean;
}

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  travelers: string;
  message?: string;
  date: string;
  status: 'pending' | 'approved' | 'contacted' | 'rejected';
  adminNotes?: string;
  approvedAt?: string;
  // Extended fields for Haji, Partner, and Sub-Admin registrations
  email?: string;
  registrationType?: 'haji' | 'partner' | 'sub_admin' | 'general';
  passportOrNid?: string;
  district?: string;
  roomPreference?: string;
  agencyName?: string;
  designation?: string;
  tradeLicense?: string;
  partnershipType?: string;
  registrationRef?: string;
  englishName?: string;
  subAdminPassword?: string;
  hajiUserId?: string;
  hajiPassword?: string;

  // Detailed Haji Registration Fields
  nameBn?: string;
  nameEn?: string;
  fatherNameBn?: string;
  fatherNameEn?: string;
  motherNameBn?: string;
  motherNameEn?: string;
  presentAddress?: string;
  presentPostCode?: string;
  permanentAddress?: string;
  permanentPostCode?: string;
  nidNo?: string;
  passportNo?: string;
  hajPartnerIdLink?: string;
  totalHajPartner?: string;
  partnerDetails?: string;
  dateOfBirth?: string;
  guardianPhone?: string;
  photoUrl?: string;
  signatureUrl?: string;
  nidDocUrl?: string;
  passportDocUrl?: string;

  // Pricing & Cost Breakdown Fields
  packageBasePrice?: number;
  roomPrice?: number;
  airfareOption?: string;
  airfarePrice?: number;
  incidentalItems?: { id: string; title: string; price: number }[];
  incidentalPrice?: number;
  perPersonTotal?: number;
  travelersCount?: number;
  subtotalAmount?: number;
  discountPercent?: number; // Custom admin discount percentage (e.g. 10 for 10%)
  discountAmount?: number;
  finalTotalAmount?: number;
  discountNote?: string;
  pricingUpdatedAt?: string;
}

export type PricingCategory = 'package' | 'room' | 'airfare' | 'incidental';

export interface PricingItem {
  id: string;
  title: string;
  category: PricingCategory;
  price: number; // in BDT ৳
  description?: string;
  subtitle?: string;
  durationDays?: number;
  unit?: string;
  isDefault?: boolean;
}

export interface KafelaPricingConfig {
  packages: PricingItem[];
  rooms: PricingItem[];
  airfares: PricingItem[];
  incidentals: PricingItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'approved' | 'contacted' | 'rejected';
  adminNotes?: string;
}

export interface SubAdminUser {
  id: string;
  englishName: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'sub_admin';
  createdAt: string;
  isApproved: boolean;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  packageTaken: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}
