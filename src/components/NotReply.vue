<template>
  <div class="no-reply-component-container" v-if="now">
    <a-card
      class="no-reply-card"
      :title="
        loading
          ? '尚未填回報'
          : filterByOuterRange.length
          ? `尚未填回報(${filterByOuterRange.length})`
          : '已全數回報'
      "
      v-if="filterByOuterRange !== undefined"
    >
      <a-button slot="extra" @click="reloadSoldier"
        ><a-icon type="reload" />刷新</a-button
      >
      <a-spin :spinning="loading">
        <a-tooltip
          placement="top"
          v-for="{ id, name, number, phone } in filterByOuterRange"
          :key="id"
        >
          <template slot="title">
            <a :href="`tel:+886${phone.slice(1, phone.length)}`">{{ phone }}</a>
          </template>
          <a-tag color="#108ee9"> {{ number }} {{ name }} </a-tag>
        </a-tooltip>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";

export default {
  mounted() {
    if (this.soldiers.length) {
      this.loading = false;
    }
  },
  props: {
    now: Date,
    replyStep: Number,
  },
  data() {
    return {
      stepRange: [1, 12, 18],
      loading: true,
    };
  },
  methods: {
    ...mapActions(["querySoldiers"]),

    reloadSoldier: async function() {
      const { squadId='nbHSds25HAauTGgdrnDs' } = this.$route.params;
      this.loading = true;
      await this.querySoldiers(squadId);
      this.loading = false;
    },
  },
  computed: {
    ...mapState(["soldiers"]),

    filterByOuterRange() {
      if (this.soldiers.length) {
        return this.soldiers.filter(
          (doc) =>
           !doc.absence && !doc.hadRetire && (!doc.updateAt ||
            (new Date(
              this.now.getFullYear(),
              this.now.getMonth(),
              this.now.getDate(),
              this.stepRange[this.replyStep]
            ) -
              doc.updateAt.toDate()) /
              1000 /
              60 /
              60 >
              0
        ));
      }
      return [];
    },
  },
  watch: {
    soldiers() {
      if (this.soldiers.length) {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scope>
.no-reply-component-container {
  width: 100%;

  .no-reply-card {
    max-width: 650px;
    margin: 20px auto;
    margin-bottom: 30px;

    .ant-tag {
      margin-bottom: 8px;
    }
  }
}
</style>
