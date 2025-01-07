import GraphQLService from './gql.service';
import StudentService from './student.service';
import HobbiesService from './hobbies.service';

// A server has been set up for testing the app, so there's no need to create one.
// You can change the URL to point to your own server if desired.

const graphqlService = new GraphQLService(process.env.API_ENDPOINT! || 'https://api.ukpai.site/graphql');

const studentService = new StudentService(graphqlService);
const hobbiesService = new HobbiesService(graphqlService);

export {studentService, hobbiesService};
