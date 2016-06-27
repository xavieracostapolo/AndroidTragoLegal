'use strict';

// 3CM25KWTT1

import  React, { 
    Component 
} from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';

import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    ListView,
    ScrollView,
    Dimensions
} from 'react-native';

const width = Dimensions.get('window').width;

class AppTragoLegal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            codigo : null,
            tragos : [],
            buscando : false
        }
    }

    componentDidMount(){
        this.refs['txtCodigo'].focus();
    }

    renderLoadingView() {
        return (
        <View style={styles.containerBuscando}>
            <Text>
                Buscando estampilla ...
            </Text>
            <Text>El exceso de alcohol es perjudicial para la salud.</Text>
            <Text>Prohibido el expendio de bebidas embriagantes a menores de edad.</Text>
        </View>
        );
    }

    render() {

        if (this.state.buscando){
            return this.renderLoadingView();
        }

        return (
            <View style={styles.container}>
                <ScrollView>

                    <View style = {styles.cajaHeader}>
                        <Text style = {styles.titulo}>
                            Trago Legal.
                        </Text>
                        <Text style={styles.subtitulo}>
                            Consulta la estampilla de tu botella y verifica que sea trago legal.
                        </Text>
                    </View>
                    
                    <View style = {styles.formulario}>
                        
                        <TextInput 
                                ref='txtCodigo'
                                autoCapitalize='characters'
                                autoCorrect={false}
                                // autoFocus={true}
                                maxLength={10}
                                textAlign='center'
                                returnKeyType='search'
                                clearButtonMode='always'
                                placeholder='Estampilla' 
                                style={styles.txtCodigo} 
                                value = {this.state.codigo}
                                onChange = { event => this.onInputChange(event.nativeEvent.text)}
                                onSubmitEditing = {()=> this.onPressClearCod()}
                                blurOnSubmit={false}
                            />

                    </View>
                    
                    <ListView
                        // enableEmptySections
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
        <View style={styles.rowListView}>
            <Text>Codigo : {trago.codigo}</Text>
            <Text>Mensaje : {trago.mensaje}</Text>
            <Text>Fecha : {trago.fechaHora}</Text>
        </View>
        );
    }

    tragoSearch() {

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
        
        _component.setState({
            buscando : true
        });

        fetch(urlService + this.state.codigo)  
        .then(function(response) {

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

                var date_sort_desc = function (date1, date2) {
                    // This is a comparison function that will result in dates being sorted in
                    // DESCENDING order.
                    if (date1 > date2) return -1;
                    if (date1 < date2) return 1;
                    return 0;
                };

                tmpTrago.sort(date_sort_desc);
                
                _component.setState({
                    tragos : tmpTrago,
                    dataSource: _component.state.dataSource.cloneWithRows(tmpTrago),
                    buscando : false
                });
            });  
        })  
        .catch(function(err) {  
            console.log('Fetch Error :-S', err);  
        });

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
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        padding: 10,
        backgroundColor: '#247BA0',
        justifyContent: 'flex-start',//'center',

    },
    containerBuscando: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CDE77F'
    }, 
    rowListView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F0F8EA',
        borderWidth: 1,
        borderColor: '#677676',
        padding: 5
    },
    listView: {
        backgroundColor: '#F0F8EA',
    },
    cajaHeader: {
        alignItems: 'center',
        padding: 20,
        marginBottom: 20,
        backgroundColor: '#247BA0',
    },
    formulario: {
        flexDirection: 'row',
        backgroundColor: '#766554',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },
    titulo: {
        fontSize: 30,    
        color: '#70C1B3'
    },
    subtitulo: {
        fontSize: 10,
        marginTop: 5,
        color: '#70C1B3'
    },
    txtCodigo: {
        height: 70,
        borderWidth: 0.5,
        borderColor: '#0f0f0f',
        backgroundColor: '#F0F8EA',
        color: '#13293D',
        flex: 1,
        fontSize: 50,
        padding: 4,
        width: width * .8
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