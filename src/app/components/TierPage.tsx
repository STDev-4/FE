import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import defaultChar from "../../imports/character.png";
import bunnyChar from "../../imports/rabbit.png";
import { tierOrder, tierConfig, type TierId } from "../constants/tierConfig";

const CHAR_IMG = [defaultChar, bunnyChar] as const;
const CHAR_BG  = ["#E8EAF0",  "#FFF3E8"] as const;

interface LeagueUser {
  rank: number;
  name: string;
  points: number;
  tierId: TierId;
  charType: 0 | 1;
  isMe?: true;
  timeAgo?: string;
  isOnline?: boolean;
}

const allUsers: LeagueUser[] = [
  // master
  { rank: 1, name: "절약왕",   points: 9820, tierId: "master",     charType: 1, isOnline: true },
  { rank: 2, name: "재테크선생", points: 9410, tierId: "master",     charType: 0, timeAgo: "1시간 전" },
  { rank: 3, name: "알뜰달뜰", points: 8760, tierId: "master",     charType: 1, timeAgo: "3시간 전" },
  // researcher
  { rank: 1, name: "이저축",   points: 7830, tierId: "researcher", charType: 0, isOnline: true },
  { rank: 2, name: "절약박사", points: 7210, tierId: "researcher", charType: 1, timeAgo: "2시간 전" },
  { rank: 3, name: "김부자",   points: 6540, tierId: "researcher", charType: 0, timeAgo: "5시간 전" },
  { rank: 4, name: "머니맨",   points: 5980, tierId: "researcher", charType: 1, timeAgo: "1일 전"   },
  // explorer
  { rank: 1, name: "김절약",   points: 5240, tierId: "explorer",   charType: 1, timeAgo: "1시간 전" },
  { rank: 2, name: "박검소",   points: 4810, tierId: "explorer",   charType: 0, timeAgo: "4시간 전" },
  { rank: 3, name: "최아끼",   points: 4320, tierId: "explorer",   charType: 1, timeAgo: "6시간 전" },
  { rank: 4, name: "정씩씩",   points: 3760, tierId: "explorer",   charType: 0, timeAgo: "10시간 전" },
  // analyst
  { rank: 1, name: "임분석",   points: 2630, tierId: "analyst",    charType: 1, timeAgo: "2시간 전" },
  { rank: 2, name: "홍길동",   points: 2210, tierId: "analyst",    charType: 0, timeAgo: "5시간 전" },
  { rank: 3, name: "정용돈",   points: 1920, tierId: "analyst",    charType: 1, timeAgo: "8시간 전" },
  { rank: 4, name: "또깡이",   points: 1850, tierId: "analyst",    charType: 0, isMe: true, isOnline: true },
  { rank: 5, name: "최지출",   points: 1420, tierId: "analyst",    charType: 1, timeAgo: "3시간 전" },
  { rank: 6, name: "손절약",   points:  980, tierId: "analyst",    charType: 0, timeAgo: "1일 전"   },
  // sprout
  { rank: 1, name: "새싹이",   points:  760, tierId: "sprout",     charType: 0, timeAgo: "4시간 전" },
  { rank: 2, name: "첫걸음",   points:  540, tierId: "sprout",     charType: 1, timeAgo: "12시간 전" },
  { rank: 3, name: "오절약",   points:  320, tierId: "sprout",     charType: 0, timeAgo: "2일 전"   },
];

const medals: Record<number, string> = { 1: "/images/1st.png", 2: "/images/2nd.png", 3: "/images/3rd.png" };

function ShieldBadge({ tierId, isSelected, onClick }: {
  tierId: TierId;
  isSelected: boolean;
  onClick: () => void;
}) {
  const tier = tierConfig[tierId];
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5"
      animate={{
        scale: isSelected ? 1.4 : 0.6,
        opacity: isSelected ? 1 : 0.45,
      }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
    >
      <img
        src={tier.image}
        alt={tier.leagueName}
        style={{
          width: 77,
          height: 77,
          objectFit: "contain",
          filter: isSelected ? `drop-shadow(0 6px 12px ${tier.gradient[1]}88)` : "none",
        }}
      />
    </motion.button>
  );
}

export default function TierPage() {
  // Start on "analyst" (index 3) — the user's current tier
  const [selectedIdx, setSelectedIdx] = useState(3);
  const touchStartX = useRef(0);

  const selectedTierId = tierOrder[selectedIdx];
  const tier = tierConfig[selectedTierId];
  const tierUsers = allUsers.filter((u) => u.tierId === selectedTierId);
  const myUser = allUsers.find((u) => u.isMe);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && selectedIdx < tierOrder.length - 1) setSelectedIdx((i) => i + 1);
    else if (diff < -50 && selectedIdx > 0) setSelectedIdx((i) => i - 1);
  };

  return (
    <div
      className="pb-28 bg-[#F5F5F5] min-h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Header ── */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h2 className="text-[18px] font-semibold text-[#1A1A2E] text-center">리그</h2>
      </div>

      {/* ── Tier selector hero ── */}
      <div className="bg-white pt-7 pb-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        {/* Badge row */}
        <div className="flex items-end justify-center gap-2 mb-6">
          {tierOrder.map((tierId, idx) => (
            <ShieldBadge
              key={tierId}
              tierId={tierId}
              isSelected={idx === selectedIdx}
              onClick={() => setSelectedIdx(idx)}
            />
          ))}
        </div>

        {/* League name + timer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTierId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="text-center px-4"
          >
            <h3 className="text-[20px] font-bold text-[#1A1A2E]">{tier.leagueName}</h3>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {tierOrder.map((_, idx) => (
            <div
              key={idx}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === selectedIdx ? 16 : 6,
                height: 6,
                backgroundColor: idx === selectedIdx ? tier.color : "#D1D5DB",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Leaderboard (filtered by tier) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTierId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="px-4 pt-4 flex flex-col gap-2"
        >
          {/* My summary row (only when viewing my tier) */}
          {myUser && selectedTierId === myUser.tierId && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-1"
              style={{
                background: `linear-gradient(135deg, ${tier.gradient[0]}22, ${tier.gradient[1]}22)`,
                border: `1.5px solid ${tier.color}40`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                style={{ backgroundColor: CHAR_BG[myUser.charType] }}
              >
                <img
                  src={CHAR_IMG[myUser.charType]}
                  alt="내 캐릭터"
                  className="w-[38px] h-[38px] object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#8E8E93]">내 현황</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#1A1A2E]">{myUser.name}</span>
                  <span
                    className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  >
                    나
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-[#8E8E93]">{myUser.rank}위 / {tierUsers.length}명</p>
                <p className="text-[16px] font-bold" style={{ color: tier.color }}>
                  {myUser.points.toLocaleString()}P
                </p>
              </div>
            </div>
          )}

          {/* User rows */}
          {tierUsers.map((user, idx) => {
            const isMe = !!user.isMe;
            const medal = medals[user.rank];

            return (
              <motion.div
                key={`${selectedTierId}-${user.rank}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.045 }}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: isMe ? tier.bg : "#FFFFFF",
                  border: isMe
                    ? `2px solid ${tier.color}55`
                    : "1px solid #F0F0F0",
                  boxShadow: isMe
                    ? `0 4px 14px ${tier.color}22`
                    : "0 1px 6px rgba(0,0,0,0.05)",
                }}
              >
                {/* Rank */}
                <div className="w-14 flex items-center justify-center shrink-0">
                  {medal ? (
                    <img src={medal} alt={`${user.rank}위`} className="w-14 h-14 object-contain shrink-0" />
                  ) : (
                    <span className="text-[14px] font-bold text-[#8E8E93] -ml-2">{user.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                  style={{ backgroundColor: CHAR_BG[user.charType] }}
                >
                  <img
                    src={CHAR_IMG[user.charType]}
                    alt={user.name}
                    className="w-[42px] h-[42px] object-contain"
                  />
                </div>

                {/* Name + status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold text-[#1A1A2E] truncate">
                      {user.name}
                    </span>
                    {isMe && (
                      <span
                        className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: tier.color }}
                      >
                        나
                      </span>
                    )}
                  </div>
                  {user.isOnline ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                      <span className="text-[11px] text-[#00D26A] font-medium">활동 중</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8E8E93] mt-0.5">{user.timeAgo}</p>
                  )}
                </div>

                {/* Points */}
                <span
                  className="text-[14px] font-bold shrink-0"
                  style={{ color: isMe ? tier.color : "#1A1A2E" }}
                >
                  {user.points.toLocaleString()}P
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
