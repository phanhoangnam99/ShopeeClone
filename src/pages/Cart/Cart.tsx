import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import keyBy from 'lodash/keyBy'
import React, { useEffect, useContext, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { PurchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchase } = useContext(AppContext)
  const { data: purchaseInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: PurchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchaseList({ status: PurchasesStatus.inCart })
  })
  const location = useLocation()

  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string | null })?.purchaseId
  const purchasesIncart = purchaseInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchaseSavingPrice = checkedPurchases.reduce((result, current) => {
    return result + (current.product.price_before_discount - current.product.price) * current.buy_count
  }, 0)

  useEffect(() => {
    setExtendedPurchase((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      return (
        purchasesIncart?.map((purchase) => {
          const isChoosenPurchaseIdFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseIdFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesIncart, choosenPurchaseIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchase((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const updatePurchaseMutatation = useMutation({
    mutationFn: purchaseApi.updatePurchase,

    onSuccess: () => refetch()
  })

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,

    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })
  const deleteProductsMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,

    onSuccess: () => refetch()
  })

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    const purchase = extendedPurchases[purchaseIndex]

    if (enable) {
      setExtendedPurchase(
        produce((draft) => {
          draft[purchaseIndex].disabled = true

          updatePurchaseMutatation.mutate({
            product_id: purchase.product._id,
            buy_count: value
          })
        })
      )
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deleteProductsMutation.mutate([purchaseId])
  }
  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deleteProductsMutation.mutate(purchaseIds)
  }

  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => {
        return {
          product_id: purchase.product._id,
          buy_count: purchase.buy_count
        }
      })
      buyProductsMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6 bg-white'>
                    <div className='flex items-center'>
                      <div className='flex items-center flex-shrink-0 justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                        />
                      </div>
                      <div className='flex-shrink-0 text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid text-center grid-cols-5'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>.
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases.map((purchase, index) => {
                      return (
                        <div
                          key={purchase._id}
                          className='grid grid-cols-12 text-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-sm text-gray-500 mt-5 last:mb-0 items-center'
                        >
                          <div className='col-span-6 '>
                            <div className='flex '>
                              <div className='flex items-center flex-shrink-0 justify-center pr-3'>
                                <input
                                  type='checkbox'
                                  className='h-5 w-5 accent-orange'
                                  checked={purchase.checked}
                                  onChange={handleChecked(index)}
                                />
                              </div>
                              <div className='flex-grow '>
                                <div className='flex'>
                                  <Link
                                    className='h-20 w-20 flex-shrink-0 '
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                  >
                                    <img alt={purchase.product.name} src={purchase.product.image} />
                                  </Link>
                                  <div className='flex-grow px-2 pt-1 pb-2'>
                                    <Link
                                      to={`${path.home}${generateNameId({
                                        name: purchase.product.name,
                                        id: purchase.product._id
                                      })}`}
                                      className='line-clamp-2 text-left'
                                    >
                                      {purchase.product.name}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='col-span-6'>
                            <div className='grid grid-cols-5 items-center'>
                              <div className='col-span-2'>
                                <div className='flex items-center justify-center'>
                                  <div className='text-gray-300 line-through'>
                                    ₫{formatCurrency(purchase.product.price_before_discount)}
                                  </div>
                                  <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                                </div>
                              </div>
                              <div className='col-span-1'>
                                <QuantityController
                                  max={purchase.product.quantity}
                                  value={purchase.buy_count}
                                  classNameWrapper='flex items-center'
                                  onIncrease={(value) => {
                                    if (!purchase.disabled) {
                                      handleQuantity(index, value, value <= purchase.product.quantity)
                                    }
                                  }}
                                  onDecrease={(value) => {
                                    if (!purchase.disabled) {
                                      console.log(value)
                                      handleQuantity(index, value, value >= 1)
                                    }
                                  }}
                                  disabled={purchase.disabled}
                                  onType={handleTypeQuantity(index)}
                                  onFocusOut={(value) =>
                                    handleQuantity(
                                      index,
                                      value,
                                      value >= 1 &&
                                        value <= purchase.product.quantity &&
                                        value !== (purchasesIncart as Purchase[])[index].buy_count
                                    )
                                  }
                                />
                              </div>
                              <div className='col-span-1 '>
                                <span className='text-orange'>
                                  ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                                </span>
                              </div>
                              <div className='col-span-1'>
                                <button
                                  className='bg-none text-black transition-color hover:text-orange'
                                  onClick={handleDelete(index)}
                                >
                                  Xoá
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className=' mt-10 sticky bottom-0 z-10 flex sm:flex-row flex-col sm:items-center rounded-sm bg-white p-5 shadow border border-gray-100'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input type='checkbox' className='h-5 w-5 accent-orange' checked={isAllChecked} />
                </div>
                <button className='mx-3 border-none bb-none' onClick={handleCheckedAll}>
                  Chọn tất cả ({extendedPurchases.length})
                </button>
                <button className='mx-3 border-none bb-nondive' onClick={handleDeleteManyPurchases}>
                  Xoá
                </button>
              </div>
              <div className='sm:ml-auto flex sm:flex-row flex-col sm:items-center mt-5 sm:mt-0'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div> Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center sm:justify-end text-sm '>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>
                      ₫{formatNumberToSocialStyle(totalCheckedPurchaseSavingPrice)}
                    </div>
                  </div>
                </div>
                <Button
                  className='ml-4 mt-3 flex justify-center items-center text-center uppercase bg-red-500 text-white text-sm hover:bg-red-600 h-10 w-52
'
                  onClick={handleBuyPurchases}
                  disabled={buyProductsMutation.isLoading}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <div>
              <img
                src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png'
                alt=''
                className='h-24 w-24 mx-auto'
              />
            </div>
            <div className='font-bold text-gray-400 mt-5 px-2'>Giỏ hàng của bạn còn trống</div>
            <div className='text-center mt-5 '>
              <Link
                className=' bg-orange hover:bg-orange/80 transition-all rounded-sm px-10 py-3 uppercase text-white'
                to={path.home}
              >
                mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
