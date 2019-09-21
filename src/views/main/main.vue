<template>
    <div class="app-wrapper" :class="classComp">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
        <sidebar class="sidebar-container"></sidebar>
        <div class="main-container">
        <navbar></navbar>
        <tags-view></tags-view>
        <app-main></app-main>
        </div>

    </div>
</template>

<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import AppMain from './components/AppMain'
import TagsView from './components/TagsView'

export default {
    name: 'layout',
    components: {
        Navbar,
        Sidebar,
        AppMain,
        TagsView
    },
    computed: {
        sidebar() {
        return this.$store.state.app.sidebar
        },
        device() {
        return this.$store.state.app.device
        },
        classComp(){
            return {
                hideSidebar:!this.sidebar.opened,
            }

        }
    }
}
</script>

