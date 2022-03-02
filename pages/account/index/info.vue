<template>
  <div class="pa-16 border-radius bg-white">
    <h4 class="mb-16">{{ $t('booking.personal_infor') }}</h4>

    <div class="account-form-group mb-16">
      <label class="fw-bold mb-3">{{ $t('account.avatar') }}</label>
      <div class="account-profile-avatar">
        <v-avatar class="mr-24" :src="avatar" :size="120" shape="square" />

        <v-upload
          accept="image/*, image/heic, image/heif"
          :fileList="fileList"
          @change="handleUploadChange"
        >
          <v-button
            ><IconCamera class="icon mr-3" />{{
              $t('account.change')
            }}</v-button
          >
        </v-upload>
      </div>
    </div>

    <div class="account-form-group mb-16">
      <label class="fw-bold mb-3">{{ $t('account.name') }}</label>
      <v-input ref="name" v-model="name" size="lg" :readonly="!editName">
        <template slot="append">
          <a v-if="editName" href="" @click.prevent="saveName(name)">{{
            $t('account.save_change')
          }}</a>
          <a v-else href="" @click.prevent="changeName">{{
            $t('account.change')
          }}</a>
        </template>
      </v-input>
    </div>

    <div class="account-form-group mb-16">
      <label class="fw-bold mb-3">Email</label>
      <v-input
        slot="activator"
        ref="email"
        v-model="email"
        size="lg"
        :readonly="!editEmail"
      ></v-input>
    </div>
    <!--  -->
    <div class="account-form-group mb-16">
      <label class="fw-bold mb-3">{{ $t('booking.phone_number') }}</label>
      <v-input
        v-model="phone"
        size="lg"
        :placeholder="$t('booking.input_phone_number')"
        :valid="errorPhone ? false : null"
        ref="phone"
        :readonly="!editPhone"
        @input="handlePhone"
      >
        <template slot="append">
          <a
            v-if="editPhone"
            :class="errorPhone ? 'pointer-event' : ''"
            href=""
            @click.prevent="savePhone(phone)"
            >{{ $t('account.save_change') }}</a
          >
          <a
            v-else
            :class="errorPhone ? 'pointer-event' : ''"
            href=""
            @click.prevent="changePhone"
            >{{ phone ? $t('account.change') : $t('account.add') }}</a
          >
        </template>
      </v-input>
      <span class="danger caption" v-if="errorPhone">{{ errorText }}</span>
    </div>

    <template>
      <v-button
        class="book-tour__submit"
        variant="primary"
        v-if="userPasswordStatus === 1"
        @click="submit"
        >{{ $t('account.change_pass') }}</v-button
      >
      <v-button
        class="book-tour__submit"
        v-else
        variant="primary"
        @click="submitCreate"
        >{{ $t('account.make_pass') }}</v-button
      >
    </template>
    <v-modal
      v-model="confirmDelete"
      :header="false"
      :width="600"
      centered
      :footer="false"
      @cancel="confirmDelete = false"
      @ok="handleSubmit(confirmDelete)"
    >
      <div class="text-center">
        <h3 class="mb-5">{{ $t('account.change_pass') }}</h3>
      </div>
      <div class="form-auth__item">
        <label class="form-auth__label" for="now-password">{{
          $t('account.current_pass')
        }}</label>
        <v-input
          :type="typePassword ? 'password' : 'text'"
          class="form-auth__input"
          id="now-password"
          size="lg"
          :placeholder="$t('account.input_current_pass')"
          rounded
          autocomplete="off"
          v-model="nowPassword"
          :valid="errorNowPassword ? false : null"
          ><template slot="append">
            <IconEye2
              v-if="typePassword"
              @click.prevent="typePassword = !typePassword"
            />
            <IconEye
              v-else
              @click.prevent="typePassword = !typePassword"
            /> </template
        ></v-input>
        <span class="danger caption" v-if="messageErrorNowPass">{{
          messageErrorNowPass
        }}</span>
      </div>
      <div class="form-auth__item">
        <label class="form-auth__label" for="new-password">{{
          $t('account.new_pass')
        }}</label>
        <v-input
          class="form-auth__input"
          id="new-password"
          :type="typePassword2 ? 'password' : 'text'"
          size="lg"
          :placeholder="$t('account.input_current_pass')"
          rounded
          autocomplete="off"
          v-model="newPassword"
          :valid="errorNewPassword ? false : null"
          @input="handleNewPassword"
          ><template slot="append">
            <IconEye2
              v-if="typePassword2"
              @click.prevent="typePassword2 = !typePassword2"
            />
            <IconEye
              v-else
              @click.prevent="typePassword2 = !typePassword2"
            /> </template
        ></v-input>
        <span class="danger caption" v-if="messageErrorNewPass">{{
          messageErrorNewPass
        }}</span>
      </div>

      <div class="form-auth__item">
        <label class="form-auth__label" for="re-new-password">{{
          $t('header.confirm_pass')
        }}</label>
        <v-input
          class="form-auth__input"
          id="re-new-password"
          size="lg"
          :type="typePassword3 ? 'password' : 'text'"
          :placeholder="$t('header.confirm_pass')"
          rounded
          autocomplete="off"
          v-model="reNewPassword"
          :valid="errorReNewPassword ? false : null"
          @input="handleReNewPassword"
        >
          <template slot="append">
            <IconEye2
              v-if="typePassword3"
              @click.prevent="typePassword3 = !typePassword3"
            />
            <IconEye
              v-else
              @click.prevent="typePassword3 = !typePassword3"
            /> </template
        ></v-input>
        <span class="danger caption" v-if="messageErrorReNewPass">{{
          messageErrorReNewPass
        }}</span>
      </div>
      <div class="form-auth__item form-auth__item--action">
        <div class="d-flex justify-content-end">
          <v-button
            type="submit"
            class="w-100 btn-left"
            rounded
            @click.prevent="confirmDelete = false"
            >{{ $t('hotel.back') }}</v-button
          >
          <v-button
            type="submit"
            variant="primary"
            class="w-100 btn-right"
            rounded
            @click.prevent="handleSubmit(confirmDelete)"
            :disabled="disabledBtn"
            >{{ $t('restaurant.confirm') }}</v-button
          >
        </div>
      </div>
    </v-modal>
    <v-modal
      v-model="confirmCreate"
      :header="false"
      :width="600"
      centered
      :footer="false"
      @cancel="confirmCreate = false"
    >
      <FormCreatePassword
        @cancel="confirmCreate = false"
        @success="handleSuccess"
      />
    </v-modal>
  </div>
</template>

<script>
import { assign, concat } from 'lodash';
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import { moveCursorToEnd } from '~/utils/dom';
import { getBase64 } from '~/utils/common';
import { validatePassword } from '~/utils/validations';
import {
  required,
  sameAs,
  maxLength,
  minLength,
  numeric
} from 'vuelidate/lib/validators';
import IconCamera from '~/assets/icons/camera.svg?inline';
import IconEye2 from '~/assets/icons/eye-2.svg?inline';
import IconEye from '~/assets/icons/eye.svg?inline';
import FormCreatePassword from '~/components/pages/account/info/FormCreatePassword';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import { isNullOrEmpty } from '~/plugins/filters';
import Cookies from 'js-cookie';
export default {
  components: {
    IconCamera,
    IconEye,
    IconEye2
  },
  mounted() {
    this.getList();
  },
  data() {
    return {
      urlImg: null,
      avatar: '',
      fileList: [],
      name: '',
      email: '',
      phone: '',
      editName: false,
      editEmail: false,
      editPhone: false,
      typePassword: true,
      typePassword2: true,
      typePassword3: true,
      confirmDelete: false,
      inforUser: null,
      password: '',
      errorPassword: false,
      messageErrorPass: '',
      newPassword: '',
      errorNewPassword: false,
      messageErrorNewPass: '',
      reNewPassword: '',
      errorReNewPassword: false,
      messageErrorReNewPass: '',
      nowPassword: '',
      errorNowPassword: false,
      messageErrorNowPass: '',
      dataInfo: {},
      confirmCreate: false,
      errorText: '',
      errorPhone: false
    };
  },
  validations() {
    return {
      phone: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      newPassword: {
        required
      },
      reNewPassword: {
        required,
        sameAsNewPassword: sameAs('newPassword')
      }
    };
  },

  computed: {
    ...mapState('auth/auth', ['userInfo']),
    ...mapGetters('common/user', ['userPasswordStatus']),
    disabledBtn() {
      return !(
        this.newPassword !== '' &&
        this.reNewPassword !== '' &&
        this.messageErrorNewPass === '' &&
        this.messageErrorReNewPass === '' &&
        this.nowPassword !== ''
      );
    }
  },

  methods: {
    ...mapActions('common/common', ['uploadFile']),
    ...mapActions('common/user', ['getUserInfo']),
    ...mapActions('user/user', [
      'postUserUpdateName',
      'postUserUpdatePhone',
      'postUserUpdateAvatar',
      'postUserUpdatePw'
    ]),
    isNullOrEmpty,
    ...mapMutations('common/eventBus', ['dataInfoAcc']),
    ...mapMutations('auth/auth', ['setToken']),
    submit() {
      this.confirmDelete = true;
    },
    handlePhone() {
      if (this.phone === null) {
        this.errorPhone = false;
        this.errorText = '';
      } else {
        if (!this.$v.phone.required) {
          this.errorPhone = true;
          this.errorText = this.$t('booking.obligatory');
        } else if (
          !this.$v.phone.minLength ||
          !this.$v.phone.maxLength ||
          !this.$v.phone.numeric
        ) {
          this.errorPhone = true;
          this.errorText = this.$t('booking.right_phone_number');
        } else {
          this.errorPhone = false;
          this.errorText = '';
        }
      }
    },
    async handleUploadChange(fileList, event) {
      const fileListArr = Array.from(fileList);
      this.fileList = fileListArr;
      let arr = [];
      let formData = new FormData();
      formData.append('file', this.fileList[0]);
      let folder_dir = 'event';
      let data = { formData, folder_dir };
      await this.uploadFile(data).then((response) => {
        this.urlImg = response.data.image_url;
        this.postUserUpdateAvatar({ avatar: this.urlImg });
        this.avatar = this.urlImg;
        const updatedToken = { ...this.userInfo, avatar: this.avatar };
        this.setToken(updatedToken);
        if (response.code == RES_STATUS_SUCCESS) {
          this.$toasted.info(this.$t('account.change_avatar_success'));
        } else {
          this.$toasted.error(this.$t('account.change_avatar_failed'));
        }
      });
      // getBase64(fileListArr[0], (src) => {
      //   this.avatar = src;
      // });
    },
    getList() {
      this.getUserInfo().then((response) => {
        this.avatar = response.data.avatar;
        this.name = response.data.fullname;
        this.phone = response.data.phone;
        this.email = response.data.email;
      });
    },
    changeName() {
      const { name } = this.$refs;
      const inputEl = name.$el.getElementsByTagName('input')[0];
      this.editName = true;
      this.$nextTick(() => {
        inputEl.focus();
        moveCursorToEnd(inputEl);
      });
    },

    async saveName(name) {
      this.editName = false;
      const result = await this.postUserUpdateName({ name });
      const updatedToken = { ...this.userInfo, name };
      this.setToken(updatedToken);
      if (result.code == RES_STATUS_SUCCESS) {
        this.$toasted.info(this.$t('account.change_name_success'));
      } else {
        this.$toasted.error(this.$t('account.change_name_failed'));
      }
    },

    changePhone() {
      const { phone } = this.$refs;
      const inputEl = phone.$el.getElementsByTagName('input')[0];
      this.editPhone = true;
      this.$nextTick(() => {
        inputEl.focus();
        moveCursorToEnd(inputEl);
      });
    },

    async savePhone(phone) {
      this.editPhone = false;
      const result = await this.postUserUpdatePhone({ phone });
      const updatedToken = { ...this.userInfo, phone };
      this.setToken(updatedToken);
      if (result.code == RES_STATUS_SUCCESS) {
        this.$toasted.info(this.$t('account.change_phone_success'));
      } else {
        this.$toasted.error(this.$t('account.change_phone_failed'));
      }
    },
    handleNewPassword(value) {
      if (!validatePassword(value)) {
        this.messageErrorNewPass = this.$t('header.err_pass');
        this.errorNewPassword = true;
      } else if (this.newPassword == this.nowPassword) {
        this.messageErrorNewPass = this.$t(
          'account.current_pass_not_match_old_pass'
        );
        this.errorNewPassword = true;
      } else {
        this.messageErrorNewPass = '';
        this.errorNewPassword = false;
      }
    },
    handleReNewPassword(value) {
      if (!this.$v.reNewPassword.sameAsNewPassword) {
        this.messageErrorReNewPass = this.$t('header.pass_not_match');
        this.errorReNewPassword = true;
      } else {
        this.messageErrorReNewPass = '';
        this.errorReNewPassword = false;
      }
    },
    async handleSubmit() {
      const result = await this.postUserUpdatePw({
        new_password: this.newPassword,
        old_password: this.nowPassword
      });
      if (result.code == RES_STATUS_SUCCESS) {
        this.$toasted.info(this.$t('header.change_pass_success'));
        this.confirmDelete = false;
        // this.resetInput();
      } else {
        this.$toasted.error(this.$t('account.current_pass_wrong'));
      }
    },
    submitCreate() {
      this.confirmCreate = true;
    },
    handleSuccess() {
      this.confirmCreate = false;
      this.getUserInfo();
    },
    resetInput() {
      this.reNewPassword = '';
      this.messageErrorNewPass = '';
      this.errorNewPassword = false;
      this.nowPassword = '';
      this.newPassword = '';
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/pages/account/_profile.scss';
</style>
