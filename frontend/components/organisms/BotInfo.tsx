import {ArrowRight, Bot} from "lucide-react";
import {Button} from "@/components/atom";

export default function BotInfo() {
  const handleAddBot = () => {
    // Discord OAuth2 URLにリダイレクト
    // 実際のURLは: https://discord.com/oauth2/authorize?client_id=1428765945672761395
    window.open('https://discord.com/oauth2/authorize?client_id=1428765945672761395', '_blank');
  };

  return (
    <div className="text-center mb-20">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-500 to-blue-600 rounded-full mb-6">
        <Bot className="w-12 h-12 text-white" />
      </div>

      <h1 className="text-white mb-4">
        UshinoGG Bot
      </h1>

      <p className="text-slate-300 max-w-2xl mx-auto mb-8">
        League of Legendsのカスタムゲームを簡単に管理。<br/>
        自動チーム分け、試合記録の機能で、カスタムマッチの運営を効率化します。
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={handleAddBot}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
        >
          サーバーに追加
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  )

}
