import "./main.min.js";
import "./header.min.js";
/* empty css           */
import "./spollers.min.js";
import "./pagination.min.js";
//#region src/components/pages/quizzes/quizzes.js
document.querySelectorAll("[class$=\"__year\"]").forEach((yearGroup) => {
	const yearValue = yearGroup.querySelector("[class$=\"__year-value\"]");
	const prevBtn = yearGroup.querySelector("[class$=\"__year-btn--prev\"]");
	const nextBtn = yearGroup.querySelector("[class$=\"__year-btn--next\"]");
	const changeYear = (event, delta) => {
		event.stopPropagation();
		if (!yearValue) return;
		yearValue.textContent = parseInt(yearValue.textContent, 10) + delta;
	};
	if (prevBtn) prevBtn.addEventListener("click", (event) => changeYear(event, -1));
	if (nextBtn) nextBtn.addEventListener("click", (event) => changeYear(event, 1));
});
//#endregion
