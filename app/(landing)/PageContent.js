"use client"
import { useEffect, useContext, useState } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import ArticlesButton from '@/components/UI/Button';
import IsDev from '@/components/UI/IsDev';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

// import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
// import useUserToken from '@articles-media/articles-dev-box/useUserToken';
import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import { useCharactersStore } from '@/hooks/useCharactersStore';
const LandingBackgroundAnimation = dynamic(() => import('@/components/Game/LandingBackgroundAnimation'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

const Viewer = dynamic(
    () => import('@/components/UI/Viewer'),
    { ssr: false }
)

export default function OceanRingsGameLandingPage() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    // const {
    //     data: userToken,
    //     error: userTokenError,
    //     isLoading: userTokenLoading,
    //     mutate: userTokenMutate
    // } = useUserToken(
    //     process.env.NEXT_PUBLIC_GAME_PORT
    // );

    // const {
    //     data: userDetails,
    //     error: userDetailsError,
    //     isLoading: userDetailsLoading,
    //     mutate: userDetailsMutate
    // } = useUserDetails({
    //     token: userToken
    // });

    const darkMode = useStore((state) => state.darkMode);

    const character = useStore((state) => state.character);
    const setCharacter = useStore((state) => state.setCharacter);
    const characters = useCharactersStore((state) => state.characters);

    const [characterEdit, setCharacterEdit] = useState()
    const [colorEdit, setColorEdit] = useState()

    return (
        <>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                // RotatingMascot={RotatingMascot}
                Link={Link}
                // logoImage={logo.src}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                disableHero
                backgroundImage={
                    darkMode ?
                        "img/preview.webp"
                        :
                        "img/preview.webp"
                }
                singlePlayerConfig={{

                }}
                NicknameInputConfig={{
                    PreComponent: <div className='flex-shrink-0 me-2'>

                        <div style={{ width: '50px', height: '50px' }} >
                            <div
                                className="ratio ratio-1x1 mb-1"
                            >
                                <div>
                                    <Viewer scale={13} model={character.model} />
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
                }}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    privateServerSupport: false,
                }}
                CardOverride={
                    characterEdit ?
                        <div
                            className="card card-articles card-sm mb-3"
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
                                                            <Viewer
                                                                model={item.name}
                                                                scale={15}
                                                            />
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
                        :
                        false
                }
                brandingTextClass="jaro-primary"
            // disableGameScoreboard={true}
            />

            {/* <OldPretemplateLandingPage /> */}
        </>
    );
}