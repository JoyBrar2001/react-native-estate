import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";
import { openAuthSessionAsync } from "expo-web-browser";
import * as Linking from "expo-linking";


export const config = {
  platform: "com.joy.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  project_id: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.project_id!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) {
      throw new Error("Failed to Login");
    }

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success") {
      throw new Error("Failed to Login");
    }

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) {
      throw new Error("Failed to Login");
    }

    const session = await account.createSession(userId, secret);

    if (!session) {
      throw new Error("Failed to create a session");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const response = await account.get();

    if (response.$id){
      const userAvatar = avatar.getInitials(response.name);
      
      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}