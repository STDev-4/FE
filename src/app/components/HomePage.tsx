import { Bell, ChevronRight, Flame } from "lucide-react";
import { useNavigate } from "react-router";
import characterImg from "../../imports/character.png";
import { motion } from "motion/react";

export default function HomePage() {
  const navigate = useNavigate();
  const streakDays = 5;
  const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];
  const todayIndex = 2;
  const completedDays = [0, 1, 2, 3, 4];

  return (
    <div className="pb-28 bg-[#F5F5F5]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <span className="text-[#00D26A] text-[20px] font-bold tracking-tight">MyAsset</span>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={22} className="text-[#1A1A2E]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#EF4444]" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D26A] to-[#1B4965] flex items-center justify-center text-white text-[12px] font-bold shadow-sm">
            또
          </div>
        </div>
      </div>

      {/* Streak Card */}
      <div className="mx-4 mt-4 mb-4 bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-[#00D26A]/10" />
              <Flame size={28} className="text-[#00D26A] relative z-10" fill="#00D26A" fillOpacity={0.25} />
            </div>
            <div>
              <p className="text-[12px] text-[#8E8E93] font-medium">연속 절약 중</p>
              <p className="text-[22px] font-bold text-[#1A1A2E] leading-tight">
                <span className="text-[#00D26A]">{streakDays}</span>일째
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#C7C7CC]" />
        </div>

        <div className="flex justify-between gap-1.5">
          {dayLabels.map((day, i) => {
            const isCompleted = completedDays.includes(i);
            const isToday = i === todayIndex;
            const isPast = i < todayIndex;
            const isFuture = i > todayIndex;

            return (
              <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all ${
                    isToday
                      ? "bg-[#00D26A] text-white shadow-[0_2px_8px_rgba(0,210,106,0.4)] ring-2 ring-[#00D26A]/30 ring-offset-1"
                      : isCompleted
                      ? "bg-[#00D26A] text-white"
                      : "bg-[#F3F4F6] text-[#C0C0C0]"
                  }`}
                >
                  {isPast && isCompleted ? (
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1.5 5.5L5 9L12.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    day
                  )}
                </div>
                {isToday && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                )}
                {!isToday && <div className="w-1.5 h-1.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Character Card */}
      <div
        className="mx-4 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden cursor-pointer active:scale-[0.985] transition-transform"
        onClick={() => navigate("/app/character")}
      >
        <div className="flex flex-col items-center pt-6 pb-4 relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, #E8EAF0 0%, #F5F6FA 60%, white 100%)" }}
        >
          {/* Radial glow behind character */}
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
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[12px] text-[#3B82F6] font-semibold">📊 분석 입문자 · 1,850P</span>
            <ChevronRight size={14} className="text-[#C7C7CC]" />
          </div>
          <p className="text-[20px] font-bold text-[#1A1A2E] mb-2">나의 절약 요정</p>
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#8E8E93]">
              오늘 미션{" "}
              <span className="text-[#1A1A2E] font-semibold">0</span> / 2개 완료
            </p>
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#F0F0F0" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20" fill="none" stroke="#00D26A" strokeWidth="4"
                  strokeDasharray={`${(0 / 2) * 125.6} 125.6`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-[#1A1A2E]">
                0%
              </span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 py-3.5 rounded-xl text-white text-[15px] font-semibold shadow-[0_4px_12px_rgba(0,210,106,0.35)]"
            style={{ background: "linear-gradient(135deg, #00D26A, #00A854)" }}
            onClick={(e) => { e.stopPropagation(); navigate("/app/missions"); }}
          >
            🎯 오늘 미션 시작하기
          </motion.button>
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
                className="text-[22px] font-bold"
                style={{ background: "linear-gradient(135deg, #6C5CE7, #A855F7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
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
          style={{ background: "linear-gradient(135deg, #EFF6FF, #E0EFFE)", color: "#3B82F6" }}
        >
          티어 분포 보기
        </button>
      </div>

      {/* Top 3 Spending */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[16px] font-bold text-[#1A1A2E]">지난 달 소비 Top 3</p>
          <ChevronRight size={20} className="text-[#C7C7CC]" />
        </div>
        {[
          { rank: 1, emoji: "☕", category: "카페·음료",   amount: "127,400원", from: "#FFD700", to: "#FFA500" },
          { rank: 2, emoji: "🍔", category: "배달·외식",   amount: "98,200원",  from: "#C0C0C0", to: "#A8A8A8" },
          { rank: 3, emoji: "🛒", category: "온라인 쇼핑", amount: "85,600원",  from: "#CD7F32", to: "#A0522D" },
        ].map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 py-3 border-t border-gray-50 first:border-t-0 first:pt-0"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
              style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}
            >
              {item.rank}
            </div>
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
