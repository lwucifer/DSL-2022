<template>
<div class="icon" :style="style" :key="`${name}-${flipH}-${flipV}`">
</div>
</template>

<style lang="scss" scoped>
.icon {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '1em'
    },

    name: {
      type: String,
      required: true
    },

    flipH: {
      type: Boolean,
      default: false
    },

    flipV: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    image () {
      return `/icons/${this.name}.svg`
    },

    style () {
      return {
        width: this.size,
        height: this.size,
        backgroundImage: `url(${this.image})`,
        transform: `${this.flipH ? 'scaleX(-1)' : ''} ${this.flipV ? 'scaleY(-1)' : ''}` || 'none'
      }
    }
  }
}
</script>
