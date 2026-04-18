import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Check, User, Lock } from "lucide-react";

const banks = [
  { id: "kb", name: "국민카드", logo: "/images/kukmin.png", imgClass: "scale-[2.2]" },
  { id: "shinhan", name: "신한카드", logo: "/images/shinhan.png", imgClass: "scale-100" },
  { id: "hana", name: "하나카드", logo: "/images/hana.png", imgClass: "scale-[1.3]" },
  { id: "nh", name: "농협카드", logo: "/images/nonghyup.png", imgClass: "scale-[2.5]" },
  { id: "ibk", name: "기업카드", logo: "/images/ibk.png", imgClass: "scale-100" },
];

export default function BankConnectionPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [cardId, setCardId] = useState("");
  const [cardPw, setCardPw] = useState("");

  const isValid = selected && cardId && cardPw;
  const inputClass = "w-full h-[52px] rounded-xl border border-[#E5E5EA] px-4 pl-11 text-[15px] outline-none focus:border-[#00D26A] transition-colors bg-white";

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#1A1A2E" />
        </button>
      </div>

      <div className="px-6 mt-2">
        <div className="h-[3px] bg-gray-200 rounded-full">
          <div className="h-full w-2/3 bg-[#00D26A] rounded-full" />
        </div>
      </div>

      <div className="px-6 mt-8 flex-1">
        <h1 className="text-[24px] text-[#1A1A2E]">주거래 카드를 연결해 주세요</h1>
        <p className="text-[14px] text-[#8E8E93] mt-2">소비 습관을 분석하기 위해 필요해요</p>

        <div className="grid grid-cols-2 gap-3 mt-8">
          {banks.map((bank) => {
            const isSelected = selected === bank.id;
            return (
              <button
                key={bank.id}
                onClick={() => setSelected(bank.id)}
                className={`relative flex flex-col items-center justify-center h-[100px] rounded-2xl transition-all ${isSelected
                  ? "border-2 border-[#00D26A] bg-[#00D26A]/8"
                  : "border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00D26A] flex items-center justify-center">
                    <Check size={12} color="white" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 overflow-hidden bg-white border border-gray-100 p-1.5 shadow-sm">
                  <img src={bank.logo} alt={`${bank.name} 로고`} className={`w-full h-full object-contain ${bank.imgClass}`} />
                </div>
                <span className="text-[13px] text-[#1A1A2E]">{bank.name}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="flex flex-col gap-3 mt-6">
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="text"
                placeholder="카드사 홈페이지 아이디"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="password"
                placeholder="카드사 홈페이지 비밀번호"
                value={cardPw}
                onChange={(e) => setCardPw(e.target.value)}
                className={inputClass}
              />
            </div>
            <p className="text-[13px] text-[#8E8E93] text-center">사용자 정보는 안전하게 처리해요</p>
          </div>
        )}
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => isValid && navigate("/loading")}
          disabled={!isValid}
          className={`w-full h-[52px] rounded-xl text-[16px] text-white transition-colors ${isValid ? "bg-[#00D26A] hover:bg-[#00b85c]" : "bg-[#D1D1D6]"
            }`}
        >
          연결하기
        </button>
      </div>
    </div>
  );
}
