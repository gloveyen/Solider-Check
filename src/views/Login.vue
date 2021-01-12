<template>
  <div class="view-login-container">
    <h1>系統後台登入</h1>
    <a-form-model :model="form" @submit="handleSubmit" @submit.native.prevent>
      <a-form-model-item>
        <a-input v-model="form.account" placeholder=帳號>
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="form.password" type="password" placeholder="密碼">
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="form.user === '' || form.password === ''"
        >
          登入
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      form: {
        account: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions(["login"]),

    async handleSubmit(e) {
      const response = await this.login(this.form);
      if (response) {
        this.$router.push("/admin");
      }
    },
  },
};
</script>

<style lang="scss">
.view-login-container {
  width: 60vw;
  height: calc(100vh - 350px);
  margin: auto;

  h1 {
    margin-top: 50px;
    font-size: 36px;
  }
}
</style>
