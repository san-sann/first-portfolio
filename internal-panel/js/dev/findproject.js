import "./datepicker.min.js";
import "./main.min.js";
import "./header.min.js";
import "./select.min.js";
/* empty css           */
/* empty css           */
/* empty css          */
//#region src/components/pages/findproject/findproject.js
var filterClear = document.querySelector(".filter__clear");
var filterForm = document.querySelector(".filter__form");
if (filterClear && filterForm) filterClear.addEventListener("click", () => {
	filterForm.reset();
	const statusSelect = filterForm.querySelector("select[name=\"status[]\"]");
	if (statusSelect) Array.from(statusSelect.options).forEach((option) => {
		option.selected = option.value === "in-progress";
	});
	if (window.flsSelect) filterForm.querySelectorAll("select[data-fls-select]").forEach((select) => {
		window.flsSelect.selectBuild(select);
	});
});
//#endregion
