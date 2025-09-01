import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import ReportsList from "./ReportsList";
import AdminLogin from "./AdminLogin";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (!user) return <AdminLogin onLogin={() => setUser(auth.currentUser)} />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </button>
          <div className="font-bold ml-2">관리자 모드</div>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/dashboard" className="px-3 py-1 bg-blue-600 text-white rounded">대시보드</Link>
          <button onClick={() => signOut(auth)} className="px-3 py-1 bg-gray-300 rounded">로그아웃</button>
        </div>
      </div>
      <ReportsList />
    </div>
  );
}
