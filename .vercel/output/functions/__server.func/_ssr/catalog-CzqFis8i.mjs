import { p as phpToUsd } from "./manila-BaDjFwMm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-CzqFis8i.js
var PRODUCT_CATALOG = [
	{
		code: "lamp",
		merchantId: "harbor-goods",
		name: "Wick brass lamp",
		description: "A small brass desk lamp for early-morning tutorials.",
		price: phpToUsd(1890),
		image: "/covers/product.jpg",
		commissionBps: 1200,
		windowDays: 14,
		guidelines: "Show the lamp. Do not invent medical or income claims."
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
		guidelines: "Keep the product name accurate. No celebrity likenesses."
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
		guidelines: "Do not compare it with a trademark you do not have rights to."
	},
	{
		code: "course-kit",
		merchantId: "daily-connect",
		name: "Morning kit",
		description: "Printed prompt cards that pair with the daily tutorial.",
		price: phpToUsd(650),
		image: "/covers/rag.jpg",
		commissionBps: 2e3,
		windowDays: 30,
		guidelines: "Say they are prompt cards, not a guaranteed outcome."
	}
];
var DEFAULT_POLICY = {
	creatorShareBps: 5e3,
	creatorBasis: "net",
	affiliateMemberShareBps: 7e3,
	note: "Creator share is half of net eligible revenue received. Affiliate member share is 70% of the merchant commission, not a second membership bonus."
};
function productByCode(code) {
	return PRODUCT_CATALOG.find((item) => item.code === code) ?? null;
}
//#endregion
export { PRODUCT_CATALOG as n, productByCode as r, DEFAULT_POLICY as t };
