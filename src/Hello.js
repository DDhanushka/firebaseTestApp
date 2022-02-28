import {
  Button,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const Hello = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [editId, setEditId] = useState('');

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

  const handleEdit = async id => {
    const user = await firestore().collection('Users').doc(id).get();
    setName(user.data().name);
    console.log(user.data().name);

    setEditId(id);
    setIsUpdate(true);
  };

  const update = () => {
    firestore()
      .collection('Users')
      .doc(editId)
      .update({
        name,
      })
      .then(() => {
        console.log('User updated!');
      });
    setName('');
    setIsUpdate(false);
    setEditId('');
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={{marginBottom: 20}}>
        <TextInput
          value={name}
          style={{height: 40, borderWidth: 1, padding: 10, marginBottom: 5}}
          onChangeText={e => handleOnChangeName(e)}
        />
        <Button
          title="Create"
          onPress={() => writeData()}
          disabled={isUpdate}
        />
        <Button title="Update" disabled={!isUpdate} onPress={() => update()} />
      </View>

      <ScrollView>
        {data.map(e => (
          <View
            style={{
              marginVertical: 5,
              justifyContent: 'space-between',
            }}
            key={e.id}>
            <Text style={{fontSize: 17, padding: 5}}>
              Name: {e.name} / Age: {e.age}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Button
                color={'tomato'}
                title="Delete"
                onPress={() => handleDel(e.id)}
              />
              <Button
                color={'orange'}
                title="Edit"
                onPress={() => handleEdit(e.id)}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Hello;

const styles = StyleSheet.create({});
