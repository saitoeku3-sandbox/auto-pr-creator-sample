<template>
  <div class="container">
    <div v-for="virtualBeing in virtualBeings" :key="virtualBeing.label">
      <Form
        :virtualBeing="virtualBeing"
        :submit="createPullRequest"
        :loading="isLoading"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Form from '~/components/Form.vue'
import { VirtualBeing } from '~/types'

export default Vue.extend({
  components: {
    Form,
  },

  data() {
    return {
      virtualBeings: [] as VirtualBeing[],
      isLoading: false,
    }
  },

  methods: {
    async createPullRequest(virtualBeing: VirtualBeing) {
      this.isLoading = true
      const isConfirmed = confirm('送信しますか？')
      if (!isConfirmed) return

      try {
        await this.$axios.$post('/virtual-beings', virtualBeing)
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
  },

  async created() {
    try {
      this.virtualBeings = await this.$axios.$get<VirtualBeing[]>(
        '/virtual-beings'
      )
    } catch (error) {
      console.error(error)
    }
  },
})
</script>

<style lang="scss" scoped></style>
