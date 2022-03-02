<template>
    <a 
        href="#" 
        v-scroll-to="{
            el: '#' + nameId,
            offset: -200,
        }" 
        class="scroll-top"
    >
        <IconScroll/>
    </a>
</template>

<script>
import IconScroll from "~/assets/icons/scroll-top.svg?inline";

export default {
    components: {
        IconScroll
    },

    props: {
        nameId: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/common/_scroll-to.scss";
</style>