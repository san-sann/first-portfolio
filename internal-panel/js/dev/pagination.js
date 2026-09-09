//#region src/components/custom/pagination/pagination.js
document.querySelectorAll("[data-fls-pagination]").forEach((pagination) => {
	const list = pagination.querySelector(".pagination__list");
	const prev = pagination.querySelector(".pagination__step--prev");
	const next = pagination.querySelector(".pagination__step--next");
	const showAll = pagination.querySelector(".pagination__show-all");
	const links = list ? [...list.querySelectorAll(".pagination__link")] : [];
	const target = pagination.dataset.flsPaginationTarget;
	const tableBodies = target ? document.querySelectorAll(`${target} tbody[data-page]`) : [];
	const setActive = (link) => {
		const current = list.querySelector(".pagination__link--active");
		if (current === link) return;
		if (current) {
			current.classList.remove("pagination__link--active");
			current.removeAttribute("aria-current");
		}
		link.classList.add("pagination__link--active");
		link.setAttribute("aria-current", "page");
		const page = link.dataset.page;
		tableBodies.forEach((tbody) => {
			tbody.hidden = tbody.dataset.page !== page;
		});
		const index = links.indexOf(link);
		const isFirst = index === 0;
		const isLast = index === links.length - 1;
		if (prev) {
			prev.classList.toggle("pagination__step--disabled", isFirst);
			prev.setAttribute("aria-disabled", String(isFirst));
			isFirst ? prev.setAttribute("tabindex", "-1") : prev.removeAttribute("tabindex");
		}
		if (next) {
			next.classList.toggle("pagination__step--disabled", isLast);
			next.setAttribute("aria-disabled", String(isLast));
			isLast ? next.setAttribute("tabindex", "-1") : next.removeAttribute("tabindex");
		}
	};
	const stepTo = (delta) => {
		const current = list.querySelector(".pagination__link--active");
		const index = links.indexOf(current) + delta;
		if (links[index]) setActive(links[index]);
	};
	pagination.addEventListener("click", (event) => {
		const link = event.target.closest(".pagination__link");
		if (link) {
			event.preventDefault();
			setActive(link);
			return;
		}
		const step = event.target.closest(".pagination__step");
		if (step && !step.classList.contains("pagination__step--disabled")) {
			event.preventDefault();
			stepTo(step === prev ? -1 : 1);
			return;
		}
		if (showAll && event.target.closest(".pagination__show-all")) {
			const isShowAll = pagination.classList.toggle("--show-all");
			showAll.setAttribute("aria-pressed", String(isShowAll));
			if (isShowAll) tableBodies.forEach((tbody) => {
				tbody.hidden = false;
			});
			else {
				const current = list ? list.querySelector(".pagination__link--active") : null;
				tableBodies.forEach((tbody) => {
					tbody.hidden = current ? tbody.dataset.page !== current.dataset.page : false;
				});
			}
		}
	});
});
//#endregion
