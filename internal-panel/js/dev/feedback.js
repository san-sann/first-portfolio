import "./main.min.js";
import "./header.min.js";
/* empty css           */
import "./spollers.min.js";
//#region src/components/pages/feedback/feedback.js
var yearGroup = document.querySelector(".results__year");
if (yearGroup) {
	const yearValue = yearGroup.querySelector(".results__year-value");
	const prevBtn = yearGroup.querySelector(".results__year-btn--prev");
	const nextBtn = yearGroup.querySelector(".results__year-btn--next");
	const changeYear = (event, delta) => {
		event.stopPropagation();
		if (!yearValue) return;
		yearValue.textContent = parseInt(yearValue.textContent, 10) + delta;
	};
	if (prevBtn) prevBtn.addEventListener("click", (event) => changeYear(event, -1));
	if (nextBtn) nextBtn.addEventListener("click", (event) => changeYear(event, 1));
}
//#endregion
