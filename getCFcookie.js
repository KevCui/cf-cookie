#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

program
  .name('./getCFcookie.js')
  .usage('-u <url> -a <user_agent> [-p <path>] [-s]')
  .option('-u, --url <site_url>', 'url to visit')
  .option('-a, --agent <user_agent>', 'browser user agent')
  .option('-p, --path <binary_path>', 'optional, path to chrome/chromium binary\ndefault "/usr/bin/chromium"')
  .option('-s, --show', 'optional, show browser\ndefault not show');

program.parse(process.argv);
const options = program.opts();

if (options.url === undefined) {
  console.log("[ERROR] -u <url> is undefined!");
  process.exit(1);
}

if (options.agent === undefined) {
  console.log("[ERROR] -a <user_agent> is undefined!");
  process.exit(1);
}

const cPath = (options.path === undefined) ? '/usr/bin/chromium' : options.path;
const hMode = (options.show === undefined) ? true : false;

(async() => {
  const browser = await puppeteer.launch({executablePath: cPath, headless: hMode});
  const page = await browser.newPage();
  await page.setUserAgent(options.agent);
  await page.goto(options.url, {timeout: 60000, waitUntil: 'domcontentloaded'});
  await page.waitForNavigation();
  const cookie = await page.cookies();
  console.log(JSON.stringify(cookie));
  await browser.close();
})();
