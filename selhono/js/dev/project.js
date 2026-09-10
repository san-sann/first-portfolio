import "./popup.min.js";
import "./contactinfo.min.js";
/* empty css              */
/* empty css                */
//#region src/components/pages/project/project.js
var galleryGrid = document.querySelector("[data-gallery-grid]");
if (galleryGrid) {
	const galleryFilter = document.querySelector("[data-gallery-filter]");
	const galleryPagination = document.querySelector("[data-gallery-pagination]");
	const galleryEmpty = document.querySelector("[data-gallery-empty]");
	const galleryStatus = document.querySelector("[data-gallery-status]");
	const galleryCards = Array.from(galleryGrid.querySelectorAll(".gallery__item"));
	const galleryPageCount = galleryPagination ? galleryPagination.querySelectorAll("[data-page]").length : 1;
	let activeCategory = galleryFilter?.querySelector(".gallery__filter-btn.--active")?.dataset.category || galleryCards[0]?.dataset.filter;
	let currentPage = 1;
	function itemsForCategory(category) {
		return galleryCards.filter((card) => card.dataset.filter === category);
	}
	function rotate(items, page) {
		if (!items.length) return items;
		const shift = Math.ceil(items.length / galleryPageCount) * (page - 1) % items.length;
		return items.slice(shift).concat(items.slice(0, shift));
	}
	function render() {
		const items = itemsForCategory(activeCategory);
		galleryCards.forEach((card) => {
			card.hidden = card.dataset.filter !== activeCategory;
		});
		if (items.length) galleryGrid.append(...rotate(items, currentPage));
		if (galleryEmpty) galleryEmpty.hidden = items.length > 0;
		galleryGrid.hidden = items.length === 0;
		if (galleryPagination) {
			galleryPagination.hidden = items.length === 0;
			galleryPagination.querySelectorAll("[data-page]").forEach((dot) => {
				const isActive = Number(dot.dataset.page) === currentPage;
				dot.classList.toggle("--active", isActive);
				if (isActive) dot.setAttribute("aria-current", "page");
				else dot.removeAttribute("aria-current");
			});
		}
		if (galleryStatus) galleryStatus.textContent = items.length ? `Showing ${items.length} ${activeCategory.replace("-", " ")} projects` : "No projects in this category yet";
	}
	if (galleryFilter) galleryFilter.addEventListener("click", (event) => {
		const button = event.target.closest("[data-category]");
		if (!button || button.classList.contains("--active")) return;
		galleryFilter.querySelectorAll(".gallery__filter-btn").forEach((btn) => {
			const isActive = btn === button;
			btn.classList.toggle("--active", isActive);
			btn.setAttribute("aria-pressed", String(isActive));
		});
		activeCategory = button.dataset.category;
		currentPage = 1;
		render();
	});
	if (galleryPagination) galleryPagination.addEventListener("click", (event) => {
		const pageBtn = event.target.closest("[data-page]");
		const nextBtn = event.target.closest("[data-next]");
		if (pageBtn) currentPage = Number(pageBtn.dataset.page);
		else if (nextBtn) currentPage = currentPage >= galleryPageCount ? 1 : currentPage + 1;
		else return;
		render();
	});
	render();
}
//#endregion
