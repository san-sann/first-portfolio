import "./datepicker.min.js";
import "./main.min.js";
import "./header.min.js";
import "./select.min.js";
//#region src/components/pages/calendar/calendar.js
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
//#endregion
