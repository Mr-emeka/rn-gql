import  GraphQLService  from './gql.service';
import { GET_ALL_STUDENTS, GET_STUDENT } from '../gql/query';
import { IStudent } from '../types';
import { CREATE_STUDENT } from '../gql/mutation';

export default class StudentService {
  constructor(private readonly graphqlService: GraphQLService) {}

  async getStudent(id: string) {
    try {
      return this.graphqlService.run(GET_STUDENT, {id});
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  async getStudents(): Promise<{getAllStudents: IStudent[]}> {
    try {
      return this.graphqlService.run(GET_ALL_STUDENTS);
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async createStudent(firstName: string, email: string) {
    try {
      return this.graphqlService.run(CREATE_STUDENT, {firstName, email});
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }
}
