import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const Hello = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    return firestore()
      .collection('Users')
      .onSnapshot(querySnapshot => {
        const list = [];
        querySnapshot.forEach(doc => {
          const {age, name} = doc.data();
          list.push({
            id: doc.id,
            age,
            name,
          });
        });

        setData(list);
      });
  }, []);

  const writeData = () => {
    if (name == '') {
      alert('enter somthing');
    } else {
      firestore()
        .collection('Users')
        .add({
          name,
          age: 30,
        })
        .then(() => {
          console.log('User added!');
        });
      setName('');
    }
  };

  const handleOnChangeName = txt => {
    setName(txt);
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <TextInput
        value={name}
        style={{height: 40, borderWidth: 1, padding: 10}}
        onChangeText={e => handleOnChangeName(e)}
      />
      <Button title="write" onPress={() => writeData()} />

      {data.map(e => (
        <Text key={e.id}>
          {e.id} : {e.name} - {e.age}
        </Text>
      ))}
    </View>
  );
};

export default Hello;

const styles = StyleSheet.create({});
