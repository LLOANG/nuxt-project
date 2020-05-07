<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" max="2"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO   disabled:保存按钮是否禁用   -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import teacher from '@/api/teacher/teacher'
    export default {
        name: "save",
      data(){
          return{
            teacher:{
              name:'',
              sort:0,
              level:1,
              career:'',
              intro:''
            },
            saveBtnDisabled:false
        }
      },
      methods:{
        saveOrUpdate(){//添加或者是修改教师
          if(this.teacher.id){
            //有id  就是修改
            this.updateTeacher();
          }else{
            //添加教师
            this.save();
          }


        },
          //添加讲师的方法
        save(){
          saveBtnDisabled:true;
          teacher.addTeacher(this.teacher).then(response=>{
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          }).then(response=>{
            this.$router.push({ path: '/teacher/table' })
          }).catch(error=>{
            this.$message({
              type: 'error',
              message: '保存失败'
            })
          })
        },
        //修改讲师的方法
      updateTeacher(){
          teacher.updateTeacher(this.teacher).then(resp=>{
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
          }).then(response=>{
            this.$router.push({ path: '/teacher/table' })
          }).catch(error=>{
            this.$message({
              type: 'error',
              message: '保存失败'
            })
          })
      }
        ,
        //根据讲师id查询信息的方法
        getInfo(id){
teacher.getTeacherInfo(id).then(response=>{
  this.teacher=response.data.items;
})
        }
      },
      created(){
          if(this.$route.params && this.$route.params.id){
            const id=this.$route.params.id;
            this.getInfo(id)
          }
      }
    }
</script>

<style scoped>

</style>
