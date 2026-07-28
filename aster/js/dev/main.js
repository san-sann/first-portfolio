import { n as bodyLockToggle, o as gotoBlock, t as bodyLockStatus } from "./common.min.js";
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
//#region src/components/layout/toolbar/toolbar.js
function closeToolbarProfile() {
	const profile = document.querySelector(".toolbar__profile.--open");
	if (!profile) return;
	profile.classList.remove("--open");
	profile.querySelector("[data-fls-toolbar-profile]").setAttribute("aria-expanded", "false");
	profile.querySelector(".toolbar__profile-menu").hidden = true;
}
function toggleToolbarProfile(trigger) {
	const profile = trigger.closest(".toolbar__profile");
	const wasOpen = profile.classList.contains("--open");
	closeToolbarProfile();
	if (!wasOpen) {
		profile.classList.add("--open");
		trigger.setAttribute("aria-expanded", "true");
		profile.querySelector(".toolbar__profile-menu").hidden = false;
	}
}
function closeToolbarSearch() {
	const search = document.querySelector(".toolbar__search.--open");
	if (!search) return;
	search.classList.remove("--open");
	search.querySelector("[data-fls-toolbar-search-toggle]").setAttribute("aria-expanded", "false");
}
function toolbarSearchToggleClick(e, toggle) {
	const search = toggle.closest(".toolbar__search");
	const input = search.querySelector(".toolbar__search-input");
	if (input.offsetWidth === 0) {
		e.preventDefault();
		search.classList.add("--open");
		toggle.setAttribute("aria-expanded", "true");
		input.focus();
	}
}
function toolbarInit() {
	document.addEventListener("click", function(e) {
		const profileTrigger = e.target.closest("[data-fls-toolbar-profile]");
		if (profileTrigger) toggleToolbarProfile(profileTrigger);
		else if (!e.target.closest(".toolbar__profile")) closeToolbarProfile();
		const searchToggle = e.target.closest("[data-fls-toolbar-search-toggle]");
		if (searchToggle) toolbarSearchToggleClick(e, searchToggle);
		else if (!e.target.closest(".toolbar__search")) closeToolbarSearch();
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape") {
			closeToolbarProfile();
			closeToolbarSearch();
		}
	});
}
document.querySelector("[data-fls-toolbar]") && window.addEventListener("load", toolbarInit);
//#endregion
//#region src/components/layout/menu/menu.js
function closeMenu() {
	if (bodyLockStatus && document.documentElement.hasAttribute("data-fls-menu-open")) {
		bodyLockToggle();
		document.documentElement.removeAttribute("data-fls-menu-open");
	}
}
function menuInit() {
	document.addEventListener("click", function(e) {
		if (e.target.closest("[data-fls-menu]")) {
			if (bodyLockStatus) {
				bodyLockToggle();
				document.documentElement.toggleAttribute("data-fls-menu-open");
			}
			return;
		}
		if (document.documentElement.hasAttribute("data-fls-menu-open") && !e.target.closest(".menu__body") && !e.target.closest(".header__premium")) closeMenu();
	});
	document.addEventListener("keydown", function(e) {
		if (e.key === "Escape") closeMenu();
	});
	const burger = document.querySelector("[data-fls-menu]");
	if (burger) {
		const syncBurgerAria = () => {
			const isOpen = document.documentElement.hasAttribute("data-fls-menu-open");
			burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
			burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
		};
		new MutationObserver(syncBurgerAria).observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-fls-menu-open"]
		});
	}
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
//#region src/components/forms/_functions.js
var formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll("[required]");
		if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem) => {
			if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
		});
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.type === "email") {
			formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				this.removeSuccess(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
				this.addSuccess(formRequiredItem);
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else if (!formRequiredItem.value.trim()) {
			this.addError(formRequiredItem);
			this.removeSuccess(formRequiredItem);
			error++;
		} else {
			this.removeError(formRequiredItem);
			this.addSuccess(formRequiredItem);
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add("--form-error");
		formRequiredItem.parentElement.classList.add("--form-error");
		let inputError = formRequiredItem.parentElement.querySelector("[data-fls-form-error]");
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.flsFormErrtext) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div data-fls-form-error>${formRequiredItem.dataset.flsFormErrtext}</div>`);
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove("--form-error");
		formRequiredItem.parentElement.classList.remove("--form-error");
		if (formRequiredItem.parentElement.querySelector("[data-fls-form-error]")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector("[data-fls-form-error]"));
	},
	addSuccess(formRequiredItem) {
		formRequiredItem.classList.add("--form-success");
		formRequiredItem.parentElement.classList.add("--form-success");
	},
	removeSuccess(formRequiredItem) {
		formRequiredItem.classList.remove("--form-success");
		formRequiredItem.parentElement.classList.remove("--form-success");
	},
	removeFocus(formRequiredItem) {
		formRequiredItem.classList.remove("--form-focus");
		formRequiredItem.parentElement.classList.remove("--form-focus");
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll("input,textarea");
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				formValidate.removeFocus(el);
				formValidate.removeSuccess(el);
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll("input[type=\"checkbox\"]");
			if (checkboxes.length) checkboxes.forEach((checkbox) => {
				checkbox.checked = false;
			});
			if (window["flsSelect"]) {
				let selects = form.querySelectorAll("select[data-fls-select]");
				if (selects.length) selects.forEach((select) => {
					window["flsSelect"].selectBuild(select);
				});
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	}
};
//#endregion
//#region src/components/forms/form/form.js
function formInit() {
	function formSubmit() {
		const forms = document.forms;
		if (forms.length) for (const form of forms) {
			!form.hasAttribute("data-fls-form-novalidate") && form.setAttribute("novalidate", true);
			form.addEventListener("submit", function(e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener("reset", function(e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
		async function formSubmitAction(form, e) {
			if (formValidate.getErrors(form) === 0) {
				if (form.dataset.flsForm === "ajax") {
					e.preventDefault();
					const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
					const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
					const formData = new FormData(form);
					form.classList.add("--sending");
					const response = await fetch(formAction, {
						method: formMethod,
						body: formData
					});
					if (response.ok) {
						let responseResult = await response.json();
						form.classList.remove("--sending");
						formSent(form, responseResult);
					} else form.classList.remove("--sending");
				} else if (form.dataset.flsForm === "dev") {
					e.preventDefault();
					formSent(form);
				}
			} else {
				e.preventDefault();
				if (form.querySelector(".--form-error") && form.hasAttribute("data-fls-form-gotoerr")) gotoBlock(form.dataset.flsFormGotoerr ? form.dataset.flsFormGotoerr : ".--form-error");
			}
		}
		function formSent(form, responseResult = ``) {
			document.dispatchEvent(new CustomEvent("formSent", { detail: { form } }));
			setTimeout(() => {
				if (window.flsPopup) {
					const popup = form.dataset.flsFormPopup;
					if (form.dataset.flsFormPopupMessage) document.querySelector(`[data-fls-popup="${popup}"] [data-fls-popup-content]`).insertAdjacentHTML("afterbegin", form.dataset.flsFormPopupMessage);
					popup && window.flsPopup.open(popup);
				}
			}, 0);
			formValidate.formClean(form);
		}
	}
	function formFieldsInit() {
		document.body.addEventListener("focusin", function(e) {
			const targetElement = e.target;
			if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
				if (!targetElement.hasAttribute("data-fls-form-nofocus")) {
					targetElement.classList.add("--form-focus");
					targetElement.parentElement.classList.add("--form-focus");
				}
				targetElement.hasAttribute("data-fls-form-validatenow") && formValidate.removeError(targetElement);
			}
		});
		document.body.addEventListener("focusout", function(e) {
			const targetElement = e.target;
			if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
				if (!targetElement.hasAttribute("data-fls-form-nofocus")) {
					targetElement.classList.remove("--form-focus");
					targetElement.parentElement.classList.remove("--form-focus");
				}
				targetElement.hasAttribute("data-fls-form-validatenow") && formValidate.validateInput(targetElement);
			}
		});
	}
	formSubmit();
	formFieldsInit();
}
document.querySelector("[data-fls-form]") && window.addEventListener("load", formInit);
//#endregion
