import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { PurchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

export default function HistoryPurchase() {
  const { isAuthenticated } = useContext(AppContext)
  const purchaseTabs = [
    { status: PurchasesStatus.all, name: 'Tất cả' },
    { status: PurchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
    { status: PurchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
    { status: PurchasesStatus.inProgress, name: 'Đang giao' },
    { status: PurchasesStatus.delivered, name: 'Đã giao' },
    { status: PurchasesStatus.cancelled, name: 'Đã huỷ' }
  ]

  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || PurchasesStatus.all
  const purchaseTabLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.name}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab?.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray:900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))

  const { data: purchaseInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchaseList({ status: status as PurchaseStatus }),
    enabled: isAuthenticated
  })

  const purchasesIncart = purchaseInCartData?.data.data

  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow0sm'>{purchaseTabLink}</div>
          <div>
            {purchasesIncart?.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow'>
                <Link
                  to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                  className='flex'
                >
                  <div className='flex-srhink-0'>
                    <img src={purchase.product.image} alt='' className='h-20 w-20 object-cover' />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='truncate'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-3 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      ₫{formatCurrency(purchase.product.price_before_discount)}
                    </span>
                    <span className='ml-2 text-orange '>₫{formatCurrency(purchase.product.price)}</span>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>Tổng giá tiền</span>
                    <span className='ml-4 text-orange text-xl'>
                      ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
