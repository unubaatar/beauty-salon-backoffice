import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const auth = useAuthStore()
    if (!auth.user) {
      return navigateTo('/auth')
    }
  }
})
