<template>
  <div class="component-red-button-container">
    <section class="redButton-1">
      <section class="redButton-2">
        <section class="redButton-3">
          <section class="redButton-4">
            <section class="redButton-5" @click="eliminate">
              殲滅
            </section>
          </section>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    focusSquad: String
  },
  methods: {
    ...mapActions(['openFire']),

    eliminate() {
      const ensure = prompt("如果確定要清除所有班兵資料，請於下方輸入「這是班長最後的疼愛」：");
      if (ensure==="這是班長最後的疼愛") {
        this.openFire(this.focusSquad);
        this.$message.error('警戒兵已遭我軍殲滅，停止射擊！');
      } else {
        this.$message.warning("修但幾咧！槍下留人！");
      }
    },
  },
}
</script>

<style lang="scss">
  .component-red-button-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .redButton-1 {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 200px;
    border-radius: 100px;
    background: linear-gradient(45deg, rgba(68,68,68,1) 0%, rgb(136, 136, 136) 100%);
    box-shadow: -8px 2px 8px rgba(0,0,0,.6);

    .redButton-2 {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 170px;
      height: 170px;
      border-radius: 100px;
      background: linear-gradient(45deg, rgb(82, 82, 82) 0%, rgb(158, 158, 158) 100%);

      .redButton-3 {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 150px;
        border-radius: 100px;
        background: #4e2020;

        .redButton-4{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 140px;
          height: 140px;
          border-radius: 100px;
          background: linear-gradient(45deg, rgb(196, 41, 41) 0%, rgb(231, 155, 155) 100%);

          .redButton-5{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 120px;
            height: 120px;
            border-radius: 100px;
            background: linear-gradient(90deg, rgb(255, 122, 122) 0%, rgb(240, 62, 62) 100%);
            color: white;
            font-size: 36px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
