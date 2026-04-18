// BE DTO mirror types. Keep in sync with MyAsset backend.

// ===== Auth =====
export interface SignupRequest {
  loginId: string;
  password: string;
  email: string;
  nickname: string;
  birthDate: string; // yyyy-MM-dd
}
export interface SignupResponse {
  userId: number;
  loginId: string;
  email: string;
  nickname: string;
  birthDate: string;
}
export interface LoginRequest {
  loginId: string;
  password: string;
}

// ===== Codef =====
// Mirrors io.api.myasset.domain.user.entity.InstitutionType
export type InstitutionType =
  | "CARD_KB"
  | "CARD_NH"
  | "CARD_SHINHAN"
  | "CARD_HANA"
  | "CARD_WOORI"
  | "CARD_BC"
  | "BANK_KB"
  | "BANK_NH"
  | "BANK_SHINHAN"
  | "BANK_HANA"
  | "BANK_WOORI"
  | "BANK_IBK"
  | "INVEST_MIRAE_ASSET"
  | "INVEST_SK"
  | "INVEST_NH"
  | "INVEST_NH_NAMU"
  | "INVEST_SHINHAN"
  | "INVEST_SAMSUNG";
export interface InstitutionCredential {
  institutionType: InstitutionType;
  loginId: string;
  loginPassword: string;
}
export interface CodefLinkRequest {
  institutions: InstitutionCredential[];
}
export interface CodefLinkResponse {
  linked: InstitutionType[];
  failed: InstitutionType[];
}
export type SyncStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
export interface SyncStatusResponse {
  status: SyncStatus;
}

// ===== Analysis =====
export type InsightColorType = "PRIMARY" | "POSITIVE" | "WARNING" | "NEUTRAL" | string;
export interface AnalysisInsightItemResponse {
  insightId: number;
  title: string;
  description: string;
  colorType: InsightColorType;
  actionTips: string[];
}
export interface CategorySpending {
  category: string;
  amount: number;
}
export interface SpendResponse {
  yearMonth: string;
  totalAmount: number;
  previousTotalAmount: number;
  categories: CategorySpending[];
}
export interface TopCategory {
  rank: number;
  category: string;
  amount: number;
}
export interface SpendingTopResponse {
  yearMonth: string;
  items: TopCategory[];
}

// ===== Character =====
export interface CharacterResponse {
  id: number;
  name: string;
  imageUrl: string;
  coinPrice: number;
  owned: boolean;
  active: boolean;
}
export interface CharacterListResponse {
  characters: CharacterResponse[];
  coin: number;
}
export interface ActiveCharacterRequest {
  characterId: number;
}

// ===== Home =====
export interface HomeSummaryResponse {
  currentImageName: string;
  tier: string;
  point: number;
  currentImageUrl: string;
  totalMissionCount: number;
  completedMissionCount: number;
  successRate: number;
}
export interface HomeRankingPercentileResponse {
  rankingPercentile: string;
  measuredAt: string;
}

// ===== League =====
export interface MyLeagueInfoResponse {
  nickname: string;
  profileImageUrl: string;
  point: number;
  tier: string;
  rank: number;
  lastLoginAt: string;
  isActive: boolean;
}
export interface LeagueRankingUserResponse {
  rank: number;
  nickname: string;
  profileImageUrl: string;
  point: number;
  lastLoginAt: string;
  isActive: boolean;
}
export interface LeagueRankingResponse {
  myInfo: MyLeagueInfoResponse;
  remainingTime: string;
  totalUserCount: number;
  rankings: LeagueRankingUserResponse[];
}
export interface LeagueSelectedRankingResponse {
  remainingTime: string;
  totalUserCount: number;
  rankings: LeagueRankingUserResponse[];
}

// ===== Missions =====
// Mirrors io.api.myasset.domain.mission.enums.MissionStatus
export type MissionStatusValue = "READY" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
// BE mission icon types (Mission.iconType): DELIVERY, CAFE, SHOPPING, TRANSPORT, FOOD, SAVING
export type MissionIconType =
  | "DELIVERY"
  | "CAFE"
  | "SHOPPING"
  | "TRANSPORT"
  | "FOOD"
  | "SAVING"
  | string;

export interface RecommendedMissionResponse {
  recommendationId: string;
  title: string;
  description: string;
  iconType: MissionIconType;
  rewardPoint: number;
  failPenaltyPoint: number;
  expectedSavingAmount: number;
}
export interface MissionStartRequest {
  recommendationId: string;
}
export interface MissionStartResponse {
  missionId: number;
  status: MissionStatusValue;
  startedAt: string;
}
export interface TodayMissionResponse {
  missionId: number;
  title: string;
  iconType: MissionIconType;
  status: MissionStatusValue;
  rewardPoint: number;
  failPenaltyPoint: number;
  autoEvaluateAt: string;
}
export interface MissionDetailResponse {
  missionId: number;
  title: string;
  description: string;
  iconType: MissionIconType;
  rewardPoint: number;
  failPenaltyPoint: number;
  expectedSavingAmount: number;
  status: MissionStatusValue;
  behaviorInsights: string[];
  statisticalReasons: string[];
}
export interface MissionStatusCardResponse {
  todayMissionInProgressCount: number;
  todayMissionTotalCount: number;
  todayProgressPercent: number;
  autoEvaluateRemainingTime: string;
  totalPoint: number;
  pointToNextTier: number;
}

// ===== Tier =====
export interface TierMeResponse {
  tier: string;
  tierLabel: string;
  point: number;
  nextTier: string | null;
  nextTierLabel: string | null;
}
export interface RankingEntry {
  rank: number;
  userId: number;
  nickname: string;
  point: number;
  activeCharacterImageUrl: string;
}
export interface TierLeagueRankingResponse {
  tier: string;
  rankings: RankingEntry[];
}

// ===== User =====
export interface ActiveCharacterInfo {
  id: number;
  name: string;
  imageUrl: string;
}
export interface UserMeResponse {
  nickname: string;
  tier: string;
  point: number;
  coin: number;
  activeCharacter: ActiveCharacterInfo;
}
