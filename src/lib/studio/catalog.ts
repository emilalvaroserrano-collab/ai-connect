import { phpToUsd } from "@/lib/firebase-config";

export type StudioProduct = {
  code: string;
  merchantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  commissionBps: number;
  windowDays: number;
  guidelines: string;
};

export const PRODUCT_CATALOG: StudioProduct[] = [
  {
    code: "lamp",
    merchantId: "harbor-goods",
    name: "Wick brass lamp",
    description: "A small brass desk lamp for early-morning tutorials.",
    price: phpToUsd(1890),
    image: "/covers/product.jpg",
    commissionBps: 1200,
    windowDays: 14,
    guidelines: "Show the lamp. Do not invent medical or income claims.",
  },
  {
    code: "notebook",
    merchantId: "harbor-goods",
    name: "Carbon copy notebook",
    description: "A5 notebook with a perforated second sheet.",
    price: phpToUsd(420),
    image: "/covers/projects.jpg",
    commissionBps: 1500,
    windowDays: 7,
    guidelines: "Keep the product name accurate. No celebrity likenesses.",
  },
  {
    code: "headset",
    merchantId: "northline",
    name: "Northline headset",
    description: "Closed headset for lesson audio and live selling.",
    price: phpToUsd(2450),
    image: "/covers/voice.jpg",
    commissionBps: 800,
    windowDays: 14,
    guidelines: "Do not compare it with a trademark you do not have rights to.",
  },
  {
    code: "course-kit",
    merchantId: "daily-connect",
    name: "Morning kit",
    description: "Printed prompt cards that pair with the daily tutorial.",
    price: phpToUsd(650),
    image: "/covers/rag.jpg",
    commissionBps: 2000,
    windowDays: 30,
    guidelines: "Say they are prompt cards, not a guaranteed outcome.",
  },
];

export const DEFAULT_POLICY = {
  creatorShareBps: 5000,
  creatorBasis: "net" as const,
  affiliateMemberShareBps: 7000,
  note: "Creator share is half of net eligible revenue received. Affiliate member share is 70% of the merchant commission, not a second membership bonus.",
};

export function productByCode(code: string) {
  return PRODUCT_CATALOG.find((item) => item.code === code) ?? null;
}
