'use strict';

import React, { Component } from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';

import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    ListView,
    ScrollView
} from 'react-native';

class AppTragoLegal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            codigo : null,
            tragos : []
        }
    }

    /*fetchData() {
        var urlService = 'https://tragolegal.herokuapp.com/v1/tragolegal/';

        fetch(urlService + this.state.codigo)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData),
            });
        })
        .done();
    }*/

    tragoSearch(){
        let _component = this;
        
        var trago = {
            id: '',
            codigo: '',
            mensaje: '',
            fechaHora: '',
            estilo: ''
        };
        
        var tmpTrago = _component.state.tragos.slice();
        
        var urlService = 'https://tragolegal.herokuapp.com/v1/tragolegal/';
        // var urlService = 'http://localhost:8081/v1/tragolegal/';
        
        fetch(urlService + this.state.codigo)  
        .then(  
            function(response) {  
                if (response.status !== 200) {  
                    console.log('Looks like there was a problem. Status Code: ' +  
                    response.status);  
                    return;  
                }

                // Examine the text in the response  
                response.json().then(function(data) {  
                    
                    trago.mensaje = data.mensaje;
                    trago.codigo = data.codigo;
                    trago.fechaHora = data.fecha;
                    trago.id = data.id;
                                      
                    tmpTrago.push(trago);
                    
                    _component.setState({
                        tragos : tmpTrago
                    });
                });  
            }  
        )  
        .catch(function(err) {  
            console.log('Fetch Error :-S', err);  
        });

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(
                this.state.tragos
            )});
    }

    onInputChange(cod) {
        this.setState({
            codigo : cod
        });
    }

    onPressClearCod() {

        this.tragoSearch();

        this.setState({
            codigo : ''
        });

        // this.refs['txtCodigo'].focus();
    }

    render() {
        console.log('Inicio de app');
        return (
            <View style={styles.container}>

                <View style = {styles.cajaHeader}>
                    <Text style = {styles.titulo}>
                        Trago Legal.
                    </Text>
                    <Text style={styles.subtitulo}>
                        Consulta la estampilla de la botella y verifica que sea trago legal.
                    </Text>
                </View>
                
                <View style = {styles.formulario}>
                    
                    <Text>Ingresa el codigo de la estampilla.</Text>
                    
                    <TextInput 
                            ref='txtCodigo'
                            autoCapitalize='characters'
                            autoCorrect={false}
                            // autoFocus={true}
                            maxLength={10}
                            textAlign='center'
                            returnKeyType='search'
                            clearButtonMode='always'
                            placeholder='3CM25KWTT1' 
                            style={styles.txtCodigo} 
                            value = {this.state.codigo}
                            onChange = { event => this.onInputChange(event.nativeEvent.text)}
                            onSubmitEditing = {()=> this.onPressClearCod()}
                            blurOnSubmit={false}
                        />
                    
                    <TouchableHighlight onPress={()=> this.onPressClearCod()}>
                        <Text style = {styles.btnLimpiar}>Limpiar </Text>
                    </TouchableHighlight>
                    <Text>
                        {this.state.codigo}
                    </Text>

                </View>

                <ScrollView>
                    <ListView
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        renderRow={this.renderTrago}
                        style={styles.listView}
                    />
                </ScrollView>
                
            </View>
        );
    }

    renderTrago(trago) {
        return (
        <View style={styles.containerListView}>
            <Text>Estilo : {trago.estilo}</Text>
            <Text>Codigo : {trago.codigo}</Text>
            <Text>Mensaje : {trago.mensaje}</Text>
            <Text>Fecha : {trago.fechaHora}</Text>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        padding: 10,
        backgroundColor: '#677676',
        justifyContent: 'flex-start',//'center',

    },
    containerListView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F5FCFF',
    },
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
    cajaHeader: {
        alignItems: 'center',
        padding: 20,
        marginBottom: 30,
        backgroundColor: '#FFFFFF',
    },
    formulario: {
        backgroundColor: '#766554',
        alignItems: 'center'
    },
    titulo: {
        fontSize: 30,    
    },
    subtitulo: {
        fontSize: 10,
        marginTop: 5
    },
    txtCodigo: {
        height: 70,
        borderWidth: 0.5,
        borderColor: '#0f0f0f',
        flex: 1,
        fontSize: 50,
        padding: 4,
        width: 300
    },
    btnLimpiar: {
        height: 40,
        textAlign: 'center',
        marginTop: 10,
        fontSize: 20,
        // backgroundColor: '#FFFFFF',
        width: 100,
        textAlignVertical: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dotted'
    }
});

AppRegistry.registerComponent('AppTragoLegal', () => AppTragoLegal);