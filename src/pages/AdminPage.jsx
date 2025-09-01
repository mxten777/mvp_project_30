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
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <div className="font-bold">관리자 모드</div>
        <div className="flex gap-2">
          <Link to="/admin/dashboard" className="px-3 py-1 bg-blue-600 text-white rounded">대시보드</Link>
          <button onClick={() => signOut(auth)} className="px-3 py-1 bg-gray-300 rounded">로그아웃</button>
        </div>
      </div>
      <ReportsList />
    </div>
  );
}
