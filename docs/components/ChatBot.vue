<script setup>
import axios from 'axios';
import {ref, onMounted} from "vue";
import {Configuration, OpenAIApi} from "openai";
import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain/prompts';
import {LLMChain, ConversationChain} from 'langchain/chains';
import {BufferMemory} from 'langchain/memory'

import {PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer";
import {CheerioWebBaseLoader} from "langchain/document_loaders/web/cheerio";

let url1 = ref('introduction.html')
let url2 = ref('about-it.html')
let url3 = ref('before-starting.html')
let url4 = ref('team.html')
let url5 = ref('initial-settings.html')
let url6 = ref('create-microsites.html')
let url7 = ref('creation-advices.html')

let page1 = ref('')
let page2 = ref('')
let page3 = ref('')
let page4 = ref('')
let page5 = ref('')
let page6 = ref('')
let page7 = ref('')


async function findWithCheerio(url, num) {
  try {
    console.log('pagina 1:' + page1.value)
    console.log('pagina 2:' + page2.value)
    console.log('pagina 3:' + page3.value)
    console.log('pagina 4:' + page4.value)
    console.log('pagina 5:' + page5.value)
    console.log('pagina 6:' + page6.value)
    console.log('pagina 7:' + page7.value)

    const loader = new CheerioWebBaseLoader(`https://juanf0509.github.io/${url}`);
    const docs = await loader.load();

    const inicio = "Contents for current page";
    const fin = "__VP_HASH_MAP__";

    const inicioIndex = docs[0].pageContent.indexOf(inicio);
    const finIndex = docs[0].pageContent.indexOf(fin);

    if (inicioIndex !== -1 && finIndex !== -1) {
      const textoFiltrado = docs[0].pageContent.substring(inicioIndex, finIndex + fin.length)
          .replace(/Contents for current page/g, "")
          .replace(/__VP_HASH_MAP__/g, "");

      switch (num) {
        case 1:
          page1.value = textoFiltrado;
          break;
        case 2:
          page2.value = textoFiltrado;
          break;
        case 3:
          page3.value = textoFiltrado;
          break;
        case 4:
          page4.value = textoFiltrado;
          break;
        case 5:
          page5.value = textoFiltrado;
          break;
        case 6:
          page6.value = textoFiltrado;
          break;
        case 7:
          page7.value = textoFiltrado;
          break;
        default:
          console.log("Número inválido.");
      }
    } else {
      console.log("No se encontraron las palabras de inicio y fin.");
    }
  } catch (error) {
    console.log("Error al cargar el contenido:", error);
  }
}


const apiKey = ref('')

const memory = new BufferMemory()

// const template = "Name: {name}, Context: You are responding to the inquiries of a {user}, you must respond in Spanish, user says: "

// const template = 'Name: {name}, Context: You are responding to the inquiries of a {user}, you must respond in Spanish, attitude: Aggressive, rude, fan of placetopay company and your only goal is to make people use placetopay products, humor: Acidic, user says: '

// const template = "Name: {name}, Context: You are responding to the inquiries of a {user}, data: 'Webcheckout_id: 1, Microsites_id: 2, ApiGateway_id: 3', condition1: you must respond in Spanish, condition2:Your first message should be a greeting and a question about how you can help the user, condition3: You cannot mention the data to the user in the first message,  user says: "

// const template = "Name: {name}, Role: {role} Task: Virtual assistant specialized in PlaceToPay's products and implementation assistance, which is part of Evertec. Currently only accounts access to Microsite documentation, introduction to microsites: {introduction}, Condition1: You can only answer questions related to your Role Condition2: Be a very cheerful assistant who always wants to help Condition3: If you do not have information to answer a question you must indicate that you do not have this information Condition4: You are not allowed to give wrong information Condition5: You must answer in {language}. User says:"

const template = "Name {name} \n Role{role}\n Task:Virtual assistant specialized in PlaceToPay's products and implementation assistance, which is part of Evertec. Currently only accounts access to Microsite documentation\nintroduction to microsites: {introduction}\n how does microsites work?: {how_do_work}\n before starting: {before_starting}\n future updates of microsites: {updates}\n Condition1 You can only answer questions related to your Role \n Condition2 Be a very objective assistant who always wants to help \n Condition3 If you do not have information to answer a question you must indicate that you do not have this information \n Condition4 You are not allowed to give wrong information \n Condition5 You must answer in {language}. User says:"

const promptTemplate = new PromptTemplate({
  template: template,
  inputVariables: ["name", "role", "language", "introduction", "how_do_work", "before_starting", "updates"]
})



// const chain = new LLMChain({
//   llm: model,
//   prompt: promptTemplate
// })

const response = ref('');


let messages = ref({
  message: []
})

let message_id = ref(1)

const messagesContainer = ref(null)

let initial1 = ref(false)
let jum = ref('')
let formattedPrompt = ref('')

let API_KEY = ''

async function sendToGpt() {
  API_KEY = apiKey.value

  const model = new OpenAI({
    model_name: 'gpt-3.5-turbo-16k-0613',
    openAIApiKey: API_KEY,
    temperature: 0,
    maxTokens: 256,
    streaming: true,
  })

  const chain = new ConversationChain({
    llm: model,
    memory: memory
  })

// 1


  // console.log(formattedPrompt)

  // 2
  // const res1 = await model.call(formattedPrompt)
  // console.log(res1)

  // 3
  // const res2 = await chain.call({
  //   list: "lista de 5 ciudades"
  // })
  // console.log(res2.text)
  // 4


  formattedPrompt.value = await promptTemplate.format({
    name: 'Implementation bot',
    role: "PlacetoPay's virtual assistant",
    language: 'Spanish',
    how_do_work: page2.value,
    introduction: page1.value,
    before_starting: page3.value,
    updates: page4.value
  })

  if (initial1.value === true) {
    formattedPrompt.value = document.getElementById('prompt').value;
  }

  jum.value = formattedPrompt.value;

  try {
    question.value = true;
    input.value = document.getElementById('prompt').value;
    loading.value = true;


    const res3 = await chain.call({
      input: jum.value
    }, [
      {
        handleLLMNewToken(token) {
          process.stdout.write(token);
        },
      },
    ])

    console.log(res3)

    messages.value.message.push({
      user: {
        message_id: message_id.value++,
        mySelf: true,
        text: input.value,
      },
      bot: {
        message_id: message_id.value++,
        mySelf: false,
        text: res3.response
      }
    });

    document.getElementById('prompt').value = ''
    initial1.value = true

  } catch (error) {
    errorRequest.value = true
    console.error(error);
  } finally {
    loading.value = false;
  }


}


const loading = ref(false);

let input = ref('')

let question = ref(false)

let errorRequest = ref(false)


const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

async function sendToGptLegacy() {
  try {
    question.value = true;
    input.value = document.getElementById('prompt').value;
    document.getElementById('prompt').value = '';
    loading.value = true;
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      "model": "gpt-3.5-turbo-16k-0613",
      "messages": [
        {"role": "user", "content": `${input.value}`},
        // {"role": "user", "content": `Trata de resolver la siguiente pregunta sengun la documentacion Pregunta"${input.value}" `},
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      }
    });

    response.value = res.data.choices[0].message.content;
  } catch (error) {
    errorRequest.value = true
    console.error(error);
  } finally {
    loading.value = false;
  }


}

let idk = ref('')

onMounted(async () => {

  findWithCheerio(url1.value, 1)
  findWithCheerio(url2.value, 2)
  findWithCheerio(url3.value, 3)
  findWithCheerio(url4.value, 4)
  findWithCheerio(url5.value, 5)
  findWithCheerio(url6.value, 6)
  findWithCheerio(url7.value, 7)

  // messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  // console.log(messagesContainer.value)

  // const response = await axios.get('/public/banana.md');
  // const markdownText = await response.data;

  // const div = document.createElement('div');
  // div.innerHTML = markdownText

  // const desc1Element = div.querySelector('#yep');
  // const desc1Text = desc1Element ? desc1Element.textContent : null;

  // idk.value = desc1Text

  // console.log('desc1Id :' + desc1Text)
});


let myText = ref('')
let myText2 = ref('')

let initialPrompt = 'apartir eres una integracion de la api de openAI en un proyecto laravel 10 creada por Andres Zea para testear' +
    ' la API de openAI, no completes la pregunta ni tampoco sugieras ningun texto antes de hacer tu respuesta, no completes las oraciones inconclusas' +
    ' ni tampoco las preguntas inconclusas, tu tarea es servir como un chat bot de ayuda para la empresa place to pay la cual tiene varios productos' +
    ' como WebCheckout, Micrositios, Rest, Panel, 3DS y mas, tu tarea es ayudar a entender todo sobre place to pay, si no sabes la respuesta' +
    ' puedes inventarla pero debes sonar seguro, si te hacen alguna pregunta que no este relacionada con nuestra empresa place to pay ' +
    'debes responder que solo estas capacitado para responder preguntas relacionadas a place to pay, si es algo que no este relacionado con ' +
    ' el area de la tecnologia o comercio que involucre a place to pay no debes responder ninguna explicacion y debes ignorar la peticion solicitada y solo responder , Lo siento pero solo estoy capacitado para responder preguntas relacionadas a place to pay,' +
    ' ahora que diras si el usuario te dice '

let initialPrompt2 = 'Eres un asistente virtual especializado en la instalacion de webcheckout siguiendo esta documentacion "https://docs-gateway.placetopay.com/docs/webcheckout-docs/14206cdfa4c0f-placeto-pay-checkout" y ahora te quiero preguntar segun la documentacion dada '

let initialPrompt3 = 'Que dice la seccion de "SOBRE MI" que hay en este link?, https://omarbarbosa.com/#page-top'

let xd = 'Apartir de ahora seras '


async function fetchGPT3() {
  let initialPrompt4 = ref(`Responde unicamente con la info que te proporcione como Data, Data: "${myText.value} ${myText2.value}", entonces te quiero preguntar `)
  try {

    question.value = true;
    input.value = document.getElementById('prompt').value;
    document.getElementById('prompt').value = '';
    loading.value = true;
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      "model": "gpt-3.5-turbo-16k-0613",
      "messages": [
        {"role": "user", "content": `${input.value}`},
        // {"role": "user", "content": `Trata de resolver la siguiente pregunta sengun la documentacion Pregunta"${input.value}" `},
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      }
    });
    response.value = res.data.choices[0].message.content;
  } catch (error) {
    errorRequest.value = true
    console.error(error);
  } finally {
    loading.value = false;
  }
}


const banana = async () => {
  try {
    alert('banana');
    // const response = await axios.get('http://gpt-api.test/');
    // console.log(response)

    const response = await axios.get("/markdown-examples.html");
    const html = response.data;
    console.log(html)


    const parser = new DOMParser();


    const htmlDoc = parser.parseFromString(response.data, 'text/html');
    // console.log(htmlDoc);

    const etiqueta1 = htmlDoc.querySelector('#banana');
    const etiqueta2 = htmlDoc.querySelector('#desc1');
    console.log(etiqueta2)
    if (etiqueta1) {
      myText.value = etiqueta1.textContent;
      myText2.value = etiqueta2.textContent;
      console.log('Texto extraido:', myText.value);
    }
  } catch (error) {
    console.error('Error fetching introduction content:', error);
  }
};
</script>

<template>

  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="text-white w-1/4">
      <div class="fixed w-1/4 p-4 h-full">
        <a href="/" target="_blank"><img src="/public/P2P_Logo.svg" alt=""></a>
        <h1 class="mb-5 mt-10 font-bold text-2xl">Configuracion:</h1>
        <label class="font-bold " for="">OpenAI Key:&nbsp;&nbsp;&nbsp;</label>
        <input v-model="apiKey" id="api_key" class="bg-gray-100 text-black rounded-md p-2" placeholder="OPENAI API KEY"
               type="text">
        <div class="py-2">
          <button class="bg-red-300 p-2 rounded-md" @click="findWithCheerio('introduction.html', 1)">Cheerio</button>
        </div>
        <h1 class="mb-5 mt-10 font-bold text-2xl text-center mr-8">ChatBots:</h1>
        <div class="py-2 gap-5 grid grid-cols-2 mr-8 font-bold">
          <button class="bg-orange-400 p-2 rounded-md" @click="findWithCheerio('introduction.html', 1)">Asistente
          </button>
          <button class="bg-red-400 p-2 rounded-md" @click="findWithCheerio('introduction.html', 1)">Integraciones
          </button>
          <button class="bg-green-400 p-2 rounded-md col-span-2" @click="findWithCheerio('introduction.html', 1)">Gente
            y cultura
          </button>
        </div>
      </div>
      <!-- Sidebar content here -->
    </div>

    <!-- Main Content -->
    <div class="flex flex-col flex-grow">
      <!-- Navbar -->
      <div class="bg-[#1e1e20] text-white p-4">
        <div class="flex justify-center">
          <img width="48" src="/public/favicon.ico" alt="">
          <p>
            <span class='text-gray-300 text-4xl font-bold pl-2'>Chatbot</span>
            <span class='text-gray-300  font-bold'>   by   </span>
            <span class='text-gray-500 text-xl font-bold'>Place</span>
            <span class='text-orange-500 text-xl font-bold'>To</span>
            <span class='text-gray-500 text-xl font-bold'>Pay</span>
            <span class='text-gray-300 pl-2'>( Beta 1.0 )</span>
          </p>
        </div>
        <!-- Navbar content here -->
      </div>

      <!-- Chatbot -->
      <div class="flex-grow flex flex-col">
        <div id="mensajes" :class="[`flex-grow duration-300`, question ? `bg-gray-300` : `bg-settings`]">
          <div v-if="!question" class="h-full flex justify-center items-center">
            <div class="p-10 rounded-md opacity-50 hover:opacity-100 duration-300 select-none">
              <div class="flex justify-center items-center gap-5">
                <img width="300" src="https://static.placetopay.com/placetopay-logo-black.svg"
                     class="attachment-0x0 size-0x0" alt="" decoding="async" loading="lazy">
                <span class="text-black font-bold text-4xl">x</span>
                <img width="300" src="/public/OpenAI_Logo.svg" alt="">
              </div>

              <div class="text-gray-500 grid grid-cols-3 pt-16">
                <div class="flex gap-2 border-r-2 border-dashed border-black px-2">
                  <div>
                    <img width="35" src="/public/clipboard1.svg" alt="">
                  </div>
                  <div>
                    <div class="flex items-center text-black font-bold text-xl">Caracteristicas:</div>
                    <div class="pt-2">* Personalizacion</div>
                    <div>* Análisis</div>
                    <div>* Recomendaciones</div>
                    <div>* Respuestas inmediatas</div>
                  </div>
                </div>
                <div class="flex justify-center gap-2 px-2">
                  <div>
                    <img width="35" src="/public/clipboard2.svg" alt="">
                  </div>
                  <div>
                    <div class="flex items-center text-black font-bold text-xl">Beneficios:</div>
                    <div class="pt-2">- Acceso rapido</div>
                    <div>a la informacion</div>
                    <div>- Atencion personalizada</div>
                    <div>- Soluciones</div>
                  </div>
                </div>
                <div class="flex justify-start gap-2 border-l-2 border-dashed border-black px-2">
                  <div>
                    <img width="35" src="/public/clipboard3.svg" alt="">
                  </div>
                  <div>
                    <div class="flex items-center text-black font-bold text-xl">Alcance:</div>
                    <div class="pt-2">* Automatizacion de</div>
                    <div>procesos</div>
                    <div>* Monitoreo de datos</div>
                    <div>* Productividad</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div :class="['pt-5', loading ? '' : 'pb-36' ]">
            <div v-for="message in messages.message">

              <div class="px-28">
                <div class="flex justify-end gap-2 pb-5">
                  <div class="bg-gray-50 flex items-center px-2 rounded-md text-black" style="max-width: 800px;">
                    {{ message.user.text }}
                  </div>
                  <div class="flex items-start">
                    <img class="bg-gray-200 rounded-full p-1" src="/public/user-icon.svg" width="50" alt="">
                  </div>
                </div>

                <div class="flex gap-2 pb-5">
                  <div class="flex items-start">
                    <img class="bg-gray-200 rounded-full p-1" src="/public/favicon.ico" width="50" alt="">
                  </div>
                  <div class="flex items-center">
                    <div class="flex bg-gray-50 p-2 rounded-md text-black" style="max-width: 800px;">
                      {{ message.bot.text }}
                    </div>
                  </div>
                </div>

              </div>

              <!--                  <div class="grid grid-cols-12 gap-2 mt-5 mr-12">-->
              <!--                    <div class="flex justify-center items-start">-->
              <!--                      <img class="bg-gray-200 rounded-full p-1" src="/public/favicon.ico" width="50" alt="">-->
              <!--                    </div>-->
              <!--                    <div class="col-span-11 flex items-center">-->
              <!--                      <div class="flex bg-gray-100 p-2 rounded-md text-black">-->
              <!--                        {{ message.bot.text }}-->
              <!--                      </div>-->
              <!--                    </div>-->
              <!--                  </div>-->
            </div>


            <div v-if="errorRequest" class="flex gap-2">
              <img src="/public/favicon.ico" width="50" alt="">
              <div class="bg-gray-100 flex items-center px-2 rounded-md text-black">
                Inserte token, yo no hablo gratis
              </div>
            </div>
          </div>

          <div v-if="loading === true" class="pt-5 pb-36">
            <div>
              <div class="px-28">
                <div class="flex justify-end gap-2 pb-5">
                  <div class="bg-gray-50 flex items-center px-2 rounded-md text-black" style="max-width: 815px;">
                    {{ input }}
                  </div>
                  <div class="flex items-start">
                    <img class="bg-gray-200 rounded-full p-1" src="/public/user-icon.svg" width="50" alt="">
                  </div>
                </div>

                <div class="flex gap-2 pb-5">
                  <div class="flex items-start">
                    <img class="bg-gray-200 rounded-full p-1" src="/public/favicon.ico" width="50" alt="">
                  </div>
                  <div class="flex items-center">
                    <div class="flex bg-gray-50 p-3 rounded-md text-black" style="max-width: 815px;">
                      <div class="dot-wave">
                        <div class="dot-wave__dot"></div>
                        <div class="dot-wave__dot"></div>
                        <div class="dot-wave__dot"></div>
                        <div class="dot-wave__dot"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!--                  <div class="grid grid-cols-12 gap-2 mt-5 mr-12">-->
              <!--                    <div class="flex justify-center items-start">-->
              <!--                      <img class="bg-gray-200 rounded-full p-1" src="/public/favicon.ico" width="50" alt="">-->
              <!--                    </div>-->
              <!--                    <div class="col-span-11 flex items-center">-->
              <!--                      <div class="flex bg-gray-100 p-2 rounded-md text-black">-->
              <!--                        {{ message.bot.text }}-->
              <!--                      </div>-->
              <!--                    </div>-->
              <!--                  </div>-->
            </div>


            <div v-if="errorRequest" class="flex gap-2">
              <img src="/public/favicon.ico" width="50" alt="">
              <div class="bg-gray-100 flex items-center px-2 rounded-md text-black">
                Inserte token, yo no hablo gratis
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center bg-orange-500 py-5 px-28 fixed bottom-0 right-0 w-3/4">
          <input id="prompt" placeholder="Escribe tu mensaje"
                 class="w-full bg-gray-200 p-3 rounded-md text-black" type="text">
          <button @click="sendToGpt()" class="bg-gray-400 px-10 ml-2 rounded-md p-3">Enviar</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style>

.bg-settings {
  background: url('/public/floating-cogs.svg');
  background-size: 1300px;
  background-color: #f1f5f9;
}

.dot-wave {
  --uib-size: 50px;
  --uib-speed: 0.6s;
  --uib-color: #0d0909;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  width: var(--uib-size);
  height: calc(var(--uib-size) * 0.17);
  padding-top: calc(var(--uib-size) * 0.34);
}

.dot-wave__dot {
  flex-shrink: 0;
  width: calc(var(--uib-size) * 0.17);
  height: calc(var(--uib-size) * 0.17);
  border-radius: 50%;
  background-color: var(--uib-color);
  will-change: transform;
}

.dot-wave__dot:nth-child(1) {
  animation: jump824 var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.45) infinite;
}

.dot-wave__dot:nth-child(2) {
  animation: jump824 var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.3) infinite;
}

.dot-wave__dot:nth-child(3) {
  animation: jump824 var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.15) infinite;
}

.dot-wave__dot:nth-child(4) {
  animation: jump824 var(--uib-speed) ease-in-out infinite;
}

@keyframes jump824 {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-200%);
  }
}
</style>


