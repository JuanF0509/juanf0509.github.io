// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}

  function initFreshChat() {
    window.fcWidget.init({
           token: "25f83e22-b068-4e3f-905c-499d41ff7cd3",
     host: "https://placetopay.freshchat.com"
    });
  }
  function initialize(i,t){var e;i.getElementById(t)?
  initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,
  e.src="https://placetopay.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}
  function initiateCall(){initialize(document,"Freshchat-js-sdk")}
  window.addEventListener?window.addEventListener("load",initiateCall,!1):
  window.attachEvent("load",initiateCall,!1);