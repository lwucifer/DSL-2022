import Vue from 'vue';
import VueFbCustomerChat from 'vue-fb-customer-chat';

Vue.use(VueFbCustomerChat, {
  page_id: process.env.FB_CHAT_PAGE_ID, //  change 'null' to your Facebook Page ID,
  theme_color: process.env.FB_CHAT_THEME_COLOR, // theme color in HEX
  locale: process.env.FB_CHAT_LOCALE, // default 'en_US'
  attribution: process.env.FB_CHAT_ATTRIBUTION,
  logged_in_greeting: process.env.FB_CHAT_LOGGED_IN_GREETING,
  logged_out_greeting: process.env.FB_CHAT_LOGGED_OUT_GREETING
});
