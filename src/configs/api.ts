/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { REACT_APP_AIRPORT_CODE_API_URL } from '@/configs/env'

export const API_URLS = {
  AUTO_COMPLETE: `${REACT_APP_AIRPORT_CODE_API_URL}/autocomplete`,
  SINGLE: `${REACT_APP_AIRPORT_CODE_API_URL}/single`
}
