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



      <!--  <el-form-item label="课程简介">
          <el-input  v-model="courseInfo.description" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>-->
        <!-- 课程简介-->
        <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>

        <!-- 课程封面-->
        <el-form-item label="课程封面">

          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss/upload'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
          </el-upload>

        </el-form-item>

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
  import Tinymce from '@/components/Tinymce'
    export default {
      components: { Tinymce },
        name: "info",
      data(){
          return{
            BASE_API: process.env.BASE_API, // 接口API地址,
            saveBtnDisabled:false,
            courseInfo:{
            title: '',
            subjectId: '',//二级分类id
              subjectParentId:'',//一级分类id
            teacherId: '',
            lessonNum: 0,
            description: '',
            cover: '/static/01.jpg',
            price: 0
          },
            teacherList:[//封装所有讲师   这定义的是数组 []

            ],
            oneSubjectList:[],
            twoSubjectList:[]
          }
      },
      created(){
        if(this.$route.params && this.$route.params.id){//id来自chapter页面的回显需要
          this.courseId=this.$route.params.id;
          //调用根据id查询课程的方法
          this.getInfo()
        }
        //初始化所有讲师
        this.getTeacherList();
        this.getOneSubjectList();
      },
      methods:{

        getInfo(){
course.getCourseInfoId(this.courseId).then(res=> {
  this.courseInfo = res.data.course;
  //有bug   二级分类信息没有显示  根据这个courseId
  //1 查询所有的分类，包含一级和二级
  subject.getSubjectList().then(response => {
    //2 获取所有一级分类
    this.oneSubjectList = response.data.list
    //3 把所有的一级分类数组进行遍历，
    for (var i = 0; i < this.oneSubjectList.length; i++) {
      //获取每个一级分类
      var oneSubject = this.oneSubjectList[i]
      //比较当前courseInfo里面一级分类id和所有的一级分类id
      if (this.courseInfo.subjectParentId == oneSubject.id) {
        //获取一级分类所有的二级分类
        this.twoSubjectList = oneSubject.children
      }
    }
  })
  //初始化所有讲师
  this.getTeacherList()
})

        },
          //上传之前
        beforeAvatarUpload(file){
          const isJPG = file.type === 'image/jpeg'
          const isLt2M = file.size / 1024 / 1024 < 2

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
          }
          return isJPG && isLt2M
        },
        //上传成功
        handleAvatarSuccess(res,file){
          console.log(res)// 上传响应
          console.log(URL.createObjectURL(file.raw))// base64编码
          this.courseInfo.cover = res.data.url

        },
          //点击一个一级分类  触发change 显示对应二级分类  value是一级分类的id
        subjectLevelOneChanged(value){
          //遍历所有分类
          for (let i=0;i<this.oneSubjectList.length;i++){
            if(this.oneSubjectList[i].id===value){
              this.twoSubjectList=this.oneSubjectList[i].children;
              this.courseInfo.subjectId="";
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
  .tinymce-container {
    line-height: 29px;
  }
</style>
