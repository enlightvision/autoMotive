import React, { useEffect, useState } from 'react';
import { Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AMAssets from '../Assets';
import AMColors from '../Utils/AMColors';

const AMDropdownList = (props) => {

    const [search, setSearch] = useState("")
    const [actualDataList, setActualDataList] = useState([])
    const [searchListData, setSearchListData] = useState([])

    useEffect(() => {
        setActualDataList(props.data)
        setSearchListData(props.data)
        Keyboard.dismiss();
        return () => {
            if (props.isSearchEnable) {
                setSearch("")
                setSearchListData(actualDataList)
            }
        }
    }, [])

    const onSelectMenu = (item) => {
        if (props.onReceiveItem) {
            props.onReceiveItem(item)
        }
    }

    const onChangeSearchTxt = (text) => {
        if (text == "") {
            setSearchListData(actualDataList)
        } else {
            setSearchListData(actualDataList.filter(item => item?.name.toLowerCase().search(text.toLowerCase()) !== -1))
        }
        setSearch(text)
    }

    const returnListData = () => {
        if (props.isSearchEnable) {
            return Array.isArray(searchListData) && searchListData.length !== 0 ? searchListData : null
        } else {
            return Array.isArray(actualDataList) && actualDataList.length !== 0 ? actualDataList : null
        }
    }

    const onCancelSearch = () => {
        if (search !== "") {
            setSearch("")
            setSearchListData(actualDataList)
        }
    }

    return (
        <View style={{ position: 'absolute', right: 0, left: 0, zIndex: 9999, backgroundColor: AMColors.white }}>
            {(props.isSearchEnable && actualDataList.length !== 0) ?
                <View style={{ flexDirection: 'row', paddingVertical: 5, marginVertical: 5, borderColor: AMColors.light_Grey, borderRadius: 10, borderWidth: 1, alignItems:'center' }}>
                    <TextInput
                        style={{ flex: 1,color: AMColors.black, marginLeft: 10 }}
                        value={search}
                        onChangeText={onChangeSearchTxt}
                        placeholder={props.placeholder}
                    />

                    <Pressable
                        onPress={onCancelSearch}
                    >
                        <Icon name={search == "" ? 'search' : 'highlight-off'} style={{ marginRight: 10 }} color={AMColors.light_Grey} size={20} />
                    </Pressable>
                </View>
                : null}
            <View style={{ maxHeight: 150, borderWidth: 1, borderColor: AMColors.primary, borderRadius: 5 }}>
                <ScrollView nestedScrollEnabled keyboardShouldPersistTaps={'always'}>
                    {returnListData() ? returnListData().map((item, index) => {
                        return (
                            <Pressable key={index} style={{ padding: 10 }}
                                onPress={() => onSelectMenu(item)}
                            >
                                <Text>{(item?.name ?? item)}</Text>
                            </Pressable>
                        )
                    }) :
                        <View style={{ padding: 10 }}>
                            <Text>{"No data found"}</Text>
                        </View>
                    }
                </ScrollView>
            </View>
        </View>
    );
};

export default AMDropdownList;

const style = StyleSheet.create({

})