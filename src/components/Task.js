import React from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Icon from 'react-native-vector-icons/FontAwesome'

import commonStyles from '../commonStyles'

import moment from 'moment'
import 'moment/locale/pt-br'

/*
O objeto estimateAt é a data estipulada, por enquanto concatenado com uma string
para ser mostrado como string
o doneAt é tbm do tipo date

Icon é um componente padrão (não sei se nativo ou renderizado)

SWIPEABLE
O swipeable é a função de deslizar algum componente
o renderRightActions é para realizar uma ação ao renderizar para a direita
no nosso caso quando ele deslizar para a direita irá renderizar o lixo

A tática de ao chamar a função utilizar <function> && <function(props)>
serve para validar se existe uma função sendo invocada, caso exista ela é chamada
Se nunca for definida uma função então nada acontece
*/

export default props => {

    const doneOrNotStyle = props.doneAt ? { textDecorationLine: 'line-through' } : {}

    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMM')

    const getRightContent = () => {
        return (
            <View style={[styles.outOfBounds, {paddingLeft: 0}]}>
                <TouchableOpacity style={styles.right}
                    onPress={() => props.onDelete && props.onDelete(props.id)}>
                    <Icon name={'trash'} size={30} color={'#FFF'} />
                </TouchableOpacity>
            </View>
        )
    }

    const getLeftContent = () => {
        return (
            <View style={[styles.outOfBounds, {flex: 1}]}>
                <View style={styles.left}>
                    <Icon name={'trash'} size={20} color={'#FFF'} />
                    <Text style={styles.excludeText}>Excluir</Text>
                </View>
            </View>
        )
    }

    return (
        <Swipeable renderRightActions={getRightContent} renderLeftActions={getLeftContent}
            onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)} >
            <View style={styles.outOfBounds}>
                <View style={styles.container}>
                    <View>
                    <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
                        <View style={styles.checkContainer}>
                            {getCheckView(props.doneAt)}
                        </View>
                    </TouchableWithoutFeedback>
                    </View>
                    <View>
                        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </View>
            </View>
        </Swipeable>
    )
}

function getCheckView(doneAt) {
    if(doneAt) {
        return (
            <View style={styles.done}>
                <Icon name={'check'} size={20} color={commonStyles.colors.darkBackground}/>
            </View>
            )
        } else {
            return (
                <View style={styles.pending}></View>
                )
    }
}

const styles = StyleSheet.create({
    outOfBounds: {
        padding: 10,
        paddingBottom: 0
    },
    container: {
        flexDirection: 'row',
        borderColor: commonStyles.colors.borderColor,
        borderRadius: 10,
        borderWidth: 4,
        alignItems: 'center',
        padding: 15,
        backgroundColor: commonStyles.colors.darkBackground
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 12.5,
        borderWidth: 1,
        borderColor: '#FFF'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 12.5,
        backgroundColor: '#2BF60E',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 18
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 14
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderRadius: 10,
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 4,
        borderColor: commonStyles.colors.darkBackground

    },
    left: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 4,
        borderColor: commonStyles.colors.darkBackground
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    }
})