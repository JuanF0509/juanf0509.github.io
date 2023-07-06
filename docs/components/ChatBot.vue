<template>
  <div v-if="loading === true" id="loader"
       class="fixed top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-75 flex justify-center items-center">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <h2 class="text-center text-white text-xl font-semibold">Cargando...</h2>
  </div>


  <!--          nav-->
  <button @click="banana()">{{ idk }}</button>
  <div class="bg-gray-400 rounded-md shadow-lg shadow-gray-500">
    <div class="bg-orange-400 rounded-b-lg p-5 flex justify-end">
      <button onclick="alert('La ayuda es pa los feos')" class="text-white">Ayuda</button>
    </div>

    <div class="bg-gray-300 h-[460px] ">

      <div class="h-full flex-col">

        <div class="h-5/6 p-4">

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
            <div v-if="question" class="flex mt-5 justify-end gap-2">
              <div class="bg-gray-100 flex items-center px-2 rounded-md  text-black">{{ input }}
              </div>
              <div class="bg-blue-800 p-5 rounded-full">{{ null }}</div>
            </div>

            <div v-if="response" class="flex gap-2 mt-5 mr-12">
              <!--                        <div class="bg-red-800 p-5 rounded-full">{{ null }}</div>-->
              <img src="/public/favicon.ico" width="50" alt="">
              <div class="bg-gray-100 flex items-center px-2 rounded-md  text-black">
                {{ response }}
              </div>
            </div>


            <div v-if="errorRequest" class="flex gap-2">
              <!--                        <div class="bg-red-800 p-5 rounded-full">{{ null }}</div>-->
              <img src="/public/favicon.ico" width="50" alt="">
              <div class="bg-gray-100 flex items-center px-2 rounded-md font-bold text-black">
                Nu entendi
              </div>
            </div>
          </div>

        </div>

        <div class="h-1/6 bg-orange-400 p-4">
          <div class="w-full">
            <div class="flex gap-2 h-full justify-self-end">
              <input id="prompt" class="w-full bg-gray-200 justify-end px-4 rounded-md text-black" type="text">
              <button @click="fetchGPT3" class="bg-gray-400 px-2 rounded-md p-2 ">Enviar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script setup>
import axios from 'axios';
import {ref, onMounted} from "vue";
import MarkdownIt from 'markdown-it';

const markdownContent = ref('');

let idk = ref('')
onMounted(async () => {
  const response = await fetch('http://localhost:5173/markdown-examples.html');
  const markdownText = await response.text();

  const div = document.createElement('div');
  div.innerHTML = markdownText

  const desc1Element = div.querySelector('#desc1');
  const desc1Text = desc1Element ? desc1Element.textContent : null;

  idk.value = desc1Text

  console.log('desc1Id :' + desc1Text)
  // markdownContent.value = htmlContent;

    // const dat = htmlContent.querySelector('#desc1');
    // console.log('dat :' + dat)
    // if (dat) {
    //   idk.value = dat.textContent;
    //   console.log('Texto extraido:', idk.value);
    // } else {
    // console.error('Error fetching introduction content:')
    // }

  // console.log('response :' + response )
  // console.log('markdownText :' + markdownText )
  // console.log('md :' + md )
  // console.log('htmlContent :' + htmlContent )
  // console.log('markdownContent :' + markdownContent.value )
});



const openaiApiKey = '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';
const response = ref('');
const loading = ref(false);

let input = ref('')

let question = ref(false)

let errorRequest = ref(false)

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
        //             {"role": "user", "content": `Esta es la Documentacion: {
        // "Titulo": "Crear sesión (CreateRequest)",
        // "Endpoint": "https://checkout-test.placetopay.com/api/session",
        // "Metodo": "POST",
        // "Descripcion": "Solicita la creación de la sesión y retorna el identificador y la URL de procesamiento.",
        // "Request basico para crear una sesión": {
        //     "locale": "es_CO",
        //     "auth": {
        //         "login": "c51ce410c124a10e0db5e4b97fc2af39",
        //         "tranKey": "VQOcRcVH2DfL6Y4B4SaK6yhoH/VOUveZ3xT16OQnvxE=",
        //         "nonce": "NjE0OWVkODgwYjNhNw==",
        //         "seed": "2021-09-21T09:34:48-05:00"
        //     },
        //     "payer": {
        //         "document": "1122334455",
        //         "documentType": "CC",
        //         "name": "John",
        //         "surname": "Doe",
        //         "company": "Evertec",
        //         "email": "johndoe@app.com",
        //         "mobile": "+5731111111111",
        //         "address": {
        //             "street": "Calle falsa 123",
        //             "city": "Medellín",
        //             "state": "Poblado",
        //             "postalCode": "55555",
        //             "country": "Colombia",
        //             "phone": "+573111111111"
        //         }
        //     },
        //     ...
        // },
        // "Response Example": {
        //     "status": {
        //         "status": "OK",
        //         "reason": "PC",
        //         "message": "La petición se ha procesado correctamente",
        //         "date": "2021-11-30T15:08:27-05:00"
        //     },
        //     "requestId": 1,
        //     "processUrl": "https://checkout-co.placetopay.com/session/1/cc9b8690b1f7228c78b759ce27d7e80a"
        // },
        // "Descripcion de cada parametro": {
        //     "locale": "string (Definido con los códigos ISO 631-1 y ISO 3166-1 alpha-2)",
        //     "auth": "Authentication (Estructura de autenticación api para sitios)",
        //     "login": "string (Identificador del sitio)",
        //     ...
        // }`},
        //             {"role": "system", "content": "Eres un asistente virtual llamado pedrolo. Que tiene una gran actitud y siempre trata de la mejor forma, siempre entrega respuestas cortas pero con gran valor y siempre pregunta si pudo solucionar la inquietud del usuario"}
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

// const scrapeData = async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//
//   await page.goto('https://docs-gateway.placetopay.com/docs/webcheckout-docs/5e87083a4109d-crear-sesion-create-request');
//
//   await page.waitForSelector('h1.sl-text-5xl.sl-leading-tight.sl-font-prose.sl-font-semibold.sl-text-heading');
//
//   const element = await page.$('h1.sl-text-5xl.sl-leading-tight.sl-font-prose.sl-font-semibold.sl-text-heading');
//   const text = await page.evaluate(element => element.textContent, element);
//
//   setScrapedText(text);
//
//   await browser.close();
// };
//
// let scrapedText = '';
//
// const setScrapedText = (text) => {
//   scrapedText = text;
// };
</script>


<!--<script>-->
<!--  import { ref } from 'vue';-->
<!--  import { fetchGPT3 } from '../openai';-->

<!--  export default {-->
<!--    setup() {-->
<!--      const prompt = ref('');-->
<!--      const response = ref('');-->

<!--      async function generateResponse() {-->
<!--        response.value = await fetchGPT3(prompt.value);-->
<!--      }-->

<!--      return {-->
<!--        prompt,-->
<!--        response,-->
<!--        generateResponse,-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->
