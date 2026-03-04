export const baseDeDatos = {
  // ── CAJA — primer elemento para que aparezca primero en la lista ──
  caja: [
    {
      id: 101, nombre: "Lian Li PC-O11 Dynamic", precio: 149, valoracion: 5,
      formato: "Mid Tower", material: "Aluminio",
      colorNombre: "Stealth Black",
      bodyColor: "#1a1f2e",
      accentColor: "#38bdf8",   // Azul neón (por defecto)
      accentColor2: "#818cf8",
    },
    {
      id: 102, nombre: "NZXT H9 Flow", precio: 169, valoracion: 5,
      formato: "Mid Tower", material: "Cristal",
      colorNombre: "Arctic White",
      bodyColor: "#2e3a4a",
      accentColor: "#e2e8f0",   // Blanco/plata
      accentColor2: "#94a3b8",
    },
    {
      id: 103, nombre: "Corsair iCUE 5000X", precio: 179, valoracion: 5,
      formato: "Mid Tower", material: "Cristal",
      colorNombre: "ROG Red",
      bodyColor: "#2a1a1a",
      accentColor: "#ef4444",   // Rojo gaming
      accentColor2: "#f97316",
    },
    {
      id: 104, nombre: "Fractal Design Torrent", precio: 189, valoracion: 5,
      formato: "Mid Tower", material: "Aluminio",
      colorNombre: "Emerald Green",
      bodyColor: "#0f1e14",
      accentColor: "#22c55e",   // Verde
      accentColor2: "#84cc16",
    },
    {
      id: 105, nombre: "be quiet! Dark Base 700", precio: 159, valoracion: 4,
      formato: "Mid Tower", material: "Acero",
      colorNombre: "Deep Purple",
      bodyColor: "#1a1428",
      accentColor: "#a855f7",   // Violeta
      accentColor2: "#ec4899",
    },
    {
      id: 106, nombre: "Thermaltake Tower 900", precio: 299, valoracion: 4,
      formato: "Full Tower", material: "Cristal",
      colorNombre: "Amber Gold",
      bodyColor: "#1e1a0e",
      accentColor: "#f59e0b",   // Dorado
      accentColor2: "#fcd34d",
    },
  ],

  procesador: [
    { id: 1, nombre: "Intel Core i9-14900K", precio: 560, valoracion: 5, tdp: "125W", socket: "LGA1700" },
    { id: 2, nombre: "Intel Core i5-14600K", precio: 310, valoracion: 5, tdp: "125W", socket: "LGA1700" },
    { id: 3, nombre: "AMD Ryzen 9 7950X",    precio: 580, valoracion: 5, tdp: "170W", socket: "AM5" },
    { id: 4, nombre: "AMD Ryzen 5 7600X",    precio: 230, valoracion: 4, tdp: "105W", socket: "AM5" },
  ],
  grafica: [
    { id: 5, nombre: "NVIDIA RTX 4090",    precio: 1650, valoracion: 5, vram: "24GB", potencia: "450W" },
    { id: 6, nombre: "NVIDIA RTX 4070 Ti", precio: 780,  valoracion: 5, vram: "12GB", potencia: "285W" },
    { id: 7, nombre: "AMD RX 7900 XTX",   precio: 900,  valoracion: 5, vram: "24GB", potencia: "355W" },
    { id: 8, nombre: "AMD RX 7600",        precio: 290,  valoracion: 4, vram: "8GB",  potencia: "165W" },
  ],
  ram: [
    { id: 9,  nombre: "Corsair Dominator 32GB DDR5", precio: 210, valoracion: 5, velocidad: "5600MHz" },
    { id: 10, nombre: "G.Skill Trident 16GB DDR5",   precio: 110, valoracion: 5, velocidad: "6000MHz" },
    { id: 11, nombre: "Kingston Fury 32GB DDR4",      precio: 140, valoracion: 4, velocidad: "3600MHz" },
    { id: 12, nombre: "Corsair Vengeance 16GB DDR4",  precio: 80,  valoracion: 4, velocidad: "3200MHz" },
  ],
  placaBase: [
    { id: 13, nombre: "ASUS ROG Maximus Z790",  precio: 590, valoracion: 5, chipset: "Z790",  formato: "ATX" },
    { id: 14, nombre: "MSI MEG Z790 ACE",        precio: 480, valoracion: 5, chipset: "Z790",  formato: "ATX" },
    { id: 15, nombre: "ASUS ROG Strix B650-E",   precio: 280, valoracion: 5, chipset: "B650E", formato: "ATX" },
    { id: 16, nombre: "MSI PRO B550-A PRO",       precio: 130, valoracion: 4, chipset: "B550",  formato: "ATX" },
  ],
  fuente: [
    { id: 17, nombre: "Corsair HX1000 Platinum",    precio: 210, valoracion: 5, eficiencia: "80+ Platinum", potencia: "1000W" },
    { id: 18, nombre: "be quiet! Dark Power 850W",   precio: 175, valoracion: 5, eficiencia: "80+ Titanium", potencia: "850W"  },
    { id: 19, nombre: "Seasonic Focus GX-750",        precio: 120, valoracion: 5, eficiencia: "80+ Gold",     potencia: "750W"  },
    { id: 20, nombre: "EVGA SuperNOVA 650W",          precio: 95,  valoracion: 4, eficiencia: "80+ Gold",     potencia: "650W"  },
  ],
  almacenamiento: [
    { id: 21, nombre: "Samsung 990 Pro 2TB NVMe",   precio: 195, valoracion: 5, velocidad: "7450 MB/s", interfaz: "PCIe 4.0"  },
    { id: 22, nombre: "WD Black SN850X 1TB",         precio: 130, valoracion: 5, velocidad: "7300 MB/s", interfaz: "PCIe 4.0"  },
    { id: 23, nombre: "Seagate Barracuda 2TB HDD",   precio: 65,  valoracion: 4, velocidad: "200 MB/s",  interfaz: "SATA III"  },
    { id: 24, nombre: "Kingston NV2 1TB NVMe",        precio: 75,  valoracion: 4, velocidad: "3500 MB/s", interfaz: "PCIe 4.0"  },
  ],
};

export const CATEGORY_LABELS = {
  caja:          "Case",
  procesador:    "CPU",
  grafica:       "GPU",
  ram:           "RAM",
  placaBase:     "Motherboard",
  fuente:        "PSU",
  almacenamiento: "Storage",
};

export const CATEGORY_ICONS = {
  caja:          "⬜",
  procesador:    "⬡",
  grafica:       "▬",
  ram:           "▮",
  placaBase:     "⊞",
  fuente:        "⚡",
  almacenamiento: "▤",
};

export const SPEC_KEYS = {
  caja:          ["formato", "material", "colorNombre"],
  procesador:    ["tdp", "socket"],
  grafica:       ["vram", "potencia"],
  ram:           ["velocidad"],
  placaBase:     ["chipset", "formato"],
  fuente:        ["eficiencia", "potencia"],
  almacenamiento: ["velocidad", "interfaz"],
};