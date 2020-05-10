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
  }
}
