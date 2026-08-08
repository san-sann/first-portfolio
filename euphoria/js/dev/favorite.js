import { i as onWishlistChange, o as toggleWishlist, r as isInWishlist } from "./main.min.js";
//#region src/components/custom/favorite/favorite.js
function readCardData(button) {
	const card = button.closest(".item-product");
	const id = card?.dataset.productId;
	if (!id) return null;
	const titleEl = card.querySelector(".item-product__link-title");
	const priceEl = card.querySelector(".item-product__price");
	const imageEl = card.querySelector(".item-product__image");
	const labelEl = card.querySelector(".item-product__label");
	const title = titleEl?.textContent.trim() || "";
	return {
		id,
		title,
		price: parseFloat(priceEl?.textContent.replace(/[^0-9.]/g, "")) || 0,
		image: imageEl?.currentSrc || imageEl?.src || "",
		alt: imageEl?.alt || title,
		brand: labelEl?.textContent.trim() || ""
	};
}
function syncButton(button, active, title) {
	button.classList.toggle("item-product__favorite--active", active);
	button.setAttribute("aria-pressed", String(active));
	button.setAttribute("aria-label", `${active ? "Remove" : "Add"} ${title} ${active ? "from" : "to"} wishlist`);
}
function syncAll() {
	document.querySelectorAll("[data-fls-favorite]").forEach((button) => {
		const card = button.closest(".item-product");
		const id = card?.dataset.productId;
		if (!id) return;
		const title = card.querySelector(".item-product__link-title")?.textContent.trim() || "item";
		syncButton(button, isInWishlist(id), title);
	});
}
document.addEventListener("click", (e) => {
	const button = e.target.closest("[data-fls-favorite]");
	if (!button) return;
	const data = readCardData(button);
	if (!data) return;
	syncButton(button, toggleWishlist(data), data.title);
});
onWishlistChange(syncAll);
syncAll();
//#endregion
