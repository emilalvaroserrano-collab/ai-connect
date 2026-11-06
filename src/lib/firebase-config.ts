/** Public Firebase web config (the client key is not a server secret). */
export const firebaseConfig = {
  apiKey: "AIzaSyC8k-Urv_CEQSuJFSEojh_aU9ur3LijXOA",
  authDomain: "masterplan-1cd65.firebaseapp.com",
  databaseURL: "https://masterplan-1cd65-default-rtdb.firebaseio.com",
  projectId: "masterplan-1cd65",
  storageBucket: "masterplan-1cd65.firebasestorage.app",
  messagingSenderId: "737894267682",
  appId: "1:737894267682:web:26d96704580c32222d037b",
  measurementId: "G-F8G60GBV0S",
} as const;

/** 6 Nov 2026 spot, about ₱63 per $1. */
export const PHP_PER_USD = 63;

export function phpToUsd(php: number) {
  return Math.round((php * 100) / PHP_PER_USD) / 100;
}

export const MEMBERSHIP_FEE = phpToUsd(550);
export const DIRECT_BONUS = phpToUsd(50);
export const LEVEL_BONUS = phpToUsd(10);
export const LEVELS = 10;
export const PAYOUT_MIN = phpToUsd(100);
