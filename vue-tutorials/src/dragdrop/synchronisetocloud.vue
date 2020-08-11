<template>
    <div>
        <v-btn @click="readData">Read data</v-btn>
        <v-btn @click="writeData">Save data</v-btn>
    </div>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase'

export default {
    props: {
        structureDatabase: Array
    },
    data() {
        return {
            currentUser: {
                userID: 0,
                isAnonymous: false,
                databaseRef: ""
            },
            firebaseConfig: {},
        }
    },
    created: function () {
        this.initialiseDatabase()
    },
    computed: {
        usedDatabase: {
            get: function () {

                return this.structureDatabase
            },
            set: function (value) {
                console.log(`usedDatabase.set: ${value}`)
                this.$emit('databaseUpdate', value)
            }
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
            }
            
            firebase.initializeApp(this.firebaseConfig)

            firebase.auth().signInAnonymously()

            firebase.auth().onAuthStateChanged(this.setUserValues)

        },
        setUserValues(user) {
            this.currentUser = {
                userID: user.userID,
                isAnonymous: user.isAnonymous,
                databaseRef: firebase.database()
            }
            console.log(`Uservalues set: ${this.currentUser}`)
        },
        readData() {
            this.currentUser.databaseRef.ref("structuredata/").once('value')
            .then(this.handleDatabaseData)
            .catch(function(error) {
                console.error(`${error.code}: ${error.message}`)
            })

            console.log(`Read data: ${this.usedDatabase}`)
        },
        handleDatabaseData(data) {
            // Handle incoming data here and store it to correct form.
            
            var structureDataFromParsed = []

            data.forEach(element => {
                    structureDataFromParsed.push({
                        key: element.val().key,
                        id: element.val().id,
                        name: element.val().name,
                        children: element.val().children
                    })
            });

            this.usedDatabase = structureDataFromParsed
        },
        readStructureData(structure) {
            console.log(`readStructureData: ${structure}`)
            
            this.usedDatabase.push(structure)
        },
        writeData() {
            
            this.currentUser.databaseRef.ref('structuredata/').set(this.usedDatabase)

            // this.usedDatabase.forEach(element => {
            //     this.currentUser.databaseRef.ref.child('structuredata/').


            //     if (!this.currentUser.databaseRef.ref('structuredata/').key.contains(element.key)) {

            //         newData = this.currentUser.databaseRef.ref('structuredata/').push()
            //     }



            //     newData.set({
            //         key: newData.key,
            //         id: element.id,
            //         name: element.name,
            //         children: element.children
            //     })
            //     .catch(function(error){
            //         console.error(`${error.code}: ${error.message}`)
            //     })
            // });

            this.readData()


        },
        deleteData() {
            // Not implemented at the moment.
        },
        parseObjectToJSON(dataAsObject) {
            // dataAsObject.forEach(element => {
            //     var stringifiedElement = JSON.stringify(element)
            //     element = stringifiedElement
            // });

            return dataAsObject;
            // firebase.database().ref().set(json);
        },
        parseObjectFromJSON(dataAsJson) {
            // dataAsJson.forEach(element => {
            //     var parsedElement = JSON.parse(element)
            //     element = parsedElement
            // });

            return dataAsJson
            // console.log(`dataAsJson type: ${typeof dataAsJson} + ${JSON.stringify(dataAsJson)}`)
            // return JSON.parse(dataAsJson, Function.deserialize)
        },
    }
}
</script>

<style>

</style>