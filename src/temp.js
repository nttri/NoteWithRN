import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const firebase = require ('firebase');

export default class App extends Component {
    constructor(props){
        super(props);
        var config = {
            apiKey: "AIzaSyCm53Wc5xlbaeOdANevBsib19-0KOX1OuM",
            authDomain: "demofirebase-6dd08.firebaseapp.com",
            databaseURL: "https://demofirebase-6dd08.firebaseio.com"
        };
        firebase.initializeApp(config);

        var rootRef = firebase.database().ref();
        this.itemsRef = rootRef.child('Folder1');
    }

    // thêm data lên Firebase
    saveWithSet(){
        this.itemsRef.set({
            reactNative_1: 'Use set()',
      })
    }

    // thêm data kèm theo bị chèn trong 1 encode ID 
    saveWithPush(){
        this.itemsRef.push({
            reactNative_2: 'Use push()',
      })
    }

    // listen to events
    addData(){
        this.itemsRef.child('reactNative_1').on('value',function(snapshot){
            alert(snapshot.val())
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress = {()=>{this.addData()}}>
                <Text>
                    Touch to listen to event
                </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7154c8',
    },
});
