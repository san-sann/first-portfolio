import { C as spriteHref, c as clearCart, l as getCart, u as onCartChange } from "./main.min.js";
import "./footer.min.js";
import "./select.min.js";
import "./button2.min.js";
//#region src/components/pages/checkout/checkout.js
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
function summaryItemTemplate(item) {
	const title = escapeHtml(item.title);
	const meta = item.color ? `<p class="billing__summary-item-meta">Color : ${escapeHtml(item.color)}</p>` : "";
	return `<li class="billing__summary-item">
		<img src="${item.image}" alt="${escapeHtml(item.alt || item.title)}" class="billing__summary-item-image" loading="lazy" width="63" height="63">
		<div class="billing__summary-item-body">
			<div class="billing__summary-item-row">
				<p class="billing__summary-item-title">${title} <span class="billing__summary-item-qty">x ${item.qty}</span></p>
				<span class="billing__summary-item-price">${formatPrice(item.price)}</span>
			</div>
			${meta}
		</div>
	</li>`;
}
function renderSummary() {
	const items = getCart();
	const list = document.querySelector("[data-billing-summary-list]");
	if (list) list.innerHTML = items.map(summaryItemTemplate).join("");
	const count = items.reduce((sum, item) => sum + item.qty, 0);
	const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
	const shipping = items.reduce((sum, item) => sum + (item.shipping || 0), 0);
	const total = subtotal + shipping;
	const countEl = document.querySelector("[data-billing-count]");
	const subtotalEl = document.querySelector("[data-billing-subtotal]");
	const shippingEl = document.querySelector("[data-billing-shipping]");
	const totalEl = document.querySelector("[data-billing-total]");
	if (countEl) countEl.textContent = count;
	if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
	if (shippingEl) shippingEl.textContent = shipping ? formatPrice(shipping) : "FREE";
	if (totalEl) totalEl.textContent = formatPrice(total);
}
renderSummary();
onCartChange(renderSummary);
document.addEventListener("click", (event) => {
	const toggle = event.target.closest("[data-payment-code-toggle]");
	if (!toggle) return;
	const input = document.getElementById(toggle.getAttribute("aria-controls"));
	if (!input) return;
	const isHidden = input.type === "password";
	input.type = isHidden ? "text" : "password";
	toggle.setAttribute("aria-pressed", String(isHidden));
	toggle.setAttribute("aria-label", isHidden ? "Hide security code" : "Show security code");
	const use = toggle.querySelector("use");
	if (use) use.setAttribute("xlink:href", spriteHref(isHidden ? "eye-hide" : "eye"));
});
document.addEventListener("formSent", (event) => {
	if (!event.detail.form.classList.contains("payment__form")) return;
	clearCart();
	location.href = "confirmedorder.html";
});
//#endregion
