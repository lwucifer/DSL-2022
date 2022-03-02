<template>
  <div>
    <div
      class="mb-16 d-flex align-items-center flex-wrap justify-content-between"
    >
      <h4 class="mr-4 title-box">{{ $t('header.list_compare') }}</h4>
      <a
        @click="reset()"
        class="d-inline-flex align-items-center"
        href="javascript:;"
      >
        <IconRollBack class="icon primary body-1 mr-2" />
        <span class="danger caption">{{ $t('account.delete_list') }}</span></a
      >
    </div>

    <div class="bg-white pb-4">
      <!-- comparison-table-wrapper -->
      <div class="comparison-table-wrapper">
        <div ref="tableHead" class="comparison-table-head" :style="{ 'margin-bottom': `-${browserScrollbarWidth}px`}" @scroll="handleTableBodyScroll">
          <!-- class="comparison-table" -->
          <table
            class="comparison-table"
          >
            <thead>
              <tr>
                <th v-for="(dataHeader, index) in listHeader" :key="index">{{ dataHeader }}</th>
              </tr>
            </thead>
          </table>
        </div>
        <div ref="tableBody" class="comparison-table-body" @scroll="handleTableBodyScroll">
          <table class="comparison-table">
            <tbody>
              <tr v-for="(items, index) in filteredItem" :key="index">
                <td v-for="(dataBody, idx) in items" :key="idx" :data-title="listHeader[idx] || ''">
                  <template v-if="new RegExp(/^-?\d+\.?\d*$/, 'g').test(dataBody)">
                    {{ dataBody | numeralFormat }}
                  </template>
                  <div v-else v-html="dataBody"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <NotFound
        class="col-12 mb-5 animated fadeIn"
        v-if="
          ((filteredItem || []).length === 0 && loaded) ||
          ((listHeader || []).length === 0 && loaded)
        "
      />
      <!-- v-if="(listBody || []).length !== 0 || (listHeader || []).length !== 0" -->
      <!-- {{ timeTableListWithPagination.pagination }} -->
      <AppPagination
        class="mt-4 mb-0 pr-16"
        :pageable="pageable"
        position="right"
        size="sm"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AppPagination from '~/components/app/AppPagination.vue';
import IconRollBack from '~/assets/icons/rollback.svg?inline';
import NotFound from '~/components/pages/common/NotFound';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import { getScrollbarWidth } from '~/utils/dom';

export default {
  components: {
    AppPagination,
    IconRollBack,
    NotFound
  },

  data() {
    return {
      pageable: {
        begin_index: 1,
        end_index: 1,
        index: 2,
        size: 30,
        sorter: null,
        total_page: 0,
        total_record: 0
      },
      paginationPage: 1,
      listBody: [],
      listHeader: [],
      loaded: false,
      lastScrollLeft: null,
    };
  },

  computed: {
    ...mapGetters('auth/auth', ['isAuthenticated']),

    filteredItem() {
      return this.listBody.slice(
        this.pageable.begin_index,
        this.pageable.end_index
      );
    }
  },

  created() {
    this.browserScrollbarWidth = 0;
    this.getList();
  },

  mounted() {
    this.browserScrollbarWidth = getScrollbarWidth();
  },

  watch: {
    '$route.query'(value) {
      if (!isNaN(value.page_index)) {
        this.calculatePagination(+value.page_index);
      }
    }
  },

  methods: {
    ...mapActions('compare/compare', ['getCompareList']),
    ...mapActions('compare/compare', ['postCompareRemove']),

    getList() {
      this.getCompareList({
        lang: this.$store.state.common.common.defaultLang.id
      }).then((response) => {
        if (!response.error) {
          this.listHeader = response.data.header;
          this.listBody = response.data.body;
          this.loaded = true;
          this.calculatePagination(1);
        }
      });
    },

    async reset(value) {
      if (this.isAuthenticated) {
        const result = await this.postCompareRemove({});
        if (result.code != RES_STATUS_SUCCESS) {
          this.$toasted.error(result.message);
        } else {
          this.$toast.global.primary(
            this.$t('home.delete') +
              ' ' +
              this.$t('comparison.delete_comparison')
          );
          this.getList();
        }
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    },

    calculatePagination(page) {
      const n = page; // trang hiện tại
      const x = this.pageable.size; // các mục trong trang
      const begin_index = (n - 1) * x;
      const end_index = (n - 1) * x + x;
      const totalPages = Math.ceil(this.listBody.length / x);

      this.pageable = {
        begin_index,
        end_index,
        index: n,
        size: x,
        sorter: null,
        total_page: totalPages,
        total_record: this.listBody.length
      };
    },

    handleTableBodyScroll(event) {
      if (event.currentTarget !== event.target) {
        return;
      }
      
      const { target } = event;
      const { tableHead, tableBody } = this.$refs;

      if (target.scrollLeft !== this.lastScrollLeft) {
        if (target === tableHead) {
          tableBody.scrollLeft = target.scrollLeft;
        }
        if (target === tableBody) {
          tableHead.scrollLeft = target.scrollLeft;
        }
      }

      this.lastScrollLeft = target.scrollLeft;
    }
  }
};
</script>

<style lang="scss" scope>
@import '~/assets/scss/pages/account/_comparison-list.scss';
</style>

