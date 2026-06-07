import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'

// import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
// import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

// import randomNicknameConfig from '@/util/randomNicknameConfig';

// import BoneFishModel from '@/components/PlayerModels/BoneFish';
// import ClownfishModel from '@/components/PlayerModels/Clownfish';

const assets_src = 'games/Ocean Rings/'

export const useCharactersStore = create((set) => ({

    characters: [
        {
            name: "Clownfish",
            image: `img/player/ClownFish.webp`,
            defaultColor: '#FFFFFF',
        },
        {
            name: "Bone Fish",
            image: `img/player/FishBone.webp`,
            defaultColor: '',
        },
        {
            name: "Goldfish",
            image: `img/player/GoldFish.webp`,
            defaultColor: '',
        },
        {
            name: "Angler Fish",
            image: `img/player/Anglerfish.webp`,
            defaultColor: '',
        },
        {
            name: "Worm",
            image: `img/player/Worm.webp`,
            defaultColor: '',
        },
        {
            name: "Zebra Clownfish",
            image: `img/player/ZebraClownFish.webp`,
            defaultColor: '',
        }
    ],

}))