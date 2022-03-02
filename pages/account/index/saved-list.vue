<template>
  <div class="pa-16 border-radius bg-white">
    <h4 class="mb-16">{{ $t('header.bookmarks') }}</h4>
    <InputSearch
      v-model.trim="inputSearch"
      class="mb-16"
      :placeholder="$t('header.input_search')"
      @search="search"
    />
    <div class="row g-4 g-xl-default">
      <div
        v-for="(item, index) in favoriteList"
        class="col-6 col-md-4 mb-24"
        :key="index"
      >
        <DestinationBox
          type="no-box"
          :img-attrs="{
            src: item.thumbnail,
            alt: item.name
          }"
          :to="checkDetail(item)"
          :title="item.name"
          :rating="item.rating_score"
          :ratingCount="item.rating_number"
          :is-liked="!!item.fav_type"
          :address="item.description"
          :has-actions="false"
          :status="item.status"
          has-close
          has-price
          @close="openDelete(item)"
        />
      </div>
      <div class="container">
        <AppPagination :pageable="favoritePagination" />
      </div>
      <v-modal
        v-model="confirmDelete"
        :header="false"
        :width="1200"
        size="lg"
        centered
        @cancel="confirmDelete = false"
        @ok="changeDelete(fakeData.id, fakeData.fav_type)"
      >
        <div class="text-center">
          <h3 class="mb-5">
            {{ $t('header.sure_delete') }}
          </h3>
          <IconTrash class="my-5" />
        </div>
      </v-modal>
    </div>
    <NotFound
      class="col-12 mb-5 animated fadeIn"
      v-if="favoriteList && favoriteList.length === 0 && loaded"
    />
  </div>
</template>

<script>
import InputSearch from '~/components/pages/common/InputSearch.vue';
import DestinationBox from '~/components/pages/common/DestinationBox.vue';
import IconTrash from '~/assets/icons/trash.svg?inline';
import { FAVORITE_REMOVE } from '~/utils/endpoints';
import { mapActions, mapGetters, mapState } from 'vuex';
import NotFound from '~/components/pages/common/NotFound';
import { PAGER } from '~/utils/constants';

export default {
  components: {
    InputSearch,
    DestinationBox,
    IconTrash
  },
  async fetch() {
    await Promise.all([
      this.getFavoriteList({
        search: this.inputSearch,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        ...this.$route.query
      })
    ]);
  },
  computed: {
    ...mapGetters('favorite/favorite', ['favoriteList', 'favoritePagination']),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('common/common', ['defaultLangCode'])
  },

  data: () => ({
    likeLoading: false,
    listItems: [],
    fakeData: [],
    inputSearch: '',
    confirmDelete: false,
    loaded: false
  }),

  methods: {
    openDelete(value) {
      this.confirmDelete = true;
      this.fakeData = value;
    },
    checkDetail(value) {
      if (value.fav_type == 1) {
        return `/${this.defaultLangCode}/hotel/detail/${value.id}`;
      } else if (value.fav_type == 2) {
        return `/${this.defaultLangCode}/restaurant/detail/${value.id}`;
      } else if (value.fav_type == 3) {
        return `/${this.defaultLangCode}/tour/detail/${value.id}`;
      } else if (value.fav_type == 4) {
        return `/${this.defaultLangCode}/product-travel/detail/${value.id}`;
      }
    },
    search(value) {
      this.getFavoriteList({
        search: this.inputSearch,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        ...this.$route.query
      });
    },
    ...mapActions('favorite/favorite', ['getFavoriteList']),
    ...mapActions('favorite/favorite', ['postFavoriteRemove']),
    async changeDelete(savelId, isLike) {
      const doLike = await this.postFavoriteRemove({
        type: isLike,
        id: savelId
      });
      this.$toast.global.primary(
        this.$t('home.delete') +
          ' ' +
          this.$t('header.product') +
          ' ' +
          this.$t('home.from_list_favourite') +
          ' ' +
          this.$t('header.success')
      );
      this.likeLoading = false;
      this.confirmDelete = false;
      this.getFavoriteList({
        search: this.inputSearch,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        ...this.$route.query
      });
    }
  },
  watch: {
    '$route.query': function (newValue) {
      this.getFavoriteList({
        search: this.inputSearch,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        ...this.$route.query
      });
      this.$scrollTo('#container-common-search-form');
    }
  }
};
</script>

<style lang="scss">
</style>