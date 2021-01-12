<template>
  <div class="component-manual-container">
    <a-drawer :visible="visible" :closable="false" @close="onClose">
      <div slot="title">
        <slot name="title"></slot>
      </div>
      
      <slot name="main"></slot>
    </a-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  }
}
</script>
