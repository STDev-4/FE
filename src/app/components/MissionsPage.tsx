import { CheckCircle2, Clock, Star, XCircle, TrendingUp, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { tierConfig, tierIdFromBe } from "../constants/tierConfig";
import { missionsApi, tierApi } from "../lib/services";
import type {
  MissionStatusCardResponse,
  RecommendedMissionResponse,
  TierMeResponse,
  TodayMissionResponse,
} from "../lib/types";
import { formatPoint } from "../lib/format";

type MissionStatus = "completed" | "in-progress" | "failed" | "ready";

interface Mission {
  id: string;
  numericId?: number;
  recommendationId?: string;
  title: string;
  emoji: string;
  reward: number;
  status: MissionStatus;
  tierNote?: string;
  // Route-state payload passed to MissionDetailPage for recommendations
  raw?: RecommendedMissionResponse;
}

const ICON_EMOJI: Record<string, string> = {
  CAFE: "☕",
  COFFEE: "☕",
  DELIVERY: "🍔",
  FOOD: "🍱",
  SHOPPING: "🛍️",
  CONVENIENCE: "🏪",
  TRANSPORT: "🚌",
  LEISURE: "🎬",
  BEAUTY: "💄",
  DEFAULT: "🎯",
};
const iconEmoji = (type?: string) => (type && ICON_EMOJI[type.toUpperCase()]) || ICON_EMOJI.DEFAULT;

const mapStatus = (s: string | undefined): MissionStatus => {
  switch ((s || "").toUpperCase()) {
    case "COMPLETED":
    case "SUCCESS":
      return "completed";
    case "FAILED":
      return "failed";
    case "IN_PROGRESS":
    case "STARTED":
      return "in-progress";
    default:
      return "ready";
  }
};

function useRemainingCountdown(initial: string | null, targetIso: string | null) {
  const [display, setDisplay] = useState(initial || "--:--:--");
  useEffect(() => {
    if (!targetIso) {
      if (initial) setDisplay(initial);
      return;
    }
    const tick = () => {
      const diff = new Date(targetIso).getTime() - Date.now();
      if (Number.isNaN(diff) || diff <= 0) {
        setDisplay("00:00:00");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setDisplay(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [initial, targetIso]);
  return display;
}

const statusAccent: Record<MissionStatus, string> = {
  completed:   "#00D26A",
  "in-progress": "#3B82F6",
  failed:      "#EF4444",
  ready:       "#F59E0B",
};

function StatusBadge({ status }: { status: MissionStatus }) {
  switch (status) {
    case "completed":
      return (
        <span className="flex items-center gap-1 text-[13px] font-semibold text-[#00D26A] bg-[#EDFAF4] px-3 py-1 rounded-full">
          <CheckCircle2 size={13} strokeWidth={2.5} /> 성공
        </span>
      );
    case "failed":
      return (
        <span className="flex items-center gap-1 text-[13px] font-semibold text-[#EF4444] bg-[#FEF2F2] px-3 py-1 rounded-full">
          <XCircle size={13} strokeWidth={2.5} /> 실패
        </span>
      );
    case "in-progress":
      return (
        <span className="flex items-center gap-1 text-[13px] font-semibold text-[#3B82F6] bg-[#EFF6FF] px-3 py-1 rounded-full">
          <Clock size={13} strokeWidth={2.5} /> 진행 중
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#F59E0B] bg-[#FFFBEB] px-2.5 py-1 rounded-full">
          도전하기
        </span>
      );
  }
}

function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  const navigate = useNavigate();
  const isFailed = mission.status === "failed";
  const isCompleted = mission.status === "completed";
  void statusAccent;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => {
        if (mission.recommendationId) {
          navigate(`/app/mission/rec-${mission.recommendationId}`, {
            state: { recommendation: mission.raw },
          });
        } else {
          navigate(`/app/mission/${mission.numericId ?? mission.id}`);
        }
      }}
      className="w-full text-left rounded-2xl overflow-hidden flex items-center gap-3 transition-all bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] active:scale-[0.98]"
      style={{
        opacity: isFailed ? 0.75 : 1,
      }}
    >
      <div className="flex items-center gap-3 flex-1 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[20px]">{mission.emoji}</span>
            <span
              className={`text-[17px] font-semibold ${
                isFailed ? "text-[#9CA3AF] line-through" : "text-[#1A1A2E]"
              }`}
            >
              {mission.title}
            </span>
            <span
              className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                isFailed
                  ? "text-[#D1D5DB] bg-[#F9FAFB]"
                  : "text-[#F59E0B] bg-[#FFFBEB]"
              }`}
            >
              +{mission.reward}P
            </span>
          </div>
          <StatusBadge status={mission.status} />
          {mission.tierNote && !isFailed && !isCompleted && (
            <p className="text-[11px] text-[#3B82F6] mt-1.5 font-medium">{mission.tierNote}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {isCompleted && <CheckCircle2 size={22} className="text-[#00D26A]" />}
          {isFailed && <XCircle size={22} className="text-[#EF4444]" />}
          <ChevronRight size={16} className="text-[#C7C7CC]" />
        </div>
      </div>
    </motion.button>
  );
}

// BE returns [] for recommended when a concurrent GPT generation is in flight; poll until populated.
const RECOMMENDED_MAX_RETRIES = 8;
const RECOMMENDED_RETRY_DELAY_MS = 3000;

export default function MissionsPage() {
  const [tierMe, setTierMe] = useState<TierMeResponse | null>(null);
  const [statusCard, setStatusCard] = useState<MissionStatusCardResponse | null>(null);
  const [today, setToday] = useState<TodayMissionResponse[] | null>(null);
  const [recommended, setRecommended] = useState<RecommendedMissionResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    (async () => {
      setLoading(true);
      const [tierRes, statusRes, todayRes] = await Promise.allSettled([
        tierApi.me(),
        missionsApi.statusCard(),
        missionsApi.today(),
      ]);
      if (cancelled) return;
      if (tierRes.status === "fulfilled") setTierMe(tierRes.value);
      if (statusRes.status === "fulfilled") setStatusCard(statusRes.value);
      if (todayRes.status === "fulfilled") setToday(todayRes.value);
      setLoading(false);

      // Recommended missions are generated lazily on BE (GPT). First call may return [] while
      // another request holds the lock — retry a few times until populated.
      setRecommendedLoading(true);
      for (let attempt = 0; attempt < RECOMMENDED_MAX_RETRIES; attempt++) {
        try {
          const list = await missionsApi.recommended();
          if (cancelled) return;
          console.log(`[missions] recommended attempt ${attempt + 1}: ${list.length} items`);
          if (list.length > 0) {
            setRecommended(list);
            break;
          }
          setRecommended(list);
        } catch (e) {
          console.warn(`[missions] recommended attempt ${attempt + 1} error`, e);
        }
        if (attempt < RECOMMENDED_MAX_RETRIES - 1) {
          await sleep(RECOMMENDED_RETRY_DELAY_MS);
          if (cancelled) return;
        }
      }
      if (!cancelled) setRecommendedLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const todayMissions: Mission[] = useMemo(
    () =>
      (today ?? []).map((m) => ({
        id: String(m.missionId),
        numericId: m.missionId,
        title: m.title,
        emoji: iconEmoji(m.iconType),
        reward: m.rewardPoint,
        status: mapStatus(m.status),
        tierNote: `성공 시 +${m.rewardPoint}P / 실패 시 -${m.failPenaltyPoint}P`,
      })),
    [today]
  );

  // BE removes a recommendation from cache once accepted, so `recommended` naturally
  // reflects the currently-available pool. No extra dedup against today list is required.
  const readyMissions: Mission[] = useMemo(
    () =>
      (recommended ?? []).map((r) => ({
        id: r.recommendationId,
        recommendationId: r.recommendationId,
        title: r.title,
        emoji: iconEmoji(r.iconType),
        reward: r.rewardPoint,
        status: "ready" as MissionStatus,
        tierNote: `성공 시 +${r.rewardPoint}P / 실패 시 -${r.failPenaltyPoint}P`,
        raw: r,
      })),
    [recommended]
  );

  const tierId = tierIdFromBe(tierMe?.tier);
  const tier = tierConfig[tierId];

  // "진행중인 미션 현황"
  // - 분자: 진행중 미션 개수
  // - 분모: 추천 미션 + 진행중 미션 (FE 에서 계산; BE 의 todayMissionTotalCount 는 완료/실패 포함이라 여기서는 미사용)
  const inProgressCount = todayMissions.filter((m) => m.status === "in-progress").length;
  const recommendedCount = readyMissions.length;
  const totalToday = inProgressCount + recommendedCount;
  const progress = totalToday > 0 ? inProgressCount / totalToday : 0;

  const firstInProgressAt = useMemo(
    () => (today ?? []).find((m) => mapStatus(m.status) === "in-progress")?.autoEvaluateAt ?? null,
    [today]
  );
  const countdown = useRemainingCountdown(
    statusCard?.autoEvaluateRemainingTime ?? null,
    firstInProgressAt
  );

  const totalPoint = statusCard?.totalPoint ?? tierMe?.point ?? 0;
  const pointToNext = statusCard?.pointToNextTier ?? 0;

  return (
    <div className="pb-28 bg-[#F5F5F5] min-h-full">

      {/* Status strip */}
      <div
        className="mx-4 mt-4 mb-4 rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tier.gradient[0]} 0%, ${tier.gradient[1]} 100%)`,
          boxShadow: `0 4px 16px ${tier.gradient[1]}66`,
        }}
      >
        <div className="p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <img src={tier.image} alt={tier.leagueName} className="w-5 h-5 object-contain" />
                {tierMe?.tierLabel || tier.name}
              </span>
            </div>
            <p className="text-white/75 text-[13px] mt-1">진행중인 미션 현황</p>
            <p className="text-white text-[32px] font-bold mt-0.5 leading-none">
              {inProgressCount}
              <span className="text-[18px] text-white/60 font-normal"> / {totalToday}</span>
            </p>
          </div>

          {/* Progress ring */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeDasharray={`${progress * 163.4} 163.4`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-[13px] font-bold">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mx-5 mb-4 py-2.5 px-4 bg-black/20 rounded-xl flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-white/70" />
            <span className="text-white/80 text-[12px] font-medium">자동 판정까지</span>
          </div>
          <span className="text-white text-[17px] font-bold tabular-nums tracking-widest font-mono">
            {countdown}
          </span>
        </div>

        <div className="px-5 pb-4 flex gap-5">
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-[#FDE68A]" fill="#FDE68A" />
            <span className="text-white/85 text-[12px] font-medium">누적 {formatPoint(totalPoint)}</span>
          </div>
          {pointToNext > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingUp size={13} className="text-[#FDE68A]" />
              <span className="text-white/85 text-[12px] font-medium">
                다음 티어까지 {formatPoint(pointToNext)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section: 진행중인 미션 (진행중 / 완료 / 실패) */}
      <div className="mx-4 mb-3 mt-2">
        <p className="text-[16px] font-bold text-[#1A1A2E]">진행중인 미션</p>
        <p className="text-[12px] text-[#8E8E93] mt-0.5 font-medium">
          미션을 완료해 포인트를 모으세요
        </p>
      </div>
      <div className="mx-4 flex flex-col gap-3">
        {loading && (
          <div className="py-8 text-center text-[13px] text-[#8E8E93]">불러오는 중...</div>
        )}
        {!loading && todayMissions.length === 0 && (
          <div className="py-6 text-center text-[13px] text-[#8E8E93]">
            진행 중인 미션이 없어요
          </div>
        )}
        {todayMissions.map((m, i) => (
          <MissionCard key={m.id} mission={m} index={i} />
        ))}
      </div>

      {/* Section: 추천 미션 (아직 시작하지 않은 것) */}
      {(readyMissions.length > 0 || recommendedLoading) && (
        <>
          <div className="mx-4 mb-3 mt-6">
            <p className="text-[16px] font-bold text-[#1A1A2E]">추천 미션</p>
            <p className="text-[12px] text-[#8E8E93] mt-0.5 font-medium">
              탭해서 상세 확인 후 시작할 수 있어요
            </p>
          </div>
          <div className="mx-4 flex flex-col gap-3">
            {readyMissions.map((m, i) => (
              <MissionCard key={m.id} mission={m} index={i} />
            ))}
            {recommendedLoading && (
              <div className="py-3 text-center text-[12px] text-[#8E8E93]">
                맞춤 미션을 준비하고 있어요...
              </div>
            )}
          </div>
        </>
      )}

      {/* Both empty after loading completes: show hint to retry */}
      {!loading && !recommendedLoading && todayMissions.length === 0 && readyMissions.length === 0 && (
        <div className="mx-4 mt-6 p-4 rounded-xl bg-white text-center shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <p className="text-[13px] text-[#8E8E93] mb-3">
            맞춤 미션 준비가 지연되고 있어요.
            <br />
            잠시 후 새로고침해주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[13px] font-semibold text-[#00D26A] px-4 py-2 rounded-lg bg-[#F0FDF4]"
          >
            새로고침
          </button>
        </div>
      )}
    </div>
  );
}
