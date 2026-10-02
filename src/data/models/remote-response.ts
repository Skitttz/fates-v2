/** envelope padrão da API */
export type RemoteResponse<T> = {
  status: number;
  data?: T;
  error?: string;
};
