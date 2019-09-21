<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.avatar" /> {{realname}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
            <el-menu :default-active="$route.path" class="" @open="onMenuOpen" @close="onMenuClose" @select="onMenuSelect"
                unique-opened router v-show="!collapsed">
                 <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :key="index+''" :index="item.path"  v-if="item.children&&item.children.length>0">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}ss</template>
                            <el-menu-item :key="childIndex" v-for="(child,childIndex) in item.children" :index="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="!item.children" :key="index+''" :index="item.path"><i :class="item.iconCls"></i>{{item.name}}</el-menu-item>
				</template>
            </el-menu>
            <!--导航菜单-折叠后-->
            <ul class="el-menu collapsed" v-show="collapsed" ref="menuCollapsed">
                <li :key="index" v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                    <template v-if="!item.leaf">
                        <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                        <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
                            <li :key="child.index" v-for="child in item.children" v-if="!child.hidden" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
                        </ul>
                    </template>
                    <template v-else>
                        <li class="el-submenu">
                            <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
                        </li>
                    </template>
                </li>
            </ul>
            
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item :key="item.path" v-for="item in $route.matched">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
            </section>
        </el-col>

    </el-row>
</template>
<script>
import { Message } from 'element-ui';
export default {
    data() {
        return {
            collapsed:false,
            sysName:'System',
            realname:'',
            avatar:''
        }
    },
    methods: {
        onMenuOpen() {
            
        },
        onMenuClose() {

        },
        onMenuSelect() {
            Message.success({
                title: '成功',
                message: '这是一条成功的提示消息',
                type: 'success'
                });
        },
        //退出登录
        logout: function () {
            var _this = this;
            this.$confirm('确认退出吗?', '提示', {
                //type: 'warning'
                cancelButtonClass: 'btn-custom-cancel',
            }).then(() => {
                sessionStorage.removeItem('user');
                _this.$router.push('/login');
            }).catch(() => {

            });


        },
    },
    mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.realname = user.realname || '';
				this.avatar = this.Api.server + user.avatar || '';
			}

		}
}
</script>

<style scoped lang="scss">
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        .header {
            background-color: #409eff;
            height: 60px;
            line-height: 60px;
            .userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
            
        }
        .main {
            background-color: #cecece;
            display: flex;
            position: absolute;
            top: 60px;
            bottom: 0;
            overflow: hidden;
            aside {
                flex:0 0 230px;
                width: 230px;
                .el-menu{
                    height:100%
                }
                .collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
            }
            .menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				flex:1;
				overflow-y: auto;
				padding: 20px;
				.breadcrumb-container {
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
        }
    }
</style>

