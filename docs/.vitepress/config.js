import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  
  title: "Microsites",
  description: "Microsites documentation",
  themeConfig: {
    logo: 'P2P_Logo.svg',
    siteTitle: false,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Documentación', link: '/introduction' },
      { text: 'Chatbot', link: '/chatbot', target: '_blank' }
    ],

    head: [
      [
        'script',
        {
          async: true,
          src: 'https://www.chatting.wavechat.ai/scripts/chatbubblescript.js?chatbotId=1dd2ab78-b768-455d-af1d-ef9ef37e7f7d'
        }
      ],
    ],

    sidebar: [
      {
        text: 'Micrositios',
        items: [
          { text: 'Introducción', link: '/introduction' },
          { text: '¿Cómo funcionan?', link: '/about-it' }
        ]
      },
      {
        text: 'Integración',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/JuanF0509/juanf0509.github.io' },
    ]
  }
})
