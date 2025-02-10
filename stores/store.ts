import { defineStore } from 'pinia';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isActive: boolean;
  isApproved: boolean;
  role: string;
}

export const useUser = defineStore('user', {
  state: () => ({
    user: {
      _id: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      isActive: false,
      isApproved: false,
      role: ''
    } as User
  }),

  actions: {
    setUser(userData: User) {
      this.user = userData;
    },
    clearUser() {
      this.user = {
        _id: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        isActive: false,
        isApproved: false,
        role: ''
      };
    },
}
});