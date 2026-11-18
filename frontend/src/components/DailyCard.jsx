import { Sparkles, Heart, Lightbulb, Utensils } from "lucide-react";
import FlipCard from "./FlipCard";
import { getTodayString } from "../utils/dateHelpers";
import { getCardForDate } from "../data/dailyCards";

const TYPE_ICONS = {
  Affirmation: Heart,
  "Fun fact": Lightbulb,
  "Food pairing": Utensils,
};

function readFlipped(key) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function saveFlipped(key, flipped) {
  if (flipped) localStorage.setItem(key, "1");
  else localStorage.removeItem(key);
}

function DailyCard() {
  const today = getTodayString();
  const card = getCardForDate(today);
  const storageKey = `dailyCard:${today}`;
  const TypeIcon = TYPE_ICONS[card.type] || Sparkles;

  return (
    <div className="daily-card-wrap">
      <FlipCard
        key={today}
        width={280}
        height={230}
        radius={20}
        background="var(--surface)"
        color="var(--text-primary)"
        shadowColor="#504a28"
        shadowOpacity={0.22}
        glareOpacity={0.14}
        tiltMax={8}
        defaultFlipped={readFlipped(storageKey)}
        onFlipChange={(isBack) => saveFlipped(storageKey, isBack)}
        ariaLabel="Reveal today's card"
        front={
          <div className="daily-card-front">
            <Sparkles size={26} strokeWidth={1.6} />
            <h4>
              Today's <span className="brand-accent-light">card</span>
            </h4>
            <span className="daily-card-hint">TAP TO REVEAL</span>
          </div>
        }
        back={
          <div className="daily-card-back">
            <span className="daily-card-tag">
              <TypeIcon size={11} strokeWidth={2.2} />
              {card.type.toUpperCase()}
            </span>
            <p className="daily-card-text">{card.text}</p>
          </div>
        }
      />
    </div>
  );
}

export default DailyCard;
