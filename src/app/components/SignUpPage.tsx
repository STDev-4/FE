import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Calendar } from "lucide-react";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", passwordConfirm: "", nickname: "", birth: "" });

  const isValid = form.email && form.password.length >= 8 && form.password === form.passwordConfirm && form.nickname && form.birth;

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const inputClass =
    "w-full h-[52px] rounded-xl border border-[#E5E5EA] px-4 pl-11 text-[15px] outline-none focus:border-[#007AFF] transition-colors bg-white";

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#1A1A2E" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-6 mt-2">
        <div className="h-[3px] bg-gray-200 rounded-full">
          <div className="h-full w-1/3 bg-[#00D26A] rounded-full transition-all" />
        </div>
      </div>

      <div className="px-6 mt-8 flex-1">
        <h1 className="text-[24px] text-[#1A1A2E]">계정을 만들어 볼까요?</h1>
        <p className="text-[14px] text-[#8E8E93] mt-2">간단한 정보만 입력하면 끝!</p>

        <div className="flex flex-col gap-4 mt-8">
          {[
            { key: "email", icon: Mail, placeholder: "이메일 주소", type: "email" },
            { key: "password", icon: Lock, placeholder: "비밀번호 (8자 이상)", type: showPw ? "text" : "password", hasEye: true },
            { key: "passwordConfirm", icon: Lock, placeholder: "비밀번호 확인", type: "password" },
            { key: "nickname", icon: User, placeholder: "닉네임", type: "text" },
            { key: "birth", icon: Calendar, placeholder: "생년월일 (YYYY.MM.DD)", type: "text" },
          ].map((f) => (
            <div key={f.key} className="relative">
              <f.icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className={inputClass}
              />
              {f.hasEye && (
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8 pt-4">
        <button
          onClick={() => isValid && navigate("/bank")}
          disabled={!isValid}
          className={`w-full h-[52px] rounded-xl text-[16px] text-white transition-colors ${
            isValid ? "bg-[#00D26A] hover:bg-[#00b85c]" : "bg-[#D1D1D6]"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
