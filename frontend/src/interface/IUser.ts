export interface UsersInterface {
  ID?: number;
  id?: number;

  first_name?: string;

  last_name?: string;

  email?: string;

  password?: string;

  age?: number;

  birthDay?: string;
  birthday?: string;

  gender_id?: number;
  gender?: {
    gender: string;
  };

  actor?: string;
}
