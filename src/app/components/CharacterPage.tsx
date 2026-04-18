import { motion, AnimatePresence } from "motion/react";
import defaultChar from "../../imports/character.png";
import bunnyChar from "../../imports/rabbit.png";
import { useState } from "react";
import { Coins, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { tierConfig, type TierId } from "../constants/tierConfig";

const characters = [
  {
    id: 1,
    name: "절약 요정",
    desc: "기본 캐릭터",
    img: defaultChar,
    price: null,
    bgColor: "#E8EAF0",
    glowColor: "rgba(139,148,158,0.25)",
  },
  {
    id: 2,
    name: "행운 토끼",
    desc: "콩으로 해금 가능",
    img: bunnyChar,
    price: 300,
    bgColor: "#FFF3E8",
    glowColor: "rgba(249,115,22,0.2)",
  },
];

export default function CharacterPage() {
  const navigate = useNavigate();
  const currentTierId: TierId = "analyst";
  const tier = tierConfig[currentTierId];

  const [coins, setCoins] = useState(340);
  const [ownedIds, setOwnedIds] = useState<number[]>([1]);
  const [activeId, setActiveId] = useState(1);
  const [selectedId, setSelectedId] = useState(1);

  const activeChar = characters.find((c) => c.id === activeId)!;
  const selectedChar = characters.find((c) => c.id === selectedId)!;
  const isOwned = ownedIds.includes(selectedId);
  const isSameAsActive = selectedId === activeId;
  const canAfford = selectedChar.price !== null && coins >= (selectedChar.price ?? 0);

  function handleCTA() {
    if (!isOwned && canAfford && selectedChar.price) {
      setCoins((c) => c - selectedChar.price!);
      setOwnedIds((ids) => [...ids, selectedId]);
      setActiveId(selectedId);
    } else if (isOwned && !isSameAsActive) {
      setActiveId(selectedId);
    }
  }

  const ctaLabel = () => {
    if (!isOwned) return canAfford ? `${selectedChar.price}콩으로 해금하기` : "콩이 부족해요";
    if (isSameAsActive) return "현재 사용 중인 캐릭터";
    return "이 캐릭터로 변경하기";
  };

  const ctaDisabled = (!isOwned && !canAfford) || isSameAsActive;

  const ctaStyle = () => {
    if (!isOwned && !canAfford) return { background: "#F3F4F6", color: "#9CA3AF" };
    if (!isOwned && canAfford) return { background: "linear-gradient(135deg, #FCD34D, #F59E0B)", color: "white" };
    if (isSameAsActive) return { background: "#F0FDF4", color: "#16A34A", border: "1.5px solid #86EFAC" };
    return { background: "linear-gradient(135deg, #00D26A, #00A854)", color: "white" };
  };

  return (
    <div className="pb-28 bg-[#F5F5F5] min-h-full">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h2 className="text-[18px] font-semibold text-[#1A1A2E] text-center">캐릭터</h2>
      </div>

      {/* Tier Status */}
      <div
        className="mx-4 mt-4 rounded-2xl p-4 shadow-[0_2px_10px_rgba(37,99,235,0.12)]"
        style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src={tier.image} alt={tier.name} className="w-6 h-6 object-contain" />
              <span className="text-[16px] font-bold" style={{ color: tier.color }}>{tier.name}</span>
            </div>
            <p className="text-[13px] text-[#3B82F6] font-medium">1,850P · 다음 티어까지 1,150P</p>
          </div>
          <button
            onClick={() => navigate("/app/tier")}
            className="text-[12px] font-semibold text-[#3B82F6] bg-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
          >
            티어 보기 <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Active Character Display */}
      <div className="flex flex-col items-center pt-7 pb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -12 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center"
          >
            {/* Outer ring */}
            <div
              className="w-[228px] h-[228px] rounded-full flex items-center justify-center relative"
              style={{
                background: `radial-gradient(circle, ${activeChar.glowColor} 0%, transparent 70%)`,
              }}
            >
              {/* Inner circle */}
              <div
                className="w-[200px] h-[200px] rounded-full flex items-center justify-center shadow-inner"
                style={{ backgroundColor: activeChar.bgColor }}
              >
                <motion.img
                  src={activeChar.img}
                  alt={activeChar.name}
                  className="w-[158px] h-[158px] object-contain drop-shadow-2xl"
                  animate={{ y: [0, -9, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-[18px] font-bold text-[#1A1A2E] mt-4">{activeChar.name}</p>
        <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full mt-2 flex items-center gap-1.5" style={{ backgroundColor: tier.bg, color: tier.color }}>
          <img src={tier.image} alt={tier.name} className="w-4 h-4 object-contain" />
          {tier.name} · 1,850P
        </span>
      </div>

      {/* Coins */}
      <div className="mx-4 mb-5">
        <div
          className="flex items-center justify-between bg-white rounded-2xl px-4 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
          style={{ border: "1.5px solid #FEF3C7" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] flex items-center justify-center">
              <Coins size={18} className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-[11px] text-[#8E8E93] font-medium">보유 콩</p>
              <p className="text-[17px] font-bold text-[#1A1A2E] leading-tight">{coins}</p>
            </div>
          </div>
          <span
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #FEF3C7, #FDE68A)", color: "#B45309" }}
          >
            콩 충전하기
          </span>
        </div>
      </div>

      {/* Character Picker */}
      <div className="px-4">
        <p className="text-[16px] font-bold text-[#1A1A2E] mb-3">캐릭터 선택</p>

        <div className="grid grid-cols-2 gap-3">
          {characters.map((char) => {
            const isSelected = selectedId === char.id;
            const isActive = activeId === char.id;
            const owned = ownedIds.includes(char.id);
            const affordable = char.price !== null && coins >= (char.price ?? 0);
            const locked = !owned;

            return (
              <button
                key={char.id}
                onClick={() => setSelectedId(char.id)}
                className={`relative rounded-2xl overflow-hidden flex flex-col items-center pb-4 transition-all bg-white ${
                  isSelected
                    ? "shadow-[0_6px_20px_rgba(0,210,106,0.2)]"
                    : "shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                }`}
                style={{
                  border: isSelected
                    ? "2px solid #00D26A"
                    : "1.5px solid #F0F0F0",
                }}
              >
                {/* Badges */}
                {isActive && (
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-0.5 bg-[#00D26A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    <CheckCircle2 size={8} strokeWidth={3} />
                    사용중
                  </div>
                )}
                {locked && (
                  <div
                    className={`absolute top-2.5 right-2.5 z-10 flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      affordable ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#F3F4F6] text-[#9CA3AF]"
                    }`}
                  >
                    {affordable ? (
                      <><Coins size={9} />{char.price}</>
                    ) : (
                      <><Lock size={9} />{char.price}</>
                    )}
                  </div>
                )}

                {/* Image */}
                <div
                  className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
                  style={{
                    backgroundColor: char.bgColor,
                    opacity: locked && !affordable ? 0.5 : 1,
                  }}
                >
                  {locked && !affordable && (
                    <div className="absolute inset-0 bg-white/40 z-10" />
                  )}
                  <img
                    src={char.img}
                    alt={char.name}
                    className="w-[78%] h-[78%] object-contain drop-shadow-lg"
                  />
                </div>

                {/* Info */}
                <div className="mt-3 flex flex-col items-center gap-0.5 px-2">
                  <span className="text-[14px] font-bold text-[#1A1A2E]">{char.name}</span>
                  <span className="text-[11px] text-[#8E8E93] font-medium">{char.desc}</span>
                </div>

                {/* Selection checkmark */}
                {isSelected && (
                  <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-[#00D26A] flex items-center justify-center shadow-sm">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-5">
        <button
          disabled={ctaDisabled}
          onClick={handleCTA}
          className="w-full h-[54px] rounded-2xl text-[15px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          style={ctaStyle()}
        >
          {!isOwned && canAfford && <Coins size={16} />}
          {isSameAsActive && <CheckCircle2 size={18} />}
          {ctaLabel()}
        </button>
      </div>
    </div>
  );
}
