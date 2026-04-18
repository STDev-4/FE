export const tierOrder = ["master", "researcher", "explorer", "analyst", "sprout"] as const;
export type TierId = typeof tierOrder[number];

export const tierConfig: Record<TierId, {
  image: string;
  name: string;
  color: string;
  bg: string;
  leagueName: string;
  gradient: [string, string];
}> = {
  master:     { image: "/images/5-League-Master.png",     name: "절약 마스터",  color: "#D97706", bg: "#FFFBEB", leagueName: "마스터 리그",  gradient: ["#FCD34D", "#F59E0B"] },
  researcher: { image: "/images/4-League-Researcher.png", name: "절약 연구원",  color: "#F97316", bg: "#FFF7ED", leagueName: "연구원 리그",  gradient: ["#FB923C", "#EA580C"] },
  explorer:   { image: "/images/3-League-Explorer.png",   name: "소비 탐험가",  color: "#A855F7", bg: "#FAF5FF", leagueName: "탐험가 리그",  gradient: ["#C084FC", "#9333EA"] },
  analyst:    { image: "/images/2-League-Analyst.png",    name: "분석 입문자",  color: "#3B82F6", bg: "#EFF6FF", leagueName: "분석가 리그",  gradient: ["#60A5FA", "#2563EB"] },
  sprout:     { image: "/images/1-League-Seedling.png",   name: "새싹 절약러",  color: "#10B981", bg: "#ECFDF5", leagueName: "새싹 리그",    gradient: ["#34D399", "#059669"] },
};
