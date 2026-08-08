import "./main.min.js";
import "./select.min.js";
import "./header-auth.min.js";
import "./button2.min.js";
//#region src/components/pages/verification/verification.js
document.addEventListener("formSent", (event) => {
	if (!event.detail.form.classList.contains("verification__form")) return;
	location.href = "createnewpassword.html";
});
//#endregion
