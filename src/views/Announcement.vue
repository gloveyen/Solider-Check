<template>
  <div class="view-accouncment-component">
    <a-divider orientation="center"><h3>系統版本內容</h3></a-divider>
    <a-skeleton :loading="loading" :paragraph="{ rows: 8 }" active />
    <a-card class="container" v-if="!loading">
      <section
        v-for="{ id, version, name, desc, createAt } in announcments"
        :key="id"
      >
        <a-divider orientation="left">v{{ version }}</a-divider>
        <a-descriptions :title="name">
          <a-descriptions-item label="更新內容">
            <span v-html="desc"></span>
          </a-descriptions-item>
          <a-descriptions-item label="更新時間">
            <span>{{ moment(createAt) }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </section>
    </a-card>
    <div class="problem">
      <a-card title="系統問題回報區">
        <a-textarea v-model="problem"></a-textarea>
        <a-button @click="submit" block>回報</a-button>
      </a-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  mounted() {
    if (this.announcments.length) {
      this.loading = false;
    }
  },
  data() {
    return {
      problem: "",
      loading: true,
    };
  },
  methods: {
    ...mapActions(["submitProblem"]),

    submit() {
      if (this.problem.length) {
        this.submitProblem(this.problem);
        this.problem = "";
        this.$message.success("已送出，感謝您的回報！");
      } else {
        this.$message.error("請填入您所遇到的問題！");
      }
    },
    moment(timestamp) {
      return moment(timestamp.toDate()).format("YYYY-MM-DD H:mm");
    },
  },
  computed: {
    ...mapState(["announcments"]),
  },
  watch: {
    announcments() {
      if (this.announcments.length) {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scope>
.view-accouncment-component {
  min-height: 610px;

  .container {
    height: 500px;
    overflow: scroll;
  }

  .ant-descriptions {
    margin-left: 12px;
    text-align: left;
  }

  td {
    display: flex;
    flex-direction: column;
  }

  .problem {
    margin-top: 150px;

    button {
      margin-bottom: 0;
    }

    textarea {
      height: 200px;
    }
  }
}
</style>
