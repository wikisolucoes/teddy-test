export interface AuthResponseDto {
  access_token: string;
  token_type: string;
  expires_in: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
