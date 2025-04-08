declare module 'react-native-config' {
  interface Config {
    OPENAI_API_KEY?: string;
    [key: string]: string | undefined;
  }
  
  const Config: Config;
  export default Config;
} 