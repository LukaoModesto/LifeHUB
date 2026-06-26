import { api } from "./api";

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type GoogleLoginData = {
  credential: string;
};

export type AuthToken = {
  access_token: string;
  token_type: string;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
};

export async function registerUser(registerData: RegisterData) {
  const response = await api.post<UserResponse>("/users/register", registerData);

  return response.data;
}

export async function loginUser(loginData: LoginData) {
  const response = await api.post<AuthToken>("/users/login", loginData);

  return response.data;
}

export async function loginWithGoogle(googleLoginData: GoogleLoginData) {
  const response = await api.post<AuthToken>(
    "/users/google-login",
    googleLoginData
  );

  return response.data;
}