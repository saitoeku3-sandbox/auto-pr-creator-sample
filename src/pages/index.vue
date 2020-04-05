<template>
  <div class="container">
    <div v-for="virtualBeing in virtualBeings" :key="virtualBeing.label">
      <Form :virtualBeing="virtualBeing" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Form from '~/components/Form.vue'
import { VirtualBeing } from '~/types'

export default Vue.extend({
  components: {
    Form
  },

  data(): { virtualBeings: VirtualBeing[] } {
    return {
      virtualBeings: []
    }
  },

  async created() {
    try {
      this.virtualBeings = await this.$axios.$get<VirtualBeing[]>(
        '/virtual-beings'
      )
    } catch (error) {
      console.error(error)
    }
  }
})
</script>

<style lang="scss" scoped></style>
