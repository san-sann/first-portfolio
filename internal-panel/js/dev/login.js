import "./main.min.js";
import "./form.min.js";
/* empty css           */
//#region src/components/forms/input/plugins/viewpass.js
function viewPass() {
	document.addEventListener("click", function(e) {
		let targetElement = e.target.closest("[data-fls-input-viewpass]");
		if (targetElement) {
			let isActive = targetElement.classList.contains("--viewpass-active");
			let inputType = isActive ? "password" : "text";
			targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
			targetElement.classList.toggle("--viewpass-active");
			targetElement.setAttribute("aria-pressed", String(!isActive));
			targetElement.setAttribute("aria-label", isActive ? "Show password" : "Hide password");
		}
	});
}
document.querySelector("[data-fls-input-viewpass]") && window.addEventListener("load", viewPass);
//#endregion
//#region src/components/pages/login/login.js
document.addEventListener("formSent", (e) => {
	if (e.detail.form.matches(".form__fields")) window.location.href = "dashboard.html";
});
//#endregion
