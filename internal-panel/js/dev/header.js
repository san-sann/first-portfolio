import { n as bodyLockToggle, r as bodyUnlock, t as bodyLockStatus } from "./main.min.js";
//#region src/components/layout/menu/menu.js
function menuInit() {
	document.addEventListener("click", function(e) {
		if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
		}
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape" && document.documentElement.hasAttribute("data-fls-menu-open")) {
			bodyUnlock();
			document.documentElement.removeAttribute("data-fls-menu-open");
		}
	});
	const syncBurgerAria = () => {
		const isOpen = document.documentElement.hasAttribute("data-fls-menu-open");
		document.querySelectorAll("[data-fls-menu]").forEach((burger) => {
			burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
			burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
		});
	};
	new MutationObserver(syncBurgerAria).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-fls-menu-open"]
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
//#region src/components/layout/header/header.js
function initAccountMenu() {
	const toggle = document.querySelector("[data-fls-account-toggle]");
	const menu = document.querySelector("[data-fls-account-menu]");
	if (!toggle || !menu) return;
	const wrapper = toggle.closest(".header__account");
	function closeMenu() {
		wrapper.classList.remove("--account-menu-active");
		toggle.setAttribute("aria-expanded", "false");
	}
	function openMenu() {
		wrapper.classList.add("--account-menu-active");
		toggle.setAttribute("aria-expanded", "true");
	}
	toggle.addEventListener("click", function() {
		wrapper.classList.contains("--account-menu-active") ? closeMenu() : openMenu();
	});
	document.addEventListener("click", function(e) {
		if (wrapper.classList.contains("--account-menu-active") && !e.target.closest(".header__account")) closeMenu();
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape" && wrapper.classList.contains("--account-menu-active")) {
			closeMenu();
			toggle.focus();
		}
	});
}
document.querySelector("[data-fls-account-toggle]") && window.addEventListener("load", initAccountMenu);
//#endregion
