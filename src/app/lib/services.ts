import { api, captureAuthFromResponse, clearAuth } from "./api";
import type {
  AnalysisInsightItemResponse,
  CharacterListResponse,
  CodefLinkRequest,
  CodefLinkResponse,
  HomeRankingPercentileResponse,
  HomeSummaryResponse,
  LeagueRankingResponse,
  LeagueSelectedRankingResponse,
  LoginRequest,
  MissionDetailResponse,
  MissionStartRequest,
  MissionStartResponse,
  MissionStatusCardResponse,
  RecommendedMissionResponse,
  SignupRequest,
  SignupResponse,
  SpendResponse,
  SpendingTopResponse,
  SyncStatusResponse,
  TierLeagueRankingResponse,
  TierMeResponse,
  TodayMissionResponse,
  UserMeResponse,
} from "./types";

// ===== Auth =====
export const authApi = {
  async signup(body: SignupRequest) {
    const { data, res } = await api.postFull<SignupResponse>("/api/auth/signup", body, { skipAuth: true });
    await captureAuthFromResponse(res);
    return data;
  },
  async login(body: LoginRequest) {
    const { res } = await api.postFull<void>("/api/auth/login", body, { skipAuth: true });
    await captureAuthFromResponse(res);
  },
  async refresh() {
    const { res } = await api.postFull<void>("/api/auth/refresh", undefined, { skipAuth: true });
    await captureAuthFromResponse(res);
  },
  async logout() {
    try {
      await api.post<void>("/api/auth/logout");
    } finally {
      clearAuth();
    }
  },
};

// ===== Codef =====
export const codefApi = {
  link: (body: CodefLinkRequest) => api.post<CodefLinkResponse>("/api/codef/link", body),
  syncStatus: () => api.get<SyncStatusResponse>("/api/codef/sync/status"),
};

// ===== Analysis / Spending =====
export const analysisApi = {
  insights: () => api.get<AnalysisInsightItemResponse[]>("/api/analysis/insights"),
  spending: (yearMonth?: string) => api.get<SpendResponse>("/api/analysis/spending", { yearMonth }),
  topSpending: (limit?: number, yearMonth?: string) =>
    api.get<SpendingTopResponse>("/api/spending/top", { limit, yearMonth }),
};

// ===== Character =====
export const characterApi = {
  list: () => api.get<CharacterListResponse>("/api/characters"),
  unlock: (id: number) => api.post<void>(`/api/characters/${id}/unlock`),
  setActive: (characterId: number) => api.patch<void>(`/api/characters/active`, { characterId }),
};

// ===== Home =====
export const homeApi = {
  summary: () => api.get<HomeSummaryResponse>("/api/home/summary"),
  percentile: () => api.get<HomeRankingPercentileResponse>("/api/home/percentile"),
};

// ===== League =====
export const leagueApi = {
  ranking: (size?: number) => api.get<LeagueRankingResponse>("/api/league/ranking", { size }),
  selected: (tier: string, size?: number) =>
    api.get<LeagueSelectedRankingResponse>("/api/league/selected", { tier, size }),
};

// ===== Missions =====
export const missionsApi = {
  recommended: () => api.get<RecommendedMissionResponse[]>("/api/missions/recommended"),
  start: (body: MissionStartRequest) => api.post<MissionStartResponse>("/api/missions/start", body),
  today: () => api.get<TodayMissionResponse[]>("/api/missions/today"),
  detail: (id: number | string) => api.get<MissionDetailResponse>(`/api/missions/${id}`),
  statusCard: () => api.get<MissionStatusCardResponse>("/api/missions/status-card"),
};

// ===== Tier =====
export const tierApi = {
  me: () => api.get<TierMeResponse>("/api/tier/me"),
  league: (tierId: string) => api.get<TierLeagueRankingResponse>(`/api/tier/leagues/${tierId}`),
};

// ===== User =====
export const userApi = {
  me: () => api.get<UserMeResponse>("/api/users/me"),
};
