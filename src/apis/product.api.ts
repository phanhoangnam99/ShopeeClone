import { SuccessReponse } from 'src/types/utils.type'
import { Product, ProductList, ProductListConfig } from './../types/product.type'
import http from 'src/utils/http'

const URL = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessReponse<ProductList>>(URL, {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessReponse<Product>>(`${URL}/${id}`)
  }
}

export default productApi
