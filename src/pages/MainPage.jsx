import React from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-200 bg-gradient-to-br from-emerald-200 via-emerald-300 to-cyan-200 px-2">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl flex flex-col items-center py-10 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-emerald-800 text-center drop-shadow">주민 제보·민원 실시간 처리</h1>
        <div className="flex flex-col gap-4 w-full">
          <Link to="/report" className="group block w-full">
            <div className="flex items-center gap-4 bg-emerald-600/90 hover:bg-emerald-700 transition rounded-xl shadow-lg px-6 py-5">
              <span className="text-2xl bg-white/20 rounded-full p-2"><svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' /></svg></span>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-white">제보하러 가기</div>
                <div className="text-xs text-emerald-100 mt-1">불편사항, 민원, 제보를 쉽고 빠르게 등록</div>
              </div>
            </div>
          </Link>
          <Link to="/reports" className="group block w-full">
            <div className="flex items-center gap-4 bg-emerald-100 hover:bg-emerald-200 transition rounded-xl shadow-lg px-6 py-5">
              <span className="text-2xl bg-emerald-200 rounded-full p-2"><svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-emerald-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' /></svg></span>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-emerald-900">제보 목록</div>
                <div className="text-xs text-emerald-700 mt-1">전체 제보 현황 및 상세 내역 확인</div>
              </div>
            </div>
          </Link>
          <Link to="/admin" className="group block w-full">
            <div className="flex items-center gap-4 bg-emerald-900 hover:bg-emerald-800 transition rounded-xl shadow-lg px-6 py-5">
              <span className="text-2xl bg-emerald-800 rounded-full p-2"><svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg></span>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-white">관리자 모드</div>
                <div className="text-xs text-emerald-100 mt-1">통계, 처리, 대시보드 등 관리자 기능</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
