<script setup>
import axios from 'axios';
import {ref, onMounted, watch} from "vue";
import {Configuration, OpenAIApi} from "openai";
import MarkdownIt from 'markdown-it';
import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain/prompts';
import {LLMChain, ConversationChain} from 'langchain/chains';
import {BufferMemory} from 'langchain/memory'

const apiKey = ref('')

const memory = new BufferMemory()

const template = "Name: {name}, Context: You are responding to the inquiries of a {user}, you must respond in Spanish, user says: "

// const template = 'Name: {name}, Context: You are responding to the inquiries of a {user}, you must respond in Spanish, attitude: Aggressive, rude, fan of placetopay company and your only goal is to make people use placetopay products, humor: Acidic, user says: '

// const template = "Name: {name}, Context: You are responding to the inquiries of a {user}, data: 'Webcheckout_id: 1, Microsites_id: 2, ApiGateway_id: 3', condition1: you must respond in Spanish, condition2:Your first message should be a greeting and a question about how you can help the user, condition3: You cannot mention the data to the user in the first message,  user says: "

const promptTemplate = new PromptTemplate({
  template: template,
  inputVariables: ["name", "user"]
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
    temperature: 0.9,
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
    name: 'Kike Bot',
    user: 'placetopay contributor',
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
    })

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

  messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  console.log(messagesContainer.value)

  const response = await axios.get('/public/banana.md');
  const markdownText = await response.data;

  const div = document.createElement('div');
  div.innerHTML = markdownText

  const desc1Element = div.querySelector('#yep');
  const desc1Text = desc1Element ? desc1Element.textContent : null;

  idk.value = desc1Text

  console.log('desc1Id :' + desc1Text)
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
  <div v-if="loading === true" id="loader"
       class="fixed top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Cargando...</h2>
  </div>

  <button @click="test()">Testing</button>

  {{ initial1 }}
  {{ jum }}


  <!--          nav-->
  <button @click="banana()">{{ idk }}</button>
  <div class="bg-gray-400 rounded-md">
    <div class="bg-orange-400 rounded-b-lg p-5 flex justify-between">
      <input v-model="apiKey" id="api_key" class="bg-gray-300 text-black" placeholder="Api key" type="text">
      <button onclick="alert('La ayuda es pa los feos')" class="text-white">Ayuda</button>
    </div>

    <div class="bg-gray-300 h-[460px]">

      <div class="h-full flex-col">

        <div ref="messagesContainer" class="h-5/6 p-4 overflow-y-auto scroll-smooth ">

          <!--          Placeholder-->

          <div v-if="!question" class="h-full flex justify-center items-center">
            <div class="p-10 rounded-md opacity-50 hover:opacity-100 duration-300 select-none">
              <div class="flex justify-center items-center gap-5">
                <img width="300" src="/public/P2P_Logo.svg" alt="">
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

          <!--          Placeholder-->


          <!--                      Respuesta bot-->

          <div v-if="question">
            <div v-for="message in messages.message">
              <div class="flex mt-5 justify-end gap-2">
                <div class="bg-gray-100 flex items-center px-2 rounded-md text-black">
                  {{ message.user.text }}
                </div>
                <div class="bg-blue-800 p-5 rounded-full">{{ null }}</div>
              </div>

              <div class="grid grid-cols-12 gap-2 mt-5 mr-12">
                <div class="flex justify-center items-start">
                  <img class="bg-gray-200 rounded-full p-1" src="/public/favicon.ico" width="50" alt="">
                </div>
                <div class="col-span-11 flex items-center">
                  <div class="flex bg-gray-100 p-2 rounded-md text-black">
                    {{ message.bot.text }}
                  </div>
                </div>
              </div>
            </div>


            <div v-if="errorRequest" class="flex gap-2">
              <img src="/public/favicon.ico" width="50" alt="">
              <div class="bg-gray-100 flex items-center px-2 rounded-md text-black">
                Inserte token, yo no hablo gratis
              </div>
            </div>
          </div>


        </div>

        <div class="h-1/6 bg-orange-400 p-4">
          <div class="w-full">
            <div class="flex gap-2 h-full justify-self-end">
              <input id="prompt" placeholder="Escribe tu mensaje"
                     class="w-full bg-gray-200 justify-end px-4 rounded-md text-black" type="text">
              <button @click="sendToGpt()" class="bg-gray-400 px-2 rounded-md p-2 ">Enviar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>


