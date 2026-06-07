"use client";

import { useAudioStore } from "@/hooks/useAudioStore";
import { useEffect, useRef } from "react";

export default function AudioHandler() {

    const audioSettings = useAudioStore((state) => state?.audioSettings);
    const setAudioSettings = useAudioStore((state) => state?.setAudioSettings);

    const musicRef = useRef(null);
    const interactedRef = useRef(false);

    // Initialize audio object once
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const music = new Audio(`/audio/audio-loop.mp3`);
        musicRef.current = music;

        music.onended = function () {
            music.currentTime = 0;
            music.play().catch(() => {});
        };

        const tryPlay = () => {
            if (!interactedRef.current && audioSettings?.enabled) {
                interactedRef.current = true;
                music.play().catch(() => {});
            }
        };

        const events = ['click', 'keydown', 'touchstart', 'pointerdown'];
        events.forEach((e) => document.addEventListener(e, tryPlay, { once: true }));

        return () => {
            events.forEach((e) => document.removeEventListener(e, tryPlay));
            music.pause();
            musicRef.current = null;
        };
    }, []);

    // Handle audio settings changes
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;

        music.volume = audioSettings?.enabled ? (audioSettings?.music_volume / 100) : 0;

        if (audioSettings?.enabled) {
            if (interactedRef.current) {
                if (music.paused) {
                    music.play().catch(() => {});
                }
            }
        } else {
            music.pause();
        }
    }, [audioSettings]);

    return null;

}