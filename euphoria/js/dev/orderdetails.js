import { C as spriteHref } from "./main.min.js";
import "./footer.min.js";
import "./watcher.min.js";
/* empty css               */
//#region src/components/pages/orderdetails/orderdetails.js
var STEPS = [
	"Order Placed",
	"Inprogress",
	"Shipped",
	"Delivered"
];
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
function itemTemplate(item) {
	const title = escapeHtml(item.title);
	return `<li class="orderdetail__item">
		<img src="${item.img}" alt="${escapeHtml(item.alt || item.title)}" class="orderdetail__item-image" width="102" height="102" loading="lazy" />
		<div class="orderdetail__item-info">
			<div class="orderdetail__item-row">
				<h3 class="orderdetail__item-title">${title}</h3>
				<p class="orderdetail__item-qty">Qty : <span class="orderdetail__item-qty-value">${item.qty}</span></p>
				<p class="orderdetail__item-price">${formatPrice(item.price)}</p>
				<button type="button" class="orderdetail__item-remove" aria-label="Remove ${title} from order">
					<svg class="icon" aria-hidden="true"><use xlink:href="${spriteHref("close")}"></use></svg>
				</button>
			</div>
			<p class="orderdetail__item-color">Color : <span class="orderdetail__item-color-value">${escapeHtml(item.color)}</span></p>
		</div>
	</li>`;
}
function renderOrder(order) {
	const numberEl = document.querySelector("[data-orderdetail-number]");
	const placedEl = document.querySelector("[data-orderdetail-placed]");
	const totalEl = document.querySelector("[data-orderdetail-total]");
	const verifiedEl = document.querySelector("[data-orderdetail-verified]");
	const itemsEl = document.querySelector("[data-orderdetail-items]");
	if (numberEl) numberEl.textContent = order.number;
	if (placedEl) placedEl.textContent = order.date;
	if (totalEl) totalEl.textContent = formatPrice(order.total);
	if (verifiedEl) verifiedEl.textContent = order.verifiedAt;
	if (itemsEl) itemsEl.innerHTML = order.items.map(itemTemplate).join("");
	const currentIndex = Math.max(0, STEPS.indexOf(order.status));
	document.querySelectorAll("[data-orderdetail-status] .orderdetail__step").forEach((step, index) => {
		const done = index <= currentIndex;
		step.classList.toggle("orderdetail__step--done", done);
		step.classList.toggle("orderdetail__step--current", index === currentIndex);
		if (index === currentIndex) step.setAttribute("aria-current", "step");
		else step.removeAttribute("aria-current");
	});
}
function init() {
	const dataEl = document.querySelector("[data-orders-json]");
	if (!dataEl) return;
	let orders = [];
	try {
		orders = JSON.parse(dataEl.textContent);
	} catch {
		return;
	}
	if (!Array.isArray(orders) || !orders.length) return;
	const requestedNumber = new URLSearchParams(location.search).get("order");
	renderOrder(orders.find((o) => o.number === requestedNumber) || orders[0]);
}
init();
//#endregion
