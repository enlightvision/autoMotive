export const SAVE_USER_DETAILS = "SAVE_USER_DETAILS"
export function saveUserDetailsInRedux(data){
    return{
        type: SAVE_USER_DETAILS,
        userDetail: data
    }
}

export const SAVE_USER_TOKEN = "SAVE_USER_TOKEN"
export function saveUserTokenInRedux(data){
    return{
        type: SAVE_USER_TOKEN,
        token: data
    }
}

export const SAVE_USER_LOGIN = "SAVE_USER_LOGIN"
export function saveUserLoginInRedux(data){
    return{
        type: SAVE_USER_LOGIN,
        isLogin: data
    }
}

export const SAVE_USER_REGISTER = "SAVE_USER_REGISTER"
export function saveUserRegisterInRedux(data){
    return{
        type: SAVE_USER_REGISTER,
        isRegister: data
    }
}