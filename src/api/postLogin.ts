import type { LoginPost, LoginResponse } from '@/types/Login'
import { httpBackend } from '@/lib/utils'
import { UserStore } from '@/store/userStore'



export async function postLogin(values: LoginPost): Promise<LoginResponse> {
  try {
    const data = await httpBackend<LoginResponse>('/api/login', 'POST', values, false);
    storeUserInfo(data);
    return data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    const errorMessage = error.message;
    throw new Error(errorMessage);
  }

  function storeUserInfo(data: LoginResponse) {
    localStorage.setItem('token', data.token);
    const userStore = UserStore();
    userStore.resetStore();
    userStore.username = data.user.username;
    userStore.xp = data.user.xp;
    if (data.user.picture) {
      userStore.profilePicture = data.user.picture;
    }
  }
}
