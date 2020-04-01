#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-core');

program
    .name('./getCFcookie.js')
    .usage('-u <url> -a <user_agent> [-p <path>] [-s]')
    .option('-u, --url <site_url>', 'url to visit')
    .option('-a, --agent <user_agent>', 'browser user agent')
    .option('-p, --path <binary_path>', 'optional, path to chrome/chromium binary\ndefault "/usr/bin/chromium"')
    .option('-s, --show', 'optional, show browser\ndefault not show');

program.parse(process.argv);

if (program.url === undefined) {
    console.log("[ERROR] -u <url> is undefined!");
    return 1;
}

if (program.agent === undefined) {
    console.log("[ERROR] -a <user_agent> is undefined!");
    return 1;
}

const cPath = (program.path === undefined) ? '/usr/bin/chromium' : program.path;
const hMode = (program.show === undefined) ? true : false;

(async() => {
    const browser = await puppeteer.launch({executablePath: cPath, headless: hMode});
    const page = await browser.newPage();
    await page.setUserAgent(program.agent);
    await page.goto(program.url, {timeout: 30000, waitUntil: 'domcontentloaded'});
    await page.waitForNavigation();
    const cookie = await page.cookies();
    console.log(JSON.stringify(cookie));
    await browser.close()
})();
