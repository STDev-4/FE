import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { authApi } from "../lib/services";
import { ApiError } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full h-[52px] rounded-xl border border-[#E5E5EA] px-4 pl-11 text-[15px] outline-none focus:border-[#007AFF] transition-colors";

  const handleLogin = async () => {
    if (!loginId || !password || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await authApi.login({ loginId, password });
      navigate("/app");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "로그인에 실패했습니다";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center max-w-[480px] mx-auto px-6">
      <div className="mt-32 mb-2 flex justify-center">
        <img src="/images/logo.png" alt="MoneyBeanLogo" className="w-[240px] object-contain" />
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="relative">
          <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          <input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            autoComplete="username"
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
            autoComplete="current-password"
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

      {error && <p className="w-full text-[13px] text-[#FF3B30] mt-2">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={submitting || !loginId || !password}
        className="w-full h-[52px] bg-[#00D26A] text-white rounded-xl text-[16px] hover:bg-[#00b85c] transition-colors mt-4 disabled:opacity-50"
      >
        {submitting ? "로그인 중..." : "로그인"}
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
