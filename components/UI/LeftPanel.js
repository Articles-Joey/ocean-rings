import Link from "next/link";

import { Dropdown, DropdownButton } from "react-bootstrap";

// import ROUTES from '@/components/constants/routes';
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

import ControllerPreview from '@/components/UI/ControllerPreview';

import { useSocketStore } from "@/hooks/useSocketStore";

import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import { useStore } from "@/hooks/useStore";
import { useRouter, useSearchParams } from "next/navigation";
// import { Debug } from "@react-three/cannon";

export default function LeftPanelContent({

}) {

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const setShowSettingsModal = useStore(state => state.setShowSettingsModal)
    const sidebar = useStore(state => state.sidebar)
    const setSidebar = useStore(state => state.setSidebar)
    const toggleSidebar = useStore(state => state.toggleSidebar)

    const darkMode = useStore(state => state.darkMode)
    const toggleDarkMode = useStore(state => state.toggleDarkMode)

    // const {
    //     cameraMode, setCameraMode,
    //     teleport, setTeleport,
    //     playerLocation, setPlayerLocation,
    //     maxHeight, setMaxHeight,
    //     shift,
    //     distance,
    //     score,
    //     // setDebug,
    //     // debug
    //     // touchControls, setTouchControls
    // } = useGameStore()

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body d-flex flex-wrap">

                    {/* Display only if in multiplayer mode */}
                    {/* <div className='flex-header'>
                        <div>Server: {server}</div>
                        <div>Players: {players.length || 0}/50</div>
                    </div> */}

                    {/* Display only if in multiplayer mode */}
                    {/* {!socket?.connected &&
                        <div
                            className=""
                        >

                            <div className="">

                                <div className="h6 mb-1">Not connected</div>

                                <ArticlesButton
                                    onClick={() => {
                                        console.log("Reconnect")
                                        socket.connect()
                                    }}
                                >
                                    Reconnect!
                                </ArticlesButton>

                            </div>

                        </div>
                    } */}

                    <GameMenuPrimaryButtonGroup
                        useStore={useStore}
                        type="GameMenu"
                        useRouter={useRouter}
                    />

                </div>
            </div>

            <PlayerDataPanel />

            <DebugPanel />

        </div>
    )

}

export function useHandleStartGame() {
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const socket = useSocketStore(state => state.socket)
    const startGame = useSocketStore(state => state.startGame)

    const gameState = useGameStore(state => state.gameState)
    const setGameState = useGameStore(state => state.setGameState)
    const setScore = useGameStore(state => state.setScore)
    const setDistance = useGameStore(state => state.setDistance)

    function handleStartGame(server, status) {

        if (server) {
            startGame(
                server,
                status || "In Progress"
            )
        } else {
            setGameState({
                ...gameState,
                status: status || "In Progress"
            })
            setScore(0)
            setDistance(0)
        }

    }

    return handleStartGame
}

function PlayerDataPanel() {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const socket = useSocketStore(state => state.socket)
    const startGame = useSocketStore(state => state.startGame)

    const playerLocation = useGameStore(state => state.playerLocation)
    const players = useGameStore(state => state.gameState.players)
    const score = useGameStore(state => state.score)
    const distance = useGameStore(state => state.distance)
    const timer = useGameStore(state => state.gameState.timer)
    const status = useGameStore(state => state.gameState.status)
    // const shift = useGameStore(state => state.shift)

    const handleStartGame = useHandleStartGame()

    // function handleStartGame(server, status) {

    //     const gameState = useGameStore.getState().gameState
    //     const setGameState = useGameStore.getState().setGameState
    //     const setScore = useGameStore.getState().setScore
    //     const setDistance = useGameStore.getState().setDistance

    //     if (server) {
    //         startGame(
    //             server,
    //             "In Progress"
    //         )
    //     } else {
    //         setGameState({
    //             ...gameState,
    //             status: "In Progress"
    //         })
    //         setScore(0)
    //         setDistance(0)
    //     }

    // }

    return (
        <div
            className="card card-articles card-sm"
        >
            <div className="card-body d-flex flex-column justify-content-between">

                <div className="flex-header mb-1">
                    <div className="fw-bold">Status: {status}</div>
                    <div className="">
                        <i className="fad fa-clock"></i>
                        {timer || 0}
                    </div>
                </div>

                <div className="small d-flex justify-content-between align-items-center w-100 mb-2">

                    {/* <div className="fw-bold">Score: {score}</div> */}

                    <div className="d-flex gap-1">
                        <div className="badge bg-black">Score: {score?.toFixed(0)}</div>
                        <div className="badge bg-black">Distance: {distance?.toFixed(0)}</div>
                        <div className="badge bg-black">X: {playerLocation?.x?.toFixed(0)}</div>
                        <div className="badge bg-black">Y: {playerLocation?.y?.toFixed(0)}</div>
                    </div>

                    {/* <div>Test{playerLocation.y}</div> */}
                    {/* <div>Z: {playerLocation?.z}</div> */}

                    {/* <div>Shift: {shift ? 'True' : 'False'}</div> */}

                </div>

                {(
                    status == "In Lobby"
                    ||
                    status == "Game Over"
                ) &&
                    <ArticlesButton
                        variant="articles w-100 mb-2"
                        // size="sm"
                        onClick={() => {
                            handleStartGame(server, "In Progress")
                        }
                        }
                    >
                        <i className="fad fa-play"></i>
                        Start game
                    </ArticlesButton>
                }

                <div className="border mb-2">
                    {players?.map(player => {

                        const isYou = (
                            (
                                !server
                                &&
                                player.id === "local"
                            )
                            ||
                            (
                                server
                                &&
                                socket?.id == player.id
                            )
                        )

                        return (
                            (
                                <div key={player.id} className="border p-2">
                                    <div>{isYou ? "(You) " : ""}{player.nickname}</div>
                                    <div className="" style={{ fontSize: "0.65rem" }}>{player.id}</div>
                                </div>
                            )
                        )
                    })}
                </div>

            </div>
        </div>
    )
}

function DebugPanel() {
    const sceneKey = useStore((state) => state.sceneKey);
    const setShowMenu = useStore((state) => state.setShowMenu);
    const reloadScene = useStore((state) => state.reloadScene);

    const debug = useStore(state => state.debug)
    const setDebug = useStore(state => state.setDebug)

    const cameraMode = useGameStore((state) => state.cameraMode);
    const setCameraMode = useGameStore((state) => state.setCameraMode);

    if (!debug) return null;

    return (
        <>
            {/* Debug Controls */}
            <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small">Debug Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={() => {
                                    reloadScene()
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Reload Game
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={() => {

                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Reset Camera
                            </ArticlesButton>
                        </div>

                        <div className='d-flex'>

                            {/* <div className='w-50'>
                                <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-ufo"></i>
                                            <span>Teleport</span>
                                        </span>
                                    }
                                >

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                        {[
                                            {
                                                name: '20',
                                                position: [-4, 20, 0]
                                            },
                                            {
                                                name: '30',
                                                position: [-4, 31, 0]
                                            },
                                            {
                                                name: '100',
                                                position: [-4, 101, 0]
                                            },
                                            {
                                                name: 'Sprint 1 116',
                                                position: [-28, 116.5, 0]
                                            },
                                            {
                                                name: 'Sprint 2 132',
                                                position: [27, 131, 0]
                                            }
                                        ]
                                            .map(location =>
                                                <Dropdown.Item
                                                    key={location.name}
                                                    onClick={() => {
                                                        setTeleport(location.position)
                                                        setShowMenu(false)
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >

                                                    {maxHeight > location.position[1] ?
                                                        <i className="fad fa-unlock"></i>
                                                        :
                                                        <i className="fad fa-lock"></i>
                                                    }

                                                    {location.name}
                                                </Dropdown.Item>
                                            )}

                                    </div>

                                </DropdownButton>
                            </div> */}

                            <div className='w-50'>
                                <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-bug"></i>
                                            <span>Debug </span>
                                            <span>{debug ? 'On' : 'Off'}</span>
                                        </span>
                                    }
                                >

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                        {[
                                            false,
                                            true
                                        ]
                                            .map(location =>
                                                <Dropdown.Item
                                                    key={location}
                                                    onClick={() => {
                                                        setDebug(location)
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    {location ? 'True' : 'False'}
                                                </Dropdown.Item>
                                            )}

                                    </div>

                                </DropdownButton>
                            </div>

                            <div className='w-50'>
                                <DropdownButton
                                    variant="articles w-100"
                                    size='sm'
                                    id="dropdown-basic-button"
                                    className="dropdown-articles"
                                    title={
                                        <span>
                                            <i className="fad fa-camera"></i>
                                            <span>Camera</span>
                                        </span>
                                    }
                                >

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', width: '200px' }}>

                                        {[
                                            {
                                                name: 'Free',
                                            },
                                            {
                                                name: 'Player',
                                            }
                                        ]
                                            .map(location =>
                                                <Dropdown.Item
                                                    key={location.name}
                                                    active={cameraMode == location.name}
                                                    onClick={() => {
                                                        setCameraMode(location.name)
                                                        setShowMenu(false)
                                                    }}
                                                    className="d-flex justify-content-between"
                                                >
                                                    <i className="fad fa-camera"></i>
                                                    {location.name}
                                                </Dropdown.Item>
                                            )}

                                    </div>

                                </DropdownButton>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </>
    )

}