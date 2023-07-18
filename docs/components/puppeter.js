const {PuppeteerWebBaseLoader} = require('langchain/document_loaders/web/puppeteer');

/**
 * Loader uses `page.evaluate(() => document.body.innerHTML)`
 * as default evaluate function
 **/
const loader = new PuppeteerWebBaseLoader("https://www.example.com/", {
    // launchOptions: {
    //     headless: false,
    // },
    // gotoOptions: {
    //     waitUntil: "domcontentloaded",
    // },
    /** Pass custom evaluate, in this case you get page and browser instances */
    async evaluate(page, browser) {
        return await page.evaluate(() => document.body.innerHTML)
        // return await page.evaluate(() => {
        //     return document.querySelector('h1').textContent
        //     // const pex = document.querySelectorAll('li')
        //     // const array = [...pex].map((pex) => {
        //     //     pex.innerHTML
        //     // });
        //     // return array
        // })
    },
});


async function yep() {
    const docs = await loader.load();
    console.log(docs[0].pageContent)
}

yep()