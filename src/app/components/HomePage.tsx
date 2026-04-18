import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import characterImg from "../../imports/character.png";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { homeApi, analysisApi } from "../lib/services";
import type {
  HomeRankingPercentileResponse,
  HomeSummaryResponse,
  SpendingTopResponse,
} from "../lib/types";
import { tierConfig, tierIdFromBe } from "../constants/tierConfig";
import { formatKrw, formatPoint } from "../lib/format";

export default function HomePage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<HomeSummaryResponse | null>(null);
  const [percentile, setPercentile] = useState<HomeRankingPercentileResponse | null>(null);
  const [top, setTop] = useState<SpendingTopResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.allSettled([
        homeApi.summary(),
        homeApi.percentile(),
        analysisApi.topSpending(3),
      ]);
      if (cancelled) return;
      if (results[0].status === "fulfilled") setSummary(results[0].value);
      if (results[1].status === "fulfilled") setPercentile(results[1].value);
      if (results[2].status === "fulfilled") setTop(results[2].value);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tierInfo = summary?.tier ? tierConfig[tierIdFromBe(summary.tier)] : null;
  const characterImgUrl = summary?.currentImageUrl || characterImg;
  const characterName = summary?.currentImageName || "나의 캐릭터";
  const rankPercent = percentile?.rankingPercentile ?? "--";
  const measuredAt = percentile?.measuredAt ?? "";
  const initial = characterName.charAt(0) || "또";

  return (
    <div className="pb-4 bg-[#F5F5F5]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
        <img
          src="/images/logo.png"
          alt="로고"
          className="h-[70px] object-contain -ml-3"
        />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D26A] to-[#1B4965] flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
            {initial}
          </div>
        </div>
      </div>

      {/* Saving Rank Card */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-5 cursor-pointer active:scale-[0.985] transition-transform" onClick={() => navigate("/app/tier")}>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm relative"
            style={{ backgroundColor: "rgba(76, 175, 80, 0.12)" }}
          >
            <img src="/images/Crown.png" alt="crown" className="absolute w-[96px] h-[96px] max-w-none object-contain z-10" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] text-[#1A1A2E]">
              절약력 상위{" "}
              <span
                className="text-[22px] font-bold text-[#2E7D32]"
              >
                {rankPercent}{typeof rankPercent === "string" && rankPercent.includes("%") ? "" : "%"}
              </span>
            </p>
            <p className="text-[12px] text-[#8E8E93] mt-0.5">
              {measuredAt ? `${measuredAt} 측정 결과` : "측정 결과를 불러오고 있어요"}
            </p>
          </div>
          <ChevronRight size={20} className="text-[#C7C7CC]" />
        </div>
        <button
          className="w-full py-3 rounded-xl text-[14px] font-semibold"
          style={{ backgroundColor: "rgba(76, 175, 80, 0.12)", color: "#2E7D32" }}
        >
          티어 분포 보기
        </button>
      </div>

      {/* Character Card */}
      <div
        className="mx-4 mt-4 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden cursor-pointer active:scale-[0.985] transition-transform"
        onClick={() => navigate("/app/character")}
      >
        <div className="flex flex-col items-center pt-6 pb-4 relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, #E8EAF0 0%, #F5F6FA 60%, white 100%)" }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,210,106,0.12) 0%, transparent 70%)" }}
          />
          <motion.img
            src={characterImgUrl}
            alt="캐릭터"
            className="w-[180px] h-[180px] object-contain mb-2 relative z-10 drop-shadow-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-1 mt-3">
            {tierInfo && (
              <img src={tierInfo.image} alt={tierInfo.leagueName} className="w-[22px] h-[22px] object-contain shrink-0" />
            )}
            <span className="text-[12px] font-semibold" style={{ color: tierInfo?.color || "#3B82F6" }}>
              {tierInfo?.name ?? summary?.tier ?? "--"} · {formatPoint(summary?.point)}
            </span>
            <ChevronRight size={14} className="text-[#C7C7CC]" />
          </div>
          <p className="text-[20px] font-bold text-[#1A1A2E] mb-2">{characterName}</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 py-3.5 rounded-xl text-white text-[15px] font-semibold shadow-[0_4px_12px_rgba(0,210,106,0.35)]"
            style={{ background: "linear-gradient(135deg, #00D26A, #00A854)" }}
            onClick={(e) => { e.stopPropagation(); navigate("/app/missions"); }}
          >
            오늘 미션 시작하기
          </motion.button>
        </div>
      </div>

      {/* Top 3 Spending */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[16px] font-bold text-[#1A1A2E]">지난 달 소비 Top 3</p>
          <ChevronRight size={20} className="text-[#C7C7CC] cursor-pointer" onClick={() => navigate("/app/analysis")} />
        </div>
        {(top?.items ?? []).slice(0, 3).map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 py-3 border-t border-gray-50 first:border-t-0 first:pt-0"
          >
            <img
              src={["/images/1st.png", "/images/2nd.png", "/images/3rd.png"][item.rank - 1]}
              alt={`${item.rank}위`}
              className="w-11 h-11 object-contain shrink-0"
            />

            <div className="flex-1">
              <p className="text-[15px] font-medium text-[#1A1A2E]">{item.category}</p>
            </div>
            <span className="text-[15px] font-semibold text-[#1A1A2E]">{formatKrw(item.amount)}</span>
          </div>
        ))}
        {top && top.items.length === 0 && (
          <p className="text-center text-[13px] text-[#8E8E93] py-4">아직 집계된 소비가 없어요</p>
        )}
      </div>
    </div>
  );
}
