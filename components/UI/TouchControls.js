import { memo, useEffect, useRef, useState } from "react";

import ArticlesButton from "@/components/UI/Button"
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useStore } from "@/hooks/useStore";

const arePropsEqual = (prevProps, nextProps) => {
    // Compare all props for equality
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

function JumpButtonBase() {

    const {
        touchControls, setTouchControls
    } = useTouchControlsStore()

    return (
        <ArticlesButton
            onClick={() => {
                console.log("Jump!")
                setTouchControls({
                    ...touchControls,
                    jump: true
                })
            }}
        >
            Jump
        </ArticlesButton>
    )
}

const JumpButton = memo(JumpButtonBase, arePropsEqual);

function TouchControlsBase(props) {

    const sceneKey = useStore(state => state.sceneKey)

    const managerRef = useRef(null)
    const [nippleCreated, setNippleCreated] = useState(false)

    const [nStart, setnStart] = useState(false)
    const [nDirection, setnDirection] = useState(false)

    const {
        touchControls,
        setTouchControls,
        enabled: touchControlsEnabled
    } = useTouchControlsStore()

    function startNipple() {

        const zone = document.getElementById('zone_joystick')

        if (!zone) {
            return null
        }

        if (managerRef.current) {
            managerRef.current.destroy()
            managerRef.current = null
        }

        const options = {
            zone,
            // threshold: 0.5
            // lockX: true,
        };

        const manager = require('nipplejs').create(options);

        managerRef.current = manager
        setNippleCreated(true)

        let dragDistance = 0

        manager.on('start end', function (evt, data) {
            // dump(evt.type);
            // debug(data);
            console.log("1", evt.type)

            if (evt.type == 'start') {
                setnStart(true)
            } else if (evt.type == 'end') {
                setnStart(false)
                setnDirection(false)
                dragDistance = 0
                setTouchControls((prev) => ({
                    ...prev,
                    left: false,
                    right: false,
                    up: false,
                    down: false
                }))
            }

        })
            .on('move', function (evt, data) {

                dragDistance = data.distance || 0
                const { x = 0, y = 0 } = data.vector || {}
                const threshold = 0.35

                console.log("2", dragDistance, x, y)

                setTouchControls((prev) => ({
                    ...prev,
                    left: x < -threshold,
                    right: x > threshold,
                    up: y > threshold,
                    down: y < -threshold,
                }))

                if (dragDistance <= 15) {
                    setTouchControls((prev) => ({
                        ...prev,
                        left: false,
                        right: false,
                        up: false,
                        down: false,
                    }))
                }

            })
            .on(' ' +
                'dir:up plain:up dir:left plain:left dir:down ' +
                'plain:down dir:right plain:right',
                function (evt, data) {
                    if (evt.type === 'move') {
                        dragDistance = data.distance || 0
                    }

                    if (evt.type === 'dir:left' || evt.type === 'dir:right' || evt.type === 'dir:up' || evt.type === 'dir:down') {
                        setnDirection(evt.type.replace('dir:', ''))
                    }
                }
            )
            .on('pressure', function (evt, data) {
                // debug({
                //   pressure: data
                // });
            });

        return manager
    }

    useEffect(() => {

        if (!touchControlsEnabled) {
            if (managerRef.current) {
                managerRef.current.destroy()
                managerRef.current = null
            }
            setNippleCreated(false)
            return
        }

        console.log("Load nipple")
        const manager = startNipple()

        return () => {
            if (managerRef.current) {
                console.log("Destroy nipple")
                managerRef.current.destroy()
                managerRef.current = null
            }
            setNippleCreated(false)
        }

    }, [touchControlsEnabled, sceneKey]);

    return (
        <div className={`touch-controls-area ${!touchControlsEnabled && 'd-none'}`}>

            <div className="w-100 h-100">
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    // backgroundColor: 'black',
                    zIndex: 1,
                }} id="zone_joystick"></div>
            </div>

            {/* <JumpButton /> */}

        </div>
    )
}

const TouchControls = memo(TouchControlsBase, arePropsEqual);

export default TouchControls