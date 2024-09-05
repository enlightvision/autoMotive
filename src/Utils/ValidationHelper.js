
class ValidationHelper {

    emailValidation = (value) => {
        var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value.trim() == "") {
            return "Please enter email address"
        } else if (!value.match(email)) {
            return "Please enter valid email address"
        }
        return ""
    }

    isEmptyValidation = (value, message) => {
        return value.trim() == "" ? message : ""
    }

    imageListValidation = (data) => {
        console.log("::DATA :: ", data);
        if(data.length == 0){
            return "Please select atleast on image"
        }else if(data.length > 4){
            return "Maximum 4 images can be uploaded"
        }
        return ""
    }

    mobileNumberValidation = (value) => {
        const numberRegex = /^\d+$/
        if (value.trim() == "") {
            return "Please enter a mobile number"
        } else if (!value.match(numberRegex)) {
            return "Please enter numeric only"
        } else if (value.length < 10) {
            return "Mobile number should be 10 digits"
        }
        return ""
    }

    quantityLimitValidation = (value) => {
        // if(value.trim() == ""){
        //     return "Please add quantity"
        // } else 
        if(value > 10){
            return "Quantity limit should be 10"
        }
        return ""
    }

}

export default ValidationHelper