import { TeamCard } from '../molecules/TeamCard';
import type { Teams } from '@/types/game';

const TEAM_COLORS = {
    BLUE: 'blue',
    RED: 'red',
} as const;

type TeamColor = (typeof TEAM_COLORS)[keyof typeof TEAM_COLORS];

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
