<template>
  <div class="waterfall-container" ref="container">
    <div v-for="(item, index) in items" :key="index" class="waterfall-item">
      <div class="content">
        <div v-if="item.type === 'image'" class="image-wrapper">
          <img v-lazy="item.image" :src="item.image" alt="图片" />
        </div>
        <div v-else class="video-wrapper">
          <video :src="item.video" controls v-video-lazy v-video-autoplay autoplay muted loop
            class="video-player"></video>
        </div>
        <div class="download-button">
          <div class="text">{{ item.title }}</div>
          <!-- 使用 SVG 图标 -->
          <div class="like-button" @click="toggleLike(item)">
            <svg :class="['like-icon', item.liked ? 'liked' : '']" viewBox="0 0 24 24" width="20" height="20">
              <path v-if="!item.liked"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              <path v-if="item.liked"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {{ item.likes }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
let masonryInstance = null
const initMasonry = () => {
  const containerEl = container.value
  if (!containerEl) return

  imagesLoaded(containerEl, () => {
    if (masonryInstance) {
      masonryInstance.reloadItems()
      masonryInstance.layout()
    } else {
      masonryInstance = new Masonry(containerEl, {
        itemSelector: '.waterfall-item',
        columnWidth: '.waterfall-item',
        percentPosition: true
      })
    }
  })
}
const props = defineProps({
  fetchData: {
    type: Function,
    required: true
  },
  pageSize: {
    type: Number,
    default: 6
  }
})
const container = ref(null)
const items = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

// 模拟获取数据
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  const newItems = await props.fetchData(page.value, props.pageSize)
  if (newItems.length === 0) hasMore.value = false
  items.value.push(...newItems)
  loading.value = false
  page.value++
  setTimeout(initMasonry, 100)
}
onMounted(() => {
  loadMore()
})

// 上拉加载更多  节流防止重复点击

let ticking = false

window.addEventListener('scroll', () => {
  if (!container.value || ticking) return
  const rect = container.value.getBoundingClientRect()
  if (rect.bottom <= window.innerHeight + 300) {
    loadMore()
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
    })
  }
})
// 下拉刷新
let startY = 0
let isDragging = false

window.addEventListener('touchstart', (e) => {
  if (window.scrollY === 0) {
    startY = e.touches[0].clientY
    isDragging = true
  }
})

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return
  const currentY = e.touches[0].clientY
  const diff = currentY - startY
  if (diff > 50) {
    refreshData()
    isDragging = false
  }
})

window.addEventListener('touchend', () => {
  isDragging = false
})

const refreshData = () => {
  items.value = []
  page.value = 1
  hasMore.value = true
  loadMore()
}
// 点赞功能
const toggleLike = (item) => {
  item.liked = !item.liked
  if (item.liked) {
    item.likes++
  } else {
    item.likes--
  }
}
</script>
<style scoped>
.download-button{
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.waterfall-container {
  display: block;
}

.waterfall-item {
  width: calc(50% - 8px);
  /* 移动端也保持两列 */
  margin-right: 8px;
  margin-bottom: 8px;
}

.waterfall-item:nth-child(even) {
  margin-right: 0;
}

.waterfall-item .content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.video-wrapper .video-player {
  width: 100%;
  height: auto;
  display: block;
}
.like-button {
  display: flex;
  align-items: flex-end;
}
/* like-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  color: #999;
  font-size: 14px;
}

.iconfont {
  font-family: "iconfont";
}

.icon-like-fill {
  color: red;
} */
.like-icon {
  fill: #999;
  transition: fill 0.3s;
  vertical-align: middle;
  margin-right: 4px;
}

.like-icon.liked {
  fill: red;
}

.text {
  padding: 10px;
}
</style>