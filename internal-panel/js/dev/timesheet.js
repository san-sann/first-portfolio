import "./datepicker.min.js";
import "./main.min.js";
import "./header.min.js";
import "./select.min.js";
import "./spollers.min.js";
//#region src/components/pages/timesheet/timesheet.js
var toolbar = document.querySelector(".toolbar");
if (toolbar) {
	const yearValue = toolbar.querySelector(".toolbar__year-value");
	const prevBtn = toolbar.querySelector(".toolbar__year-btn--prev");
	const nextBtn = toolbar.querySelector(".toolbar__year-btn--next");
	const datepickerBtn = toolbar.querySelector(".toolbar__datepicker");
	const datepickerInput = toolbar.querySelector(".toolbar__datepicker-input");
	const changeYear = (delta) => {
		if (!yearValue) return;
		yearValue.textContent = parseInt(yearValue.textContent, 10) + delta;
	};
	if (prevBtn) prevBtn.addEventListener("click", () => changeYear(-1));
	if (nextBtn) nextBtn.addEventListener("click", () => changeYear(1));
	if (datepickerBtn && datepickerInput) {
		datepickerBtn.addEventListener("click", (event) => {
			event.stopPropagation();
			datepickerInput.focus();
		});
		datepickerInput.addEventListener("fls-datepicker-select", (event) => {
			if (event.detail.date) changeYear(event.detail.date.getFullYear() - parseInt(yearValue.textContent, 10));
		});
	}
}
var grid = document.querySelector(".grid");
if (grid) {
	const tbody = grid.querySelector(".grid__body");
	const addRowBtn = grid.querySelector(".grid__add-row");
	const addOvertimeBtn = grid.querySelector(".grid__add-overtime");
	const saveBtn = grid.querySelector(".grid__save");
	const rejectBtn = grid.querySelector(".grid__reject");
	const submitBtn = grid.querySelector(".grid__submit");
	const totalValue = grid.querySelector(".grid__total-value");
	const statusEl = grid.querySelector("#grid-status");
	const DAYS = [
		"mon",
		"tue",
		"wed",
		"thu",
		"fri",
		"sat",
		"sun"
	];
	const DAY_LABELS = [
		"15 / Mon",
		"16 / Tue",
		"17 / Wed",
		"18 / Thu",
		"19 / Fri",
		"20 / Sat",
		"21 / Sun"
	];
	let selectIdCounter = document.querySelectorAll("[data-fls-select]").length;
	let rowCounter = tbody.querySelectorAll(".grid__row").length;
	const projectOptionsHTML = grid.querySelector(".grid__cell--project select").innerHTML.replace(" selected", "");
	const recalcTotal = () => {
		if (!totalValue) return;
		const sum = [...grid.querySelectorAll(".grid__hours")].reduce((acc, input) => {
			const value = parseFloat(input.value);
			return acc + (Number.isFinite(value) ? value : 0);
		}, 0);
		totalValue.textContent = sum.toFixed(2);
	};
	const buildRowHTML = (index) => {
		const cellsHTML = DAYS.map((day, i) => `
			<td class="grid__cell grid__cell--day"${i === 1 ? " data-today" : ""}>
				<label for="grid-hours-${index}-${day}" class="visually-hidden">Hours on ${DAY_LABELS[i]}</label>
				<input type="text" inputmode="decimal" class="grid__hours" id="grid-hours-${index}-${day}" value="">
			</td>
		`).join("");
		return `
			<tr class="grid__row">
				<td class="grid__cell grid__cell--remove">
					<button type="button" class="grid__remove" aria-label="Remove row">
						<svg class="grid__remove-icon" width="24" height="24" aria-hidden="true"><use xlink:href="__spritemap#sprite-remove-circle-outline"></use></svg>
					</button>
				</td>
				<td class="grid__cell grid__cell--project">
					<label for="grid-project-${index}" class="visually-hidden">Project</label>
					<select id="grid-project-${index}" name="project[]" data-fls-select data-fls-select-modif="grid">${projectOptionsHTML}</select>
				</td>
				<td class="grid__cell grid__cell--role">
					<label for="grid-role-${index}" class="visually-hidden">Role</label>
					<select id="grid-role-${index}" name="role[]" data-fls-select data-fls-select-modif="grid">
						<option value="">Select</option>
						<option value="specialist">Specialist</option>
						<option value="manager">Manager</option>
						<option value="consultant">Consultant</option>
					</select>
				</td>
				<td class="grid__cell grid__cell--activity">
					<label for="grid-activity-${index}" class="visually-hidden">Activity</label>
					<select id="grid-activity-${index}" name="activity[]" data-fls-select data-fls-select-modif="grid">
						<option value="">Select</option>
						<option value="development">Development</option>
						<option value="alpha">Alpha</option>
						<option value="testing">Testing</option>
					</select>
				</td>
				${cellsHTML}
			</tr>
		`;
	};
	const wireRowInteractions = (row) => {
		const removeBtn = row.querySelector(".grid__remove");
		if (removeBtn) removeBtn.addEventListener("click", () => {
			if (tbody.querySelectorAll(".grid__row").length <= 1) return;
			row.remove();
			recalcTotal();
		});
		row.querySelectorAll(".grid__hours").forEach((input) => {
			const syncFilled = () => {
				const cell = input.closest(".grid__cell");
				if (cell) cell.classList.toggle("grid__cell--filled", input.value.trim() !== "");
			};
			input.addEventListener("input", () => {
				syncFilled();
				recalcTotal();
			});
			input.addEventListener("blur", () => {
				const value = parseFloat(input.value);
				input.value = Number.isFinite(value) ? value.toFixed(2) : "";
				syncFilled();
				recalcTotal();
			});
		});
	};
	const addRow = () => {
		rowCounter += 1;
		tbody.insertAdjacentHTML("beforeend", buildRowHTML(rowCounter));
		const row = tbody.lastElementChild;
		row.querySelectorAll("select[data-fls-select]").forEach((select) => {
			selectIdCounter += 1;
			if (window.flsSelect) window.flsSelect.selectInit(select, selectIdCounter);
		});
		wireRowInteractions(row);
	};
	if (addRowBtn) addRowBtn.addEventListener("click", addRow);
	if (addOvertimeBtn) addOvertimeBtn.addEventListener("click", addRow);
	tbody.querySelectorAll(".grid__row").forEach(wireRowInteractions);
	recalcTotal();
	const setSubmitted = (submitted) => {
		grid.querySelectorAll("select[data-fls-select], .grid__hours, .grid__remove, .grid__add-row, .grid__add-overtime").forEach((el) => {
			el.disabled = submitted;
			if (el.matches("select[data-fls-select]") && window.flsSelect) window.flsSelect.selectDisabled(el.closest(".select"), el);
		});
		if (saveBtn) saveBtn.disabled = submitted;
		if (submitBtn) submitBtn.disabled = submitted;
		if (rejectBtn) rejectBtn.disabled = !submitted;
		if (statusEl) statusEl.textContent = submitted ? "Timesheet submitted for approval." : "Timesheet reopened for editing.";
	};
	if (submitBtn) submitBtn.addEventListener("click", () => setSubmitted(true));
	if (rejectBtn) rejectBtn.addEventListener("click", () => setSubmitted(false));
	const tableWrap = grid.querySelector(".grid__table-wrap");
	const repositionSelectDropdowns = () => {
		tableWrap.classList.toggle("--dropdown-open", !!tableWrap.querySelector(".select.--select-open"));
		tableWrap.querySelectorAll(".select").forEach((selectRoot) => {
			const options = selectRoot.querySelector(".select__options");
			if (!options) return;
			if (!selectRoot.classList.contains("--select-open")) {
				options.style.position = "";
				options.style.left = "";
				options.style.top = "";
				options.style.bottom = "";
				options.style.width = "";
				options.style.minWidth = "";
				options.style.zIndex = "";
				return;
			}
			const title = selectRoot.querySelector(".select__title");
			if (!title) return;
			const rect = title.getBoundingClientRect();
			const showTop = selectRoot.classList.contains("select--show-top");
			options.style.position = "fixed";
			options.style.left = `${rect.left}px`;
			options.style.width = `${rect.width}px`;
			options.style.minWidth = `${rect.width}px`;
			options.style.zIndex = "60";
			if (showTop) {
				options.style.top = "";
				options.style.bottom = `${window.innerHeight - rect.top}px`;
			} else {
				options.style.bottom = "";
				options.style.top = `${rect.bottom}px`;
			}
		});
	};
	new MutationObserver(repositionSelectDropdowns).observe(tableWrap, {
		attributes: true,
		attributeFilter: ["class"],
		subtree: true
	});
	tableWrap.addEventListener("scroll", repositionSelectDropdowns);
}
//#endregion
