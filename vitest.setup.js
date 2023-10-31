import { afterAll, afterEach, beforeAll, expect } from 'vitest'
import { setupServer } from 'msw/node'

import authRequests from './src/msw/auth.msw'
import productRequests from './src/msw/product.msw'
import userRequests from './src/msw/user.msw'
import purchaseRequests from './src/msw/purchase.msw'
import matchers from '@testing-library/jest-dom/matchers'
// const loginRes = {
//   message: 'Đăng nhập thành công',
//   data: {
//     access_token:
//       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmY5MzVlNWZkYzVmMDM3ZTZmNjhkMyIsImVtYWlsIjoiZDNAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0yNVQwNzowMzozNC4wOTNaIiwiaWF0IjoxNjk4MjE3NDE0LCJleHAiOjE2OTgyMTc0MTV9.ll-h97ukCLv1BsOSztZ_ZjPQDGYhN5a6zOqwOOSVa_Q',
//     expires: 1,
//     refresh_token:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmY5MzVlNWZkYzVmMDM3ZTZmNjhkMyIsImVtYWlsIjoiZDNAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0yNVQwNzowMzozNC4wOTNaIiwiaWF0IjoxNjk4MjE3NDE0LCJleHAiOjE3ODQ2MTc0MTR9.EKWiIj-9ce0K96Q573uTueOLQcX1ZdQ9sV0lCXlQSV8',
//     expires_refresh_token: 86400000,
//     user: {
//       _id: '636f935e5fdc5f037e6f68d3',
//       roles: ['User'],
//       email: 'd3@gmail.com',
//       createdAt: '2022-11-12T12:36:46.282Z',
//       updatedAt: '2023-10-18T04:53:57.206Z',
//       __v: 0,
//       avatar: '6d9c09bc-6192-45aa-9c89-d13e3d079fe1.jpg',
//       name: 'Dư Thanh Được',
//       date_of_birth: '1990-03-06T17:00:00.000Z',
//       address: '1234',
//       phone: '1111111'
//     }
//   }
// }

// export const restHandlers = [
//   http.post(`${config.baseUrl}login`, (req, res, ctx) => {
//     return HttpResponse.json(loginRes)
//   })
// ]

matchers && expect.extend(matchers)


const server = setupServer(...authRequests, ...productRequests, ...userRequests, ...purchaseRequests)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
