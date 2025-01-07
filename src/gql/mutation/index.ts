import {gql} from 'graphql-request';

export const CREATE_STUDENT = gql`
  mutation CreateStudent($firstName: String!, $email: String!) {
    createStudent(firstName: $firstName, email: $email) {
      _id
      firstName
      email
    }
  }
`;


export const CREATE_HOBBY = gql`
  mutation CreateHobbies($studentId: String!, $title: String!) {
    createHobbies(studentId: $studentId, title: $title) {
      _id
      title
    }
  }
`;
