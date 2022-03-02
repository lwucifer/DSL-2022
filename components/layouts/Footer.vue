<template>
  <footer class="footer">
    <div class="footer-top-wrapper" v-if="data && data.length > 0">
      <div class="container">
        <div class="footer-top">
          <div v-swiper:mySwiper="swiperOption" class="w-100">
            <div class="swiper-wrapper">
              <a
                class="swiper-slide item-partner"
                :href="item.link"
                target="_blank"
                v-for="(item, index) in data"
                :key="index"
                :class="{ 'mx-auto': data.length > 4 }"
              >
                <img :src="item.logo" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-center-wrapper">
      <div class="container">
        <div class="footer-center">
          <div class="row">
            <div class="col-12 col-md-4 mb-4 mb-md-0">
              <div class="footer-center-contact">
                <n-link :to="`/${defaultLangCode}`" class="mb-3 mb-md-5">
                  <LogoFooter/>
                </n-link>
                <a href="mailto:Sodulichtinhyb@gmail.com" class="d-block"
                  ><IconEmail class="icon mr-2" /> sodulichtpmc@gmail.com</a
                >
                <a href="tel:0988 888 888"
                  ><IconPhone class="icon mr-2" /> 0988 888 888</a
                >
              </div>
            </div>

            <div class="col-12 col-md-4 mb-4 mb-md-0">
              <div class="footer-center-link">
                <p class="fw-bold">{{ $t('footer.useful_links') }}</p>
                <n-link
                  :to="`/${defaultLangCode}/hotel/${menuMappingObj['hotel']}`"
                  >{{ $t('home.hotel') }}</n-link
                >
                <n-link
                  :to="`/${defaultLangCode}/restaurant/${menuMappingObj['restaurant']}`"
                  >{{ $t('header.restaurants') }}</n-link
                >
                <n-link
                  :to="`/${defaultLangCode}/tour/${menuMappingObj['tour']}`"
                  >{{ $t('home.tour') }}</n-link
                >
                <n-link
                  :to="`/${defaultLangCode}/product-travel/${menuMappingObj['product-travel']}`"
                  >{{ $t('home.product_travel') }}</n-link
                >

                <div v-for="(item, index) in category_news" :key="index">
                  <n-link
                    :to="
                      item.category_type == 1
                        ? `/${defaultLangCode}/news/${item.id}`
                        : `/${defaultLangCode}/sale/${item.id}`
                    "
                    >{{ item.title }}</n-link
                  >
                </div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="footer-center-link">
                <p class="fw-bold">{{ $t('footer.tourist_yenbai_infor') }}</p>
                <n-link
                  v-for="(item, index) in list_footer"
                  :key="index"
                  :to="`/${defaultLangCode}/basic/${item.id}`"
                >
                  {{ item.title }}
                </n-link>
              </div>

              <div class="footer-center-link">
                <p class="fw-bold">{{ $t('footer.contact_us') }}</p>
                <a href="http://" target="_blank" class="d-inline">
                  <FooterYoutube />
                </a>
                <a href="http://" target="_blank" class="d-inline">
                  <FooterFb />
                </a>
                <a href="http://" target="_blank" class="d-inline">
                  <FooterTwitter />
                </a>

                <a href="http://" target="_blank" class="d-inline"
                  ><FooterTripavisor width="24px"
                /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom-wrapper text-center">
      copyright © 2020 all rights reserved
    </div>

    <div class="chat-bot">
      <!-- <IconMessenger class="chat-bot__mess" :class="{'active': !isOpenChat}"/> -->
       <a target="_blank" href="https://zalo.me/0973922149">
        <IconZalo class="chat-bot__zalo" :class="{'active': !isOpenChat}"/>
      </a>
      <div class="chat-bot__expend" :class="{'active': !isOpenChat}" @click.stop="onExtendChatBot(!isOpenChat)">
        <img v-if="isOpenChat" src="~assets/images/chat-bot.png" alt="">
        <img v-else src="~assets/images/close-chat-bot.png" alt="">
      </div>
    </div>
  </footer>
</template>

<script>
import FooterYoutube from '~/assets/icons/footer-youtube.svg?inline';
import FooterFb from '~/assets/icons/footer-fb.svg?inline';
import FooterTwitter from '~/assets/icons/footer-twitter.svg?inline';
import FooterTripavisor from '~/assets/icons/tripavisor.svg?inline';
import FooterTripavisor2 from '~/assets/icons/tripadvisor-2.svg?inline';
import IconEmail from '~/assets/icons/email.svg?inline';
import IconPhone from '~/assets/icons/phone-call.svg?inline';
import Messenger from "~/assets/icons/messenger.svg?inline"
import IconMessenger from "~/assets/icons/messenge-0.svg?inline"

import IconZalo from "~/assets/icons/zalo.svg?inline"
import IconChatBot from '~/assets/icons/chat-bot.svg?inline';
import LogoFooter from '~/assets/images/logo.svg?inline';

import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  components: {
    FooterYoutube,
    FooterFb,
    FooterTwitter,
    FooterTripavisor,
    FooterTripavisor2,
    IconEmail,
    IconPhone,
    Messenger,
    IconMessenger,
    IconZalo,
    IconChatBot,
    LogoFooter
  },

  props: {
    data: {
      type: [Object, Array]
    }
  },

  data() {
    return {
      process,
      isOpenChat: false,
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 24,
        autoplay: {
          delay: 1000
        },
        loop: true,
        breakpoints: {
          992: {
            slidesPerView: 5,
            spaceBetween: 24
          },
          720: {
            slidesPerView: 3,
            spaceBetween: 15
          },
          540: {
            slidesPerView: 2,
            spaceBetween: 10
          },
        }
      }
    };
  },

  computed: {
    ...mapState('news/news', ['category_news']),
    ...mapState('common/common', ['list_footer', 'defaultLang']),
    ...mapGetters('common/common', ['menuMappingObj', 'defaultLangCode']),

    // ZALO_CHAT_OAID() {
    //   return process.env.ZALO_CHAT_OAID;
    // },
    // ZALO_CHAT_WELCOME_MSG() {
    //   return process.env.ZALO_CHAT_WELCOME_MSG;
    // },
    // ZALO_CHAT_AUTO_POPUP() {
    //   return process.env.ZALO_CHAT_AUTO_POPUP;
    // },
    // ZALO_CHAT_WIDTH() {
    //   return process.env.ZALO_CHAT_WIDTH;
    // },
    // ZALO_CHAT_HEIGHT() {
    //   return process.env.ZALO_CHAT_HEIGHT;
    // }
  },

  methods: {
    ...mapActions('news/news', ['getCategoryNews']),
    ...mapActions('common/common', ['getListFooter']),

    onExtendChatBot (flag) {
      const facebook = document.querySelectorAll('iframe[data-testid]')
      console.log('onExtendChatBot', facebook)
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
  },

  mounted() {
    this.getCategoryNews();
    this.getListFooter();
  },

  watch: {
    defaultLang(_newVal) {
      this.getCategoryNews();
      this.getListFooter();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/layouts/_footer.scss';
</style>
