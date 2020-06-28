import React from 'react'
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { Gravatar } from 'react-native-gravatar'
import commonStyles from '../commonStyles'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {
    
    const optionsGravatar = {
        email: props.navigation.getParam('email'),
        secure: true
    }

    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.navigate('AuthOrApp')
    }

    return (
        <ScrollView style={styles.navigator}>
            <View style={styles.header}>
                <Text style={styles.title}>Tasks</Text>
                <Gravatar style={styles.avatar}
                    options={optionsGravatar} />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.name}>
                    {props.navigation.getParam('name')}
                </Text>
                <Text style={styles.email}>
                    {props.navigation.getParam('email')}
                </Text>
            </View>
            <DrawerItems {...props}/>
            <TouchableOpacity onPress={logout}>
                <View style={styles.logoutIcon}>
                    <Icon name={'sign-out'} size={30} color={commonStyles.colors.secondary} />
                </View>
            </TouchableOpacity>
            <View style={styles.signatureContainer}>
                <Text style={styles.signature} >por: Lucas Bianco</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    navigator: {
        backgroundColor: commonStyles.colors.borderColor
    },
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD',
    },
    title: {
        color: commonStyles.colors.mainText,
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        paddingTop: 70,
        padding: 10,
        paddingBottom: 0
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 10,
    },
    userInfo: {
        marginLeft: 10
    },
    name: {
        color: commonStyles.colors.mainText,
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginTop: 10,
        marginBottom: 5
    },
    email: {
        color: commonStyles.colors.mainText,
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        marginBottom: 10
    },
    signatureContainer: {
        marginLeft: 10,
        marginTop: 250
    },
    signature: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary
    },
    logoutIcon: {
        marginTop: 30,
        marginLeft: 30
    }
})