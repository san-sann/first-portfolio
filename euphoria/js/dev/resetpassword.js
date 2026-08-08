import "./main.min.js";
import "./select.min.js";
import "./header-auth.min.js";
import "./button2.min.js";
//#region src/components/pages/resetpassword/resetpassword.js
document.addEventListener("formSent", (event) => {
	if (!event.detail.form.classList.contains("resetpassword__form")) return;
	location.href = "checkemail.html";
});
//#endregion
