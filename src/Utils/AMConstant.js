import React from 'react'
import { Dimensions, Platform } from 'react-native';

export const BASE_URL = "https://oldautomotiveparts.com/api/public/api/"
export const DEFAULT_IMAGE_URL = "https://oldautomotiveparts.com/api/public/"
export const BEARER = "Bearer "
export const BRAND = "getBrandForApp"
export const BRAND_MODEL = "brand"
export const BRAND_VERSION = "getBrandVersionApp"
export const CATEGORY = "getCatApp"
export const SELLING_PARTS = "requiredParts"
export const UPLOAD_IMAGE = "upload"
export const SEARCH_LIST = "requiredParts/getList"
export const LOGIN = "login"
export const OTP_VERIFY = "verifyOtpUser"
export const REGISTRATION = "user/update_profile"
export const DELETE_USER = "deleteAccount"
export const UPDATE_PROFILE = "user/update_profile"
export const URGENT_REQUIRED_PART = "requiredParts/getListUrgent"
export const USER_PROFILE = "user/get_profile"
export const REQUIRED_PARTS = "partsSelling"
export const UPDATE_REQUIRED_PARTS = "user/updateUserProduct"
export const SHOW_PRODUCTS_DETAIL = "partsSelling/getData"
export const SEARCH_PRODUCT_DETAIL = "buy/getSelectedData"
export const DELETE_URGENT_POST = "partsSelling/"
export const DELETE_SELL_POST = "requiredParts/"
export const SEARCH_POST_DATA = "partsSelling/search"
export const USER_SELL_DATA = "requiredParts/userNormalPartsList"
export const USER_URGENT_DATA = "partsSelling/userUrgentPartsList"
export const SEARCH_USER_POST_DATA = "searchUserProfile"


export const CURRENCY_SIGN = '\u20A8. '
export const APP_NAME = "Old Automotive Parts"
export const PRIVACY_POLICY = "https://oldautomotiveparts.com/privacy-policy.html"
export const MAILTO = "mailto:info@oldautomotiveparts.com"


export function listOfYears() {
  const d = new Date()

  var listOfyear = []
  listOfyear.push("Common in all year")
  for (var i = 0; 1970 <= (d.getFullYear() - i); i++) {
    listOfyear.push(d.getFullYear() - i)
  }
  return listOfyear
}

export const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 760;
const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export function fontNormalize(size) {
  // const newSize = size * scale 
  // if (Platform.OS === 'ios') {
  //   return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  // } else {
  //   return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  // }
  var initialFontSize = size || 14;
  var fontSizeToReturnModerate = moderateScale(initialFontSize);
  var fontSizeToReturnVertical = verticalScale(initialFontSize);
  return Platform.OS == 'ios'
    ? fontSizeToReturnModerate
    : fontSizeToReturnVertical;
}