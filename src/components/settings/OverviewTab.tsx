import { Settings, Building2, Bell, Package, LayoutGrid, Globe } from "lucide-react";

interface OverviewTabProps {
  onSelect: (section: string) => void;
}

export function OverviewTab({ onSelect }: OverviewTabProps) {
  const cards = [
    {
      id: "General",
      title: "General",
      description: "Portal behaviour and general application preferences",
      icon: Settings,
    },
    {
      id: "Company & Contact",
      title: "Company & Contact",
      description: "Manage company identity and public contact information",
      icon: Building2,
    },
    {
      id: "Notifications",
      title: "Notifications",
      description: "Configure system and operational notifications",
      icon: Bell,
    },
    {
      id: "Inventory",
      title: "Inventory",
      description: "Configure stock thresholds and inventory alerts",
      icon: Package,
    },
    {
      id: "Segments",
      title: "Segments",
      description: "Manage business segment configuration",
      icon: LayoutGrid,
    },
    {
      id: "Portal Configuration",
      title: "Portal Configuration",
      description: "Configure general public portal behaviour",
      icon: Globe,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div 
          key={card.id}
          className="bg-white border border-line rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
          onClick={() => onSelect(card.id)}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-[#f4f7f4] rounded-xl flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
              <card.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-ink mb-1">{card.title}</h3>
              <p className="text-[#5b6671] text-sm leading-relaxed">{card.description}</p>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-line">
            <span className="text-brand-green font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Manage <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
