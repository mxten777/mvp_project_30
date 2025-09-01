import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await addDoc(collection(db, "reports"), {
        description,
        location,
        createdAt: Timestamp.now(),
        status: "미처리",
      });
      setSuccess(true);
      setDescription("");
      setLocation("");
      setImage(null);
    } catch (err) {
      setError("제보 등록에 실패했습니다. 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  // 위치 자동 입력 함수
  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude},${longitude}`);
        setLocLoading(false);
      },
      (err) => {
        setError("위치 정보를 가져오지 못했습니다. 위치 권한을 허용해 주세요.");
        setLocLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mb-4">
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          홈으로
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">제보 등록</h2>
      <form className="w-full max-w-md bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">설명</label>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="불법 주정차, 쓰레기 무단투기 등 상황 설명"
          required
        />
        <label className="block mb-2 font-semibold">사진 첨부</label>
        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={e => setImage(e.target.files[0])}
          disabled
        />
        <label className="block mb-2 font-semibold">위치(선택)
          <button type="button" onClick={handleAutoLocation} className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300" disabled={locLoading}>
            {locLoading ? "위치 확인 중..." : "내 위치 자동 입력"}
          </button>
        </label>
        <input
          type="text"
          className="w-full border rounded p-2 mb-4"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="예: 서울시 강남구 ..."
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
          {loading ? "제출 중..." : "제보 제출"}
        </button>
        {success && <div className="text-green-600 mt-4">제보가 정상적으로 등록되었습니다!</div>}
        {error && <div className="text-red-600 mt-4">{error}</div>}
      </form>
    </div>
  );
}
