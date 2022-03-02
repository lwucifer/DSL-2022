<template>
  <div class="layout-default" id="layout-payment">
    <HeaderPayment />
    <HeaderDefault style="height: 0; visibility: hidden;"/>

    <main class="page-content">
      <nuxt />
    </main>

    <div class="chat-bot">
      <a target="_blank" href="https://zalo.me/0973922149">
        <IconZalo class="chat-bot__zalo" :class="{'active': !isOpenChat}"/>
      </a>
      <div class="chat-bot__expend" :class="{'active': !isOpenChat}" @click.stop="onExtendChatBot(!isOpenChat)">
        <img v-if="isOpenChat" src="~assets/images/chat-bot.png" alt="">
        <img v-else src="~assets/images/close-chat-bot.png" alt="">
      </div>
    </div>
    <ScrollTo nameId="layout-payment"/>
    <MenuMobile/>
  </div>
</template>

<script>
import HeaderPayment from '~/components/layouts/HeaderPayment';
import MenuMobile from '~/components/layouts/MenuMobile';
import ScrollTo from '~/components/pages/common/ScrollTo';
import IconZalo from "~/assets/icons/zalo.svg?inline"

export default {
  name: 'payment',
  
  components: {
    HeaderPayment,
    MenuMobile,
    ScrollTo,
    IconZalo
  },

  data () {
    return {
      isOpenChat: false
    }
  },

  // computed: {
  //   ZALO_CHAT_OAID() {
  //     return process.env.ZALO_CHAT_OAID;
  //   },
  //   ZALO_CHAT_WELCOME_MSG() {
  //     return process.env.ZALO_CHAT_WELCOME_MSG;
  //   },
  //   ZALO_CHAT_AUTO_POPUP() {
  //     return process.env.ZALO_CHAT_AUTO_POPUP;
  //   },
  //   ZALO_CHAT_WIDTH() {
  //     return process.env.ZALO_CHAT_WIDTH;
  //   },
  //   ZALO_CHAT_HEIGHT() {
  //     return process.env.ZALO_CHAT_HEIGHT;
  //   }
  // },

  methods: {
    onExtendChatBot (flag) {
      const facebook = document.querySelectorAll('iframe[data-testid]')
      // 1- checked status loaded plugin zalo and facebook
      if (!facebook || facebook.length === 1) return
      // 2- change status open chat
      this.isOpenChat = flag
      if (!this.isOpenChat) {
        for (let i = 0; i < facebook.length; i++) {
          facebook[i].style.display = 'block'
        }
      } else {
        for (let i = 0; i < facebook.length; i++) {
          facebook[i].style.display = 'none'
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/layouts/_default.scss';
</style>