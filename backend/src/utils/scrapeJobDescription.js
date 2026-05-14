import * as cheerio from 'cheerio';

export async function scrapeJobPosting(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobTracker/1.0)' },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Failed to fetch URL: ${response.status}`);

  const html = await response.text();
  const $ = cheerio.load(html);
  $(
    'script, style, nav, header, footer, aside, noscript, [role="banner"], [role="navigation"], [role="complementary"], [aria-hidden="true"]'
  ).remove();

  const text = $('body').text().replace(/\s+/g, ' ').trim();
  return text.slice(0, 6000);
}
