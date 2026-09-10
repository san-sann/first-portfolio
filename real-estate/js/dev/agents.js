import "./main.min.js";
/* empty css           */
/* empty css                 */
import "./watcher.min.js";
/* empty css              */
/* empty css              */
//#region src/components/pages/agents/agents.js
var listing = document.querySelector(".listing");
if (listing) {
	const pages = listing.querySelectorAll(".listing__grid[data-listing-page]");
	const pageButtons = listing.querySelectorAll(".pagination__item[data-page]");
	const prevBtn = listing.querySelector(".pagination__arrow--prev");
	const nextBtn = listing.querySelector(".pagination__arrow--next");
	const totalPages = pages.length;
	let currentPage = 1;
	function showPage(page) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		pages.forEach((el) => {
			el.hidden = Number(el.dataset.listingPage) !== currentPage;
		});
		pageButtons.forEach((btn) => {
			const isActive = Number(btn.dataset.page) === currentPage;
			btn.classList.toggle("pagination__item--active", isActive);
			if (isActive) btn.setAttribute("aria-current", "page");
			else btn.removeAttribute("aria-current");
		});
		if (prevBtn) prevBtn.disabled = currentPage === 1;
		if (nextBtn) nextBtn.disabled = currentPage === totalPages;
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		listing.scrollIntoView({
			behavior: reduceMotion ? "auto" : "smooth",
			block: "start"
		});
	}
	pageButtons.forEach((btn) => {
		btn.addEventListener("click", () => showPage(Number(btn.dataset.page)));
	});
	if (prevBtn) prevBtn.addEventListener("click", () => showPage(currentPage - 1));
	if (nextBtn) nextBtn.addEventListener("click", () => showPage(currentPage + 1));
}
//#endregion
