<template>
  <section class="app-main" style="min-height: 100%;margin: 10px;">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      console.log(this.$route.fullPath)
      return this.$route.fullPath
    }
  }
}
</script>
