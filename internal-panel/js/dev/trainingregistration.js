import "./main.min.js";
import "./header.min.js";
import "./select.min.js";
/* empty css           */
import "./spollers.min.js";
import "./pagination.min.js";
//#region src/components/pages/trainingregistration/trainingregistration.js
var yearGroup = document.querySelector(".available__year");
if (yearGroup) {
	const yearValue = yearGroup.querySelector(".available__year-value");
	const prevBtn = yearGroup.querySelector(".available__year-btn--prev");
	const nextBtn = yearGroup.querySelector(".available__year-btn--next");
	const changeYear = (event, delta) => {
		event.stopPropagation();
		if (!yearValue) return;
		yearValue.textContent = parseInt(yearValue.textContent, 10) + delta;
	};
	if (prevBtn) prevBtn.addEventListener("click", (event) => changeYear(event, -1));
	if (nextBtn) nextBtn.addEventListener("click", (event) => changeYear(event, 1));
}
//#endregion
