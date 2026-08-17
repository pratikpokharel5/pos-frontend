export const AUTH_TOKEN_KEY = "pos_auth_token";

export type ApiCollection<T> = {
  data: Array<T>;
  links?: Record<string, string | null>;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ApiResource<T> = {
  data: T;
};

export type Query = Record<string, string | number | boolean | null | undefined>;

export type TableHeader = {
  key: string;
  label: string;
};
