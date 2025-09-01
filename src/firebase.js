// Firebase 기본 초기화 파일
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// 아래 config는 Firebase 콘솔에서 복사해 붙여넣으세요
const firebaseConfig = {
  apiKey: "AIzaSyB3YOzYt-8EBVkgaB5FmvHemVvXmPmtPsI",
  authDomain: "mvp-project-30.firebaseapp.com",
  projectId: "mvp-project-30",
  storageBucket: "mvp-project-30.appspot.com",
  messagingSenderId: "991596683859",
  appId: "1:991596683859:web:5b91bb8f937e4e5b989ca6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
