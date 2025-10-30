import { Router } from "express";
import { getTable, getTableById, postTable } from "../controllers/TableDetails.js";
const troute=Router();

troute.get('/',getTable);
troute.get('/:id',getTableById);
troute.post('/',postTable);

export default troute;