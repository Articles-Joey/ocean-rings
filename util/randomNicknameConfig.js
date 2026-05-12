
import generateRandomNickname from '@articles-media/articles-dev-box/generateRandomNickname';

const randomNicknameConfig = {
  type: 'Basic',
  parts: [
    [
      'Salty', 'Bubbling', 'Deep', 'Shiny', 'Swift', 'Silent', 'Golden', 'Neon',
      'Agile', 'Brave', 'Calm', 'Dashing', 'Eager', 'Fancy', 'Grumpy', 'Happy',
      'Jolly', 'Keen', 'Lazy', 'Mighty', 'Nimble', 'Oceanic', 'Quick', 'Radiant',
      'Scaly', 'Tidal', 'Vibrant', 'Wild', 'Zesty', 'Tropical', 'Coastal'
    ],
    [
      'Shark', 'Dolphin', 'Whale', 'Tuna', 'Salmon', 'Bass', 'Clownfish', 'Guppy',
      'Marlin', 'Orca', 'Puffer', 'Ray', 'Snapper', 'Trout', 'Walleye', 'Angler',
      'Barracuda', 'Cod', 'Eel', 'Flounder', 'Grouper', 'Halibut', 'Koi', 'Lobster',
      'Mackerel', 'Octopus', 'Perch', 'Sardine', 'Tetra', 'Urchin'
    ]
  ]
};

export default () => generateRandomNickname(randomNicknameConfig);