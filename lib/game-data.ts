export type GameMode = 'classic' | 'chaos';
export type SpicyLevel = 'chill' | 'spicy' | 'wild';
export type CardType = 'truth' | 'dare' | 'do';

export interface Card {
  id: string;
  type: CardType;
  content: string;
  spicyLevel: SpicyLevel;
  punishment?: string;
}

export interface Player {
  id: string;
  name: string;
  completed: number;
  skipped: number;
}

export interface GameState {
  mode: GameMode;
  spicyLevel: SpicyLevel;
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;
  maxRounds: number;
  currentCard: Card | null;
  usedCardIds: string[];
}

// Card Database
export const CARD_DECK: Card[] = [
  // TRUTH CARDS - Chill
  {
    id: 't-chill-1',
    type: 'truth',
    content: 'Điều gì làm bạn hạnh phúc nhất tuần này?',
    spicyLevel: 'chill',
    punishment: 'Uống 1 ngụm nước'
  },
  {
    id: 't-chill-2',
    type: 'truth',
    content: 'Bài hát nào bạn nghe nhiều nhất gần đây?',
    spicyLevel: 'chill',
    punishment: 'Hít đất 5 cái'
  },
  {
    id: 't-chill-3',
    type: 'truth',
    content: 'Món ăn bạn không bao giờ từ chối là gì?',
    spicyLevel: 'chill',
    punishment: 'Múa 10 giây'
  },
  
  // TRUTH CARDS - Spicy
  {
    id: 't-spicy-1',
    type: 'truth',
    content: 'Người bạn thầm crush trong nhóm bạn là ai?',
    spicyLevel: 'spicy',
    punishment: 'Uống 2 shot'
  },
  {
    id: 't-spicy-2',
    type: 'truth',
    content: 'Điều gì bạn nói dối bố mẹ gần đây nhất?',
    spicyLevel: 'spicy',
    punishment: 'Hít đất 15 cái'
  },
  {
    id: 't-spicy-3',
    type: 'truth',
    content: 'Bạn đã từng ghen tị với ai trong phòng này?',
    spicyLevel: 'spicy',
    punishment: 'Uống 1 shot'
  },
  
  // TRUTH CARDS - Wild
  {
    id: 't-wild-1',
    type: 'truth',
    content: 'Mô tả chi tiết buổi hẹn hò tệ nhất của bạn',
    spicyLevel: 'wild',
    punishment: 'Uống 3 shot'
  },
  {
    id: 't-wild-2',
    type: 'truth',
    content: 'Kể về lần bạn bị bắt gặp trong tình huống khó xử nhất',
    spicyLevel: 'wild',
    punishment: 'Uống 2 shot + Hít đất 20'
  },
  {
    id: 't-wild-3',
    type: 'truth',
    content: 'Điều bạn không bao giờ dám nói với người yêu (hoặc crush)?',
    spicyLevel: 'wild',
    punishment: 'Finish your drink!'
  },
  
  // DARE CARDS - Chill
  {
    id: 'd-chill-1',
    type: 'dare',
    content: 'Nhảy một điệu nhảy TikTok bất kỳ trong 30 giây',
    spicyLevel: 'chill',
    punishment: 'Uống 1 ngụm'
  },
  {
    id: 'd-chill-2',
    type: 'dare',
    content: 'Nói 5 điều tốt về người bên trái bạn',
    spicyLevel: 'chill',
    punishment: 'Hít đất 10 cái'
  },
  {
    id: 'd-chill-3',
    type: 'dare',
    content: 'Hát 30 giây một bài hát mà người khác chọn',
    spicyLevel: 'chill',
    punishment: 'Múa 20 giây'
  },
  
  // DARE CARDS - Spicy
  {
    id: 'd-spicy-1',
    type: 'dare',
    content: 'Gọi điện cho người yêu cũ và nói "Em nhớ anh/chị"',
    spicyLevel: 'spicy',
    punishment: 'Uống 2 shot'
  },
  {
    id: 'd-spicy-2',
    type: 'dare',
    content: 'Để người khác đăng 1 story trên Instagram của bạn',
    spicyLevel: 'spicy',
    punishment: 'Uống 1 shot + Hít đất 20'
  },
  {
    id: 'd-spicy-3',
    type: 'dare',
    content: 'Nhắn tin "Anh/Em thích bạn" cho crush của bạn',
    spicyLevel: 'spicy',
    punishment: 'Uống 3 shot'
  },
  
  // DARE CARDS - Wild
  {
    id: 'd-wild-1',
    type: 'dare',
    content: 'Hôn má người bên phải bạn',
    spicyLevel: 'wild',
    punishment: 'Uống 3 shot'
  },
  {
    id: 'd-wild-2',
    type: 'dare',
    content: 'Livestream Facebook trong 2 phút làm điều điên rồ',
    spicyLevel: 'wild',
    punishment: 'Finish your drink + Hít đất 30'
  },
  {
    id: 'd-wild-3',
    type: 'dare',
    content: 'Kể một bí mật không ai biết về bạn',
    spicyLevel: 'wild',
    punishment: 'Finish your drink!'
  },
  
  // DO OR DRINK CARDS - Chaos Mode
  {
    id: 'do-chill-1',
    type: 'do',
    content: 'Uống nếu bạn đã từng nói dối trong tuần này',
    spicyLevel: 'chill',
    punishment: 'Uống 1 ngụm'
  },
  {
    id: 'do-spicy-1',
    type: 'do',
    content: 'Uống nếu bạn đã từng stalk người yêu cũ trên mạng xã hội',
    spicyLevel: 'spicy',
    punishment: 'Uống 1 shot'
  },
  {
    id: 'do-wild-1',
    type: 'do',
    content: 'Uống nếu bạn đã từng hôn ai đó trong phòng này',
    spicyLevel: 'wild',
    punishment: 'Uống 2 shot'
  },
  {
    id: 'do-chill-2',
    type: 'do',
    content: 'Mọi người cùng uống nếu đã từng đi du lịch nước ngoài',
    spicyLevel: 'chill',
    punishment: 'Tất cả uống 1 ngụm'
  },
  {
    id: 'do-spicy-2',
    type: 'do',
    content: 'Chọn 1 người uống với bạn. Người đó không được từ chối.',
    spicyLevel: 'spicy',
    punishment: 'Cả 2 uống 1 shot'
  },
  {
    id: 'do-wild-2',
    type: 'do',
    content: 'Last person to put their hand up drinks 3 shots!',
    spicyLevel: 'wild',
    punishment: 'Người chậm nhất uống 3 shot'
  }
];

// Helper functions
export function getCardsByMode(mode: GameMode, spicyLevel: SpicyLevel, deck: Card[] = CARD_DECK): Card[] {
  let filteredCards = deck.filter(card => {
    // Filter by spicy level (allow equal or lower level)
    const levelOrder: SpicyLevel[] = ['chill', 'spicy', 'wild'];
    const maxLevelIndex = levelOrder.indexOf(spicyLevel);
    const cardLevelIndex = levelOrder.indexOf(card.spicyLevel);
    
    if (cardLevelIndex > maxLevelIndex) return false;
    
    // Filter by mode
    if (mode === 'classic') {
      return card.type === 'truth' || card.type === 'dare';
    } else {
      return card.type === 'do' || card.type === 'dare';
    }
  });
  
  return filteredCards;
}

export function getRandomCard(availableCards: Card[], usedCardIds: string[]): Card | null {
  const unusedCards = availableCards.filter(card => !usedCardIds.includes(card.id));
  
  if (unusedCards.length === 0) {
    // Reset if all cards used
    return availableCards[Math.floor(Math.random() * availableCards.length)];
  }
  
  return unusedCards[Math.floor(Math.random() * unusedCards.length)];
}

export async function fetchCards(): Promise<Card[]> {
  try {
    const res = await fetch('/api/cards');
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Fetch /api/cards failed (${res.status}): ${errorBody}`);
    }
    const { cards } = await res.json();
    return cards as Card[];
  } catch (error) {
    console.error('[game-data] Failed to fetch cards, fallback to local deck', {
      error,
    });
    return CARD_DECK;
  }
}

export function getCardColor(type: CardType): string {
  switch (type) {
    case 'truth':
      return 'blue'; // Electric Blue
    case 'dare':
      return 'pink'; // Hot Pink
    case 'do':
      return 'red'; // Neon Red
    default:
      return 'green';
  }
}

export function getCardLabel(type: CardType): string {
  switch (type) {
    case 'truth':
      return 'TRUTH';
    case 'dare':
      return 'DARE';
    case 'do':
      return 'DO IT';
    default:
      return 'UNKNOWN';
  }
}
