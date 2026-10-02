import { AccountModel, AuthenticationParams } from '../models';

export interface Authentication {
  auth: (params: Authentication.Params) => Promise<Authentication.Model>;
}

export namespace Authentication {
  export type Params = AuthenticationParams;
  export type Model = AccountModel;
}
