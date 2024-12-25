const banners = { // Updated banners with 4-star characters
    1: { // Limited Character Banner 1
        characters5: ['Dehya', 'Diluc', 'Mona', 'Jean', 'Tighnary', 'Qiqi', 'Keqing'],
        featuredCharacters5: ['Yoimiya'],
        weapons5: [], // No 5-star weapons on this banner
        characters4: ['Faruzan', 'Collei', 'Yun Jin', 'Kuki Shinobu', 'Heizou', 'Gorou', 'Dori', 'Candace', 'Layla', 'Sayu', 'Yaoyao', 'Mika', 'Kaveh', 'Kirara', 'Freminet', 'Lynette', 'Chevreuse', 'Charlotte', 'Gaming', 'Sethos', 'Xingqiu', 'Sucrose', 'Noelle', 'Chongyun', 'Beidou', 'Fischl', 'Bennett', 'Razor', 'Barbara', 'Diona', 'Xinyan', 'Rosaria', 'Yanfei', 'Sara', 'Ororon', 'Kachina'],
        featuredCharacters4: ['Diona', 'Bennett', 'Chevreuse'],
        weapons4: ['Dragon`s Bane', 'Eye of Perception', 'Favonius Codex', 'Favonius Greatsword', 'Favonius Lance', 'Favonius Sword', 'Favonius Warbow', 'Lion`s Roar', 'Rainslasher', 'Rust', 'Sacrificial Bow', 'Sacrificial Fragments', 'Sacrificial Greatsword', 'Sacrificial Sword', 'The Bell', 'The Flute', 'The Stringless', 'The Widsth'],
        weapons3: ['Slingshot', 'Raven Bow', 'Emerald Orb', 'Thrilling Tales of Dragon Slayers', 'Magic Guide', 'Black Tassel', 'Debate Club', 'Bloodtainted Greatsword', 'Ferrous Shadow', 'Skyrider Sword', 'Harbinger of Dawn', 'Cool Steel'],
        "5starRate": 0.006,
        "4starRate": 0.057,
        "3starRate": 0.937,
        "featured5starRate": 0.003, // Half of the regular 5-star rate to represent the 50/50 chance
    },
    2: { // Limited Character Banner 2
        characters5: ['Dehya', 'Diluc', 'Mona', 'Jean', 'Tighnary', 'Qiqi', 'Keqing'],
        featuredCharacters5: ['Tartaglia'],
        weapons5: [], // No 5-star weapons on this banner
        characters4: ['Faruzan', 'Collei', 'Yun Jin', 'Kuki Shinobu', 'Heizou', 'Gorou', 'Dori', 'Candace', 'Layla', 'Sayu', 'Yaoyao', 'Mika', 'Kaveh', 'Kirara', 'Freminet', 'Lynette', 'Chevreuse', 'Charlotte', 'Gaming', 'Sethos', 'Xingqiu', 'Sucrose', 'Noelle', 'Chongyun', 'Beidou', 'Fischl', 'Bennett', 'Razor', 'Barbara', 'Diona', 'Xinyan', 'Rosaria', 'Yanfei', 'Sara', 'Ororon', 'Kachina'],
        featuredCharacters4: ['Diona', 'Bennett', 'Chevreuse'],
        weapons4: ['Dragon`s Bane', 'Eye of Perception', 'Favonius Codex', 'Favonius Greatsword', 'Favonius Lance', 'Favonius Sword', 'Favonius Warbow', 'Lion`s Roar', 'Rainslasher', 'Rust', 'Sacrificial Bow', 'Sacrificial Fragments', 'Sacrificial Greatsword', 'Sacrificial Sword', 'The Bell', 'The Flute', 'The Stringless', 'The Widsth'],
        weapons3: ['Slingshot', 'Raven Bow', 'Emerald Orb', 'Thrilling Tales of Dragon Slayers', 'Magic Guide', 'Black Tassel', 'Debate Club', 'Bloodtainted Greatsword', 'Ferrous Shadow', 'Skyrider Sword', 'Harbinger of Dawn', 'Cool Steel'],
        "5starRate": 0.006,
        "4starRate": 0.057,
        "3starRate": 0.937,
        "featured5starRate": 0.003, // Half of the regular 5-star rate to represent the 50/50 chance
    },
    3: { // Weapon Banner
        characters5: [],
        weapons5: ['Thundering Pulse', 'Polar Star', 'Skyward Harp', 'Amos\' Bow', 'Lost Prayer to the Sacred Winds', 'Skyward Atlas', 'Skyward Pride', 'Skyward Spine', 'Primordial Jade Winged-Spear', 'Wolf\'s Gravestone', 'Aquila Favonia'],
        featuredWeapons5: ['Thundering Pulse', 'Polar Star'],
        characters4: ['Faruzan', 'Collei', 'Yun Jin', 'Kuki Shinobu', 'Heizou', 'Gorou', 'Dori', 'Candace', 'Layla', 'Sayu', 'Yaoyao', 'Mika', 'Kaveh', 'Kirara', 'Freminet', 'Lynette', 'Chevreuse', 'Charlotte', 'Gaming', 'Sethos', 'Xingqiu', 'Sucrose', 'Noelle', 'Chongyun', 'Beidou', 'Fischl', 'Bennett', 'Razor', 'Barbara', 'Diona', 'Xinyan', 'Rosaria', 'Yanfei', 'Sara', 'Ororon', 'Kachina'],
        weapons4: ['Sturdy Bone', 'Fruitful Hook', 'Mountain-Bracing Bolt', 'Wavering Whirl', 'Flower-Wreathed Feathers', 'Dragon`s Bane', 'Eye of Perception', 'Favonius Codex', 'Favonius Greatsword', 'Favonius Lance', 'Favonius Sword', 'Favonius Warbow', 'Lion`s Roar', 'Rainslasher', 'Rust', 'Sacrificial Bow', 'Sacrificial Fragments', 'Sacrificial Greatsword', 'Sacrificial Sword', 'The Bell', 'The Flute', 'The Stringless', 'The Widsth'],
        featuredWeapons4: ['Sturdy Bone', 'Fruitful Hook', 'Mountain-Bracing Bolt', 'Wavering Whirl', 'Flower-Wreathed Feathers'],
        weapons3: ['Slingshot', 'Raven Bow', 'Emerald Orb', 'Thrilling Tales of Dragon Slayers', 'Magic Guide', 'Black Tassel', 'Debate Club', 'Bloodtainted Greatsword', 'Ferrous Shadow', 'Skyrider Sword', 'Harbinger of Dawn', 'Cool Steel'],
        "5starRate": 0.007,
        "4starRate": 0.06,
        "3starRate": 0.933,
        "featured5starRate": 0.0035, // Half of the regular 5-star rate to represent the 50/50 chance
        "featured4starRate": 0.03, // Half of regular 4 star
    },
    4: { // Standart Banner
        characters5: ['Dehya', 'Diluc', 'Mona', 'Jean', 'Tighnary', 'Qiqi', 'Keqing'],
        weapons5: ['Amos Bow', 'Lost Prayer to the Sacred Winds', 'Primordial Jade Winged-Spear', 'Wolf`s Gravestone', 'Aquila Favonia', 'Skyward Harp'],
        characters4: ['Faruzan', 'Collei', 'Yun Jin', 'Kuki Shinobu', 'Heizou', 'Gorou', 'Dori', 'Candace', 'Layla', 'Sayu', 'Yaoyao', 'Mika', 'Kaveh', 'Kirara', 'Freminet', 'Lynette', 'Chevreuse', 'Charlotte', 'Gaming', 'Sethos', 'Xingqiu', 'Sucrose', 'Noelle', 'Chongyun', 'Beidou', 'Fischl', 'Bennett', 'Razor', 'Barbara', 'Diona', 'Xinyan', 'Rosaria', 'Yanfei', 'Sara', 'Ororon', 'Kachina'],
        weapons4: ['Dragon`s Bane', 'Eye of Perception', 'Favonius Codex', 'Favonius Greatsword', 'Favonius Lance', 'Favonius Sword', 'Favonius Warbow', 'Lion`s Roar', 'Rainslasher', 'Rust', 'Sacrificial Bow', 'Sacrificial Fragments', 'Sacrificial Greatsword', 'Sacrificial Sword', 'The Bell', 'The Flute', 'The Stringless', 'The Widsth'],
        weapons3: ['Slingshot', 'Raven Bow', 'Emerald Orb', 'Thrilling Tales of Dragon Slayers', 'Magic Guide', 'Black Tassel', 'Debate Club', 'Bloodtainted Greatsword', 'Ferrous Shadow', 'Skyrider Sword', 'Harbinger of Dawn', 'Cool Steel'],
        "5starRate": 0.006,
        "4starRate": 0.057,
        "3starRate": 0.937,
    }
};
export default banners;
