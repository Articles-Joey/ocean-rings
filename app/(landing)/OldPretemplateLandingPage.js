"use client";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SettingsIcon from "@mui/icons-material/Settings";
import PaletteIcon from "@mui/icons-material/Palette";
import InfoIcon from "@mui/icons-material/Info";
import GitHubIcon from "@mui/icons-material/GitHub";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect, useContext, useState } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import ArticlesButton from '@/components/UI/Button';
import IsDev from '@/components/UI/IsDev';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';
import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import { useCharactersStore } from '@/hooks/useCharactersStore';
const LandingBackgroundAnimation = dynamic(() => import('@/components/Game/LandingBackgroundAnimation'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});
const GameScoreboard = dynamic(() =>
    import('@articles-media/articles-dev-box/GameScoreboard'),
    { ssr: false }
);
const Ad = dynamic(() =>
    import('@articles-media/articles-dev-box/Ad'),
    { ssr: false }
);
const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);
const Viewer = dynamic(
    () => import('@/components/UI/Viewer'),
    { ssr: false }
)

const assets_src = 'games/Ocean Rings/'

const game_key = 'ocean-rings'
const game_name = 'Ocean Rings'

function OldPretemplateLandingPage() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false
    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        process.env.NEXT_PUBLIC_GAME_PORT
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    // const nickname = useStore((state) => state.nickname);
    // const setNickname = useStore((state) => state.setNickname);
    // const randomNickname = useStore((state) => state.randomNickname);

    // const _hasHydrated = useStore((state) => state._hasHydrated);

    // const landingAnimation = useStore((state) => state.landingAnimation);

    // const setShowCreditsModal = useStore((state) => state.setShowCreditsModal);
    // const setShowInfoModal = useStore((state) => state.setShowInfoModal);
    // const setShowSettingsModal = useStore((state) => state.setShowSettingsModal);

    const darkMode = useStore((state) => state.darkMode);
    // const setDarkMode = useStore((state) => state.setDarkMode);

    // const [showInfoModal, setShowInfoModal] = useState(false)
    // const [showSettingsModal, setShowSettingsModal] = useState(false)
    // const [showPrivateGameModal, setShowPrivateGameModal] = useState(false)

    // const [lobbyDetails, setLobbyDetails] = useState({
    //     players: [],
    //     games: [],
    // })

    // const lobbyDetails = useStore((state) => state.lobbyDetails)
    // const setLobbyDetails = useStore((state) => state.setLobbyDetails)

    // const [character, setCharacter] = useLocalStorageNew("game:ocean-rings:character", {
    //     model: 'Clownfish',
    //     color: '#000000'
    // })

    const character = useStore((state) => state.character);
    const setCharacter = useStore((state) => state.setCharacter);
    const characters = useCharactersStore((state) => state.characters);

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

    // useEffect(() => {

    //     setShowInfoModal(localStorage.getItem('game:four-frogs:rulesAnControls') === 'true' ? true : false)

    //     // if (userReduxState._id) {
    //     //     console.log("Is user")
    //     // }

    //     socket.on('game:four-frogs-landing-details', function (msg) {
    //         console.log('game:four-frogs-landing-details', msg)

    //         if (JSON.stringify(msg) !== JSON.stringify(lobbyDetails)) {
    //             setLobbyDetails(msg)
    //         }
    //     });

    //     return () => {
    //         socket.off('game:four-frogs-landing-details');
    //     };

    // }, [])

    // useEffect(() => {

    //     localStorage.setItem('game:four-frogs:rulesAnControls', showInfoModal)

    // }, [showInfoModal])

    // useEffect(() => {

    //     if (socket.connected) {
    //         socket.emit('join-room', 'game:ocean-rings-landing');
    //     }

    //     return function cleanup() {
    //         socket.emit('leave-room', 'game:ocean-rings-landing')
    //     };

    // }, [socket.connected]);

    return (
        <Box sx={{"flexGrow":1,"display":"none","justifyContent":"center","alignItems":"center","minHeight":"100vh","& .scoreboard":{"my":"1rem","maxWidth":300,"width":"100%","@media (min-width: 992px)":{"my":0,"display":"block","position":"absolute","left":"1rem","top":"50%","transform":"translateY(-50%)"}},"& .ad-wrap":{"mt":"1rem","@media (min-width: 992px)":{"mt":0,"display":"block","position":"absolute","right":"1rem","top":"50%","transform":"translateY(-50%)"}}}}>

                <Box sx={{"position":"fixed","inset":0,"width":"100%","height":"100%","zIndex":-1,"& img":{"filter":darkMode ? "blur(2px) brightness(0.5)" : "blur(2px)"}}}>
                    {landingAnimation ?
                        <LandingBackgroundAnimation />
                        :
                        <Image
                            src={`${process.env.NEXT_PUBLIC_CDN}games/Ocean Rings/background.jpg`}
                            alt=""
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'bottom' }}
                        />
                    }
                </Box>

                <Box sx={{"width":"100%","mx":"auto","px":"0.75rem","@media (min-width: 576px)":{"maxWidth":540},"@media (min-width: 768px)":{"maxWidth":720},"@media (min-width: 992px)":{"maxWidth":960,"flexDirection":"row"},"@media (min-width: 1200px)":{"maxWidth":1140},"@media (min-width: 1400px)":{"maxWidth":1320},"py":"1rem","display":"flex","flexDirection":"column-reverse","justifyContent":"center","alignItems":"center"}}>

                    

                    {characterEdit &&
                        <Box
                            sx={[{"bgcolor":"game.card","color":"text.primary","backgroundImage":"none","display":"flex","flexDirection":"column","minWidth":0,"border":1,"borderColor":"divider","borderRadius":"0.375rem","fontSize":"0.875rem"}, { "width": "20rem" }]}
                            
                        >

                            <Box sx={{"p":"0.5rem 1rem","borderBottom":1,"borderColor":"divider","bgcolor":"rgba(0,0,0,0.03)","display":"flex","alignItems":"center"}}>

                                Character Selector

                            </Box>

                            <Box sx={{"flex":"1 1 auto","p":"0.5rem"}}>

                                <Box sx={{"display":"grid","gap":"5px","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","mb":"0.5rem"}}>
                                    {characters.map(item => {

                                        let active = character.model == item.name

                                        return (
                                            <Box
                                                key={item.name}
                                                className={active ? "active" : undefined} sx={{"cursor":"pointer","transitionDuration":"200ms","&:hover":{"transform":"scale(1.025)","boxShadow":"0 0 0 1px rgba(0,0,0,0.25), 0 2px 3px rgba(0,0,0,0.2)"},"&.active":{"border":"2px solid #000"}}}
                                                onClick={() => {
                                                    setCharacter({
                                                        ...character,
                                                        model: item.name
                                                    })
                                                }}
                                            >
                                                <Box sx={{"position":"relative","width":"100%","& > *":{"position":"absolute","inset":0,"width":"100%","height":"100%"},"aspectRatio":"1 / 1"}}>

                                                    {active &&
                                                        <Box >
                                                            <Viewer model={item.name} />
                                                        </Box>
                                                    }

                                                    {!active &&
                                                        <Box component="img"
                                                            sx={[{"maxWidth":"100%","height":"auto"}, { objectFit: 'cover' }]}
                                                            
                                                            src={item.image}
                                                            alt=""
                                                        />
                                                    }

                                                </Box>
                                            </Box>
                                        )
                                    })}
                                </Box>

                                

                                

                            </Box>

                            <Box sx={{"p":"0.5rem 1rem","borderTop":1,"borderColor":"divider","bgcolor":"rgba(0,0,0,0.03)","display":"flex","justifyContent":"center"}}>

                                <ArticlesButton
                                    sx={{"width":"50%"}}
                                    onClick={() => {
                                        setCharacterEdit(false)
                                    }}
                                >
                                    <ArrowBackIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                    Return
                                </ArticlesButton>

                                <ArticlesButton
                                    sx={{"width":"50%"}}
                                    onClick={() => {
                                        setCharacterEdit(false)
                                    }}
                                >
                                    <SaveIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                    Save
                                </ArticlesButton>

                            </Box>

                        </Box>
                    }

                    {!characterEdit &&
                        <Box>
                            <Box
                                sx={[{"bgcolor":"game.card","color":"text.primary","backgroundImage":"none","display":"flex","flexDirection":"column","minWidth":0,"border":1,"borderColor":"divider","borderRadius":"0.375rem","fontSize":"0.875rem","mb":"1rem"}, { "width": "20rem" }]}
                                
                            >

                                

                                <Box sx={{"p":"0.5rem 1rem","borderBottom":1,"borderColor":"divider","bgcolor":"rgba(0,0,0,0.03)","display":"flex","alignItems":"center"}}>

                                    <Box sx={{"flexShrink":0,"mr":"0.5rem"}}>

                                        <Box sx={{ width: '50px', height: '50px' }}  >
                                            <Box
                                                sx={{"position":"relative","width":"100%","& > *":{"position":"absolute","inset":0,"width":"100%","height":"100%"},"aspectRatio":"1 / 1","mb":"0.25rem"}}

                                            >
                                                <Box>
                                                    <Viewer scale={13} model={character.model} />
                                                </Box>
                                            </Box>
                                        </Box>

                                        <ArticlesButton
                                            small
                                            sx={{"width":"100%"}}
                                            onClick={() => {
                                                setCharacterEdit(true)
                                            }}
                                        >
                                            Edit
                                        </ArticlesButton>

                                    </Box>

                                    <Box sx={{"flexGrow":1}}>

                                        <Box sx={{"mb":"0"}}>
                                            <label htmlFor="nickname">Nickname</label>
                                            
                                            <Box sx={{"display":"flex","alignItems":"center"}}>
                                                <Box component="input"
                                                    type="text"
                                                    value={_hasHydrated ? nickname : ''}
                                                    disabled={!_hasHydrated}
                                                    id="nickname"
                                                    name="nickname"
                                                    placeholder="Enter your nickname"
                                                    onChange={(e) => {
                                                        setNickname(e.target.value)
                                                    }}
                                                    sx={{"display":"block","width":"100%","p":"0.25rem 0.5rem","color":"text.primary","bgcolor":"background.paper","border":1,"borderColor":"divider","borderRadius":"0.375rem","fontSize":"0.875rem","minHeight":"calc(1.5em + 0.5rem + 2px)"}}
                                                />
                                                <ArticlesButton
                                                    small
                                                    
                                                    onClick={() => {
                                                        randomNickname()
                                                    }}
                                                >
                                                    <ShuffleIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                                </ArticlesButton>
                                            </Box>
                                        </Box>

                                        <Box sx={[{"mt":"0.25rem"}, { fontSize: '0.8rem' }]} >Visible to all players</Box>

                                    </Box>

                                </Box>

                                <Box sx={{"flex":"1 1 auto","p":"1rem"}}>

                                    <Box component={Link}
                                        href={{
                                            pathname: `/play`
                                            // query: {
                                            //     server: id
                                            // }
                                        }}
                                    >
                                        <ArticlesButton
                                            sx={{"mb":"1rem","width":"100%"}}
                                            small
                                        >
                                            Play Single Player
                                        </ArticlesButton>
                                    </Box>

                                    <Box sx={{"fontWeight":700,"mb":"0.25rem","fontSize":"0.875em","textAlign":"center"}}>
                                        {lobbyDetails?.players?.length || 0} player{lobbyDetails?.players?.length !== 1 && 's'} in the lobby.
                                    </Box>

                                    

                                    <Box sx={{"display":"grid","gap":"5px","gridTemplateColumns":"repeat(2, minmax(0, 1fr))"}}>

                                        {[1, 2, 3, 4].map(id => {

                                            let lobbyLookup = lobbyDetails?.fourFrogsGlobalState?.games?.find(lobby =>
                                                parseInt(lobby.server_id) == id
                                            )

                                            return (
                                                <Box key={id} sx={{"p":"0.5rem","border":"1px solid rgba(0,0,0,0.25)","display":"flex","flexDirection":"column","alignItems":"center"}}>

                                                    <Box sx={{"display":"flex","justifyContent":"space-between","alignItems":"center","width":"100%","mb":"0.5rem"}}>
                                                        <Box sx={[{"mb":"0"}, { fontSize: '0.9rem' }]} ><b>Server {id}</b></Box>
                                                        <Box sx={{"mb":"0"}}>{lobbyLookup?.players?.length || 0}/4</Box>
                                                    </Box>

                                                    <Box sx={{"display":"flex","justifyContent":"space-around","width":"100%","mb":"0.25rem"}}>
                                                        {[1, 2, 3, 4].map(player_count => {

                                                            let playerLookup = false

                                                            if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                                            return (
                                                                <Box sx={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    ...(playerLookup ? {
                                                                        backgroundColor: 'black',
                                                                    } : {
                                                                        backgroundColor: 'gray',
                                                                    }),
                                                                    border: '1px solid black'
                                                                }} key={player_count}  >

                                                                </Box>
                                                            )
                                                        })}
                                                    </Box>

                                                    <Box component={Link}
                                                        
                                                        href={{
                                                            pathname: `/play`,
                                                            query: {
                                                                server: id
                                                            }
                                                        }}
                                                    >
                                                        <ArticlesButton
                                                            sx={{"px":"3rem"}}
                                                            small
                                                        >
                                                            Join
                                                        </ArticlesButton>
                                                    </Box>

                                                </Box>
                                            )
                                        })}

                                    </Box>

                                    

                                    

                                    <IsDev sx={{"mt":"1rem"}}>
                                        <Box>
                                            <ArticlesButton
                                                sx={{"width":"50%"}}
                                                variant='warning'
                                                onClick={() => {
                                                    socket.emit('game:ocean-rings:reset', '');
                                                }}
                                            >
                                                Reset Server
                                            </ArticlesButton>
                                        </Box>
                                    </IsDev>

                                </Box>

                                <Box sx={{"p":"0.5rem 1rem","borderTop":1,"borderColor":"divider","bgcolor":"rgba(0,0,0,0.03)","display":"flex","flexWrap":"wrap","justifyContent":"center"}}>

                                    <Box sx={{"display":"flex","width":"50%"}}>
                                        <ArticlesButton
                                            sx={{"width":"100%"}}
                                            small
                                            onClick={() => {
                                                setShowSettingsModal(true)
                                            }}
                                        >
                                            <SettingsIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                            Settings
                                        </ArticlesButton>
                                        <ArticlesButton
                                            
                                            small
                                            onClick={() => {
                                                setDarkMode(!darkMode);
                                            }}
                                        >
                                            <PaletteIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                        </ArticlesButton>
                                    </Box>

                                    <ArticlesButton
                                        sx={{"width":"50%"}}
                                        small
                                        onClick={() => {
                                            setShowInfoModal(true)
                                        }}
                                    >
                                        <InfoIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                        Info
                                    </ArticlesButton>

                                    <Box component={Link} href={'https://github.com/Articles-Joey/ocean-rings'} sx={{"width":"50%"}} target="_blank" rel="noopener noreferrer">
                                        <ArticlesButton
                                            sx={{"width":"100%"}}
                                            small
                                            onClick={() => {

                                            }}
                                        >
                                            <GitHubIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                            Github
                                        </ArticlesButton>
                                    </Box>

                                    <ArticlesButton
                                        sx={{"width":"50%"}}
                                        small
                                        onClick={() => {
                                            setShowCreditsModal(true);
                                        }}
                                    >
                                        <GroupIcon fontSize="small" sx={{ mr: "0.2rem" }} />
                                        Credits
                                    </ArticlesButton>

                                </Box>

                            </Box>

                            <ReturnToLauncherButton />

                        </Box>
                    }

                    
                    <GameScoreboard
                        game={game_name}
                        style="Default"
                        darkMode={darkMode ? true : false}
                    />

                    <Ad
                        style="Default"
                        section={"Games"}
                        section_id={game_name}
                        darkMode={darkMode ? true : false}
                        user_ad_token={userToken}
                        userDetails={userDetails}
                        userDetailsLoading={userDetailsLoading}
                    />

                </Box>
            </Box>
    )
}
