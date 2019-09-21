<template>
    <div class="mod-menu__icon-list">
        <ul class="icon-list">
            <li v-for="(item, index) in iconList"
                  :key="index">
                  <span>
                <icon  class="myicon" :name="item" :w='40' :h='40'></icon>
                <span class="icon-name">{{item}}</span>
                  </span>
            </li>
        </ul>


    </div>
</template>

<script>
import myIcon from '@/icons/index'
export default {
    data(){
        return {
            iconList: []
        }
    },
    created () {
      this.iconList = myIcon.getNameList()
      console.log(this.iconList)
    },
}
</script>
<style>
.icon-list {
    overflow: hidden;
    list-style: none;
    padding: 0;
    border: 1px solid #eaeefb;
    border-radius: 4px;

}   
.icon-list li {
    float: left;
    width: 16.66%;
    text-align: center;
    height: 120px;
    line-height: 120px;
    color: #666;
    font-size: 13px;
    transition: color .15s linear;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
} 
.icon-list li span {
    display: inline-block;
    line-height: normal;
    vertical-align: middle;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    color: #99a9bf;
}
.icon-list li .myicon {
    display: block;
        font-size: 32px;
        margin-bottom: 15px;
        color: #606266;

}

.icon-list li .icon-name {
    display: inline-block;
    padding: 0 3px;
    height: 1em;
    color: #606266;
}
</style>


