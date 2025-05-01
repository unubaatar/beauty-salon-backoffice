import { defineStore } from 'pinia'

interface User {
  firstName: string
  lastName: string
  password: string
  avatar: string
  role: string
  phone: string
  email: string,
  _id: string
}

export const useAuthStore = defineStore('auth', {
  state: (): {
    user: User | null
    token: string | null
    loading: Boolean
  } => ({
    user: null,
    token: null,
    loading: true
  }),

  actions: {
    setUser(user: User) {
      this.user = user
    },
    setToken(token: string) {
      this.token = token
    },
    setLoading() {
      this.loading = false;
    },
    logout() {
      this.loading = false;
      this.user = null
      this.token = null
      localStorage.clear()
    },
  },
  persist: true
})
