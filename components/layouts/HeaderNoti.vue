<template>
  <div class="header-noti" v-click-outside="hidePanel">
    <div class="mr-4 mr-md-5 pointer icon-noti" @click.stop="isPanel = !isPanel">
      <span v-if="notification_new_amount > 0" class="number-noti">{{
        notification_new_amount
      }}</span>
      <IconBell class="icon white" />
    </div>

    <div class="header-noti__box" v-if="isPanel">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">{{ $t('header.notifications') }}</h5>
        <n-link :to="`/${defaultLangCode}/notifications`"
          >{{ $t('header.view_all') }} ({{ notification_new_amount }})</n-link
        >
      </div>

      <ul class="noti-list">
        <template v-if="isEmpty">
          <li>
            {{ $t('header.not_noti') }}
          </li>
        </template>

        <template v-else>
          <li v-for="(item, index) in dataNoti" :key="index">
            <n-link to="" @click.native="showNoti(item)">
              <div class="noti-list__title">
                <p
                  class="mb-0"
                  :class="{ 'deep-dark': item.status == READ_NOTI.UNREAD }"
                >
                  {{ item.title }}
                </p>
                <span
                  class="noti-unread"
                  v-if="item.status == READ_NOTI.UNREAD"
                ></span>
              </div>

              <p
                class="noti-list__content"
                :class="{ 'deep-dark': item.status == READ_NOTI.UNREAD }"
              >
                {{ item.content }}
              </p>

              <p
                class="noti-list__time deep-dark"
                :class="{ 'deep-dark': item.status == READ_NOTI.UNREAD }"
              >
                {{ item.at }}
              </p>
            </n-link>
          </li>
          <client-only>
            <scroll-loader
              :loader-method="loadNoti"
              :loader-disable="disable"
            />
          </client-only>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import IconBell from '~/assets/icons/bell.svg?inline';
import { mapActions, mapState, mapGetters } from 'vuex';

import { READ_NOTI, NOTI_TYPE, PRODUCT_TYPE } from '~/utils/constants';
import * as APIs from '~/utils/endpoints';

import * as configs from '~/utils/configs';
import { map, cloneDeep } from 'lodash';

export default {
  components: {
    IconBell
  },

  props: {
    popupShowNoti: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      READ_NOTI: Object.freeze(READ_NOTI),
      NOTI_TYPE: Object.freeze(NOTI_TYPE),
      disable: false,
      page: 0,
      pageSize: 30,
      dataNoti: [],
      isEmpty: false,
      isPanel: false
    };
  },

  computed: {
    ...mapState('common/user', ['notification_new_amount']),
    ...mapGetters('common/user', ['getDataNotiList']),
    ...mapGetters('common/common', ['defaultLangCode'])
  },

  mounted() {
    this.getUserNotificationNewAmount();
    // listen on change message => reCall API notification list.
    this.$fire.messaging.onMessage(async (payload) => {
      // reload data notification
      // get notification list page 1 and page size = 30
      const result = await this.getUserNotificationList({
        page_index: 1,
        page_size: this.pageSize
      });
      // if recall successed => refresh current page and update data notification
      if (result.code == configs.RES_STATUS_SUCCESS) {
        this.page = 1;
        this.dataNoti = result.data.data || [];
        this.getUserNotificationNewAmount();
      }
    });
  },

  watch: {
    $route: function () {
      this.isPanel = false;
    }
  },

  methods: {
    ...mapActions('common/user', [
      'getUserNotificationNewAmount',
      'getUserNotificationDetail',
      'getUserNotificationList',
      'getUserNotificationListData'
    ]),

    hidePanel() {
      if (!this.popupShowNoti) {
        this.isPanel = false;
      }
    },

    async showNoti(item) {
      const notiID = {
        notification_id: item.notification_id
      };

      if (item.type == NOTI_TYPE.LOGIN) {
        this.$emit('show', item);

        // update status notification
        const result = await this.getUserNotificationDetail(notiID);
        this.dataNoti = map(cloneDeep(this.dataNoti), (n) => {
          if (n.notification_id === result.notification_id) {
            n.status = 1;
          }
          return n;
        });
        // update number new notification
        await this.getUserNotificationNewAmount();
      } else {
        const result = await this.getUserNotificationDetail(notiID);
        this.dataNoti = map(cloneDeep(this.dataNoti), (n) => {
          if (n.notification_id === result.notification_id) {
            n.status = 1;
          }
          return n;
        });
        // update number new notification
        await this.getUserNotificationNewAmount();
        const { resource_id } = result;
        const { comment_type } = result;

        switch (comment_type) {
          case PRODUCT_TYPE.HOTEL:
            this.$router.push(
              `/${this.defaultLangCode}/hotel/detail/${resource_id}`
            );
            break;
          case PRODUCT_TYPE.RESTAURANT:
            this.$router.push(
              `/${this.defaultLangCode}/restaurant/detail/${resource_id}`
            );
            break;
          case PRODUCT_TYPE.TOUR:
            this.$router.push(
              `/${this.defaultLangCode}/tour/detail/${resource_id}`
            );
            break;
          case PRODUCT_TYPE.PRODUCT:
            this.$router.push(
              `/${this.defaultLangCode}/product-travel/detail/${resource_id}`
            );
            break;
          default:
            break;
        }
      }
    },

    async loadNoti() {
      this.page = this.page + 1;
      const page = {
        page_index: this.page,
        page_size: this.pageSize
      };
      const result = await this.getUserNotificationListData(page);
      this.dataNoti = [...this.dataNoti, ...result];

      // Stop scroll loading...
      this.disable = result.length < this.pageSize;
      this.isEmpty = this.dataNoti.length === 0;
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/layouts/_header-noti.scss';
</style>