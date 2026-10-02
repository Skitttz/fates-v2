export type RemoteAccountModel = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
};
