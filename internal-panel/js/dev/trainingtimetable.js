import "./datepicker.min.js";
import "./main.min.js";
import "./header.min.js";
import "./select.min.js";
/* empty css           */
//#region src/components/pages/trainingtimetable/trainingtimetable.js
var filter = document.querySelector(".filter");
if (filter) {
	const dateValue = filter.querySelector(".filter__date-value");
	const prevBtn = filter.querySelector(".filter__date-btn--prev");
	const nextBtn = filter.querySelector(".filter__date-btn--next");
	const datepickerBtn = filter.querySelector(".filter__datepicker");
	const datepickerInput = filter.querySelector(".filter__datepicker-input");
	const MONTHS = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	const setDate = (monthIndex, year) => {
		if (!dateValue) return;
		const normalizedYear = year + Math.floor(monthIndex / 12);
		const normalizedMonth = (monthIndex % 12 + 12) % 12;
		dateValue.textContent = `${MONTHS[normalizedMonth]} ${normalizedYear}`;
	};
	const changeMonth = (delta) => {
		if (!dateValue) return;
		const [monthName, year] = dateValue.textContent.split(" ");
		setDate(MONTHS.indexOf(monthName) + delta, parseInt(year, 10));
	};
	if (prevBtn) prevBtn.addEventListener("click", () => changeMonth(-1));
	if (nextBtn) nextBtn.addEventListener("click", () => changeMonth(1));
	if (datepickerBtn && datepickerInput) {
		datepickerBtn.addEventListener("click", (event) => {
			event.stopPropagation();
			datepickerInput.focus();
		});
		datepickerInput.addEventListener("fls-datepicker-select", (event) => {
			if (event.detail.date) setDate(event.detail.date.getMonth(), event.detail.date.getFullYear());
		});
	}
}
//#endregion
