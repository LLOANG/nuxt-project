<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-button type="text">添加章节</el-button>
      <!-- 章节 -->
      <ul class="chanpterList">
        <li
          v-for="chapter in chapterVideoList"
          :key="chapter.id">
          <p>
            {{ chapter.title }}

            <span class="acts">
                <el-button type="text">添加课时</el-button>
                <el-button style="" type="text">编辑</el-button>
                <el-button type="text">删除</el-button>
            </span>
          </p>

          <!-- 视频 -->
          <ul class="chanpterList videoList">
            <li
              v-for="video in chapter.children"
              :key="video.id">
              <p>{{ video.title }}
                <span class="acts">
                        <el-button type="text">编辑</el-button>
                        <el-button type="text">删除</el-button>
                    </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<!--课程章节-->
<script>
  import chapter from '@/api/teacher/chapter'
    export default {
        name: "chaper",
      data(){
        return{
          saveBtnDisabled:false,
          chapterVideoList:[],
          courseId:''
        }
      },
      created(){
          if(this.$route.params && this.$route.params.id){//courseId来自info页面
            this.courseId=this.$route.params.id;
            this.getChapterVideo( this.courseId);
          }

      },
      methods:{
        next(){
          this.$router.push({path:`/course/publish/1`})
        },
        previous(){
          this.$router.push({path:`/course/info/`+this.courseId})
        },
        //根据课程id查询章节和小节
        getChapterVideo(courseId){
          chapter.getAllChapterVideo(courseId).then(res=>{
this.chapterVideoList=res.data.items;
          })
        }
      }

    }
</script>

<style scoped>

</style>
