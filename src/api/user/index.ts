import request from '@/utils/request'

// 登录
export function logIn(data: any) {
  return request({
    url: '/api/Login/GetJwtToken',
    method: 'post',
    data
  })
}

// 是否第一次登录
export function addBuryingLog() {
  return request({
    method: 'post',
    url: '/api/BuryingLog/Add',
    data: {
      TriggerType: 101,
      Num: 1,
      MeMo: 'Platform',
      AppFrom: 'UDMall',
      EventType: 'GuidePop',
      EventPath: 'LoginPlatform'
      // UserId: userId
    }
  })
}

// 统计用户登录次数
export function getTotalCount() {
  return request({
    method: 'post',
    url: '/api/BuryingLog/TotalCount',
    data: {
      AppFrom: 'UDMall',
      EventType: 'GuidePop',
      EventPath: 'LoginPlatform',
      TriggerType: 101
    }
  })
}

export const getCaptche = () =>
  request({
    method: 'get',
    url: '/api/Login/GetCaptche'
  })

export const getVerifyCode = (params: any) =>
  request({
    method: 'post',
    url: '/api/Login/GetVerifyCode',
    data: params,
    headers: {
      ignoreError: true
    }
  })

// 谷歌登录
export function platformLogIn(authPlatform: string) {
  return request({
    url: `/api/OAuth2/Authorization?authPlatform=${authPlatform}&from=ud-shop`,
    method: 'get'
  })
}

function getToken() {
  return request({
    url: '/api/Login/RefreshToken',
    method: 'post',
    data: {
      token: JSON.parse(sessionStorage.getItem('USAdrop_user')).RefreshToken
    },
    headers: {
      'Content-Type': 'application/json;',
      Authorization: 'Bearer ' + sessionStorage.getItem('Authorization')
    }
  })
}

export const getNewToken = () => {
  return getToken()
    .then((res) => {
      // 重置token成功
      if (res.data.Success) {
        // setToken(res.data.Result)
        return res.data.Result.Token
      } else {
        // 清除过期token
        sessionStorage.removeItem('USAdrop_user')
        sessionStorage.removeItem('Authorization')
        //   重置失败返回登录
        window.location.href = '/login'
        return Promise.reject()
      }
    })
    .catch(() => {
      // 清除过期token
      sessionStorage.removeItem('USAdrop_user')
      sessionStorage.removeItem('Authorization')
      //   重置失败返回登录
      window.location.href = '/login'
      return Promise.reject()
    })
}

//api/User/RefreshToken'
// 刷新token
export function refreshToken(data: any) {
  return request({
    url: '/api/Login/RefreshToken',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/LhUser/GetUser',
    method: 'post'
  })
}

//google登录
export function googleLogin(data: any) {
  return request({
    url: '/api/OAuth2/CallBack',
    method: 'post',
    data
  })
}

// 注册
export function Register(data: any) {
  // return request({
  //   url: '/User/register',
  //   method: 'post',
  //   data
  // })
  return request({
    url: '/api/Login/Register',
    method: 'post',
    data
  })
}

export function checkAccountExist(email: string) {
  return request({
    url: '/api/Member/VetifyEmail',
    method: 'get',
    params: {
      email
    }
  })
}

export function VetifyMarketingCode(code: string) {
  return request({
    url: '/api/LhFirstStepRecord/VetifyMarketingCode',
    method: 'get',
    params: {
      code
    }
  })
}

export function checkMobileExist(PhoneCode: string, mobileNumber: string) {
  return request({
    url: '/api/Login/CheckMoblieExist',
    method: 'post',
    data: {
      PhoneCode,
      mobileNumber
    }
  })
}

export function Phone() {
  return request({
    url: '/api/Common/GetRegisterCountryList',
    method: 'get'
  })
}

// 刊登
export function importPublish(data: any) {
  return request({
    url: '/api/CrawlProduct/CrawlProductAsync1688',
    method: 'post',
    params: data
  })
}

// 会员信息
export async function getMemberVo() {
  return await request({
    url: '/api/Member/GetMemberVo',
    method: 'post'
  })
}

// 获取税费比例
export function getSolutionRate(id: number) {
  return request({
    url: `/api/MemberRights/GetDefRightsWithIOSSSolutionRate?gradeId=${id}`,
    method: 'get'
  })
}

// 获取quote次数
export function getRightsWithWinnerQuote(params: any) {
  return request({
    url: `/api/MemberRights/GetRightsWithWinnerQuote`,
    method: 'get',
    params
  })
}

// 扣减quote次数
export function addMallQuoteLogAndExt(goodsCode: string) {
  return request({
    url: `/api/MemberRights/AddMallQuoteLogAndExt?goodsCode=${goodsCode}`,
    method: 'post'
  })
}

// 查看商品是否已经quote
export function getExistMemberProductOuote(goodsCode: string) {
  return request({
    url: `/api/MemberRights/ExistMemberProductQuote?goodsCode=${goodsCode}`,
    method: 'get'
  })
}

// 保存/修改 平台信息
export function savePlatformCategory(data: any) {
  return request({
    url: '/api/Member/ModifyMainPlatformAndCategory',
    method: 'post',
    data
  })
}
