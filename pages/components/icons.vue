<template>
  <div class="container icons-page">
    <section class="mb-6" id="icons">
      <div class="row">
        <div class="col-2 my-3 text-center" v-for="icon in icons" :key="icon.path">
          <div>
            <component
              :is="get(icon, 'icon.default', icon.icon)"
              class="icon"
              fill="#000"
              @click="handleClick(icon.path, '~/assets/icons')"
            />
          </div>
          <span class="caption">{{ icon.path }}</span>
        </div>
      </div>
    </section>

    <v-modal v-model="modal" @cancel="hideModal" :width="600" :footer="false" :header="false">
      <div class="modal-content">
        <code>
          <div v-text="`<template>`"></div>
          <div>
            &nbsp;
            <span v-text="`<${convertIconComponentName(dataModal.path)} class='icon' />`"></span>
          </div>
          <div v-text="`</template>`"></div>
          <br />
          <div v-text="`<script>`"></div>
          <div>{{ `import ${convertIconComponentName(dataModal.path)} from '${convertIconPath(dataModal)}';` }}</div>
          <br />
          <div>
            export default {
            <br />&nbsp;
            <span>
              components: {
              <br />
              &nbsp;&nbsp;&nbsp;
              {{ convertIconComponentName(dataModal.path) }}
              <br />&nbsp;&nbsp;}
            </span>
            <br />}
          </div>
          <div v-text="`</script>`"></div>
        </code>
      </div>
    </v-modal>
  </div>
</template>

<script>
import { get } from "lodash";

export default {
  data: () => ({
    modal: false,
    dataModal: {},
    icons: [],
  }),

  created() {
    // https://webpack.js.org/guides/dependency-management/#requirecontext
    const req = require.context("~/assets/icons?inline", false, /.*\.svg$/);

    req.keys().forEach(key => {
      const icon = req(key);
      this.icons.push({ path: key, icon });
    });
  },

  methods: {
    get,

    handleClick(path, source) {
      this.dataModal = { path, sourcePath: source };
      this.$nextTick(() => {
        this.modal = true;
      })
    },

    hideModal() {
      this.modal = false;
      this.dataModal = {};
    },

    convertIconComponentName(path) {
      if (!path) return;
      const fileName = path.replace(/(\.\/|.svg)/g, "");
      const splitedFileName =
        fileName.indexOf("_") > -1 ? fileName.split("_") : fileName.split("-");
      const fileNameConverted = splitedFileName
        .map(
          word => word.slice(0, 1).toUpperCase() + word.slice(1, word.length)
        )
        .join("");
      return `Icon${fileNameConverted}`;
    },

    convertIconPath({ path, sourcePath }) {
      if (!path) return;
      const fileName = path.replace("./", "");
      return `${sourcePath}/${fileName}?inline`;
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  font-size: 3rem;
  cursor: pointer;
}

.nav {
  ul {
    list-style-type: none;

    li {
      display: inline-block;
    }

    a {
      text-decoration: none;
      color: inherit;
      font-size: map-get($text-size, "body-1");
      font-weight: 700;
      margin-right: 3rem;

      &:hover {
        color: $primary;
      }
    }
  }
}
</style>