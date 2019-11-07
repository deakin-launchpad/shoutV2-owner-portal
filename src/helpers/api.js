import { AccessToken, logout } from 'contexts/helpers'
import { notify } from 'components'
import { axiosInstance } from './index';
/**
 *  @errorHelper :  Function to return error StatusText.
 */
const errorHelper = (error) => {
  if (error.response === undefined) {
    notify("Network Error");
    return false;
  }
  if (error.response.statusCode === 401) {
    notify("You may have been logged out");
    logout();
    return false;
  }
  if (error.response.statusText !== "") {
    notify(error.response.statusText);
    return false;
  }
}
class API {
  displayAccessToken = () => {
    console.log(AccessToken)
  }

  login = (data, callback) => {
    axiosInstance.post('/admin/login', data).then(response => {
      console.log(response.data.data);
      return callback(response.data.data)
    }).catch(error => {
      errorHelper(error)
    })
  }
  logoutUser = (callback) => {
    axiosInstance.put('/admin/logout', {}, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(response => {
      return logout()
    }).catch(error => {
      errorHelper(error)
    })
    if (typeof callback === "function") {
      callback()
    }
  }

  createMerchant = (data,callback) => {
    axiosInstance.post('/merchant/createMerchant', data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(response => {
      console.log(response)
      return callback(true)
    }).catch(error => {
      return callback(false)
    })
  }

  getMerchant = (callback) => {
    axiosInstance.get('/merchant/getMerchant', {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(response => {
      console.log(response.data.data.data)
      return callback(response.data.data.data)
    }).catch(error => {
      errorHelper(error)
    })
  }

  confirmMerchantClaim = (data,callback) => {
    axiosInstance.put('/merchant/confirmMerchantClaim', data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(response => {
      console.log(response)
      return callback(response)
    }).catch(error => {
      errorHelper(error)
    })
  }

  blackUnblackMerchant = (data,callback) => {
    axiosInstance.put('/merchant/blackUnblackMerchant', data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(response => {
      console.log(response)
      return callback(response)
    }).catch(error => {
      errorHelper(error)
    })
  }

  createSuperAdmin = (data,callback) => {
    axiosInstance.post('/merchant/createSuperAdmin', data, {
      headers: {
        authorization: 'Bearer ' + AccessToken
      }
    }).then(response => {
      console.log(response)
      return callback(response)
    }).catch(error => {
      errorHelper(error)
    })
  }
  



}
const instance = new API();
export default instance;
