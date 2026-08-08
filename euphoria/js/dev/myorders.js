import "./main.min.js";
import "./footer.min.js";
import "./watcher.min.js";
/* empty css               */
/* empty css           */
import "./tabs.min.js";
//#region src/components/pages/myorders/myorders.js
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
function orderTemplate(order) {
	const item = order.items[0];
	const title = escapeHtml(item.title);
	return `<li class="orders__group">
		<div class="orders__group-header">
			<p class="orders__number">Order no: #${escapeHtml(order.number)}</p>
			<dl class="orders__meta">
				<div class="orders__meta-item">
					<dt>Order Date :</dt>
					<dd>${escapeHtml(order.date)}</dd>
				</div>
				<div class="orders__meta-item orders__meta-item--end">
					<dt>Order Status :</dt>
					<dd>${escapeHtml(order.status)}</dd>
				</div>
				<div class="orders__meta-item">
					<dt>Estimated Delivery Date :</dt>
					<dd>${escapeHtml(order.estimatedDelivery)}</dd>
				</div>
				<div class="orders__meta-item orders__meta-item--end">
					<dt>Payment Method :</dt>
					<dd>${escapeHtml(order.paymentMethod)}</dd>
				</div>
			</dl>
		</div>
		<ul class="orders__items">
			<li class="orders__item">
				<img src="${item.img}" alt="${escapeHtml(item.alt || item.title)}" class="orders__item-image" width="96" height="96" loading="lazy" />
				<div class="orders__item-info">
					<h3 class="orders__item-title">${title}</h3>
					<p class="orders__item-meta">Colour : <span class="orders__item-meta-value">${escapeHtml(item.color)}</span></p>
					<p class="orders__item-meta">Qty : <span class="orders__item-meta-value">${item.qty}</span></p>
					<p class="orders__item-total">Total : ${formatPrice(order.total)}</p>
				</div>
				<a href="orderdetails.html?order=${escapeHtml(order.number)}" data-fls-button class="button orders__detail-button">View Detail</a>
			</li>
		</ul>
	</li>`;
}
function init() {
	const dataEl = document.querySelector("[data-orders-json]");
	const list = document.querySelector("[data-orders-list]");
	if (!dataEl || !list) return;
	let orders = [];
	try {
		orders = JSON.parse(dataEl.textContent);
	} catch {
		return;
	}
	if (!Array.isArray(orders)) return;
	list.innerHTML = orders.map(orderTemplate).join("");
}
init();
//#endregion
