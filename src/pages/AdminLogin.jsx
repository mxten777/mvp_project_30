
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


const errorMessages = {
  "auth/user-not-found": "존재하지 않는 계정입니다.",
  "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
  "auth/invalid-email": "이메일 형식이 올바르지 않습니다.",
  "default": "로그인에 실패했습니다. 이메일/비밀번호를 확인하세요.",
};

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onLogin) onLogin();
      navigate("/admin/dashboard"); // 로그인 성공 시 대시보드로 이동
    } catch (err) {
      setError(errorMessages[err.code] || errorMessages["default"]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">관리자 로그인</h2>
        <input
          type="email"
          className="w-full border rounded p-2 mb-3"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
        />
        <div className="relative mb-3">
          <input
            type={showPw ? "text" : "password"}
            className="w-full border rounded p-2 pr-16"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-2 top-2 text-xs text-gray-500"
            tabIndex={-1}
          >
            {showPw ? "숨김" : "표시"}
          </button>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
        {error && <div className="text-red-600 mt-3">{error}</div>}
        <div className="mt-2 text-right">
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              window.open("https://your-firebase-project.firebaseapp.com/__/auth/action?mode=resetPassword", "_blank");
            }}
            className="text-blue-500 underline text-xs"
          >
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </form>
    </div>
  );
}
