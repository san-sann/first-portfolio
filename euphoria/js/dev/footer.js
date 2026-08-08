import { S as slideUp, _ as dataMediaQueries, h as bodyLockToggle, m as bodyLockStatus, x as slideToggle } from "./main.min.js";
//#region src/components/layout/spollers/spollers.js
function spollers() {
	const spollersArray = document.querySelectorAll("[data-fls-spollers]");
	if (spollersArray.length > 0) {
		document.addEventListener("click", setSpollerAction);
		const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
			return !item.dataset.flsSpollers.split(",")[0];
		});
		if (spollersRegular.length) initSpollers(spollersRegular);
		let mdQueriesArray = dataMediaQueries(spollersArray, "flsSpollers");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem) => {
			mdQueriesItem.matchMedia.addEventListener("change", function() {
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach((spollersBlock) => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add("--spoller-init");
					initSpollerBody(spollersBlock);
				} else {
					spollersBlock.classList.remove("--spoller-init");
					initSpollerBody(spollersBlock, false);
				}
			});
		}
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerItems = spollersBlock.querySelectorAll("details");
			if (spollerItems.length) {
				spollerItems = Array.from(spollerItems).filter((item) => item.closest("[data-fls-spollers]") === spollersBlock);
				spollerItems.forEach((spollerItem) => {
					let spollerTitle = spollerItem.querySelector("summary");
					if (hideSpollerBody) {
						spollerTitle.removeAttribute("tabindex");
						if (!spollerItem.hasAttribute("data-fls-spollers-open")) {
							spollerItem.open = false;
							spollerTitle.nextElementSibling.hidden = true;
						} else {
							spollerTitle.classList.add("--spoller-active");
							spollerItem.open = true;
						}
					} else {
						spollerTitle.setAttribute("tabindex", "-1");
						spollerTitle.classList.remove("--spoller-active");
						spollerItem.open = true;
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest("summary") && el.closest("[data-fls-spollers]")) {
				e.preventDefault();
				if (el.closest("[data-fls-spollers]").classList.contains("--spoller-init")) {
					const spollerTitle = el.closest("summary");
					const spollerBlock = spollerTitle.closest("details");
					const spollersBlock = spollerTitle.closest("[data-fls-spollers]");
					const oneSpoller = spollersBlock.hasAttribute("data-fls-spollers-one");
					const scrollSpoller = spollerBlock.hasAttribute("data-fls-spollers-scroll");
					const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
					if (!spollersBlock.querySelectorAll(".--slide").length) {
						if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
						!spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
							spollerBlock.open = false;
						}, spollerSpeed);
						spollerTitle.classList.toggle("--spoller-active");
						slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
						if (scrollSpoller && spollerTitle.classList.contains("--spoller-active")) {
							const scrollSpollerValue = spollerBlock.dataset.flsSpollersScroll;
							const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
							const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-fls-spollers-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
							window.scrollTo({
								top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
								behavior: "smooth"
							});
						}
					}
				}
			}
			if (!el.closest("[data-fls-spollers]")) {
				const spollersClose = document.querySelectorAll("[data-fls-spollers-close]");
				if (spollersClose.length) spollersClose.forEach((spollerClose) => {
					const spollersBlock = spollerClose.closest("[data-fls-spollers]");
					const spollerCloseBlock = spollerClose.parentNode;
					if (spollersBlock.classList.contains("--spoller-init")) {
						const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
						spollerClose.classList.remove("--spoller-active");
						slideUp(spollerClose.nextElementSibling, spollerSpeed);
						setTimeout(() => {
							spollerCloseBlock.open = false;
						}, spollerSpeed);
					}
				});
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveBlock = Array.from(spollersBlock.querySelectorAll("details[open]")).find((item) => item.closest("[data-fls-spollers]") === spollersBlock);
			if (spollerActiveBlock && !spollersBlock.querySelectorAll(".--slide").length) {
				const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
				const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
				spollerActiveTitle.classList.remove("--spoller-active");
				slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
				setTimeout(() => {
					spollerActiveBlock.open = false;
				}, spollerSpeed);
			}
		}
	}
}
window.addEventListener("load", spollers);
//#endregion
//#region src/components/layout/menu/menu.js
function menuInit() {
	document.addEventListener("click", function(e) {
		if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
			bodyLockToggle(500);
			const isOpen = document.documentElement.toggleAttribute("data-fls-menu-open");
			e.target.closest("[data-fls-menu]").setAttribute("aria-expanded", String(isOpen));
		}
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
//#region src/components/layout/header/plugins/scroll/scroll.js
function headerScroll() {
	const header = document.querySelector("[data-fls-header-scroll]");
	const headerShow = header.hasAttribute("data-fls-header-scroll-show");
	const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
	const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
	let scrollDirection = 0;
	let timer;
	document.addEventListener("scroll", function(e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		if (scrollTop >= startPoint) {
			!header.classList.contains("--header-scroll") && header.classList.add("--header-scroll");
			if (headerShow) {
				if (scrollTop > scrollDirection) header.classList.contains("--header-show") && header.classList.remove("--header-show");
				else !header.classList.contains("--header-show") && header.classList.add("--header-show");
				timer = setTimeout(() => {
					!header.classList.contains("--header-show") && header.classList.add("--header-show");
				}, headerShowTimer);
			}
		} else {
			header.classList.contains("--header-scroll") && header.classList.remove("--header-scroll");
			if (headerShow) header.classList.contains("--header-show") && header.classList.remove("--header-show");
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
document.querySelector("[data-fls-header-scroll]") && window.addEventListener("load", headerScroll);
//#endregion
