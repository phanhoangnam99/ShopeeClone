import { User } from 'src/types/user.type'
import { SuccessReponse } from 'src/types/utils.type'
import http from 'src/utils/http'

interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  newPassword?: string
  password?: string
}

const userApi = {
  getProfile() {
    return http.get<SuccessReponse<User>>('me')
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessReponse<User>>('user', body)
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessReponse<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
