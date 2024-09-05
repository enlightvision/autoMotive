import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AMColors from '../Utils/AMColors';
import { fontNormalize } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';

const NavBar = (props) => {
    return (
        <View style={{ height: 60, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 25, flexDirection: 'row', justifyContent:'space-between' }}>
            {props.leftComponent ? props.leftComponent :
                <Pressable onPress={props.onLeftPress} >
                    <Icon name='arrow-back' color={AMColors.primary} />
                </Pressable>
            }
            <Text style={{ flex: 1, fontFamily: AMFonts.SFProDisplay_Bold, fontSize: fontNormalize(20), color: AMColors.grey, textAlign:"center" }} numberOfLines={1}>{props.title ?? ""}</Text>
            {props.rightComponent ? props.rightComponent :
                <View style={{width:25}}/>
            }


        </View>
    );
};

export default NavBar;

const style = StyleSheet.create({
    
})