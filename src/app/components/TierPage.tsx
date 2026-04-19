import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import defaultChar from "../../imports/character.png";
import { tierOrder, tierConfig, tierIdFromBe, tierIdToBe, type TierId } from "../constants/tierConfig";
import { leagueApi } from "../lib/services";
import type {
  LeagueRankingResponse,
  LeagueRankingUserResponse,
  LeagueSelectedRankingResponse,
  MyLeagueInfoResponse,
} from "../lib/types";

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
  const [selectedIdx, setSelectedIdx] = useState<number>(3);
  const [myRanking, setMyRanking] = useState<LeagueRankingResponse | null>(null);
  const [selectedRanking, setSelectedRanking] = useState<LeagueSelectedRankingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const touchStartX = useRef(0);

  const selectedTierId = tierOrder[selectedIdx];
  const tier = tierConfig[selectedTierId];

  // Initial load: my ranking (includes my tier info + its ranking list)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await leagueApi.ranking();
        if (cancelled) return;
        setMyRanking(data);
        const myTierId = tierIdFromBe(data.myInfo?.tier);
        const idx = tierOrder.indexOf(myTierId);
        if (idx >= 0) setSelectedIdx(idx);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // When selected tier changes, fetch that tier's ranking (unless it's my tier — reuse cached).
  useEffect(() => {
    let cancelled = false;
    const myTierId = tierIdFromBe(myRanking?.myInfo?.tier);
    if (myRanking && selectedTierId === myTierId) {
      setSelectedRanking({
        remainingTime: myRanking.remainingTime,
        totalUserCount: myRanking.totalUserCount,
        rankings: myRanking.rankings,
      });
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const data = await leagueApi.selected(tierIdToBe(selectedTierId));
        if (!cancelled) setSelectedRanking(data);
      } catch {
        if (!cancelled) setSelectedRanking({ remainingTime: "", totalUserCount: 0, rankings: [] });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedTierId, myRanking]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && selectedIdx < tierOrder.length - 1) setSelectedIdx((i) => i + 1);
    else if (diff < -50 && selectedIdx > 0) setSelectedIdx((i) => i - 1);
  };

  const myTierId = tierIdFromBe(myRanking?.myInfo?.tier);
  const myInfo: MyLeagueInfoResponse | null = myRanking?.myInfo ?? null;
  const tierUsers: LeagueRankingUserResponse[] = useMemo(
    () => selectedRanking?.rankings ?? [],
    [selectedRanking]
  );
  const totalCount = selectedRanking?.totalUserCount ?? tierUsers.length;

  return (
    <div
      className="pb-28 bg-[#F5F5F5] min-h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* Tier selector hero */}
      <div className="bg-white pt-7 pb-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
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
            {selectedRanking?.remainingTime && (
              <p className="text-[12px] text-[#8E8E93] mt-1">리그 종료까지 {selectedRanking.remainingTime}</p>
            )}
          </motion.div>
        </AnimatePresence>

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

      {/* Leaderboard */}
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
          {myInfo && selectedTierId === myTierId && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-1"
              style={{
                background: `linear-gradient(135deg, ${tier.gradient[0]}22, ${tier.gradient[1]}22)`,
                border: `1.5px solid ${tier.color}40`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#E8EAF0]"
              >
                <img
                  src={myInfo.profileImageUrl || defaultChar}
                  alt="내 캐릭터"
                  className="w-[38px] h-[38px] object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#8E8E93]">내 현황</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#1A1A2E]">{myInfo.nickname}</span>
                  <span
                    className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  >
                    나
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-[#8E8E93]">
                  {myInfo.rank}위 / {totalCount}명
                </p>
                <p className="text-[16px] font-bold" style={{ color: tier.color }}>
                  {myInfo.point.toLocaleString()}P
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="py-6 text-center text-[13px] text-[#8E8E93]">불러오는 중...</div>
          )}
          {!loading && tierUsers.length === 0 && (
            <div className="py-6 text-center text-[13px] text-[#8E8E93]">이 리그에는 아직 유저가 없어요</div>
          )}

          {tierUsers.map((user, idx) => {
            const isMe =
              !!myInfo &&
              selectedTierId === myTierId &&
              user.nickname === myInfo.nickname &&
              user.rank === myInfo.rank;
            const medal = medals[user.rank];

            return (
              <motion.div
                key={`${selectedTierId}-${user.rank}-${user.nickname}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.045 }}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: isMe ? tier.bg : "#FFFFFF",
                  border: isMe ? `2px solid ${tier.color}55` : "1px solid #F0F0F0",
                  boxShadow: isMe ? `0 4px 14px ${tier.color}22` : "0 1px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div className="w-14 flex items-center justify-center shrink-0">
                  {medal ? (
                    <img src={medal} alt={`${user.rank}위`} className="w-14 h-14 object-contain shrink-0" />
                  ) : (
                    <span className="text-[14px] font-bold text-[#8E8E93] -ml-2">{user.rank}</span>
                  )}
                </div>

                <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#E8EAF0]">
                  <img
                    src={user.profileImageUrl || defaultChar}
                    alt={user.nickname}
                    className="w-[42px] h-[42px] object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold text-[#1A1A2E] truncate">
                      {user.nickname}
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
                  {user.isActive ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                      <span className="text-[11px] text-[#00D26A] font-medium">활동 중</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8E8E93] mt-0.5">{user.lastLoginAt}</p>
                  )}
                </div>

                <span
                  className="text-[14px] font-bold shrink-0"
                  style={{ color: isMe ? tier.color : "#1A1A2E" }}
                >
                  {user.point.toLocaleString()}P
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
