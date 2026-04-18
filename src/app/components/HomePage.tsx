import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import characterImg from "../../imports/character.png";
import { motion } from "motion/react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="pb-4 bg-[#F5F5F5]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <span className="text-[#00D26A] text-[20px] font-bold tracking-tight">MyAsset</span>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D26A] to-[#1B4965] flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
            또
          </div>
        </div>
      </div>

      {/* Saving Rank Card */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF8E1] to-[#FFF3CD] flex items-center justify-center text-[26px] shadow-sm">
            🏆
          </div>
          <div className="flex-1">
            <p className="text-[15px] text-[#1A1A2E]">
              절약력 상위{" "}
              <span
                className="text-[22px] font-bold text-[#2E7D32]"
              >
                43.9%
              </span>
            </p>
            <p className="text-[12px] text-[#8E8E93] mt-0.5">2026-04-10 측정 결과</p>
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
            src={characterImg}
            alt="캐릭터"
            className="w-[180px] h-[180px] object-contain mb-2 relative z-10 drop-shadow-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-1.5 mb-1 mt-3">
            <img src="/images/2-League-Analyst.png" alt="분석가 리그" className="w-4 h-4 object-contain" />
            <span className="text-[12px] text-[#3B82F6] font-semibold">분석 입문자 · 1,850P</span>
            <ChevronRight size={14} className="text-[#C7C7CC]" />
          </div>
          <p className="text-[20px] font-bold text-[#1A1A2E] mb-2">나의 절약 요정</p>
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
          <ChevronRight size={20} className="text-[#C7C7CC]" />
        </div>
        {[
          { rank: 1, emoji: "☕", category: "카페·음료",   amount: "127,400원" },
          { rank: 2, emoji: "🍔", category: "배달·외식",   amount: "98,200원"  },
          { rank: 3, emoji: "🛒", category: "온라인 쇼핑", amount: "85,600원"  },
        ].map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 py-3 border-t border-gray-50 first:border-t-0 first:pt-0"
          >
            <img
              src={["/images/1st.png", "/images/2nd.png", "/images/3rd.png"][item.rank - 1]}
              alt={`${item.rank}위`}
              className="w-11 h-11 object-contain shrink-0"
            />
            <div className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center text-[20px] shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-[#1A1A2E]">{item.category}</p>
            </div>
            <span className="text-[15px] font-semibold text-[#1A1A2E]">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
