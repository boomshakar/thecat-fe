import { useEffect, useState } from "react";

const BASE_URL = "https://api.thecatapi.com/v1";

function useFetch<T>(
  url: string,
  initialData?: undefined,
  options?: RequestInit,
  refetch?: boolean | null
): { data: T | undefined; loading: boolean; error: boolean } {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { method = "GET", body = "" } = options || {};

  useEffect(() => {
    if (refetch !== null) {
      setLoading(true);
      const request$ = fetch(BASE_URL + url, {
        method,
        headers: {
          "x-api-key": "live_bqYl4DD1L0aOtI4pmyvQlzc7rVXMp9hJPPB1MijmXbmbBV61UJIiAAtxUewCS7XF",
        },
        ...(method !== "GET" && { body }),
      });

      request$
        .then(async (statusResp) => {
          let resp;
          if (statusResp.ok) {
            try {
              // in case if request was succeed and valid JSON data was returned
              resp = await statusResp.clone().json();
              return resp;
            } catch (e) {
              // in case if request was succeed but no JSON data was returned
              resp = await statusResp.text();
              return resp;
            }
          } else {
            throw new Error("Error occured");
          }
        })
        .then((res) => {
          setData(res);
          setError(false);
        })
        .catch(() => {
          setData(undefined);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, url]);

  return { data, loading, error };
}

export default useFetch;
