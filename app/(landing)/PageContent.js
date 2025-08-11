"use client"
import { useEffect, useContext, useState } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';
// import SingleInput from '@/components/Articles/SingleInput';
import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import IsDev from '@/components/UI/IsDev';
// import { ChromePicker } from 'react-color';
import { useSocketStore } from '@/hooks/useSocketStore';

const GameScoreboard = dynamic(() => import('@/components/UI/GameScoreboard'), {
    ssr: false,
});

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const SettingsModal = dynamic(
    () => import('@/components/UI/SettingsModal'),
    { ssr: false }
)

// const PrivateGameModal = dynamic(
//     () => import('@/components/UI/PrivateGameModal'),
//     { ssr: false }
// )

const Viewer = dynamic(
    () => import('@/components/UI/Viewer'),
    { ssr: false }
)

const Clownfish = dynamic(
    () => import('@/components/PlayerModels/Clownfish'),
    { ssr: false }
)

const BoneFish = dynamic(
    () => import('@/components/PlayerModels/BoneFish'),
    { ssr: false }
)

const assets_src = 'games/Ocean Rings/'

const game_key = 'ocean-rings'
const game_name = 'Ocean Rings'

export default function OceanRingsGameLandingPage() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    const [nickname, setNickname] = useLocalStorageNew("game:nickname", userReduxState.display_name)

    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [showPrivateGameModal, setShowPrivateGameModal] = useState(false)

    const [lobbyDetails, setLobbyDetails] = useState({
        players: [],
        games: [],
    })

    const [character, setCharacter] = useLocalStorageNew("game:ocean-rings:character", {
        model: 'Clownfish',
        color: '#000000'
    })

    const characters = [
        {
            name: "Clownfish",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}ClownfishModelThumb.jpg`,
            model:
                (
                    <group>
                        <Clownfish color={character.color} />
                    </group>
                ),
            defaultColor: '#FFFFFF',
        },
        {
            name: "Bone Fish",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}BoneFishModelThumb.jpg`,
            model:
                (
                    <group>
                        <BoneFish color={character.color} />
                    </group>
                ),
            defaultColor: '',
        }
    ]

    const [characterEdit, setCharacterEdit] = useState()
    const [colorEdit, setColorEdit] = useState()

    // useEffect(() => {

    //     if (socket) {
    //         socket.emit('join-room', 'four-frogs');
    //     }

    //     return () => {
    //         if (socket) {
    //             socket.emit('leave-room', 'four-frogs');
    //         }
    //     }

    // }, [socket]);

    useEffect(() => {

        setShowInfoModal(localStorage.getItem('game:four-frogs:rulesAnControls') === 'true' ? true : false)

        // if (userReduxState._id) {
        //     console.log("Is user")
        // }

        socket.on('game:four-frogs-landing-details', function (msg) {
            console.log('game:four-frogs-landing-details', msg)

            if (JSON.stringify(msg) !== JSON.stringify(lobbyDetails)) {
                setLobbyDetails(msg)
            }
        });

        return () => {
            socket.off('game:four-frogs-landing-details');
        };

    }, [])

    useEffect(() => {

        localStorage.setItem('game:four-frogs:rulesAnControls', showInfoModal)

    }, [showInfoModal])

    useEffect(() => {

        if (socket.connected) {
            socket.emit('join-room', 'game:four-frogs-landing');
        }

        return function cleanup() {
            socket.emit('leave-room', 'game:four-frogs-landing')
        };

    }, [socket.connected]);

    return (

        <div className="ocean-rings-landing-page">

            {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            }

            {/* {showPrivateGameModal &&
                <PrivateGameModal
                    show={showPrivateGameModal}
                    setShow={setShowPrivateGameModal}
                />
            } */}

            <div className='background-wrap'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Ocean Rings/background.jpg`}
                    alt=""
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'bottom' }}
                />
            </div>

            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center">

                <GameScoreboard
                    game="Ocean Rings"
                />

                {characterEdit &&
                    <div
                        className="card card-articles card-sm"
                        style={{ "width": "20rem" }}
                    >

                        <div className="card-header d-flex align-items-center">

                            Character Selector

                        </div>

                        <div className="card-body p-2">

                            <div className="selection-grid mb-2">
                                {characters.map(item => {

                                    let active = character.model == item.name

                                    return (
                                        <div
                                            key={item.name}
                                            className={`item ${active && 'active'}`}
                                            onClick={() => {
                                                setCharacter({
                                                    ...character,
                                                    model: item.name
                                                })
                                            }}
                                        >
                                            <div className="ratio ratio-1x1">

                                                {active &&
                                                    <div className=''>
                                                        <Viewer>
                                                            {item.model}
                                                        </Viewer>
                                                    </div>
                                                }

                                                {!active &&
                                                    <img
                                                        className='img-fluid'
                                                        style={{ objectFit: 'cover' }}
                                                        src={item.image}
                                                        alt=""
                                                    />
                                                }

                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* {colorEdit &&
                                <div className='mb-2'>
                                    <ChromePicker
                                        // color={color}
                                        width={"100%"}
                                        color={character.color}
                                        onChange={(color, e) => {

                                            console.log(color)

                                            setCharacter({
                                                ...character,
                                                color: color.hex
                                            })

                                        }}
                                        onChangeComplete={(color, e) => {
                                            console.log("Change Complete", color.rgb)
                                        }}
                                    />
                                </div>
                            } */}

                            {/* <div className='d-flex justify-content-center'>

                                <ArticlesButton
                                    small
                                    className="w-50"
                                    disabled={!character.color}
                                    onClick={() => {

                                        let character_copy = { ...character }

                                        delete character_copy.color

                                        setCharacter(character_copy)

                                    }}
                                >
                                    <i className="fad fa-redo"></i>
                                    Reset Color
                                </ArticlesButton>

                                <ArticlesButton
                                    small
                                    className="w-50"
                                    // active={colorEdit}
                                    onClick={() => {

                                        setColorEdit(prev => !prev)

                                    }}
                                >

                                    {colorEdit ? <i className="fad fa-check"></i> : <i className="fad fa-palette"></i>}
                                    {colorEdit ? 'Done' : 'Select Color'}
                                </ArticlesButton>

                            </div> */}

                        </div>

                        <div className="card-footer d-flex justify-content-center">

                            <ArticlesButton
                                className="w-50"
                                onClick={() => {
                                    setCharacterEdit(false)
                                }}
                            >
                                <i className="fad fa-arrow-alt-left"></i>
                                Return
                            </ArticlesButton>

                            <ArticlesButton
                                className="w-50"
                                onClick={() => {
                                    setCharacterEdit(false)
                                }}
                            >
                                <i className="fad fa-save"></i>
                                Save
                            </ArticlesButton>

                        </div>

                    </div>
                }

                {!characterEdit &&
                    <div
                        className="card card-articles card-sm mb-3 mb-lg-0"
                        style={{ "width": "20rem" }}
                    >

                        {/* <div style={{ position: 'relative', height: '200px' }}>
                        <Image
                            src={Logo}
                            alt=""
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div> */}

                        <div className='card-header d-flex align-items-center'>

                            <div className='flex-shrink-0 me-2'>

                                <div style={{ width: '50px', height: '50px' }} >
                                    <div
                                        className="ratio ratio-1x1 mb-1"

                                    >
                                        <div>
                                            <Viewer scale={13}>
                                                {characters.find(item => item.name == character.model)?.model}
                                            </Viewer>
                                        </div>
                                    </div>
                                </div>

                                <ArticlesButton
                                    small
                                    className="w-100"
                                    onClick={() => {
                                        setCharacterEdit(true)
                                    }}
                                >
                                    Edit
                                </ArticlesButton>

                            </div>

                            <div className="flex-grow-1">

                                <div className="form-group articles mb-0">
                                    <label htmlFor="nickname">Nickname</label>
                                    {/* <SingleInput
                                        value={nickname}
                                        setValue={setNickname}
                                        noMargin
                                    /> */}
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => {
                                            setNickname(e.target.value)
                                        }}
                                        className={`form-control form-control-sm`}
                                    />
                                </div>

                                <div className='mt-1' style={{ fontSize: '0.8rem' }}>Visible to all players</div>

                            </div>
                        </div>

                        <div className="card-body">

                            <Link
                                href={{
                                    pathname: `/play`
                                    // query: {
                                    //     server: id
                                    // }
                                }}
                            >
                                <ArticlesButton
                                    className="mb-3 w-100"
                                    small
                                >
                                    Play Single Player
                                </ArticlesButton>
                            </Link>

                            <div className="fw-bold mb-1 small text-center">
                                {lobbyDetails.players.length || 0} player{lobbyDetails.players.length > 1 && 's'} in the lobby.
                            </div>

                            {/* <div className='small fw-bold'>Public Servers</div> */}

                            <div className="servers">

                                {[1, 2, 3, 4].map(id => {

                                    let lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(lobby =>
                                        parseInt(lobby.server_id) == id
                                    )

                                    return (
                                        <div key={id} className="server">

                                            <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                                <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                                <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                            </div>

                                            <div className='d-flex justify-content-around w-100 mb-1'>
                                                {[1, 2, 3, 4].map(player_count => {

                                                    let playerLookup = false

                                                    if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                                    return (
                                                        <div key={player_count} className="icon" style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            ...(playerLookup ? {
                                                                backgroundColor: 'black',
                                                            } : {
                                                                backgroundColor: 'gray',
                                                            }),
                                                            border: '1px solid black'
                                                        }}>

                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <Link
                                                className={``}
                                                href={{
                                                    pathname: `/play`,
                                                    query: {
                                                        server: id
                                                    }
                                                }}
                                            >
                                                <ArticlesButton
                                                    className="px-5"
                                                    small
                                                >
                                                    Join
                                                </ArticlesButton>
                                            </Link>

                                        </div>
                                    )
                                })}

                            </div>

                            <div className='small fw-bold  mt-3 mb-1'>Or</div>

                            {/* <div className='d-flex'>

                            <ArticlesButton
                                className={`w-50`}
                                onClick={() => {
                                    // TODO
                                    alert("Coming Soon!")
                                }}
                            >
                                <i className="fad fa-robot"></i>
                                Practice
                            </ArticlesButton>

                            <ArticlesButton
                                className={`w-50`}
                                onClick={() => {
                                    setShowPrivateGameModal(prev => !prev)
                                }}
                            >
                                <i className="fad fa-lock"></i>
                                Private Game
                            </ArticlesButton>

                        </div> */}

                            <IsDev className={'mt-3'}>
                                <div>
                                    <ArticlesButton
                                        className="w-50"
                                        variant='warning'
                                        onClick={() => {
                                            socket.emit('game:four-frogs:reset', '');
                                        }}
                                    >
                                        Reset Server
                                    </ArticlesButton>
                                </div>
                            </IsDev>

                        </div>

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowSettingsModal(prev => !prev)
                                }}
                            >
                                <i className="fad fa-cog"></i>
                                Settings
                            </ArticlesButton>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowInfoModal({
                                        game: game_name
                                    })
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Rules & Controls
                            </ArticlesButton>

                            <Link href={'https://github.com/Articles-Joey/ocean-rings'} className='w-50' target="_blank" rel="noopener noreferrer">
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                    onClick={() => {

                                    }}
                                >
                                    <i className="fab fa-github"></i>
                                    Github
                                </ArticlesButton>
                            </Link>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowInfoModal({
                                        game: game_name
                                    })
                                }}
                            >
                                <i className="fad fa-users"></i>
                                Credits
                            </ArticlesButton>

                        </div>

                    </div>
                }

                {/* <Ad section={"Games"} section_id={game_name} /> */}

            </div>
        </div>
    );
}