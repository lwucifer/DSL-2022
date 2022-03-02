<template>
    <div class="suggest-search">
        <div class="suggest-search__item">
            <h5 class="mb-3">{{$t("header.recommended_keyword")}}</h5>
            <p v-for="(item, index) in suggest" :key="index">
                <a href="" @click.prevent="appendSearch(item)">{{ item }}</a>
            </p>
        </div>

        <div class="suggest-search__item">
            <h5 class="mb-3">{{$t("header.search_history")}}</h5>

            <p v-for="(item, index) in history" :key="index">
                <a href="" @click.prevent="appendSearch(item)">{{ item }}</a>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        suggest: {
            type: [Object, Array],
            default: () => []
        },

        history: {
            type: [Object, Array],
            default: () => []
        }
    },

    methods: {
        appendSearch(_val) {
            this.$emit('append', _val)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/common/_suggest-search.scss";
</style>