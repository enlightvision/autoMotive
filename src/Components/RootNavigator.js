import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashContainer from '../Containers/SplashContainer';
import DashboardContainer from '../Containers/DashboardContainer';
import ChooseCarBrandContainer from '../Containers/ChooseCarBrandContainer';
import PartsSellDetailContainer from '../Containers/PartsSellDetailContainer';
import SearchFilterPartContainer from '../Containers/SearchFilterPartContainer';
import ListOfRequiredPart from '../Containers/ListOfRequiredPart';
import PartDetailContainer from '../Containers/PartDetailContainer';
import ProfileContainer from '../Containers/ProfileContainer';
import LoginContainer from '../Containers/LoginContainer';
import OTPContainer from '../Containers/OTPContainer';
import RegistrationContainer from '../Containers/RegistrationContainer';
import PostTypeDashboard from '../Containers/PostTypeDashboard';

const BASE_STACK = createStackNavigator();
// const MAIN_DRAWER = createDrawerNavigator();
const MAIN_STACK = createStackNavigator();

export const MainStackNavigator = () => {
    return (
        <MAIN_STACK.Navigator initialRouteName='dashboard' screenOptions={{ headerShown: false }}>
            <MAIN_STACK.Screen name="dashboard" component={DashboardContainer} />
            <MAIN_STACK.Screen name="posttypedashboard" component={PostTypeDashboard} />
            <MAIN_STACK.Screen name="choosecarbrand" component={ChooseCarBrandContainer} />
            <MAIN_STACK.Screen name="partsdetail" component={PartsSellDetailContainer} />
            <MAIN_STACK.Screen name="searchfilterparts" component={SearchFilterPartContainer} />
            <MAIN_STACK.Screen name="listrequireparts" component={ListOfRequiredPart} />
            <MAIN_STACK.Screen name="partdetail" component={PartDetailContainer} />
            <MAIN_STACK.Screen name="profile" component={ProfileContainer} />
            <MAIN_STACK.Screen name="login" component={LoginContainer} />
            <MAIN_STACK.Screen name="otp" component={OTPContainer} />
            <MAIN_STACK.Screen name="registration" component={RegistrationContainer} />
        </MAIN_STACK.Navigator>
    )
}

// export const MainDrawerStack = () => {
//     return(
//         <MAIN_DRAWER.Navigator initialRouteName='dashboard' screenOptions={{headerShown:false}}>
//             <MAIN_DRAWER.Screen name={'dashboard'} component={DashboardContainer}/>
//         </MAIN_DRAWER.Navigator>
//     )
// }

export const RootNavigator = () => {
    return (
        <NavigationContainer>

            <BASE_STACK.Navigator initialRouteName="splash" screenOptions={{
                headerShown: false
            }}>
                <BASE_STACK.Screen name="splash" component={SplashContainer} />
                <BASE_STACK.Screen name="main" component={MainStackNavigator} />
            </BASE_STACK.Navigator>
        </NavigationContainer>
    )
}
export default RootNavigator;