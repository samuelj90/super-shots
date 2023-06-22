import puppeteer, { Browser, Page } from 'puppeteer';
import { URL } from 'url';

class SuperShots {
  private browser: Browser | null;
  private visitedUrls: Set<string>;

  constructor() {
    this.browser = null;
    this.visitedUrls = new Set<string>();
  }

  public async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({ headless : "new"});
  }

  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  public async crawlAndScreenshot(url: string): Promise<void> {
    if (!this.browser) {
      throw new Error('Browser instance is not initialized. Call initialize() first.');
    }

    const page = await this.browser.newPage();
    const domain = new URL(url).hostname;

    await this.crawl(url, page, domain);

    await page.close();
  }

  private async crawl(url: string, page: Page, domain: string): Promise<void> {
    if (this.visitedUrls.has(url)) return;

    this.visitedUrls.add(url);
    console.log('Crawling:', url);

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `screenshot-${Date.now()}.png` });

    const links = await page.$$eval('a', (anchors) => anchors.map((a) => a.href));

    for (const link of links) {
      try {
        const linkUrl = new URL(link);
        if (linkUrl.hostname === domain) {
          await this.crawl(link, page, domain);
        }
      } catch (error) {
        console.error('Invalid URL:', link);
      }
    }
  }
}

export default SuperShots;

// Command-line usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Please provide a URL to crawl.');
    process.exit(1);
  }

  const url = args[0];
  const superShots = new SuperShots();

  (async () => {
    try {
      await superShots.initialize();
      await superShots.crawlAndScreenshot(url);
      await superShots.close();
      console.log('Crawl and screenshot complete.');
    } catch (error) {
      console.error('Error:', error);
    }
  })();
}
