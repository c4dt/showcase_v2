/*
This middleware runs before every route change to check if 
the search query is not present in the url but there's a value in the search bar.
If so, it clears the search bar.
*/
export default defineNuxtRouteMiddleware((to) => {
  const searchQuery = useState("search-query");
  if (!to.query.search && searchQuery.value) {
    searchQuery.value = "";
  }
});
