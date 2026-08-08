import { l as getCart } from "./main.min.js";
import "./footer.min.js";
import "./button2.min.js";
//#region src/components/pages/emptycart/emptycart.js
if (getCart().length) window.location.replace("cart.html");
//#endregion
