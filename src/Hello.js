import {Button, StyleSheet, Text, Alert, TextInput, View} from 'react-native';
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

  const handleDel = id => {
    // console.log(id);

    Alert.alert('Delete Contact ?', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          firestore()
            .collection('Users')
            .doc(id)
            .delete()
            .then(() => {
              console.log('User deleted!');
            }),
      },
    ]);
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={{marginBottom: 20}}>
        <TextInput
          value={name}
          style={{height: 40, borderWidth: 1, padding: 10, marginBottom: 5}}
          onChangeText={e => handleOnChangeName(e)}
        />
        <Button title="write" onPress={() => writeData()} />
      </View>

      {data.map(e => (
        <View
          style={{
            marginVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          key={e.id}>
          <Text>
            {e.id} : {e.name} - {e.age}
          </Text>
          <Button color={'tomato'} title="X" onPress={() => handleDel(e.id)} />
        </View>
      ))}
    </View>
  );
};

export default Hello;

const styles = StyleSheet.create({});
