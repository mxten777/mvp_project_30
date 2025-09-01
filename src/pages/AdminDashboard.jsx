
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

function ReportModal({ report, onClose }) {
  if (!report) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">×</button>
        <h3 className="text-xl font-bold mb-4">제보 미리보기</h3>
        <div className="mb-2"><span className="font-semibold">설명:</span> {report.description}</div>
        <div className="mb-2"><span className="font-semibold">위치:</span> {report.location || "-"}</div>
        <div className="mb-2"><span className="font-semibold">상태:</span> <span className={`inline-block px-2 py-1 text-xs rounded ${report.status === "처리완료" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{report.status || "미처리"}</span></div>
        <div className="mb-2 text-xs text-gray-500">등록일: {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleString() : ""}</div>
        <Link to={`/reports/${report.id}`} className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">상세 페이지로 이동</Link>
      </div>
    </div>
  );
}


export default function AdminDashboard() {
  const [toast, setToast] = useState("");
  const recentListRef = React.useRef(null);
  // 샘플 데이터 생성 함수 (컴포넌트 내부로 이동)
  const createSampleData = async () => {
    const descriptions = [
      "도로 파손 신고", "가로등 고장", "불법 쓰레기 투기", "소음 민원", "불법 주정차", "공원 시설물 파손", "하수구 막힘", "신호등 고장", "보도블럭 파손", "불법 광고물", "가로수 훼손", "도로 침수", "공공시설 청소 요청", "동물 사체 신고", "불법 현수막", "주민 불편 신고", "도로 낙서", "불법 영업", "공사장 소음", "기타 민원"
    ];
    const locations = [
      "37.5665,126.9780", "37.5700,126.9820", "37.5651,126.9895", "37.5678,126.9770", "37.5640,126.9800",
      "37.5680,126.9760", "37.5690,126.9750", "37.5630,126.9810", "37.5620,126.9790", "37.5610,126.9785"
    ];
    const statusArr = ["미처리", "처리완료"];
    const now = new Date();
    for (let i = 0; i < 20; i++) {
      const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const status = statusArr[Math.floor(Math.random() * statusArr.length)];
      // 최근 6개월 내 랜덤 날짜
      const daysAgo = Math.floor(Math.random() * 180);
      const createdAt = Timestamp.fromDate(new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000));
      await addDoc(collection(db, "reports"), {
        description: desc,
        location: loc,
        status,
        createdAt
      });
    }
    setToast("샘플 데이터 20건이 생성되었습니다.");
    setTimeout(() => setToast(""), 2500);
    setTimeout(() => {
      if (recentListRef.current) {
        recentListRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 400); // Firestore 실시간 반영 후 스크롤
  };
  const [stats, setStats] = useState({ total: 0, undone: 0, done: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState([]); // 최근 7일 제보수
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [monthStats, setMonthStats] = useState({ labels: [], data: [] });
  const [weekdayStats, setWeekdayStats] = useState({ labels: [], data: [] });
  const [hourStats, setHourStats] = useState({ labels: [], data: [] });
  const [modalReport, setModalReport] = useState(null);

  // 인증 보호: 로그인 안 했으면 /admin으로 리다이렉트
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) navigate("/admin", { replace: true });
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStats({
        total: all.length,
        undone: all.filter(r => !r.status || r.status === "미처리").length,
        done: all.filter(r => r.status === "처리완료").length,
      });
      setRecent(all.slice(0, 5));
      // 최근 7일 제보 추이 계산
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
      });
      const trendData = days.map(day => {
        const y = day.getFullYear(), m = day.getMonth(), d = day.getDate();
        return all.filter(r => {
          if (!r.createdAt?.toDate) return false;
          const dt = r.createdAt.toDate();
          return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
        }).length;
      });
      setTrend({
        labels: days.map(d => `${d.getMonth() + 1}/${d.getDate()}`),
        data: trendData,
      });

      // 월별 제보 건수(최근 6개월)
      const now = new Date();
      const monthLabels = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return `${d.getFullYear()}.${d.getMonth() + 1}`;
      });
      const monthData = monthLabels.map(label => {
        const [y, m] = label.split(".").map(Number);
        return all.filter(r => {
          if (!r.createdAt?.toDate) return false;
          const dt = r.createdAt.toDate();
          return dt.getFullYear() === y && dt.getMonth() + 1 === m;
        }).length;
      });
      setMonthStats({ labels: monthLabels, data: monthData });

      // 요일별 제보 분포
      const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
      const weekData = Array(7).fill(0);
      all.forEach(r => {
        if (!r.createdAt?.toDate) return;
        const dt = r.createdAt.toDate();
        weekData[dt.getDay()]++;
      });
      setWeekdayStats({ labels: weekDays, data: weekData });

      // 시간대별 제보 분포(0~23시)
      const hourLabels = Array.from({ length: 24 }).map((_, i) => `${i}시`);
      const hourData = Array(24).fill(0);
      all.forEach(r => {
        if (!r.createdAt?.toDate) return;
        const dt = r.createdAt.toDate();
        hourData[dt.getHours()]++;
      });
      setHourStats({ labels: hourLabels, data: hourData });

      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // 지도에 표시할 좌표 추출 (위치가 '위도,경도' 형식인 경우만)
  const mapReports = recent
    .map(r => {
      if (!r.location) return null;
      const [lat, lng] = r.location.split(",").map(Number);
      if (isNaN(lat) || isNaN(lng)) return null;
      return { ...r, lat, lng };
    })
    .filter(Boolean);

  // Leaflet 아이콘 경로 설정 (Vite/ESM 호환)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  if (authLoading) return <div className="p-8 text-center">인증 확인 중...</div>;
  if (!user) return null; // 리다이렉트 처리됨
  return (
    <div className="min-h-screen bg-emerald-200 bg-gradient-to-br from-emerald-200 via-emerald-300 to-cyan-200">
      {/* Top Navbar */}
      <nav className="bg-emerald-700/90 shadow sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold text-xl tracking-tight">🛡️ MVP Admin</span>
            <span className="ml-2 text-emerald-100 text-xs font-semibold bg-emerald-800/60 px-2 py-1 rounded">대시보드</span>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="text-emerald-100 text-sm font-medium">{user?.email}</span>
            <button onClick={() => { auth.signOut(); navigate('/admin'); }} className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded text-sm">로그아웃</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* 샘플 데이터 버튼 */}
        <div className="flex flex-col sm:flex-row justify-end mb-4 gap-2">
          <button
            onClick={createSampleData}
            className="px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition text-sm w-full sm:w-auto"
          >
            샘플 데이터 20건 생성
          </button>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-emerald-600 w-full">
            <div className="text-emerald-700 text-sm mb-1">전체 제보</div>
            <div className="text-3xl font-bold text-emerald-700">{stats.total}</div>
          </div>
          <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-yellow-400 w-full">
            <div className="text-yellow-600 text-sm mb-1">미처리</div>
            <div className="text-3xl font-bold text-yellow-500">{stats.undone}</div>
          </div>
          <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-emerald-400 w-full">
            <div className="text-emerald-600 text-sm mb-1">처리완료</div>
            <div className="text-3xl font-bold text-emerald-600">{stats.done}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8">
          {/* 지도 */}
          <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col min-h-[320px]">
            <div className="font-semibold mb-2 text-emerald-700">최근 제보 위치 지도</div>
            {mapReports.length > 0 ? (
              <MapContainer center={[mapReports[0].lat, mapReports[0].lng]} zoom={13} style={{ height: 260, width: "100%" }} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mapReports.map(r => (
                  <Marker key={r.id} position={[r.lat, r.lng]}>
                    <Popup>
                      <div className="font-semibold mb-1">{r.description}</div>
                      <div className="text-xs text-gray-500">{r.location}</div>
                      <div className="text-xs text-gray-500">{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ""}</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : <div className="text-gray-400 text-sm text-center py-12">최근 위치 데이터 없음</div>}
          </div>

          {/* 월별/요일별 차트 */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
              <div className="font-semibold mb-2 text-emerald-700">월별 제보 건수(최근 6개월)</div>
              <Line
                data={{
                  labels: monthStats.labels,
                  datasets: [{
                    label: "제보 건수",
                    data: monthStats.data,
                    borderColor: "#059669",
                    backgroundColor: "#6ee7b7",
                    tension: 0.3,
                    fill: true,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, precision: 0 } },
                }}
                height={180}
              />
            </div>
            <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
              <div className="font-semibold mb-2 text-emerald-700">요일별 제보 분포</div>
              <Bar
                data={{
                  labels: weekdayStats.labels,
                  datasets: [{
                    label: "제보 건수",
                    data: weekdayStats.data,
                    backgroundColor: "#34d399",
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, precision: 0 } },
                }}
                height={180}
              />
            </div>
          </div>
        </div>

        {/* 하단 차트들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8">
          <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
            <div className="font-semibold mb-2 text-emerald-700">최근 7일 제보 추이</div>
            <Bar
              data={{
                labels: trend.labels,
                datasets: [{
                  label: "제보 건수",
                  data: trend.data,
                  backgroundColor: "#059669",
                }],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, precision: 0 } },
              }}
              height={180}
            />
          </div>
          <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center">
            <div className="font-semibold mb-2 text-emerald-700">미처리/처리완료 비율</div>
            <Doughnut
              data={{
                labels: ["미처리", "처리완료"],
                datasets: [{
                  data: [stats.undone, stats.done],
                  backgroundColor: ["#facc15", "#22d3ee"],
                }],
              }}
              options={{
                plugins: { legend: { position: "bottom" } },
              }}
              height={180}
            />
          </div>
        </div>

        {/* 시간대별 차트 */}
        <div className="bg-white/90 rounded-xl shadow p-4 flex flex-col items-center mb-8">
          <div className="font-semibold mb-2 text-emerald-700">시간대별 제보 분포</div>
          <Bar
            data={{
              labels: hourStats.labels,
              datasets: [{
                label: "제보 건수",
                data: hourStats.data,
                backgroundColor: "#38bdf8",
              }],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, precision: 0 } },
            }}
            height={180}
          />
        </div>

        {/* 최근 제보 리스트 */}
        <div ref={recentListRef} className="bg-white/90 rounded-xl shadow p-4">
          <div className="mb-4 font-semibold text-lg text-emerald-700">최근 제보 5건</div>
          <ul className="divide-y divide-gray-100">
            {recent.map(r => (
              <li key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-emerald-50 transition px-2 rounded break-words" onClick={() => setModalReport(r)}>
                <div className="w-full max-w-full">
                  <div className="font-semibold break-words">{r.description}</div>
                  <div className="text-xs text-gray-500">{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ""}</div>
                </div>
                <span className="text-emerald-700 underline mt-2 sm:mt-0">미리보기</span>
              </li>
            ))}
          </ul>
        </div>

        <ReportModal report={modalReport} onClose={() => setModalReport(null)} />

        {/* 토스트 메시지 */}
        {toast && (
          <div className="fixed left-1/2 bottom-10 -translate-x-1/2 bg-emerald-700 text-white px-6 py-3 rounded shadow-lg z-50 text-base animate-fadein">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}