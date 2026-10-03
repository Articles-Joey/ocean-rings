"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic'

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useControllerStore } from '@/hooks/useControllerStore';
import { useGameStore } from '@/hooks/useGameStore';
import TouchControls from '@/components/UI/TouchControls';
import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import AudioHandler from '@/components/Handlers/AudioHandler';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import { useStore } from '@/hooks/useStore';
import classNames from 'classnames';
import Box from '@mui/material/Box';
import SinglePlayerHandler from '@/components/Handlers/SinglePlayerHandler';
import GameOverModal from '@/components/UI/GameOverModal';
const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

function getDirections(axes) {
    // Determine movement direction based on axes
    const isMovingUp = axes[1] < -0.5;
    const isMovingDown = axes[1] > 0.5;
    const isMovingLeft = axes[0] < -0.5;
    const isMovingRight = axes[0] > 0.5;

    // Update movement payload
    return {
        up: isMovingUp,
        down: isMovingDown,
        left: isMovingLeft,
        right: isMovingRight,
    };
}

function isMoving(movementPayload) {
    // Check if any property in the movement payload is true
    return Object.values(movementPayload).some((value) => value === true);
}

export default function OceanRingsGamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const setDistance = useGameStore((state) => state.setDistance);
    const setScore = useGameStore((state) => state.setScore);
    const setPlayers = useGameStore((state) => state.setPlayers);

    useEffect(() => {

        setDistance(0)
        setScore(0)

    }, []);

    const sceneKey = useStore((state) => state.sceneKey);
    const sidebar = useStore((state) => state.sidebar);
    const showMenu = useStore((state) => state.showMenu);
    
    const status = useGameStore((state) => state.gameState.status);

    return (

        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                '& .panel-left': { zIndex: '2 !important' },
                '& .background': {
                    position: 'fixed', inset: 0, height: '100%', width: '100%', zIndex: 0, overflow: 'hidden',
                    '& img': { filter: 'blur(2px) brightness(0.80)', transform: 'scale(1.05)' },
                },
                '& .container': { position: 'relative', zIndex: 1 },
                '& .debug-info, & .game-info': {
                    height: 'calc(100vh - 100px)', width: 300, flexShrink: 0,
                    '& .card': { height: '100%' },
                },
                '& .game': { p: '0.5rem 1rem', display: 'flex', justifyContent: 'center' },
                '& .game-panel': { width: '100%' },
            }}
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': showMenu,
                    'fullscreen': useFullscreen().isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
        >

            <AudioHandler />

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Corner Button",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Floating Panel",
                    centerContent: true,
                }}
            />

            {status == "Game Over" &&
                <GameOverModal
                    show={status == "Game Over"}
                    setShow={useStore.getState().setShowGameOverModal}
                />
            }

            <SinglePlayerHandler />

            <Box sx={{
                position: 'relative', width: '100vw', height: '100vh',
                '& canvas': { position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 },
            }}>

                <TouchControls />

                <GameCanvas
                    key={sceneKey}
                />

            </Box>

        </Box>
    );
}
