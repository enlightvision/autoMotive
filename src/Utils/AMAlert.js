import { Alert } from "react-native"
import { APP_NAME } from "./AMConstant"


export function showDialogue(message,arrayButtons,title = APP_NAME, okButtonHandler = () => {

}, style) {
    let arrayButtonsToShow = (arrayButtons || []).concat([{"text":"Yes", onPress: okButtonHandler, style: style}])

    Alert.alert(
        title,
        message,
        arrayButtonsToShow,
        { cancelable: false }
      )
}

export function showSimpleDialogue(message,arrayButtons,title = APP_NAME, okButtonHandler = () => {

}, style) {
    let arrayButtonsToShow = (arrayButtons || []).concat([{"text":"Ok", onPress: okButtonHandler, style: style}])

    Alert.alert(
        title,
        message,
        arrayButtonsToShow,
        { cancelable: false }
      )
}