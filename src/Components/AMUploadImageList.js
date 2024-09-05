import React, { useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import AMAssets from '../Assets';
import AMColors from '../Utils/AMColors';
import { DEFAULT_IMAGE_URL, fontNormalize, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';
import AMFastImage from './AMFastImage';
import AMPopupView from './AMPopupView';

const AMUploadImageList = (props) => {

    const cameraOptions = {
        mediaType: 'photo',
        width: 300,
        height: 400,
        cropping: true,
        forceJpg: true
    }
    const pickerOptions = {
        mediaType: 'photo',
        width: 300,
        height: 400,
        cropping: true,
        forceJpg: true,
        multiple: true,
        maxFiles: 4
    }

    const [imageList, setImageList] = useState(props.imagelist ?? [])
    const [openPicker, setOpenPicker] = useState(false)

    const openLibrary = () => {
        onCloseModal()
        setTimeout(() => {
            ImagePicker.openPicker(pickerOptions)
                .then((mediaData) => {
                    console.log("DATA :::::: ", mediaData);
                    if (mediaData) {
                        setImageList(oldArray => [...oldArray, ...mediaData])
                        if (props.onReceiveImageData) {
                            props.onReceiveImageData([...imageList.filter(items => items?.path), ...mediaData])
                        }
                    }
                })
                .catch(error => {
                    if (error == 'Error: User did not grant library permission.') {
                        Alert.alert('Alert', 'Gallery permission needed!', [
                            {
                                text: 'Cancel',
                                onPress: () => { },
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: () => Linking.openSettings() },
                        ]);
                    }
                });
        }, 1000)
    }

    const openCamera = () => {
        onCloseModal()
        ImagePicker.openCamera(cameraOptions)
            .then((mediaData) => {
                if (mediaData) {
                    setImageList(oldArray => [...oldArray, mediaData])
                    if (props.onReceiveImageData) {
                        props.onReceiveImageData([...imageList.filter(items => items?.path), mediaData])
                    }
                }
            })
            .catch(error => {
                if (error == 'Error: User did not grant camera permission.') {
                    Alert.alert('Alert', 'Camera permission needed!', [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => Linking.openSettings() },
                    ]);
                }
            });
    }

    const removeImage = (data, value) => {
        setImageList(imageList.filter((item, index) => index !== value))
        console.log("::: IMAGE :: ", imageList);
        if (data?.path) {
            props.onReceiveImageData(imageList.filter((item, index) => index !== value))
        } else {
            props.onReceiveDeletImageData(data)
        }
    }

    const onCloseModal = () => {
        setOpenPicker(false)
    }

    const openMediaPickeModal = () => {
        return (
            <AMPopupView isVisible={openPicker}
                style={{ justifyContent: 'flex-end' }}
            >
                <SafeAreaView style={{ backgroundColor: AMColors.white, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} >
                    <Text style={{ textAlign: 'center', fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(16), marginVertical: 20 }}>
                        {"Select avatar"}</Text>
                    <Pressable style={{ alignItems: 'center', borderTopWidth: 0.3, borderColor: AMColors.light_Grey }} onPress={openLibrary}>
                        <Text style={{ fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(12), marginVertical: 20 }}>{"Select photo"}</Text>
                    </Pressable>
                    <Pressable style={{ alignItems: 'center' }} onPress={openCamera}>
                        <Text style={{ fontFamily: AMFonts.Montserrat_Regular, marginVertical: 20, fontSize: fontNormalize(12) }}>{"Capture photo"}</Text>
                    </Pressable>
                    <Pressable style={{ alignItems: 'center' }} onPress={onCloseModal}>
                        <Text style={{ fontFamily: AMFonts.SFProDisplay_Bold, marginVertical: 20, color: AMColors.red, fontSize: fontNormalize(16) }}>{"Cancel"}</Text>
                    </Pressable>
                </SafeAreaView>
            </AMPopupView>
        )
    }

    return (
        <View>
            {openMediaPickeModal()}
            <Text style={{ color: AMColors.primary, marginVertical: 5 }}>{props.title}<Text style={{ fontSize: fontNormalize(20) }}>*</Text></Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20 }}>

                {imageList.map((item, index) => {
                    const { path } = item
                    return (
                        <View key={index} style={{ width: (width * 0.25) - 30, height: (width * 0.25) - 30, marginRight: (index + 1) % 4 == 0 ? 0 : 20, borderWidth: 1, borderColor: AMColors.light_Grey, marginBottom: 20 }}>
                            <Pressable style={{ position: 'absolute', right: 0, zIndex: 99999 }}
                                onPress={() => removeImage(item, index)}
                            >
                                <Icon name='cancel' color={'red'} />
                            </Pressable>
                            <Image style={{ width: '100%', height: '100%' }} resizeMode={'cover'} source={{ uri: path ? path : DEFAULT_IMAGE_URL + 'partsSelling/' + item }} />
                        </View>
                    )
                })}
                <Pressable style={{ width: (width * 0.25) - 30, height: (width * 0.25) - 30, borderWidth: 1, borderColor: AMColors.light_Grey, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => setOpenPicker(true)}
                >
                    <Image source={AMAssets.upload} />
                </Pressable>

            </View>
            {props.error ?
                <Text style={{ color: AMColors.red, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(12), marginBottom:20 }}>{props.error}</Text>
                : null}

                <Text style={{color: AMColors.grey, fontFamily: AMFonts.Montserrat_Regular}}>{"You can add max. four photos at a time and first photo selected will be cover photo"}</Text>
        </View>
    );
};

export default AMUploadImageList;

const style = StyleSheet.create({
    
})