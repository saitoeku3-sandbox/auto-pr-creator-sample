<template>
  <div class="wrapper">
    <div class="name">{{ $props.virtualBeing.label }}</div>
    <form @submit="createPullRequest">
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
        <button :disabled="loading">{{ loading ? '送信中' : '送信' }}</button>
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
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    submit: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      youtubeChannelId: this.virtualBeing.youtubeChannelId,
      youtubeChannelName: this.virtualBeing.youtubeChannelName,
      office: this.virtualBeing.office,
      twitterAccount: this.virtualBeing.twitterAccount,
    }
  },

  methods: {
    async createPullRequest(event: Event) {
      event.preventDefault()
      const virtualBeing: VirtualBeing = {
        label: this.virtualBeing.label,
        youtubeChannelName: this.youtubeChannelName,
        youtubeChannelId: this.youtubeChannelId,
        office: this.office,
        twitterAccount: this.twitterAccount
      }
      this.$props.submit(virtualBeing)
    },
  },
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
