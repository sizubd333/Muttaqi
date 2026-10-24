import { KafelaGroup, InquiryItem } from '../types';

export const MAX_PILGRIMS_PER_GROUP = 50;

export const DEFAULT_KAFELA_GROUPS: KafelaGroup[] = [
  {
    id: 'grp-1',
    name: 'কাফেলা গ্রুপ ০১ (মূল হজ - ভিআইপি কাফেলা ২০২৬)',
    type: 'hajj',
    category: 'হজ্ব',
    leader: 'মাওলানা আব্দুল হক (প্রধান মোয়াল্লেম)',
    maxCapacity: 50,
    departureDate: 'জিলহজ ১৪৪৭ হি.',
    departureMonth: 'জিলহজ্ব ১৪৪৭ হি. (জুন ২০২৬)'
  },
  {
    id: 'grp-2',
    name: 'কাফেলা গ্রুপ ০২ (মূল হজ - সরকারি ও স্ট্যান্ডার্ড কাফেলা ২০২৬)',
    type: 'hajj',
    category: 'হজ্ব',
    leader: 'আলহাজ্ব মো: রফিকুল ইসলাম (পরিচালক)',
    maxCapacity: 50,
    departureDate: 'জিলহজ ১৪৪৭ হি.',
    departureMonth: 'জিলহজ্ব ১৪৪৭ হি. (জুন ২০২৬)'
  },
  {
    id: 'grp-3',
    name: 'কাফেলা গ্রুপ ০৩ (পবিত্র রমজান মোবারক ওমরাহ কাফেলা)',
    type: 'umrah',
    category: 'ওমরাহ',
    leader: 'মুফতি মাওলানা সাইফুল ইসলাম',
    maxCapacity: 50,
    departureDate: 'রমজানুল মোবারক ২০২৬',
    departureMonth: 'রমজান ২০২৬'
  },
  {
    id: 'grp-4',
    name: 'কাফেলা গ্রুপ ০৪ (শাওয়াল স্পেশাল ওমরাহ কাফেলা)',
    type: 'umrah',
    category: 'ওমরাহ',
    leader: 'মাওলানা মো: আব্দুর রহিম',
    maxCapacity: 50,
    departureDate: 'শাওয়াল ২০২৬',
    departureMonth: 'শাওয়াল ২০২৬'
  },
  {
    id: 'grp-5',
    name: 'কাফেলা গ্রুপ ০৫ (নভেম্বর-ডিসেম্বর শীতকালীন ওমরাহ কাফেলা)',
    type: 'umrah',
    category: 'ওমরাহ',
    leader: 'মুফতি কামরুল হাসান',
    maxCapacity: 50,
    departureDate: 'নভেম্বর ২০২৬',
    departureMonth: 'নভেম্বর ২০২৬'
  },
  {
    id: 'grp-6',
    name: 'কাফেলা গ্রুপ ০৬ (প্রিমিয়াম ফ্যামিলি ও প্রবীণ ওমরাহ কাফেলা)',
    type: 'umrah',
    category: 'ওমরাহ',
    leader: 'আলহাজ্ব মোস্তাফিজুর রহমান',
    maxCapacity: 50,
    departureDate: 'ডিসেম্বর ২০২৬',
    departureMonth: 'ডিসেম্বর ২০২৬'
  }
];

// Baseline registrations to simulate realistic ongoing batches
// Even if fresh database, groups will have realistic seat counts demonstrating the 50 limit!
const BASELINE_GROUP_COUNTS: Record<string, number> = {
  'grp-1': 42, // 8 seats left
  'grp-2': 28, // 22 seats left
  'grp-3': 50, // 0 seats left (Full! Demonstrates the 50 limit disabled state)
  'grp-4': 19, // 31 seats left
  'grp-5': 12, // 38 seats left
  'grp-6': 35  // 15 seats left
};

export interface GroupOccupancy {
  group: KafelaGroup;
  currentCount: number;
  maxCapacity: number;
  seatsLeft: number;
  isFull: boolean;
  progressPercent: number;
}

export const getGroupOccupancy = (
  group: KafelaGroup,
  inquiries: InquiryItem[] = []
): GroupOccupancy => {
  // Count real inquiries matching this group
  const realCount = inquiries.filter(
    (inq) =>
      inq.selectedGroup === group.name ||
      inq.selectedGroup === group.id ||
      (inq.serviceName && inq.serviceName.includes(group.name))
  ).length;

  const baseCount = BASELINE_GROUP_COUNTS[group.id] || 0;
  const currentCount = Math.min(MAX_PILGRIMS_PER_GROUP, baseCount + realCount);
  const seatsLeft = Math.max(0, MAX_PILGRIMS_PER_GROUP - currentCount);
  const isFull = currentCount >= MAX_PILGRIMS_PER_GROUP;
  const progressPercent = Math.round((currentCount / MAX_PILGRIMS_PER_GROUP) * 100);

  return {
    group,
    currentCount,
    maxCapacity: MAX_PILGRIMS_PER_GROUP,
    seatsLeft,
    isFull,
    progressPercent
  };
};

export const getAllGroupsOccupancy = (inquiries: InquiryItem[] = []): GroupOccupancy[] => {
  return DEFAULT_KAFELA_GROUPS.map((g) => getGroupOccupancy(g, inquiries));
};
