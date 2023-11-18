export interface FetchOptions extends RequestInit {
  onSuccess?: (data: unknown) => void;
  url?: string;
}
