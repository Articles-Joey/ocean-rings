import Link from "next/link";

import { Dropdown, DropdownButton } from "react-bootstrap";

// import ROUTES from '@/components/constants/routes';
import { useGameStore } from "@/hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

import ControllerPreview from '@/components/UI/ControllerPreview';

import { useSocketStore } from "@/hooks/useSocketStore";

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import { useStore } from "@/hooks/useStore";
// import { Debug } from "@react-three/cannon";

export default function LeftPanelContent(props) {

    const {
        server,
        players,
        touchControlsEnabled,
        setTouchControlsEnabled,
        reloadScene,
        controllerState,
        // isFullscreen,
        // requestFullscreen,
        // exitFullscreen,
        setShowMenu
    } = props;

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

    const debug = useStore(state => state.debug)
    const setDebug = useStore(state => state.setDebug)

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

                    <Link
                        href={'/'}
                        className="w-50"
                    >
                        <ArticlesButton
                            small
                            className='w-100'
                        >
                            <i className="fad fa-arrow-alt-square-left"></i>
                            <span>Leave Game</span>
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton
                        small
                        className="w-50"
                        active={isFullscreen}
                        onClick={() => {
                            if (isFullscreen) {
                                exitFullscreen()
                            } else {
                                requestFullscreen()
                            }
                        }}
                    >
                        {isFullscreen && <span>Exit </span>}
                        {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                        <span>Fullscreen</span>
                    </ArticlesButton>

                    {/* <ArticlesButton
                        small
                        className='w-50'
                        onClick={() => {
                            setShowSettingsModal(true)
                        }}
                    >
                        <i className="fad fa-cog"></i>
                        <span>Settings</span>
                    </ArticlesButton> */}
                    <div className="d-flex w-50">
                        <ArticlesButton
                            className={`w-100`}
                            small
                            onClick={() => {
                                setShowSettingsModal(prev => !prev)
                            }}
                        >
                            <i className="fad fa-cog"></i>
                            Settings
                        </ArticlesButton>
                        <ArticlesButton
                            className={``}
                            small
                            onClick={() => {
                                toggleDarkMode()
                            }}
                        >
                            <i className="fad fa-moon"></i>
                            {/* Dark Mode */}
                        </ArticlesButton>
                    </div>

                    <ArticlesButton
                        small
                        className='w-50'
                        active={sidebar}
                        onClick={() => {
                            toggleSidebar()
                        }}
                    >
                        <i className="fad fa-cog"></i>
                        <span>Sidebar</span>
                    </ArticlesButton>

                </div>
            </div>

            <PlayerDataPanel />

            {/* Touch Controls */}
            {/* <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small">Touch Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={!touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(false)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Off
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(true)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                On
                            </ArticlesButton>
                        </div>

                    </div>

                </div>
            </div> */}

            <DebugPanel />

            {controllerState?.connected &&
                <div className="panel-content-group p-0 text-dark">

                    <div className="p-1 border-bottom border-dark">
                        <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                            {controllerState?.id}
                        </div>
                    </div>

                    <div className='p-1'>
                        <ArticlesButton
                            small
                            className="w-100"
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </div>

                    {showControllerState && <div className='p-3'>

                        <ControllerPreview
                            controllerState={controllerState}
                            showJSON={true}
                            showVibrationControls={true}
                            maxHeight={300}
                            showPreview={true}
                        />
                    </div>}

                </div>
            }

        </div>
    )

}

function PlayerDataPanel() {

    const playerLocation = useGameStore(state => state.playerLocation)
    const score = useGameStore(state => state.score)
    const distance = useGameStore(state => state.distance)
    // const shift = useGameStore(state => state.shift)

    return (
        <div
            className="card card-articles card-sm"
        >
            <div className="card-body d-flex justify-content-between">

                {/* <div> */}
                    {/* <div className="small fw-bold">playerData:</div> */}
                    <div className="small d-flex justify-content-between align-items-center w-100">

                        <div className="fw-bold">Score: {score}</div>

                        <div className="d-flex">
                            <div className="badge bg-black">Distance: {distance?.toFixed(0)}</div>
                            <div className="badge bg-black">X: {playerLocation?.x?.toFixed(0)}</div>
                            <div className="badge bg-black">Y: {playerLocation?.y?.toFixed(0)}</div>
                        </div>

                        {/* <div>Test{playerLocation.y}</div> */}
                        {/* <div>Z: {playerLocation?.z}</div> */}

                        {/* <div>Shift: {shift ? 'True' : 'False'}</div> */}

                    </div>
                    {/* {JSON.stringify(playerData, undefined, 2)} */}
                {/* </div> */}

                {/* <div>
                        <div className="small text-muted">maxHeight</div>
                        <div>Y: {maxHeight}</div>
                        <ArticlesButton
                            small
                            onClick={() => {
                                setMaxHeight(playerLocation?.y)
                            }}
                        >
                            Reset
                        </ArticlesButton>
                    </div> */}

            </div>
        </div>
    )
}

function DebugPanel() {

    const debug = useStore(state => state.debug)

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
                                onClick={reloadScene}
                            >
                                <i className="fad fa-redo"></i>
                                Reload Game
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                onClick={reloadScene}
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