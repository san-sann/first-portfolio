import "./main.min.js";
import "./footer.min.js";
import "./watcher.min.js";
import "./button2.min.js";
import { a as createElementIfNotDefined, d as elementParents, i as Navigation, l as elementIndex, m as setInnerHTML, n as A11y, o as Keyboard, p as makeElementsArray, r as classesToSelector, s as Swiper, t as EffectFade, u as elementOuterSize } from "./effect-fade.min.js";
import "./favorite.min.js";
//#region node_modules/swiper/modules/pagination.mjs
var isVirtualEnabled = (swiper) => !!swiper.virtual && !!swiper.params.virtual?.enabled;
var isFreeModeEnabled = (swiper) => !!swiper.params.freeMode?.enabled;
var getSlidesLength = (swiper) => {
	if (isVirtualEnabled(swiper)) return swiper.virtual.slides.length;
	const gridRows = swiper.params.grid?.rows;
	if (swiper.grid && gridRows && gridRows > 1) return swiper.slides.length / Math.ceil(gridRows);
	return swiper.slides.length;
};
var Pagination = ({ swiper, extendParams, on, emit }) => {
	const pfx = "swiper-pagination";
	extendParams({ pagination: {
		el: null,
		bulletElement: "span",
		clickable: false,
		hideOnClick: false,
		renderBullet: null,
		renderProgressbar: null,
		renderFraction: null,
		renderCustom: null,
		progressbarOpposite: false,
		type: "bullets",
		dynamicBullets: false,
		dynamicMainBullets: 1,
		formatFractionCurrent: (number) => number,
		formatFractionTotal: (number) => number,
		bulletClass: `${pfx}-bullet`,
		bulletActiveClass: `${pfx}-bullet-active`,
		modifierClass: `${pfx}-`,
		currentClass: `${pfx}-current`,
		totalClass: `${pfx}-total`,
		hiddenClass: `${pfx}-hidden`,
		progressbarFillClass: `${pfx}-progressbar-fill`,
		progressbarOppositeClass: `${pfx}-progressbar-opposite`,
		clickableClass: `${pfx}-clickable`,
		lockClass: `${pfx}-lock`,
		horizontalClass: `${pfx}-horizontal`,
		verticalClass: `${pfx}-vertical`,
		paginationDisabledClass: `${pfx}-disabled`
	} });
	swiper.pagination = {
		el: null,
		bullets: []
	};
	let bulletSize;
	let dynamicBulletIndex = 0;
	function getParams() {
		return swiper.params.pagination;
	}
	function isPaginationDisabled() {
		return !getParams().el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
	}
	function setSideBullets(bulletEl, position) {
		const { bulletActiveClass } = getParams();
		if (!bulletEl) return;
		let current = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
		if (current) {
			current.classList.add(`${bulletActiveClass}-${position}`);
			current = current[`${position === "prev" ? "previous" : "next"}ElementSibling`];
			if (current) current.classList.add(`${bulletActiveClass}-${position}-${position}`);
		}
	}
	function getMoveDirection(prevIndex, nextIndex, length) {
		prevIndex = prevIndex % length;
		nextIndex = nextIndex % length;
		if (nextIndex === prevIndex + 1) return "next";
		else if (nextIndex === prevIndex - 1) return "previous";
	}
	function onBulletClick(e) {
		const bulletEl = e.target.closest(classesToSelector(getParams().bulletClass));
		if (!bulletEl) return;
		e.preventDefault();
		const index = (elementIndex(bulletEl) ?? 0) * (swiper.params.slidesPerGroup ?? 1);
		if (swiper.params.loop) {
			if (swiper.realIndex === index) return;
			const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
			if (moveDirection === "next") swiper.slideNext();
			else if (moveDirection === "previous") swiper.slidePrev();
			else swiper.slideToLoop(index);
		} else swiper.slideTo(index);
	}
	function update() {
		const rtl = swiper.rtl;
		const params = getParams();
		if (isPaginationDisabled()) return;
		const els = makeElementsArray(swiper.pagination.el);
		let current;
		let previousIndex;
		const slidesLength = getSlidesLength(swiper);
		const total = swiper.params.loop ? Math.ceil(slidesLength / (swiper.params.slidesPerGroup ?? 1)) : swiper.snapGrid.length;
		if (swiper.params.loop) {
			previousIndex = swiper.previousRealIndex || 0;
			current = (swiper.params.slidesPerGroup ?? 1) > 1 ? Math.floor(swiper.realIndex / (swiper.params.slidesPerGroup ?? 1)) : swiper.realIndex;
		} else if (typeof swiper.snapIndex !== "undefined") {
			current = swiper.snapIndex;
			previousIndex = swiper.previousSnapIndex;
		} else {
			previousIndex = swiper.previousIndex || 0;
			current = swiper.activeIndex || 0;
		}
		if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
			const bullets = swiper.pagination.bullets;
			let firstIndex = 0;
			let lastIndex = 0;
			let midIndex = 0;
			if (params.dynamicBullets) {
				bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height");
				const dim = swiper.isHorizontal() ? "width" : "height";
				els.forEach((subEl) => {
					subEl.style[dim] = `${(bulletSize ?? 0) * (params.dynamicMainBullets + 4)}px`;
				});
				if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
					dynamicBulletIndex += current - (previousIndex || 0);
					if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1;
					else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
				}
				firstIndex = Math.max(current - dynamicBulletIndex, 0);
				lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
				midIndex = (lastIndex + firstIndex) / 2;
			}
			bullets.forEach((bulletEl) => {
				const classesToRemove = [
					"",
					"-next",
					"-next-next",
					"-prev",
					"-prev-prev",
					"-main"
				].map((suffix) => `${params.bulletActiveClass}${suffix}`).flatMap((s) => typeof s === "string" && s.includes(" ") ? s.split(" ") : [s]);
				bulletEl.classList.remove(...classesToRemove);
			});
			if (els.length > 1) bullets.forEach((bullet) => {
				const bulletIndex = elementIndex(bullet);
				if (bulletIndex === current) bullet.classList.add(...params.bulletActiveClass.split(" "));
				else if (swiper.isElement) bullet.setAttribute("part", "bullet");
				if (params.dynamicBullets && bulletIndex !== void 0) {
					if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
					if (bulletIndex === firstIndex) setSideBullets(bullet, "prev");
					if (bulletIndex === lastIndex) setSideBullets(bullet, "next");
				}
			});
			else {
				const bullet = bullets[current];
				if (bullet) bullet.classList.add(...params.bulletActiveClass.split(" "));
				if (swiper.isElement) bullets.forEach((bulletEl, bulletIndex) => {
					bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
				});
				if (params.dynamicBullets) {
					const firstDisplayedBullet = bullets[firstIndex];
					const lastDisplayedBullet = bullets[lastIndex];
					for (let i = firstIndex; i <= lastIndex; i += 1) if (bullets[i]) bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
					setSideBullets(firstDisplayedBullet, "prev");
					setSideBullets(lastDisplayedBullet, "next");
				}
			}
			if (params.dynamicBullets) {
				const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
				const bulletsOffset = ((bulletSize ?? 0) * dynamicBulletsLength - (bulletSize ?? 0)) / 2 - midIndex * (bulletSize ?? 0);
				const offsetProp = rtl ? "right" : "left";
				const positionDim = swiper.isHorizontal() ? offsetProp : "top";
				bullets.forEach((bullet) => {
					bullet.style[positionDim] = `${bulletsOffset}px`;
				});
			}
		}
		els.forEach((subEl, subElIndex) => {
			if (params.type === "fraction") {
				subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl) => {
					fractionEl.textContent = String(params.formatFractionCurrent(current + 1));
				});
				subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl) => {
					totalEl.textContent = String(params.formatFractionTotal(total));
				});
			}
			if (params.type === "progressbar") {
				let progressbarDirection;
				if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal";
				else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
				const scale = (current + 1) / total;
				let scaleX = 1;
				let scaleY = 1;
				if (progressbarDirection === "horizontal") scaleX = scale;
				else scaleY = scale;
				subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl) => {
					progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
					progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
				});
			}
			if (params.type === "custom" && params.renderCustom) {
				setInnerHTML(subEl, params.renderCustom(swiper, current + 1, total));
				if (subElIndex === 0) emit("paginationRender", subEl);
			} else {
				if (subElIndex === 0) emit("paginationRender", subEl);
				emit("paginationUpdate", subEl);
			}
			if (swiper.params.watchOverflow && swiper.enabled) subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
		});
	}
	function render() {
		const params = getParams();
		if (isPaginationDisabled()) return;
		const slidesLength = getSlidesLength(swiper);
		const els = makeElementsArray(swiper.pagination.el);
		let paginationHTML = "";
		if (params.type === "bullets") {
			let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / (swiper.params.slidesPerGroup ?? 1)) : swiper.snapGrid.length;
			if (swiper.params.freeMode && isFreeModeEnabled(swiper) && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
			for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
			else paginationHTML += `<${params.bulletElement} ${swiper.isElement ? "part=\"bullet\"" : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
		}
		if (params.type === "fraction") if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
		else paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
		if (params.type === "progressbar") if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
		else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
		swiper.pagination.bullets = [];
		els.forEach((subEl) => {
			if (params.type !== "custom") setInnerHTML(subEl, paginationHTML || "");
			if (params.type === "bullets") swiper.pagination.bullets.push(...Array.from(subEl.querySelectorAll(classesToSelector(params.bulletClass))));
		});
		if (params.type !== "custom") emit("paginationRender", els[0]);
	}
	function init() {
		swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, { el: "swiper-pagination" });
		const params = getParams();
		if (!params.el) return;
		let el;
		if (typeof params.el === "string" && swiper.isElement) el = swiper.el.querySelector(params.el);
		if (!el && typeof params.el === "string") el = [...document.querySelectorAll(params.el)];
		if (!el) el = params.el;
		if (!el || Array.isArray(el) && el.length === 0) return;
		if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
			el = [...swiper.el.querySelectorAll(params.el)];
			if (el.length > 1) {
				const found = el.find((subEl) => {
					if (elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
					return true;
				});
				if (found) el = found;
			}
		}
		if (Array.isArray(el) && el.length === 1) el = el[0];
		Object.assign(swiper.pagination, { el });
		makeElementsArray(el).forEach((subEl) => {
			if (params.type === "bullets" && params.clickable) subEl.classList.add(...(params.clickableClass || "").split(" "));
			subEl.classList.add(params.modifierClass + params.type);
			subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
			if (params.type === "bullets" && params.dynamicBullets) {
				subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
				dynamicBulletIndex = 0;
				if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
			}
			if (params.type === "progressbar" && params.progressbarOpposite) subEl.classList.add(params.progressbarOppositeClass);
			if (params.clickable) subEl.addEventListener("click", onBulletClick);
			if (!swiper.enabled) subEl.classList.add(params.lockClass);
		});
	}
	function destroy() {
		const params = getParams();
		if (isPaginationDisabled()) return;
		const el = swiper.pagination.el;
		if (el) makeElementsArray(el).forEach((subEl) => {
			subEl.classList.remove(params.hiddenClass);
			subEl.classList.remove(params.modifierClass + params.type);
			subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
			if (params.clickable) {
				subEl.classList.remove(...(params.clickableClass || "").split(" "));
				subEl.removeEventListener("click", onBulletClick);
			}
		});
		if (swiper.pagination.bullets) swiper.pagination.bullets.forEach((subEl) => subEl.classList.remove(...params.bulletActiveClass.split(" ")));
	}
	on("changeDirection", () => {
		if (!swiper.pagination || !swiper.pagination.el) return;
		const params = getParams();
		makeElementsArray(swiper.pagination.el).forEach((subEl) => {
			subEl.classList.remove(params.horizontalClass, params.verticalClass);
			subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
		});
	});
	on("init", () => {
		if (getParams().enabled === false) disable();
		else {
			init();
			render();
			update();
		}
	});
	on("activeIndexChange", () => {
		if (typeof swiper.snapIndex === "undefined") update();
	});
	on("snapIndexChange", () => {
		update();
	});
	on("snapGridLengthChange", () => {
		render();
		update();
	});
	on("destroy", () => {
		destroy();
	});
	on("enable disable", () => {
		const { el } = swiper.pagination;
		if (el) {
			const params = getParams();
			makeElementsArray(el).forEach((subEl) => subEl.classList[swiper.enabled ? "remove" : "add"](params.lockClass));
		}
	});
	on("lock unlock", () => {
		update();
	});
	on("click", (_s, e) => {
		const targetEl = e.target;
		const els = makeElementsArray(swiper.pagination.el);
		const params = getParams();
		if (params.el && params.hideOnClick && els && els.length > 0 && !targetEl.classList.contains(params.bulletClass)) {
			if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
			if (els[0].classList.contains(params.hiddenClass) === true) emit("paginationShow");
			else emit("paginationHide");
			els.forEach((subEl) => subEl.classList.toggle(params.hiddenClass));
		}
	});
	const enable = () => {
		const params = getParams();
		swiper.el.classList.remove(params.paginationDisabledClass);
		const { el } = swiper.pagination;
		if (el) makeElementsArray(el).forEach((subEl) => subEl.classList.remove(params.paginationDisabledClass));
		init();
		render();
		update();
	};
	const disable = () => {
		const params = getParams();
		swiper.el.classList.add(params.paginationDisabledClass);
		const { el } = swiper.pagination;
		if (el) makeElementsArray(el).forEach((subEl) => subEl.classList.add(params.paginationDisabledClass));
		destroy();
	};
	Object.assign(swiper.pagination, {
		enable,
		disable,
		render,
		update,
		init,
		destroy
	});
};
//#endregion
//#region node_modules/swiper/modules/autoplay.mjs
var Autoplay = ({ swiper, extendParams, on, emit, params }) => {
	swiper.autoplay = {
		running: false,
		paused: false,
		timeLeft: 0
	};
	extendParams({ autoplay: {
		enabled: false,
		delay: 3e3,
		waitForTransition: true,
		disableOnInteraction: false,
		stopOnLastSlide: false,
		reverseDirection: false,
		pauseOnMouseEnter: false
	} });
	function getParams() {
		return swiper.params.autoplay;
	}
	const initialAutoplayDelay = typeof params.autoplay === "object" && params.autoplay && typeof params.autoplay.delay === "number" ? params.autoplay.delay : 3e3;
	let timeout;
	let raf;
	let autoplayDelayTotal = initialAutoplayDelay;
	let autoplayDelayCurrent = initialAutoplayDelay;
	let autoplayTimeLeft = 0;
	let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
	let wasPaused = false;
	let isTouched = false;
	let pausedByTouch = false;
	let touchStartTimeout;
	let pausedByInteraction = false;
	let pausedByPointerEnter = false;
	function onTransitionEnd(e) {
		if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
		if (e.target !== swiper.wrapperEl) return;
		swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
		const detail = e.detail;
		if (pausedByPointerEnter || detail && detail.bySwiperTouchMove) return;
		resume();
	}
	const calcTimeLeft = () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.autoplay.paused) wasPaused = true;
		else if (wasPaused) {
			autoplayDelayCurrent = autoplayTimeLeft;
			wasPaused = false;
		}
		const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
		swiper.autoplay.timeLeft = timeLeft;
		emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
		raf = requestAnimationFrame(() => {
			calcTimeLeft();
		});
	};
	const getSlideDelay = () => {
		let activeSlideEl;
		const virtualEnabled = !!swiper.params.virtual?.enabled;
		if (swiper.virtual && virtualEnabled) activeSlideEl = swiper.slides.find((slideEl) => slideEl.classList.contains("swiper-slide-active"));
		else activeSlideEl = swiper.slides[swiper.activeIndex];
		if (!activeSlideEl) return void 0;
		const attr = activeSlideEl.getAttribute("data-swiper-autoplay");
		if (attr == null) return void 0;
		return parseInt(attr, 10);
	};
	const getTotalDelay = () => {
		let totalDelay = getParams().delay;
		const currentSlideDelay = getSlideDelay();
		if (typeof currentSlideDelay === "number" && !Number.isNaN(currentSlideDelay) && currentSlideDelay > 0) totalDelay = currentSlideDelay;
		return totalDelay;
	};
	const run = (delayForce) => {
		if (swiper.destroyed || !swiper.autoplay.running) return 0;
		if (raf !== void 0) cancelAnimationFrame(raf);
		calcTimeLeft();
		let delay = delayForce;
		if (typeof delay === "undefined") {
			delay = getTotalDelay();
			autoplayDelayTotal = delay;
			autoplayDelayCurrent = delay;
		}
		autoplayTimeLeft = delay;
		const speed = swiper.params.speed;
		const proceed = () => {
			if (!swiper || swiper.destroyed) return;
			const autoplayParams = getParams();
			if (autoplayParams.reverseDirection) {
				if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
					swiper.slidePrev(speed, true, true);
					emit("autoplay");
				} else if (!autoplayParams.stopOnLastSlide) {
					swiper.slideTo(swiper.slides.length - 1, speed, true, true);
					emit("autoplay");
				}
			} else if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
				swiper.slideNext(speed, true, true);
				emit("autoplay");
			} else if (!autoplayParams.stopOnLastSlide) {
				swiper.slideTo(0, speed, true, true);
				emit("autoplay");
			}
			if (swiper.params.cssMode) {
				autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
				requestAnimationFrame(() => {
					run();
				});
			}
		};
		if (delay > 0) {
			if (timeout !== void 0) clearTimeout(timeout);
			timeout = setTimeout(() => {
				proceed();
			}, delay);
		} else requestAnimationFrame(() => {
			proceed();
		});
		return delay;
	};
	const start = () => {
		autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
		swiper.autoplay.running = true;
		run();
		emit("autoplayStart");
		return true;
	};
	const stop = () => {
		swiper.autoplay.running = false;
		if (timeout !== void 0) clearTimeout(timeout);
		if (raf !== void 0) cancelAnimationFrame(raf);
		emit("autoplayStop");
		return true;
	};
	const pause = (internal, reset) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (timeout !== void 0) clearTimeout(timeout);
		if (!internal) pausedByInteraction = true;
		const proceed = () => {
			emit("autoplayPause");
			if (getParams().waitForTransition) swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
			else resume();
		};
		swiper.autoplay.paused = true;
		if (reset) {
			proceed();
			return;
		}
		autoplayTimeLeft = (autoplayTimeLeft || getParams().delay) - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
		if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
		if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
		proceed();
	};
	const resume = () => {
		if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
		autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
		if (pausedByInteraction) {
			pausedByInteraction = false;
			run(autoplayTimeLeft);
		} else run();
		swiper.autoplay.paused = false;
		emit("autoplayResume");
	};
	const onVisibilityChange = () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (document.visibilityState === "hidden") {
			pausedByInteraction = true;
			pause(true);
		}
		if (document.visibilityState === "visible") resume();
	};
	const onPointerEnter = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByInteraction = true;
		pausedByPointerEnter = true;
		if (swiper.animating || swiper.autoplay.paused) return;
		pause(true);
	};
	const onPointerLeave = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByPointerEnter = false;
		if (swiper.autoplay.paused) resume();
	};
	const attachMouseEvents = () => {
		if (getParams().pauseOnMouseEnter) {
			swiper.el.addEventListener("pointerenter", onPointerEnter);
			swiper.el.addEventListener("pointerleave", onPointerLeave);
		}
	};
	const detachMouseEvents = () => {
		if (swiper.el && typeof swiper.el !== "string") {
			swiper.el.removeEventListener("pointerenter", onPointerEnter);
			swiper.el.removeEventListener("pointerleave", onPointerLeave);
		}
	};
	const attachDocumentEvents = () => {
		document.addEventListener("visibilitychange", onVisibilityChange);
	};
	const detachDocumentEvents = () => {
		document.removeEventListener("visibilitychange", onVisibilityChange);
	};
	on("init", () => {
		if (getParams().enabled) {
			attachMouseEvents();
			attachDocumentEvents();
			start();
		}
	});
	on("destroy", () => {
		detachMouseEvents();
		detachDocumentEvents();
		if (swiper.autoplay.running) stop();
	});
	on("_freeModeStaticRelease", () => {
		if (pausedByTouch || pausedByInteraction) resume();
	});
	on("_freeModeNoMomentumRelease", () => {
		if (!getParams().disableOnInteraction) pause(true, true);
		else stop();
	});
	on("beforeTransitionStart", (_s, _speed, internal) => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (internal || !getParams().disableOnInteraction) pause(true, true);
		else stop();
	});
	on("sliderFirstMove", () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (getParams().disableOnInteraction) {
			stop();
			return;
		}
		isTouched = true;
		pausedByTouch = false;
		pausedByInteraction = false;
		touchStartTimeout = setTimeout(() => {
			pausedByInteraction = true;
			pausedByTouch = true;
			pause(true);
		}, 200);
	});
	on("touchEnd", () => {
		if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
		if (touchStartTimeout !== void 0) clearTimeout(touchStartTimeout);
		if (timeout !== void 0) clearTimeout(timeout);
		if (getParams().disableOnInteraction) {
			pausedByTouch = false;
			isTouched = false;
			return;
		}
		if (pausedByTouch && swiper.params.cssMode) resume();
		pausedByTouch = false;
		isTouched = false;
	});
	on("slideChange", () => {
		if (swiper.destroyed || !swiper.autoplay.running) return;
		if (swiper.autoplay.paused) {
			autoplayTimeLeft = getTotalDelay();
			autoplayDelayTotal = getTotalDelay();
		}
	});
	Object.assign(swiper.autoplay, {
		start,
		stop,
		pause,
		resume
	});
};
//#endregion
//#region src/components/layout/slider/slider.js
function initSliders() {
	if (document.querySelector("[data-fls-slider]")) {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const heroSlider = new Swiper("[data-fls-slider]", {
			modules: [
				Navigation,
				Pagination,
				EffectFade,
				Autoplay,
				Keyboard,
				A11y
			],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			speed: reduceMotion ? 0 : 800,
			loop: true,
			keyboard: {
				enabled: true,
				onlyInViewport: false,
				pageUpDown: false
			},
			effect: "fade",
			autoplay: {
				delay: 6e3,
				disableOnInteraction: false
			},
			pagination: {
				el: ".hero__pagination",
				clickable: true
			},
			navigation: {
				prevEl: ".hero__arrow--prev",
				nextEl: ".hero__arrow--next"
			},
			on: { init(swiper) {
				swiper.el.addEventListener("focusin", (e) => {
					const slide = e.target.closest(".swiper-slide");
					if (!slide) return;
					swiper.el.scrollLeft = 0;
					swiper.slideTo([...slide.parentElement.children].indexOf(slide));
				});
			} }
		});
		const pauseButton = document.querySelector("[data-fls-slider-pause]");
		const setPauseState = (playing) => {
			if (!pauseButton) return;
			pauseButton.setAttribute("aria-pressed", String(playing));
			pauseButton.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
			pauseButton.textContent = playing ? "Pause" : "Play";
		};
		if (reduceMotion) {
			heroSlider.autoplay.stop();
			setPauseState(false);
		}
		if (pauseButton) pauseButton.addEventListener("click", () => {
			if (heroSlider.autoplay.running) {
				heroSlider.autoplay.stop();
				setPauseState(false);
			} else {
				heroSlider.autoplay.start();
				setPauseState(true);
			}
		});
	}
}
window.addEventListener("load", initSliders);
//#endregion
//#region src/components/layout/reviews-slider/reviews-slider.js
function initReviewsSlider() {
	if (!document.querySelector("[data-fls-reviews-slider]")) return;
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	return new Swiper("[data-fls-reviews-slider]", {
		modules: [
			Pagination,
			Keyboard,
			A11y
		],
		observer: true,
		observeParents: true,
		slidesPerView: 3,
		spaceBetween: 23,
		speed: reduceMotion ? 0 : 800,
		loop: true,
		keyboard: {
			enabled: true,
			onlyInViewport: false,
			pageUpDown: false
		},
		pagination: {
			el: ".reviews__pages",
			clickable: true
		},
		breakpoints: {
			320: {
				slidesPerView: 1.3,
				spaceBetween: 15
			},
			480: {
				slidesPerView: 2,
				spaceBetween: 15
			},
			991: {
				slidesPerView: 3,
				spaceBetween: 23
			}
		},
		on: { init(swiper) {
			swiper.el.addEventListener("focusin", (e) => {
				const slide = e.target.closest(".swiper-slide");
				if (!slide) return;
				swiper.el.scrollLeft = 0;
				swiper.slideTo([...slide.parentElement.children].indexOf(slide));
			});
		} }
	});
}
window.addEventListener("load", initReviewsSlider);
//#endregion
//#region src/components/layout/new-slider/new-slider.js
function initNewSlider() {
	if (!document.querySelector("[data-fls-new-slider]")) return;
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	return new Swiper("[data-fls-new-slider]", {
		modules: [
			Navigation,
			Keyboard,
			A11y
		],
		observer: true,
		observeParents: true,
		slidesPerView: 4,
		spaceBetween: 38,
		speed: reduceMotion ? 0 : 800,
		loop: true,
		keyboard: {
			enabled: true,
			onlyInViewport: false,
			pageUpDown: false
		},
		navigation: {
			prevEl: ".new__arrow--left",
			nextEl: ".new__arrow--right"
		},
		breakpoints: {
			320: {
				slidesPerView: 1.3,
				spaceBetween: 15
			},
			480: {
				slidesPerView: 2,
				spaceBetween: 15
			},
			991: {
				slidesPerView: 3,
				spaceBetween: 23
			},
			1268: {
				slidesPerView: 4,
				spaceBetween: 38
			}
		},
		on: { init(swiper) {
			swiper.el.addEventListener("focusin", (e) => {
				const slide = e.target.closest(".swiper-slide");
				if (!slide) return;
				swiper.el.scrollLeft = 0;
				swiper.slideTo([...slide.parentElement.children].indexOf(slide));
			});
		} }
	});
}
window.addEventListener("load", initNewSlider);
//#endregion
