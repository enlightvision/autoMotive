import { SAVE_USER_DETAILS, SAVE_USER_TOKEN, SAVE_USER_LOGIN, SAVE_USER_REGISTER } from '../Actions/User'
const InitialState = {
    userDetail: {},
    token: "",
    isLogin: false,
    isRegister: false
}

export function userOperation(state = InitialState, { type, ...rest }) {

    switch (type) {
        case SAVE_USER_DETAILS: {
            return { ...state, ...rest }
        }
        case SAVE_USER_TOKEN: {
            return { ...state, ...rest }
        }
        case SAVE_USER_LOGIN: {
            return { ...state, ...rest }
        }
        case SAVE_USER_REGISTER: {
            return { ...state, ...rest }
        }
        default:
            return state
    }
}