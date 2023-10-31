import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'
const authApi = {
  registerAccount(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_REGISTER, body)
  },
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },
  logout() {
    return http.post(URL_LOGOUT)
  },

  refreshToken() {
    return http.post(URL_REFRESH_TOKEN)
  }
}

// export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)

// export const login = (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)

// export const logout = () => http.post('/logout')

export default authApi
