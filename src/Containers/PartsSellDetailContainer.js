import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import AMDropdownList from '../Components/AMDropdownList';
import AMDropdownPicker from '../Components/AMDropdownPicker';
import AMTextInput from '../Components/AMTextInput';
import AMThemeButton from '../Components/AMThemeButton';
import AMUploadImageList from '../Components/AMUploadImageList';
import AMColors from '../Utils/AMColors';
import { BRAND_MODEL, BRAND_VERSION, CATEGORY, fontNormalize, listOfYears, REQUIRED_PARTS, SELLING_PARTS, UPDATE_REQUIRED_PARTS, UPLOAD_IMAGE } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { getApi, postApi, uploadImagesApi } from '../Utils/ServiceManage';
import ValidationHelper from '../Utils/ValidationHelper';
import BaseContainer from './BaseContainer';

const PartsSellDetailContainer = (props) => {
    var count = 0
    var imageNameList = props?.route?.params?.postData?.image?.split(",") ?? []

    const userDetail = useSelector(state => state)
    const validationHelper = new ValidationHelper();

    const [isLoading, setIsLoading] = useState(false);

    const conditionOfPart = ["New", "Excellent", "As good as new condition", "not bad not good condition", "Servicable condition", "Scrap"]
    const [dropdownselectionlist, setDropdownSelectionList] = useState([false, false, false, false, false, false])
    const [modalOfBrandList, setModalOfBrandList] = useState([])
    const [versionOfBrandList, setVersionOfBrandList] = useState([])
    const [mainCategoryList, setMainCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [modalYearList, setModalYearList] = useState(listOfYears() ?? [])
    const [imageDataList, setImageDataList] = useState([])
    const [imageDeleteDataList, setImageDeleteDataList] = useState([])
    const [selectedModalOfBrand, setSelectedModalOfBrand] = useState(props?.route?.params?.postData?.brand_model)
    const [selectedVersionOfModal, setSelectedVersionOfModal] = useState(props?.route?.params?.postData?.brand_version)
    const [selectedMainCategories, setSelectedMainCategories] = useState(props?.route?.params?.postData?.cat)
    const [selectedSubCategories, setSelectedSubCategories] = useState(props?.route?.params?.postData?.sub_cat)
    const [selectedModalYear, setSelectedModalYear] = useState(props?.route?.params?.postData?.modelYear)
    const [selectedConditionOfPart, setSelectedConditionOfPart] = useState(props?.route?.params?.postData?.conditionPart)
    const [quantity, setQuantity] = useState(props?.route?.params?.postData?.quantity ?? "")
    const [approxRate, setApproxRate] = useState(props?.route?.params?.postData?.approxRate ?? "")
    const [shouldVisible, setShouldVisible] = useState(false)

    useEffect(() => {
        if (props?.route?.params?.isEditable) {
            getBrandModal(props?.route?.params?.postData?.brand.id)
        } else {
            getBrandModal(props?.route?.params?.modaldata?.id)
        }
        getVersion()
        getCategories()
    }, [])

    const getCategories = () => {
        postApi(CATEGORY, {}, onSuccessCategories, onFailureCategories, userDetail?.userOperation)
    }

    const onSuccessCategories = (response) => {
        setMainCategoryList(response.data)
        if (props?.route?.params?.isEditable || props?.route?.params?.postData?.cat) {
            setSubCategoryList(response.data.filter(item => item.id == props?.route?.params?.postData?.cat.id)[0].sub_cat)
        }
    }

    const onFailureCategories = (error) => { }

    const getBrandModal = (id) => {
        getApi(BRAND_MODEL + "/" + id, onSuccessBrandModal, onFailureBrandModal, userDetail?.userOperation)
    }

    const onSuccessBrandModal = (response) => {
        setModalOfBrandList(response.data.brand_model)
        if (props?.route?.params?.isEditable) {
            console.log(" ::: ", props?.route?.params?.postData?.brand_model);
        }
    }

    const onFailureBrandModal = (error) => { }

    const getVersion = () => {
        postApi(BRAND_VERSION, {}, onSuccessVersion, onFailureVersion, userDetail?.userOperation)
    }

    const onSuccessVersion = (response) => {
        setVersionOfBrandList(response?.data)
    }

    const onFailureVersion = (error) => { }

    const uploadImageAPI = () => {
        const params = {
            image: imageDataList[count]
        }
        setIsLoading(true)
        uploadImagesApi(UPLOAD_IMAGE, params, onSuccessUploadImage, onFailureImageUpload, userDetail?.userOperation)
    }

    const onSuccessUploadImage = (response) => {
        imageNameList.push(response.data)
        if (count < (imageDataList.length - 1)) {
            count = count + 1
            uploadImageAPI()
        } else {
            count = 0
            sellingPostAPI()
        }
    }

    const onFailureImageUpload = (error) => {
        count = 0
        setIsLoading(false)
    }

    const sellingPostAPI = (imageData) => {
        let params = {
            brand_id: (props?.route?.params?.modaldata?.id ?? props?.route?.params?.postData?.brand.id),
            brandModel_id: selectedModalOfBrand?.id,
            version_id: selectedVersionOfModal?.id,
            subCat_id: selectedSubCategories?.id,
            cat_id: selectedMainCategories?.id,
            modelYear: selectedModalYear,
            quantity: quantity,
            approxRate: approxRate,
            conditionPart: selectedConditionOfPart,
            urgentSell: props?.route?.params?.isUrgent
        }

        if (props?.route?.params?.isEditable) {
            params['id'] = props?.route?.params?.postData?.id
        }
        // if (props?.route?.params?.isPartsImageEnable) {
        const finalNameList = imageNameList.filter(item => !imageDeleteDataList.includes(item))
        params['image'] = finalNameList.toString()
        // }
        setIsLoading(true)
        console.log(";:::", JSON.stringify(params));
        let url = ""
        if (props?.route?.params?.isEditable) {
            url = UPDATE_REQUIRED_PARTS
        } else {
            url = props?.route?.params?.isUrgent == "0" ? SELLING_PARTS : REQUIRED_PARTS
        }
        postApi(url, params, onSuccessSellingParts, onFailureSellingParts, userDetail?.userOperation)
    }

    const onSuccessSellingParts = (response) => {
        imageNameList = []
        setIsLoading(false)
        if (props?.route?.params?.type === 'purchase') {
            props.navigation.pop(4)
        } else {
            props.navigation.pop(2)
        }

        Snackbar.show({
            text: response.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    }

    const onFailureSellingParts = (error) => {
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_SHORT,
        });
    }

    const sellPartsValidationHandler = () => {
        setShouldVisible(true)
        if (
            !selectedModalOfBrand?.id ||
            !selectedVersionOfModal?.id ||
            !selectedMainCategories?.id ||
            !selectedSubCategories?.id ||
            !selectedModalYear ||
            !selectedConditionOfPart ||
            validationHelper.quantityLimitValidation(quantity).trim() !== "" ||
            // approxRate.trim() == "" ||
            (validationHelper.imageListValidation([...imageDataList, ...imageNameList.filter(item => !imageDeleteDataList.includes(item))]).trim() !== "")
        ) {
            return
        } else {
            // if (props?.route?.params?.isPartsImageEnable) {
            if (imageDataList.length == 0 && props?.route?.params?.isEditable) {
                sellingPostAPI()
            } else {
                uploadImageAPI()
            }
            // } else {
            //     sellingPostAPI()
            // }
        }
    }

    const onSelectModalOfBrandHandler = (data) => {
        setShouldVisible(false)
        setSelectedModalOfBrand(data)
        // setVersionOfBrandList(modalOfBrandList.filter(item => item.id == data.id)[0].brand_version)
        handleDropdown(0, !dropdownselectionlist[0])
    }

    const onSelectVersionHandler = (data) => {
        setShouldVisible(false)
        setSelectedVersionOfModal(data)
        handleDropdown(1, !dropdownselectionlist[1])
    }

    const onSelectMainCategoryHandler = (data) => {
        setShouldVisible(false)
        setSelectedMainCategories(data)
        setSubCategoryList(mainCategoryList.filter(item => item.id == data.id)[0].sub_cat)
        handleDropdown(2, !dropdownselectionlist[2])
        setSelectedSubCategories()
    }

    const onSelectSubCategoryHandler = (data) => {
        setShouldVisible(false)
        setSelectedSubCategories(data)
        handleDropdown(3, !dropdownselectionlist[3])
    }

    const onSelectModalYearHandler = (data) => {
        setShouldVisible(false)
        setSelectedModalYear(data)
        handleDropdown(4, !dropdownselectionlist[4])
    }

    const onSelectConditionOfPartHandler = (data) => {
        setShouldVisible(false)
        setSelectedConditionOfPart(data)
        handleDropdown(5, !dropdownselectionlist[5])
    }

    const onChangeQuantity = (text) => {
        const numberRegex = /^\d+$/
        if (text.match(numberRegex) || text == "") {
            setShouldVisible(false)
            setQuantity(text)
        }
    }

    const onChangeApproxRate = (text) => {
        const numberRegex = /^\d+$/
        if (text.match(numberRegex) || text == "") {
            setShouldVisible(false)
            setApproxRate(text)
        }
    }

    const handleDropdown = (indexes, value) => {
        setDropdownSelectionList(dropdownselectionlist.map((item, index) => { return value === false ? false : indexes == index ? value : !value }))
    }

    const onReceiveImageData = (data) => {
        setShouldVisible(false)
        setImageDataList(data.filter(item => item?.path))

    }

    const onReceiveDeletImageData = (data) => {
        setShouldVisible(false)
        setImageDeleteDataList(oldData => [...oldData, data])
    }

    const navigationToBack = () => {
        props.navigation.goBack()
    }


    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            title={props?.route?.params?.isUrgent === "0" ? "Fill sell parts details" : "Urgently required parts details"}
        >
            <View style={style.flexStyle}>
                <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 30 }} showsVerticalScrollIndicator={false} nestedScrollEnabled={true} keyboardShouldPersistTaps={'always'}>
                    {/* <Text style={style.titleStyle}>{"Detail about your part"}</Text> */}
                    <Text style={style.brandTitle}>{(props?.route?.params?.modaldata?.name ?? props?.route?.params?.postData?.brand.name ?? "")}</Text>

                    <AMDropdownPicker title={"Model of Brand"} value={selectedModalOfBrand?.name} onPress={() => handleDropdown(0, !dropdownselectionlist[0])}
                        error={shouldVisible && !selectedModalOfBrand?.id ? "Please select modal of brand" : ""}
                    />

                    <View>
                        {dropdownselectionlist[0] ? <AMDropdownList data={modalOfBrandList} onReceiveItem={onSelectModalOfBrandHandler} /> : null}
                        <AMDropdownPicker title={"Version"} value={selectedVersionOfModal?.name} onPress={() => handleDropdown(1, !dropdownselectionlist[1])}
                            error={shouldVisible && !selectedVersionOfModal?.id ? "Please select version" : ""}
                        />
                        <View>
                            {dropdownselectionlist[1] ? <AMDropdownList data={versionOfBrandList} onReceiveItem={onSelectVersionHandler} /> : null}
                            <AMDropdownPicker title={"Parts Main Category"} value={selectedMainCategories?.name} onPress={() => handleDropdown(2, !dropdownselectionlist[2])}
                                error={shouldVisible && !selectedMainCategories?.id ? "Please select main category" : ""}
                            />
                            <View>
                                {dropdownselectionlist[2] ? <AMDropdownList data={mainCategoryList} isSearchEnable placeholder={"Search category"} onReceiveItem={onSelectMainCategoryHandler} /> : null}
                                <AMDropdownPicker title={"Parts Sub Category"} value={selectedSubCategories?.name} onPress={() => handleDropdown(3, !dropdownselectionlist[3])}
                                    error={shouldVisible && !selectedSubCategories?.id ? "Please select sub category" : ""}
                                />
                                <View>
                                    {dropdownselectionlist[3] ? <AMDropdownList data={subCategoryList} isSearchEnable placeholder={"Search sub category"} onReceiveItem={onSelectSubCategoryHandler} /> : null}
                                    <AMDropdownPicker title={"Model year"} value={selectedModalYear} onPress={() => handleDropdown(4, !dropdownselectionlist[4])}
                                        error={shouldVisible && !selectedModalYear ? "Please select model year" : ""}
                                    />
                                    <View>
                                        {dropdownselectionlist[4] ? <AMDropdownList data={modalYearList} onReceiveItem={onSelectModalYearHandler} /> : null}
                                        <View style={{ flexDirection: 'row' }}>
                                            <AMTextInput title={'Quantity Available'} value={quantity} isDisableMendatory containerStyle={style.flexStyle} keyboardType={'number-pad'} onChangeText={onChangeQuantity}
                                                error={shouldVisible && validationHelper.quantityLimitValidation(quantity).trim()}
                                            />
                                            <AMTextInput title={'Approx Rate'} value={approxRate} isDisableMendatory containerStyle={style.approxRateTitle} keyboardType={'number-pad'} onChangeText={onChangeApproxRate}
                                            // error={shouldVisible && approxRate.trim() == "" ? "Please add approx rate" : ""}
                                            />
                                        </View>

                                        <AMDropdownPicker title={"Condition of part"} value={selectedConditionOfPart} onPress={() => handleDropdown(5, !dropdownselectionlist[5])}
                                            error={shouldVisible && !selectedConditionOfPart ? "Please select condition of part" : ""}
                                        />
                                        <View>
                                            {dropdownselectionlist[5] ? <AMDropdownList data={conditionOfPart} onReceiveItem={onSelectConditionOfPartHandler} /> : null}
                                            {/* {props?.route?.params?.isPartsImageEnable ? */}
                                            <AMUploadImageList title={"Upload image"}
                                                imagelist={props?.route?.params?.postData?.image?.split(",")}
                                                onReceiveImageData={onReceiveImageData}
                                                onReceiveDeletImageData={onReceiveDeletImageData}
                                                error={shouldVisible && validationHelper.imageListValidation([...imageDataList, ...imageNameList.filter(item => !imageDeleteDataList.includes(item))]).trim()}
                                            />
                                            {/* : null} */}

                                            <AMThemeButton title={'Post'} style={style.themeButton}
                                                isLoading={isLoading}
                                                onPress={sellPartsValidationHandler}
                                            // onPress={uploadImageAPI}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </BaseContainer>
    );
};

export default PartsSellDetailContainer;

const style = StyleSheet.create({
    flexStyle: { flex: 1 },
    titleStyle: { fontFamily: AMFonts.SFProDisplay_Bold, color: AMColors.grey, fontSize: fontNormalize(20) },
    brandTitle: { fontFamily: AMFonts.SFProDisplay_Bold, color: AMColors.primary, fontSize: fontNormalize(20), alignSelf: 'center', marginTop: 15 },
    approxRateTitle: { flex: 1, marginLeft: 30 },
    themeButton: { alignSelf: 'center', marginTop: 50 }
})