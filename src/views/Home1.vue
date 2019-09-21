<template>
  <div class="viewFramework">
    <top></top>
    <div class="viewFrame-content">
      <sider></sider>
      <div class="section-content">
        <main class="section-main">
          <div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.title}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item :key="item.path" v-for="item in $route.matched">
								{{ item.title }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
        </main>
        <footer></footer>
      </div>
    </div>
  </div>
</template>
<script>
import top from "../components/layout/top.vue";
import sider from "../components/layout/sider.vue";
import breadcrumb from "../components/layout/breadcrumb.vue";
import footer from "../components/layout/footer.vue";
export default {
  components: {
    top,
    sider,
    footer,
    breadcrumb
  }
};
</script>
<style lang="scss">
.viewFramework {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .viewFrame-content {
    display: flex;
    height: calc(100% - 72px);
    .section-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      .section-main {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
}
</style>