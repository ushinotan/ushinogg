import {Gamepad2, TrendingUp} from "lucide-react";
import {Box, BoxContent, BoxDescription, BoxHeader, BoxTitle} from "@/components/atom/Box";

export default function Features() {
  const features = [
    {
      id: "auto-team-division",
      icon: Gamepad2,
      title: "自動チーム分け",
      description: "内部MMRやランクを考慮した公平なチーム分け。手動調整も可能で、バランスの取れた試合を実現。",
    },
    {
      id: "match-recording",
      icon: TrendingUp,
      title: "試合記録",
      description: "試合結果の記録と統計。個人・チーム成績の閲覧。",
    },
  ];

  return (
    <div>
      <h2 className="text-white text-center mb-12">
        主な機能
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Box key={feature.id} className="bg-slate-800 border-slate-700 hover:border-amber-600 transition-colors">
            <BoxHeader>
              <feature.icon className="w-10 h-10 text-amber-400 mb-3" />
              <BoxTitle className="text-white">{feature.title}</BoxTitle>
            </BoxHeader>
            <BoxContent>
              <BoxDescription className="text-slate-400">
                {feature.description}
              </BoxDescription>
            </BoxContent>
          </Box>
        ))}
      </div>
    </div>
  );
}
