import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useEffect, useReducer, useState } from "react";
import { initialState, NotasReducers } from "./src/Reducers/Nota";
import { Button, Icon, Input } from "@rneui/base";
import { ADD_NOTAS, ADD_ALl_NOTAS, DELETD_NOTAS } from "./src/Action/Notas";

import AsyncStorage from "@react-native-async-storage/async-storage";
const MY_NOTAS_Key = "@MyNotasKey";

import { v4 as uuidv4 } from "uuid";
export default function App() {
  const [state, dispatch] = useReducer(NotasReducers, initialState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const nota = {};
  const saveNote = () => {
    nota.title = title;
    nota.description = description;
    nota.id = new Date().getTime()
    dispatch({ type: ADD_NOTAS, payload: nota });
    saveMemori(nota);
    setTitle("");
    setDescription("");
  };

  const saveMemori = async (nota) => {
    const currentSavedNotas = await AsyncStorage.getItem(MY_NOTAS_Key);
    try {
      if (currentSavedNotas !== null) {
        const currentSavedNotaParse = JSON.parse(currentSavedNotas);
        currentSavedNotaParse.push([nota]);
        await AsyncStorage.setItem(
          MY_NOTAS_Key,
          JSON.stringify(currentSavedNotaParse)
        );
        console.log(currentSavedNotas);
        return Promise.resolve();
      }
      await AsyncStorage.setItem(MY_NOTAS_Key, JSON.stringify([nota]));
      console.log(currentSavedNotas);
    } catch (error) {
      console.error(error);
    }
  };

  const douwnloadNotas = async () => {
    try {
      const currentSavedNotas = await AsyncStorage.getItem(MY_NOTAS_Key);
      const currentSavedNotaParse = JSON.parse(currentSavedNotas);
      console.log(currentSavedNotaParse);
      if (!currentSavedNotas) {
        return;
      }
      dispatch({ type: ADD_ALl_NOTAS, payload: currentSavedNotaParse });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
  
    douwnloadNotas();
  }, []);
  const deletdNotas = (id) => {
    console.log(id);
    dispatch({ type: DELETD_NOTAS, payload: id });
  };
  return (
    <View style={styles.container}>
      <Text>Notas</Text>
      <Input
        placeholder="titulo"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Input
        placeholder="text"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Button title="SubirData" onPress={saveNote} />

      <ScrollView>
        {state?.notas.map((nota) => (
          <View key={nota.id} style={styles.nota}>
            <Text style={styles.notaTitle}>{nota.title}</Text>
            <Text style={styles.notaDescription}>{nota.description}</Text>
            <Button
              icon={<Icon name="delete" />}
              onPress={()=>deletdNotas(nota.id)}
              type="clear"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  nota: { backgroundColor: "rgba(0,0,0,0.5)", marginVertical: 12 },
  notaTitle: {
    color: "white",
    fontWeight: "700",
    fontSize: 25,
    textAlign: "center",
  },
  notaDescription: {
    color: "white",
    fontWeight: "200",
    fontSize: 15,
    textAlign: "center",
  },
});
