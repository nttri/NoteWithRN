import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
    TextInput,
    View,
    ListView,
    Image,
    Alert,
    Dimensions,
} from 'react-native';

const {width,height} = Dimensions.get('window');
const firebase = require ('firebase');

export default class App extends Component {
    constructor(props){
        super(props);

        // connect to Firebase
        var config = {
            apiKey: "AIzaSyCm53Wc5xlbaeOdANevBsib19-0KOX1OuM",
            authDomain: "demofirebase-6dd08.firebaseapp.com",
            databaseURL: "https://demofirebase-6dd08.firebaseio.com"
        };
        firebase.initializeApp(config);

        var rootRef = firebase.database().ref();
        this.itemsRef = rootRef.child('App Your List');

        //state
        this.state={
            dataSource: new ListView.DataSource({rowHasChanged:(r1,r2) => r1!==r2}),
            newTask: ''
        }
        this.items = []
    }

    componentDidMount(){
        
        // xử lý khi thêm Task
        this.itemsRef.on('child_added',(dataSnapshot) => {
            this.items.push({
                id: dataSnapshot.key,
                value: dataSnapshot.val()
            })
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.items)
            })
        });
        
        // xử lý khi xóa Task
        this.itemsRef.on('child_removed',(dataSnapshot) => {
            this.items = this.items.filter((x)=> x.id !== dataSnapshot.key);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.items)
            })
        });
    }

    addTask(){
        if(this.state.newTask == '')
            {
                alert('Please type something')
            }
        else{
            this.itemsRef.push({
                Task: this.state.newTask
            });
            this.setState({
                newTask: ''
            })
        }
    }

    removeTask(prop){
        Alert.alert(
            'Warning',
            'Are you sure to remove this task?',
            [
                {
                    text: 'Ok',
                    onPress: ()=>this.itemsRef.child(prop.id).remove()
                },
                {
                    text: 'Cancel',
                    onPress: ()=>console.log('Cancel')
                }
            ]
        )
    }

    initRow(prop){
        return(
            <View style={styles.perRow}>
                <View style={{flex:5}}>
                    <Text style={{fontSize:16,color:'white'}}>{prop.value.Task}</Text>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity
                        style={styles.delButton}
                        onPress={()=>this.removeTask(prop)}
                    >   
                        <Image 
                            source={require('./images/icon_trash.png')}
                            style = {{width:width*0.06,height:width*0.06,tintColor:'#4caf50'}}
                            
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    render() {
        console.ignoredYellowBox = ['Setting a timer'];
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor='transparent'
                    barStyle='dark-content'
                    translucent = {true}
                />

                <View style={styles.header}>
                    <Text style={{color:'#4caf50',fontSize:26,fontWeight:'bold'}}>Task list</Text>
                </View>

                <View style={styles.body}>
                    <ListView
                        dataSource = {this.state.dataSource}
                        renderRow = {this.initRow.bind(this)}
                    />
                </View>

                <View style={styles.adder}>
                    <TextInput
                        style = {styles.inputLine}
                        placeholder = {'Type here'}
                        placeholderTextColor = {'#cfd8dc'}
                        underlineColorAndroid = {'transparent'}
                        fontSize = {16}
                        onChangeText = {(str)=>{this.setState({newTask:str})}}
                        value = {this.state.newTask}
                    />
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress = {()=>this.addTask()}
                    >
                        <Text style={{color:'#4caf50',fontSize:16}}>Add</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        height:height*0.08,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#34515e',
        elevation: 8
    },
    body: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#29434e',
    },
    adder: {
        flexDirection: 'row',
        backgroundColor: '#34515e',
        height:height*0.12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton:{
        backgroundColor: '#29434e',
        width: width*0.15,
        height: width*0.15,
        borderRadius: width,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        borderWidth: 1,
        borderColor: '#4caf50'
    },
    inputLine:{
        backgroundColor: 'white',
        height: width*0.12,
        width: width*0.7,
        borderRadius: 20,
        fontSize: 18,
        paddingLeft: 20,
    },
    perRow:{
        flex:1,
        flexDirection:'row',
        width: width*0.97,
        marginTop: 10,
        padding: 12,
        paddingLeft: 25,
        backgroundColor: '#4caf50',
        borderTopLeftRadius: width,
        borderBottomLeftRadius: width,
        borderBottomRightRadius: width,
    },
    delButton:{
        width: width*0.09,
        height: width*0.09,
        borderRadius: width,
        backgroundColor: '#29434e',
        marginLeft: 20,
        justifyContent:'center',
        alignItems:'center'
    }
});
