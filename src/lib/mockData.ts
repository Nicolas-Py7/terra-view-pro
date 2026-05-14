export type Reading = {
  time: string;
  temperature: number;
  humidity: number;
  soilHumidity: number;
  pressure: number;
  light: number;
  rain: number;
};

const rand = (min: number, max: number, dec = 1) =>
  Number((Math.random() * (max - min) + min).toFixed(dec));

export function generateLive(): Reading {
  const d = new Date();
  return {
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    temperature: rand(22, 30),
    humidity: rand(50, 85),
    soilHumidity: rand(35, 75),
    pressure: rand(1008, 1020),
    light: rand(300, 950, 0),
    rain: rand(0, 4, 1),
  };
}

export function generateSeries(points = 24): Reading[] {
  const arr: Reading[] = [];
  const now = Date.now();
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now - i * 60 * 60 * 1000);
    arr.push({
      time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      temperature: rand(20, 31),
      humidity: rand(45, 90),
      soilHumidity: rand(30, 80),
      pressure: rand(1005, 1022),
      light: rand(0, 1000, 0),
      rain: rand(0, 6, 1),
    });
  }
  return arr;
}

export function generateHistory(days = 60): (Reading & { date: string })[] {
  const arr: (Reading & { date: string })[] = [];
  const now = Date.now();
  for (let i = 0; i < days; i++) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    arr.push({
      date: d.toISOString().slice(0, 10),
      time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      temperature: rand(18, 32),
      humidity: rand(40, 92),
      soilHumidity: rand(25, 85),
      pressure: rand(1000, 1025),
      light: rand(0, 1000, 0),
      rain: rand(0, 25, 1),
    });
  }
  return arr;
}

export function generateForecast(days = 7) {
  const labels = ["Hoje", "Amanhã", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  return Array.from({ length: days }).map((_, i) => ({
    day: labels[i] ?? `D+${i}`,
    min: rand(17, 22),
    max: rand(26, 33),
    rain: rand(0, 80, 0),
    condition: ["Ensolarado", "Parcial", "Nublado", "Chuva leve", "Tempestade"][
      Math.floor(Math.random() * 5)
    ],
  }));
}

export const sensors = [
  { id: "temp", name: "Termômetro DHT22", metric: "Temperatura", status: "online", uptime: 99.8, quality: 96 },
  { id: "hum", name: "Higrômetro DHT22", metric: "Umidade do ar", status: "online", uptime: 99.6, quality: 94 },
  { id: "soil", name: "Sensor capacitivo v2", metric: "Umidade do solo", status: "online", uptime: 97.2, quality: 88 },
  { id: "press", name: "BMP280", metric: "Pressão atmosférica", status: "online", uptime: 99.9, quality: 99 },
  { id: "lux", name: "BH1750", metric: "Luminosidade", status: "warning", uptime: 92.1, quality: 74 },
  { id: "rain", name: "Pluviômetro tipping-bucket", metric: "Chuva (mm)", status: "online", uptime: 98.4, quality: 91 },
] as const;
