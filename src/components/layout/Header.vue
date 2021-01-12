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

      <a-menu-item key="Login">
        <router-link to="/login">
          <a-icon :type="loginState ? 'setting' : 'login'" />
          {{ loginState ? '管理後台' : '班長登入' }}
        </router-link>
      </a-menu-item>

      <a-menu-item key="Vacation" v-if="loginState">
        <router-link to="/vacation">
          <a-icon type="carry-out" />設定收假日
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["userSquad", "loginState"]),
  },
}
</script>
