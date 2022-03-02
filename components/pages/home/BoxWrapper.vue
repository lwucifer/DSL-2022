<template>
<div class="box-wrapper">
    <div class="box-wrapper__title">
        <slot name="title" />
        
        <div>
            <slot name="view-more"/>

            <div v-if="isNavigation">
                <span class="swiper-prev pointer">
                    <IconPre />
                </span>
                <span class="swiper-next pointer">
                    <IconNext />
                </span>
          </div>
        </div>
    </div>
    <div class="box-wrapper__text">
        <slot name="text" />
    </div>

    <div class="box-wrapper__content">
        <slot name="content" />
    </div>
</div>
</template>

<script>
import IconNext from '~/assets/icons/next.svg?inline';
import IconPre from '~/assets/icons/pre.svg?inline';

export default {
    props: {
        isNavigation: {
            type: Boolean,
            default: false
        }
    },

    components: {
        IconNext,
        IconPre
    }
}
</script>

<style lang="scss" scoped>
@import "~/assets/scss/components/pages/home/_box-wrapper.scss";
</style>
