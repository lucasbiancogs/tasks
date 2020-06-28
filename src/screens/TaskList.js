import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground,
    TouchableOpacity, FlatList, Alert } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import axios from 'axios'

import { server, showError } from '../common'
import commonStyles from '../commonStyles'
import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'
import Task from '../components/Task'
import AddTask from './AddTask'
import { withNavigationFocus } from 'react-navigation'

/*
FLATLIST
O FlatList percorre um array javascript, no caso o array tasks
O keyExtractor é um requerimento do FlatList, pedido como string
por isso foi necessá¡rio criar um id aleatório
O renderItem é o mais complexo... Nele inserimos um item já desestruturado
ao invés de por exemplo chamar a função com obj e depois dentro da função obj.item
Nos itens criados de tasks já colocamos as propriedades com os nomes corretos
para podermos facilmente desestruturar
a função do renderItem vai pegar o item de dentro do objeto no caso as instâncias do array
criar um jsx de Task inserindo como parâmetro os itens dessa instância

TOGGLETASK
O toggleTask vai pegar o taskId inserido, procurar dentro do array e quando encontrar fazer a alternÃ¢ncia
da data antiga para a atual
É um filho que altera o estado do pai usando função callback

COMPONENTDIDMOUNT
é um componente padrão do react-native
Serve para toda vez que o componente for montado,
chamá-lo para atualizar a lista automaticamente, caso esteja filtrado e se marque com feita tarefa
Depois de setState é aceita uma função, assim,
depois de setado o estado, se executa a função
*/

const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
}

class TaskList extends Component {

    state = { ...initialState }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }
    
    filterTasks = () => {
        let visibleTasks = [...this.state.tasks]
        if (!this.state.showDoneTasks) {
            const pending = task => !task.doneAt
            visibleTasks = visibleTasks.filter(pending)
        }
        
        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }

    async componentDidMount() {
        const stateString = await AsyncStorage.getItem('tasksState')
        const savedState = JSON.parse(stateString) || initialState
        this.setState({
            showDoneTasks: savedState.showDoneTasks
        })
        this.loadTasks()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
          this.loadTasks()
        }
      }

    loadTasks = async () => {
        try {
            const maxDate = moment().add({ days: this.props.daysAhead })
                .format('YYYY-MM-DD 23:59:59')
            // Isso faz com que se mostre só as tarefas de hoje
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({ tasks: res.data }, this.filterTasks)
        } catch(e) {
            showError(e)
        }
    }

    toggleTask = async taskId => {
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    addTask = async newTask => {
        if(!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }

        try {
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })

            this.setState({ showAddTask: false }, this.loadTasks)
        } catch(e) {
            showError(e)
        }
    }

    deleteTask = async taskId => {
        try {
            await axios.delete(`${server}/tasks/${taskId}`)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            case 30: return monthImage
        }
    }

    getColor = () => {
        switch(this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            case 30: return commonStyles.colors.month
        }
    }

    barsButton = () => {
        this.props.navigation.openDrawer()
    }

    render() {

        const eyeIcon = this.state.showDoneTasks ? 'eye' : 'eye-slash'
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask} 
                onCancel={() => this.setState({ showAddTask: false })}
                onSave={this.addTask} />
                <ImageBackground source={this.getImage()} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.barsButton}>
                            <Icon name={'bars'} size={30} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={eyeIcon} size={30} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks}
                    keyExtractor={item => `${item.id}`}
                    renderItem={({item}) => <Task onToggleTask={this.toggleTask}
                        {...item} onDelete={this.deleteTask} />} />
                </View>
                <TouchableOpacity onPress={() => this.setState({ showAddTask: true })} >
                    <View style={addButton.container} />
                    <View style={[addButton.horizontalBar, { backgroundColor: this.getColor() }]} />
                    <View style={[addButton.verticalBar, { backgroundColor: this.getColor() }]} />
                </TouchableOpacity>
            </View>
        )
    }
}

export default withNavigationFocus(TaskList)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskList: {
        backgroundColor: commonStyles.colors.darkBackground,
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent:'space-between',
        marginTop: 35
    }
})

const addButton = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 22.5,
        right: 17.5,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    horizontalBar: {
        position: 'absolute',
        bottom: 40,
        right: 17.5,
        height: 3,
        width: 40,
        borderRadius: 1.5
    },
    verticalBar: {
        position: 'absolute',
        right: 35,
        bottom: 22.5,
        height: 40,
        width: 3,
        borderRadius: 1.5
    }
})