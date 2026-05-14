import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Thermometer,
  Droplets,
  Sprout,
  Gauge,
  Sun,
  CloudRain,
  Activity,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { generateLive, generateSeries } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · MeteoStation" },
      { name: "description", content: "Monitoramento climático em tempo real da estação meteorológica inteligente." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [live, setLive] = useState(() => generateLive());
  const [mounted, setMounted] = useState(false);
  const series = useMemo(() => generateSeries(24), []);

  useEffect(() => {
    setMounted(true);
    setLive(generateLive());
    const id = setInterval(() => setLive(generateLive()), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Layout title="Dashboard climático" subtitle="Monitoramento em tempo real · Estação MeteoStation #001">
      {/* Status bar */}
      <div className="glass mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <Activity className="h-5 w-5 text-primary" />
            <span className="absolute inset-0 rounded-xl pulse-ring" />
          </div>
          <div>
            <p className="text-sm font-semibold">Estação operando normalmente</p>
            <p className="text-xs text-muted-foreground">6 sensores ativos · 0 alertas críticos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Última atualização <span className="font-medium text-foreground">{mounted ? live.time : "--:--"}</span>
        </div>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard icon={Thermometer} label="Temperatura" value={live.temperature} unit="°C" trend="+0.4°" />
        <MetricCard icon={Droplets} label="Umidade do ar" value={live.humidity} unit="%" trend="-2%" accent="accent" />
        <MetricCard icon={Sprout} label="Umidade do solo" value={live.soilHumidity} unit="%" trend="+1%" accent="primary" />
        <MetricCard icon={Gauge} label="Pressão" value={live.pressure} unit="hPa" trend="estável" accent="accent" />
        <MetricCard icon={Sun} label="Luminosidade" value={live.light} unit="lux" trend="alta" accent="warning" />
        <MetricCard icon={CloudRain} label="Chuva" value={live.rain} unit="mm" trend="leve" accent="accent" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Temperatura & Umidade · 24h</h3>
              <p className="text-xs text-muted-foreground">Leituras em intervalos de 1h</p>
            </div>
            <div className="flex gap-3 text-xs">
              <Legend color="var(--color-chart-1)" label="Temperatura" />
              <Legend color="var(--color-chart-2)" label="Umidade" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="temperature" stroke="var(--color-chart-1)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="humidity" stroke="var(--color-chart-2)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-1 text-sm font-semibold">Resumo do dia</h3>
          <p className="mb-4 text-xs text-muted-foreground">Condições gerais</p>
          <div className="space-y-3">
            <SummaryRow label="Mín. temperatura" value="21.4°C" />
            <SummaryRow label="Máx. temperatura" value="29.8°C" />
            <SummaryRow label="Pico de luz" value="982 lux" />
            <SummaryRow label="Total chuva" value="3.2 mm" />
            <SummaryRow label="Pressão média" value="1014 hPa" />
            <SummaryRow label="Umidade média" value="68%" />
          </div>
          <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs">
            <p className="font-medium text-primary">Condição atual</p>
            <p className="mt-1 text-muted-foreground">
              Céu parcialmente nublado com chance leve de pancadas isoladas no fim da tarde.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold">Pressão atmosférica</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={["dataMin-2", "dataMax+2"]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="pressure" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold">Volume de chuva (mm)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="rain" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}

const tooltipStyle = {
  background: "oklch(0.2 0.04 250 / 0.95)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-foreground)",
};

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2 text-xs last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
