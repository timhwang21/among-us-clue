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
  '"I have so many tasks left. Not that it matters now. Kind of matters though."',
  '"I keep forgetting which color I am. Red? No. Anyway."',
  '"Someone ate my snacks in the cafeteria and honestly that feels relevant."',
  '"I got stuck in a vent for like five minutes. Procedurally. Anyway."',
  '"The map makes no sense. I walked into a wall twice before the alarm even went off."',
  '"I started doing my tasks but then I got distracted by a blinking light and here we are."',
  '"I don\'t know what half the rooms do. Shields? Shields from what? Anyway."',
  '"I spilled something in MedBay earlier. Probably unrelated. Almost certainly unrelated."',
];

// Personality-specific flavor lines.
export const PERSONALITY_LINES = {
  hysterical: [
    n => `"EVERYONE look at ${n}. LOOK. Why is no one looking?!"`,
    n => `"I have a very bad feeling about ${n} and I won\'t be explaining further."`,
    n => `"${n} did it. I know it in my soul. My SOUL."`,
    n => `"Why is everyone so calm?! ${n} is RIGHT THERE."`,
    n => `"I\'m begging. BEGGING. Just look at ${n} for ONE second."`,
    n => `"${n}. It\'s ${n}. We\'re done here. Go home."`,
    n => `"My gut says ${n}. My gut has never been wrong. My gut once saved my life in Navigation."`,
    n => `"I\'m not being hysterical. You\'re being hysterical. Also ${n} did it."`,
  ],
  peacemaker: [
    '"Everyone please take a breath. We can figure this out together if we stay calm."',
    '"Let\'s focus on the clues and not on pointing fingers, okay? That\'s how we win."',
    '"I know it\'s scary but we need to work as a team right now."',
    '"Can we all agree to just share what we know? No accusations yet."',
    '"Maybe we skip this vote. We don\'t have enough information to decide fairly."',
    '"Let\'s be logical about this. Everyone gets a chance to speak."',
    '"I really think we should hear everyone out before we jump to conclusions."',
    '"I\'m not saying anyone is right or wrong. I\'m saying we should all just breathe."',
    '"We\'re all stressed. That\'s normal. But let\'s not vote someone out on a feeling."',
    '"If we work together we can solve this. The clues are there. Trust each other."',
  ],
  salty: [
    '"Honestly it\'s obvious. I don\'t know why we\'re still here."',
    '"I solved this ten minutes ago. No one listened. As usual."',
    '"This is not complicated. I genuinely don\'t understand the confusion."',
    '"Some people here are really making this harder than it needs to be."',
    '"I have been saying this from the START. Does anyone read the clues? Anyone?"',
    '"The answer is staring everyone in the face. I\'m so tired."',
    '"Fine. Don\'t listen to me. Vote whoever you want. It\'ll be wrong, but fine."',
    '"I\'ve already figured it out. I\'m just waiting for everyone else to catch up."',
    '"Every meeting. Every single meeting. We go in circles."',
    '"If I have to explain the trust chain one more time I am going to lose my mind."',
  ],
  overconfident: [
    '"I\'ve basically already figured it out. It\'s obvious when you know what to look for."',
    '"I\'ve solved things like this before. This one\'s not even subtle."',
    '"Statistically speaking, I\'ve narrowed it down significantly. I won\'t say more until I\'m ready."',
    '"I have a theory but I\'m keeping it close. Don\'t want to spook anyone."',
    '"Some of you are looking at this all wrong. I figured it out a while ago."',
    '"I\'ve been tracking behavioral patterns since this started. The data is pointing somewhere very clear."',
    '"My analysis is basically complete. Just confirming one last thing."',
    '"I noticed something the rest of you clearly missed. That\'s all I\'ll say for now."',
    '"Trust me, I know who it is. I just need the room and the weapon and I\'m done."',
    '"I\'ve already solved it in my head. I\'m just waiting for everyone else to catch up."',
  ],
};

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
  killerContradict: [
    (k, r) => `"I passed through ${r} multiple times that shift. ${k} was not there. Not once."`,
    (k, r) => `"I went through ${r} — ${k} was nowhere to be found. Their alibi is a lie."`,
    (k, r) => `"${k} said ${r}? I was in and out of there all shift. They were never there."`,
    (k, r) => `"I checked ${r} during my rounds. ${k} was not there. I would have seen them."`,
    (k, r) => `"I can say with certainty that ${k} was not in ${r}. I passed through. They weren't there."`,
    (k, r) => `"${k} claims ${r}? I walked through ${r} that shift. ${k} was nowhere in sight."`,
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
  weaponElim: [
    w => `"I had the ${w} for repairs most of this shift. It's accounted for."`,
    w => `"The ${w} was with me the whole time — I returned it to storage myself."`,
    w => `"I checked on the ${w} earlier. It's right where it should be."`,
    w => `"I was using the ${w} for a task. I can personally account for it."`,
    w => `"The ${w} is fine — I had it all shift for assigned maintenance."`,
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
  killerDenyRoom: [
    (n, r) => `"${n} wasn't in ${r}. I was in the area — I would have noticed."`,
    (n, r) => `"${n} claims ${r}? I went through there that shift. They weren't around."`,
    (n, r) => `"${n} was NOT in ${r}. I can say that with confidence."`,
    (n, r) => `"Don't trust ${n} about ${r}. I was nearby. They weren't there."`,
    (n, r) => `"${n} is lying about ${r}. I would have seen them if they were actually there."`,
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
  witnessSuspect: [
    k => `"It was ${k}. I saw them do it — I just didn't want to be the one to say it."`,
    k => `"I watched ${k} slip away from the scene right after it happened. It was ${k}, I'm certain."`,
    k => `"${k} is the impostor. I saw the whole thing with my own eyes."`,
    k => `"Stop looking at everyone else — it was ${k}. I caught them in the act."`,
    k => `"There's no doubt in my mind: ${k} did it. I saw them at the scene."`,
  ],
  witnessWeapon: [
    (k, w) => `"I saw ${k} carrying the ${w}. It was right before everything happened."`,
    (k, w) => `"${k} had the ${w} earlier. I didn't think much of it — now I do."`,
    (k, w) => `"I walked past ${k} and they were holding a ${w}. I remember it clearly."`,
    (k, w) => `"${k} was messing with a ${w} before the alarm went off. Seemed out of place."`,
    (k, w) => `"Pretty sure I saw ${k} with the ${w}. Seemed like an odd thing to be carrying."`,
    (k, w) => `"${k} had the ${w} and seemed to be in a hurry. I didn't say anything at the time."`,
  ],
  witnessRoom: [
    (k, r) => `"I saw ${k} leaving ${r} in a hurry. Right before the alarm went off."`,
    (k, r) => `"${k} was coming out of ${r} just before everything started. They looked... off."`,
    (k, r) => `"I definitely saw ${k} near ${r} right before the alarm. Make of that what you will."`,
    (k, r) => `"${k} was heading into ${r} earlier. Alone. I thought that was a little odd."`,
    (k, r) => `"I passed ${k} outside ${r} not long before the alarm. They seemed like they were trying not to be seen."`,
    (k, r) => `"${k} slipped out of ${r} right around when the incident must have happened."`,
  ],
};

export const INVESTIGATION = {
  weaponElim: [
    (name, emoji) => `Checked the equipment manifest: ${emoji} ${name} was accounted for and undisturbed. Not the murder weapon.`,
    (name, emoji) => `Inventory scan complete — ${emoji} ${name} is still in storage. Rule it out.`,
    (name, emoji) => `Recovered ${emoji} ${name} from its normal location, clean and unused.`,
  ],
  bodyLocation: [
    room => `Admin logs confirmed: the body was recovered in ${room}.`,
    room => `Checked the emergency meeting records — the alert was triggered from ${room}.`,
    room => `Security terminal confirmed: incident occurred in ${room}.`,
    room => `Door sensor logs place the incident in ${room}.`,
  ],
  suspectBehavior: [
    name => `Security footage flagged ${name} for unusual movement near the crime scene around the time of death.`,
    name => `Task completion logs show ${name} was unaccounted for during the estimated window.`,
    name => `Internal comms review: multiple crew independently flagged ${name} as behaving erratically that shift.`,
    name => `Admin map data places ${name} near the murder scene at the time of death.`,
  ],
  alibiContradiction: [
    (name, room) => `Pulled admin logs: ${room} was empty during the window ${name} claimed to be there.`,
    (name, room) => `Door sensors show ${room} was unoccupied at that time — ${name}'s alibi doesn't check out.`,
    (name, room) => `Access logs checked: no entries for ${room} match ${name}'s claimed timeframe.`,
    (name, room) => `Admin records confirm ${name} was not in ${room} when they claimed. Their alibi is false.`,
  ],
  victimJournalRoom: [
    (victimName, room) => `Found ${victimName}'s journal. Last entry: "Something felt wrong near ${room}. I should investigate."`,
    (victimName, room) => `Recovered ${victimName}'s personal log. Final message: "Something off about ${room}. Going to check."`,
  ],
  victimJournalWeapon: [
    (victimName, weapon) => `Found ${victimName}'s last voicemail. They mentioned a ${weapon} going missing earlier that day.`,
    (victimName, weapon) => `Recovered ${victimName}'s notes. Final entry: a ${weapon} was "in the wrong place."`,
  ],
};

export const WEAPON_ELIM = [
  (w, e) => `The ${w} ${e} turned up in its usual spot. Untouched. It's not the murder weapon.`,
  (w, e) => `Checked storage — the ${w} ${e} is exactly where it should be. Ruled out.`,
  (w, e) => `The ${w} ${e} hasn't moved. It wasn't used.`,
  (w, e) => `Someone found the ${w} ${e} in its normal place, no signs of use. Not the weapon.`,
  (w, e) => `Inventory confirms the ${w} ${e} is accounted for and undisturbed.`,
  (w, e) => `The ${w} ${e} was recovered from storage, clean and unmoved. Eliminate it.`,
];

export const KILL_RISKS = [0, 10, 20, 30, 40, 100];
