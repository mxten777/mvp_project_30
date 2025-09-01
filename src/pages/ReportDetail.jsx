import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 제보를 삭제하시겠습니까?")) return;
    setDeleting(true);
    await import("firebase/firestore").then(({ deleteDoc, doc }) =>
      deleteDoc(doc(db, "reports", report.id))
    );
    setDeleting(false);
    navigate("/reports");
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const docRef = doc(db, "reports", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReport({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchReport();
    // 관리자 로그인 여부 확인
    const unsub = auth.onAuthStateChanged((user) => {
      setIsAdmin(!!user);
    });
    return () => unsub();
  }, [id]);

  if (loading) return <div className="p-8">불러오는 중...</div>;
  if (!report) return <div className="p-8">제보를 찾을 수 없습니다.</div>;

  const handleComplete = async () => {
    setUpdating(true);
    await updateDoc(doc(db, "reports", report.id), { status: "처리완료" });
    setReport({ ...report, status: "처리완료" });
    setUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex gap-2 mb-4">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            홈으로
          </button>
          <Link to="/reports" className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded shadow hover:bg-blue-200 transition font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            목록으로
          </Link>
        </div>
        <h2 className="text-2xl font-bold mb-4">제보 상세</h2>
        <div className="mb-2"><span className="font-semibold">설명:</span> {report.description}</div>
        <div className="mb-2"><span className="font-semibold">위치:</span> {report.location || "-"}</div>
        <div className="mb-2 text-xs text-gray-500">등록일: {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleString() : ""}</div>
        <div className="mb-4">
          <span className={`inline-block px-2 py-1 text-xs rounded ${report.status === "처리완료" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {report.status || "미처리"}
          </span>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            {report.status !== "처리완료" && (
              <button onClick={handleComplete} disabled={updating} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                {updating ? "처리 중..." : "처리완료로 변경"}
              </button>
            )}
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
              {deleting ? "삭제 중..." : "제보 삭제"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
