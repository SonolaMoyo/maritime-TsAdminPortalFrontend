import { Panel } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { demo } from "../data/mockData";

export function Sales() {
  const fmtMoney = (val: number) => "$" + val.toLocaleString();
  const maxSalesValue = Math.max(...demo.sales_pipeline.map(s => s.value), 1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Sales Pipeline</h1>
          <p className="text-text mt-2 max-w-[780px]">Monitor leads and conversion rates across different sales stages.</p>
        </div>
      </div>

      <Panel>
        <div className="grid gap-6 mt-2 max-w-3xl">
          {demo.sales_pipeline.map(stage => (
            <ProgressBar
              key={stage.stage}
              label={`${stage.stage} (${stage.count} leads)`}
              value={fmtMoney(stage.value)}
              percentage={(stage.value / maxSalesValue) * 100}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}
