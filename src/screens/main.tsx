import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {studentService} from '../services/';
import {IStudent} from '../types';
import {FlatList} from 'react-native';
import {Modal, TextInput} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {hobbiesService} from '../services';

const Main = () => {
  const queryClient = useQueryClient();
  const [studentToAddHobby, setStudentToAddHobby] =
    React.useState<IStudent | null>(null);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [newHobby, setNewHobby] = React.useState('');
  const [isAddStudentModalVisible, setAddStudentModalVisible] =
    React.useState(false);
  const [newStudent, setNewStudent] = React.useState({
    firstName: '',
    email: '',
  });

  const {data, isLoading, error} = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getStudents(),
  });
  console.log(JSON.stringify(data, null, 2));

  const {mutate: addHobby, isPending} = useMutation({
    mutationFn: async (hobby: string) => {
      await hobbiesService.createHobby(studentToAddHobby?._id!, hobby);
    },
    onSuccess: () => {
      setModalVisible(false);
      setNewHobby('');
      queryClient.invalidateQueries({queryKey: ['students']});
    },
    onError: error => {
      console.error('Error adding hobby:', error);
    },
  });

  const handleSaveHobby = React.useCallback(() => {
    addHobby(newHobby);
    setModalVisible(false);
  }, [newHobby, addHobby]);

  const handleAddHobby = (student: IStudent) => {
    // Logic to add a hobby for the student with the given ID
    setStudentToAddHobby(student);
    setModalVisible(true);
  };

  const {mutate: addStudent, isPending: isAddingStudent} = useMutation({
    mutationFn: async (student: Omit<IStudent, '_id'>) => {
      await studentService.createStudent(student.firstName, student.email);
    },
    onSuccess: () => {
      setAddStudentModalVisible(false);
      setNewStudent({firstName: '', email: ''});
      queryClient.invalidateQueries({queryKey: ['students']});
    },
  });

  const handleSaveStudent = React.useCallback(() => {
    addStudent({firstName: newStudent.firstName, email: newStudent.email});
    setAddStudentModalVisible(false);
  }, [newStudent, addStudent]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => setAddStudentModalVisible(true)}
          style={[
            styles.button,
            {marginVertical: 10, maxWidth: 200, alignSelf: 'flex-end'},
          ]}>
          <Text style={[styles.buttonText, {textAlign: 'center'}]}>
            Add Student
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data?.getAllStudents as IStudent[]}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View style={styles.studentItem}>
            <Text style={styles.studentName}>{item.firstName}</Text>
            <Text style={styles.studentEmail}>{item.email}</Text>
            {item.hobbies && item.hobbies.length > 0 && (
              <View style={styles.hobbiesContainer}>
                {item.hobbies.map(hobby => (
                  <Text key={hobby._id} style={styles.hobby}>
                    {hobby.title}
                  </Text>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={styles.addHobbyButton}
              onPress={() => handleAddHobby(item)}>
              <Text style={styles.addHobbyButtonText}>Add Hobby</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
              Add a new hobby for {studentToAddHobby?.firstName}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter hobby"
              value={newHobby}
              onChangeText={setNewHobby}
              placeholderTextColor={'#333'}
              autoFocus={true}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 20,
              }}>
              <TouchableOpacity
                style={[styles.button, {flex: 1}]}
                onPress={handleSaveHobby}
                disabled={isPending || !newHobby}>
                <Text style={styles.buttonText}>Save Hobby</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.button,
                  {
                    backgroundColor: 'transparent',
                    borderColor: 'gray',
                    borderWidth: 1,
                    shadowColor: 'transparent',
                  },
                ]}>
                <Text style={[styles.buttonText, {color: 'gray'}]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Student Modal */}
      <Modal
        visible={isAddStudentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddStudentModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
              Add a new student
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={newStudent.firstName}
              placeholderTextColor={'#333'}

              onChangeText={text =>
                setNewStudent({...newStudent, firstName: text})
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor={'#333'}
              value={newStudent.email}
              onChangeText={text => setNewStudent({...newStudent, email: text})}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 20,
              }}>
              <TouchableOpacity
                style={[styles.button, {flex: 1}]}
                onPress={handleSaveStudent}
                disabled={
                  isAddingStudent || !newStudent.firstName || !newStudent.email
                }>
                <Text style={styles.buttonText}>Save Student</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAddStudentModalVisible(false)}
                style={[
                  styles.button,
                  {
                    backgroundColor: 'transparent',
                    borderColor: 'gray',
                    borderWidth: 1,
                    shadowColor: 'transparent',
                  },
                ]}>
                <Text style={[styles.buttonText, {color: 'gray'}]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  studentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hobby: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    margin: 2,
  },
  addHobbyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  addHobbyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    color: 'black',
  },
});

export default Main;
