export type Role = 'User' | 'Admin'
export interface User {
  _id: string
  roles: Role[]
  email: string
  name?: string
  date_of_birth?: Date
  address?: string
  phone?: string
  createdAt: string
  updatedAt: string
  avatar?: string
}
