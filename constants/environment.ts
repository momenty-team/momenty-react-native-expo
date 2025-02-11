const ERROR = {
  ENV_VARIABLE_UNDEFINED: (key: string) =>
    `환경변수 ${key}가 process.env에 존재하지만 값이 undefined입니다.`,
  ENV_VARIABLE_NOT_FOUND: (key: string) => `환경변수 ${key}가 process.env에 존재하지 않습니다.`,
};

const getEnvVariables = (key: string) => {
  try {
    if (key in process.env) {
      if (process.env[key] !== undefined) {
        return process.env[key] as string;
      }

      throw new Error(ERROR.ENV_VARIABLE_UNDEFINED(key));
    }

    throw new Error(ERROR.ENV_VARIABLE_NOT_FOUND(key));
  } catch (error) {
    console.error(error);

    return 'http://192.168.0.18:3000';
  }
};

const ENV_KEY_NAME_LIST = {
  WEBVIEW_BASE_URL: 'EXPO_PUBLIC_WEBVIEW_BASE_URL',
} as const;

export const WEBVIEW_BASE_URL = getEnvVariables(ENV_KEY_NAME_LIST.WEBVIEW_BASE_URL);
