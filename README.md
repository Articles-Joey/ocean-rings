# Ocean Rings

The objective is to swim through the correct ring as depicted in the bottom right. Players move at a constant speed toward oncoming rings and the movement of the rings varies. If there is more than one player playing and all players get through their rings, a group bonus is given!

## Getting Started

First, run the development server:

```bash
npm run dev
```

You will need to override the models source, hosted on CDN by default. Add this env var globally.

```bash
NEXT_PUBLIC_MODEL_SOURCE = LOCAL
```

## Multiplayer

Aiming to have multiplayer via P2P and Websockets. Websocket backend code is not in this repo or available at this time. P2P code will be included here.

## Inspiration
Inspired by the minigame inside Toontown

https://toontownrewritten.fandom.com/wiki/Ring_Game

![Battle Trap Board](public/img/toontown-preview.webp)

## Attributions
[Fish Models - Quaternius](https://quaternius.com/packs/cutefish.html)  
[Pirate Ship - Kenney.nl](https://kenney.nl/assets/pirate-kit)  
[Kelp - Google Poly](https://poly.pizza/m/4cFllH6Iazk)