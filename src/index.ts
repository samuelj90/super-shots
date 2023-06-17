const puppeteer = require('puppeteer');
const { URL } = require('url');

async function crawlAndScreenshot(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Extract the domain from the URL
  const domain = new URL(url).hostname;
  
  const visitedUrls = new Set();
  
  async function crawl(url) {
    if (visitedUrls.has(url)) return;
    
    visitedUrls.add(url);
    console.log('Crawling:', url);
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `screenshot-${Date.now()}.png` });
    
    const links = await page.$$eval('a', (anchors) =>
      anchors.map((a) => a.href)
    );
    
    for (const link of links) {
      try {
        const linkUrl = new URL(link);
        if (linkUrl.hostname === domain) {
          await crawl(link);
        }
      } catch (error) {
        console.error('Invalid URL:', link);
      }
    }
  }
  
  await crawl(url);
  
  await browser.close();
}

// Usage: node crawl-screenshot.js <url>
const url = process.argv[2];
if (!url) {
  console.error('Please provide a URL to crawl.');
  process.exit(1);
}

crawlAndScreenshot(url)
  .then(() => console.log('Crawl and screenshot complete.'))
  .catch((error) => console.error('Error:', error));
