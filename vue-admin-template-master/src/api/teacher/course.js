import request from '@/utils/request'

const api_name = '/admin/edu/course'

export default {
  saveCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/course/addCourse`,
      method: 'post',
      data: courseInfo
    })
  },
  getTeacherList(){
    return request({
      url: `/eduservice/teacher/findAll`,
      method: 'get'
    })
  },
  //根据课程id查询课程基本信息
  getCourseInfoId(id) {
    return request({
      url: '/eduservice/course/getCourseById/'+id,
      method: 'get'
    })
  },
  //修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/course/updateCourseInfo',
      method: 'post',
      data: courseInfo
    })
  },

  getCoursePublishInfoById(id) {
    return request({
      url: `/eduservice/course/coursePublish/`+id,
      method: 'get'
    })
  },

  publishCourse(id) {
    return request({
      url: `/eduservice/course/publishCourse/`+id,
      method: 'put'
    })
  },
  getCourseListPage(current,limit,CourseQuery){
    return request({
      //url:'/eduservice/edu-teacher/pageTeacherCondition/'+current+'/'+limit,
      //url:'/eduservice/teacher/pageTeacherCondition/${current}/${limit}'
      // ``  不是单引号  不然                          这里不会变色
      url:`/eduservice/course/getCoursePage/${current}/${limit}`,
      method:'get',
      //teacherquery条件对象   后端使用RequestBody获取数据
      //data 表示把对象转换成json传递到接口中去
      data: CourseQuery
    })
  },
  removeById(id) {
    return request({
      url: `/eduservice/course/delete/`+id,
      method: 'delete'
    })
  }
}
