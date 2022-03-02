<template>
    <div class="text-center popup-show-noti">
        <h3 class="mb-24">{{ data.title }}</h3>
        <p>{{ data.content }}</p>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => []
        }
    }
}
</script>

<style>

</style>