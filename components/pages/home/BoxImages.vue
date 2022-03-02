<template>
    <n-link to="" class="box-images">
        <img :src="bg" alt="" class="box-images__img" :style="{height: height}">
        
        <span class="box-images__text">
            <slot/>
        </span>
    </n-link>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
        },
        
        bg: {
            type: String,
            default: 'images/journey-1.png'
        },

        height: {
            type: String ,
            default: '22rem'
        }
    },

    data() {
        return {
            
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/home/_box-images.scss";
</style>