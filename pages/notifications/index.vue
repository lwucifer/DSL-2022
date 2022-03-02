<template>
    <div class="container">
        <div class="notifications">
            <h4 class="notifications__title mb-24">{{$t("notifications.notifications_center")}}</h4>

            <div class="notifications__content">
                <NotificationItem 
                    v-for="(item, index) in getDataNotiList" :key="index"
                    :data="item"
                    @read="changeStatusNoti"
                />
            </div>
        </div>

        <AppPagination :pageable="getPageableNotiList" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PAGER, READ_NOTI } from '~/utils/constants';

import NotificationItem from "~/components/pages/notifications/NotificationItem"
import AppPagination from '~/components/app/AppPagination';

export default {
    components: {
        NotificationItem,
        AppPagination
    },

    computed: {
        ...mapGetters("common/user", ["getDataNotiList", "getPageableNotiList"])
    },

    async fetch() {
        await Promise.all([
            this.getUserNotificationList({
                page_index: PAGER.PAGE_INDEX,
                page_size: PAGER.PAGE_SIZE,
                ...this.$route.query
            }),
        ]);
    },

    watch: {
        '$route.query': function (newValue) {
            
            this.getUserNotificationList(newValue);
        },
        // defaultLang(_newVal) {
        //     this.getUserNotificationList({
        //         page_index: PAGER.PAGE_INDEX,
        //         page_size: PAGER.PAGE_SIZE,
        //         ...this.$route.query
        //     });
        // }
        changeStatusNoti(newValue) {
            console.log("newValue", newValue);
        }
    },

    mounted () {
        // listen on change message => reCall API notification list.
        this.$fire.messaging.onMessage((payload) => {
            this.getUserNotificationList({
                page_index: PAGER.PAGE_INDEX,
                page_size: PAGER.PAGE_SIZE,
                ...this.$route.query
            });
        })
    },

    methods: {
        ...mapActions("common/user", ["getUserNotificationList", "getUserNotificationDetail", "getUserNotificationNewAmount"]),

        async changeStatusNoti(_id) {
            await this.getUserNotificationDetail({notification_id: _id})
            await this.getUserNotificationNewAmount();
            await this.getUserNotificationList({
                page_index: PAGER.PAGE_INDEX,
                page_size: PAGER.PAGE_SIZE,
                ...this.$route.query
            })
        }
    }
}
</script>

<style lang="scss">
@import "~assets/scss/pages/notifications/_index.scss";
</style>