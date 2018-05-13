import React, { Component } from "react";
import { View, 
    Text, 
    TouchableOpacity, 
    Dimensions, 
    StyleSheet,
    TextInput 
    } from "react-native"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {
    constructor(props) {
        super(props);
        this.state = { isEditing: false, toDoValue: props.text };
    }

    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        uncompleteToDo: PropTypes.func.isRequired, 
        completeToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    };
    
    state = {
        isEditing: false,
        toDoValue: ""
    };

    render() {
        const { isEditing, toDoValue } = this.state;
        const { text, id, deleteToDo, isCompleted } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.column} >
                    <TouchableOpacity onPress={this._toggleComplete}>
                        <View style={[
                            styles.circle, 
                            isCompleted ? styles.completedCircle : styles.uncompletedCircle
                            ]} 
                        />
                    </TouchableOpacity>
                    {isEditing ? (
                        <TextInput 
                        style={[
                            styles.text,
                            styles.input, 
                            isCompleted ? styles.completedText : styles.uncompletedText
                        ]} 
                        value={toDoValue} 
                        multiline={true}
                        onChangeText={this._controlInput}
                        returnKeyType={"done"}
                        onBlur={this._finishEditing}
                        underlineColorAndroid={"transparent"}
                        />
                    ) : 
                    (<Text style={[
                        styles.text, 
                        isCompleted ? styles.completedText : styles.uncompletedText
                        ]}
                    >
                        {text}
                    </Text>
                    )}
                </View>
                    {isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._finishEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>
                                        <MaterialCommunityIcons size={30} name="checkbox-marked-outline"/>
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>
                                        <MaterialCommunityIcons size={30} name="pencil-box-outline"/>
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={(event) => {
                                event.stopPropagation; 
                                deleteToDo(id);
                                }}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>
                                        <MaterialCommunityIcons size={30} name="close-box-outline"/>
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>
        );
    }
    _toggleComplete = (event) => {
        event.stopPropagation();
        const { isCompleted, uncompleteToDo, completeToDo, id } = this.props;

        if (isCompleted) {
            uncompleteToDo(id);
        } else {
            completeToDo(id);
        }
    };

    _startEditing = (event) => {
        event.stopPropagation();
        this.setState({
            isEditing: true
        });
    };

    _finishEditing = (event) => {
        event.stopPropagation();
        const { toDoValue } = this.state;
        const { id, updateToDo } = this.props;
        updateToDo(id, toDoValue);
        this.setState({
            isEditing: false
        });
    };

    _controlInput = (text) => {
        this.setState({
            toDoValue : text
        });
    };
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 3,
        marginRight: 20
    },
    completedCircle : {
        borderColor: "#bbb"
    },
    uncompletedCircle : {
        borderColor: "red"
    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20
    },
    completedText : {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText : {

    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        width: width / 2
    },
    actions: {
        flexDirection: "row" 
    },
    actionContainer: {
        marginVertical: 7,
        marginHorizontal: 7
    },
    input: {
        width: width / 2,
        marginVertical: 19.5
    }
});