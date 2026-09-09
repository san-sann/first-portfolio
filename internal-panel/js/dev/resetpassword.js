import "./main.min.js";
import "./form.min.js";
/* empty css           */
//#region src/components/pages/resetpassword/resetpassword.js
document.addEventListener("formSent", (e) => {
	if (e.detail.form.matches(".form__fields")) window.location.href = "login.html";
});
//#endregion
