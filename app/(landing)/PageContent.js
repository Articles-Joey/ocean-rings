"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import ArticlesButton from "@/components/UI/Button";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import { useCharactersStore } from "@/hooks/useCharactersStore";
import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";

const LandingBackgroundAnimation = dynamic(
    () => import("@/components/Game/LandingBackgroundAnimation"),
    { ssr: false, loading: () => <p>Loading...</p> },
);
const Viewer = dynamic(() => import("@/components/UI/Viewer"), { ssr: false });

export default function OceanRingsGameLandingPage() {
    const darkMode = useStore((state) => state.darkMode);
    const character = useStore((state) => state.character);
    const setCharacter = useStore((state) => state.setCharacter);
    const characters = useCharactersStore((state) => state.characters);
    const [characterEdit, setCharacterEdit] = useState(false);

    return (
        <Box sx={{
            position: "relative",
            isolation: "isolate",
            "& .landing-page": {
                flexGrow: 1, display: "flex", justifyContent: "center",
                alignItems: "center", minHeight: "100vh",
            },
            "& .scoreboard": {
                my: "1rem", maxWidth: 300, width: "100%",
                "@media (min-width: 992px)": {
                    my: 0, display: "block", position: "absolute",
                    left: "1rem", top: "50%", transform: "translateY(-50%)",
                },
            },
            "& .servers": { display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
            "& .server": {
                p: "0.5rem", border: "1px solid rgba(0,0,0,0.25)",
                display: "flex", flexDirection: "column", alignItems: "center",
            },
            "& .ad-wrap": {
                mt: "1rem",
                "@media (min-width: 992px)": {
                    mt: 0, display: "block", position: "absolute",
                    right: "1rem", top: "50%", transform: "translateY(-50%)",
                },
            },
            "& .background-wrap": {
                position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1,
                "& img": { filter: darkMode ? "blur(2px) brightness(0.5)" : "blur(2px)" },
            },
        }}>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                Link={Link}
                useRouter={useRouter}
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                disableHero
                backgroundImage="/img/preview.webp"
                singlePlayerConfig={{ attachServerType: "single-player" }}
                NicknameInputConfig={{
                    PreComponent: (
                        <Box sx={{ flexShrink: 0, mr: "0.5rem" }}>
                            <Box sx={{ position: "relative", width: 50, height: 50, mb: "0.25rem" }}>
                                <Viewer scale={13} model={character.model} />
                            </Box>
                            <ArticlesButton small sx={{ width: "100%" }} onClick={() => setCharacterEdit(true)}>Edit</ArticlesButton>
                        </Box>
                    ),
                }}
                multiplayerConfig={{
                    type: "WebSocket", defaultServers: 2,
                    privateServerSupport: false, onlinePlayersTemplate: "2.0",
                }}
                CardOverride={characterEdit ? (
                    <Card sx={{ width: "20rem", maxWidth: "100%", mb: "1rem", bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider" }}>
                        <Box sx={{ p: "0.5rem 1rem", borderBottom: 1, borderColor: "divider" }}>Character Selector</Box>
                        <CardContent sx={{ p: "0.5rem" }}>
                            <Box sx={{ display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", mb: "0.5rem" }}>
                                {characters.map((item) => {
                                    const active = character.model === item.name;
                                    return (
                                        <Box
                                            key={item.name}
                                            component="button"
                                            type="button"
                                            aria-label={`Select ${item.name}`}
                                            aria-pressed={active}
                                            onClick={() => setCharacter({ ...character, model: item.name })}
                                            sx={{
                                                p: 0, bgcolor: "transparent", color: "inherit",
                                                border: active ? "2px solid #000" : "2px solid transparent",
                                                cursor: "pointer", transitionDuration: "200ms",
                                                "&:hover": {
                                                    transform: "scale(1.025)",
                                                    boxShadow: "0 0 0 1px rgba(0,0,0,0.25), 0 2px 3px rgba(0,0,0,0.2)",
                                                },
                                                "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
                                            }}
                                        >
                                            <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", "& > *": { position: "absolute", inset: 0, width: "100%", height: "100%" } }}>
                                                {active ? (
                                                    <Box><Viewer model={item.name} scale={15} /></Box>
                                                ) : (
                                                    <Box component="img" src={item.image} alt={item.name} sx={{ objectFit: "cover" }} />
                                                )}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </CardContent>
                        <CardActions sx={{ p: "0.5rem 1rem", borderTop: 1, borderColor: "divider", justifyContent: "center" }}>
                            <ArticlesButton sx={{ width: "50%" }} onClick={() => setCharacterEdit(false)}>
                                <ArrowBackIcon fontSize="small" sx={{ mr: "0.2rem" }} />Return
                            </ArticlesButton>
                            <ArticlesButton sx={{ width: "50%" }} onClick={() => setCharacterEdit(false)}>
                                <SaveIcon fontSize="small" sx={{ mr: "0.2rem" }} />Save
                            </ArticlesButton>
                        </CardActions>
                    </Card>
                ) : false}
                brandingTextClass="jaro-primary"
            />
        </Box>
    );
}