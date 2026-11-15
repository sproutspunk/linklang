// Run against a production build served by Vite preview. Google Analytics requests are intercepted.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
async function check(saved,action,expected){const context=await browser.newContext();let count=0;await context.route('https://www.googletagmanager.com/**',r=>{count++;r.fulfill({body:'',contentType:'application/javascript'});});
if(saved)await context.addInitScript(value=>{for(const [k,v]of Object.entries(value))localStorage.setItem(k,v);},saved);
const page=await context.newPage();await page.goto(process.env.CHECK_URL || 'http://127.0.0.1:4173');await page.locator('nav').waitFor();
if(action==='accept'){assert.equal(count,0);await page.getByRole('button',{name:'Akceptuj',exact:true}).click();}
if(action==='reject')await page.getByRole('button',{name:'Odrzuć',exact:true}).click();
if(action==='marketing'){await page.getByRole('button',{name:'Ustawienia',exact:true}).click();await page.getByLabel('Cookies Marketingowe').check();await page.getByRole('button',{name:'Zapisz Preferencje',exact:true}).click();}
if(action==='analytics'){await page.getByRole('button',{name:'Ustawienia',exact:true}).click();await page.getByLabel('Cookies Analityczne').check();await page.getByRole('button',{name:'Zapisz Preferencje',exact:true}).click();}
await page.waitForTimeout(300);assert.equal(count,expected);assert.equal(await page.locator('#linklang-analytics').count(),expected);
if(expected){const queue=await page.evaluate(()=>window.dataLayer.map(x=>Array.from(x)));assert.equal(queue.filter(x=>x[0]==='config').length,1);assert.equal(queue.filter(x=>x[0]==='js').length,1);}
console.log('PASS analytics',action||JSON.stringify(saved),'requests',count);await context.close();}
await check(null,null,0);await check(null,'reject',0);await check(null,'accept',1);await check(null,'marketing',0);await check(null,'analytics',1);
await check({linklang_cookies_accepted:'true',linklang_cookie_preferences:JSON.stringify({analytics:true})},null,1);
await check({linklang_cookies_accepted:'false',linklang_cookie_preferences:JSON.stringify({analytics:false})},null,0);
await check({linklang_cookies_accepted:'true',linklang_cookie_preferences:'invalid'},null,0);
await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
