<template>
    <div>welcome! {{realname}}</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'realname',
      'avatar'
    ])
  }
}
</script>

