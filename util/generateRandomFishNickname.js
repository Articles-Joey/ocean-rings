const adjectives = [
    'Salty', 'Bubbling', 'Deep', 'Shiny', 'Swift', 'Silent', 'Golden', 'Neon', 
    'Agile', 'Brave', 'Calm', 'Dashing', 'Eager', 'Fancy', 'Grumpy', 'Happy',
    'Jolly', 'Keen', 'Lazy', 'Mighty', 'Nimble', 'Oceanic', 'Quick', 'Radiant',
    'Scaly', 'Tidal', 'Vibrant', 'Wild', 'Zesty', 'Tropical', 'Coastal'
];

const fishNouns = [
    'Shark', 'Dolphin', 'Whale', 'Tuna', 'Salmon', 'Bass', 'Clownfish', 'Guppy',
    'Marlin', 'Orca', 'Puffer', 'Ray', 'Snapper', 'Trout', 'Walleye', 'Angler',
    'Barracuda', 'Cod', 'Eel', 'Flounder', 'Grouper', 'Halibut', 'Koi', 'Lobster',
    'Mackerel', 'Octopus', 'Perch', 'Sardine', 'Tetra', 'Urchin'
];

/**
 * Generates a random fish-themed nickname.
 * @returns {string} A random nickname like "SaltyShark" or "NeonDolphin".
 */
export const generateRandomFishNickname = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const fish = fishNouns[Math.floor(Math.random() * fishNouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${fish}${num}`;
};
