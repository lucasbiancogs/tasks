import React, { Component } from 'react'
import { Modal, View, StyleSheet, TouchableWithoutFeedback,
    Text, TouchableOpacity, TextInput, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

import moment from 'moment'

import commonStyles from '../commonStyles'

const initialState = { desc: '', date: new Date(), showDatePicker: false }

export default class AddTask extends Component {

    state = {
        ...initialState
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }

        if(this.props.onSave) {
            this.props.onSave(newTask)
        }

        this.setState({ ...initialState })
    }

    getDateTimePicker = () => {
        let datePicker = <DateTimePicker value={this.state.date}
            onChange={(_, date) => this.setState({ date, showDatePicker: false })}
            mode={'date'} minimumDate={new Date()} locale={'pt-br'} />
        
        const dateString = moment(this.state.date).format('dddd, D [de] MMMM [de] YYYY')

            if(Platform.OS === 'android') {
                datePicker = (
                    <View>
                        <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                            <Text style={styles.date}>
                                {dateString}
                            </Text>
                        </TouchableOpacity>
                        {this.state.showDatePicker && datePicker}
                    </View>
                )
            }

            return datePicker
    }

    render() {
        return (
            <Modal transparent={true} visible={this.props.isVisible} 
            onRequestClose={this.props.onCancel} animationType={'slide'}>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.containerBackground}>
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.header}>Nova Tarefa</Text>
                        </View>
                        <TextInput style={styles.input} 
                        placeholder={'Descrição'} placeholderTextColor={'white'} 
                        keyboardAppearance={'dark'} textAlign={'center'}
                        value={this.state.desc}
                        onChangeText={desc => this.setState({ desc })} />
                        {this.getDateTimePicker()}
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={this.props.onCancel}>
                                <Text style={styles.button}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.save}>
                                <Text style={styles.button}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background}>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    containerBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        borderColor: commonStyles.colors.borderColor,
        backgroundColor: commonStyles.colors.darkBackground,
        borderRadius: 25,
        borderWidth: 5
    },
    headerContainer: {
        backgroundColor: commonStyles.colors.today,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 25,
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        width: '90%',
        height: 40,
        margin: 15,
        marginLeft: 20,
        backgroundColor: commonStyles.colors.borderColor,
        borderRadius: 6,
        color: commonStyles.colors.mainText,
        fontSize: 20
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15
    }
})