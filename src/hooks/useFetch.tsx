import { useCallback, useEffect, useState } from "react";
import type { FetchOptions } from "../types";

const BASE_URL = "https://api.thecatapi.com/v1";

/**
 * Custom hook for making API requests using the Fetch API.
 *
 * @param url - The URL for the API endpoint.
 * @param autoFetch - Determines whether the API request should be made automatically on mount.
 * @param options - Additional options for the API request (e.g., method, headers).
 * @param initialData - Initial data to be set before the API request.
 * @returns Object containing data, loading state, error state, and a triggerFetch function.
 */
function useFetch<T>(
  url?: string,
  autoFetch: boolean = true,
  options?: FetchOptions,
  initialData?: T
): { data: T | undefined; loading: boolean; error: boolean; triggerFetch: (params?: FetchOptions) => Promise<void> } {
  // State variables for storing data, loading state, and error state
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { method = "GET", body = undefined, onSuccess } = options || {};

  // Callback function for fetching data
  const fetchData = useCallback(
    async (params?: FetchOptions) => {
      // Set loading state to true before making the API request
      setLoading(true);

      try {
        const response = await fetch(BASE_URL + (params?.url || url), {
          method: params?.method || method,
          headers: {
            "x-api-key": import.meta.env.VITE_APP_API_KEY,
            ...(params?.headers || {}),
          },
          ...((params?.method || method) !== "GET" && { body: params?.body || JSON.stringify(body) }),
        });

        // Check if the response is successful; otherwise, throw an error
        if (!response.ok) {
          throw new Error("Error occurred");
        }
        // Parse the JSON response and update the data state
        const responseData = await response.json();
        setData(responseData);
        setError(false);

        // Execute the onSuccess callback if provided
        onSuccess && onSuccess(responseData);
      } catch (error) {
        // If an error occurs during the API request, update the error state
        setData(undefined);
        setError(true);
      } finally {
        // Set loading state to false after the API request is complete
        setLoading(false);
      }
    },
    [url, method, body, onSuccess]
  );

  // Effect to trigger the API request on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Callback function for manually triggering the API request
  const triggerFetch = useCallback(
    async (params?: FetchOptions) => {
      // Call the fetchData function to make the API request
      return await fetchData(params);
    },
    [fetchData]
  );

  // Return an object containing data, loading state, error state, and triggerFetch function
  return { data, loading, error, triggerFetch };
}

export default useFetch;
