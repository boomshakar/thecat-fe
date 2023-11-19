import useFetch from "./useFetch";

// This hook is mostly used for POST | PUT | PATCH | DELETE requests or request
// to be triggered manually
function useMutation<T>() {
  const { triggerFetch, data, error, loading } = useFetch<T>("", false, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return { triggerFetch, data, error, loading };
}

export default useMutation;
