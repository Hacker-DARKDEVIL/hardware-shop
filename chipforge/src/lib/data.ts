export interface Product {
  id: string;
  name: string;
  brand: string;
  brandColor: string;
  category: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  badge?: "new" | "popular" | "sale";
  description: string;
  specs: { key: string; value: string }[];
  image?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  { id: "mcu",      name: "Microcontrollers",   icon: "⚡", count: 142 },
  { id: "wireless", name: "Wireless Modules",    icon: "📡", count: 89  },
  { id: "sensors",  name: "Sensors & IMUs",      icon: "🔬", count: 214 },
  { id: "displays", name: "Displays & HMI",      icon: "🖥️", count: 67  },
  { id: "power",    name: "Power Management",    icon: "🔋", count: 98  },
  { id: "tools",    name: "Dev Tools & Probes",  icon: "🛠️", count: 55  },
];

export const PRODUCTS: Product[] = [
  {
    id: "esp32-s3-wroom",
    name: "ESP32-S3-WROOM-1",
    image: "https://docs.espressif.com/projects/esp-idf/en/latest/_images/esp32-s3-wroom-1-v1.1-front.png",
    brand: "Espressif",
    brandColor: "#00d4ff",
    category: "mcu",
    price: 380,
    inStock: true,
    badge: "new",
    rating: 4.8,
    reviewCount: 124,
    tags: ["wifi", "ble", "ai", "dual-core"],
    description:
      "Dual-core Xtensa LX7 with AI vector instructions, 512KB SRAM, USB OTG, and built-in 2.4GHz WiFi + BLE 5.",
    specs: [
      { key: "CPU",      value: "Xtensa LX7 × 2 @ 240MHz" },
      { key: "Flash",    value: "8MB / 16MB" },
      { key: "GPIO",     value: "45 pins" },
      { key: "Wireless", value: "WiFi 4 + BLE 5" },
    ],
  },
  {
    id: "stm32f407vgt6",
    name: "STM32F407VGT6",
    image: "https://www.st.com/bin/ecommerce/api/image.PF252144.en.feature-description-include-personalized-no-cpn-medium.jpg",
    brand: "STMicroelectronics",
    brandColor: "#ff3d6b",
    category: "mcu",
    price: 520,
    inStock: true,
    badge: "popular",
    rating: 4.6,
    reviewCount: 89,
    tags: ["arm", "cortex-m4", "fpu", "real-time"],
    description:
      "ARM Cortex-M4 with FPU, 1MB Flash, 192KB SRAM, USB OTG, SDIO, and rich peripheral set for real-time control.",
    specs: [
      { key: "CPU",   value: "Cortex-M4F @ 168MHz" },
      { key: "Flash", value: "1MB" },
      { key: "SRAM",  value: "192KB" },
      { key: "ADC",   value: "24ch, 12-bit" },
    ],
  },
  {
    id: "rpi-pico-2",
    name: "Raspberry Pi Pico 2",
    image: "https://www.raspberrypi.com/app/uploads/2024/08/Front-of-Pico-2-800-500.jpg",
    brand: "Raspberry Pi",
    brandColor: "#22c55e",
    category: "mcu",
    price: 420,
    inStock: true,
    badge: "new",
    rating: 4.9,
    reviewCount: 201,
    tags: ["riscv", "cortex-m33", "pio", "micropython"],
    description:
      "RP2350 dual Arm Cortex-M33 or RISC-V, 520KB SRAM, 4MB flash, and 48 GPIO pins with PIO state machines.",
    specs: [
      { key: "CPU",   value: "Cortex-M33 × 2 @ 150MHz" },
      { key: "Flash", value: "4MB QSPI" },
      { key: "GPIO",  value: "48 pins" },
      { key: "PIO",   value: "3 blocks, 12 SM" },
    ],
  },
  {
    id: "nrf52840-dk",
    name: "nRF52840 DK",
    image: "https://docs.nordicsemi.com/bundle/ug_nrf52840_dk/page/GUID-4AF1EB77-0547-4C47-B88E-0C59CF8F0B6A-en-US-1/images/nrf52840-dk-new.png",
    brand: "Nordic Semi",
    brandColor: "#7c3aed",
    category: "wireless",
    price: 3299,
    inStock: true,
    badge: "new",
    rating: 4.7,
    reviewCount: 45,
    tags: ["bluetooth", "thread", "zigbee", "trustzone"],
    description:
      "Full-featured development kit for nRF52840 SoC — Bluetooth 5.4, Thread, Zigbee, USB, and ARM TrustZone.",
    specs: [
      { key: "CPU",      value: "Cortex-M4F @ 64MHz" },
      { key: "Flash",    value: "1MB" },
      { key: "Wireless", value: "BT 5.4 / 802.15.4" },
      { key: "GPIO",     value: "48 pins" },
    ],
  },
  {
    id: "arduino-nano-every",
    name: "Arduino Nano Every",
    image: "https://store.arduino.cc/cdn/shop/files/ABX00028_01.front_860x645.jpg",
    brand: "Arduino",
    brandColor: "#00979d",
    category: "mcu",
    price: 699,
    inStock: true,
    rating: 4.4,
    reviewCount: 67,
    tags: ["arduino", "avr", "beginner", "5v"],
    description:
      "ATMega4809 based Nano with 48KB flash, 6KB SRAM, and form-factor compatible with original Nano.",
    specs: [
      { key: "CPU",   value: "ATMega4809 @ 20MHz" },
      { key: "Flash", value: "48KB" },
      { key: "SRAM",  value: "6KB" },
      { key: "GPIO",  value: "22 pins" },
    ],
  },
  {
    id: "nucleo-h743zi2",
    name: "NUCLEO-H743ZI2",
    image: "https://www.st.com/bin/ecommerce/api/image.PF268421.en.feature-description-include-personalized-no-cpn-medium.jpg",
    brand: "STMicroelectronics",
    brandColor: "#ff3d6b",
    category: "mcu",
    price: 4499,
    originalPrice: 4999,
    inStock: false,
    badge: "popular",
    rating: 4.8,
    reviewCount: 33,
    tags: ["stm32h7", "ethernet", "high-performance", "nucleio"],
    description:
      "High-performance STM32H7 Nucleo-144 board — Cortex-M7 @ 480MHz, Ethernet, Arduino & ST Morpho connectors.",
    specs: [
      { key: "CPU",    value: "Cortex-M7 @ 480MHz" },
      { key: "Flash",  value: "2MB dual-bank" },
      { key: "SRAM",   value: "1MB" },
      { key: "Extras", value: "Ethernet, USB OTG HS" },
    ],
  },
  {
    id: "bmi270-imu",
    name: "BMI270 IMU Module",
    image: "https://cdn11.bigcommerce.com/s-3fd3md1ghs/images/stencil/500x659/products/31289/24941/ES-12135_003__27076.1758355563.jpg",
    brand: "Bosch",
    brandColor: "#f59e0b",
    category: "sensors",
    price: 349,
    inStock: true,
    rating: 4.5,
    reviewCount: 28,
    tags: ["imu", "accelerometer", "gyroscope", "spi", "i2c"],
    description:
      "6-axis IMU with integrated 3-axis accelerometer and 3-axis gyroscope. Ultra-low power, SPI/I2C, designed for wearables.",
    specs: [
      { key: "Interface", value: "SPI / I2C" },
      { key: "Accel",     value: "±2/4/8/16g" },
      { key: "Gyro",      value: "±125–2000 dps" },
      { key: "Power",     value: "685 µA typical" },
    ],
  },
  {
    id: "ina226-power",
    name: "INA226 Power Monitor",
    image: "https://cdn11.bigcommerce.com/s-3fd3md1ghs/images/stencil/500x659/products/27726/20791/INA226-power-monitor-module__49085.jpg",
    brand: "Texas Instruments",
    brandColor: "#ef4444",
    category: "power",
    price: 199,
    inStock: true,
    rating: 4.6,
    reviewCount: 52,
    tags: ["power", "current", "voltage", "i2c", "monitor"],
    description:
      "High-side or low-side current/power monitor with I2C interface. 16-bit ADC, alert output, up to 36V bus voltage.",
    specs: [
      { key: "Interface", value: "I2C" },
      { key: "Bus V",     value: "0–36V" },
      { key: "Accuracy",  value: "16-bit ADC" },
      { key: "Package",   value: "SOT-23-8" },
    ],
  },
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "esp32-s3-wroom",
    author: "Arjun Mehta",
    rating: 5,
    title: "Incredible for ML edge inference",
    body: "Ran TensorFlow Lite on this without any issues. The vector extensions make a real difference for conv layers. Heat management is solid even at 240MHz.",
    date: "2025-04-12",
    verified: true,
  },
  {
    id: "r2",
    productId: "esp32-s3-wroom",
    author: "Divya Krishnan",
    rating: 5,
    title: "Best ESP32 variant yet",
    body: "USB OTG is a game changer for custom HID devices. Build quality feels solid. ChipForge shipping was incredibly fast — arrived in 2 days.",
    date: "2025-03-28",
    verified: true,
  },
  {
    id: "r3",
    productId: "esp32-s3-wroom",
    author: "Vikram S.",
    rating: 4,
    title: "Great chip, docs could be better",
    body: "Silicon is excellent. The Espressif documentation is a maze sometimes but the community support makes up for it. Would buy again.",
    date: "2025-02-15",
    verified: false,
  },
  {
    id: "r4",
    productId: "stm32f407vgt6",
    author: "Priya Nair",
    rating: 5,
    title: "The workhorse of embedded dev",
    body: "STM32F407 is battle-tested. For motor control and real-time applications nothing comes close at this price point. Rock solid.",
    date: "2025-04-02",
    verified: true,
  },
  {
    id: "r5",
    productId: "rpi-pico-2",
    author: "Rahul Sharma",
    rating: 5,
    title: "Pico 2 blows the original away",
    body: "RISC-V mode is experimental but fun. The Cortex-M33 performance uplift is massive. PIO is still the killer feature for custom protocols.",
    date: "2025-05-01",
    verified: true,
  },
];

/* ── MCU comparison rows ── */
export interface CompareRow {
  spec: string;
  esp32s3: string;
  stm32f407: string;
  rp2350: string;
  type?: "check" | "cross" | "text";
  checkFor?: ("esp32s3" | "stm32f407" | "rp2350")[];
  crossFor?: ("esp32s3" | "stm32f407" | "rp2350")[];
}

export const COMPARE_ROWS: CompareRow[] = [
  { spec: "Architecture",   esp32s3: "Xtensa LX7",         stm32f407: "Cortex-M4F",         rp2350: "Cortex-M33 / RISC-V" },
  { spec: "Max Clock",      esp32s3: "240 MHz",             stm32f407: "168 MHz",             rp2350: "150 MHz" },
  { spec: "SRAM",           esp32s3: "512 KB",              stm32f407: "192 KB",              rp2350: "520 KB" },
  { spec: "Flash",          esp32s3: "8–16 MB (ext)",       stm32f407: "1 MB",                rp2350: "4 MB QSPI" },
  { spec: "WiFi",           esp32s3: "✓ 802.11n built-in",  stm32f407: "✗ None",              rp2350: "✗ None (Pico W = yes)" },
  { spec: "BLE",            esp32s3: "✓ BLE 5.0",           stm32f407: "✗ None",              rp2350: "✗ None (Pico W = yes)" },
  { spec: "FPU",            esp32s3: "✗ No",                stm32f407: "✓ Yes",               rp2350: "✓ Yes (M33)" },
  { spec: "USB",            esp32s3: "OTG Full-Speed",       stm32f407: "OTG HS + FS",         rp2350: "USB 1.1 Device" },
  { spec: "ADC",            esp32s3: "20ch, 12-bit",         stm32f407: "24ch, 12-bit",        rp2350: "4ch, 12-bit" },
  { spec: "Price (unit)",   esp32s3: "₹380",                stm32f407: "₹520",                rp2350: "₹420" },
];

/* ── Ticker items ── */
export const TICKER_ITEMS = [
  { label: "ESP32-S3",          note: "In Stock" },
  { label: "STM32F4 Discovery", note: "₹1,299" },
  { label: "Raspberry Pi Pico 2", note: "In Stock" },
  { label: "Arduino Nano Every", note: "₹699" },
  { label: "nRF52840 DK",       note: "New Arrival" },
  { label: "CH343G USB UART",   note: "₹149" },
  { label: "ESP32-WROVER-IE",   note: "In Stock" },
  { label: "NUCLEO-H743ZI2",    note: "₹4,499" },
  { label: "BMI270 IMU",        note: "₹349" },
  { label: "INA226 Power Monitor", note: "₹199" },
];
