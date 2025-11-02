import { TeamCard } from '../molecules/TeamCard';
import type { Teams, TeamColor } from '@/types/game';
import { TEAM_COLORS } from '@/lib/const';

interface TeamDisplayProps {
    teams: Teams;
    onRecordResult: (winner: TeamColor) => void;
}

export function TeamDisplay({ teams, onRecordResult }: TeamDisplayProps) {
    return (
        <div className="space-y-4">
            <TeamCard
                teamName="ブルーチーム"
                players={teams.blue}
                teamColor={TEAM_COLORS.BLUE}
                onWin={() => onRecordResult(TEAM_COLORS.BLUE)}
            />
            <TeamCard
                teamName="レッドチーム"
                players={teams.red}
                teamColor={TEAM_COLORS.RED}
                onWin={() => onRecordResult(TEAM_COLORS.RED)}
            />
        </div>
    );
}
