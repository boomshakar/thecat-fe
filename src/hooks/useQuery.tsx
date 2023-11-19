import useFetch from "./useFetch";

// This hook is mostly used for GET requests or request to be triggered automatically
function useQuery<T>(url: string) {
  const { data, loading, error, triggerFetch } = useFetch<T>(url);
  return { data, loading, error, triggerFetch };
}

export default useQuery;
