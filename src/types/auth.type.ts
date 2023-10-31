import { User } from './user.type'
import { SuccessReponse } from './utils.type'

export type AuthResponse = SuccessReponse<{
  access_token: string
  expires: number
  user: User
  refresh_token: string
  expire_refresh_token: number
}>

export type RefreshTokenResponse = SuccessReponse<{ access_token: string }>
