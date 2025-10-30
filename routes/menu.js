import { Router } from "express";
import {
  getMenu,
  getMenuCat,
  getMenuLazy,
  getsearch,
} from "../controllers/MenuItem.js";
const mroute = Router();

mroute.get("/", getMenu);
mroute.get("/lazy", getMenuLazy);
mroute.get("/category", getMenuCat);
mroute.get("/search", getsearch);

export default mroute;
