interface RegisterData {
    name: string;
    email: string;
    password: string;
  }
  
  interface LoginData {
    email: string;
    password: string;
  }

  export { RegisterData, LoginData };