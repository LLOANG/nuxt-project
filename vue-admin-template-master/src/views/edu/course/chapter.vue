<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
      <!-- 添加和修改章节表单 -->
      <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
          <el-form-item label="章节标题">
            <el-input v-model="chapter.title"/>
          </el-form-item>
          <el-form-item label="章节排序">
            <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 章节 -->
      <ul class="chanpterList">
        <li
          v-for="chapter in chapterVideoList"
          :key="chapter.id">
          <p>
            {{ chapter.title }}

            <span class="acts">
                <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
          </p>

          <!-- 添加小节 -->
          <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
            <el-form :model="video" label-width="120px">
              <el-form-item label="小节标题">
                <el-input v-model="video.title"/>
              </el-form-item>
              <el-form-item label="课时排序">
                <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
              </el-form-item>
              <el-form-item label="是否免费">
                <el-radio-group v-model="video.free">
                  <el-radio :label="true">免费</el-radio>
                  <el-radio :label="false">默认</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="上传视频">
                <el-upload
                  :on-success="handleVodUploadSuccess"
                  :on-remove="handleVodRemove"
                  :before-remove="beforeVodRemove"
                  :on-exceed="handleUploadExceed"
                  :file-list="fileList"
                  :action="BASE_API+'/eduvod/video/uploadAliyunVideo'"
                  :limit="1"
                  class="upload-demo">
                  <el-button size="small" type="primary">上传视频</el-button>
                  <el-tooltip placement="right-end">
                    <div slot="content">最大支持1G，<br>
                      支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                      GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                      MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                      SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                    <i class="el-icon-question"/>
                  </el-tooltip>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
              <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
            </div>
          </el-dialog>
          <!--   小节 -->
          <ul class="chanpterList videoList">
            <li
              v-for="video in chapter.children"
              :key="video.id">
              <p>{{ video.title }}
                <span class="acts">
                        <el-button type="text">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
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
  import video from '@/api/teacher/video'
    export default {
        name: "chaper",
      data(){
        return{
          saveVideoBtnDisabled:false,
          saveBtnDisabled:false,
          chapterVideoList:[],
          courseId:'',
          dialogChapterFormVisible:false,//章节弹框
          dialogVideoFormVisible:false,//小节弹框
          chapter:{
            title:'',
            sort:0
          },
          video:{
            title:'',
            sort:0,
            free: 0,
            videoSourceId: '',
            videoOriginalName:''//视频名称
          },
          fileList: [],//上传文件列表
          BASE_API: process.env.BASE_API // 接口API地址
        }
      },
      created(){
          if(this.$route.params && this.$route.params.id){//courseId来自info页面
            this.courseId=this.$route.params.id;
            this.getChapterVideo( this.courseId);
          }

      },
      methods:{
          //点击×后会弹出一个确认框 确认删除视频
        handleVodRemove(){
video.removeAliyunVod(this.video.videoSourceId).then(res=>{
  this.$message({
    type: 'success',
    message: '删除成功!'
  })
  //把文件列表清空
  this.fileList=[];
  //数据是全局的  这两个数据也要清空  不然重新打开不填数据这些已经赋值了的也会传上去
  this.video.videoSourceId = "";
//上传视频名称赋值
  this.video.videoOriginalName = ""
})
        },
          //点击×   把视频列表中的视频插掉  同时在云端也要删掉
        beforeVodRemove(file,fileList){
    return this.$confirm(`确定删除${file.name}?`);
        },
        //上传视频成功调用的方法
        handleVodUploadSuccess(response, file, fileList) {
          this.video.videoSourceId = response.data.videoId;
//上传视频名称赋值
          this.video.videoOriginalName = file.name
        },
//视图上传多于一个视频
        handleUploadExceed(files, fileList) {
          this.$message.warning('想要重新上传视频，请先删除已上传的视频')
        },
        //==================================小节操作=======================================================
        //删除小节
        removeVideo(videoId) {
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return video.removeById(videoId)
          }).then(() => {
            this.getChapterVideo()// 刷新列表
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch((response) => { // 失败
            if (response === 'cancel') {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            } else {
              this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        },
        saveOrUpdateVideo(){
this.addVideo();
        },
        addVideo(){//添加小节
          this.video.courseId = this.courseId
          this.fileList=[];
          video.addVideo(this.video).then(response => {
            //关小节弹框
            this.dialogVideoFormVisible=false;
            this.$message({
              type: 'success',
              message: '添加小节信息成功!'
            })
            //刷新页面
            this.getChapterVideo();
            this.saveBtnDisabled=false;
          })
        },
        //出现小节弹框的方法
        openVideo(chapterId){
          //弹框社为空
          this.video.title='';
          this.video.sort=0;
this.dialogVideoFormVisible=true;
//设置章节id
          this.video.chapterId = chapterId
        },


          //==================================章节操作=======================================================
          //删除章节
        removeChapter(chapterId){
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            return chapter.deleteChapter(chapterId)
          }).then(() => {
            this.getChapterVideo()// 刷新列表
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch((response) => { // 失败
            if (response === 'cancel') {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            } else {
              this.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        },
        next(){
          this.$router.push({path:`/course/publish/`+this.courseId})
        },
        previous(){
          this.$router.push({path:`/course/info/`+this.courseId})
        },
        //根据课程id查询章节和小节
        getChapterVideo(){
          chapter.getAllChapterVideo(this.courseId).then(res=>{
this.chapterVideoList=res.data.items;
          })
        },
        saveOrUpdate() {
          this.saveBtnDisabled = true
          if (!this.chapter.id) {
            this.addChapter()
          } else {
            this.updateChapter()
          }
        },

        addChapter() {
          this.chapter.courseId = this.courseId  /*存储的时候需要这个courseId*/
          chapter.addChapter(this.chapter).then(response => {
            //关闭弹框
            this.dialogChapterFormVisible=false;
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            //刷新页面
            this.getChapterVideo();
          }).catch((response) => {
            this.$message({
              type: 'error',
              message: response.message
            })
          })
        },

        updateChapter() {
          chapter.updateChapter(this.chapter)
            .then(response =>  {
              //关闭弹框
              this.dialogChapterFormVisible = false
              //提示
              this.$message({
                type: 'success',
                message: '修改章节成功!'
              });
              //刷新页面
              this.getChapterVideo()
            })
        },
        openChapterDialog(){
          //弹框
          this.dialogChapterFormVisible = true
          //清空表单
          this.chapter.title='';
          this.chapter.sort=0;

        },
        openEditChapter(chapterId) {
          this.dialogChapterFormVisible = true
          chapter.getChapter(chapterId).then(response => {
            this.chapter = response.data.chapter
          })
        }
      }

    }
</script>

<style scoped>

</style>
