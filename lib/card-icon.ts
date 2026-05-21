import type { Card, CardType } from './game-data';

export type CardIconKey =
  | 'question'
  | 'action'
  | 'drink'
  | 'music'
  | 'art'
  | 'phone'
  | 'message'
  | 'heart'
  | 'camera';

type KeywordRule = {
  icon: CardIconKey;
  keywords: string[];
};

const KEYWORD_RULES: KeywordRule[] = [
  {
    icon: 'music',
    keywords: [
      'hat',
      'bai hat',
      'karaoke',
      'sing',
      'music',
      'am nhac',
      'rap',
      'giai dieu',
      'melody',
      'micro',
      'song',
    ],
  },
  {
    icon: 'art',
    keywords: [
      've',
      'to mau',
      'phac thao',
      'drawing',
      'draw',
      'paint',
      'doodle',
      'sketch',
      'tranh',
    ],
  },
  {
    icon: 'action',
    keywords: [
      'nhay',
      'mua',
      'dance',
      'tiktok',
      'hit dat',
      'push up',
      'chong day',
      'thu thach',
      'put their hand up',
      'hand up',
      'last person',
      'tao dang',
      'pose',
      'bat chuoc',
      'imitate',
    ],
  },
  {
    icon: 'phone',
    keywords: ['goi dien', 'goi', 'call', 'phone', 'facetime', 'dien thoai'],
  },
  {
    icon: 'message',
    keywords: ['nhan tin', 'message', 'text', 'dm', 'inbox', 'chat', 'sms'],
  },
  {
    icon: 'camera',
    keywords: [
      'story',
      'instagram',
      'livestream',
      'facebook',
      'post',
      'video',
      'live stream',
      'dang story',
      'dang bai',
      'quay video',
    ],
  },
  {
    icon: 'heart',
    keywords: [
      'crush',
      'yeu',
      'nguoi yeu',
      'hen ho',
      'date',
      'ghen',
      'hon',
      'kiss',
      'jealous',
      'love',
      'to tinh',
      'thich ban',
      'nguoi yeu cu',
      'ex',
      'stalk',
    ],
  },
  {
    icon: 'drink',
    keywords: [
      'uong',
      'drink',
      'shot',
      'beer',
      'ruou',
      'cocktail',
      'nhau',
      'cung uong',
    ],
  },
  {
    icon: 'question',
    keywords: ['bi mat', 'secret', 'noi doi', 'truth', 'ke ve', 'mo ta'],
  },
];

const TYPE_FALLBACK_ICON: Record<CardType, CardIconKey> = {
  truth: 'question',
  dare: 'action',
  do: 'drink',
};

const PUNISHMENT_KEYWORD_RULES: KeywordRule[] = [
  {
    icon: 'action',
    keywords: ['hit dat', 'push up', 'chong day', 'squat', 'burpee'],
  },
  {
    icon: 'music',
    keywords: ['mua', 'dance', 'nhay', 'cover dance'],
  },
  {
    icon: 'art',
    keywords: ['ve', 'draw', 'paint', 'sketch', 'to mau'],
  },
  {
    icon: 'drink',
    keywords: [
      'uong',
      'drink',
      'shot',
      'ly',
      'ngum',
      'finish',
      'finish your drink',
      'ca 2 uong',
      'tat ca uong',
      'cung uong',
    ],
  },
];

const normalizeForMatch = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const NORMALIZED_KEYWORD_RULES = KEYWORD_RULES.map((rule) => ({
  icon: rule.icon,
  keywords: rule.keywords.map((keyword) => normalizeForMatch(keyword)),
}));

const NORMALIZED_PUNISHMENT_KEYWORD_RULES = PUNISHMENT_KEYWORD_RULES.map((rule) => ({
  icon: rule.icon,
  keywords: rule.keywords.map((keyword) => normalizeForMatch(keyword)),
}));

export function getCardIconKey(card: Pick<Card, 'type' | 'content'>): CardIconKey {
  const normalizedContent = normalizeForMatch(card.content);

  for (const rule of NORMALIZED_KEYWORD_RULES) {
    if (rule.keywords.some((keyword) => normalizedContent.includes(keyword))) {
      return rule.icon;
    }
  }

  return TYPE_FALLBACK_ICON[card.type];
}

export function getPunishmentIconKey(punishment?: string): CardIconKey {
  if (!punishment?.trim()) return 'drink';

  const normalizedPunishment = normalizeForMatch(punishment);

  for (const rule of NORMALIZED_PUNISHMENT_KEYWORD_RULES) {
    if (rule.keywords.some((keyword) => normalizedPunishment.includes(keyword))) {
      return rule.icon;
    }
  }

  return 'drink';
}
