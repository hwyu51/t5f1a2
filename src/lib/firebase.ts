import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase 웹 클라이언트 키는 공개 전제 — 보안은 Firestore Rules로 보호.
// 추가 보안: Firebase Console → API 키 → HTTP 리퍼러 제한(hwyu51.github.io)으로 가둘 수 있음.
const firebaseConfig = {
  apiKey: 'AIzaSyAl1B2IBKSkeiK-9fF3z5hTtI6mE57tJ94',
  authDomain: 't5f1a2.firebaseapp.com',
  projectId: 't5f1a2',
  storageBucket: 't5f1a2.firebasestorage.app',
  messagingSenderId: '991459831135',
  appId: '1:991459831135:web:8e9550a7b387f5071fdaea',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
