import React, { Component } from 'react'
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert } from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'
import AuthInput from '../components/AuthInput'

import { server, showError, showSucces } from '../common'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = { ...initialState }

    signinOrSignup = () => {
        if(this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        /*
        A requisição axios passa dentro do tipo de requisição a URL
        e também o corpo da requisição á transformando em JSON pelo jeito
        */
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            })

            showSucces('Usuário cadastrado!')
            this.setState({ ...initialState })

        } catch(e) {
            showError(e)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })
            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            // Assim ele passa nos headers com a tag Authorization a string
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            // Assim ele navega para Home e passa as propriedades do corpo da requisição axios
            this.props.navigation.navigate('Home', res.data)
        } catch(e) {
            showError(e)
            console.log(`User ${this.state.email} got an error: ${e}`)
        }
    }

    render() {

        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)
        
        if(this.state.stageNew) {
            validations.push(this.state.name && this.state.name.length >= 3)
            validations.push(this.state.confirmPassword === this.state.password)
        }

        const validForm = validations.reduce((t, a) => t && a)

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    { this.state.stageNew && 
                        <AuthInput icon={'user'}
                            placeholder={'Nome'}
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })}
                            textContentType={'none'} />
                    }
                    <AuthInput icon={'at'}
                        placeholder={'E-mail'}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        textContentType={'emailAddress'} />
                    <AuthInput icon={'lock'}
                        placeholder={'Senha'}
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password })}
                        textContentType={'none'} />
                    { this.state.stageNew && 
                        <AuthInput icon={'asterisk'}
                            placeholder={'Confirme a senha'}
                            value={this.state.confirmPassword}
                            secureTextEntry={true}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })}
                            textContentType={'none'} />
                    }
                    <TouchableOpacity onPress={this.signinOrSignup}
                        disabled={!validForm} >
                        <View style={[styles.button, validForm ? {} : { backgroundColor: '#AAA' }]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }}
                    onPress={() => this.setState({ stageNew: !this.state.stageNew})}>
                        <Text style={{color: '#FFF'}}>
                            {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui uma conta?'}
                        </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 100,
        marginBottom: 10
    },
    subtitle:{
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        width: '90%'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})