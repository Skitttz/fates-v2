/** envelope padrão da fates-v2-api */
export type RemoteResponse<T> = {
  status: number;
  data?: T;
  error?: string;
};
