export const SUSPECTS = [
  { name: 'Red',    color: '#c51111', dark: '#8a0a0a' },
  { name: 'Blue',   color: '#1538d1', dark: '#0b1a8a' },
  { name: 'Green',  color: '#11802b', dark: '#0a5a1d' },
  { name: 'Purple', color: '#7b2fbe', dark: '#4e1a85' },
  { name: 'Yellow', color: '#c8b800', dark: '#8a7d06' },
];

export const EXTRAS = [
  { name: 'Orange', color: '#f07d0c', dark: '#a85208' },
  { name: 'White',  color: '#d6e0f0', dark: '#8a96a8' },
  { name: 'Black',  color: '#3d3d3d', dark: '#1a1a1a' },
  { name: 'Pink',   color: '#ee54bb', dark: '#a82e80' },
  { name: 'Tan',    color: '#c29b6a', dark: '#8a6a3f' },
  { name: 'Lime',   color: '#4cff50', dark: '#29a82d' },
  { name: 'Maroon', color: '#6b2737', dark: '#3d1016' },
  { name: 'Coral',  color: '#ec7578', dark: '#a83a3c' },
];

export const GUARDIAN_ANGEL_LINES = [
  '"Hello? Can anyone hear me? ...No. Right. Okay."',
  '"I\'m still here, you know. Just... floating. It\'s fine."',
  '"Being dead is somehow exactly as boring as being alive. Minus the tasks."',
  '"I tried to point at the killer but nobody could see me. Very frustrating."',
  '"In case it matters, I was NOT having a good day even before all this."',
  '"I\'m watching everything unfold from up here and I have so many notes."',
  '"No one has fixed the oxygen yet, by the way. I\'m just saying."',
  '"From where I\'m standing — or floating, technically — nothing makes sense."',
];

export const GUARDIAN_ANGEL_EVIDENCE = {
  room:   [
    r => `"Wait — I remember now. It happened in ${r}. I\'m sure of it."`,
    r => `"I\'m piecing it together... I was near ${r} when everything went dark."`,
    r => `"The last place I remember being... it was ${r}. That\'s where it happened."`,
    r => `"${r}. That\'s the room. I didn\'t understand at the time, but now I do."`,
  ],
  weapon: [
    w => `"I saw a ${w} right before... well. You know. A ${w}. That\'s all I\'ll say."`,
    w => `"Whatever hit me — it was a ${w}. I got a very clear look, briefly."`,
    w => `"A ${w} was the last thing I saw. I\'m almost certain about that part."`,
    w => `"If I had to guess — and I don\'t, because I\'m dead and I know — it was the ${w}."`,
  ],
};

export const SILLY_LINES = [
  '"I was just eating my spaghetti. Does no one care about my spaghetti?"',
  '"I think the vents are haunted. Unrelated to the murder, I just wanted someone to know."',
  '"My tasks were so hard today. Admin? More like BADmin. Anyway."',
  '"I saw something weird but I got distracted by a button and pressed it for like ten minutes."',
  '"Not to be dramatic but I\'ve been having a really tough week, you know?"',
  '"I feel like nobody ever listens to me at these meetings. Like, ever."',
  '"I pressed the big red button earlier but I don\'t think that was related."',
  '"I was in the cafeteria but I wasn\'t really paying attention because I was thinking about soup."',
  '"Whatever. I don\'t even care who did it. Actually I do care. But whatever."',
  '"I tried to fix the oxygen but I don\'t know where it is. Still don\'t."',
];

export const ROOMS = [
  { name: 'Cafeteria',  emoji: '🍽️' },
  { name: 'Electrical', emoji: '⚡' },
  { name: 'Navigation', emoji: '🧭' },
  { name: 'MedBay',     emoji: '💊' },
  { name: 'Reactor',    emoji: '⚛️' },
  { name: 'O2',         emoji: '💨' },
  { name: 'Security',   emoji: '🔒' },
  { name: 'Shields',    emoji: '🛡️' },
];

export const WEAPONS = [
  { name: 'Wrench',        emoji: '🔧' },
  { name: 'Kitchen Knife', emoji: '🔪' },
  { name: 'Stop Sign',     emoji: '🛑' },
  { name: 'Bone',          emoji: '🦴' },
  { name: 'Hammer',        emoji: '🔨' },
  { name: 'Screwdriver',   emoji: '🪛' },
];

export const TMPL = {
  alibi: [
    r => `"I was running diagnostics in ${r}. I never left."`,
    r => `"I was doing repairs in ${r} when the alarm went off."`,
    r => `"I was fixing the wiring in ${r} the whole time."`,
    r => `"I was in ${r}. I didn't go anywhere near the incident."`,
    r => `"I spent the entire time working in ${r}. Didn't move once."`,
    r => `"My tasks were all in ${r}. I was there until the meeting was called."`,
    r => `"I was calibrating equipment in ${r}. Boring but I was definitely there."`,
  ],
  backing: [
    (o, r) => `"I can confirm ${o} was in ${r}. I saw them there."`,
    (o, r) => `"${o} was in ${r} — I walked right past them."`,
    (o, r) => `"I saw ${o} working in ${r}. They didn't go anywhere."`,
    (o, r) => `"${o} was definitely in ${r} when it happened."`,
    (o, r) => `"I passed through ${r} and ${o} was there doing tasks."`,
    (o, r) => `"${o}? Yeah, I saw them in ${r}. Not sure for how long though."`,
    (o, r) => `"I noticed ${o} in ${r} earlier. They looked busy."`,
  ],
  killerLie: [
    r => `"I was in ${r} doing tasks the whole time. I swear I didn't do anything wrong!"`,
    r => `"Check ${r} — that's where I was. I have absolutely nothing to hide!"`,
    r => `"I was doing repairs in ${r} when the alarm went off. I'm completely innocent!"`,
    r => `"Ask anyone — I was in ${r} the whole time, just doing my job."`,
    r => `"I never left ${r}. You can check the logs if you want."`,
    r => `"My entire shift was spent in ${r}. I don't know why anyone would suspect me."`,
  ],
  accusation: [
    (k, r) => `"${k} is lying! I was in ${r} the whole time and they were NEVER there!"`,
    (k, r) => `"${k} was NOT in ${r}. I was there and I never saw them. They're making it up!"`,
    (k, r) => `"I don't care what ${k} told you — they were not in ${r}. I would have seen them."`,
    (k, r) => `"${k} is lying about being in ${r}. I never left that room and they weren't there."`,
    (k, r) => `"${k} claims they were in ${r}? That's impossible. I was there the entire time."`,
  ],
  roomHint: [
    r => `"I found the body near ${r}! I panicked and called the emergency meeting immediately!"`,
    r => `"I heard a horrible crash from ${r} and then the lights cut out. Something happened in there."`,
    r => `"I walked past ${r} and the door was forced open. I saw the scene and ran to call a meeting!"`,
    r => `"The body was just outside ${r}. I almost didn't see it in the dark."`,
    r => `"I stumbled on the scene near ${r} and immediately hit the emergency button."`,
  ],
  roomCorr: [
    r => `"I was near ${r} when I heard a loud bang. I didn't stop to look."`,
    r => `"The lights were flickering near ${r} right before the alarm went off."`,
    r => `"I saw someone sprinting away from ${r} just before the emergency meeting was called."`,
    r => `"There was some kind of commotion near ${r} earlier. I figured it was just equipment."`,
    r => `"I noticed the door to ${r} was left wide open. That's unusual."`,
  ],
  weaponHint: [
    w => `"The ${w} was missing from where it's always stored! Someone took it before this happened."`,
    w => `"I checked storage earlier and the ${w} was just gone. That's never happened before."`,
    w => `"I noticed the ${w} wasn't in its place. I thought it was weird — now I know why."`,
    w => `"Someone moved the ${w}. It wasn't where we keep it."`,
    w => `"The ${w} is unaccounted for. I looked everywhere and couldn't find it."`,
  ],
  weaponCorr: [
    (w, r) => `"I noticed a ${w} near ${r} earlier. I don't remember it being there before."`,
    (w, r) => `"There was a ${w} on the floor near ${r}. I just walked past it — didn't think much of it."`,
    (w, r) => `"I saw a ${w} sitting near ${r} at some point. Not sure if that's relevant."`,
    (w, r) => `"A ${w} was near the entrance to ${r}. Could be nothing, but it caught my eye."`,
    (w, r) => `"Someone left a ${w} near ${r}. I almost tripped over it."`,
    (w, r) => `"I spotted a ${w} just outside ${r} earlier today. Odd place for it."`,
  ],
  rhAccuse: [
    (a, b) => `"It was ${b}!! I KNOW it was ${b}!! Don't ask me how I know, I just know!!"`,
    (a, b) => `"${b} did it. I'm not arguing about this."`,
    (a, b) => `"I am BEGGING everyone to look at ${b}. BEGGING."`,
    (a, b) => `"${b}. That's it. That's my whole statement. ${b}."`,
    (a, b) => `"I've been saying it since day one: ${b}. Nobody listened. Well? NOW will you listen?!"`,
    (a, b) => `"Something about ${b} has always been off and I will die on this hill."`,
    (a, b) => `"You want to know who did it? ${b}. You're welcome."`,
    (a, b) => `"I don't have evidence. I don't need evidence. It was ${b}."`,
    (a, b) => `"${b} has shifty eyes. That's not an accusation, that's a fact. But also an accusation."`,
    (a, b) => `"I can't prove it but ${b} is ABSOLUTELY responsible and I'll stake my life on it."`,
  ],
  rhRoom: [
    (n, r) => `"I saw ${n} in ${r} earlier. They seemed totally normal."`,
    (n, r) => `"${n} was near ${r} before everything happened. Probably nothing."`,
    (n, r) => `"I passed through ${r} and bumped into ${n}. They looked a little nervous, honestly."`,
    (n, r) => `"${n} was hanging around outside ${r} for a while. I didn't think anything of it."`,
    (n, r) => `"I spotted ${n} heading toward ${r} earlier. No idea if they went in."`,
  ],
  rhWeapon: [
    (n, w) => `"${n} had the ${w} last time I saw it. They were using it for repairs, I think."`,
    (n, w) => `"I saw ${n} put the ${w} back in storage earlier. At least, I thought that's what they did."`,
    (n, w) => `"The ${w} was near ${n}'s workstation earlier today."`,
    (n, w) => `"${n} was carrying a ${w} earlier. Said they needed it for a task."`,
  ],
  rhBehavior: [
    n => `"${n} was acting really weird and jumpy before the alarm."`,
    n => `"I noticed ${n} looking around nervously in the hallway earlier."`,
    n => `"${n} was avoiding eye contact with everyone before the meeting."`,
    n => `"${n} kept checking over their shoulder when I walked past. Strange."`,
    n => `"${n} seemed distracted and on edge before the alarm. Probably nothing."`,
  ],
  killerDeflect: [
    n => `"Why is everyone looking at me?? Look at ${n}! They were acting so suspicious before all this!"`,
    n => `"Honestly? I think ${n} did it. I saw them near where it happened right before the alarm went off."`,
    n => `"I'm telling you, it's ${n}. I saw them with the weapon earlier — just ask around!"`,
    n => `"Nobody's talking about ${n} but they should be. I saw some very strange things coming from them."`,
    n => `"I don't want to accuse anyone, but... ${n} was acting really off earlier. I'd look there first."`,
    n => `"Has anyone else noticed ${n} being weird? Because I have. Just saying."`,
    n => `"I think we're looking at the wrong person. ${n} was near the scene. Why isn't anyone asking them?"`,
  ],
};

export const KILL_RISKS = [0, 10, 20, 30, 40, 100];
