<template>
    <div>
        <el-collapse @change="handleChange"  v-model="activeNames"  >
            <el-collapse-item  v-for="(item, index) in actuatorLinks" :key="'actuator'+index"  :title="item.href" :name="item.href">
                
                <el-collapse v-if="childVisible" style="margin-left: 30px;" @change="handleChildChange"  v-model="activeChildNames"  >
                    <el-collapse-item  :title="child" :name="child" v-for="(child, index) in childLinks" :key="'child'+index">
                        <pre>{{childContent}}</pre>
                    </el-collapse-item>
                </el-collapse>

                <pre v-else>{{content}}</pre>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    data(){
        return {
            actuatorLinks: [],
            content:'',
            activeNames: [],
            childContent:'',
            activeChildNames: [],
            childLinks:[],
            childVisible: false
        }
    },
    created(){
        this.getMetricsList()
    },
    methods:{
        getMetricsList(){
            this.Api.actuator().then(result => {
                console.log(result.data._links)
                this.actuatorLinks = result.data._links
            })
        },
        handleChange(val){
            if (val!=null && val!='') {
                if (val.indexOf('{')!=-1 || val[0].indexOf('{')!=-1) {
                    let url = val[0].substring(0,val[0].lastIndexOf('/'))
                    this.Api.get({url:url}).then(result => {
                        if (result.data.names) {
                            result.data.names.forEach((rec,index) => {
                                this.childLinks[index] = url+'/'+rec
                            })
                            this.childVisible = true
                        }
                    }) 
                } else {
                    this.Api.get({url:val}).then(result => {
                        this.content = JSON.stringify(result, null, 4)
                        this.childVisible = false
                    })
                }
            }
        },
        handleChildChange(val){
            if (val!=null && val!='') {
                this.Api.get({url:val}).then(result => {
                    this.childContent = JSON.stringify(result, null, 4)
                })
            }
        },
    }
}
</script>
