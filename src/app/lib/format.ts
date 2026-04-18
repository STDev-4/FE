export const formatKrw = (amount: number | null | undefined) => {
  if (amount == null || Number.isNaN(amount)) return "0원";
  return `${Number(amount).toLocaleString("ko-KR")}원`;
};

export const formatPoint = (point: number | null | undefined) => {
  if (point == null || Number.isNaN(point)) return "0P";
  return `${Number(point).toLocaleString("ko-KR")}P`;
};

const CATEGORY_EMOJI: Record<string, string> = {
  "카페": "☕",
  "카페·음료": "☕",
  "음료": "☕",
  "배달": "🍔",
  "외식": "🍽️",
  "배달·외식": "🍔",
  "식비": "🍱",
  "쇼핑": "🛍️",
  "온라인 쇼핑": "🛒",
  "편의점": "🏪",
  "마트": "🛒",
  "교통": "🚌",
  "택시": "🚕",
  "주유": "⛽",
  "통신": "📱",
  "문화": "🎬",
  "취미": "🎨",
  "뷰티": "💄",
  "의료": "🏥",
  "주거": "🏠",
  "교육": "📚",
  "여행": "✈️",
  "기타": "💳",
};

export const categoryEmoji = (category: string): string => {
  if (!category) return "💳";
  if (CATEGORY_EMOJI[category]) return CATEGORY_EMOJI[category];
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (category.includes(key)) return emoji;
  }
  return "💳";
};
