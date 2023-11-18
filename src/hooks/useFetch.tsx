import { useCallback, useEffect, useState } from "react";
import type { FetchOptions } from "../types";

const BASE_URL = "https://api.thecatapi.com/v1";

function useFetch<T>(
  url?: string,
  autoFetch: boolean = true,
  options?: FetchOptions,
  initialData?: T
): { data: T | undefined; loading: boolean; error: boolean; triggerFetch: (params?: FetchOptions) => void } {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { method = "GET", body = undefined, onSuccess } = options || {};

  const fetchData = useCallback(
    async (params?: FetchOptions) => {
      setLoading(true);

      try {
        const response = await fetch(BASE_URL + (params?.url || url), {
          method: params?.method || method,
          headers: {
            "x-api-key": "live_bqYl4DD1L0aOtI4pmyvQlzc7rVXMp9hJPPB1MijmXbmbBV61UJIiAAtxUewCS7XF",
            ...(params?.headers || {}),
          },
          ...((params?.method || method) !== "GET" && { body: params?.body || JSON.stringify(body) }),
        });

        if (!response.ok) {
          throw new Error("Error occurred");
        }
        const responseData = await response.json();
        setData(responseData);
        setError(false);
        onSuccess && onSuccess(responseData);
      } catch (error) {
        setData(undefined);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [url, method, body, onSuccess]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  const triggerFetch = useCallback(
    (params?: FetchOptions) => {
      fetchData(params);
    },
    [fetchData]
  );

  return { data, loading, error, triggerFetch };
}

export default useFetch;
