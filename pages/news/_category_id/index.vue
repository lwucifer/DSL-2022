<template>
    <div class="news">
        <div class="container">
            <div v-for="(item, index) in listNewsItems.slice(0, 1)" :key="index">
                <NewIntro :data="item" :banner="news_banner"/>
            </div>

            <div class="row">
                <div class="col-12 col-md-4 mb-24" v-for="(item, index) in sliceData" :key="index">
                    <NewBox :data="item"/>
                </div>
            </div>

            <div class="news__btn text-center mt-3 mb-32" v-if="slice < listNewsItems.length">
                <v-button variant="secondary" size="lg" @click="loadMore">{{$t("home.view_more")}}</v-button>
            </div>
        </div>
    </div>
</template>

<script>

import NewIntro from "~/components/pages/news/NewIntro"
import NewBox from "~/components/pages/news/NewBox"

import { mapActions, mapGetters, mapState } from 'vuex';
import { NEW_TYPE } from "~/utils/constants"

export default {
    components: {
        NewIntro,
        NewBox
    },

    data() {
        return {
            slice: 4
        }
    },

    computed: {
        ...mapState('news/news', ['news_banner']),
        ...mapGetters('news/news', ['listNewsItems']),

        sliceData() {
            return this.listNewsItems.slice(1, this.slice)
        }
    },

    methods: {
        ...mapActions('news/news', ['getListNews', 'getNewsBanner']),

        loadMore() {
            this.slice = this.listNewsItems.length;
        }
    },

    mounted() {
        const { category_id } = this.$route.params;
        this.getListNews({ type: NEW_TYPE.NORMAL, category_id });
        this.getNewsBanner({ type: NEW_TYPE.NORMAL, id: this.$route.params.category_id });
    }
}
</script>

<style>

</style>