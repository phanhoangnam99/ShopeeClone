import { useContext } from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import Popover from '../Popover'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { PurchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'

export default function NavHeader() {
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: PurchasesStatus.inCart }] })
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)
  }
  return (
    <div className='flex justify-end'>
      <Popover
        className='flex items-center py-1 hover:text-white/70 cursor-pointer h-9 '
        renderPopover={
          <div className='bg-white relative rounded-sm border border-gray-200  shadow-md '>
            <div className='flex flex-col py-2 pr-28 pl-2'>
              <button className='py-2 px-3 hover:text-orange text-left' onClick={() => changeLanguage('vi')}>
                Tiếng Việt
              </button>
              <button className='py-2 px-3 hover:text-orange text-left' onClick={() => changeLanguage('en')}>
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>{currentLanguage}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-5 h-5'
        >
          ()
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {/* <div
      className='flex items-center py-1 hover:text-white/70 cursor-pointer'
      onMouseEnter={() => showPopover()}
      onMouseLeave={() => hidePopover()}
      ref={refs.setReference}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-5 h-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
        />
      </svg>
      <span className='mx-1'>Tiếng Việt</span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-5 h-5'
      >()
        <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
      </svg>
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              style={{ transformOrigin: `${middlewareData.arrow?.x}px top`, ...floatingStyles }}
              initial={{ opacity: 0, scale: 0, transform: floatingStyles.transform }}
              animate={{ opacity: 1, transform: `${floatingStyles.transform} scale(1)`}}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 5 }}
              ref={refs.setFloating}
            >
              <span
                ref={arrowRef}
                className='border-x-transparent border-t-transparent border-b-white border-[11px] absolute z-10 left-1/2 right-1/2 -translate-x-1/2 -translate-y-full'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              ></span>
              <div className='bg-white relative rounded-sm border border-gray-200 bg-white shadow-md '>
                <div className='flex flex-col py-2 px-3'>
                  <button className='py-2 px-3 hover:text-orange'>Tiếng Việt</button>
                  <button className='py-2 px-3 hover:text-orange'>English</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div> */}
      {/* //=====================================AVATAR============================================= */}
      {isAuthenticated ? (
        <Popover
          className='flex items-center py-1 hover:text-white/70 cursor-pointer h-9 '
          renderPopover={
            <div className='shadow-md rounded-sm border border-gray-200 bg-white relative'>
              <Link
                to={path.profile}
                className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
              >
                Tài Khoản Của Tôi
              </Link>
              <Link
                to='/user/purchase'
                className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
              >
                Đơn Mua
              </Link>
              <button
                className='block py-3 px-4 hover:bg-slate-100 bg-white hover:text-cyan-500 w-full text-left'
                onClick={() => handleLogout()}
              >
                Đăng Xuất
              </button>
            </div>
          }
        >
          <div className='m-6 h-6 mr-2 flex-shrink-0'>
            <div className='shopee-avatar w-5 h-5'>
              <div
                className='w-full bg-[#f5f5f5] h-0 w-6 rounded-full relative overflow-hidden h-0 '
                style={{ paddingTop: '100%' }}
              >
                {profile && profile.avatar ? (
                  <img
                    src={
                      getAvatarUrl(profile?.avatar) ||
                      `<svg
                          enableBackground='new 0 0 15 15'
                          viewBox='0 0 15 15'
                          x={0}
                          y={0}
                          className='shopee-svg-icon icon-headshot stroke-[#c6c6c6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                          style={{ width: ' 1em', height: '1em' }}
                        >
                          <g>
                            <circle cx='7.5' cy='4.5' fill='none' r='3.8' strokeMiterlimit={10} />
                            <path
                              d='m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6'
                              fill='none'
                              strokeLinecap='round'
                              strokeMiterlimit={10}
                            />
                          </g>
                        </svg>`
                    }
                    alt=''
                    className='absolute top-0'
                  />
                ) : (
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='shopee-svg-icon icon-headshot stroke-[#c6c6c6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                    style={{ width: ' 1em', height: '1em' }}
                  >
                    <g>
                      <circle cx='7.5' cy='4.5' fill='none' r='3.8' strokeMiterlimit={10} />
                      <path
                        d='m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6'
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                      />
                    </g>
                  </svg>
                )}
              </div>
            </div>
          </div>
          {profile?.name}
        </Popover>
      ) : (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            Đăng Ký
          </Link>
          <div className='border-r-[1px] border-r-white/40 h-4'></div>
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            Đăng Nhập
          </Link>
        </div>
      )}
    </div>
  )
}
