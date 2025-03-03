/*
This composable useSearchQuery stores the search query in a global state.
It also initializes the search query from the route query parameter "search".

This is an easy way to make the search query available to all components in the application.
*/

export default function () {
  const searchQuery = useState<string>("search-query", () => "");
  if (searchQuery.value === "") {
    const route = useRoute();
    searchQuery.value = typeof route.query.search === "string" ? route.query.search : "";
  }
  return searchQuery;
}
