import { createApp } from 'vue'
import App from './App.vue'
import './mock' // 👈 确保这行存在，并且路径正确
import lazy from './directives/lazy'
import videoAutoplay from './directives/videoAutoplay'
const app = createApp(App)
app.directive('lazy', lazy)
app.directive('video-autoplay', videoAutoplay)
app.mount('#app')