import { useEffect, useState } from "react";

import Image from "next/image";
import dynamic from 'next/dynamic'

import { Modal } from "react-bootstrap"

// import ViewUserModal from "@/components/UI/ViewUserModal"

// import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import { useHandleStartGame } from "./LeftPanel";

export default function GameOverModal({
    // show,
    // setShow,
}) {

    // const setShow = useStore.getState().setShowGameOverModal

    const handleStartGame = useHandleStartGame()

    const [showModal, setShowModal] = useState(true)

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const reloadScene = useStore(state => state.reloadScene)

    const score = useGameStore(state => state.score)
    const distance = useGameStore(state => state.distance)

    return (
        <>
            <Modal
                className="articles-modal games-over-modal"
                size='md'
                show={showModal}
                centered
                scrollable
                onExited={() => {
                    // setShow(false)
                }}
                onHide={() => {
                    // setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Over</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    {server ?
                        <></>
                        :
                        <>
                            <div className="p-3">

                                <div className="mb-1">
                                    You had a score of {score}!
                                </div>

                                <div className="mb-0">
                                    You traveled a distance of {distance.toFixed(0)} meters!
                                </div>

                                {/* <div className="mb-2">Here is how everyone else did:</div> */}

                                {/* {show?.rankings?.map((player, index) => (
                                    <div key={index}>
                                        <b>{player.nickname || "Unknown"}</b>: {player.distance?.toFixed(2) || 0} meters
                                    </div>
                                ))} */}

                            </div>
                        </>
                    }

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <Link href="/">
                        <ArticlesButton variant="articles" onClick={() => {
                            // setShow(false)
                            useGameStore.getState().reset()
                        }}>
                            Close
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton variant="articles" onClick={() => {
                        // setShow(false)
                        useGameStore.getState().reset()
                        handleStartGame(server, "In Lobby")
                        reloadScene()
                    }}>
                        Play Again
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}