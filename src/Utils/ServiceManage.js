import axios from "axios";
import { BASE_URL, BEARER, UPLOAD_IMAGE } from "./AMConstant";
import NetInfo from "@react-native-community/netinfo";
import { Platform } from "react-native";

const instance = axios.create({
    baseURL: BASE_URL,
});

export const postApi = async (url, params, onSuccess, onFailure, getPropsForHeader) => {

    if (getPropsForHeader?.token) {
        instance.defaults.headers.common['Authorization'] = BEARER + getPropsForHeader?.token
    } else {
        instance.defaults.headers.common['Authorization'] = undefined
    }

    console.log("INSTANT :::::: ", instance.defaults.headers, " :::::::: ", url, params)
    await NetInfo.fetch().then(state => {

        if (state.isConnected) {
            instance.post(url, params).then((response) => {
                console.log("SUCCESS :::::::: ", response, url)
                if (response.data.status) {
                    onSuccess(response?.data)
                } else {
                    onFailure({ status: false, message: response?.data?.message })
                }
            }).catch(error => {
                console.log("ERROR :::::::: ", error, " :: ", url)
                onFailure({ status: false, message: "something went wrong." + `\n` + " Please try again" })
            })
        } else {
            onFailure({ status: false, message: "Check your internet connection" })
        }
    });

}

export const uploadImagesApi = async (url, params, onSuccess, onFailure, getPropsForHeader) => {
    const formdata = new FormData();
    Object.keys(params || {}).map(keyToCheck => {
        if (keyToCheck !== 'image' && keyToCheck !== 'profile_picture') {
            formdata.append(keyToCheck, params[keyToCheck])
        }
    })

    if (params.image !== undefined && params.image.path !== undefined && params.image.path !== null) {
        const imageDetails = params?.image
        console.log(":::IIIIII", imageDetails)
        const uriParts = imageDetails.filename ? imageDetails.filename.split('.') : imageDetails.path.split('.')
        const strURIToUse = Platform.OS === 'ios' ? imageDetails.path.replace('file:/', '') : imageDetails.path
        // const strURIToUse = imageDetails.path

        const finalImageDetails = {
            uri: strURIToUse,
            name: imageDetails.fileName || (Math.round(new Date().getTime() / 1000) + '.' + uriParts[uriParts.length - 1]),
            type: imageDetails.mime
        }

        formdata.append('image', finalImageDetails);
    }


    // instance.defaults.headers['Content-Type'] = 'multipart/form-data';

    if (getPropsForHeader?.token) {
        instance.defaults.headers.common['Authorization'] = BEARER + getPropsForHeader?.token
    }

    console.log("INSTANT ::::::", instance.defaults.headers, " :::::::: ", url, formdata)
    await NetInfo.fetch().then(state => {

        if (state.isConnected) {
            instance.post( url, formdata).then((response) => {
                    console.log("SUCCESS :::::::: ", response, url)
                    if (response.data.status) {
                        onSuccess(response?.data)
                    } else {
                        onFailure({ status: false, message: response?.data?.message })
                    }
                }).catch(error => {
                    console.log("ERROR :::::::: ", error, " :: ", url)
                    onFailure({ status: false, message: "something went wrong." + `\n` + " Please try again" })
                })
        } else {
            onFailure({ status: false, message: "Check your internet connection" })
        }
    });
}

export const getApi = async (url, onSuccess, onFailure, getPropsForHeader) => {

    console.log("INSTANT :::::: ", instance.defaults, " :::::::: ", url)
    instance.defaults.headers.common['Authorization'] = BEARER + getPropsForHeader.token
    await NetInfo.fetch().then(state => {

        if (state.isConnected) {
            instance.get(url).then((response) => {
                console.log("SUCCESS ::::::: ", response, url)
                onSuccess(response.data)

            }).catch(error => {
                console.log("ERROR :::::::: ", error, " ::::::::: ", url)
                // onFailure({status : false, message: strings("general.internetError")})
                onFailure({ status: false, message: "something went wrong." + `\n` + " Please try again" })
            })
        } else {
            onFailure({ status: false, message: "Check your internet connection" })
        }
    });
}

export const deleteApi = async (url, onSuccess, onFailure, getPropsForHeader) => {

    if (getPropsForHeader?.token) {
        instance.defaults.headers.common['Authorization'] = BEARER + getPropsForHeader?.token
    } else {
        instance.defaults.headers.common['Authorization'] = undefined
    }

    console.log("INSTANT :::::: ", instance.defaults.headers, " :::::::: ", url)
    await NetInfo.fetch().then(state => {

        if (state.isConnected) {
            instance.delete(url).then((response) => {
                console.log("SUCCESS :::::::: ", response, url)
                if (response.data.status) {
                    onSuccess(response?.data)
                } else {
                    onFailure({ status: false, message: response?.data?.message })
                }
            }).catch(error => {
                console.log("ERROR :::::::: ", error, " :: ", url)
                onFailure({ status: false, message: "something went wrong." + `\n` + " Please try again" })
            })
        } else {
            onFailure({ status: false, message: "Check your internet connection" })
        }
    });

}
