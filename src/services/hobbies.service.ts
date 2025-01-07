import  GraphQLService  from './gql.service';
import { GET_HOBBIES } from '../gql/query';
import { CREATE_HOBBY } from '../gql/mutation';

export default class HobbiesService {
  constructor(private readonly graphqlService: GraphQLService) {}

  async getHobbies() {
    try {
      return this.graphqlService.run(GET_HOBBIES);
    } catch (error) {
      console.error('Error fetching hobbies:', error);
      throw error;
    }
  }

  async createHobby(studentId: string, title: string) {
    try {
      return this.graphqlService.run(CREATE_HOBBY, {studentId, title});
    } catch (error) {
      console.error('Error creating hobby:', error);
      throw error;
    }
  }
}
