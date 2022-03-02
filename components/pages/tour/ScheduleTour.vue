<template>
  <section class="schedule-tour bg-white pa-16">
    <h2 class="schedule-tour__title heading-5 mb-16">{{$t("tour.schedule")}}</h2>

    <div class="schedule-tour__day">
      <template v-for="(item, index) in data">
        <div v-if="item.status" :key="item.id" class="schedule-tour__day-item">
          <h3
            class="schedule-tour__day-title body-2 secondary"
            :class="{ 'has-detail': !!item.detail }"
            @click="setActive(item, index)"
          >
            {{ item.journeys }}
          </h3>
          <ul class="schedule-tour__day-schedule" v-if="active.includes(index)">
            <li v-if="item.detail" v-html="item.detail" class="deep-dark"></li>
          </ul>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      active: [0]
    };
  },

  methods: {
    setActive(item, index) {
      if (!item.detail) return;
      if (this.active.includes(index)) {
        this.active = this.active.filter((item) => item != index);
      } else {
        this.active = [...this.active, index];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/pages/tour/_schedule-tour.scss';
</style>