import { Panel } from "../components/ui/Card";

export function Reports() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start gap-5 mb-6">
        <div>
          <h1 className="text-[clamp(32px,4vw,52px)] leading-[0.95] tracking-[-0.06em] font-bold">Reports</h1>
          <p className="text-text mt-2 max-w-[780px]">Generate and download financial and operational reports.</p>
        </div>
      </div>

      <Panel>
        <p className="text-text">Reporting module is currently under development. Analytics and export tools will be available here.</p>
      </Panel>
    </div>
  );
}
