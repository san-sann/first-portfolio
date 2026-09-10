import "./main.min.js";
import "./form.min.js";
/* empty css              */
//#region src/components/pages/login/login.js
var passwordInput = document.querySelector("#login-password");
var passwordToggle = document.querySelector(".loginform__password-toggle");
if (passwordInput && passwordToggle) passwordToggle.addEventListener("click", () => {
	const isVisible = passwordInput.type === "text";
	passwordInput.type = isVisible ? "password" : "text";
	passwordToggle.setAttribute("aria-pressed", String(!isVisible));
	passwordToggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
});
//#endregion
