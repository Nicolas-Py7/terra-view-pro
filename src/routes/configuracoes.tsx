import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Moon, Sun } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações · MeteoStation" },
      { name: "description", content: "Preferências do dashboard, intervalos de leitura e alertas climáticos." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const [interval, setInterval] = useState([10]);
  const [serverUrl, setServerUrl] = useState("https://api.meteostation.io/v1/ingest");
  const [apiKey, setApiKey] = useState("•••••••••••••••••");
  const [alerts, setAlerts] = useState({ rain: true, heat: true, wind: false });
  const [tempMax, setTempMax] = useState("32");
  const [light, setLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  const save = () => toast.success("Configurações salvas com sucesso");

  return (
    <Layout title="Configurações" subtitle="Preferências da estação e do dashboard">
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Aquisição de dados" desc="Intervalo entre leituras dos sensores">
          <div className="flex items-center justify-between">
            <Label>Intervalo de atualização</Label>
            <span className="text-sm font-medium text-primary">{interval[0]}s</span>
          </div>
          <Slider value={interval} onValueChange={setInterval} min={2} max={120} step={1} className="mt-3" />
          <p className="mt-2 text-xs text-muted-foreground">
            Recomendado entre 5s e 30s para uso em campo.
          </p>
        </Section>

        <Section title="Envio ao servidor" desc="Endpoint e chave de transmissão">
          <Label>URL do servidor</Label>
          <Input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} className="mt-1.5 bg-input/40" />
          <Label className="mt-3 block">Chave de API</Label>
          <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="mt-1.5 bg-input/40" />
        </Section>

        <Section title="Aparência" desc="Preferências do dashboard">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {light ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-accent" />}
              <div>
                <p className="text-sm font-medium">Tema {light ? "claro" : "escuro"}</p>
                <p className="text-xs text-muted-foreground">Alterna a paleta principal</p>
              </div>
            </div>
            <Switch checked={light} onCheckedChange={setLight} />
          </div>
        </Section>

        <Section title="Alertas climáticos" desc="Notificações automáticas">
          <Toggle label="Alerta de chuva intensa" value={alerts.rain} onChange={(v) => setAlerts({ ...alerts, rain: v })} />
          <Toggle label="Alerta de calor extremo" value={alerts.heat} onChange={(v) => setAlerts({ ...alerts, heat: v })} />
          <Toggle label="Alerta de vento forte" value={alerts.wind} onChange={(v) => setAlerts({ ...alerts, wind: v })} />
          <div className="mt-4">
            <Label>Limite de temperatura (°C)</Label>
            <Input value={tempMax} onChange={(e) => setTempMax(e.target.value)} className="mt-1.5 bg-input/40" />
          </div>
        </Section>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} className="gap-2">
          <Save className="h-4 w-4" /> Salvar configurações
        </Button>
      </div>
    </Layout>
  );
}

function Section({ title, desc, children }: any) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mb-4 text-xs text-muted-foreground">{desc}</p>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2.5 last:border-0">
      <span className="text-sm">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
