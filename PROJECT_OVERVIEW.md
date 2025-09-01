# 주민 제보·민원 실시간 처리 웹앱 (MVP)

## 🛠️ 기술스택
- **프론트엔드**: Vite + React + TailwindCSS 3.3.3
- **상태관리/라우팅**: React Router
- **차트/시각화**: chart.js, react-chartjs-2
- **지도**: Leaflet, react-leaflet, OpenStreetMap
- **백엔드/DB**: Firebase (Firestore, Auth)
- **배포**: Vercel
- **실시간**: Firestore onSnapshot

---

## 📦 주요 폴더/파일 구조
```
src/
  App.jsx
  main.jsx
  firebase.js
  index.css
  pages/
    MainPage.jsx
    ReportPage.jsx
    ReportsList.jsx
    ReportDetail.jsx
    AdminLogin.jsx
    AdminPage.jsx
    AdminDashboard.jsx
public/
  ...
index.html
tailwind.config.js
package.json
```

---

## 🚀 구현된 주요 기능

### 사용자
- 메인/소개 페이지
- 제보 등록(설명, 위치, 위치 자동입력, 사진 첨부 UI만, 실제 업로드X)
- 제보 목록/상세 조회
- 실시간 데이터 반영

### 관리자
- 이메일/비밀번호 로그인
- 관리자 전용 제보 목록(상태별 필터, 검색, 엑셀 다운로드)
- 제보 상세(처리완료/삭제 버튼, 관리자만 노출)
- 관리자 대시보드
  - 최근 7일 제보 추이(막대그래프)
  - 미처리/처리완료 비율(도넛 차트)
  - 월별 제보 건수(6개월, 꺾은선)
  - 요일별/시간대별 제보 분포(막대그래프)
  - 최근 제보 지도(위치 입력된 건만)
  - 최근 제보 미리보기(모달)
- 모든 통계/목록/지도 실시간 반영

---

## 📝 앞으로 추가할 일 (To-Do)

1. **사진 업로드 기능**
   - Firebase Storage(Blaze 요금제 필요) 또는 외부 이미지 호스팅 연동
2. **알림 기능 고도화**
   - 관리자 이메일/카카오톡/푸시 알림 연동
3. **권한/보안 강화**
   - 관리자 계정 관리, OTP/2FA, 접근제어
4. **제보 처리 이력/로그**
   - 처리자, 처리일시, 처리메모 등 기록
5. **지도 고도화**
   - 전체 제보 지도, 클러스터링, 동별/구별 집계
6. **통계 추가**
   - 동별/구별 분포, 처리 소요시간(평균/최대/최소)
7. **UI/UX 개선**
   - 모바일 최적화, 접근성, 다국어 지원
8. **운영/배포 자동화**
   - CI/CD, 환경변수 관리, 모니터링
9. **공공데이터/API 연동**
   - 행정포털, 복지부/고용부 등 외부 데이터 연동
10. **테스트/문서화**
    - E2E 테스트, 사용자/관리자 매뉴얼, API 문서

---

> 이 마크다운은 프로젝트의 "활일(활동/할일) 보관용"입니다. 추가/수정이 필요하면 언제든 말씀해 주세요!
