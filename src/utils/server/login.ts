import { z } from "zod";

type LoginRequest = {
  type: "login";
  data: {
    username: string;
    password: string;
  };
};

const LoginReponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

type LoginResponse = {
  type: "login";
  data: z.infer<typeof LoginReponseSchema>["access_token"];
};

/*
 * This function is used to make a POST request to the server to login a user with username and password
 * The password is hashed before it's sent to the server
 * The server responds with an access token, which is the string returned by this function
 *
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 * @returns {Promise<string>} - The access token
 */
const loginRequest = async (
  data: LoginRequest["data"]
): Promise<LoginResponse["data"]> => {
  // TODO: hash the password before sending it to the server
  const hashed_password = data.password;

  const body = JSON.stringify({
    username: data.username,
    password: hashed_password,
  });

  const response = await fetch(`http://localhost:9900/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": body.length.toString(),
    },
    body,
  });
  if (!response.ok) {
    throw new Error("Error logging in");
  }
  const res = await response.json();

  const parsed = LoginReponseSchema.safeParse(res);
  if (!parsed.success) {
    throw new Error("Invalid response");
  }
  return parsed.data.access_token;
};

export { type LoginRequest, type LoginResponse, loginRequest };
