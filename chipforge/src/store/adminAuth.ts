import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthStore {
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
}

// Admin credentials — change these to your own secure values
const ADMIN_CREDENTIALS = {
  username: "admin@chipforge.dev",
  password: "ChipForge@Admin2025",
};

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      isLoading: false,

      adminLogin: async (username, password) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        if (
          username === ADMIN_CREDENTIALS.username &&
          password === ADMIN_CREDENTIALS.password
        ) {
          set({ isAdminAuthenticated: true, isLoading: false });
          return { success: true };
        }
        set({ isLoading: false });
        return { success: false, error: "Invalid admin credentials." };
      },

      adminLogout: () => set({ isAdminAuthenticated: false }),
    }),
    { name: "chipforge-admin-auth" }
  )
);
