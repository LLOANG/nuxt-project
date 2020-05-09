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


  getSubjectList(){
    return request({
      //url:'/eduservice/edu-teacher/pageTeacherCondition/'+current+'/'+limit,
      //url:'/eduservice/teacher/pageTeacherCondition/${current}/${limit}'
      // ``  不是单引号  不然                          这里不会变色
      url:`/eduservice/subject/getAllSubject`,
      method:'get',
    })
  }

}
