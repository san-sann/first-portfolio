import { a as getHash, c as slideDown, r as dataMediaQueries, s as setHash, u as slideUp } from "./main.min.js";
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
		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector("[data-fls-tabs-titles]>.--tab-active");
			tabsActiveTitle && tabsActiveTitle.classList.remove("--tab-active");
		}
		if (tabsContent.length) {
			tabsTitlesContainer && tabsTitlesContainer.setAttribute("role", "tablist");
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute("data-fls-tabs-title", "");
				tabsContentItem.setAttribute("data-fls-tabs-item", "");
				if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("--tab-active");
				const isActive = tabsTitles[index].classList.contains("--tab-active");
				const tabId = `tabs-${tabsBlockIndex}-tab-${index}`;
				const panelId = `tabs-${tabsBlockIndex}-panel-${index}`;
				tabsTitles[index].id = tabId;
				tabsTitles[index].setAttribute("role", "tab");
				tabsTitles[index].setAttribute("aria-controls", panelId);
				tabsTitles[index].setAttribute("aria-selected", isActive ? "true" : "false");
				tabsTitles[index].setAttribute("tabindex", isActive ? "0" : "-1");
				tabsContentItem.id = panelId;
				tabsContentItem.setAttribute("role", "tabpanel");
				tabsContentItem.setAttribute("aria-labelledby", tabId);
				tabsContentItem.setAttribute("tabindex", "0");
				tabsContentItem.hidden = !isActive;
			});
		}
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
				const isActive = tabsTitles[index].classList.contains("--tab-active");
				tabsTitles[index].setAttribute("aria-selected", isActive ? "true" : "false");
				tabsTitles[index].setAttribute("tabindex", isActive ? "0" : "-1");
				if (isActive) {
					if (tabsBlockAnimate) slideDown(tabsContentItem, tabsBlockAnimate);
					else tabsContentItem.hidden = false;
					if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
				} else if (tabsBlockAnimate) slideUp(tabsContentItem, tabsBlockAnimate);
				else tabsContentItem.hidden = true;
			});
		}
	}
	function activateTabTitle(tabsBlock, tabTitle) {
		if (!tabTitle || tabTitle.classList.contains("--tab-active") || tabsBlock.querySelector(".--slide")) return;
		let tabActiveTitle = tabsBlock.querySelectorAll("[data-fls-tabs-title].--tab-active");
		tabActiveTitle.length && (tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock));
		tabActiveTitle.length && tabActiveTitle[0].classList.remove("--tab-active");
		tabTitle.classList.add("--tab-active");
		setTabsStatus(tabsBlock);
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest("[data-fls-tabs-title]")) {
			const tabTitle = el.closest("[data-fls-tabs-title]");
			activateTabTitle(tabTitle.closest("[data-fls-tabs]"), tabTitle);
			e.preventDefault();
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
