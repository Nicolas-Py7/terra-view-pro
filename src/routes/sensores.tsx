import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, XCircle, Cpu } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Progress } from "@/components/ui/progress";
import { sensors } from "@/lib/mockData";

export const Route = createFileRoute("/sensores")({
  head: () => ({
    meta: [
      { title: "Sensores · MeteoStation" },
      { name: "description", content: "Status individual de cada sensor da estação meteorológica." },
    ],
  }),
  component: Sensors,
});

const statusBadge = (s: string) => {
  if (s === "online") return { Icon: CheckCircle2, color: "text-primary bg-primary/10", label: "Operacional" };
  if (s === "warning") return { Icon: AlertTriangle, color: "text-warning bg-warning/10", label: "Atenção" };
  return { Icon: XCircle, color: "text-destructive bg-destructive/10", label: "Offline" };
};

function Sensors() {
  return (
    <Layout title="Status dos sensores" subtitle="Monitoramento individual de hardware da estação">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sensors.map((s) => {
          const b = statusBadge(s.status);
          return (
            <div key={s.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                    <Cpu className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.metric}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${b.color}`}>
                  <b.Icon className="h-3 w-3" /> {b.label}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <Bar label="Tempo de atividade" value={s.uptime} suffix="%" />
                <Bar label="Qualidade do sinal" value={s.quality} suffix="%" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <Mini label="Última leitura" value="agora" />
                <Mini label="Alertas (24h)" value={s.status === "warning" ? "1" : "0"} />
              </div>

              {s.status === "warning" && (
                <div className="mt-3 rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs">
                  <p className="font-medium text-warning">Aviso</p>
                  <p className="text-muted-foreground">Variação fora da curva detectada nas últimas leituras. Verificar lente do sensor.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

function Bar({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}{suffix}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-2">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
