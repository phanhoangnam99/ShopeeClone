import axios, { AxiosInstance, AxiosError, HttpStatusCode, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import {
  clearLS,
  getAccessTokenFromLs,
  getRefreshTokenFromLs,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import config from 'src/constants/config'
import { URL_LOGIN, URL_REFRESH_TOKEN, URL_REGISTER, URL_LOGOUT } from 'src/apis/auth.api'
import { isAxiosExpireError, isAxiosUnAuthorizedError } from './utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useNavigate } from 'react-router-dom'
import path from 'path'

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLs()
    this.refreshToken = getRefreshTokenFromLs()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60,
        'expire-refresh-token': 60 * 3600
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS({ ...data.data.user })
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message

          toast.error(message)
        }

        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - token không đúng
        // - không truyền token
        // - token hết hạn

        // Nếu là lỗi 401
        if (isAxiosUnAuthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config

          // Trường họp Token hết hạn và request đó không phải là của request refresh token
          // thì chúng ta mới tiến hành gọi refresh token
          if (isAxiosExpireError(error) && url !== URL_REFRESH_TOKEN) {
            //Hạn chế gọi refreshtoken 2 lần
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  //Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng

                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              config.headers.authorization = access_token

              // nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }

          // Còn những trường hợp như token không đúng
          // không truyền token
          // token hết hạn nhưng gọi refresh token bị fail
          // thì tiến hành xoá local storage và toast message

          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data?.message)

          // window.location.reload()
        }

        return Promise.reject(error)
      }
    )
  }
  private async handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, { refresh_token: this.refreshToken })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http
