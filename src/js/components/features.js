/**
 * Features & Cosmic Space Jokes Controller
 * Handles interactive joke randomizer and punchline reveals
 */

export const spaceJokes = [
  {
    id: 1,
    setup: "Why did the Sun go to school?",
    punchline: "To get brighter! ☀️🎓"
  },
  {
    id: 2,
    setup: "How do you organize a space party?",
    punchline: "You planet! 🪐🎉"
  },
  {
    id: 3,
    setup: "Why couldn't the astronaut book a room on the Moon?",
    punchline: "Because it was full! 🌕🏨"
  },
  {
    id: 4,
    setup: "What kind of music do planets listen to?",
    punchline: "Nep-tunes! 🎶🌊"
  },
  {
    id: 5,
    setup: "Why did Mickey Mouse go into outer space?",
    punchline: "To find Pluto! 🚀🐕"
  },
  {
    id: 6,
    setup: "How does the solar system hold up its pants?",
    punchline: "With an asteroid belt! ☄️👖"
  },
  {
    id: 7,
    setup: "What is an astronaut's favorite key on the keyboard?",
    punchline: "The Space bar! ⌨️🧑‍🚀"
  },
  {
    id: 8,
    setup: "Why did the alien sit on the computer?",
    punchline: "To keep an eye on the space bar! 👽💻"
  },
  {
    id: 9,
    setup: "Why did Venus break up with Mars?",
    punchline: "She needed some space! 💔🚀"
  },
  {
    id: 10,
    setup: "What do stars eat for breakfast?",
    punchline: "Quarks and milk! 🥣⭐"
  },
  {
    id: 11,
    setup: "How do astronauts eat soup in zero gravity?",
    punchline: "With a flying saucer! 🛸🥣"
  },
  {
    id: 12,
    setup: "What was the first animal to travel to outer space?",
    punchline: "The cow that jumped over the moon! 🐄🌙"
  },
  {
    id: 13,
    setup: "What do you call a tick on the Moon?",
    punchline: "A luna-tick! 🌘🕷️"
  },
  {
    id: 14,
    setup: "What did Mars say to Saturn?",
    punchline: "Give me a ring sometime! 🪐📞"
  },
  {
    id: 15,
    setup: "Why did the star go to the hospital?",
    punchline: "It was feeling supernova! 💥🏥"
  }
];

export function initFeaturesPage() {
  const jokeBtn = document.getElementById('random-joke-btn');
  const setupEl = document.getElementById('random-joke-setup');
  const punchlineEl = document.getElementById('random-joke-punchline');
  const revealBtn = document.getElementById('reveal-punchline-btn');

  if (!setupEl || !punchlineEl) return;

  let currentIdx = -1;

  function pickRandomJoke() {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * spaceJokes.length);
    } while (nextIdx === currentIdx && spaceJokes.length > 1);

    currentIdx = nextIdx;
    const joke = spaceJokes[currentIdx];

    setupEl.textContent = joke.setup;
    punchlineEl.textContent = joke.punchline;
    punchlineEl.classList.remove('is-revealed');
    if (revealBtn) {
      revealBtn.style.display = 'inline-flex';
    }
  }

  if (jokeBtn) {
    jokeBtn.addEventListener('click', () => {
      pickRandomJoke();
    });
  }

  if (revealBtn) {
    revealBtn.addEventListener('click', () => {
      punchlineEl.classList.add('is-revealed');
      revealBtn.style.display = 'none';
    });
  }

  // Hook all static joke cards
  const cards = document.querySelectorAll('.static-joke-card');
  cards.forEach(card => {
    const pl = card.querySelector('.joke-punchline');
    const btn = card.querySelector('.joke-reveal-btn');
    if (pl && btn) {
      btn.addEventListener('click', () => {
        const isShown = pl.classList.toggle('is-revealed');
        btn.textContent = isShown ? 'Hide ✕' : 'Reveal ✨';
      });
    }
  });

  // Pick first joke initially
  pickRandomJoke();
}
