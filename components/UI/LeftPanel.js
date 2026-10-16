"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useRouter, useSearchParams } from "next/navigation";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import ArticlesButton from "@/components/UI/Button";
import DebugPanel from "@/components/UI/DebugPanel";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";

const cardSx = {
    bgcolor: "game.card",
    backgroundImage: "none",
    fontSize: "0.875rem",
    border: 1,
    borderColor: "divider",
};
const contentSx = { p: 1, "&:last-child": { pb: 1 } };

export default function LeftPanelContent() {
    return (
        <Box sx={{ width: "100%" }}>
            <Card sx={cardSx}>
                <CardContent
                    sx={{ ...contentSx, display: "flex", flexWrap: "wrap" }}
                >
                    <GameMenuPrimaryButtonGroup
                        useStore={useStore}
                        type="GameMenu"
                        useRouter={useRouter}
                    />
                </CardContent>
            </Card>
            <PlayerDataPanel />
            <DebugPanel />
        </Box>
    );
}

export function useHandleStartGame() {
    const startGame = useSocketStore((state) => state.startGame);
    const gameState = useGameStore((state) => state.gameState);
    const setGameState = useGameStore((state) => state.setGameState);
    const setScore = useGameStore((state) => state.setScore);
    const setDistance = useGameStore((state) => state.setDistance);

    function handleStartGame(server, status) {
        if (server) {
            startGame(server, status || "In Progress");
        } else {
            setGameState({ ...gameState, status: status || "In Progress" });
            setScore(0);
            setDistance(0);
        }
    }
    return handleStartGame;
}

function PlayerDataPanel() {
    const searchParams = useSearchParams();
    const server = searchParams.get("server");
    const socket = useSocketStore((state) => state.socket);
    const playerLocation = useGameStore((state) => state.playerLocation);
    const players = useGameStore((state) => state.gameState.players);
    const score = useGameStore((state) => state.score);
    const distance = useGameStore((state) => state.distance);
    const timer = useGameStore((state) => state.gameState.timer);
    const status = useGameStore((state) => state.gameState.status);
    const handleStartGame = useHandleStartGame();

    return (
        <Card sx={cardSx}>
            <CardContent
                sx={{
                    ...contentSx,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: "0.25rem",
                    }}
                >
                    <Box sx={{ fontWeight: 700 }}>Status: {status}</Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
                        <AccessTimeIcon
                            fontSize="small"
                            sx={{ mr: "0.2rem" }}
                        />
                        {timer || 0}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.25rem",
                        width: "100%",
                        mb: "0.5rem",
                    }}
                >
                    <Chip
                        size="small"
                        label={`Score: ${score?.toFixed(0)}`}
                        sx={{ bgcolor: "#000", color: "#fff" }}
                    />
                    <Chip
                        size="small"
                        label={`Distance: ${distance?.toFixed(0)}`}
                        sx={{ bgcolor: "#000", color: "#fff" }}
                    />
                    <Chip
                        size="small"
                        label={`X: ${playerLocation?.x?.toFixed(0)}`}
                        sx={{ bgcolor: "#000", color: "#fff" }}
                    />
                    <Chip
                        size="small"
                        label={`Y: ${playerLocation?.y?.toFixed(0)}`}
                        sx={{ bgcolor: "#000", color: "#fff" }}
                    />
                </Box>
                {(status === "In Lobby" || status === "Game Over") && (
                    <ArticlesButton
                        variant="articles"
                        sx={{ width: "100%", mb: "0.5rem" }}
                        onClick={() => handleStartGame(server, "In Progress")}
                    >
                        <PlayArrowIcon
                            fontSize="small"
                            sx={{ mr: "0.2rem" }}
                        />
                        Start game
                    </ArticlesButton>
                )}
                <Box sx={{ border: 1, borderColor: "divider", mb: "0.5rem" }}>
                    {players?.map((player) => {
                        const isYou =
                            (!server && player.id === "local") ||
                            (server && socket?.id === player.id);
                        return (
                            <Box
                                key={player.id}
                                sx={{
                                    border: 1,
                                    borderColor: "divider",
                                    p: "0.5rem",
                                }}
                            >
                                <Box>
                                    {isYou ? "(You) " : ""}
                                    {player.nickname}
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: "0.65rem",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {player.id}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </CardContent>
        </Card>
    );
}
