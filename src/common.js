import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios'
    ? 'http://localhost:3000' : 'http://10.0.2.2:3000'

function showError(err) {
    if(err.response && err.response.data) {
        Alert.alert(`${err.response.data}`, 'Insira seus dados novamente.')
    }
    Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err}`)
}

function showSucces(msg) {
    Alert.alert('Sucesso!', msg)
}

export { server, showError, showSucces }