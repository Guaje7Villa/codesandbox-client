import puppeteer from 'puppeteer';

const SANDBOXES = [
  'new',
  'preact',
  { id: 'vue', root: '#app' },
  'svelte',
  'react-ts',
  'github/reactjs/redux/tree/master/examples/todomvc',
  'jvlrl98xw3',
  'vVoQVk78',
  'github/faceyspacey/redux-first-router-codesandbox/tree/master',
  'mZRjw05yp',
  'pk1qjqpw67',
  'X6npLXPRW',
  { id: 'o29j95wx9', root: '#app' },
  { id: 'k3q1zjjml5', root: '#app' },
];

SANDBOXES.forEach(sandbox => {
  const id = sandbox.id || sandbox;
  const root = sandbox.root || '#root';
  let browser = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  describe('sandboxes', () => {
    afterAll(() => {
      browser.close();
    });

    it.concurrent(
      `loads the sandbox with id '${id}'`,
      async () => {
        browser = await browser;
        const page = await browser.newPage();
        await page.goto('http://localhost:3001/#' + id);
        await page.waitForSelector(root);
        await page.waitFor(2000);

        // const html = await page.evaluate(() => document.body.innerHTML);
        // expect(html).toMatchSnapshot(id.split('/').join('-'));

        const screenshot = await page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
          customDiffConfig: {
            threshold: 0.01, // 1% threshold
          },
          customSnapshotIdentifier: id.split('/').join('-'),
        });

        page.close();
      },
      1000 * 60 * 10 // 10 minutes for all tests in total
    );
  });
});
