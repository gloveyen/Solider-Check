<template>
  <div class="home">
    <h2 id="title">
      257旅步一營兵器連第{{ userSquadName }}假日 {{ replyStepName[replyStep] }} 回報表單
    </h2>
    <NotReply :now="now" :replyStep="replyStep" />
    <CheckForm :replyStep="replyStep" />
  </div>
</template>

<script>
import CheckForm from "@/components/CheckForm.vue";
import NotReply from "@/components/NotReply.vue";
import { mapState } from "vuex";

export default {
  name: "Report",
  async mounted() {
    this.now = new Date();
    const { squadId } = this.$route.params;
    if (this.$route.params.squadId) {
      const response = await this.$store.dispatch("queryUserSquad", squadId);
    }
    this.$store.dispatch("querySoldiers", squadId);
  },
  data() {
    return {
      replyStepName: ["中午11點", "晚上8點"],
      now: null,
    };
  },
  computed: {
    ...mapState(["userSquad", "userSquadName"]),
    replyStep() {
      const now_hours = this.now ? this.now.getHours() : 0;
      console.log(now_hours)
      if (now_hours >= 4 && now_hours < 16) return 0;
      if (16 <= now_hours || now_hours < 4) return 1;
    },
    now_hour() {
      return this.now.getHours();
    },
  },
  components: {
    CheckForm,
    NotReply,
  },
};
</script>
