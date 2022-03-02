<template>
    <div class="banner-pages text-center" :style="{ 'background-image': 'url(' + img.thumbnail + ')' }">
        <div>
            <div class="banner-pages__title">{{ summary.name }}</div>
            <div class="banner-pages__text">{{ summary.introduce }}</div>
        </div>
    </div>
</template>

<script>
import {get} from 'lodash';

export default {
    props: {
        img: {
            type: Object,
            default: () => ({})
        },

        summary: {
            type: Object,
            default: () => ({})
        }
    },

    methods: {
        get,
    }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_banner-pages.scss';
</style>