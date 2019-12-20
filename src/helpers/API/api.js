import { AccessToken, logout } from 'contexts/helpers'
import { notify } from 'components'
import { axiosInstance } from '../index';
/**
 *  @errorHelper :  Function to return error StatusText.
 */
const errorHelper = (error, variant) => {
  if (error.response === undefined) {
    notify("Network Error");
    return false;
  }
  if (error.response.statusCode === 401) {
    if (variant === "login")
      return notify("Invalid Credentials");
    notify("You may have been logged out");
    logout();
    return false;
  }
  if (error.response.data.statusCode === 401) {
    if (variant === "login")
      return notify("Invalid Credentials");
    notify("You may have been logged out");
    logout();
    return false;
  }
  if (error.response.status === 401) {
    if (variant === "login")
      return notify("Invalid Credentials");
    notify("You may have been logged out");
    logout();
    return false;
  }
  if (error.response.data.message !== "") {
    notify(error.response.data.message);
    return false;
  }
  if (error.response.statusText !== "") {
    notify(error.response.statusText);
    return false;
  }
}

const performCallback = (callback, data) => {
  if (callback instanceof Function) {
    if (data !== undefined)
      return callback(data);
    callback();
  }
};

class API {
  displayAccessToken = () => {
    console.log(AccessToken)
  }

  accessTokenLogin = (callback) => {
    axiosInstance.post('accessTokenLogin', {}, {
      headers: {
        authorization: "Bearer " + AccessToken
      }
    }).then(response => performCallback(callback, AccessToken)).catch(error => errorHelper(error));
  }

  login = (data, callback) => {
    axiosInstance.post('/admin/login', data).then(response => {
      console.log(response.data.data);
      return callback(response.data.data)
    }).catch(error => {
      errorHelper(error, "login")
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
