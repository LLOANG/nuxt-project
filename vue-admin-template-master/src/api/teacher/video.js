import request from '@/utils/request'


export default {

  addVideo(videoInfo) {
    return request({
      url: `/eduservice/video/addVideo`,
      method: 'post',
      data: videoInfo
    })
  },

  getVideoInfoById(id) {
    return request({
      url: `${api_name}/video-info/${id}`,
      method: 'get'
    })
  },

  updateVideoInfoById(videoInfo) {
    return request({
      url: `${api_name}/update-video-info/${videoInfo.id}`,
      method: 'put',
      data: videoInfo
    })
  },

  removeById(id) {
    return request({
      url: `/eduservice/video/delete/`+id,
      method: 'delete'
    })
  },
  removeAliyunVod(id){
    return request({
      url: `/eduvod/video/delete/`+id,
      method: 'delete'
    })
  }
}
