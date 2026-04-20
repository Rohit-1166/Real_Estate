const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');

(async () => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('pageerror', err => {
            console.error('CRASH_FOUND:', err.message, err.stack);
        });
        
        console.log('Navigating...');
        await page.goto('http://localhost:5173/login');
        const token = jwt.sign({ id: 1, role: 'Admin' }, 'secret');
        await page.evaluate((token) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin', type: 'Admin', role: 'admin' }));
        }, token);
        await page.goto('http://localhost:5173/admin');
        await new Promise(r => setTimeout(r, 2000));
        
        console.log('Clicking about...');
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('System Core'));
            if (btn) btn.click();
        });
        
        await new Promise(r => setTimeout(r, 2000));
        console.log('Done.');
    } catch(e){
        console.log('Script err:', e);
    } finally {
        if (browser) await browser.close();
    }
})();
