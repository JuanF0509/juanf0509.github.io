const {PuppeteerWebBaseLoader} = require('langchain/document_loaders/web/puppeteer');
const { OpenAI } = require("langchain/llms/openai");

const model = new OpenAI({
    openAIApiKey: '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',
    streaming: true,
    callbacks: [
        {
            handleLLMNewToken(token) {
                process.stdout.write(token)
            }
        }
    ]
})

async function idk() {
    let dat = await model.call('Dime 5 colores que comiencen con "B')
    console.log(dat)
}

idk()