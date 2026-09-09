import "./datepicker.min.js";
import "./main.min.js";
import "./header.min.js";
import "./select.min.js";
/* empty css           */
/* empty css          */
//#region src/components/pages/reports/reports.js
var filterClear = document.querySelector(".filter__clear");
var filterForm = document.querySelector(".filter__form");
if (filterClear && filterForm) filterClear.addEventListener("click", () => {
	filterForm.reset();
	if (window.flsSelect) filterForm.querySelectorAll("select[data-fls-select]").forEach((select) => {
		window.flsSelect.selectBuild(select);
	});
});
//#endregion
