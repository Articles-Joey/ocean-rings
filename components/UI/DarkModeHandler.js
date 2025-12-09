"use client"
import { useEffect } from "react";

import { useGameStore } from "@/hooks/useGameStore";

export default function DarkModeHandler({ children }) {

    // const theme = useEightBallStore(state => state.theme);
    const darkMode = useGameStore((state) => state.darkMode);

    useEffect(() => {

        if (darkMode == null) {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            useGameStore.getState().setDarkMode(prefersDark ? true : false);
        }

        if (darkMode) {
            document.body.setAttribute("data-bs-theme", 'dark');
        } else {
            document.body.setAttribute("data-bs-theme", 'light');
        }

    }, [darkMode]);

    return (
        <>
        </>
    );
}
