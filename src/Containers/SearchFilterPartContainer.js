import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import AMDropdownList from '../Components/AMDropdownList';
import AMDropdownPicker from '../Components/AMDropdownPicker';
import AMThemeButton from '../Components/AMThemeButton';
import AMColors from '../Utils/AMColors';
import { BRAND_MODEL, BRAND_VERSION, CATEGORY, fontNormalize, listOfYears, SEARCH_LIST } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import { getApi, postApi } from '../Utils/ServiceManage';
import BaseContainer from './BaseContainer';

const SearchFilterPartContainer = (props) => {

    const userDetail = useSelector(state => state)
    const [isLoading, setIsLoading] = useState(false)
    const [shouldVisible, setShouldVisible] = useState(false)
    const [dropdownselectionlist, setDropdownSelectionList] = useState([false, false, false, false, false, false])
    const [modalOfBrandList, setModalOfBrandList] = useState([])
    const [versionOfBrandList, setVersionOfBrandList] = useState([])
    const [mainCategoryList, setMainCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [modalYearList, setModalYearList] = useState(listOfYears() ?? [])

    const [selectedModalOfBrand, setSelectedModalOfBrand] = useState()
    const [selectedVersionOfModal, setSelectedVersionOfModal] = useState()
    const [selectedMainCategories, setSelectedMainCategories] = useState()
    const [selectedSubCategories, setSelectedSubCategories] = useState()
    const [selectedModalYear, setSelectedModalYear] = useState()

    useEffect(() => {
        getBrandModal()
        getVersion()
        getCategories()
    }, [])

    const getCategories = () => {
        postApi(CATEGORY, {}, onSuccessCategories, onFailureCategories, userDetail?.userOperation)
    }

    const onSuccessCategories = (response) => {
        setMainCategoryList(response.data)
    }

    const onFailureCategories = (error) => {

    }

    const getBrandModal = () => {

        const param = {
            brand_id: props?.route?.params?.modaldata?.id
        }
        setIsLoading(true)
        getApi(BRAND_MODEL + "/" + props?.route?.params?.modaldata?.id, onSuccessBrandModal, onFailureBrandModal, userDetail?.userOperation)
    }

    const onSuccessBrandModal = (response) => {
        setModalOfBrandList(response?.data?.brand_model)
        setIsLoading(false)
    }

    const onFailureBrandModal = (error) => {
        setIsLoading(false)
    }

    const getVersion = () => {
        postApi(BRAND_VERSION, {}, onSuccessVersion, onFailureVersion, userDetail?.userOperation)
    }

    const onSuccessVersion = (response) => {
        setVersionOfBrandList(response?.data)
    }

    const onFailureVersion = (error) => { }

    const searchFilterValidation = () => {
        setShouldVisible(true)
        if (
            !selectedModalOfBrand?.id ||
            !selectedVersionOfModal?.id ||
            !selectedMainCategories?.id ||
            !selectedSubCategories?.id
        ) {
            return
        } else {
            searchFilterList()
        }
    }

    const searchFilterList = () => {
        const param = {
            brandId: props?.route?.params?.modaldata?.id,
            modelId: selectedModalOfBrand?.id,
            versionId: selectedVersionOfModal?.id,
            cateId: selectedMainCategories?.id,
            subCateId: selectedSubCategories?.id,
            modelYear: Number(selectedModalYear) ? selectedModalYear : null ,
        }
        setIsLoading(true)
        console.log("Purchase request :::::: ", JSON.stringify(param))
        postApi(SEARCH_LIST, param, onSuccessSearchList, onFailureSearchList, userDetail?.userOperation)
    }

    const onSuccessSearchList = (response) => {
        console.log(":::sss ::::", response);
        setIsLoading(false)
        props.navigation.navigate('listrequireparts',
            {
                partsList: response.data,
                isSearchData: true,
                modaldata: props?.route?.params?.modaldata,
                isUrgent: props?.route?.params?.isUrgent ?? "1",
                // isPartsImageEnable: props?.route?.params?.isPartsImageEnable ?? false,
                type: props?.route?.params?.type,
                postData: {
                    brand_model: selectedModalOfBrand,
                    brand_version: selectedVersionOfModal,
                    cat: selectedMainCategories,
                    sub_cat: selectedSubCategories,
                    modelYear: selectedModalYear ?? "",
                }
            }
        )
    }

    const onFailureSearchList = (error) => {
        console.log(":: FF :::: ", error);
        setIsLoading(false)
        Snackbar.show({
            text: error.message,
            duration: Snackbar.LENGTH_SHORT,
        });
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

    const handleDropdown = (indexes, value) => {
        setDropdownSelectionList(dropdownselectionlist.map((item, index) => { return value === false ? false : indexes == index ? value : !value }))
    }

    const navigationToBack = () => {
        props.navigation.goBack()
    }

    return (
        <BaseContainer
            onLeftPress={navigationToBack}
            title={"Fill buy parts details"}
        >
            <View style={style.flexStyle}>
                <ScrollView contentContainerStyle={style.scrollContainerStyle} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                    {/* <Text style={style.titleStyle}>{"Search filter for your part"}</Text> */}

                    <Text style={style.brandTitle}>{(props?.route?.params?.modaldata?.name ?? "")}</Text>
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
                                <View style={style.bottomViewStyle}>
                                    {dropdownselectionlist[3] ? <AMDropdownList data={subCategoryList} isSearchEnable placeholder={"Search sub category"} onReceiveItem={onSelectSubCategoryHandler} /> : null}
                                    <AMDropdownPicker title={"Model year"} value={selectedModalYear} isDisableMendatory onPress={() => handleDropdown(4, !dropdownselectionlist[4])} />
                                    <View>
                                        {dropdownselectionlist[4] ? <AMDropdownList data={modalYearList} onReceiveItem={onSelectModalYearHandler} /> : null}
                                        <AMThemeButton title={'Search'} style={style.themeButtonStyle}
                                            isLoading={isLoading}
                                            onPress={searchFilterValidation}
                                        />
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

export default SearchFilterPartContainer;

const style = StyleSheet.create({
    flexStyle: { flex: 1 },
    scrollContainerStyle: { paddingBottom: 30, paddingHorizontal: 30 },
    titleStyle: { fontFamily: AMFonts.SFProDisplay_Bold, color: AMColors.grey, fontSize: fontNormalize(20) },
    brandTitle: { fontFamily: AMFonts.SFProDisplay_Bold, color: AMColors.primary, fontSize: fontNormalize(20), alignSelf: 'center', marginTop: 15 },
    bottomViewStyle: { paddingBottom: 50 },
    themeButtonStyle: { alignSelf: 'center', marginTop: 50 }
})