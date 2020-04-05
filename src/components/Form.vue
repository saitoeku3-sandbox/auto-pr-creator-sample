<template>
  <div class="wrapper">
    <div class="name">{{ $props.virtualBeing.label }}</div>
    <form @submit="submit">
      <div>
        <label>チャンネル ID</label>
        <input type="text" v-model="youtubeChannelId" />
      </div>
      <div>
        <label>チャンネル名</label>
        <input type="text" v-model="youtubeChannelName" />
      </div>
      <div>
        <label>所属</label>
        <input type="text" v-model="office" />
      </div>
      <div>
        <label>Twitter</label>
        <input type="text" v-model="twitterAccount" />
      </div>
      <div>
        <button>変更</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { VirtualBeing } from '~/types'

export default Vue.extend({
  name: 'Form',

  props: {
    virtualBeing: {
      type: Object as PropType<VirtualBeing>,
      required: true
    }
  },

  data() {
    return {
      youtubeChannelId: this.virtualBeing.youtubeChannelId,
      youtubeChannelName: this.virtualBeing.youtubeChannelName,
      office: this.virtualBeing.office,
      twitterAccount: this.virtualBeing.twitterAccount
    }
  },

  methods: {
    async submit(event: Event) {
      event.preventDefault()
      const isConfirmed = confirm('送信しますか？')
      if (!isConfirmed) return

      const virtualBeing: VirtualBeing = {
        label: this.virtualBeing.label,
        youtubeChannelName: this.youtubeChannelName,
        youtubeChannelId: this.youtubeChannelId,
        office: this.office,
        twitterAccount: this.twitterAccount
      }

      try {
        await this.$axios.$post('/virtual-beings', virtualBeing)
      } catch (error) {
        console.error(error)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  padding: 32px;
}

.name {
  font-weight: bold;
}
</style>
