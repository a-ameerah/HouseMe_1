// Internationalization (i18n) strings placeholder for HouseMe
// Supporting Nigerian context: Simple English, Nigerian Pidgin, and Yoruba

export type LanguageCode = 'en' | 'pcm' | 'yo';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  discover: string;
  search: string;
  saved: string;
  viewings: string;
  profile: string;
  bookViewing: string;
  arrivalCode: string;
  notProvided: string;
  steadyPower: string;
  noFlooding: string;
  tarredRoad: string;
  prepaidMeter: string;
  escrowExplanation: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'HouseMe',
    tagline: 'Know before you go',
    discover: 'Discover',
    search: 'Search',
    saved: 'Saved',
    viewings: 'Viewings',
    profile: 'Profile',
    bookViewing: 'Book Viewing',
    arrivalCode: 'Arrival Code',
    notProvided: 'Not provided',
    steadyPower: 'Steady Power',
    noFlooding: 'No Flooding',
    tarredRoad: 'Tarred Road',
    prepaidMeter: 'Prepaid Meter',
    escrowExplanation: 'Your viewing fee is held safely in escrow until you inspect the house.',
  },
  pcm: {
    appName: 'HouseMe',
    tagline: 'Know wetin dey ground before you waka go look house',
    discover: 'Find House',
    search: 'Dey Check',
    saved: 'My Shortlist',
    viewings: 'Inspection Waka',
    profile: 'My Profile',
    bookViewing: 'Book Inspection',
    arrivalCode: 'Waka Code',
    notProvided: 'Dem never give this info',
    steadyPower: 'Light dey steady',
    noFlooding: 'Water no dey pack',
    tarredRoad: 'Road smooth well well',
    prepaidMeter: 'Prepaid meter dey separate',
    escrowExplanation: 'Your ₦4,000 dey safe with HouseMe until you reach the house inspect finish.',
  },
  yo: {
    appName: 'HouseMe',
    tagline: 'Mọ nkan to wa nile ki o to rin irin-ajo lo wo ile',
    discover: 'Ṣawari Ile',
    search: 'Wa Ile',
    saved: 'Awọn Ti Mo Fẹ',
    viewings: 'Irin-Ajo Wiwo Ile',
    profile: 'Profaili Mi',
    bookViewing: 'Ṣe Eto Wiwo Ile',
    arrivalCode: 'Koodu Idanimọ',
    notProvided: 'Wọn ko pese alaye yii',
    steadyPower: 'Ina duro daadaa',
    noFlooding: 'Omi ko le duro',
    tarredRoad: 'Opopona ti a tọju',
    prepaidMeter: 'Mita ina ti ara rẹ',
    escrowExplanation: 'Owo wiwo ile rẹ wa ni aabo pẹlu HouseMe titi iwọ yoo fi wo ile naa tan.',
  },
};

export function t(key: keyof TranslationDictionary, lang: LanguageCode = 'en'): string {
  return translations[lang]?.[key] || translations['en'][key];
}
