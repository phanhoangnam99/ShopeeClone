import http from 'src/utils/http'
import { Category } from './../types/category.type'
import { SuccessReponse } from './../types/utils.type'
const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessReponse<Category[]>>(URL)
  }
}

export default categoryApi
