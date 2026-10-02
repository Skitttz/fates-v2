/** envelope padrão da api */
export type RemoteResponse<T> = {
  status: number;
  data?: T;
  error?: string;
};
