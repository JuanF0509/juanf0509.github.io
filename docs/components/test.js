const {PuppeteerWebBaseLoader} = require('langchain/document_loaders/web/puppeteer');


export async function test5() {
    const loader = new PuppeteerWebBaseLoader("https://juanf0509.github.io");
    const docs = await loader.load();
    return docs;
}
