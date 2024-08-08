// plugins/router.js
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(({ vueApp }) => {
  const router = vueApp.config.globalProperties.$router;

  router.beforeEach((to, from, next) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const userType = localStorage.getItem('userType');
      const isLoggedIn = !!token;

      // Route guards
      if (to.path === '/homepage' && isLoggedIn) {
        // Redirect logged-in users away from the login page
        if (userType === 'Bidder') {
          next('/bidderdashboard');
        } else if (userType === 'Auctioneer') {
          next('/auctioneerdashboard');
        } else {
          next('/'); // Fallback
        }
      } else if (!isLoggedIn && to.path !== '/homepage') {
        // Redirect not logged-in users to the login page
        next('/homepage');
      } else if (isLoggedIn && to.path === '/bidderdashboard' && userType !== 'Bidder') {
        // Redirect non-bidders away from the bidder dashboard
        next('/');
      } else if (isLoggedIn && to.path === '/auctioneerdashboard' && userType !== 'Auctioneer') {
        // Redirect non-auctioneers away from the auctioneer dashboard
        next('/');
      } else {
        next(); // Proceed to the intended route
      }
    } else {
      next(); // Proceed if server-side rendering
    }
  });
});
