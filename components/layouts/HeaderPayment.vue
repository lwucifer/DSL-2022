<template>
  <header class="header">
    <div class="container header-content">
      <n-link :to="`/${defaultLangCode}`" class="header-logo">
        <Logo/>
        <!-- <img
          src="~assets/images/logo-183x50.png"
          srcset="
            ~assets/images/logo-183x50.png  1x,
            ~assets/images/logo-366x101.png 2x
          "
          alt="Sàn du lịch tỉnh Yên Bái"
        /> -->
      </n-link>

      <div class="header-btn-menu-wrapper d-lg-none">
        <button class="header-btn-menu" @click.prevent="setMenuMobileShow(true)">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>


      <div class="header-steps" ref="steps">
        <span
          v-for="(step, index) in steps"
          :key="index"
          class="header-step-item"
          :class="{
            active: index == active,
            completed: index <= active
          }"
        >
          <span class="header-step-item__content">
            <span class="header-step-item__num">{{ index + 1 }}</span
            >{{ step.text }}
          </span>
        </span>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import Logo from '~/assets/images/logo.svg?inline';

export default {
  components: {
    Logo
  },

  data() {
    return {};
  },

  computed: {
    ...mapState('common/headerPayment', ['steps']),
    ...mapGetters('common/common', ['defaultLangCode']),

    active() {
      return (
        this.steps.findIndex((step) =>
          this.$route.path.includes(step.routePath)
        ) || 0
      );
    }
  },

  mounted() {
    this.handleChangeActive(this.active);
  },

  watch: {
    active(newValue) {
      this.handleChangeActive(newValue);
    }
  },

  methods: {
    ...mapMutations('common/eventBus', [
      'setMenuMobileShow'
    ]),

    handleChangeActive(active) {
      const { steps } = this.$refs;
      if (steps && steps.scrollWidth > steps.clientWidth) {
        const stepEl = steps.querySelector(
          `.header-step-item:nth-child(${active + 1})`
        );
        if (stepEl) {
          steps.scrollLeft = stepEl.offsetLeft - 10;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/layouts/_header-payment.scss';
</style>