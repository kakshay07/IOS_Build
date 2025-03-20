import { queuePDFGeneration } from "../utils/puppeteer";

export class pdfModel {
    static async getGatePass(){
        const htmlContentString = 'Welcome to PDF'
        const pdfBuffer = await queuePDFGeneration(htmlContentString, {
            // path : `uploads/pdf/example.pdf`,
            // format : 'A4',
            // landscape : true
        });
        return pdfBuffer;
    }
}

