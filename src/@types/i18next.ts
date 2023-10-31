import { defaultNS, resources } from './../i18n/i18n'
import 'i18next'

declare module 'i18next' {
  // Kế thừa (thêm vàoo tpye)

  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['vi']
  }
}
