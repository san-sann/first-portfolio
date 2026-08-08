import { n as getWishlist } from "./main.min.js";
import "./footer.min.js";
/* empty css               */
import "./button2.min.js";
import "./favorite.min.js";
//#region src/components/pages/emptywishlist/emptywishlist.js
if (getWishlist().length) window.location.replace("wishlist.html");
//#endregion
