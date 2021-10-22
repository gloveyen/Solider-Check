<template>
  <div class="home">
    <h2 id="title">
      257旅步一營兵器連假日回報系統
    </h2>
    
    <a-divider />
    
    <span>請選擇你的所屬班級</span>
    <section class="buttons" v-if="squadList.length">
      <a-button v-for="{ id, name } in squadList" :key="id" @click="toSquadReport(id)">
        {{ name }}
      </a-button>
    </section>
    
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: "Home",
  async mounted() {
    this.$store.dispatch("querySquadList");
  },
  methods: {
    toSquadReport(id) {
      this.$router.push(`/${id}/report`);
    }
  },
  computed: {
    ...mapState(['squadList'])
  }
};
</script>

<style lang="scss" scoped>
  .buttons {
    display: flex;
    flex-direction: column;

    button {
      margin: 4px 0;
    }
  }
</style>
