import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const Hello = () => {
  const [data, setData] = useState([]);

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
    firestore()
      .collection('Users')
      .add({
        name: 'Assss Lovelace',
        age: 30,
      })
      .then(() => {
        console.log('User added!');
      });
  };

  return (
    <View style={{flex: 1, padding: 20}}>
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
