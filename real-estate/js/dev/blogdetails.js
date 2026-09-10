import "./main.min.js";
/* empty css           */
import "./watcher.min.js";
import "./blogcard.min.js";
/* empty css               */
//#region src/components/pages/blogdetails/blogdetails.js
var shareGroup = document.querySelector(".article__share");
if (shareGroup) {
	const shareUrl = () => encodeURIComponent(window.location.href);
	const shareTitle = () => encodeURIComponent(document.title);
	shareGroup.addEventListener("click", (event) => {
		const button = event.target.closest("[data-article-share]");
		if (!button) return;
		const type = button.dataset.articleShare;
		if (type === "copy") {
			navigator.clipboard?.writeText(window.location.href).then(() => {
				const label = button.getAttribute("aria-label");
				button.setAttribute("aria-label", "Link copied");
				window.setTimeout(() => button.setAttribute("aria-label", label), 2e3);
			});
			return;
		}
		const intentUrl = {
			twitter: `https://twitter.com/intent/tweet?url=${shareUrl()}&text=${shareTitle()}`,
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl()}`,
			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl()}`
		}[type];
		if (intentUrl) window.open(intentUrl, "_blank", "noopener,noreferrer,width=600,height=500");
	});
}
//#endregion
