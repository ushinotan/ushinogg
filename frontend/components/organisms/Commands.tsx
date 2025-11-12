import {Box, BoxContent, BoxDescription, BoxHeader, BoxTitle} from "@/components/atom/Box";
import {Terminal} from "lucide-react";

export default function Commands() {
  const commands = [
    {
      name: "/custom-game",
      description: "カスタムゲームを作成し、VCより参加者を取得することができます。自動チーム分けや参加者の選択が可能です。",
      usage: "/custom-game",
    },
    {
      name: "/history",
      description: "過去の試合履歴を表示します。個人統計やチーム成績を確認できます。",
      usage: "/history",
    },
  ];

  return (
    <div className="mb-12 mt-12">
      <h2 className="text-white text-center mb-4">
        コマンド一覧
      </h2>

      <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
        以下のスラッシュコマンドでBotを操作できます
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {commands.map((command, index) => (
          <Box key={index} className="bg-slate-800 border-slate-700">
            <BoxHeader>
              <div className="flex items-start gap-3">
                <Terminal className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <BoxTitle className="text-white mb-2">
                    <code className="bg-slate-900 px-3 py-1 rounded text-amber-400">
                      {command.name}
                    </code>
                  </BoxTitle>
                  <BoxDescription className="text-slate-400">
                    {command.description}
                  </BoxDescription>
                </div>
              </div>
            </BoxHeader>
            <BoxContent>
              <div className="space-y-2">
                <div>
                  <div className="text-slate-500 mb-1">使い方:</div>
                  <code className="text-green-400 bg-slate-900 px-2 py-1 rounded block">
                    {command.usage}
                  </code>
                </div>
              </div>
            </BoxContent>
          </Box>
        ))}
      </div>
    </div>
  );
}
