"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ReplayIcon from "@mui/icons-material/Replay";
import BugReportIcon from "@mui/icons-material/BugReport";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArticlesButton from "@/components/UI/Button";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";

const cardSx = {
    bgcolor: "game.card",
    backgroundImage: "none",
    fontSize: "0.875rem",
    border: 1,
    borderColor: "divider",
};
const contentSx = { p: 1, "&:last-child": { pb: 1 } };

function ButtonDropdown({ id, label, Icon, children }) {
    const [anchorElement, setAnchorElement] = useState(null);
    const isOpen = Boolean(anchorElement);

    const closeMenu = () => {
        setAnchorElement(null);
    };

    return (
        <>
            <ArticlesButton
                aria-controls={isOpen ? id : undefined}
                aria-expanded={isOpen ? "true" : undefined}
                aria-haspopup="menu"
                endIcon={<KeyboardArrowDownIcon />}
                fullWidth
                id={`${id}-button`}
                onClick={(event) => {
                    setAnchorElement(event.currentTarget);
                }}
                size="small"
                startIcon={<Icon fontSize="small" />}
                sx={{
                    justifyContent: "flex-start",
                    "& .MuiButton-endIcon": {
                        marginLeft: "auto",
                    },
                }}
                variant="contained"
            >
                {label}
            </ArticlesButton>
            <Menu
                anchorEl={anchorElement}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                id={id}
                marginThreshold={0}
                onClose={closeMenu}
                open={isOpen}
                slotProps={{
                    list: {
                        "aria-labelledby": `${id}-button`,
                        style: { margin: 0, padding: 0 },
                    },
                    paper: {
                        sx: { maxHeight: 600, margin: 0, width: 200 },
                    },
                }}
                transformOrigin={{ horizontal: "left", vertical: "top" }}
            >
                {children(closeMenu)}
            </Menu>
        </>
    );
}

export default function DebugPanel() {
    const setShowMenu = useStore((state) => state.setShowMenu);
    const reloadScene = useStore((state) => state.reloadScene);
    const debug = useStore((state) => state.debug);
    const setDebug = useStore((state) => state.setDebug);
    const cameraMode = useGameStore((state) => state.cameraMode);
    const setCameraMode = useGameStore((state) => state.setCameraMode);

    if (!debug) return null;

    return (
        <Card sx={cardSx}>
            <CardContent sx={contentSx}>
                <Box sx={{ fontSize: "0.875em" }}>Debug Controls</Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex" }}>
                        <ArticlesButton
                            small
                            sx={{ width: "50%" }}
                            onClick={reloadScene}
                        >
                            <ReplayIcon
                                fontSize="small"
                                sx={{ mr: "0.2rem" }}
                            />
                            Reload Game
                        </ArticlesButton>
                        <ArticlesButton
                            small
                            sx={{ width: "50%" }}
                            onClick={() => {}}
                        >
                            <ReplayIcon
                                fontSize="small"
                                sx={{ mr: "0.2rem" }}
                            />
                            Reset Camera
                        </ArticlesButton>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <ButtonDropdown
                                id="debug-mode-menu"
                                label={`Debug ${debug ? "On" : "Off"}`}
                                Icon={BugReportIcon}
                            >
                                {(closeMenu) =>
                                    [false, true].map((value) => (
                                        <MenuItem
                                            key={String(value)}
                                            selected={debug === value}
                                            onClick={() => {
                                                closeMenu();
                                                setDebug(value);
                                            }}
                                        >
                                            {value ? "True" : "False"}
                                        </MenuItem>
                                    ))
                                }
                            </ButtonDropdown>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <ButtonDropdown
                                id="camera-mode-menu"
                                label="Camera"
                                Icon={CameraAltIcon}
                            >
                                {(closeMenu) =>
                                    ["Free", "Player"].map((mode) => (
                                        <MenuItem
                                            key={mode}
                                            selected={cameraMode === mode}
                                            onClick={() => {
                                                closeMenu();
                                                setCameraMode(mode);
                                                setShowMenu(false);
                                            }}
                                        >
                                            <CameraAltIcon
                                                fontSize="small"
                                                sx={{ mr: 1 }}
                                            />
                                            {mode}
                                        </MenuItem>
                                    ))
                                }
                            </ButtonDropdown>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
