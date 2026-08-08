import { S as slideUp, _ as dataMediaQueries, b as slideDown, v as getHash, y as setHash } from "./main.min.js";
//#region src/components/layout/tabs/tabs.js
function tabs() {
	const tabs = document.querySelectorAll("[data-fls-tabs]");
	let tabsActiveHash = [];
	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add("--tab-init");
			tabsBlock.setAttribute("data-fls-tabs-index", index);
			tabsBlock.addEventListener("click", setTabsAction);
			tabsBlock.addEventListener("keydown", setTabsKeydown);
			initTabs(tabsBlock);
		});
		let mdQueriesArray = dataMediaQueries(tabs, "flsTabs");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem) => {
			mdQueriesItem.matchMedia.addEventListener("change", function() {
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
	}
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach((tabsMediaItem) => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector("[data-fls-tabs-titles]");
			let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-title]");
			let tabsContent = tabsMediaItem.querySelector("[data-fls-tabs-body]");
			let tabsContentItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-item]");
			tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add("--tab-spoller");
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove("--tab-spoller");
				}
			});
		});
	}
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-titles]>*");
		let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-body]>*");
		const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
		const tabsTitlesContainer = tabsBlock.querySelector("[data-fls-tabs-titles]");
		tabsTitlesContainer && tabsTitlesContainer.setAttribute("role", "tablist");
		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector("[data-fls-tabs-titles]>.--tab-active");
			tabsActiveTitle && tabsActiveTitle.classList.remove("--tab-active");
		}
		if (tabsContent.length) tabsContent.forEach((tabsContentItem, index) => {
			const tabsTitleItem = tabsTitles[index];
			tabsTitleItem.setAttribute("data-fls-tabs-title", "");
			tabsContentItem.setAttribute("data-fls-tabs-item", "");
			const tabId = `tabs-${tabsBlockIndex}-tab-${index}`;
			const panelId = `tabs-${tabsBlockIndex}-panel-${index}`;
			tabsTitleItem.id = tabId;
			tabsTitleItem.setAttribute("role", "tab");
			tabsTitleItem.setAttribute("aria-controls", panelId);
			tabsContentItem.id = panelId;
			tabsContentItem.setAttribute("role", "tabpanel");
			tabsContentItem.setAttribute("aria-labelledby", tabId);
			tabsContentItem.setAttribute("tabindex", "0");
			if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitleItem.classList.add("--tab-active");
			tabsContentItem.hidden = !tabsTitleItem.classList.contains("--tab-active");
			tabsTitleItem.setAttribute("aria-selected", tabsTitleItem.classList.contains("--tab-active") ? "true" : "false");
			tabsTitleItem.setAttribute("tabindex", tabsTitleItem.classList.contains("--tab-active") ? "0" : "-1");
		});
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-title]");
		let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-item]");
		const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute("data-fls-tabs-animate")) return tabsBlock.dataset.flsTabsAnimate > 0 ? Number(tabsBlock.dataset.flsTabsAnimate) : 500;
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute("data-fls-tabs-hash");
			tabsContent = Array.from(tabsContent).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				const tabsTitleActive = tabsTitles[index].classList.contains("--tab-active");
				tabsTitles[index].setAttribute("aria-selected", tabsTitleActive ? "true" : "false");
				tabsTitles[index].setAttribute("tabindex", tabsTitleActive ? "0" : "-1");
				if (tabsTitleActive) {
					if (tabsBlockAnimate) slideDown(tabsContentItem, tabsBlockAnimate);
					else tabsContentItem.hidden = false;
					if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
				} else if (tabsBlockAnimate) slideUp(tabsContentItem, tabsBlockAnimate);
				else tabsContentItem.hidden = true;
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest("[data-fls-tabs-title]")) {
			const tabTitle = el.closest("[data-fls-tabs-title]");
			activateTabTitle(tabTitle.closest("[data-fls-tabs]"), tabTitle);
			e.preventDefault();
		}
	}
	function activateTabTitle(tabsBlock, tabTitle) {
		if (!tabTitle.classList.contains("--tab-active") && !tabsBlock.querySelector(".--slide")) {
			let tabActiveTitle = tabsBlock.querySelectorAll("[data-fls-tabs-title].--tab-active");
			tabActiveTitle.length && (tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock));
			tabActiveTitle.length && tabActiveTitle[0].classList.remove("--tab-active");
			tabTitle.classList.add("--tab-active");
			setTabsStatus(tabsBlock);
		}
	}
	function setTabsKeydown(e) {
		if (![
			"ArrowLeft",
			"ArrowRight",
			"Home",
			"End"
		].includes(e.key)) return;
		const tabTitle = e.target.closest("[data-fls-tabs-title]");
		if (!tabTitle) return;
		const tabsBlock = tabTitle.closest("[data-fls-tabs]");
		const tabsTitles = Array.from(tabsBlock.querySelectorAll("[data-fls-tabs-title]")).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
		const currentIndex = tabsTitles.indexOf(tabTitle);
		let nextIndex = currentIndex;
		if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabsTitles.length) % tabsTitles.length;
		if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabsTitles.length;
		if (e.key === "Home") nextIndex = 0;
		if (e.key === "End") nextIndex = tabsTitles.length - 1;
		e.preventDefault();
		activateTabTitle(tabsBlock, tabsTitles[nextIndex]);
		tabsTitles[nextIndex].focus();
	}
}
window.addEventListener("load", tabs);
//#endregion
