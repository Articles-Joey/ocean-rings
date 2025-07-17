"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic'
import Script from 'next/script'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from '@/components/constants/routes';

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@/hooks/useFullScreen';
import { useControllerStore } from '@/hooks/useControllerStore';
// import ControllerPreview from '@/components/Games/ControllerPreview';
import { useGameStore } from '@/hooks/useGameStore';
// import { Dropdown, DropdownButton } from 'react-bootstrap';
import TouchControls from '@/components/UI/TouchControls';
import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
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

    const canvasGameRef = useRef(null);

    const {
        cameraMode, setCameraMode,
        teleport, setTeleport,
        playerLocation, setPlayerLocation,
        maxHeight, setMaxHeight,
        shift,
        setScore,
        setDistance
        // touchControls, setTouchControls
    } = useGameStore()

    // const [playerData, setPlayerData] = useState({
    //     x: 0,
    //     y: 0,
    //     z: 0,
    //     money: 0,
    //     maxHeight: 0
    // });

    const [players, setPlayers] = useState([])

    var canvas;
    var context;

    var movement = {
        up: false,
        down: false,
        left: false,
        right: false,
        // tongue: false
    }

    // Box width
    var bw = 300;

    // Box height
    var bh = 800;

    // Padding
    var p = 0;

    let movementEmit = false

    function drawBoard() {

        for (var x = 0; x <= bw; x += 30) {
            context.moveTo(0.5 + x + p, p);
            context.lineTo(0.5 + x + p, bh + p);
        }

        for (var x = 0; x <= bh; x += 30) {
            context.moveTo(p, 0.5 + x + p);
            context.lineTo(bw + p, 0.5 + x + p);
        }

        context.strokeStyle = "black";
        context.stroke();

        // Red Zone
        context.fillStyle = 'rgba(255,105,97,.5)';
        context.fillRect(0, 0, bw / 2, bh / 2);

        // IDK
        context.fillStyle = 'rgba(173,216,230,.5)';
        context.fillRect(bw / 2, 0, bw / 2, bh / 2);

        // IDK
        context.fillStyle = 'rgba(144,238,144,.5)';
        context.fillRect(0, bh / 2, bw / 2, bh / 2);

        // IDK
        context.fillStyle = 'rgba(239,239,143,.5)';
        context.fillRect(bw / 2, bh / 2, bw / 2, bh / 2);

    }

    const { controllerState, setControllerState } = useControllerStore()
    const [showControllerState, setShowControllerState] = useState(false)

    // const [ cameraMode, setCameraMode ] = useState('Player')

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

    const [showMenu, setShowMenu] = useState(false)

    // const [touchControlsEnabled, setTouchControlsEnabled] = useState(false)
    const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    useEffect(() => {

        const handleGamepadInput = () => {
            const gamepad = navigator.getGamepads()[0]; // Assuming only one controller is connected

            if (gamepad) {

                setControllerState(gamepad);

                let directions = getDirections(gamepad.axes);
                let buttons = getDirections(gamepad.buttons);

                let dropPressed

                gamepad.buttons.forEach((button, index) => {
                    if (button.pressed && index == 0) {
                        // dropPressed = true
                        console.log(`Jump button pressed`);
                    }
                });

                if (isMoving(directions) || dropPressed) {
                    console.log("Emit movement shit!");

                    // socket.emit('glass-ceiling-player-movement', {
                    //     room,
                    //     ...(directions.down && { moveDown: directions.down }),
                    //     ...(directions.up && { moveUp: directions.up }),
                    //     ...(directions.right && { moveRight: directions.right }),
                    //     ...(directions.left && { moveLeft: directions.left }),
                    //     drop: dropPressed,
                    // });
                }
            }
        };

        // Start the monitoring loop with an interval
        const intervalId = setInterval(handleGamepadInput, 1000 / 30);

        const movementEmit = setInterval(function () {

            // console.log("Beep")

            socket.emit('glass-ceiling-movement', playerLocation);

            // setPlayerData(prevLocation => {

            //     // console.log("Boop")
            //     // Do any necessary computations or updates based on the previous state
            //     const updatedLocation = prevLocation /* your logic to update the location */;
            //     socket.emit('glass-ceiling-movement', updatedLocation);
            //     return updatedLocation; // Return the new state
            // });

            // socket.emit('glass-ceiling-movement', playerLocation);

        },
            // 1000 / 30
            1000
        );

        return () => {
            // Stop the monitoring loop when the component is unmounted
            clearInterval(movementEmit);
            clearInterval(intervalId);
        };

        return

        canvas = canvasGameRef.current
        context = canvas.getContext("2d");

        const movementEmitOld = setInterval(function () {

            socket.emit('glass-ceiling-movement', movement);

        }, 1000 / 30);

        function glassCeilingLogic(msg) {

            console.log(`Just received this message from server`);

            return

            console.log(msg);
            // setPlayerData(msg.players)

            // return

            context.reset();
            drawBoard();

            for (var id in msg.players) {

                var player = msg.players[id];

                var playerSize = 10;
                var draw = 'square';

                // Circle (Original)
                context.beginPath();
                // context.fillStyle = player.color;
                context.fillStyle = '#000';

                if (draw === 'square') {
                    context.fillRect(player?.glass_ceiling?.x, player?.glass_ceiling?.y, playerSize, playerSize * 3);
                } else if (draw === 'circle') {
                    context.save();
                    // Move to the center of the canvas
                    context.translate(playerSize / 2, playerSize / 2);
                    context.arc(player.x, player.y, 25, 0, 2 * Math.PI);
                    context.fill();
                    context.restore();
                }

                // Left Eye
                // context.beginPath();
                // context.fillStyle = "#000";
                // context.fillRect(player.x + 2.5, player.y + 2.5, 10, 10);
                // context.fill();

                // Right Eye
                // context.beginPath();
                // context.fillStyle = "#000";
                // context.fillRect(player.x + playerSize - 12.5, player.y + 2.5, 10, 10);
                // context.fill();

                // Mouth
                // context.beginPath();
                // context.fillStyle = "#000";
                // context.fillRect(player.x + 5, player.y + 20, playerSize - 10, playerSize / 4);
                // context.fill();

                // Tongue
                // context.beginPath();
                // context.fillStyle = "#FFC0CB";

                // if (player.tongue == false) {
                //     context.fillRect(player.x + 10, player.y + (playerSize / 4 + 15), playerSize - 20, playerSize / 6);
                // } else {
                //     context.fillRect(player.x + 10, player.y + (playerSize / 4 + 15), playerSize - 20, playerSize / 2);
                // }

                // context.fill();

                // context.font = "10px Arial";
                // context.fillStyle = "#000";
                // context.textAlign = "center";
                // var playerNickname = player.nickname;
                // context.fillText(player.nickname, player.x + (playerSize / 2), player.y - 5);

            }

        }

        // socket.emit('join-room', 'game:glass-ceiling');

        socket.on('glass-ceiling-players', glassCeilingLogic);

        document.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case 65: // A
                    movement.left = true;
                    break;
                case 87: // W
                    movement.up = true;
                    break;
                case 68: // D
                    movement.right = true;
                    break;
                case 83: // S
                    movement.down = true;
                    break;
                case 37: // ArrowLeft
                    movement.rotateLeft = true;
                    break;
                case 39: // ArrowRight
                    movement.rotateRight = true;
                    break;
                case 38: // ArrowUp
                    movement.score = true;
                    break;
                case 32: // Tongue
                    movement.tongue = true;
                    break;
            }
        });

        document.addEventListener('keyup', function (event) {
            switch (event.keyCode) {
                case 65: // A
                    movement.left = false;
                    break;
                case 87: // W
                    movement.up = false;
                    break;
                case 68: // D
                    movement.right = false;
                    break;
                case 83: // S
                    movement.down = false;
                    break;
                case 37: // ArrowLeft
                    movement.rotateLeft = false;
                    break;
                case 39: // ArrowRight
                    movement.rotateRight = false;
                    break;
                case 32: // Tongue
                    movement.tongue = false;
                    break;
            }
        });

        return () => {
            // console.log("Leave room");
            // socket.off('glass-ceiling-players', glassCeilingLogic)
            // clearInterval(movementEmit);
            // socket.emit('leave-room', 'game:glass-ceiling');
        }

    }, []);

    const [sceneKey, setSceneKey] = useState(0);

    // Function to handle scene reload
    const reloadScene = () => {
        setScore(0)
        setDistance(0)
        setSceneKey((prevKey) => prevKey + 1);
    };

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    let panelProps = {
        server,
        players,
        touchControlsEnabled,
        setTouchControlsEnabled,
        reloadScene,
        controllerState,
        isFullscreen,
        requestFullscreen,
        exitFullscreen,
        setShowMenu
    }

    const game_name = 'Ocean Rings'
    const game_key = 'ocean-rings'

    return (

        <div
            className={`ocean-rings-game-page ${isFullscreen && 'fullscreen'}`}
            id="ocean-rings-game-page"
        >

            <div className="menu-bar card card-articles p-1 justify-content-center">

                <div className='flex-header align-items-center'>

                    <ArticlesButton
                        small
                        active={showMenu}
                        onClick={() => {
                            setShowMenu(prev => !prev)
                        }}
                    >
                        <i className="fad fa-bars"></i>
                        <span>Menu</span>
                    </ArticlesButton>

                    <div>
                        Y: {(playerLocation?.y || 0)}
                    </div>

                </div>

            </div>

            <div className={`mobile-menu ${showMenu && 'show'}`}>
                <LeftPanelContent
                    {...panelProps}
                />
            </div>

            <TouchControls
                touchControlsEnabled={touchControlsEnabled}
            />

            <div className='panel-left card rounded-0 d-none d-lg-flex'>

                <LeftPanelContent
                    {...panelProps}
                />

            </div>

            {/* <div className='game-info'>
                <div className="card card-articles card-sm">
                    <div className="card-body">
                        <pre> 
                            {JSON.stringify(playerData, undefined, 2)}
                        </pre>
                    </div>
                </div>
            </div> */}

            <div className='canvas-wrap'>

                <GameCanvas
                    key={sceneKey}
                    // playerData={playerData}
                    // setPlayerData={setPlayerData}
                    players={players}
                />

            </div>

            {/* <div className='d-flex justify-content-center w-100'>

                <div className="canvas-wrap">
                    <canvas
                        width={300}
                        height={600}
                        ref={canvasGameRef}
                    />
                    <canvas
                        width={300}
                        height={600}
                        id='static-canvas'
                    />
                </div>

            </div> */}

            {/* <div className="container py-3">

                <div className="card card-articles">
                    <div className="card-body p-2">
                        {JSON.stringify(playerData)}
                    </div>
                </div>

                <ArticlesButton 
                    onClick={() => socket.emit('join-room', 'glass-ceiling')} 
                    className=""
                >
                    Ping
                </ArticlesButton>

            </div>

            <div className="background"></div> */}

        </div>
    );
}