<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>



      <el-form label-width="120px">

        <el-form-item label="课程标题">
          <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>
        <!-- 所属分类 TODO -->
        <el-form-item label="课程类别">
          <el-select
            v-model="courseInfo.subjectParentId"
            placeholder="一级分类" @change="subjectLevelOneChanged">
            <el-option
              v-for="subject in oneSubjectList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
          <!-- 二级分类 -->
          <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
            <el-option
              v-for="subject in twoSubjectList"
              :key="subject.value"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
        </el-form-item>




        <!-- 课程讲师 TODO -->
        <el-form-item label="课程讲师">
          <el-select
            v-model="courseInfo.teacherId"
            placeholder="请选择">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
          </el-select>
        </el-form-item>


        <el-form-item label="总课时">
          <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 所属分类 TODO -->



        <el-form-item label="课程简介">
          <el-input  v-model="courseInfo.description" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介 TODO -->

        <!-- 课程封面 TODO -->

        <el-form-item label="课程价格">
          <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
        </el-form-item>
      </el-form>

  </div>
</template>
<!--课程信息-->

<script>
  import course from '@/api/teacher/course'
  import subject from '@/api/teacher/subject'
    export default {
        name: "info",
      data(){
          return{
            saveBtnDisabled:false,
            courseInfo:{
            title: '',
            subjectId: '',//二级分类id
              subjectParentId:'',//一级分类id
            teacherId: '',
            lessonNum: 0,
            description: '',
            cover: '',
            price: 0
          },
            teacherList:[//封装所有讲师   这定义的是数组 []

            ],
            oneSubjectList:[],
            twoSubjectList:[]
          }
      },
      created(){
        //初始化所有讲师
        this.getTeacherList();
        this.getOneSubjectList();
      },
      methods:{
          //点击一个一级分类  触发change 显示对应二级分类  value是一级分类的id
        subjectLevelOneChanged(value){
          //遍历所有分类
          for (let i=0;i<this.oneSubjectList.length;i++){
            if(this.oneSubjectList[i].id===value){
              this.twoSubjectList=this.oneSubjectList[i].children;
            }
          }
        },
          //查询所有讲师
        getTeacherList(){
          course.getTeacherList().then(res=>{
            this.teacherList=res.data.items;
          })
        },
        saveOrUpdate(){
          course.saveCourseInfo(this.courseInfo).then(response=>{
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            //跳转到第二步
            this.$router.push({path:`/course/chapter/`+response.data.courseId})
          })

        },
        //查询所有课程
        getOneSubjectList(){
          subject.getSubjectList().then(res=>{
            console.log(res)
            this.oneSubjectList=res.data.list;
          })
        }
      }
    }
</script>

<style scoped>

</style>
