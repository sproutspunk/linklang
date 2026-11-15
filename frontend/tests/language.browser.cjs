// Run with Playwright installed externally: PLAYWRIGHT_MODULE=/path/to/playwright node frontend/tests/language.browser.cjs
// Uses API fixtures for authenticated views; no production API writes. Start the Vite dev server first.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
 const context = await browser.newContext();
 const page = await context.newPage();
 const errors=[];page.on('pageerror', e=>errors.push(e.message));
 const base=process.env.CHECK_URL || 'http://127.0.0.1:5173';
 const routes=['/','/login','/register','/forgot-password','/privacy','/terms','/support','/payment-preview'];
 async function switchTo(lang) { await page.locator('nav').getByRole('button',{name:lang,exact:true}).click(); await page.waitForFunction(l=>document.documentElement.lang===l,lang.toLowerCase()); }
 for(const route of routes){
  await page.goto(base+route); await switchTo('EN');
  assert.match(await page.locator('nav').innerText(), /Contact/);
  assert.doesNotMatch(await page.locator('main').first().innerText(), /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/, 'Polish text on EN '+route);
  assert.equal(await page.evaluate(()=>localStorage.getItem('linklang_lang')),'EN');
  await page.reload(); await page.waitForFunction(()=>document.documentElement.lang==='en');
  await switchTo('PL'); assert.match(await page.locator('nav').innerText(), /Kontakt/);
  console.log('PASS public route, switch and reload',route);
 }
 // Cookie banner is mounted throughout navigation and must react immediately.
 await page.goto(base+'/');await switchTo('EN');assert.match(await page.locator('body').innerText(), /Cookie Settings/);
 await switchTo('PL');assert.match(await page.locator('body').innerText(), /Akceptuj/);
 // Switch from the legal-page controls, which previously duplicated state.
 await page.goto(base+'/privacy'); await page.getByRole('button',{name:'EN',exact:true}).last().click();
 assert.match(await page.locator('nav').innerText(),/Contact/);
 // Changes from a second tab and clearing language storage.
 const tab = await context.newPage();await tab.goto(base+'/');await tab.locator('nav').getByRole('button',{name:'PL',exact:true}).click();await page.waitForFunction(()=>document.documentElement.lang==='pl');
 await tab.evaluate(()=>localStorage.removeItem('linklang_lang'));await page.waitForFunction(()=>document.documentElement.lang==='pl');
 console.log('PASS cookies, page switches, cross-tab sync');
 // Fixtures avoid any writes to production services.
 const order={id:42,type:'TRANSLATION',status:'NEW',sourceLang:'PL',targetLang:'EN',context:'medical',createdAt:'2026-08-12T10:00:00Z',deadline:'2026-09-24',user:{name:'Test'},quotes:[],documents:[],messages:[],healthConsentStatus:'NOT_GIVEN',healthConsentEvents:[]};
 await context.route('**/api/**', async route=> {
  const path = new URL(route.request().url()).pathname;
  if(path==='/api/login') return route.fulfill({status:400,json:{error:'Invalid credentials'}});
  let data=path==='/api/orders'?[order]:path==='/api/orders/42'?order:path==='/api/admin/summary'?{revenue:100,totalOrders:1}:path==='/api/health-consent/text'?{consentText:new URL(route.request().url()).searchParams.get('language')==='EN'?'Health consent':'Zgoda medyczna'}:[];
  return route.fulfill({json:data});
 });
 await page.goto(base+'/login');await switchTo('PL');await page.locator('input[type=email]').fill('test@example.com');await page.locator('input[type=password]').fill('test');await page.locator('form button[type=submit]').click();await page.getByText('Nieprawidłowy adres e-mail lub hasło.',{exact:true}).waitFor();await switchTo('EN');await page.getByText('Invalid credentials',{exact:true}).waitFor();console.log('PASS existing error switches language');
 for(const role of ['CLIENT','ADMIN']) {
  await page.evaluate(role=>{localStorage.setItem('linklang_user',JSON.stringify({id:1,email:'test@example.com',role}));localStorage.setItem('linklang_token','test-fixture');},role);
  for(const route of role==='CLIENT'?['/portal','/portal/new','/portal/42']:['/admin','/portal/42']) {
   await page.goto(base+route);await switchTo('EN');await page.waitForTimeout(150);
   assert.doesNotMatch(await page.locator('main').innerText(),/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/,role+' EN '+route);
   await switchTo('PL');assert.match(await page.locator('main').innerText(),/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/,role+' PL '+route);
   console.log('PASS fixture route',role,route);
  }
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
