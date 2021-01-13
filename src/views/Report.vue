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
    const { squadId='nbHSds25HAauTGgdrnDs' } = this.$route.params;
    if (this.$route.params.squadId) {
      const response = await this.$store.dispatch("queryUserSquad", squadId);
    }
    this.$store.dispatch("querySoldiers", squadId);
  },
  data() {
    return {
      replyStepName: ["早上9點", "下午3點", "晚上9點"],
      now: null,
    };
  },
  computed: {
    ...mapState(["userSquad", "userSquadName"]),
    replyStep() {
      const now_hours = this.now ? this.now.getHours() : 0;
      if (now_hours >= 1 && now_hours < 12) return 0;
      if (12 <= now_hours && now_hours < 18) return 1;
      return 2;
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
