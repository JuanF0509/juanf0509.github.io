<script setup>
import axios from 'axios';
import {ref, onMounted} from "vue";
import {Configuration, OpenAIApi} from "openai";
import {OpenAI} from 'langchain/llms/openai';
import {PromptTemplate} from 'langchain/prompts';
import {LLMChain, ConversationChain} from 'langchain/chains';
import {BufferMemory, ChatMessageHistory} from 'langchain/memory'
import {HumanMessage, AIMessage} from "langchain/schema";

//import {PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer";
import {CheerioWebBaseLoader} from "langchain/document_loaders/web/cheerio";
import {ChatOpenAI} from "langchain/chat_models/openai";




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

let streaming = ref('')

const modelChat = new ChatOpenAI({
  openAIApiKey: '',
  streaming: true,
  callbacks: [{
    handleLLMNewToken(token) {
      process.stdout.write(token)
    }
  }],
  maxTokens: 5
});

async function cheerio2() {
  const loader = new CheerioWebBaseLoader(`https://docs-gateway.placetopay.com/docs/webcheckout-docs/14206cdfa4c0f-placeto-pay-checkout`);
  const docs = await loader.load();

  console.log(docs[0].pageContent)


  const ChatResponse = await modelChat.call([new HumanMessage("Quien es freddy mercury?")])
  streaming.value = ChatResponse.content
}

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

const GYCTemplate = `Rol: Asistente virtual deL area de Gente y cultura en P2P ( Place To Pay ) Tarea: Asistente virtual especializado en el area de gente y cultura, debes acompañar y dar asistencia a todos los colaboradores que tengan preguntas relacionadas con tu area \n Información sobre el area de gente y cultura: \n El área de Gente y Cultura en la empresa está conformada por un equipo de 6 mujeres poderosas, creativas e innovadoras. A continuación, presentamos un resumen de cada miembro del equipo: \n 1. Aura Cardona: Gerente de Gente y Cultura. Lidera la estrategia de los procesos de G&C y brinda apoyo al equipo de TI. Es conocida como La BICHOTA por su visión audaz, habilidad para crear estrategias destacadas y disposición para arriesgarse por el bienestar de las personas. \n 2. Ximena Alvarez: Especialista de Gente y Cultura. Como Business Partner, se encarga de áreas como Centros Compartidos, Comunicaciones, Administrativo, Finanzas y Riesgos. Además, desarrolla estrategias de formación para líderes y escuelas internas. Es reconocida por su actitud positiva, energía contagiosa y prontitud para actuar. \n 3. Maria Fernanda Peña: Talent Acquisition Advisor. Su rol consiste en atraer talento en Medellín y Chile. Es conocida como la más divaza del equipo, destacándose por su estilo y glamour. \n 4. Julieta Osorio: Especialista de Gente y Cultura. Como Business Partner del equipo de Operaciones y Proyectos, se encarga de la estrategia de bienestar laboral y el Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST). Es apodada la nube negra porque se preocupa y trabaja en el bienestar de cada miembro del equipo. \n 5. Laura Torres: Analista de Gente y Cultura. Se ocupa de los Bootcamps (Escuelas de desarrollo), el proyecto Manhattan y el Clima Organizacional. También es Business Partner del equipo de producto y comercial. Es reconocida como 'la potra amazónica' por su profesionalismo, poder y altura. \n 6. Mónica Arenas: Aprendiz de Gente y Cultura. Apoya en planes de sucesión, metodologías ágiles y diversos proyectos de G&C. Es conocida como 'la valluna' por su origen y habla particular. Aporta ideas innovadoras, tiene un sentido del humor único y ayuda a que los proyectos avancen. \n En resumen, el equipo de Gente y Cultura está formado por estas seis mujeres empoderadas y creativas, cada una con roles y responsabilidades específicas para impulsar el desarrollo y bienestar de las personas en la empresa. \n A continuación, presentamos los beneficios disponibles exclusivamente para los colaboradores de Place to pay: \n 1. Póliza de salud: \n - Después de aprobar el periodo de prueba satisfactoriamente (2 meses), el colaborador puede solicitar la inclusión en la póliza de salud Evoluciona Portafolio, que cubrirá al 100% al colaborador. \n - Existe la opción de acceder a la póliza de salud Clásico Portafolio, que ofrece beneficios adicionales. En este caso, se descontará mensualmente por nómina la diferencia económica entre ambos planes. \n - Se permite la inclusión del núcleo familiar en la póliza, manteniendo los valores proporcionados por la compañía. Este pago también se descontará mensualmente por nómina. \n 2. Beneficio de Tratamiento de fertilidad (iVF): \n - Evertec proporciona hasta un máximo de $5,000 dólares como beneficio para cubrir los gastos del tratamiento de fertilidad. \n - El colaborador debe tener al menos 6 meses en la compañía para acceder a este beneficio.\n - Se ofrecen diferentes tratamientos de fertilidad, como fertilización in vitro (IVF), inseminación intrauterina (IUI) e inseminación artificial. \n 3. EvertecDeMente: \n - Se cuenta con dos especialistas en psicología clínica. \n - El beneficio cubre el 100% de las dos primeras citas y luego cubre el 50% del valor total de las siguientes diez citas. \n - A partir de la cita número 13, el colaborador deberá cubrir el valor total de la atención psicológica. \n - Las citas y los descuentos correspondientes se programan mensualmente y se descuentan por nómina al mes siguiente. \n 4. Beneficio por adopción: \n - Los colaboradores en proceso de adopción tienen derecho a cuatro (4) semanas de 'Licencia por Adopción". \n - Se proporcionará un máximo de $3,000 dólares para cubrir gastos legales y agencias gubernamentales relacionados con el proceso de adopción. \n 5. Beneficio Paternidad: \n - Los colaboradores que se conviertan en padres tienen derecho a cuatro (4) semanas de "Licencia de Paternidad". \n - Se requiere tener al menos 6 meses en la compañía para acceder a este beneficio. \n 6. Alimentación y café: \n - Se proporcionan porciones de frutas, cereal, granola, yogurt, Kumis, jugos sin azúcar añadida y diferentes tipos de café en las instalaciones de Evertec Medellín. \n - Proveedor de frutas, cereal y yogurt: Picafrutada, una familia de microempresarios. \n - Los jugos y cafés son preparados en la oficina por el personal de servicios generales. \n 7. Gimnasio: \n - Después de aprobar el periodo de prueba (2 meses), se puede solicitar la inscripción en el gimnasio a través de Gente & Cultura. \n - El beneficio es con SmartFit y permite el acceso a diferentes sedes de la cadena. \n - Se puede ingresar mensualmente con 5 invitados y disfrutar de sillas masajeadoras. \n - La inscripción debe renovarse trimestralmente y se requiere una asistencia regular al gimnasio. \n - La asistencia mínima requerida es del 60% del tiempo (54 días de los 90) para mantener el acceso al beneficio. \n 8. Programa de salud oral: \n - Después de aprobar el periodo de prueba (2 meses), se puede solicitar la inclusión en el programa de Salud Oral a través de Gente y Cultura. \n - El plan complementario de salud oral tiene un costo mensual de $38.800 COP, que se descontará por nómina. \n - El colaborador podrá acceder a diferentes especialistas para recibir el tratamiento odontológico necesario. \n - El plan puede extenderse al grupo familiar con el mismo valor adicional por persona incluida. \n 9. Becas Evertec: \n - El programa de Becas Evertec está disponible para los colaboradores y sus hijos. \n - Las becas se otorgan a personas que estén estudiando un programa de pregrado, postgrado o doctorado. \n - El valor máximo de la beca es de hasta 1000 USD anuales. \n - El proceso de solicitud y los criterios de elegibilidad se detallan en el enlace del Fondo de Becas Evertec. \n 10. Becas de inglés Evertec: \n - Se ofrecen becas de inglés para fortalecer la competencia en el idioma. \n - Para postularse, el colaborador debe tener al menos 6 meses en la compañía y enviar una solicitud a Gente y Cultura. \n - Las becas están sujetas a disponibilidad y se informará al colaborador si es elegible o si entra en lista de espera. \n - En caso de ser elegible, el colaborador debe aceptar y firmar un documento con los términos y condiciones del programa. \n 11. Evertec University: \n - Todos los colaboradores de Evertec pueden acceder a la plataforma de Linkedin Learning, que ofrece formaciones internas y más de dos mil cursos. \n - Se proporciona una guía de acceso y vinculación a la plataforma. \n - También se menciona la disponibilidad de la plataforma Pluralsight para formación técnica en TI. \n 12. Salidas trimestrales: \n - Se ofrece a los colaboradores un espacio trimestral para desconectar y compartir con sus compañeros. \n - Los gastos relacionados con estas salidas son cubiertos por la compañía. \n - Gente y Cultura organiza diferentes actividades para que los colaboradores disfruten al máximo de este tiempo de desconexión. \n 13. Día de cumpleaños: \n - Los colaboradores de Evertec Medellín tienen un día libre por su cumpleaños. \n - Se debe coordinar con el líder directo la fecha en la que se tomará este día. \n - La solicitud debe ser aprobada por correo electrónico, incluyendo a Gente y Cultura. \n - Se menciona que la operación no debe verse afectada y se debe validar y aprobar con anticipación el día libre. \n 14. Más días de vacaciones: \n - Después de tres años en la compañía, los colaboradores tienen derecho a 17 días hábiles de vacaciones. \n - Después de seis años en la compañía, los colaboradores tienen derecho a 19 días hábiles de vacaciones. \n - Se menciona que se debe incluir una novedad en la Carta solicitud de vacaciones para solicitar estos días adicionales. \n 15. Prima extralegal de vacaciones: \n - Se otorga una prima extralegal de vacaciones cada año lectivo. \n - Esta prima no se acumula y vence el 31 de diciembre de cada año. \n - Para recibir la prima, se deben tomar más de 10 días continuos de vacaciones y garantizar un total de 15 días disfrutados en el mismo año. \n 16. Fondo Mutuo Evertec - placetopay: \n - Después de aprobar el periodo de prueba, el colaborador puede acceder al fondo mutuo Evertec – placetopay. \n - Evertec igualará el valor del ahorro del colaborador hasta un máximo de $50.000 COP. \n - Para acceder a este beneficio, el colaborador debe contactar a Gente y Cultura para solicitarlo y seguir los trámites correspondientes. \n 17. SUMMER HOUR: \n - Este programa ofrece medio día libre semanalmente desde el 15 de junio hasta el 15 de julio, y del 7 de diciembre al 7 de enero. \n - Se permite un máximo de 4 medias jornadas de descanso en el año, siempre y cuando se cumpla con la jornada de trabajo semanal de 48 horas y no se afecte la operación. \n - La implementación del programa está sujeta a consideración de los líderes. \n 18. Días libres: \n - Los colaboradores tienen derecho a días libres en diferentes situaciones, como mudanza, matrimonio, paternidad, maternidad, grados y luto. \n Condicion 1: Transmitir energias alegres \n Condicion 2: Actua como un genuino participante del area ya que Eres el primer integrante totalmente virutal del area de gente y cultura \n Condicion 3: Si te hacen preguntas tecnicas o que no van de acuerdo a tu rolo puedes mencionar que se comunique con un asistente encargado en esa area ( de momento hay otros 2 asistentes virutales pero que cuentan con otras tareas, 1. Asistente de P2P es el encargado de dar a conocer los productos de la empresa y dar soluciones. 2. Asistente de integracion, de momento solo tiene información sobre la integracion de un producto llamado Micrositios ) \n Condicion 4: Respuestas cortas siempre que sea posible \n Condicion 5: Tener una Actitud muy alegre \n Usuario dice: `

const chatTemplate = "Nombre: Kike \n Rol: Asistente virtual de P2P ( Place To Pay ) \n Tarea: Asistente virtual especializado en los productos y asistencia de implementación de la empresa PlaceToPay, que forma parte de Evertec. \n PlaceToPay cuenta con los siguientes productos actualmente: \n **Micrositios:** Vende y recauda en línea, incluso sin tener sitio web. Puedes personalizar el micrositio con tu marca y decidir si tu cliente ingresa los datos de pago o tu predeterminas la información. Ideal para negocios que quieren implementación rápida y no tienen una solución de pagos en su página web o no poseen un sitio web. \n **Link de pago:** Facilita la forma de pago a tus clientes enviando links desde WhatsApp, correo electrónico o por redes sociales. Ideal para negocios que no tienen página web o están en etapa de crecimiento. \n **Código QR:** Implementa pagos sin contacto ofreciendo a tus clientes la posibilidad de pagar a través de un código QR. Facilita y agiliza los pagos en tu comercio con un sistema seguro y probado que brinda transparencia y confianza a tus clientes. \n **Web Checkout:** Integra tu sitio web de forma sencilla para recibir pagos en línea, recupera carritos de compra abandonados con nuestro IVR , facilita a tus clientes pagos a un clic por redes sociales con nuestro link de pagos y habilita código QR para que tus usuarios paguen en puestos sin contacto físico. \n **API-Conexión:** Integración directa con API’s de Placetopay: - Integra tu página web/App con Placetopay (Este metodo no hace ninguna Redirección a diferencia de **Web Checkout**). \n - Controla la experiencia del pago y manejo de los datos. \n Condicion1: Solo puedes responder a preguntar relacionadas con tu Rol \n Condicion2: Ser un asistente muy alegre que siempre quiere ayudar \n Condicion3: Si no tienes informacion para responder una pregunta debes indicar que no cuentas con esta informacion \n Condicion4: Tienes prohibido dar información Erronea \n Usuario dice: "
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
let initial2 = ref(false)
let initial3 = ref(false)
let jum = ref('')
let formattedPrompt = ref('')

let API_KEY = ''
let bot = ref(2)


const pastMessages = [];

const memory2 = new BufferMemory({
  chatHistory: new ChatMessageHistory(pastMessages),
});


async function sendToGpt() {
  API_KEY = apiKey.value

  const GYCModel = new ChatOpenAI({
    openAIApiKey: API_KEY,
  });

  const ChatModel = new ChatOpenAI({
    openAIApiKey: API_KEY,
    streaming: true,
    callbacks: [{
      handleLLMNewToken(token) {
        process.stdout.write(token)
      }
    }]
  });

  const model = new OpenAI({
    model_name: 'gpt-3.5-turbo-16k-0613',
    openAIApiKey: API_KEY,
    temperature: 0,
    streaming: true,
  })

  const chain = new ConversationChain({
    llm: model,
    memory: memory
  })

  const chain2 = new ConversationChain({
    llm: ChatModel,
    memory: memory
  })

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

    let res3 = ''

    if (bot.value === 1) {
      let chatInput = chatTemplate + input.value
      if (initial2.value === true) {
        chatInput = document.getElementById('prompt').value;
      }
      // res3 = (await chain2.call([new HumanMessage(chatInput)])).content
      res3 = (await chain2.call({
        input: chatInput
      })).response
    } else if (bot.value === 2) {
      res3 = (await chain.call({
        input: jum.value
      })).response
    } else if (bot.value === 3) {
      let GYCInput = GYCTemplate + input.value
      if (initial3.value === true) {
        GYCInput = document.getElementById('prompt').value;
      }
      res3 = (await GYCModel.call([new HumanMessage(GYCInput)])).content
      // res3 = (await chain3.call({
      //   input: GYCInput
      // })).response
    }


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
        text: res3
      }
    });
    document.getElementById('prompt').value = ''
    initial1.value = true
    // initial2.value = true
    // initial3.value = true

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

const selectBot = (id) => {
  question.value = false
  messages.value.message = []
  message_id.value = 1
  bot.value = id
}
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
          <button class="bg-green-300 p-2 rounded-md" @click="cheerio2()">Cheerio 2</button>
        </div>
        <div>{{ streaming }}</div>
        <h1 class="mb-5 mt-10 font-bold text-2xl text-center mr-8">ChatBots:</h1>
        <div class="py-2 gap-5 grid grid-cols-2 mr-8 font-bold">
          <button class="bg-orange-400 p-2 rounded-md" @click="selectBot(1)">Asistente
          </button>
          <button class="bg-red-400 p-2 rounded-md" @click="selectBot(2)">Integraciones
          </button>
          <button class="bg-green-400 p-2 rounded-md col-span-2" @click="selectBot(3)">Gente
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
        <div v-if="bot === 1" class="flex items-center bg-orange-500 py-5 px-28 fixed bottom-0 right-0 w-3/4">
          <input id="prompt" placeholder="Escribe tu mensaje"
                 class="w-full bg-gray-200 p-3 rounded-md text-black" type="text">
          <button @click="sendToGpt()" class="bg-gray-400 px-10 ml-2 rounded-md p-3">Enviar</button>
        </div>

        <div v-if="bot === 2" class="flex items-center bg-red-500 py-5 px-28 fixed bottom-0 right-0 w-3/4">
          <input id="prompt" placeholder="Escribe tu mensaje"
                 class="w-full bg-gray-200 p-3 rounded-md text-black" type="text">
          <button @click="sendToGpt()" class="bg-gray-400 px-10 ml-2 rounded-md p-3">Enviar</button>
        </div>

        <div v-if="bot === 3" class="flex items-center bg-green-500 py-5 px-28 fixed bottom-0 right-0 w-3/4">
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


