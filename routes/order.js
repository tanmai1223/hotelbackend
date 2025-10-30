import {Router} from "express";
import { getOrder, orderSummary, putOrder, putOrderById, totals, weeklyRevenue } from "../controllers/OrderDetails.js";
const oroutes=Router();

oroutes.get('/',getOrder);
oroutes.post('/',putOrder);
oroutes.put("/:id",putOrderById )
oroutes.get('/total',totals)
oroutes.get('/summary',orderSummary);
oroutes.get("/revenue", weeklyRevenue);


export default oroutes;