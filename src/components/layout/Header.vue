<template>
  <a-layout-header :style="{
          position: 'fixed',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          padding: 0,
        }">
    <a-menu
      theme="dark"
      mode="horizontal"
      :default-selected-keys="[$route.name]"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="Home">
        <!-- <router-link :to="userSquad ? `/${userSquad}/report` : '/'"> -->
        <router-link to="/">
          <a-icon type="form" />回報填寫
        </router-link>
      </a-menu-item>

      <a-menu-item key="Announcement">
        <router-link to="/announcement">
          <a-icon type="notification" />系統公告
        </router-link>
      </a-menu-item>

      <a-menu-item key="Login" v-if="!loginState">
        <router-link to="/login">
          <a-icon :type="loginState ? 'setting' : 'login'" />
          班長登入
        </router-link>
      </a-menu-item>

      <a-sub-menu key="sub" v-else>
        <span slot="title"><a-icon type="down-square" /><span>管理選項</span></span>
        <a-menu-item key="Admin">
          <router-link to="/admin">
            <a-icon type="setting" />管理後台
          </router-link>
        </a-menu-item>

        <a-menu-item key="Vacation">
          <router-link to="/vacation">
            <a-icon type="carry-out" />設定收假日
          </router-link>
        </a-menu-item>

        <a-menu-item key="logout" @click="this.handleLogout">
          <a-icon type="logout" />登出
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-header>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(['logout']),

    handleLogout() {
      this.logout();
      this.$router.replace('/login');
    }
  },
  computed: {
    ...mapState(["userSquad", "loginState"]),
  },
}
</script>
