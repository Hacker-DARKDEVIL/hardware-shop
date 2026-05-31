import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: { name: string; qty: number; price: number }[];
  total: number;
  trackingId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  orders: Order[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const MOCK_USERS: { user: User; password: string }[] = [
  { user: { id: "u1", name: "Arjun Mehta", email: "arjun@example.com" }, password: "password123" },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "CF-10042",
    date: "2025-05-20",
    status: "delivered",
    items: [
      { name: "ESP32-S3-WROOM-1", qty: 3, price: 380 },
      { name: "BMI270 IMU Module", qty: 2, price: 349 },
    ],
    total: 1838,
    trackingId: "DTDC9823741",
  },
  {
    id: "CF-10031",
    date: "2025-04-11",
    status: "delivered",
    items: [{ name: "nRF52840 DK", qty: 1, price: 3299 }],
    total: 3299,
    trackingId: "DTDC8811222",
  },
  {
    id: "CF-10018",
    date: "2025-03-02",
    status: "delivered",
    items: [
      { name: "STM32F407VGT6", qty: 5, price: 520 },
      { name: "INA226 Power Monitor", qty: 5, price: 199 },
    ],
    total: 3595,
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 900));
        const found = MOCK_USERS.find(
          (u) => u.user.email === email && u.password === password
        );
        if (found) {
          set({ user: found.user, orders: MOCK_ORDERS, isLoading: false });
          return { success: true };
        }
        set({ isLoading: false });
        return { success: false, error: "Invalid credentials. Try arjun@example.com / password123" };
      },

      signup: async (name, email, _password) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 900));
        const newUser: User = { id: `u_${Date.now()}`, name, email };
        set({ user: newUser, orders: [], isLoading: false });
        return { success: true };
      },

      logout: () => set({ user: null, orders: [] }),
    }),
    { name: "chipforge-auth" }
  )
);
