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
import { useHotkeys } from 'react-hotkeys-hook';
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

        return

        // setShowInfoModal(localStorage.getItem('game:four-frogs:rulesAnControls') === 'true' ? true : false)

        // if (userReduxState._id) {
        //     console.log("Is user")
        // }

        if (server) {
            socket.on(`game:glass-ceiling-room-${server}`, function (msg) {
                console.log(`game:glass-ceiling-room-${server}`, msg)
                setPlayers(msg.players)
                // setLobbyDetails(msg)
            });
        }

        return () => {
            socket.off(`game:glass-ceiling-room-${server}`);
            socket.emit('leave-room', `game:glass-ceiling-room-${server}`, {
                game_id: server,
                // nickname: JSON.parse(localStorage.getItem('game:nickname')),
                // client_version: '1',
            })
        };

    }, [server])

    useEffect(() => {

        setDistance(0)
        setScore(0)

    }, []);

    useEffect(() => {

        return

        if (server && socket.connected) {
            socket.emit('join-room', `game:glass-ceiling-room-${server}`, {
                game_id: server,
                nickname: JSON.parse(localStorage.getItem('game:nickname')),
                client_version: '1',

            });
        }

        // return function cleanup() {
        //     socket.emit('leave-room', 'game:glass-ceiling-landing')
        // };

    }, [server, socket.connected]);

    const [touchControlsEnabled, setTouchControlsEnabled] = useState(false)

    const sceneKey = useStore((state) => state.sceneKey);
    const sidebar = useStore((state) => state.sidebar);
    const showMenu = useStore((state) => state.showMenu);
    const reloadScene = useStore((state) => state.reloadScene);
    const status = useGameStore((state) => state.gameState.status);

    useHotkeys('t', () => {
        // setTouchControlsEnabled((prev) => !prev)
    });
    useHotkeys('r', () => {
        reloadScene()
    });

    return (

        <div
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

            <div className='canvas-wrap'>

                <TouchControls
                    touchControlsEnabled={touchControlsEnabled}
                />

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}