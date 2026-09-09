import "./datepicker.min.js";
import "./main.min.js";
import "./header.min.js";
//#region src/components/pages/vacations/vacations.js
var toolbar = document.querySelector(".toolbar");
if (toolbar) {
	const yearValue = toolbar.querySelector(".toolbar__year-value");
	const prevBtn = toolbar.querySelector(".toolbar__year-btn--prev");
	const nextBtn = toolbar.querySelector(".toolbar__year-btn--next");
	const datepickerBtn = toolbar.querySelector(".toolbar__datepicker");
	const datepickerInput = toolbar.querySelector(".toolbar__datepicker-input");
	const changeYear = (delta) => {
		if (!yearValue) return;
		yearValue.textContent = parseInt(yearValue.textContent, 10) + delta;
	};
	if (prevBtn) prevBtn.addEventListener("click", () => changeYear(-1));
	if (nextBtn) nextBtn.addEventListener("click", () => changeYear(1));
	if (datepickerBtn && datepickerInput) {
		datepickerBtn.addEventListener("click", (event) => {
			event.stopPropagation();
			datepickerInput.focus();
		});
		datepickerInput.addEventListener("fls-datepicker-select", (event) => {
			if (event.detail.date) changeYear(event.detail.date.getFullYear() - parseInt(yearValue.textContent, 10));
		});
	}
}
var planned = document.querySelector(".planned");
if (planned) {
	const tbody = planned.querySelector("tbody");
	const durationTotal = planned.querySelector(".planned__duration-total");
	const workdaysTotal = planned.querySelector(".planned__workdays-total");
	const holidaysTotal = planned.querySelector(".planned__holidays-total");
	const sumColumn = (selector) => [...tbody.querySelectorAll(selector)].reduce((sum, cell) => sum + (parseInt(cell.textContent, 10) || 0), 0);
	const recalcTotals = () => {
		if (durationTotal) durationTotal.textContent = sumColumn(".planned__duration");
		if (workdaysTotal) workdaysTotal.textContent = sumColumn(".planned__workdays");
		if (holidaysTotal) holidaysTotal.textContent = sumColumn(".planned__holidays");
	};
	tbody.addEventListener("click", (event) => {
		const deleteBtn = event.target.closest(".planned__delete");
		if (!deleteBtn) return;
		deleteBtn.closest("tr").remove();
		recalcTotals();
	});
}
//#endregion
