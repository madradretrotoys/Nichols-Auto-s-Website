import { test, expect } from '@playwright/test';

const routes=['/','/about/','/services/','/classic-cars/','/repair-stories/','/reviews/','/contact/','/privacy/','/services/brakes/','/services/diagnostics/','/services/maintenance/','/services/steering-suspension/','/services/heating-cooling/','/services/transmission/','/guides/understanding-brake-vibration/','/guides/shocks-and-struts/','/guides/check-engine-light/'];

test('every page loads with working local links and image assets',async({page,request})=>{
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 const targets=new Set<string>();
 for(const route of routes){
  const response=await page.goto(route);
  expect(response?.status(),route).toBe(200);
  await expect(page.locator('main h1'),route).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]'),route).toHaveAttribute('content','noindex, nofollow');
  for(const image of await page.locator('img').all()){
   await image.scrollIntoViewIfNeeded();
   await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0),{message:route}).toBe(true);
  }
  const links=await page.locator('a[href^="/"]').evaluateAll(anchors=>anchors.map(a=>a.getAttribute('href')!));
  links.forEach(link=>targets.add(link));
 }
 for(const target of targets) expect((await request.get(target)).status(),target).toBe(200);
 expect(errors).toEqual([]);
});

test('service navigation reaches useful detail and the contact page',async({page})=>{
 await page.goto('/');
 await page.getByRole('link',{name:'Brakes & stopping power'}).click();
 await expect(page).toHaveURL(/\/services\/brakes\//);
 await expect(page.getByRole('heading',{name:'Here to help with'})).toBeVisible();
 await page.getByRole('link',{name:'Talk about your vehicle'}).click();
 await expect(page.getByRole('link',{name:'303-421-1414',exact:true}).first()).toHaveAttribute('href','tel:+13034211414');
});

test('mobile menu opens, navigates, and closes using Escape',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 const menu=page.getByRole('button',{name:'Menu'});
 await expect(menu).toHaveAttribute('aria-expanded','false');
 await menu.click();
 await expect(menu).toHaveAttribute('aria-expanded','true');
 await page.keyboard.press('Escape');
 await expect(menu).toHaveAttribute('aria-expanded','false');
 await menu.click();
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Classic cars'}).click();
 await expect(page).toHaveURL(/\/classic-cars\//);
});

test('contact requires details and prepares an encoded email without a website submission',async({page})=>{
 await page.goto('/contact/');
 await page.getByRole('button',{name:'Prepare my email'}).click();
 expect(await page.locator('#contact-form').evaluate((form:HTMLFormElement)=>form.checkValidity())).toBe(false);
 await expect(page.locator('#form-status')).toBeEmpty();
 await page.getByLabel('Your name',{exact:true}).fill('Test & Neighbor');
 await page.getByLabel('Phone number').fill('303-555-0100');
 await page.getByLabel('Your email',{exact:true}).fill('neighbor@example.com');
 await page.getByLabel('Vehicle year, make & model').fill('2015 Subaru Outback');
 await page.getByLabel('What can we help with?').fill('A noise & vibration — what is the next step?');
 const submissions:string[]=[];
 page.on('request',request=>{if(request.method()==='POST') submissions.push(request.url());});
 await page.getByRole('button',{name:'Prepare my email'}).click();
 await expect(page.locator('#form-status')).toContainText('Nothing has been sent');
 const href=await page.locator('#email-fallback').getAttribute('href');
 expect(href).toMatch(/^mailto:nicholsauto2@gmail.com\?/);
 const url=new URL(href!);
 expect(url.searchParams.get('body')).toContain('Test & Neighbor');
 expect(url.searchParams.get('body')).toContain('A noise & vibration');
 expect(submissions).toEqual([]);
});

test('preview indexing controls and sitemap are valid',async({request})=>{
 const robots=await request.get('/robots.txt');
 expect(await robots.text()).toContain('Disallow: /');
 const sitemap=await request.get('/sitemap.xml');
 expect(sitemap.headers()['content-type']).toMatch(/(?:application|text)\/xml/);
 expect(await sitemap.text()).toContain('https://nicholsautorepair.net/services/brakes/');
 expect((await request.get('/this-page-does-not-exist/')).status()).toBe(404);
});

test('desktop and small-screen layouts fit without horizontal scrolling',async({page})=>{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/contact/','/classic-cars/','/services/','/services/steering-suspension/']){
   await page.goto(route);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${route} at ${width}px`).toBeLessThanOrEqual(width);
  }
 }
});
