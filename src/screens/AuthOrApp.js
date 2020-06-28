import React, { Component } from 'react'
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

export default class AuthOrApp extends Component {

    componentDidMount = async () => {
        /*
        Basicamente quando o componente for montado ele irá pegar o dado do usuário
        da AsyncStorage e trazer todos os dados para um userData
        se ele não conseguir ele irá verificar
        existe um userData? e existe um token?
        se sim, ele irá passar como header a token como fazia na hora do login
        caso contrário só vai para a tela de login
        */
        const userDataJson = await AsyncStorage.getItem('userData')
        let userData = null

        try {
            userData = JSON.parse(userDataJson)
        } catch(e) {
            // userData está inválido
        }

        if(userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
            this.props.navigation.navigate('Home', userData)
        } else {
            this.props.navigation.navigate('Auth')
        }
    }


    render() {
        return (
            <View style={styles.container} >
                <ActivityIndicator size={'large'} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
    }
})