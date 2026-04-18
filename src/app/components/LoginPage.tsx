import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputClass =
    "w-full h-[52px] rounded-xl border border-[#E5E5EA] px-4 pl-11 text-[15px] outline-none focus:border-[#007AFF] transition-colors";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center max-w-[480px] mx-auto px-6">
      <div className="mt-32 mb-2 flex justify-center">
        <img src="/images/logo.png" alt="MoneyBeanLogo" className="w-[240px] object-contain" />
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="relative">
          <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="relative">
          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          <input
            type={showPw ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]"
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate("/app")}
        className="w-full h-[52px] bg-[#00D26A] text-white rounded-xl text-[16px] hover:bg-[#00b85c] transition-colors mt-4"
      >
        로그인
      </button>

      <div className="flex flex-col items-center gap-3 mt-6">
        <button className="text-[#8E8E93] text-[14px]">비밀번호를 잊었어요</button>
        <button onClick={() => navigate("/signup")} className="text-[#007AFF] text-[14px]">
          회원가입하기
        </button>
      </div>
    </div>
  );
}
