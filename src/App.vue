<template>
  <div id="app">
    <a-layout id="components-layout-demo-custom-trigger">
      <Header />

      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </a-layout-header>
        <a-layout-content :style="{
            margin: '24px 16px',
            padding: '24px',
            background: '#fff',
            minHeight: '280px',
          }">
          <router-view />
        </a-layout-content>
      </a-layout>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Soldier Check v.{{ newestVersion }} © 2020 Created by GloveYen
      </a-layout-footer>
    </a-layout>

    <a-back-top />
  </div>
</template>

<script>
  import Header from "@/components/layout/Header";
  import { mapGetters } from 'vuex';

  export default {
    async mounted() {
      // const { squadId='nbHSds25HAauTGgdrnDs' } = this.$route.params;
      // if (this.$route.params.squadId) {
      //   const response = await this.$store.dispatch("queryUserSquad", squadId);
      // }
      this.$store.dispatch("queryAnnouncments");
      // this.$store.dispatch("querySoldiers", squadId);
    },
    data() {
      return {
        collapsed: false,
      };
    },
    computed: {
      ...mapGetters(['newestVersion']),
    },
    components: {
      Header,
    },
  };
</script>

<style lang="scss">
  #app {
    width: 100vw;
    height: 100vh;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #title {
    font-size: 28px;
    margin-bottom: 50px;
  }

  .ant-space-item {
    a {
      display: block;
      height: 100%;
      color: #fff;
    }
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
