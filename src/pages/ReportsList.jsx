import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
// CSV 변환 및 다운로드 함수
function downloadCSV(data) {
  if (!data.length) return;
  const replacer = (key, value) => value === null || value === undefined ? '' : value;
  const header = ["설명", "위치", "상태", "등록일"];
  const rows = data.map(r => [
    r.description,
    r.location,
    r.status || "미처리",
    r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ""
  ]);
  const csv = [header, ...rows].map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `reports_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
import { Link } from "react-router-dom";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    let firstLoad = true;
    const unsub = onSnapshot(q, (snapshot) => {
      const newReports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // 새 제보 알림(최초 로딩 제외)
      if (!firstLoad && newReports.length > reports.length) {
        setToast("새 제보가 등록되었습니다!");
        setTimeout(() => setToast(""), 2500);
      }
      setReports(newReports);
      setLoading(false);
      firstLoad = false;
    });
    return () => unsub();
    // eslint-disable-next-line
  }, []);

  const filtered = (filter === "all" ? reports : reports.filter(r => (filter === "done" ? r.status === "처리완료" : !r.status || r.status === "미처리")))
    .filter(r => {
      if (!search.trim()) return true;
      const keyword = search.trim().toLowerCase();
      return (
        (r.description && r.description.toLowerCase().includes(keyword)) ||
        (r.location && r.location.toLowerCase().includes(keyword))
      );
    });

  // 통계
  const total = reports.length;
  const undone = reports.filter(r => !r.status || r.status === "미처리").length;
  const done = reports.filter(r => r.status === "처리완료").length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
  <div className="max-w-2xl mx-auto relative">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded shadow-lg z-50 animate-bounce">
            {toast}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2">제보 목록</h2>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-2 text-sm">
          <div className="flex gap-4">
            <span>전체: <b>{total}</b></span>
            <span className="text-yellow-700">미처리: <b>{undone}</b></span>
            <span className="text-green-700">처리완료: <b>{done}</b></span>
          </div>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
            onClick={() => downloadCSV(filtered)}
            disabled={filtered.length === 0}
          >
            엑셀(CSV) 다운로드
          </button>
        </div>
        <Link to="/" className="mb-4 inline-block">
          <button className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </button>
        </Link>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex gap-2">
            <button onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>전체</button>
            <button onClick={() => setFilter("undone")}
              className={`px-3 py-1 rounded ${filter === "undone" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}>미처리</button>
            <button onClick={() => setFilter("done")}
              className={`px-3 py-1 rounded ${filter === "done" ? "bg-green-600 text-white" : "bg-gray-200"}`}>처리완료</button>
          </div>
          <input
            type="text"
            className="border rounded px-3 py-1 w-full sm:w-64"
            placeholder="설명 또는 위치 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div>불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div>등록된 제보가 없습니다.</div>
        ) : (
          <ul className="space-y-4">
            {filtered.map(r => (
              <li key={r.id} className="bg-white p-4 rounded shadow hover:bg-blue-50 transition">
                <Link to={`/reports/${r.id}`} className="block">
                  <div className="font-semibold mb-1">{r.description}</div>
                  <div className="text-sm text-gray-600 mb-1">위치: {r.location || "-"}</div>
                  <div className="text-xs text-gray-400 mb-1">{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ""}</div>
                  <div className={`inline-block px-2 py-1 text-xs rounded ${r.status === "처리완료" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {r.status || "미처리"}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
