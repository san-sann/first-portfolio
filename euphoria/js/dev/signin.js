import { C as spriteHref } from "./main.min.js";
import "./select.min.js";
import "./header-auth.min.js";
import "./button2.min.js";
//#region src/components/pages/signin/signin.js
var passwordToggle = document.querySelector("[data-signin-toggle-password]");
var passwordInput = document.getElementById("signin-password");
if (passwordToggle && passwordInput) passwordToggle.addEventListener("click", () => {
	const willShow = passwordInput.type === "password";
	passwordInput.type = willShow ? "text" : "password";
	passwordToggle.setAttribute("aria-pressed", String(willShow));
	passwordToggle.querySelector("[data-signin-toggle-label]").textContent = willShow ? "Hide" : "Show";
	passwordToggle.querySelector(".signin__eye-icon use").setAttribute("xlink:href", spriteHref(willShow ? "eye-hide" : "eye"));
});
//#endregion
