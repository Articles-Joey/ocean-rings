"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ArticlesButton from "./Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { useHandleStartGame } from "./LeftPanel";

export default function GameOverModal() {
    const handleStartGame = useHandleStartGame();
    const server = useSearchParams().get("server");
    const reloadScene = useStore((state) => state.reloadScene);
    const score = useGameStore((state) => state.score);
    const distance = useGameStore((state) => state.distance);

    return (
        <Dialog open fullWidth maxWidth="sm" scroll="paper" disableEscapeKeyDown aria-labelledby="game-over-title">
            <DialogTitle id="game-over-title">Game Over</DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                {!server && (
                    <Box sx={{ p: "1rem" }}>
                        <Box sx={{ mb: "0.25rem" }}>You had a score of {score}!</Box>
                        <Box>You traveled a distance of {distance.toFixed(0)} meters!</Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between" }}>
                <Link href="/">
                    <ArticlesButton variant="articles" onClick={() => useGameStore.getState().reset()}>Close</ArticlesButton>
                </Link>
                <ArticlesButton variant="articles" onClick={() => {
                    useGameStore.getState().reset();
                    handleStartGame(server, "In Lobby");
                    reloadScene();
                }}>Play Again</ArticlesButton>
            </DialogActions>
        </Dialog>
    );
}