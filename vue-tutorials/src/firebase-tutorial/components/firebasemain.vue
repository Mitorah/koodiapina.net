<template>
    <v-app>
        <v-card-text readonly>{{this.userInfo}}</v-card-text>
        <v-btn @click="showAuthentication = !showAuthentication">Authenticate</v-btn>
        <v-btn :disabled="!this.firebaseDatabase" @click="showCreateCard = !showCreateCard">Create new item</v-btn>
        <v-btn :disabled="!this.firebaseDatabase" @click="readDataCards">Read data</v-btn>
        <v-navigation-drawer width="300" right absolute temporary v-model="showAuthentication">
            <authentication-card @auth-init="initialiseDatabase"></authentication-card>
        </v-navigation-drawer>
        
        <v-navigation-drawer width="300" right absolute temporary v-model="showCreateCard">
            <v-row justify="center">
                <v-col cols="auto">
                    <new-data-card @data-submitted="writeCardData"></new-data-card>
                </v-col>
            </v-row>
        </v-navigation-drawer>

        <v-row>
            <v-col cols="auto" justify="center">
                <data-card 
                v-for="item in allItems"
                :key="item.key"
                :itemdata="item"
                @remove-item="deleteCardData"
                ></data-card>
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
import datacardVue from './datacard.vue'
import newdatacardVue from './newdatacard.vue'
import authenticationVue from './authentication.vue'
import * as firebase from 'firebase/app'
import 'firebase'

export default {
    components: {
        'data-card': datacardVue,
        'new-data-card': newdatacardVue,
        'authentication-card': authenticationVue
    },
    data() {
        return {
            userInfo: {
                isAnonymous: "",
                userID: "",
            },

            showAuthentication: false,
            showCreateCard: false,
            allItems: [],

            firebaseConfig: "",
            firebaseDatabase: "",
        }
    },
    methods: {
        initialiseDatabase() {
            this.firebaseConfig = {
                apiKey: "AIzaSyATT7h1RtkmotHFYaHuHcRELdXGuPrtRf4",
                authDomain: "datacardexample.firebaseapp.com",
                databaseURL: "https://datacardexample.firebaseio.com",
                projectId: "datacardexample",
                storageBucket: "datacardexample.appspot.com",
                messagingSenderId: "391709456117",
                appId: "1:391709456117:web:58298a7ab7dc0bbe4437bc"
            };

            firebase.initializeApp(this.firebaseConfig)

            firebase.auth().signInAnonymously()

            firebase.auth().onAuthStateChanged(this.setUserValues)



            this.showAuthentication = false
        },
        readDataCards() {
            this.allItems = []
            
            this.firebaseDatabase.ref("datacards/").once('value')
            .then(this.readSnapshotData)
            .catch(function(error){
                console.log(error.code + ": " + error.message)
            })
        },
        readSnapshotData(snapshot) {
            snapshot.forEach(this.addSnapshotDataToArray)
        },
        addSnapshotDataToArray(item) {
            this.allItems.push({
                key: item.val().key,
                name: item.val().name,
                description: item.val().description
            })
        },
        writeCardData(newData) {
            this.showCreateCard = false;
            
            var newDataCard = this.firebaseDatabase.ref('datacards/').push()

            newDataCard.set({
                key: newDataCard.key,
                name: newData.name,
                description: newData.description
            })
            .catch(function(error) {
                console.log(error.code + ": " + error.message)
            })

            this.allItems.push({
                key: newDataCard.key,
                name: newData.name,
                description: newData.description
            })
        },
        deleteCardData(itemKey) {
            this.firebaseDatabase.ref('datacards/').child(itemKey).remove(this.readDataCards)
            .catch(function(error){
                if (error) {
                    console.log(error.code + ": " + error.message)
                }
            })
        },
        setUserValues(user) {
            this.userInfo.userID = user.uid
            this.userInfo.isAnonymous = user.isAnonymous
            this.firebaseDatabase = firebase.database()
        }
    }
}
</script>

<style>

</style>