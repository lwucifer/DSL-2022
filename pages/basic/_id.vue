<template>
    <div class="infor-detail mb-32">
        <div class="infor-detail__banner mb-24">
            <img :src="detail_footer.avatar" alt="" class="banner-img">
            <h3 class="banner-title">{{detail_footer.title}}</h3>
        </div>

        <div class="container" v-html="detail_footer.content"></div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    computed: {   
        ...mapState('common/common', ['detail_footer'])
    },

    methods: {
        ...mapActions('common/common', ['getDetailFooter'])
    },

    mounted() {
        const page_id = this.$route.params.id;
        this.getDetailFooter({page_id})
    }
}
</script>

<style lang="scss">
@import "~assets/scss/pages/infor/_infor-detail.scss";
</style>