import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AMColors from '../Utils/AMColors';
import { fontNormalize } from '../Utils/AMConstant';
import AMFonts from '../Utils/AMFonts';

const AMDropdownPicker = (props) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(props.data ?? []);

    useEffect(()=>{
        setItems(props.data)
    },[props.data])

    const onSelectHandler = (data) => {
        if (props.onSelectItem) {
            props.onSelectItem(data)
        }
    }

    return (
        <View style={{ marginTop: 10, zIndex: props.zIndex }}>
            <View>
                <Text style={{ color: AMColors.primary }}>{props.title}
                {props.isDisableMendatory ? "" : <Text style={{ fontSize: fontNormalize(20) }}>*</Text>}</Text>
            </View>

           
            <Pressable style={{ flexDirection: 'row',alignItems:'center', padding: 10, borderWidth: 1, borderColor: AMColors.primary, borderRadius: 10 }}
            onPress={props.onPress}
            >
                <Text style={{ flex: 1, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(15) }}>{props?.value ?? "Select"}</Text>
                <Icon name='expand-more' size={35} color={AMColors.primary} />
            </Pressable>

            {props.error ? 
            <Text style={{color: AMColors.red, fontFamily: AMFonts.Montserrat_Regular, fontSize: fontNormalize(12)}}>{props.error}</Text>
            : null}
        </View>
    );
};

export default AMDropdownPicker;

const style = StyleSheet.create({
    
})