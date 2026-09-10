//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/common/functions.js
function getHash() {
	if (location.hash) return location.hash.replace("#", "");
}
function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split("#")[0];
	history.pushState("", "", hash);
}
var slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore && target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore && target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
		}, duration);
	}
};
var slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.hidden = target.hidden ? false : null;
		showmore && target.style.removeProperty("height");
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideDownDone", { detail: { target } }));
		}, duration);
	}
};
var slideToggle = (target, duration = 500) => {
	if (target.hidden) return slideDown(target, duration);
	else return slideUp(target, duration);
};
var bodyLockToggle = (delay = 500) => {
	if (document.documentElement.hasAttribute("data-fls-scrolllock")) bodyUnlock(delay);
	else bodyLock(delay);
};
var bodyUnlock = (delay = 500) => {
	if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach((lockPaddingElement) => {
				lockPaddingElement.style.paddingRight = "";
			});
			document.body.style.paddingRight = "";
			document.documentElement.removeAttribute("data-fls-scrolllock");
		}, delay);
		setTimeout(function() {}, delay);
	}
};
var bodyLock = (delay = 500) => {
	if (!document.documentElement.hasAttribute("data-fls-scrolllock")) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
		lockPaddingElements.forEach((lockPaddingElement) => {
			lockPaddingElement.style.paddingRight = lockPaddingValue;
		});
		document.body.style.paddingRight = lockPaddingValue;
		document.documentElement.setAttribute("data-fls-scrolllock", "");
		setTimeout(function() {}, delay);
	}
};
function getDigFormat(item, sepp = " ") {
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
}
function uniqArray(array) {
	return array.filter((item, index, self) => self.indexOf(item) === index);
}
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
		const [value, type = "max"] = item.dataset[dataSetValue].split(",");
		return {
			value,
			type,
			item
		};
	});
	if (media.length === 0) return [];
	const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
	return [...new Set(breakpointsArray)].map((query) => {
		const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
		const matchMedia = window.matchMedia(mediaQuery);
		return {
			itemsArray: media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType),
			matchMedia
		};
	});
}
var gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = "";
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = "header.header";
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains("--header-scroll")) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add("--header-scroll");
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove("--header-scroll");
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else headerItemHeight = headerElement.offsetHeight;
		}
		if (document.documentElement.hasAttribute("data-fls-menu-open")) {
			bodyUnlock();
			document.documentElement.removeAttribute("data-fls-menu-open");
		}
		let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
		targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
		targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
		window.scrollTo({
			top: targetBlockElementPosition,
			behavior: "smooth"
		});
	}
};
//#endregion
//#region src/components/layout/menu/menu.js
function menuInit() {
	const menu = document.querySelector(".menu");
	if (!menu) return;
	const burger = menu.querySelector("[data-fls-menu]");
	const menuBody = menu.querySelector(".menu__body");
	const mobileMQL = window.matchMedia("(max-width: 768px)");
	function syncMenuBodyInert() {
		if (!menuBody) return;
		const isOpen = document.documentElement.hasAttribute("data-fls-menu-open");
		menuBody.toggleAttribute("inert", mobileMQL.matches && !isOpen);
	}
	syncMenuBodyInert();
	mobileMQL.addEventListener("change", syncMenuBodyInert);
	function closeMobileMenu() {
		if (!document.documentElement.hasAttribute("data-fls-menu-open")) return;
		bodyLockToggle();
		document.documentElement.removeAttribute("data-fls-menu-open");
		syncMenuBodyInert();
	}
	document.addEventListener("click", function(e) {
		if (e.target.closest("[data-fls-menu]") || e.target.closest("[data-fls-menu-close]")) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
			syncMenuBodyInert();
		}
	});
	if (burger) new MutationObserver(function() {
		const isOpen = document.documentElement.hasAttribute("data-fls-menu-open");
		burger.setAttribute("aria-expanded", isOpen);
		burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
	}).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-fls-menu-open"]
	});
	function closeSubmenu(item) {
		item.classList.remove("--active");
		item.querySelector(":scope > .menu__link")?.setAttribute("aria-expanded", "false");
	}
	function openSubmenu(item) {
		menu.querySelectorAll(".menu__item_sub.--active").forEach(function(openItem) {
			if (openItem !== item) closeSubmenu(openItem);
		});
		item.classList.add("--active");
		item.querySelector(":scope > .menu__link")?.setAttribute("aria-expanded", "true");
	}
	menu.addEventListener("click", function(e) {
		const toggle = e.target.closest(".menu__item_sub > .menu__link");
		if (toggle) {
			const item = toggle.closest(".menu__item_sub");
			item.classList.contains("--active") ? closeSubmenu(item) : openSubmenu(item);
			return;
		}
		if (!e.target.closest(".menu__item_sub")) menu.querySelectorAll(".menu__item_sub.--active").forEach(closeSubmenu);
	});
	document.addEventListener("click", function(e) {
		if (!e.target.closest(".menu")) menu.querySelectorAll(".menu__item_sub.--active").forEach(closeSubmenu);
	});
	menu.addEventListener("focusout", function(e) {
		const item = e.target.closest(".menu__item_sub");
		if (!item) return;
		requestAnimationFrame(function() {
			if (!item.contains(document.activeElement)) closeSubmenu(item);
		});
	});
	document.addEventListener("keydown", function(e) {
		if (e.key !== "Escape") return;
		const openItem = menu.querySelector(".menu__item_sub.--active");
		if (openItem) {
			closeSubmenu(openItem);
			openItem.querySelector(":scope > .menu__link")?.focus();
			return;
		}
		if (document.documentElement.hasAttribute("data-fls-menu-open")) {
			closeMobileMenu();
			burger?.focus();
		}
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
export { getHash as a, slideDown as c, uniqArray as d, getDigFormat as i, slideToggle as l, bodyUnlock as n, gotoBlock as o, dataMediaQueries as r, setHash as s, bodyLock as t, slideUp as u };
