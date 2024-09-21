import axios from 'axios';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  try {
    // Perform the API call to check authentication and get user type
    const { data } = await axios.get('/api/check-token');
    const { isLoggedIn, userType } = data;

    if (!isLoggedIn) {
      // If not logged in, redirect to homepage (except when already on homepage)
      if (to.path !== '/homepage') {
        return navigateTo('/homepage');
      }
    } else {
      // Redirect logged-in users based on their userType
      if (to.path === '/homepage' || to.path === '/bidder' ) {
        if (userType === 'Bidder') {
          return navigateTo('/bidder/bidderdashboard', { replace: true });
        } else if (userType === 'Auctioneer') {
          return navigateTo('/auctioneer/auctioneerdashboard', { replace: true });
        }
      }

      // Prevent access to Bidder or Auctioneer routes if the user type doesn't match
      if (to.path.startsWith('/bidder') && userType !== 'Bidder') {
        return navigateTo('/homepage');
      }

      if (to.path.startsWith('/auctioneer') && userType !== 'Auctioneer') {
        return navigateTo('/homepage');
      }
    }
  } catch (error) {
    // Handle errors by redirecting to homepage
    console.error('Error checking authentication:', error);
    if (to.path !== '/homepage') {
      return navigateTo('/homepage');
    }
  }
});
