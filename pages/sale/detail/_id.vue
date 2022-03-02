<template>
  <div class="sale-detail">
    <div class="sale-detail__img">
      <img :src="detail.avatar" alt="" />
    </div>

    <div class="container">
      <h3 class="sale-detail__title">{{ detail.post_name }}</h3>

      <div class="sale-detail__content" v-html="detail.content"></div>

      <div class="sale-detail__code">
        <h5 class="text-center mb-16">{{ $t('sale.promotions_code') }}</h5>

        <div class="field-code">
          <v-input v-model="detail.promotions_code" id="input-code" readonly></v-input>
          <v-button
            class="btn-copy-code"
            variant="secondary"
            size="lg"
            @click="copyCode"
            >{{ $t('sale.copy') }}</v-button
          >
        </div>
      </div>

      <BoxWrapper
        class="mb-24"
        v-if="listNewsRelated && listNewsRelated.length > 0"
      >
        <template v-slot:title
          ><h5 class="mb-0">{{ $t('sale.orther_promotions') }}</h5></template
        >

        <template v-slot:content>
          <NewRelated :data="listNewsRelated" />
        </template>
      </BoxWrapper>

      <TabNav :tabs="dataTabs" @click-tab="handleClickTab" />
      <!--  when have api remove !  -->
      <Feedback
        v-if="detail.enable_rating === 1"
        id="review"
        class="mb-24"
        :rating="get(detail, 'rating', {})"
        :comments="get(newComments, 'data', [])"
        :product_type="PRODUCT_TYPE.POST"
      >
        <template
          v-if="get(this.newComments, 'pageable', {}).total_page > 1"
          v-slot:load-more
        >
          <div class="feedback__more text-center">
            <v-button
              @click="onClickLoading"
              variant="outline-secondary"
              outline
            >
              {{
                enableBtnLoadMore
                  ? $t('hotel.view_more')
                  : $t('restaurant.collapse')
              }}</v-button
            >
          </div>
        </template>
      </Feedback>
      <!--  when have api remove !  -->
      <IsCare
        v-if="detail.enable_suggestion === 1"
        id="interested"
        class="mb-24"
        :data="newsRelatedIscareData"
        :is-navigation="!!newsRelatedIscareData.length"
      >
        <template slot="slider-items">
          <DestinationBox
            v-for="(item, index) in filterNewsRelatedIscareData"
            :key="index"
            class="mb-5 swiper-slide"
            type="box"
            :img-attrs="{
              src: item.product_thumbnail_url,
              alt: item.name
            }"
            isShare
            hasPrice
            :hasActions="false"
            :price="item.from_price"
            :priceRed="item.discount"
            :to="item.link"
            :title="item.name"
            :rating="item.rate"
            :ratingCount="item.number_of_rate"
            :isLiked="!!item.is_favorite"
            :address="item.address"
            :product_type="item.product_type"
            :product_id="item.id"
            :status="item.status"
          >
            <div slot="price" v-if="item.from_price">
              {{ $t('hotel.form') }}
              <span class="color-primary">
                {{
                  item.from_price
                    | priceTransform(currentExchangeRate)
                    | numeralFormat
                }}
                {{ currentUnitCode }} </span
              >/ {{ renderTextPricde(item.product_type) }}
            </div>
          </DestinationBox>
        </template>
        <template slot="title">
          <h5 class="deep-dark">{{ $t('hotel.maybe_interested') }}</h5>
        </template>
      </IsCare>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

import BoxWrapper from '~/components/pages/home/BoxWrapper';
import NewRelated from '~/components/pages/news/NewRelated';
import Feedback from '~/components/pages/common/Feedback';
import IsCare from '~/components/pages/common/IsCare';
import { get } from 'lodash';
import TabNav from '~/components/pages/common/TabNav';
import { PRODUCT_TYPE, COMMENTS, PAGER } from '~/utils/constants';
import { offset } from '~/utils/dom';

export default {
  components: {
    BoxWrapper,
    NewRelated,
    Feedback,
    IsCare,
    TabNav
  },

  data() {
    return {
      PRODUCT_TYPE,
      COMMENTS,
      type: PRODUCT_TYPE.POST,
      page_index: 1
    };
  },

  async fetch() {
    const { id, category_id } = this.$route.params;
    await Promise.all([
      this.getNewRelatedIscare({
        post_id: id,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE_LIMIT,
        currency: this.defaultCurrency.id
      }),
      this.getNewsComment({
        post_id: id,
        category_id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: 1
      }),
      this.getNewsDetail({ post_id: id, category_id }),
      this.getNewsRelated({ type: 2, post_id: id })
    ]);
  },

  computed: {
    ...mapState('news/news', {
      detail: 'detail',
      newComments: 'new_comments'
    }),
    ...mapGetters('news/news', ['listNewsRelated', 'newsRelatedIscareData']),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),
    ...mapState('common/common', ['defaultCurrency']),
    filterNewsRelatedIscareData() {
      const data = this.newsRelatedIscareData.map((item) => {
        return {
          ...item,
          link: this.renderLink(item.product_type, item.id)
        };
      });
      return data;
    },

    enableBtnLoadMore() {
      const pageable = get(this.newComments, 'pageable', {});

      return pageable.total_page > this.page_index;
    },

    dataTabs() {
      const data = [];
      // when have api remove ! //
      if (this.detail.enable_rating) {
        data.push({
          title: this.$t('hotel.evaluation_2'),
          attrs: {
            href: '#review'
          }
        });
      }
      if (this.detail.enable_suggestion) {
        data.push({
          title: this.$t('hotel.maybe_interested'),
          attrs: {
            href: '#interested'
          }
        });
      }
      return data;
    }
  },

  methods: {
    get,
    ...mapActions('news/news', [
      'getNewsDetail',
      'getNewsRelated',
      'getNewRelatedIscare',
      'getNewsComment',
      'getNewsCommentDetail'
    ]),

    renderTextPricde(value) {
      switch (value) {
        case PRODUCT_TYPE.HOTEL:
          return this.$t('hotel.night');
          break;
        case PRODUCT_TYPE.RESTAURANT:
          return this.$t('hotel.people');
          break;
        case PRODUCT_TYPE.TOUR:
          return this.$t('hotel.people');
          break;
        case PRODUCT_TYPE.PRODUCT:
          return this.$t('product.index');
          break;
        default:
          break;
      }
    },

    renderLink(value, id) {
      const { category_id } = this.$route.params;
      switch (value) {
        case PRODUCT_TYPE.HOTEL:
          return `/${this.defaultLangCode}/hotel/detail/${id}`;
          break;
        case PRODUCT_TYPE.RESTAURANT:
          return `/${this.defaultLangCode}/restaurant/detail/${id}`;
          break;
        case PRODUCT_TYPE.TOUR:
          return `/${this.defaultLangCode}/tour/detail/${id}`;
          break;

        case PRODUCT_TYPE.PRODUCT:
          return `/${this.defaultLangCode}/product-travel/detail/${id}`;
          break;
        case PRODUCT_TYPE.POST:
          return `/${this.defaultLangCode}/news/detail/${id}`;
          break;
        default:
          break;
      }
    },

    handleClickTab(event, tab) {
      event.preventDefault();
      const linkEl = event.target;
      const { href } = tab.attrs;

      if (!href) return;
      const section = document.querySelector(href);
      if (!section || section.length < 1) return;

      window &&
        window.scrollTo({
          top: offset(section).top - linkEl.clientHeight - 24,
          behavior: 'smooth'
        });
    },

    onClickLoading() {
      this.page_index = this.enableBtnLoadMore ? this.page_index + 1 : 1;
      this.getNewsComment({
        post_id: this.$route.params.id,
        category_id: this.$route.params.category_id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: this.page_index
      });
    },

    copyCode() {
      let codeToCopy = document.querySelector('#input-code');
      codeToCopy.setAttribute('type', 'text');
      codeToCopy.select();

      try {
        let successful = document.execCommand('copy');
        let msg = successful
          ? this.$t('header.success')
          : this.$t('home.failed');
        this.$toast.success(this.$t('sale.code_copied') + ' ' + msg);
      } catch (err) {
        this.$toast.error(this.$t('sale.sr_unable_copy'));
      }
    }
  }
};
</script>

<style lang="scss">
@import '~assets/scss/pages/news/_sale-detail.scss';
</style>