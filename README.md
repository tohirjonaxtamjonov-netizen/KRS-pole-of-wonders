# KRS — POLE OF WONDERS (Mo‘jizalar maydoni)

A classroom game for 3 teams. Open `index.html` in a browser and play. No installation needed.

## 1. What each file does
- `index.html` — the page structure (buttons, areas).
- `style.css` — colors, layout, animations.
- `script.js` — all game rules (wheel, turns, scoring, podium). Do not edit unless you know JavaScript.
- `questions.js` — the questions and hidden answers.
- `config.js` — the game title and the 3 team names.
- `README.md` — this guide.

## 2. Change the title and team names
Open `config.js`, change only the text inside the quotes, save. Scores and rules are not affected.

### Change the wheel chances
In `config.js`, edit the numbers under `wheelChances`. They are the percent chance of each result, and they should add up to 100 (if not, the game scales them to 100). The wheel always keeps 20 equal-size sectors.

## 3. Replace or add questions
Open `questions.js`. Each question looks like this:
`{ question: "Your question?", answer: "ANSWER" },`
Copy a line to add a question, delete a line to remove one. Every line ends with a comma except the last. Answers may contain spaces. Write answers in capital letters using only the 26 letters A–Z (the keyboard is QWERTY). Spaces are allowed. The number of rounds equals the number of questions.

## 4. Test locally
Put all files in one folder and double-click `index.html`. Use Chrome, Edge, or Firefox. Press F11 for full screen on the projector.

## 5. Create a GitHub repository
Sign in at github.com → click **+** (top right) → **New repository** → name it, choose **Public**, do not tick "Add a README" → **Create repository**.

## 6. Upload the files
In your repository click **Add file → Upload files**, drag all 6 files in (`index.html` must be at the top level, not inside a folder), then click **Commit changes**.

## 7. Turn on GitHub Pages
**Settings → Pages → Source: Deploy from a branch → Branch: main, folder: / (root) → Save.**

## 8. Get your public link
Wait 1–2 minutes and refresh the Pages screen. The link appears at the top, like `https://YOURNAME.github.io/REPOSITORY/`.

## 9. Update the game later
**Add file → Upload files**, upload the changed file with the same name (for example `questions.js`), click **Commit changes**. The link updates in about a minute. If you still see the old version, press Ctrl+F5.

## Rules in short
Teams play 1 → 2 → 3 → 1 → 2 → 3 … each turn starts with 3 opportunities (one spin = one letter). The round continues until the whole word is found, either letter by letter or with GUESS THE WORD (+1000, available before a spin; a wrong guess costs one opportunity), or until you press FINISH GAME. BANKRUPT removes the spin plus one more opportunity. +1 LETTER: the team taps any empty box in the word and that letter is revealed everywhere (no points). FINISH GAME ignores the unfinished round's Round Scores. If teams tie for first, ask the leader for a live tie-break question.
