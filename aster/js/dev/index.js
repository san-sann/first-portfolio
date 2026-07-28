import "./main.min.js";
import { c as slideDown, i as dataMediaQueries, u as slideUp } from "./common.min.js";
import { i as Swiper, n as Navigation, r as Keyboard, t as A11y } from "./newscard.min.js";
//#region src/components/pages/index/index.js
function closeTopStoriesMore() {
	const more = document.querySelector(".top-stories__filter-more.--open");
	if (!more) return;
	more.classList.remove("--open");
	more.querySelector("[data-fls-topstories-more]").setAttribute("aria-expanded", "false");
	more.querySelector(".top-stories__filter-dropdown").hidden = true;
}
function toggleTopStoriesMore(trigger) {
	const more = trigger.closest(".top-stories__filter-more");
	const wasOpen = more.classList.contains("--open");
	closeTopStoriesMore();
	if (!wasOpen) {
		more.classList.add("--open");
		trigger.setAttribute("aria-expanded", "true");
		more.querySelector(".top-stories__filter-dropdown").hidden = false;
	}
}
function selectTopStoriesFilter(button) {
	const list = button.closest(".top-stories__filters");
	if (!list) return;
	list.querySelectorAll(".top-stories__filter").forEach(function(filter) {
		const active = filter === button;
		filter.classList.toggle("--active", active);
		filter.setAttribute("aria-pressed", String(active));
	});
	closeTopStoriesMore();
}
function topStoriesInit() {
	document.addEventListener("click", function(e) {
		const moreTrigger = e.target.closest("[data-fls-topstories-more]");
		if (moreTrigger) toggleTopStoriesMore(moreTrigger);
		else if (!e.target.closest(".top-stories__filter-more")) closeTopStoriesMore();
		const filter = e.target.closest(".top-stories__filter");
		if (filter) selectTopStoriesFilter(filter);
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape") closeTopStoriesMore();
	});
}
document.querySelector(".top-stories") && window.addEventListener("load", topStoriesInit);
//#endregion
//#region src/components/layout/showmore/showmore.js
function showMore() {
	const showMoreBlocks = document.querySelectorAll("[data-fls-showmore]");
	let showMoreBlocksRegular;
	let mdQueriesArray;
	if (showMoreBlocks.length) {
		showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function(item, index, self) {
			return !item.dataset.flsShowmoreMedia;
		});
		showMoreBlocksRegular.length && initItems(showMoreBlocksRegular);
		document.addEventListener("click", showMoreActions);
		window.addEventListener("resize", showMoreActions);
		mdQueriesArray = dataMediaQueries(showMoreBlocks, "flsShowmoreMedia");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				mdQueriesItem.matchMedia.addEventListener("change", function() {
					initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
			});
			initItemsMedia(mdQueriesArray);
		}
	}
	function initItemsMedia(mdQueriesArray) {
		mdQueriesArray.forEach((mdQueriesItem) => {
			initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
	}
	function initItems(showMoreBlocks, matchMedia) {
		showMoreBlocks.forEach((showMoreBlock) => {
			initItem(showMoreBlock, matchMedia);
		});
	}
	function initItem(showMoreBlock, matchMedia = false) {
		showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
		let showMoreContent = showMoreBlock.querySelectorAll("[data-fls-showmore-content]");
		let showMoreButton = showMoreBlock.querySelectorAll("[data-fls-showmore-button]");
		showMoreContent = Array.from(showMoreContent).filter((item) => item.closest("[data-fls-showmore]") === showMoreBlock)[0];
		showMoreButton = Array.from(showMoreButton).filter((item) => item.closest("[data-fls-showmore]") === showMoreBlock)[0];
		const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
		if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
			slideUp(showMoreContent, 0, showMoreBlock.classList.contains("--showmore-active") ? getOriginalHeight(showMoreContent) : hiddenHeight);
			showMoreButton.hidden = false;
		} else {
			slideDown(showMoreContent, 0, hiddenHeight);
			showMoreButton.hidden = true;
		}
		else {
			slideDown(showMoreContent, 0, hiddenHeight);
			showMoreButton.hidden = true;
		}
		syncItemsInert(showMoreBlock, showMoreContent);
	}
	function syncItemsInert(showMoreBlock, showMoreContent) {
		if (showMoreBlock.dataset.flsShowmore !== "items") return;
		const showMoreTypeValue = showMoreContent.dataset.flsShowmoreContent ? +showMoreContent.dataset.flsShowmoreContent : 3;
		const active = showMoreBlock.classList.contains("--showmore-active");
		Array.from(showMoreContent.children).forEach((item, index) => {
			item.inert = index >= showMoreTypeValue && !active;
		});
	}
	function getHeight(showMoreBlock, showMoreContent) {
		let hiddenHeight = 0;
		if ((showMoreBlock.dataset.flsShowmore ? showMoreBlock.dataset.flsShowmore : "size") === "items") {
			const showMoreTypeValue = showMoreContent.dataset.flsShowmoreContent ? +showMoreContent.dataset.flsShowmoreContent : 3;
			const showMoreItems = Array.from(showMoreContent.children).slice(0, showMoreTypeValue);
			const contentTop = showMoreContent.getBoundingClientRect().top;
			showMoreItems.forEach((showMoreItem) => {
				const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
				const itemBottom = showMoreItem.getBoundingClientRect().bottom - contentTop + marginBottom;
				hiddenHeight = Math.max(hiddenHeight, itemBottom);
			});
		} else hiddenHeight = showMoreContent.dataset.flsShowmoreContent ? showMoreContent.dataset.flsShowmoreContent : 150;
		return hiddenHeight;
	}
	function getOriginalHeight(showMoreContent) {
		let parentHidden;
		let hiddenHeight = showMoreContent.offsetHeight;
		showMoreContent.style.removeProperty("height");
		if (showMoreContent.closest(`[hidden]`)) {
			parentHidden = showMoreContent.closest(`[hidden]`);
			parentHidden.hidden = false;
		}
		let originalHeight = showMoreContent.offsetHeight;
		parentHidden && (parentHidden.hidden = true);
		showMoreContent.style.height = `${hiddenHeight}px`;
		return originalHeight;
	}
	function showMoreActions(e) {
		const targetEvent = e.target;
		const targetType = e.type;
		if (targetType === "click") {
			if (targetEvent.closest("[data-fls-showmore-button]")) {
				const showMoreBlock = targetEvent.closest("[data-fls-showmore-button]").closest("[data-fls-showmore]");
				const showMoreContent = showMoreBlock.querySelector("[data-fls-showmore-content]");
				const showMoreSpeed = showMoreBlock.dataset.flsShowmoreButton ? showMoreBlock.dataset.flsShowmoreButton : "500";
				const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
				if (!showMoreContent.classList.contains("--slide")) {
					showMoreBlock.classList.contains("--showmore-active") ? slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
					showMoreBlock.classList.toggle("--showmore-active");
					syncItemsInert(showMoreBlock, showMoreContent);
				}
			}
		} else if (targetType === "resize") {
			showMoreBlocksRegular && showMoreBlocksRegular.length && initItems(showMoreBlocksRegular);
			mdQueriesArray && mdQueriesArray.length && initItemsMedia(mdQueriesArray);
		}
	}
}
window.addEventListener("load", showMore);
//#endregion
//#region src/components/layout/creators-slider/creators-slider.js
function initCreatorsSlider() {
	if (document.querySelector("[data-fls-creators-slider]")) {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		new Swiper("[data-fls-creators-slider]", {
			modules: [
				Navigation,
				Keyboard,
				A11y
			],
			observer: true,
			observeParents: true,
			slidesPerView: "auto",
			slidesPerGroup: 1,
			spaceBetween: 15,
			speed: reduceMotion ? 0 : 500,
			loop: false,
			navigation: {
				prevEl: ".creators__arrow--prev",
				nextEl: ".creators__arrow--next"
			},
			keyboard: {
				enabled: true,
				onlyInViewport: false,
				pageUpDown: false
			},
			a11y: {
				prevSlideMessage: "Previous creator",
				nextSlideMessage: "Next creator"
			},
			on: { init(swiper) {
				swiper.el.addEventListener("focusin", (e) => {
					const slide = e.target.closest(".swiper-slide");
					if (!slide) return;
					swiper.el.scrollLeft = 0;
					swiper.slideTo([...slide.parentElement.children].indexOf(slide));
				});
			} }
		});
	}
}
document.querySelector("[data-fls-creators-slider]") && window.addEventListener("load", initCreatorsSlider);
//#endregion
