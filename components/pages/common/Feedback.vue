<template>
  <section class="feedback">
    <h2 class="feedback__title">{{ $t('hotel.review_feedback') }}</h2>

    <div class="feedback__rate">
      <div class="row">
        <div class="col-md-6">
          <div class="rate-star text-center">
            <h4 class="fw-bold deep-dark">
              {{ rating.rank | numeralFormat }} / 5
            </h4>
            <app-star-rating
              v-model="rating.rank"
              :increment="0.1"
              :border-width="4"
              border-color="#fff"
              :rounded-corners="true"
              readOnly
              :showRating="false"
              :star-points="[
                23,
                2,
                14,
                17,
                0,
                19,
                10,
                34,
                7,
                50,
                23,
                43,
                38,
                50,
                36,
                34,
                46,
                19,
                31,
                17
              ]"
            >
            </app-star-rating>
            <p>({{ rating.number_review }} {{ $t('hotel.evaluation') }})</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="write-comment text-center" v-if="!writeComment">
            <p class="mb-2">{{ $t('hotel.share_review_location') }}</p>

            <v-button variant="primary" @click="onClickWriteYourComment">{{
              $t('hotel.write_review')
            }}</v-button>
          </div>

          <div class="write-comment text-left" v-else>
            <div class="write-comment__star mb-5">
              <p>{{ $t('hotel.evaluation_2') }}:</p>
              <!-- component rate hover -->
              <app-star-rating
                v-model="ratingComment"
                :increment="1"
                :border-width="4"
                border-color="#fff"
                :rounded-corners="true"
                :star-points="[
                  23,
                  2,
                  14,
                  17,
                  0,
                  19,
                  10,
                  34,
                  7,
                  50,
                  23,
                  43,
                  38,
                  50,
                  36,
                  34,
                  46,
                  19,
                  31,
                  17
                ]"
              >
              </app-star-rating>
            </div>
            <div>
              <p>{{ $t('hotel.review') }}</p>
              <WriteComments
                :rating="ratingComment"
                v-model="comment"
                @onPostComments="handlePostComments"
              ></WriteComments>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="feedback__comment mb-6"
      v-for="(item, index) in comments"
      :key="index"
    >
      <div class="comment">
        <div class="comment__info">
          <v-avatar
            class="avatar-comment"
            :size="40"
            :src="get(item, 'avatar', null)"
          ></v-avatar>
          <div class="mr-2">
            <h5 class="mb-0 fw-bold dark-deep">{{ item.user_name || '' }}</h5>
            <p class="mb-0">{{ item.at || '' }}</p>
          </div>

          <app-star-rating
            v-model="item.rate"
            :increment="1"
            :border-width="1"
            border-color="#fff"
            :starSize="14"
            :rounded-corners="true"
            readOnly
            :showRating="false"
            :star-points="[
              23,
              2,
              14,
              17,
              0,
              19,
              10,
              34,
              7,
              50,
              23,
              43,
              38,
              50,
              36,
              34,
              46,
              19,
              31,
              17
            ]"
          >
          </app-star-rating>
        </div>

        <div class="comment__text">
          <div v-html="item.content"></div>

          <div class="comment__images">
            <OverviewImgPostComment
              :images="getImages(item)"
              :ableDelete="false"
            >
            </OverviewImgPostComment>
          </div>
        </div>

        <div class="comment__actions">
          <p
            class="comment__actions-reply mr-4"
            @click="onClickReplyComment(item.comment_id)"
          >
            {{ $t('hotel.reply') }}
          </p>
          <p
            v-if="
              get(item, 'total_reply', 0) > 3 &&
              get(item, 'total_reply', 0) !==
                get(item, 'reply_comments', []).length
            "
            class="comment__actions-read-more"
            @click="onClickShowMoreReply(item.comment_id)"
          >
            {{ $t('home.view_more') }}
          </p>
        </div>
      </div>

      <div
        class="comment has-child"
        v-for="(reply, index) in item.reply_comments"
        :key="index"
      >
        <div class="comment__info">
          <v-avatar
            class="avatar-comment"
            :size="40"
            :src="reply.avatar"
          ></v-avatar>
          <div>
            <h5 class="mb-0 fw-bold dark-deep">
              {{ get(reply, 'user_name', '') }}
            </h5>
            <p class="mb-0">{{ get(reply, 'at', '') }}</p>
          </div>
        </div>

        <div class="comment__text">
          <p>{{ get(reply, 'content', '') }}</p>

          <div class="comment__images">
            <OverviewImgPostComment
              :images="getImages(reply)"
              :ableDelete="false"
            >
            </OverviewImgPostComment>
          </div>
        </div>
      </div>
      <div
        :ref="`reply-${item.comment_id}`"
        class="comment__reply comment__post-comment-reply"
      >
        <WriteComments
          v-model="comment"
          :comment_id="item.comment_id"
          @onPostComments="handlePostComments"
        ></WriteComments>
      </div>
    </div>

    <slot name="load-more" />

    <v-modal
      v-model="showModalNoti"
      :header="false"
      :footer="false"
      :width="360"
      size="lg"
      centered
      @cancel="onCloseShowModalNoti"
    >
      <div class="text-center">
        <h4 class="mb-5">
          {{ $t('hotel.write_review_success') }}
        </h4>
        <IconChecked class="my-5" style="width: 40px; height: 40px" />
      </div>
    </v-modal>
  </section>
</template>

<script>
import AppStars from '~/components/app/AppStars';
import AppStarRating from '~/components/app/AppStarRating';
import OverviewImgPostComment from '~/components/pages/common/OverviewImgPostComment';

import WriteComments from '~/components/pages/common/WriteComments';

import IconStar from '~/assets/icons/star.svg?inline';
import IconCamera from '~/assets/icons/camera.svg?inline';
import IconChecked from '~/assets/icons/check-circle-filled.svg?inline';

import { PRODUCT_TYPE, COMMENTS } from '~/utils/constants';

import { mapGetters, mapActions, mapMutations } from 'vuex';
import * as configs from '~/utils/configs';

import { get, map } from 'lodash';

export default {
  components: {
    AppStars,
    IconStar,
    AppStarRating,
    IconCamera,
    OverviewImgPostComment,
    WriteComments,
    IconChecked
  },
  props: {
    rating: {
      type: Object,
      default: () => ({})
    },
    comments: {
      type: Array,
      default: () => []
    },
    product_type: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      COMMENTS,
      modalCreateCommnet: false,
      writeComment: false,
      comment: '',
      commentChild: '',
      ratingComment: 0,
      fileList: [],
      totalFile: [],
      showModalNoti: false,
      setTimer: null
    };
  },

  computed: {
    ...mapGetters('auth/auth', ['userInfo']),

    ...mapGetters('hotel/hotel', [
      'hotelCommentCurrentPage',
      'isHotelCommentLastPage'
    ]),

    ...mapGetters('tour/tour', [
      'tourCommentCurrentPage',
      'isTourCommentLastPage'
    ]),

    ...mapGetters('restaurant/restaurant', [
      'restaurantCommentCurrentPage',
      'isRestaurantCommentLastPage'
    ]),

    ...mapGetters('productTravel/productTravel', [
      'productTravelCommentCurrentPage',
      'isProductTravelCommentLastPage'
    ]),

    ...mapGetters('news/news', [
      'newCommentCurrentPage',
      'isNewCommentLastPage'
    ])
  },

  methods: {
    /**
     * Actions
     */
    ...mapActions('common/common', ['postRatingEvalueate']),

    ...mapActions('hotel/hotel', [
      'getHotelCommentDetail',
      'getHotelDetail',
      'getHotelComment'
    ]),

    ...mapActions('tour/tour', [
      'getTourCommentDetail',
      'getTourDetail',
      'getTourComment'
    ]),

    ...mapActions('restaurant/restaurant', [
      'getRestaurantCommentDetail',
      'getRestaurantDetail',
      'getRestaurantComment'
    ]),

    ...mapActions('productTravel/productTravel', [
      'getProductTravelCommentDetail',
      'getProductTravelDetail',
      'getProductTravelComment'
    ]),

    ...mapActions('news/news', [
      'getNewsCommentDetail',
      'getNewsDetail',
      'getNewsComment'
    ]),
    /**
     * Mutatations
     */
    ...mapMutations('hotel/hotel', [
      'setHotelPostComment',
      'setHotelCommentReplyUpdate'
    ]),

    ...mapMutations('tour/tour', [
      'setTourPostComment',
      'setTourCommentReplyUpdate'
    ]),

    ...mapMutations('restaurant/restaurant', [
      'setRestaurantPostComment',
      'setRestaurantCommentReplyUpdate'
    ]),

    ...mapMutations('productTravel/productTravel', [
      'setProductTravelPostComment',
      'setProductTravelCommentReplyUpdate'
    ]),

    ...mapMutations('news/news', [
      'setNewsPostComment',
      'setNewsCommentReplyUpdate'
    ]),

    get,

    onClickReplyComment(_id = '') {
      const ref = `reply-${_id}`;
      for (let i = 0; i < this.comments.length; i++) {
        const refId = `reply-${this.comments[i].comment_id}`;

        if (refId === ref) {
          this.writeComment = false;
          this.$refs[refId][0].classList.add('comment__active');
        } else {
          this.$refs[refId][0].classList.remove('comment__active');
        }
      }
      this.refreshData();
    },

    getImages(_comment) {
      const imgs = get(_comment, 'images', []);
      const tranform = map(imgs, (i) => {
        return {
          url: i,
          type: 'image/jpeg'
        };
      });
      return tranform;
    },

    onClickWriteYourComment() {
      this.writeComment = true;
      this.onClickReplyComment();
      this.refreshData();
    },

    async onClickShowMoreReply(_id) {
      
      switch (this.product_type) {
        case PRODUCT_TYPE.HOTEL:
          await this.getHotelCommentDetail({ comment_id: _id });
          break;
        case PRODUCT_TYPE.TOUR:
          await this.getTourCommentDetail({ comment_id: _id });
          break;
        case PRODUCT_TYPE.RESTAURANT:
          await this.getRestaurantCommentDetail({ comment_id: _id });
          break;
        case PRODUCT_TYPE.PRODUCT:
          await this.getProductTravelCommentDetail({ comment_id: _id });
          break;
        case PRODUCT_TYPE.NEW:
          await this.getNewsCommentDetail({ comment_id: _id });
          break;

        default:
          break;
      }
    },

    refreshData() {
      this.comment = '';
      this.ratingComment = 0;
      this.fileList = [];
      this.totalFile = [];
    },

    onCloseShowModalNoti() {
      this.showModalNoti = false;
      clearTimeout(this.setTimer);
    },

    async refreshValueRating() {
      const id = this.$route.params.id;
      switch (this.product_type) {
        case PRODUCT_TYPE.HOTEL:
          await this.getHotelDetail({ hotel_id: id });
          break;
        case PRODUCT_TYPE.TOUR:
          await this.getTourDetail({ tour_id: id });
          break;
        case PRODUCT_TYPE.RESTAURANT:
          await this.getRestaurantDetail({ restaurant_id: id });
          break;
        case PRODUCT_TYPE.PRODUCT:
          await this.getProductTravelDetail({ product_id: id });
          break;
        case PRODUCT_TYPE.POST:
          await this.getNewsDetail({ post_id: id });
          break;
        default:
          break;
      }
    },

    async handlePostComments(_payload) {
      let payload = {
        ..._payload,
        rate_score: this.ratingComment,
        product_type: this.product_type
      };

      const posted = await this.postRatingEvalueate(payload);

      if (posted.code == configs.RES_STATUS_SUCCESS) {
        if (!payload.reply_id) {
          this.showModalNoti = true;
          this.setTimer = setTimeout(() => {
            this.showModalNoti = false;
          }, 2000);
        }

        this.refreshData();
        await this.refreshValueRating();
        // approval_status === 0 => need confirm from admin
        if (posted.data.approval_status === configs.RES_STATUS_SUCCESS) return;
        switch (this.product_type) {
          case PRODUCT_TYPE.HOTEL:
            // if post new comment or reply comment
            if (!payload.reply_id) {
              if (this.hotelCommentCurrentPage <= 1) {
                this.getHotelComment({
                  hotel_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: 1
                });
              } else {
                await this.setHotelPostComment(posted.data);

                this.getHotelComment({
                  hotel_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: this.hotelCommentCurrentPage
                });
              }
            } else {
              await this.setHotelCommentReplyUpdate(posted.data);
            }

            break;

          case PRODUCT_TYPE.TOUR:
            if (!payload.reply_id) {
              if (this.tourCommentCurrentPage <= 1) {
                this.getTourComment({
                  tour_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: 1
                });
              } else {
                await this.setTourPostComment(posted.data);

                this.getTourComment({
                  tour_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: this.tourCommentCurrentPage
                });
              }
            } else {
              await this.setTourCommentReplyUpdate(posted.data);
            }

            break;

          case PRODUCT_TYPE.RESTAURANT:
            if (!payload.reply_id) {
              if (this.restaurantCommentCurrentPage <= 1) {
                this.getRestaurantComment({
                  restaurant_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: 1
                });
              } else {
                await this.setRestaurantPostComment(posted.data);

                this.getRestaurantComment({
                  restaurant_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: this.restaurantCommentCurrentPage
                });
              }
            } else {
              await this.setRestaurantCommentReplyUpdate(posted.data);
            }
            break;

          case PRODUCT_TYPE.PRODUCT:
            if (!payload.reply_id) {
              if (this.productTravelCommentCurrentPage <= 1) {
                this.getProductTravelComment({
                  product_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: 1,
                  sub_comment_size: 3
                });
              } else {
                await this.setProductTravelPostComment(posted.data);

                this.getProductTravelComment({
                  product_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: this.productTravelCommentCurrentPage,
                  sub_comment_size: 3
                });
              }
            } else {
              await this.setProductTravelCommentReplyUpdate(posted.data);
            }
            break;

          case PRODUCT_TYPE.NEW:
            if (!payload.reply_id) {
              if (this.newCommentCurrentPage <= 1) {
                this.getNewsComment({
                  post_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: 1,
                  sub_comment_size: 3
                });
              } else {
                await this.setNewsPostComment(posted.data);

                this.getNewsComment({
                  post_id: get(this.$route.params, 'id', null),
                  page_size: COMMENTS.PAGE_SIZE,
                  page_index: this.newCommentCurrentPage,
                  sub_comment_size: 3
                });
              }
            } else {
              await this.setNewsCommentReplyUpdate(posted.data);
            }
            break;

          default:
            break;
        }
      } else {
        this.$toast.error(posted.message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_feedback.scss';
</style>