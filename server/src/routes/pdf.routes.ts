import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { pdfModel } from "../models/pdf.models";

export const pdfRouter = Router();

pdfRouter.get('/gatePass' , asyncHandler(async (req,res)=> {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="demo.pdf"`);
    res.send(await pdfModel.getGatePass());
}))

export default pdfRouter;
