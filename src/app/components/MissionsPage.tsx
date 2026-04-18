import { CheckCircle2, Clock, Star, XCircle, TrendingUp, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { tierConfig, type TierId } from "../constants/tierConfig";

type MissionStatus = "completed" | "in-progress" | "failed" | "ready";

interface Mission {
  id: string;
  title: string;
  emoji: string;
  reward: number;
  status: MissionStatus;
  tierNote?: string;
}

const baseMissions: Mission[] = [
  {
    id: "s1",
    title: "카페 안 가기",
    emoji: "☕",
    reward: 5,
    status: "in-progress",
    tierNote: "성공 시 +5P 획득",
  },
  {
    id: "s2",
    title: "배달 1회 줄이기",
    emoji: "🍕",
    reward: 8,
    status: "in-progress",
    tierNote: "성공 시 +8P 획득",
  },
];

function useCountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(5, 0, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
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
  const accent = statusAccent[mission.status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => navigate(`/app/mission/${mission.id}`)}
      className="w-full text-left rounded-2xl overflow-hidden flex items-center gap-3 transition-all bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] active:scale-[0.98]"
      style={{
        opacity: isFailed ? 0.75 : 1,
      }}
    >
      <div className="flex items-center gap-3 flex-1 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
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

export default function MissionsPage() {
  const currentTierId: TierId = "analyst";
  const tier = tierConfig[currentTierId];
  const countdown = useCountdownToMidnight();
  const location = useLocation();
  const [missions, setMissions] = useState<Mission[]>(baseMissions);

  useEffect(() => {
    const incoming = (location.state as { addMission?: Mission } | null)?.addMission;
    if (!incoming) return;
    setMissions((prev) =>
      prev.find((m) => m.id === incoming.id) ? prev : [...prev, incoming]
    );
  }, [location.state]);

  const completedToday = missions.filter((m) => m.status === "completed").length;
  const totalToday = missions.length;
  const progress = totalToday > 0 ? completedToday / totalToday : 0;

  return (
    <div className="pb-28 bg-[#F5F5F5] min-h-full">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h2 className="text-[18px] font-semibold text-[#1A1A2E] text-center">미션</h2>
      </div>

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
                {tier.name}
              </span>
            </div>
            <p className="text-white/75 text-[13px] mt-1">진행중인 미션 현황</p>
            <p className="text-white text-[32px] font-bold mt-0.5 leading-none">
              {completedToday}
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
            <span className="text-white/85 text-[12px] font-medium">누적 1,850P</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} className="text-[#FDE68A]" />
            <span className="text-white/85 text-[12px] font-medium">다음 티어까지 1,150P</span>
          </div>
        </div>
      </div>

      {/* Today Missions */}
      <div className="mx-4 mb-3">
        <p className="text-[16px] font-bold text-[#1A1A2E]">오늘의 미션</p>
        <p className="text-[12px] text-[#8E8E93] mt-0.5 font-medium">미션을 완료해 포인트를 모으세요</p>
      </div>
      <div className="mx-4 flex flex-col gap-3">
        {missions.map((m, i) => (
          <MissionCard key={m.id} mission={m} index={i} />
        ))}
      </div>
    </div>
  );
}
