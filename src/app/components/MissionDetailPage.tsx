import { useLocation, useParams, useNavigate } from "react-router";
import { ArrowLeft, Brain, Calculator } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { missionsApi } from "../lib/services";
import type { MissionDetailResponse, RecommendedMissionResponse } from "../lib/types";
import { ApiError } from "../lib/api";

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

// Detail payload can come from either /api/missions/{id} or from a recommendation being previewed.
type DetailView = {
  title: string;
  description: string;
  iconType: string;
  rewardPoint: number;
  failPenaltyPoint: number;
  expectedSavingAmount: number;
  status: string;
  behaviorInsights: string[];
  statisticalReasons: string[];
};

export default function MissionDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Recommendation preview (not yet started) arrives via route state; URL has "rec-" prefix.
  const isRecommendation = typeof id === "string" && id.startsWith("rec-");
  const recommendation = (location.state as { recommendation?: RecommendedMissionResponse } | null)
    ?.recommendation;
  const recommendationId = isRecommendation
    ? recommendation?.recommendationId ?? id!.slice(4)
    : null;

  const [detail, setDetail] = useState<DetailView | null>(null);
  const [loading, setLoading] = useState(!isRecommendation);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    // Recommendation case: hydrate from route state; if missing (refresh, deep link),
    // refetch the recommendations list and find by id.
    if (isRecommendation) {
      const hydrate = (r: RecommendedMissionResponse) =>
        setDetail({
          title: r.title,
          description: r.description,
          iconType: r.iconType,
          rewardPoint: r.rewardPoint,
          failPenaltyPoint: r.failPenaltyPoint,
          expectedSavingAmount: r.expectedSavingAmount,
          status: "READY",
          behaviorInsights: [],
          statisticalReasons: [],
        });

      if (recommendation) {
        hydrate(recommendation);
        setLoading(false);
        return;
      }

      let cancelled = false;
      setLoading(true);
      missionsApi
        .recommended()
        .then((list) => {
          if (cancelled) return;
          const found = list.find((r) => r.recommendationId === recommendationId);
          if (found) hydrate(found);
          else setError("추천 미션 정보를 찾을 수 없어요. 목록에서 다시 선택해 주세요.");
        })
        .catch((e) => {
          if (cancelled) return;
          setError(e instanceof ApiError ? e.message : "추천 미션을 불러오지 못했어요");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }

    // Started-mission case: fetch from BE.
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    missionsApi
      .detail(id)
      .then((res: MissionDetailResponse) => {
        if (cancelled) return;
        setDetail({
          title: res.title,
          description: res.description,
          iconType: res.iconType,
          rewardPoint: res.rewardPoint,
          failPenaltyPoint: res.failPenaltyPoint,
          expectedSavingAmount: res.expectedSavingAmount,
          status: res.status,
          behaviorInsights: res.behaviorInsights ?? [],
          statisticalReasons: res.statisticalReasons ?? [],
        });
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : "미션 정보를 불러오지 못했어요");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isRecommendation, recommendation]);

  const handleStart = async () => {
    if (!recommendationId || starting) return;
    setStarting(true);
    setError(null);
    try {
      const started = await missionsApi.start({ recommendationId });
      // Fetch full detail (behaviorInsights / statisticalReasons) now that a missionId exists.
      try {
        const full = await missionsApi.detail(started.missionId);
        setDetail({
          title: full.title,
          description: full.description,
          iconType: full.iconType,
          rewardPoint: full.rewardPoint,
          failPenaltyPoint: full.failPenaltyPoint,
          expectedSavingAmount: full.expectedSavingAmount,
          status: full.status,
          behaviorInsights: full.behaviorInsights ?? [],
          statisticalReasons: full.statisticalReasons ?? [],
        });
      } catch {
        // Fallback: at least flip status to in-progress so the CTA changes.
        setDetail((prev) =>
          prev ? { ...prev, status: started.status || "IN_PROGRESS" } : prev
        );
      }
    } catch (e) {
      if (e instanceof ApiError) {
        const code = (e.data as { code?: string } | null)?.code;
        // M_003: already accepted — flip UI to 진행중, user can continue.
        if (code === "M_003" || e.status === 400) {
          setDetail((prev) => (prev ? { ...prev, status: "IN_PROGRESS" } : prev));
          setError("이미 시작된 미션이에요. 목록에서 상세를 확인해주세요.");
          return;
        }
        // M_001: recommendation expired/consumed — push back to list.
        if (code === "M_001" || e.status === 404) {
          setError("추천 미션이 만료되었어요. 목록으로 돌아갈게요.");
          setTimeout(() => navigate("/app/missions", { replace: true }), 1200);
          return;
        }
        setError(e.message);
        return;
      }
      setError("미션을 시작하지 못했어요");
    } finally {
      setStarting(false);
    }
  };

  const status = (detail?.status || "").toUpperCase();
  const isReady = status === "READY" || status === "NOT_STARTED" || status === "";
  const isInProgress = status === "IN_PROGRESS" || status === "STARTED";
  const isCompleted = status === "COMPLETED" || status === "SUCCESS";
  const isFailed = status === "FAILED";

  return (
    <div className="pb-36 bg-[#F5F5F5] min-h-full">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 rounded-xl active:bg-gray-50">
          <ArrowLeft size={22} className="text-[#1A1A2E]" />
        </button>
        <h2 className="flex-1 text-center text-[18px] font-semibold text-[#1A1A2E]">미션 상세</h2>
        <div className="w-[30px]" />
      </div>

      {loading && (
        <div className="py-16 text-center text-[14px] text-[#8E8E93]">불러오는 중...</div>
      )}
      {error && !loading && (
        <div className="mx-4 mt-6 p-4 rounded-xl bg-[#FEF2F2] text-[#B91C1C] text-[13px]">{error}</div>
      )}

      {detail && !loading && (
        <>
          {/* Mission Hero */}
          <div
            className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(249,115,22,0.3)]"
            style={{ background: "linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)" }}
          >
            <div className="p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/8" />

              <div className="text-[48px] mb-2 relative z-10">{iconEmoji(detail.iconType)}</div>
              <h3 className="text-[22px] font-bold text-white mb-2 relative z-10">{detail.title}</h3>
              <p className="text-[14px] text-white/80 leading-relaxed relative z-10 whitespace-pre-line">
                {detail.description}
              </p>

              <div className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 relative z-10">
                <span className="text-[13px] font-bold text-white">
                  +{detail.rewardPoint}P 달성 보상 · 실패 시 -{detail.failPenaltyPoint}P
                </span>
              </div>
              {detail.expectedSavingAmount > 0 && (
                <div className="mt-2 text-[12px] text-white/80 relative z-10">
                  예상 절약 금액 {detail.expectedSavingAmount.toLocaleString("ko-KR")}원
                </div>
              )}
            </div>
          </div>

          {/* Psychology Section */}
          <div className="mx-4 mt-5 bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
              <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
                <Brain size={16} className="text-[#8B5CF6]" />
              </div>
              <h4 className="text-[15px] font-bold text-[#1A1A2E]">행동학에서는..</h4>
            </div>
            <div className="px-5 pb-5 space-y-2.5">
              {detail.behaviorInsights.length > 0 ? (
                detail.behaviorInsights.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="flex items-start gap-3 p-3.5 bg-[#F5F3FF] rounded-xl"
                  >
                    <span className="text-[#8B5CF6] font-bold text-[13px] shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-[13px] text-[#4C1D95] leading-relaxed">{line}</p>
                  </motion.div>
                ))
              ) : (
                <div className="p-3.5 bg-[#F5F3FF] rounded-xl text-[12px] text-[#6D28D9] leading-relaxed text-center">
                  미션을 시작하면 행동학적 분석을 볼 수 있어요
                </div>
              )}
            </div>
          </div>

          {/* Math Section */}
          <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Calculator size={16} className="text-[#3B82F6]" />
              </div>
              <h4 className="text-[15px] font-bold text-[#1A1A2E]">더 자세히 알아볼까요?</h4>
            </div>
            <div className="px-5 pb-5 space-y-2.5">
              {detail.statisticalReasons.length > 0 ? (
                detail.statisticalReasons.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="flex items-start gap-3 p-3.5 bg-[#EFF6FF] rounded-xl"
                  >
                    <span className="text-[#3B82F6] font-bold text-[13px] shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-[13px] text-[#1E40AF] leading-relaxed">{line}</p>
                  </motion.div>
                ))
              ) : (
                <div className="p-3.5 bg-[#EFF6FF] rounded-xl text-[12px] text-[#1D4ED8] leading-relaxed text-center">
                  미션을 시작하면 통계 분석을 볼 수 있어요
                </div>
              )}
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-6 pt-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-20">
            {isInProgress && (
              <div className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC]">
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path
                    d="M2 8L7.5 13.5L18 2"
                    stroke="#00D26A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[15px] font-bold text-[#16A34A]">미션 진행 중!</span>
              </div>
            )}
            {isCompleted && (
              <div className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC]">
                <span className="text-[15px] font-bold text-[#16A34A]">미션 성공 🎉</span>
              </div>
            )}
            {isFailed && (
              <div className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5]">
                <span className="text-[15px] font-bold text-[#B91C1C]">미션 실패</span>
              </div>
            )}
            {isReady && isRecommendation && recommendationId && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                disabled={starting}
                className="w-full py-4 rounded-2xl text-white text-[16px] font-bold shadow-[0_4px_16px_rgba(0,210,106,0.35)] disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #00D26A, #00A854)" }}
              >
                {starting ? "시작하는 중..." : "미션 진행"}
              </motion.button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
