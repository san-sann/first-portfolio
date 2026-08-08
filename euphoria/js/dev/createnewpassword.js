import { C as spriteHref, t as formValidate } from "./main.min.js";
import "./select.min.js";
import "./header-auth.min.js";
import "./button2.min.js";
//#region src/components/pages/createnewpassword/createnewpassword.js
var passwordToggle = document.querySelector("[data-createnewpassword-toggle-password]");
var passwordInput = document.getElementById("createnewpassword-password");
var confirmInput = document.getElementById("createnewpassword-confirm");
var form = document.querySelector(".createnewpassword__form");
if (passwordToggle && passwordInput) passwordToggle.addEventListener("click", () => {
	const willShow = passwordInput.type === "password";
	passwordInput.type = willShow ? "text" : "password";
	passwordToggle.setAttribute("aria-pressed", String(willShow));
	passwordToggle.querySelector("[data-createnewpassword-toggle-label]").textContent = willShow ? "Hide" : "Show";
	passwordToggle.querySelector(".createnewpassword__eye-icon use").setAttribute("xlink:href", spriteHref(willShow ? "eye-hide" : "eye"));
});
if (passwordInput && confirmInput && form) {
	const requiredErrtext = confirmInput.dataset.flsFormErrtext;
	const mismatchErrtext = "New passwords do not match.";
	function syncMatchState() {
		if (!confirmInput.value) return;
		if (passwordInput.value && confirmInput.value !== passwordInput.value) {
			confirmInput.dataset.flsFormErrtext = mismatchErrtext;
			formValidate.addError(confirmInput);
		} else {
			confirmInput.dataset.flsFormErrtext = requiredErrtext;
			formValidate.removeError(confirmInput);
		}
	}
	const scheduleMatchCheck = () => setTimeout(syncMatchState, 0);
	passwordInput.addEventListener("focusout", scheduleMatchCheck);
	confirmInput.addEventListener("focusout", scheduleMatchCheck);
	form.addEventListener("submit", (e) => {
		if (Boolean(passwordInput.value) && Boolean(confirmInput.value) && passwordInput.value !== confirmInput.value) {
			confirmInput.dataset.flsFormErrtext = mismatchErrtext;
			formValidate.addError(confirmInput);
			e.preventDefault();
			e.stopImmediatePropagation();
		}
	});
}
document.addEventListener("formSent", (event) => {
	if (!event.detail.form.classList.contains("createnewpassword__form")) return;
	location.href = "signin.html";
});
//#endregion
