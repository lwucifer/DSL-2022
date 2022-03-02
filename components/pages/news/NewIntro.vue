<template>
    <div class="new-intro animated fadeIn">
        <div class="new-intro__img">
            <n-link :to="`/${defaultLangCode}/news/detail/${data.id}`"><img :src="banner[0] ? banner[0].avatar : ''" alt=""></n-link>
            <!-- <div class="post-name">{{ data.post_name }}</div> -->
        </div>

        <div class="new-intro__text">
            <n-link :to="`/${defaultLangCode}/news/detail/${data.id}`" class="heading-4 white mb-16">{{ data.post_name }}</n-link>
            <div class="heading-5 infor-text white mb-16" v-html="filterContent"></div>
            
            <v-button size="sm" class="white infor-views">
                <IconClock class="mr-2"/> {{ data.create_time }}
            </v-button>

            <v-button size="sm" class="white infor-views">
                <IconEye class="mr-2"/> {{ data.view_number}}
            </v-button>
        </div>
    </div>
</template>

<script>
import IconClock from "~/assets/icons/clock-3.svg?inline"
import IconEye from "~/assets/icons/eye.svg?inline"

import { mapGetters } from 'vuex';

export default {
    components: {
        IconClock,
        IconEye,
    },

    props: {
        data: {
            type: Object,
            default: () => []
        },
        banner: {
            type: Array,
            default: () => []
        }
    },

    computed: {
        ...mapGetters('common/common', ['defaultLangCode']),

        filterContent() {
            if(navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
                return this.data.content.slice(0, 100) + '...'
            }else {
                return this.data.content
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/news/_new-intro.scss";
</style>