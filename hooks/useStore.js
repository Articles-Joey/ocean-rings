import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

import randomNicknameConfig from '@/util/randomNicknameConfig';

import BoneFishModel from '@/components/PlayerModels/BoneFish';
import ClownfishModel from '@/components/PlayerModels/Clownfish';

const assets_src = 'games/Ocean Rings/'

export const useStore = create()(
  persist(
    (set, get) => ({

      ...typicalZustandStoreStateSlice(
        set,
        get,
        randomNicknameConfig,
      ),

      character: {
        model: 'Clownfish',
        color: '#d87e07'
      },
      setCharacter: (newValue) => {
        set((prev) => ({
          character: newValue
        }))
      },

      updateCamera: null,
      setUpdateCamera: (updateCamera) => set({ updateCamera }),

      threeDimensional: true, // 'Light' | 'Dark' | null
      setThreeDimensional: (threeDimensional) => set({ threeDimensional }),

    }),
    {
      name: `${process.env.NEXT_PUBLIC_GAME_KEY}-site-storage`,
      version: 3,
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            ...typicalZustandStoreExcludes,
          ].includes(key))
        ),
    },
  ),
)