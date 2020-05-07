import request from '@/utils/request'

//
// export function getList(params) {
//
//   return request({
//     url:'/table/list',
//     method:'get',
//   params
// })
// }

//第二种写法
export  default {

    //讲师列表  条件查询分页
  //current 当前页 limit每页记录数  teacherquery条件对象
  getTeacherListPage(current,limit,teacherQuery){
    return request({
      //url:'/eduservice/edu-teacher/pageTeacherCondition/'+current+'/'+limit,
      //url:'/eduservice/teacher/pageTeacherCondition/${current}/${limit}'
      // ``  不是单引号  不然                          这里不会变色
      url:`/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
      method:'post',
      //teacherquery条件对象   后端使用RequestBody获取数据
      //data 表示把对象转换成json传递到接口中去
      data: teacherQuery
    })
  },
  removeDataById(id){
    return request({
      url:`/eduservice/teacher/${id}`,
      method:'delete'
    })
  },
  addTeacher(eduTeacher){
    return request({
      url:'/eduservice/teacher/addTeacher',
      method:'post',
      data:eduTeacher
    })
  },
  updateTeacher(teacher){
    return request({
      url:'/eduservice/teacher/updateTeacher',
      method:'post',
      data:teacher
    })
  },
  getTeacherInfo(id){
    return request({
      url:`/eduservice/teacher/getTeacher/${id}`,
      method:'get'
    })
  }
}
