<template>
    <div class="notification-item" @click="readNoti(data.notification_id, data.status)">
        <div class="d-flex align-items-center justify-content-between">
            <h5 
                class="notification-item__title mb-3" 
                :class="{'deep-dark' : data.status == READ_NOTI.UNREAD }"
            >
                {{ data.title }}
            </h5>

            <span class="noti-unread" v-if="data.status == READ_NOTI.UNREAD"></span>
        </div>

        <div 
            class="notification-item__content" 
            :class="{'deep-dark' : data.status == READ_NOTI.UNREAD }"
        >
            {{ data.content }}
        </div>

        <div 
            class="notification-item__date" 
            :class="{'deep-dark' : data.status == READ_NOTI.UNREAD }"
        >
            {{ data.at }}
        </div>
    </div>
</template>

<script>
import { READ_NOTI} from "~/utils/constants"

export default {
    props: {
        data: {
            type: [Object, Array],
            default: () => []      
        }
    },

    data() {
        return {
            READ_NOTI: Object.freeze(READ_NOTI)
        }
    },

    methods: {
        readNoti(_id, _status) {
            if(_status ==  READ_NOTI.UNREAD) {
                this.$emit("read", _id)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/notifications/_notification-item.scss";
</style>