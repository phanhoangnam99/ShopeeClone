import { expect, describe, it } from 'vitest'
import path from 'src/constants/path'
import { access_token } from 'src/msw/auth.msw'
import { renderWithRouter } from 'src/utils/__test__/testUtils'
import { getProfileFromLS, setAccessTokenToLS, setProfileToLS } from 'src/utils/auth'

import { waitFor } from '@testing-library/react'
import { meRes } from 'src/msw/user.msw'

describe('Profile', async () => {
  it('Hiển thị trang profile', async () => {
    setAccessTokenToLS(access_token)
    setProfileToLS(meRes.data)
    console.log(getProfileFromLS())
    const { container } = renderWithRouter({ route: path.profile })

    await waitFor(() => {
      expect((container.querySelector('form input[placeholder="Tên"]') as HTMLInputElement).value).toBe('Dư Thanh Được')
    })
  })
})
