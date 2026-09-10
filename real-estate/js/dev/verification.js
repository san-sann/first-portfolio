import "./main.min.js";
import "./form.min.js";
/* empty css              */
//#region src/components/pages/verification/verification.js
var codeInputs = document.querySelectorAll(".verifyform__code-input");
if (codeInputs.length) codeInputs.forEach((input, index) => {
	input.addEventListener("input", () => {
		input.value = input.value.replace(/\D/g, "").slice(-1);
		if (input.value && codeInputs[index + 1]) codeInputs[index + 1].focus();
	});
	input.addEventListener("keydown", (e) => {
		if (e.key === "Backspace" && !input.value && codeInputs[index - 1]) codeInputs[index - 1].focus();
	});
	input.addEventListener("paste", (e) => {
		const digits = (e.clipboardData?.getData("text") || "").replace(/\D/g, "");
		if (!digits) return;
		e.preventDefault();
		let lastFilledIndex = index;
		digits.split("").forEach((digit, offset) => {
			const target = codeInputs[index + offset];
			if (!target) return;
			target.value = digit;
			target.focus();
			target.blur();
			lastFilledIndex = index + offset;
		});
		const nextTarget = codeInputs[lastFilledIndex + 1] || codeInputs[lastFilledIndex];
		if (nextTarget) nextTarget.focus();
	});
});
//#endregion
