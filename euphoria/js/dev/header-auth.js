//#region src/components/layout/header-auth/header-auth.js
var searchToggle = document.querySelector("[data-header-auth-search-toggle]");
var searchPanel = document.getElementById("header-auth-search-panel");
if (searchToggle && searchPanel) {
	const desktopQuery = window.matchMedia("(min-width: 992px)");
	const closeSearch = () => {
		searchPanel.hidden = true;
		searchToggle.setAttribute("aria-expanded", "false");
	};
	const openSearch = () => {
		searchPanel.hidden = false;
		searchToggle.setAttribute("aria-expanded", "true");
		searchPanel.querySelector("input").focus();
	};
	const syncToBreakpoint = () => {
		if (desktopQuery.matches) {
			searchPanel.hidden = false;
			searchToggle.setAttribute("aria-expanded", "true");
		} else closeSearch();
	};
	syncToBreakpoint();
	desktopQuery.addEventListener("change", syncToBreakpoint);
	searchToggle.addEventListener("click", () => {
		if (desktopQuery.matches) return;
		searchPanel.hidden ? openSearch() : closeSearch();
	});
	document.addEventListener("click", (e) => {
		if (desktopQuery.matches || searchPanel.hidden) return;
		if (searchPanel.contains(e.target) || searchToggle.contains(e.target)) return;
		closeSearch();
	});
	document.addEventListener("keydown", (e) => {
		if (desktopQuery.matches) return;
		if (e.key === "Escape" && !searchPanel.hidden) {
			closeSearch();
			searchToggle.focus();
		}
	});
}
//#endregion
