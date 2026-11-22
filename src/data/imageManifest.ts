// Image manifest mapping property IDs to local photography assets
// All images are located locally in public/images/

export interface PropertyImageSet {
  exterior: string;
  living: string;
  bedroom: string;
  kitchen?: string;
  bathroom?: string;
  road?: string;
}

export const houseImageManifest: Record<string, PropertyImageSet> = {
  'list-yaba-2bed': {
    exterior: '/images/houses/list-yaba-2bed/exterior.jpg',
    living: '/images/houses/list-yaba-2bed/living.jpg',
    bedroom: '/images/houses/list-yaba-2bed/bedroom.jpg',
    kitchen: '/images/houses/list-yaba-2bed/kitchen.jpg',
    bathroom: '/images/houses/list-yaba-2bed/bathroom.jpg',
    road: '/images/houses/list-yaba-2bed/road.jpg',
  },
  'list-yaba-dup-tunde': {
    exterior: '/images/houses/list-yaba-dup-tunde/exterior.jpg',
    living: '/images/houses/list-yaba-dup-tunde/living.jpg',
    bedroom: '/images/houses/list-yaba-dup-tunde/bedroom.jpg',
    kitchen: '/images/houses/list-yaba-dup-tunde/kitchen.jpg',
    bathroom: '/images/houses/list-yaba-dup-tunde/bathroom.jpg',
    road: '/images/houses/list-yaba-dup-tunde/road.jpg',
  },
  'list-yaba-dup-funmi': {
    exterior: '/images/houses/list-yaba-dup-funmi/exterior.jpg',
    living: '/images/houses/list-yaba-dup-funmi/living.jpg',
    bedroom: '/images/houses/list-yaba-dup-funmi/bedroom.jpg',
    kitchen: '/images/houses/list-yaba-dup-funmi/kitchen.jpg',
    bathroom: '/images/houses/list-yaba-dup-funmi/bathroom.jpg',
    road: '/images/houses/list-yaba-dup-funmi/road.jpg',
  },
  'list-surulere-1bed': {
    exterior: '/images/houses/list-surulere-1bed/exterior.jpg',
    living: '/images/houses/list-surulere-1bed/living.jpg',
    bedroom: '/images/houses/list-surulere-1bed/bedroom.jpg',
    kitchen: '/images/houses/list-surulere-1bed/kitchen.jpg',
    bathroom: '/images/houses/list-surulere-1bed/bathroom.jpg',
    road: '/images/houses/list-surulere-1bed/road.jpg',
  },
  'list-surulere-2bed': {
    exterior: '/images/houses/list-surulere-2bed/exterior.jpg',
    living: '/images/houses/list-surulere-2bed/living.jpg',
    bedroom: '/images/houses/list-surulere-2bed/bedroom.jpg',
    kitchen: '/images/houses/list-surulere-2bed/kitchen.jpg',
    bathroom: '/images/houses/list-surulere-2bed/bathroom.jpg',
    road: '/images/houses/list-surulere-2bed/road.jpg',
  },
  'list-ikeja-3bed-gra': {
    exterior: '/images/houses/list-ikeja-3bed-gra/exterior.jpg',
    living: '/images/houses/list-ikeja-3bed-gra/living.jpg',
    bedroom: '/images/houses/list-ikeja-3bed-gra/bedroom.jpg',
    kitchen: '/images/houses/list-ikeja-3bed-gra/kitchen.jpg',
    bathroom: '/images/houses/list-ikeja-3bed-gra/bathroom.jpg',
    road: '/images/houses/list-ikeja-3bed-gra/road.jpg',
  },
  'list-ikeja-1bed-toyin': {
    exterior: '/images/houses/list-ikeja-1bed-toyin/exterior.jpg',
    living: '/images/houses/list-ikeja-1bed-toyin/living.jpg',
    bedroom: '/images/houses/list-ikeja-1bed-toyin/bedroom.jpg',
    kitchen: '/images/houses/list-ikeja-1bed-toyin/kitchen.jpg',
    bathroom: '/images/houses/list-ikeja-1bed-toyin/bathroom.jpg',
    road: '/images/houses/list-ikeja-1bed-toyin/road.jpg',
  },
  'list-lekki-2bed-admiralty': {
    exterior: '/images/houses/list-lekki-2bed-admiralty/exterior.jpg',
    living: '/images/houses/list-lekki-2bed-admiralty/living.jpg',
    bedroom: '/images/houses/list-lekki-2bed-admiralty/bedroom.jpg',
    kitchen: '/images/houses/list-lekki-2bed-admiralty/kitchen.jpg',
    bathroom: '/images/houses/list-lekki-2bed-admiralty/bathroom.jpg',
    road: '/images/houses/list-lekki-2bed-admiralty/road.jpg',
  },
  'list-lekki-1bed-freedom': {
    exterior: '/images/houses/list-lekki-1bed-freedom/exterior.jpg',
    living: '/images/houses/list-lekki-1bed-freedom/living.jpg',
    bedroom: '/images/houses/list-lekki-1bed-freedom/bedroom.jpg',
  },
  'list-yaba-self-contain': {
    exterior: '/images/houses/list-yaba-self-contain/exterior.jpg',
    living: '/images/houses/list-yaba-self-contain/living.jpg',
    bedroom: '/images/houses/list-yaba-self-contain/bedroom.jpg',
  },
  'list-ikeja-2bed-allen': {
    exterior: '/images/houses/list-ikeja-2bed-allen/exterior.jpg',
    living: '/images/houses/list-ikeja-2bed-allen/living.jpg',
    bedroom: '/images/houses/list-ikeja-2bed-allen/bedroom.jpg',
  },
  'list-surulere-3bed': {
    exterior: '/images/houses/list-surulere-3bed/exterior.jpg',
    living: '/images/houses/list-surulere-3bed/living.jpg',
    bedroom: '/images/houses/list-surulere-3bed/bedroom.jpg',
  },
  'list-lekki-3bed-penthouse': {
    exterior: '/images/houses/list-lekki-3bed-penthouse/exterior.jpg',
    living: '/images/houses/list-lekki-3bed-penthouse/living.jpg',
    bedroom: '/images/houses/list-lekki-3bed-penthouse/bedroom.jpg',
  },
  'list-surulere-1bed-budget': {
    exterior: '/images/houses/list-surulere-1bed-budget/exterior.jpg',
    living: '/images/houses/list-surulere-1bed-budget/living.jpg',
    bedroom: '/images/houses/list-surulere-1bed-budget/bedroom.jpg',
  },
};

export const agentPhotoManifest: Record<string, string> = {
  'user-agent-tunde': '/images/agents/agent-1.jpg',
  'user-agent-ngozi': '/images/agents/agent-2.jpg',
  'user-agent-prime': '/images/agents/agent-3.jpg',
  'user-agent-ibrahim': '/images/agents/agent-4.jpg',
  'user-agent-funmi': '/images/agents/agent-5.jpg',
  'user-agent-chidi': '/images/agents/agent-6.jpg',
};

export const neighbourhoodImageManifest: Record<string, string> = {
  yaba: '/images/neighbourhoods/yaba.jpg',
  surulere: '/images/neighbourhoods/surulere.jpg',
  ikeja: '/images/neighbourhoods/ikeja.jpg',
  'lekki-1': '/images/neighbourhoods/lekki.jpg',
};

export const heroImageManifest = {
  welcomeHero: '/images/hero/welcome-hero.jpg',
  emptyState: '/images/hero/empty-state.jpg',
};

export function getHouseImages(houseId: string): string[] {
  const set = houseImageManifest[houseId];
  if (!set) {
    return ['/images/houses/list-yaba-2bed/exterior.jpg', '/images/houses/list-yaba-2bed/living.jpg'];
  }
  const list = [set.exterior, set.living, set.bedroom];
  if (set.kitchen) list.push(set.kitchen);
  if (set.bathroom) list.push(set.bathroom);
  if (set.road) list.push(set.road);
  return list;
}
