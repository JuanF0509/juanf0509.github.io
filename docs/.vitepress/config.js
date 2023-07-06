import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({

  title: "Microsites",
  description: "Microsites documentation",
  themeConfig: {
    logo: 'favicon.ico',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Chat', link: 'https://www.youtube.com/', target: '_self' }
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
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Chat', link: '/chat' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ]
  }
})
