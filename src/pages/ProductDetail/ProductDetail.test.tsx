import { delay, renderWithRouter } from 'src/utils/__test__/testUtils'
import { describe, test, expect } from 'vitest'

describe('ProductDetail', () => {
  test('Render UI ProductDetail', async () => {
    renderWithRouter({ route: '/Điện-Thoại-Vsmart-Active-3-6GB64GB--Hàng-Chính-Hãng-i,60afb2c76ef5b902180aacba' })
    await delay(1000)
    expect(document.body).toMatchSnapshot()
  })
})
