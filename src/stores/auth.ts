import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/login`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      const user = await fetchWrapper.post(baseUrl, { username, password });
      console.log(user);
      // update pinia state
      this.user = user;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('token',(user.token));
      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/dashboard/default');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  }
});
