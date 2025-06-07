// src/directives/videoAutoplay.js
export default {
  mounted(el) {
    const video = el

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 视频进入视口，自动播放
          video.muted = true // 静音才能自动播放
          video.play().catch(err => {
            console.warn('视频自动播放失败', err)
          })
        } else {
          // 视频离开视口，暂停播放
          video.pause()
        }
      })
    }, {
      root: null, // 使用浏览器视口作为根
      threshold: 0.3 // 只要 30% 进入视口就触发
    })

    observer.observe(video)
  }
}