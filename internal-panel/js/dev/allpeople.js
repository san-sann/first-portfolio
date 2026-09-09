import "./main.min.js";
import "./header.min.js";
/* empty css           */
import "./pagination.min.js";
/* empty css           */
/* empty css             */
//#region src/components/pages/allpeople/allpeople.js
var filterClear = document.querySelector(".results__clear");
var filterForm = document.querySelector(".results__filter-form");
if (filterClear && filterForm) filterClear.addEventListener("click", () => {
	filterForm.querySelectorAll(".checkbox__input").forEach((input) => {
		input.checked = false;
	});
});
//#endregion
