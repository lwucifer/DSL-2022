<template>
  <div class="container py-24">
    <div class="detail-travel">
      <OverviewImg
        typeService="travel"
        :isLocal="false"
        :title="name"
        :images="images"
        :btn-booking-link="{
          path: `/${defaultLangCode}/booking/product-travel`,
          query: {
            id: get(productTravelDetail, 'productId', null),
            amount: 1
          }
        }"
        :btn-booking-text="$t('product.order_now')"
        :product-type="PRODUCT_TYPE.PRODUCT"
        :status="status"
        :is-favorite="!!productTravelDetail.is_favorite"
        :share="false"
        @favorite="handleFavorite"
      >
        <!-- tạm ẩn disable chức năng đặt trước 20/1-->
        <v-button
          v-if="status !== PRODUCT_STATUS.OUT_OF_STOCK"
          slot="booking"
          variant="primary"
          :class="{
            'btn-booking-clickable': status === PRODUCT_STATUS.OUT_OF_STOCK,
            'overview-img__btn-booking': status === PRODUCT_STATUS.DISABLED
          }"
          nuxt
          :to="{
            path:
              status === PRODUCT_STATUS.OUT_OF_STOCK
                ? `/${defaultLangCode}/booking/product-travel/pre-order`
                : `/${defaultLangCode}/booking/product-travel`,
            query: {
              id: get(productTravelDetail, 'productId', null),
              amount: 1
            }
          }"
          :disabled="status === PRODUCT_STATUS.DISABLED"
          >{{
            status === PRODUCT_STATUS.OUT_OF_STOCK
              ? $t('product.btn_out_of_stock')
              : $t('product.order_now')
          }}</v-button
        >
      </OverviewImg>
      <TabNav
        :tabs="dataTabs"
        @click-tab="handleClickTab"
      />
      <OverviewBlock class="mb-24" :content="content" id="info"></OverviewBlock>
      <BuyItem
        :price="price"
        :id="productTravelDetail.productId"
        :status="status"
      />
      <Introduction :data="description" id="location_sale" />
      <LocalAround
        :type="PRODUCT_TYPE.PRODUCT"
        :data="[]"
        :center="{
          lat: get(productTravelDetail, 'lat', 0),
          lon: get(productTravelDetail, 'lon', 0)
        }"
      />
      <Feedback
        id="review"
        class="mb-24"
        :rating="rating"
        :comments="get(productTravelComment, 'data', [])"
        :product_type="PRODUCT_TYPE.PRODUCT"
      >
        <template
          v-if="get(productTravelComment, 'pageable', []).total_page > 1"
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
      <IsCare
        v-if="suggestion"
        id="suggestions"
        class="mb-24"
        :data="productTravelRelated"
        :is-navigation="!!productTravelRelated.length"
      >
        <template slot="slider-items">
          <DestinationBox
            v-for="(item, index) in filterProductTravelRelated"
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
              >/
              {{ renderTextPricde(item.product_type) }}
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
import OverviewImg from '~/components/pages/common/OverviewImg';
import BuyItem from '~/components/pages/product-travel/BuyItem';
import Introduction from '~/components/pages/common/Introduction';
import LocalAround from '~/components/pages/common/LocalAround';
import Feedback from '~/components/pages/common/Feedback';
import IsCare from '~/components/pages/common/IsCare';
import OverviewBlock from '~/components/pages/common/OverviewBlock';
import { mapState, mapGetters, mapActions } from 'vuex';
import { PRODUCT_TYPE, COMMENTS, PRODUCT_STATUS } from '~/utils/constants';
import { get, throttle } from 'lodash';
import TabNav from '~/components/pages/common/TabNav';
import { offset } from '~/utils/dom';
export default {
  components: {
    OverviewImg,
    BuyItem,
    Introduction,
    LocalAround,
    Feedback,
    IsCare,
    OverviewBlock,
    TabNav
  },

  data() {
    return {
      tabTravel: [
        {
          title: this.$t('hotel.overview'),
          attrs: {
            href: '#info'
          }
        },
        {
          title: this.$t('product.local_buy'),
          attrs: {
            href: '#location_sale'
          }
        },
        {
          title: this.$t('hotel.evaluation_2'),
          attrs: {
            href: '#review'
          }
        },
        {
          title: this.$t('tour.maybe_interested'),
          attrs: {
            href: '#suggestions'
          }
        }
      ],
      type: PRODUCT_TYPE.PRODUCT,
      page_index: 1
    };
  },
  async fetch() {
    const { id, category_id } = this.$route.params;
    await Promise.all([
      this.getProductTravelDetail({
        product_id: id,
        category_id
      }),
      this.getProductTravelRelated({
        product_id: id
      }),
      this.getProductTravelComment({
        product_id: id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: 1,
        sub_comment_size: 3
      })
    ]);
  },
  computed: {
    ...mapGetters('productTravel/productTravel', [
      'productTravelDetail',
      'productTravelRelated',
      'productTravelComment'
    ]),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),
    filterAttributes() {
      return get(this.productTravelDetail, 'attributes', []);
    },
    content() {
      let arr = [];
      this.filterAttributes.map((item) => {
        if (item && item.ofSystem && item.ofSystem === 2) {
          arr.push({
            title: item.attributeName,
            text: get(item, 'values.0.value', []).join(', ')
          });
        }
      });
      return arr;
    },
    name() {
      let name = '';
      this.filterAttributes.map((item) => {
        if (item && item.attributeId && item.attributeId === 2) {
          name = get(item, 'values.0.value.0', '');
        }
      });
      return name;
    },
    images() {
      let listImages = [];
      this.filterAttributes.map((item) => {
        if (item && item.attributeId && item.attributeId === 13) {
          const images = get(item, 'values.0.value', []);
          listImages = images.map((i) => {
            return {
              url: i,
              type: 1
            };
          });
        }
      });
      return listImages;
    },
    status() {
      let status = 1;
      this.filterAttributes.map((item) => {
        if (item && item.attributeId && item.attributeId === 10) {
          status = Number(get(item, 'values.0.value.0', ''));
        }
      });
      return status;
    },
    price() {
      let price = '';
      this.filterAttributes.map((item) => {
        if (item && item.attributeId && item.attributeId === 11) {
          price = get(item, 'values.0.value.0', '');
        }
      });
      return price;
    },
    description() {
      let descriptionShort = '';
      let description = '';
      this.filterAttributes.map((item) => {
        if (item && item.attributeId && item.attributeId === 4) {
          descriptionShort = `${get(item, 'attributeName', '')}: ${get(
            item,
            'values.0.value.0',
            ''
          )}`;
        }
        if (item && item.attributeId && item.attributeId === 5) {
          description = `${get(item, 'attributeName', '')}: ${get(
            item,
            'values.0.value.0',
            ''
          )}`;
        }
      });
      return {
        title: this.$t('product.description_product'),
        intro: descriptionShort,
        content: description
      };
    },
    address() {
      let address = '';
      this.filterAttributes.map((item) => {
        if (item && item.attributeId && item.attributeId === 10) {
          address = get(item, 'values.0.value.0', '');
        }
      });
      return address;
    },
    suggestion() {
      let suggestion = false;
      this.filterAttributes.map((item) => {
        if (item && item.attributeId && item.attributeId === 17) {
          suggestion = get(item, 'values.0.value.0', '') === '1' ? true : false;
        }
      });
      return suggestion;
    },
    maps() {
      let map = false;
      this.filterAttributes.map((item) => {
        if (item && item.attributeId && item.attributeId === 15) {
          map = get(item, 'values.0.value.0', '') === '1' ? true : false;
        }
      });
      return map;
    },
    filterProductTravelRelated() {
      const data = this.productTravelRelated.map((item) => {
        return {
          ...item,
          link: this.renderLink(item.product_type, item.id)
        };
      });
      return data;
    },

    rating() {
      const vote_number = get(this.productTravelDetail, 'voteNumber', 0);
      const vote_score = get(this.productTravelDetail, 'voteScore', 0);

      return {
        number_review: vote_number,
        rank: vote_score
      };
    },

    enableBtnLoadMore() {
      const pageable = get(this.productTravelComment, 'pageable', {});

      return pageable.total_page > this.page_index;
    },

    dataTabs() {
      const data = [
        {
          title: this.$t('hotel.overview'),
          attrs: {
            href: '#info'
          }
        }
      ];
      if (this.maps) {
        data.push({
          title: this.$t('product.local_buy'),
          attrs: {
            href: '#location_sale'
          }
        });
      }
      data.push({
        title: this.$t('hotel.evaluation_2'),
        attrs: {
          href: '#review'
        }
      });
      if (this.suggestion) {
        data.push({
          title: this.$t('tour.maybe_interested'),
          attrs: {
            href: '#suggestions'
          }
        });
      }
      return data;
    }
  },
  created() {
    this.PRODUCT_TYPE = Object.freeze(PRODUCT_TYPE);
    this.COMMENTS = Object.freeze(COMMENTS);
    this.PRODUCT_STATUS = Object.freeze(PRODUCT_STATUS);
  },
  mounted() {
    window.addEventListener('scroll', this.handleWindowScroll);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleWindowScroll);
  },
  methods: {
    get,
    ...mapActions('productTravel/productTravel', [
      'getProductTravelDetail',
      'getProductTravelRelated',
      'getProductTravelComment',
      'postProductTravelDetailFavourite'
    ]),

    renderLink(value, id) {
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

    async handleFavorite() {
      if (this.isAuthenticated) {
        const { productId, is_favorite } = this.productTravelDetail;
        const doFavorite = await this.postProductTravelDetailFavourite({
          type: PRODUCT_TYPE.PRODUCT,
          id: productId,
          isFavorite: is_favorite ? 0 : 1
        });

        this.$toast.global.primary(
          is_favorite
            ? this.$t('home.delete') + ' ' + this.$t('home.from_list_favourite')
            : this.$t('home.save') + ' ' + this.$t('home.to_list_favourite')
        );
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    },

    onClickLoading() {
      this.page_index = this.enableBtnLoadMore ? this.page_index + 1 : 1;
      this.getProductTravelComment({
        product_id: this.$route.params.id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: this.page_index,
        sub_comment_size: 3
      });
    },

    handleClickTab(event, tab) {
      event.preventDefault();
      const linkEl = event.target;
      const { href } = tab.attrs;
      const section = document.querySelector(href);

      window.scrollTo({
        top: offset(section).top - linkEl.clientHeight - 24,
        behavior: 'smooth'
      });
    },

    handleWindowScroll: throttle(function (event) {
      const tabNavEl = document.querySelector('.tab-nav .tab-nav__content');
      const mainNavLinks = document.querySelectorAll(".tab-nav a[href^='#']");
      if (!mainNavLinks || mainNavLinks.length < 1) return;

      let fromTop = window.scrollY + mainNavLinks[0].clientHeight + 24;

      mainNavLinks.forEach((link) => {
        let section = document.querySelector(link.hash);
        if (!section) return;

        if (
          section.offsetTop <= fromTop &&
          section.offsetTop + section.offsetHeight > fromTop
        ) {
          link.classList.add('active');
          tabNavEl.scrollLeft = link.offsetLeft;
        } else {
          link.classList.remove('active');
        }
      });
    }, 150)
  }
};
</script>

<style scoped>
.btn-booking-clickable {
  pointer-events: auto;
}
</style>