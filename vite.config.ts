import { templateCompilerOptions } from '@tresjs/core'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefix '' = đọc cả biến không có VITE_ (API_PROXY_TARGET chỉ dùng ở đây, không lộ ra bundle).
  const env = loadEnv(mode, process.cwd(), '')

  // Dev/preview: /api/* → API ASP.NET Core chạy local, giống cách Nginx làm trên VPS,
  // nên code gọi API dùng cùng một đường dẫn tương đối ở mọi môi trường và không cần CORS.
  const apiProxy: Record<string, ProxyOptions> = {
    '/api': {
      target: env.API_PROXY_TARGET || 'http://localhost:5043',
      changeOrigin: true,
    },
  }

  return {
    plugins: [vue({ ...templateCompilerOptions })],
    server: { proxy: apiProxy },
    preview: { proxy: apiProxy },
  }
})
