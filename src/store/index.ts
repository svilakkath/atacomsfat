import {create} from 'zustand';

type UserStore = {
  uid: string | null;
  setUser: (uid: string) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>(set => ({
  uid: null,
  setUser: uid =>
    set(() => ({
      uid: uid,
    })),
  clearUser: () =>
    set(() => ({
      uid: null,
    })),
}));
