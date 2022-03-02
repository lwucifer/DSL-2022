<template>
  <div class="upload" ref="uploadAnimation" @click="onLoading">
      <svg class="circle" viewBox="0 0 164 164">
          <circle cx="82" cy="82" r="80"></circle>
          <circle class="active" cx="82" cy="82" r="80"></circle>
      </svg>
      <svg class="image" viewBox="0 0 60 60">
          <rect fill="currentColor" x="0" y="0" width="60" height="60" rx="11.9999993"></rect>
          <circle fill="#FFFFFF" cx="15" cy="15" r="5"></circle>
          <path d="M50,54 L10,54 C7.790861,54 6,52.209139 6,50 L6,44.2867962 C6,44.0993765 6.05266944,43.9157289 6.1520017,43.7567973 L12.6080068,33.4271891 C12.9299296,32.9121126 13.3649277,32.4771145 13.8800042,32.1551917 C15.7533504,30.9843504 18.2211519,31.553843 19.3919932,33.4271891 L26,44 L36.3752674,21.7672841 C36.7726106,20.9158345 37.4570086,20.2314365 38.3084581,19.8340934 C40.3103427,18.8998806 42.6905198,19.7653995 43.6247326,21.7672841 L53.9061831,43.7989639 C53.9679765,43.9313783 54,44.0757261 54,44.2218493 L54,50 C54,52.209139 52.209139,54 50,54 Z" fill="#FFFFFF"></path>
      </svg>
  </div>
</template>

<script>

export default {
  name: 'Progress',

  data () {
    return {
       upload: null
    }
  },

  mounted () {
    this.upload = setTimeout(() => {
      this.onLoading()
    }, 0);
  },

  beforeDestroy() {
    clearTimeout(this.upload)
  },

  methods: {
    onLoading () {
      this.$refs.uploadAnimation.classList.add('do');
    }
  }
}
</script>

<style lang="scss" scoped>
$active: $blue;
$circle: #EDEEF1;
$icon: #B4B8C1;

.upload {
    width: 50px;
    cursor: pointer;
    position: relative;
    .image {
        color: $icon;
        stroke: none;
        transform: rotate(15deg);
    }
    .circle {
        display: block;
        stroke: $circle;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 4;
        width: 100px;
        height: 100px;
        opacity: 0;
        transition: all .2s ease;
        transform: rotate(-90deg);
        .active {
            stroke: $active;
            stroke-dasharray: 502.65;
            stroke-dashoffset: 502.65;
            transition: all 4s ease;
        }
    }
    &:before {
        content: '';
        border-radius: 12px;
        background: rgba($icon, .3);
        transform: rotate(-15deg);
    }
    .image,
    &:before {
        display: block;
        width: 30px;
        height: 30px;
        margin: 0;
        left: 35px;
        top: 35px;
        position: absolute;
        transform-origin: 0% 100%;
        transition: all .5s cubic-bezier(.51, .92, .24, 1.15);
    }
    &:not(.do):hover {
        .image {
            transform: rotate(10deg);
            color: $active;
        }
        &:before {
            transform: rotate(-10deg);
            background: rgba($active, .3);
        }
    }
    &.do {
        .image {
            color: $active;
            transform: rotate(10deg);
            animation: bounce 1s infinite ease;
        }
        &:before {
            background: rgba($active, .3);
            transform: rotate(-10deg);
            animation: bounceAlt 1s infinite ease;
        }
        .circle {
            opacity: 1;
            .active {
                stroke-dashoffset: 0;
            }
        }
    }
    &.animateEnd {
        .image,
        &:before {
            animation: none;
        }
        .image {
            transform: rotate(10deg);
        }
        &:before {
            transform: rotate(-10deg);
        }
        .circle {
            opacity: 0;
            transition-delay: 0s;
            .active {
                stroke-dasharray: 502.65;
                stroke-dashoffset: 502.65;
            }
        }
    }
}

@keyframes bounce {
    50% {
        transform: rotate(15deg);
    }
}

@keyframes bounceAlt {
    50% {
        transform: rotate(-15deg);
    }
}
</style>