import { Router } from "express";
import { getChef } from "../controllers/ChefDetails.js";
const croutes = Router();

croutes.get("/", getChef);

export default croutes;
