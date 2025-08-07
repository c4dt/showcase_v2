export const useSearch = () => {
  const search = useState<boolean>("search", () => true);
  const toggleSearch = () => {
    search.value = !search.value;
  };
  return { search, toggleSearch };
};
