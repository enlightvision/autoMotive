import React from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import AMAssets from '../Assets';
import { DEFAULT_IMAGE_URL } from '../Utils/AMConstant';

const AMFastImage = (props) => {
    return (
        <>
            {props.source ?
                <FastImage
                    style={
                        props.style}
                    source={{
                        uri: (props.brand ? DEFAULT_IMAGE_URL + 'brand/' :DEFAULT_IMAGE_URL + 'partsSelling/') + props.source,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={props.resizeMode ?? FastImage.resizeMode.cover}
                />
                :
                <Image 
                style={props.style}
                source={props.placeholder ?? AMAssets.productlist_placeholder} />
            }
        </>
    );
};

export default AMFastImage;