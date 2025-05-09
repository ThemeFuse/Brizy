export interface SignIn {
  password: string;
  email: string;
}

export interface SignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
