import { C as spriteHref, d as removeFromCart, f as updateQty, l as getCart } from "./main.min.js";
import "./footer.min.js";
import "./button2.min.js";
//#region src/components/forms/quantity/quantity.js
function formQuantity() {
	document.addEventListener("click", quantityActions);
	document.addEventListener("input", quantityActions);
	function quantityActions(e) {
		const type = e.type;
		const targetElement = e.target;
		if (type === "click") {
			if (targetElement.closest("[data-fls-quantity-plus]") || targetElement.closest("[data-fls-quantity-minus]")) {
				const valueElement = targetElement.closest("[data-fls-quantity]").querySelector("[data-fls-quantity-value]");
				let value = parseInt(valueElement.value);
				if (targetElement.hasAttribute("data-fls-quantity-plus")) {
					value++;
					if (+valueElement.dataset.flsQuantityMax && +valueElement.dataset.flsQuantityMax < value) value = valueElement.dataset.flsQuantityMax;
				} else {
					--value;
					if (+valueElement.dataset.flsQuantityMin) {
						if (+valueElement.dataset.flsQuantityMin > value) value = valueElement.dataset.flsQuantityMin;
					} else if (value < 1) value = 1;
				}
				targetElement.closest("[data-fls-quantity]").querySelector("[data-fls-quantity-value]").value = value;
			}
		} else if (type === "input") {
			if (targetElement.closest("[data-fls-quantity-value]")) {
				const valueElement = targetElement.closest("[data-fls-quantity-value]");
				(valueElement.value == 0 || /[^0-9]/gi.test(valueElement.value)) && (valueElement.value = 1);
			}
		}
	}
}
document.querySelector("[data-fls-quantity]") && window.addEventListener("load", formQuantity);
//#endregion
//#region src/components/pages/cart/cart.js
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
function rowKey(item) {
	return [
		item.id,
		item.size,
		item.color
	].filter(Boolean).join("-").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}
function rowTemplate(item) {
	const title = escapeHtml(item.title);
	const metaColor = item.color ? `<p class="products__meta">Color : ${escapeHtml(item.color)}</p>` : "";
	const metaSize = item.size ? `<p class="products__meta">Size : ${escapeHtml(item.size)}</p>` : "";
	return `<tr class="products__row" data-product-id="${escapeHtml(item.id)}" data-size="${escapeHtml(item.size || "")}" data-color="${escapeHtml(item.color || "")}" data-price="${item.price}" data-shipping="${item.shipping || 0}">
		<td class="products__cell-details">
			<div class="products__product">
				<a href="#" class="products__image-link">
					<img src="${item.image}" alt="${escapeHtml(item.alt || item.title)}" class="products__image" loading="lazy" width="105" height="120">
				</a>
				<div class="products__details">
					<h3 class="products__title"><a href="#" class="products__title-link">${title}</a></h3>
					${metaColor}
					${metaSize}
				</div>
			</div>
		</td>
		<td class="products__price">${formatPrice(item.price)}</td>
		<td class="products__cell-quantity">
			<div data-fls-quantity class="quantity products__quantity">
				<button data-fls-quantity-minus type="button" class="quantity__button quantity__button--minus" aria-label="Decrease quantity of ${title}"></button>
				<div class="quantity__input">
					<input data-fls-quantity-value autocomplete="off" type="text" inputmode="numeric" name="quantity-${rowKey(item)}" value="${item.qty}" aria-label="Quantity of ${title}">
				</div>
				<button data-fls-quantity-plus type="button" class="quantity__button quantity__button--plus" aria-label="Increase quantity of ${title}"></button>
			</div>
		</td>
		<td class="products__shipping">${item.shipping ? formatPrice(item.shipping) : "FREE"}</td>
		<td class="products__subtotal">${formatPrice(item.price * item.qty)}</td>
		<td class="products__cell-action">
			<button type="button" class="products__remove" aria-label="Remove ${title} from cart">
				<svg class="icon" aria-hidden="true"><use xlink:href="${spriteHref("trash")}"></use></svg>
			</button>
		</td>
	</tr>`;
}
function announce(message) {
	const status = document.querySelector("[data-cart-status]");
	if (status) status.textContent = message;
}
function recomputeTotals() {
	const rows = document.querySelectorAll(".products__row");
	let subtotal = 0;
	let shipping = 0;
	rows.forEach((row) => {
		const price = parseFloat(row.dataset.price) || 0;
		const rowShipping = parseFloat(row.dataset.shipping) || 0;
		const quantityInput = row.querySelector("[data-fls-quantity-value]");
		const rowSubtotal = price * (quantityInput ? parseInt(quantityInput.value, 10) || 1 : 1);
		subtotal += rowSubtotal;
		shipping += rowShipping;
		const subtotalCell = row.querySelector(".products__subtotal");
		if (subtotalCell) subtotalCell.textContent = formatPrice(rowSubtotal);
	});
	const grandTotal = subtotal + shipping;
	const subtotalValue = document.querySelector("[data-discount-subtotal]");
	const shippingValue = document.querySelector("[data-discount-shipping]");
	const grandTotalValue = document.querySelector("[data-discount-grand-total]");
	if (subtotalValue) subtotalValue.textContent = formatPrice(subtotal);
	if (shippingValue) shippingValue.textContent = formatPrice(shipping);
	if (grandTotalValue) grandTotalValue.textContent = formatPrice(grandTotal);
}
function renderCart() {
	const items = getCart();
	if (!items.length) {
		window.location.replace("emptycart.html");
		return;
	}
	const tbody = document.querySelector("[data-cart-rows]");
	if (tbody) tbody.innerHTML = items.map(rowTemplate).join("");
	recomputeTotals();
}
function handleRemove(row) {
	const title = row.querySelector(".products__title-link")?.textContent?.trim() || "Item";
	const nextRow = row.nextElementSibling;
	const prevRow = row.previousElementSibling;
	removeFromCart(row.dataset.productId, row.dataset.size, row.dataset.color);
	row.remove();
	announce(`${title} removed from cart.`);
	if (!document.querySelector(".products__row")) {
		window.location.replace("emptycart.html");
		return;
	}
	(nextRow?.querySelector(".products__remove") || prevRow?.querySelector(".products__remove"))?.focus();
	recomputeTotals();
}
function scheduleQtyPersist(row) {
	setTimeout(() => {
		const input = row.querySelector("[data-fls-quantity-value]");
		if (!input) return;
		const qty = parseInt(input.value, 10) || 1;
		updateQty(row.dataset.productId, row.dataset.size, row.dataset.color, qty);
		recomputeTotals();
	}, 0);
}
document.addEventListener("click", (e) => {
	const removeBtn = e.target.closest(".products__remove");
	if (removeBtn) {
		const row = removeBtn.closest(".products__row");
		if (row) handleRemove(row);
		return;
	}
	const qtyRow = e.target.closest("[data-fls-quantity-plus], [data-fls-quantity-minus]")?.closest(".products__row");
	if (qtyRow) scheduleQtyPersist(qtyRow);
});
document.addEventListener("input", (e) => {
	const row = e.target.closest("[data-fls-quantity-value]")?.closest(".products__row");
	if (row) scheduleQtyPersist(row);
});
renderCart();
//#endregion
