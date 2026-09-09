import "./main.min.js";
import "./header.min.js";
/* empty css           */
//#region src/components/pages/administration/administration.js
var searchInput = document.querySelector(".administration__search-input");
var table = document.querySelector(".administration__table");
var foundCount = document.querySelector(".administration__found-count");
if (searchInput && table) {
	const rows = [...table.querySelectorAll("tbody tr")];
	searchInput.addEventListener("input", () => {
		const query = searchInput.value.trim().toLowerCase();
		let visible = 0;
		rows.forEach((row) => {
			const matches = (row.children[1]?.textContent.toLowerCase() ?? "").includes(query);
			row.hidden = !matches;
			if (matches) visible += 1;
		});
		if (foundCount) foundCount.textContent = String(visible);
	});
}
//#endregion
