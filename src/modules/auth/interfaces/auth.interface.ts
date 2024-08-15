export interface ITokenResponse {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface IAuthPayload {
    id: string;
  }
  
  export interface IGetPermissionFromRolePayload {
    module: string;
  }
  
  export enum TokenType {
    ACCESS_TOKEN = 'AccessToken',
    REFRESH_TOKEN = 'RefreshToken',
  }