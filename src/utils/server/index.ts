import { LoginRequest, LoginResponse, loginRequest } from "./login";

export const serverUrl = import.meta.env.VITE_APP_SERVER_URL;

type RequestType = LoginRequest;

type ResponseData = {
  login: LoginResponse["data"];
};

export const makeRequest = async (
  request: RequestType
): Promise<ResponseData[keyof ResponseData] | undefined> => {
  const { type, data } = request;
  switch (type) {
    case "login":
      return await loginRequest(data);
    default:
      return undefined;
  }
};
