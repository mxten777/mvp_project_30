import React from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-200 bg-gradient-to-br from-emerald-200 via-emerald-300 to-cyan-200 px-2">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl flex flex-col items-center py-10 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-emerald-800 text-center drop-shadow">주민 제보·민원 실시간 처리</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link to="/report" className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition text-center font-semibold text-base break-keep">제보하러 가기</Link>
          <Link to="/reports" className="flex-1 px-4 py-3 bg-emerald-100 text-emerald-900 rounded-lg shadow hover:bg-emerald-200 transition text-center font-semibold text-base break-keep">제보 목록</Link>
          <Link to="/admin" className="flex-1 px-4 py-3 bg-emerald-900 text-white rounded-lg shadow hover:bg-emerald-800 transition text-center font-semibold text-base break-keep">관리자 모드</Link>
        </div>
      </div>
    </div>
  );
}
