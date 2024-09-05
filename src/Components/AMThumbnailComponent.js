import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AMColors from '../Utils/AMColors';
import { fontNormalize, width } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';

const AMThumbnailComponent = (props) => {

    const onClickItem = () => {
        if(props.onClickThumbnail){
            props.onClickThumbnail()
        }
    }

    return (
        <Pressable style={style.thumbnail}
            onPress={onClickItem}
        >
            <View style={props.style}>
            <Image source={props.source} />
            <Text style={style.postTitle}>{props.title}</Text>
            </View>
            <Text style={style.postDescStyle}>{props.description}</Text>
        </Pressable>
    );
};

export default AMThumbnailComponent;

const style = StyleSheet.create({
    thumbnail: { width: (width * 0.5) - 35, backgroundColor: AMColors.light_primary, paddingHorizontal: 15, paddingVertical:20, borderRadius: 10 },
    postTitle: { fontFamily: AMFonts.SFProDisplay_Bold, fontSize: wp("8.5%"), color: AMColors.primary },
    postDescStyle: { fontFamily: AMFonts.SFProDisplay_Regular, color: AMColors.light_Grey, fontSize: fontNormalize(20) },
})