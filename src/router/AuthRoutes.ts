const AuthRoutes = {
  path: '/auth',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'Login',
      path: '/auth/login',
      component: () => import('@/views/authentication/auth/LoginPage.vue')
    },
    {
      name: 'Register',
      path: '/auth/register',
      component: () => import('@/views/authentication/auth/RegisterPage.vue')
    },


  ]
};

export default AuthRoutes;
