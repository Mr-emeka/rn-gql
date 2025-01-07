export interface IStudent {
    _id: string;
    firstName: string;
    email: string;
    hobbies?: IHobby[];
  }

  export interface IHobby {
    _id: string;
    title: string;
  }
