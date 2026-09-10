import "./popup.min.js";
import "./contactinfo.min.js";
/* empty css              */
/* empty css           */
//#region src/components/pages/contactus/contactus.js
var mapBlock = document.querySelector("[data-map]");
if (mapBlock) {
	const loadBtn = mapBlock.querySelector("[data-map-load]");
	const fullscreenBtn = mapBlock.querySelector("[data-map-fullscreen]");
	if (loadBtn) loadBtn.addEventListener("click", () => {
		const iframe = document.createElement("iframe");
		iframe.className = "contact__map-frame";
		iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6535.920313625019!2d-73.98084699285623!3d40.690839507922085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25bb33075cf55%3A0x967e6914b74366a4!2sLong%20Island%20University%20Brooklyn!5e0!3m2!1suk!2sua!4v1787303400583!5m2!1suk!2sua";
		iframe.title = "Our location near Long Island University Brooklyn on Google Maps";
		iframe.loading = "lazy";
		iframe.referrerPolicy = "strict-origin-when-cross-origin";
		iframe.allowFullscreen = true;
		loadBtn.replaceWith(iframe);
		if (fullscreenBtn) fullscreenBtn.hidden = false;
	}, { once: true });
	if (fullscreenBtn) fullscreenBtn.addEventListener("click", () => {
		if (document.fullscreenElement) document.exitFullscreen();
		else if (mapBlock.requestFullscreen) mapBlock.requestFullscreen();
	});
}
//#endregion
