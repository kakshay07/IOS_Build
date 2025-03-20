
import puppeteer, { Browser, LowerCasePaperFormat, PDFMargin } from 'puppeteer';
import logger from './logger'; 
import async from 'async';

// Configuration
const MAX_CONCURRENT_PAGES = 5;
const BROWSER_RESTART_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds

// Global browser instance
let browser: Browser | null = null;
let lastRestartTime = Date.now();

// Initialize browser or restart if necessary
async function initializeOrRestartBrowser() {
    const now = Date.now();
    if (!browser || now - lastRestartTime > BROWSER_RESTART_INTERVAL) {
        logger.debug('Launching puppeteer browser or restarting due to interval');
        await restartBrowser();
        lastRestartTime = now;
    }
}

// Function to initialize or restart the browser
async function restartBrowser() {
    if (browser) {
        logger.debug('Closing existing browser');
        await browser.close();
        logger.debug('Browser closed');
    }
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    logger.debug('Puppeteer browser launched');
}

// Function to generate PDF
async function generatePDF(htmlContent: string, options : pdfOptions = new pdfOptions()): Promise<Buffer> {
    logger.debug('Starting PDF generation');
    
    let page;
    try {
        await initializeOrRestartBrowser();
        if (!browser) {
            throw new Error('Failed to launch browser');
        }
        page = await browser.newPage();
        logger.debug('New page created');

        await page.setContent(htmlContent, { waitUntil: 'load' });
        logger.debug('HTML content set');

        await page.emulateMediaType('screen');
        logger.debug('Media type set to screen');

        const pdfUint8Array  = await page.pdf({
            ...new pdfOptions(),
            ...options
        });
        logger.debug('PDF generated successfully');
        const pdfBuffer = Buffer.from(pdfUint8Array);
        return pdfBuffer;
    } catch (error) {
        logger.error('Error generating PDF:', error);
        throw error;
    } finally {
        if (page) {
            await page.close();
            logger.debug('Page closed');
        }
    }
}

// Define the type for the task object
interface QueueTask {
    htmlContent: string;
    options ?: pdfOptions;
    resolve: (value: Buffer) => void;
    reject: (reason?: any) => void;
}

// Queue to manage concurrent PDF generation
const queue = async.queue(async (task: QueueTask, callback: async.ErrorCallback<Error>) => {
    try {
        const pdfBuffer = await generatePDF(task.htmlContent, task.options);
        task.resolve(pdfBuffer);
    } catch (error) {
        task.reject(error);
    }
    callback();
}, MAX_CONCURRENT_PAGES);

// Function to add PDF generation request to the queue
export function queuePDFGeneration(htmlContent: string, options?: pdfOptions) {
    return new Promise((resolve, reject) => {
        queue.push({ htmlContent, options, resolve, reject });
    });
}

// Close the browser instance on process exit
process.on('exit', async () => {
    if (browser) {
        await browser.close();
        logger.debug('Browser closed on process exit');
    }
});


class pdfOptions {
    format ?: | Uppercase<LowerCasePaperFormat> | Capitalize<LowerCasePaperFormat> | LowerCasePaperFormat = 'A4';
    landscape ?: boolean = false;
    margin ?: PDFMargin | undefined = undefined;
    path ?: string | undefined = undefined;
    printBackground ?: boolean = true;
}