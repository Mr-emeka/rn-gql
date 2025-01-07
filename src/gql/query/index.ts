import { gql } from 'graphql-request';

export const GET_STUDENT = gql`
  query GetStudent($id: ID!) {
    getStudent(id: $id) {
      _id
      firstName
      email
      hobbies {
        _id
        title
      }
    }
  }
`;

export const GET_HOBBIES = gql`
  query GetHobbies {
    getHobbies {
      _id
      title
    }
  }
`;


export const GET_ALL_STUDENTS = gql`
  query GetAllStudents {
    getAllStudents {
      _id
      firstName
      email
      hobbies {
        _id
        title
      }
    }
  }
`;
