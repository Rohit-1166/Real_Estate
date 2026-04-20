const puppeteer = require('puppeteer');

(async () => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('pageerror', err => {
            console.error('CRASH_FOUND:', err.message, err.stack);
        });
        page.on('console', msg => {
            if (msg.type() === 'error') console.error('CONSOLE_ERROR:', msg.text());
        });
        
        console.log('Navigating...');
        await page.goto('http://localhost:5173/login');
        await page.evaluate(() => {
            localStorage.setItem('token', 'fake');
            localStorage.setItem('user', JSON.stringify({ name: 'Admin', type: 'admin' }));
        });
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
