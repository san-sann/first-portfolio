import { C as spriteHref, a as removeFromWishlist, n as getWishlist, s as addToCart } from "./main.min.js";
import "./footer.min.js";
import "./watcher.min.js";
/* empty css               */
/* empty css           */
//#region src/components/pages/wishlist/wishlist.js
function formatPrice(amount) {
	return `$${amount.toFixed(2)}`;
}
function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (ch) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[ch]);
}
function rowTemplate(item) {
	const title = escapeHtml(item.title);
	const metaColor = item.color ? `<p class="wishlist__meta">Color : <span class="wishlist__meta-value">${escapeHtml(item.color)}</span></p>` : "";
	return `<li class="wishlist__item" data-wishlist-id="${escapeHtml(item.id)}">
		<button type="button" class="wishlist__remove" aria-label="Remove ${title} from wishlist">
			<svg class="icon" aria-hidden="true"><use xlink:href="${spriteHref("close")}"></use></svg>
		</button>
		<img src="${item.image}" alt="${escapeHtml(item.alt || item.title)}" class="wishlist__image" width="110" height="110" loading="lazy" />
		<div class="wishlist__info">
			<h3 class="wishlist__item-title">${title}</h3>
			<div class="wishlist__row">
				${metaColor}
				<p class="wishlist__price">${formatPrice(item.price)}</p>
				<button type="button" data-fls-button data-product-id="${escapeHtml(item.id)}" class="button wishlist__cart-button">Add to cart</button>
			</div>
		</div>
	</li>`;
}
function announce(message) {
	const status = document.querySelector("[data-wishlist-status]");
	if (status) status.textContent = message;
}
function renderWishlist() {
	const items = getWishlist();
	if (!items.length) {
		window.location.replace("emptywishlist.html");
		return;
	}
	const list = document.querySelector("[data-wishlist-rows]");
	if (list) list.innerHTML = items.map(rowTemplate).join("");
}
function handleRemove(row) {
	const title = row.querySelector(".wishlist__item-title")?.textContent?.trim() || "Item";
	const nextItem = row.nextElementSibling;
	const prevItem = row.previousElementSibling;
	removeFromWishlist(row.dataset.wishlistId);
	row.remove();
	announce(`${title} removed from wishlist.`);
	if (!document.querySelector(".wishlist__item")) {
		window.location.replace("emptywishlist.html");
		return;
	}
	(nextItem?.querySelector(".wishlist__remove") || prevItem?.querySelector(".wishlist__remove"))?.focus();
}
function handleAddToCart(button) {
	const row = button.closest(".wishlist__item");
	if (!row) return;
	const item = getWishlist().find((i) => i.id === row.dataset.wishlistId);
	if (!item) return;
	addToCart({
		id: item.id,
		title: item.title,
		price: item.price,
		shipping: 0,
		image: item.image,
		alt: item.alt,
		size: "",
		color: item.color || "",
		qty: 1
	});
	announce(`${item.title} added to cart.`);
}
document.addEventListener("click", (e) => {
	const removeBtn = e.target.closest(".wishlist__remove");
	if (removeBtn) {
		const row = removeBtn.closest(".wishlist__item");
		if (row) handleRemove(row);
		return;
	}
	const cartBtn = e.target.closest(".wishlist__cart-button");
	if (cartBtn) handleAddToCart(cartBtn);
});
renderWishlist();
//#endregion
