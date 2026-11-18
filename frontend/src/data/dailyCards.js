const AFFIRMATIONS = [
  "You don't have to do it all today. One small thing, done well, counts.",
  "Progress is quiet. Showing up again is the whole trick.",
  "Rest is part of the work, not a reward for finishing it.",
  "You are allowed to start again as many times as it takes.",
  "A bad day doesn't erase a good streak. It's just a day.",
  "Be as kind to yourself as you'd be to a friend in your shoes.",
  "Small and consistent beats big and occasional.",
  "You've already survived every hard day so far.",
].map((text) => ({ type: "Affirmation", text }));

const FUN_FACTS = [
  "Octopuses have three hearts, and the main one pauses while they swim.",
  "Honey is so stable that it barely spoils, even after thousands of years.",
  "A day on Venus is longer than its year.",
  "Sharks have been around longer than trees.",
  "Bananas are berries, but strawberries aren't.",
  "Sea otters sometimes hold hands while they sleep so they don't drift apart.",
  "Wombats make cube-shaped poop.",
  "Your brain uses about 20% of your body's energy, at roughly 2% of its weight.",
].map((text) => ({ type: "Fun fact", text }));

const PAIRINGS = [
  "Watermelon, feta and mint. Sweet, salty, cool.",
  "Dark chocolate with a pinch of sea salt.",
  "Apple slices with sharp cheddar.",
  "Strawberries with a drizzle of balsamic vinegar.",
  "Mango with lime and a little chili.",
  "Pol sambol on warm bread.",
  "Honey over salty cheese like feta or parmesan.",
  "Coffee with a pinch of cardamom.",
].map((text) => ({ type: "Food pairing", text }));

// Interleave so categories rotate day by day
export const DAILY_CARDS = AFFIRMATIONS.flatMap((a, i) => [
  a,
  FUN_FACTS[i],
  PAIRINGS[i],
]);

export function getCardForDate(dateStr) {
  const dayNumber = Math.floor(Date.parse(dateStr) / 86400000);
  return DAILY_CARDS[dayNumber % DAILY_CARDS.length];
}
