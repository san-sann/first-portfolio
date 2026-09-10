import "./main.min.js";
import "./form.min.js";
/* empty css              */
/* empty css           */
//#region src/components/pages/newpassword/newpassword.js
document.querySelectorAll(".newpasswordform__password-toggle").forEach((toggle) => {
	const input = toggle.previousElementSibling;
	if (!input) return;
	toggle.addEventListener("click", () => {
		const isVisible = input.type === "text";
		input.type = isVisible ? "password" : "text";
		toggle.setAttribute("aria-pressed", String(!isVisible));
		toggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
	});
});
//#endregion
