# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contract.spec.ts >> desktop contract >> HEAD merges into main at Contact and grows to ~24px
- Location: tests/e2e/contract.spec.ts:136:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 22
Received:   10
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - navigation "Main navigation" [ref=e4]:
      - link "DDS" [ref=e5] [cursor=pointer]:
        - /url: "#hero"
      - generic [ref=e6]:
        - link "Work" [ref=e7] [cursor=pointer]:
          - /url: "#work"
        - link "Log" [ref=e8] [cursor=pointer]:
          - /url: "#log"
        - link "Stack" [ref=e9] [cursor=pointer]:
          - /url: "#stack"
        - link "Contact" [ref=e10] [cursor=pointer]:
          - /url: "#contact"
      - generic [ref=e12]:
        - generic "Kathmandu local time" [ref=e13]: 11:32
        - link "Let's Build" [ref=e14] [cursor=pointer]:
          - /url: "#contact"
  - main [ref=e15]:
    - generic:
      - navigation "Branches":
        - 'link "Branch: Digira" [ref=e16] [cursor=pointer]':
          - /url: "#scene-digira"
        - 'link "Branch: Digiragency" [ref=e17] [cursor=pointer]':
          - /url: "#scene-agency"
        - 'link "Branch: Digira Esports" [ref=e18] [cursor=pointer]':
          - /url: "#scene-esports"
        - 'link "Branch: Digira Education" [ref=e19] [cursor=pointer]':
          - /url: "#scene-education"
        - 'link "Branch: NSS Clubs" [ref=e20] [cursor=pointer]':
          - /url: "#scene-nss"
        - 'link "Branch: KrishiSaathi" [ref=e21] [cursor=pointer]':
          - /url: "#scene-krishisaathi"
        - 'link "Branch: NeuroSync" [ref=e22] [cursor=pointer]':
          - /url: "#scene-neurosync"
        - 'link "Branch: Cognitive Mirror" [ref=e23] [cursor=pointer]':
          - /url: "#scene-mirror"
    - region [ref=e24]:
      - paragraph [ref=e25]: Founder & Full Stack Developer
      - heading "I build businesses from scratch to conglomerates ." [level=1] [ref=e26]:
        - generic [ref=e27]: I build businesses
        - generic [ref=e30]: from scratch to
        - generic [ref=e33]:
          - generic [ref=e34]: conglomerates
          - generic [ref=e38]: .
      - paragraph [ref=e39]: Crafting products, systems, and digital experiences from first idea to scalable reality.
      - generic [ref=e40]:
        - link "View Work" [ref=e41] [cursor=pointer]:
          - /url: "#work"
        - link "Start a Project" [ref=e42] [cursor=pointer]:
          - /url: "#contact"
      - list [ref=e43]:
        - listitem [ref=e44]: "Digira: 3 branches"
        - listitem [ref=e45]: "NSS Clubs: 56+ members"
        - listitem [ref=e46]: Kathmandu, Nepal
        - listitem [ref=e47]: Open to projects
    - region [ref=e48]:
      - generic [ref=e49]:
        - heading "Selected Work" [level=2] [ref=e50]
        - paragraph [ref=e51]: A few projects that reflect product thinking, engineering, and design execution.
      - generic [ref=e53]:
        - article [ref=e54]:
          - generic [ref=e55]:
            - heading "Digira" [level=2] [ref=e56]
            - paragraph [ref=e57]: Umbrella
            - paragraph [ref=e58]: main/digira · Founder
            - paragraph [ref=e59]: "Three branches: Digiragency, Digira Esports and Digira Education."
            - paragraph [ref=e60]: Challenge Running several ventures at once means splitting my time between all of them.
            - paragraph [ref=e61]: Outcome Three branches now sit under one umbrella.
        - article [aria-hidden]:
          - generic:
            - heading [level=2]: Digiragency
            - paragraph: Digital agency
            - paragraph: digira/agency · Backend, AI agents, finance
            - paragraph: "A digital agency. My role: backend, AI agents and finance."
          - generic:
            - generic [aria-hidden]:
              - generic: Digiragency
        - article [aria-hidden]:
          - generic:
            - heading [level=2]: Digira Esports
            - paragraph: Esports tournaments
            - paragraph: digira/esports · Event director
            - paragraph: "Mobile Legends: Bang Bang tournaments in Nepal. I plan the events, set the dates, direct the managers who run them, work with sponsors, and handle the main business and finance."
          - generic:
            - generic [aria-hidden]:
              - generic:
                - generic: Digira
                - generic: Esports
        - article [aria-hidden]:
          - generic:
            - heading [level=2]: Digira Education
            - paragraph: Education
            - paragraph: digira/education
            - paragraph: "Building products and solutions that help students learn effectively from scratch, starting with topics rarely taught in Nepal, like robotics. So far: a website for Olympiad enthusiasts, with curriculums and micro-SaaS learning products in progress."
          - generic:
            - generic [aria-hidden]:
              - generic:
                - generic: Digira
                - generic: Education
        - article [aria-hidden]:
          - generic:
            - heading [level=2]: NSS Clubs
            - paragraph: Student organization
            - paragraph: main/nss · President
            - paragraph: 56+ members. Events and Tech Fest.
          - generic:
            - generic [aria-hidden]:
              - generic:
                - generic: NSS
                - generic: Clubs
        - article [aria-hidden]:
          - generic:
            - heading [level=2]: KrishiSaathi
            - paragraph: Agricultural advisory
            - paragraph: main/krishisaathi
            - paragraph: Nepali-language agricultural advisory with ESP32 IoT sensors. A science exhibition project.
            - paragraph: ESP32 / IoT
          - generic:
            - generic [aria-hidden]:
              - generic: KrishiSaathi
        - article [aria-hidden]:
          - generic:
            - heading [level=2]: NeuroSync
            - paragraph: Neuroplasticity and habit tracker
            - paragraph: main/neurosync
            - paragraph: A neuroplasticity and habit tracker with a 3D dotted brain visualization. A science exhibition project.
          - generic:
            - generic [aria-hidden]:
              - generic: NeuroSync
        - article [aria-hidden]:
          - generic:
            - heading [level=2]: Cognitive Mirror
            - paragraph: Personal AI twin
            - paragraph: main/mirror
            - paragraph: A personal AI twin with a cognitive-fidelity research layer. A science exhibition project.
          - generic:
            - generic [aria-hidden]:
              - generic:
                - generic: Cognitive
                - generic: Mirror
        - generic [ref=e66]:
          - button "Previous branch" [disabled] [ref=e67]: ← Prev
          - generic [aria-hidden] [ref=e68]: 01/08
          - button "Next branch" [ref=e69] [cursor=pointer]: Next →
          - status [ref=e70]: "Branch 1 of 8: Digira"
    - region [ref=e71]:
      - generic [ref=e72]:
        - heading "Before and between" [level=2] [ref=e74]
        - list [ref=e75]:
          - listitem [ref=e76]:
            - generic [ref=e78]:
              - heading "Cozmos & Co." [level=3] [ref=e79]
              - paragraph [ref=e80]: Design internship
          - listitem [ref=e81]:
            - generic [ref=e83]:
              - heading "MeroSEO" [level=3] [ref=e84]
              - paragraph [ref=e85]: Next.js development internship
              - paragraph [ref=e87]: Next.js development.
          - listitem [ref=e88]:
            - generic [ref=e90]:
              - heading "Early projects" [level=3] [ref=e91]
              - paragraph [ref=e92]: Placeholder
              - paragraph [ref=e94]: Placeholder entry. Real projects will be added here.
        - paragraph [ref=e96]: Lines show how the ventures relate, not when they happened.
    - region [ref=e97]:
      - generic [ref=e98]:
        - heading "What it runs on." [level=2] [ref=e100]
        - generic [ref=e101]:
          - generic [ref=e102]:
            - button "Frontend Engineering" [pressed] [ref=e104] [cursor=pointer]
            - button "Backend and Agentic Systems" [ref=e106] [cursor=pointer]
            - button "Product and Business" [ref=e108] [cursor=pointer]
          - generic [ref=e109]:
            - list [ref=e110]:
              - listitem [ref=e111]:
                - button "Next.js" [ref=e112] [cursor=pointer]
              - listitem [ref=e113]:
                - generic [ref=e114]: TypeScript
              - listitem [ref=e115]:
                - generic [ref=e116]: Tailwind
            - paragraph [ref=e117]
    - region [ref=e118]:
      - generic [ref=e119]:
        - heading "I don't just build software. I build systems, products, and businesses." [level=2] [ref=e121]
        - list [ref=e122]:
          - listitem [ref=e123]:
            - generic [ref=e125]:
              - generic [ref=e126]: "01"
              - heading "Clarity over complexity" [level=3] [ref=e127]
              - paragraph [ref=e128]: Every system should be understandable at a glance. If it needs a manual, it needs redesign.
          - listitem [ref=e129]:
            - generic [ref=e131]:
              - generic [ref=e132]: "02"
              - heading "Design with intent" [level=3] [ref=e133]
              - paragraph [ref=e134]: Each decision serves the product. Decoration without purpose is noise.
          - listitem [ref=e135]:
            - generic [ref=e137]:
              - generic [ref=e138]: "03"
              - heading "Engineer for scale" [level=3] [ref=e139]
              - paragraph [ref=e140]: Architecture that holds up as it grows. What works for one user has to keep working for many.
    - region [ref=e141]:
      - generic [ref=e142]:
        - generic [ref=e143]:
          - heading "Let's build something exceptional." [level=2] [ref=e145]
          - paragraph [ref=e147]: Open to collaborations, product ideas, and ambitious projects.
          - generic [ref=e148]:
            - generic [ref=e149]:
              - link "Start a Project" [ref=e150] [cursor=pointer]:
                - /url: "#contact-form"
              - link "View GitHub" [ref=e151] [cursor=pointer]:
                - /url: https://github.com/dds3579
            - paragraph [ref=e152]:
              - link "LinkedIn" [ref=e153] [cursor=pointer]:
                - /url: https://www.linkedin.com/in/dds3579
              - link "X" [ref=e154] [cursor=pointer]:
                - /url: https://x.com/dds3579
            - paragraph [ref=e155]: Kathmandu 27.7172° N, 85.3240° E
        - generic [ref=e158]:
          - generic [ref=e159]:
            - generic [ref=e160]: Name
            - textbox "Name" [ref=e161]:
              - /placeholder: Your name
          - generic [ref=e162]:
            - generic [ref=e163]: Email
            - textbox "Email" [ref=e164]:
              - /placeholder: you@example.com
          - generic [ref=e165]:
            - generic [ref=e166]: Project type
            - combobox "Project type" [ref=e167]:
              - option "Select a type" [selected]
              - option "Web application"
              - option "AI / automation"
              - option "Product development"
              - option "Consulting"
              - option "Other"
          - generic [ref=e168]:
            - generic [ref=e169]: Message
            - textbox "Message" [ref=e170]:
              - /placeholder: Tell me about your project...
          - button "Start a Project" [ref=e171] [cursor=pointer]
  - contentinfo [ref=e173]:
    - generic [ref=e174]:
      - generic [ref=e175]:
        - generic [ref=e176]: © Divya Darsheel Sharma
        - generic [ref=e177]: Built with React and Vite
      - generic [ref=e178]:
        - link "Back to top ↑" [ref=e179] [cursor=pointer]:
          - /url: "#hero"
        - generic [ref=e180]: Kathmandu 27.7172° N, 85.3240° E
  - alert [ref=e181]
```

# Test source

```ts
  43  |   await page.evaluate((y) => window.scrollTo(0, y), layout.pinTop + k * L + L / 2);
  44  |   await page.waitForTimeout(1600); // spring settle
  45  | }
  46  | 
  47  | async function centre(page: Page, selector: string) {
  48  |   const b = await page.locator(selector).first().boundingBox();
  49  |   if (!b) throw new Error(`no box for ${selector}`);
  50  |   return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  51  | }
  52  | 
  53  | test.describe('desktop contract', () => {
  54  |   test('no horizontal overflow at desktop widths', async ({ page }) => {
  55  |     for (const width of [1024, 1440, 1920]) {
  56  |       await page.setViewportSize({ width, height: 900 });
  57  |       await page.goto('/');
  58  |       await page.waitForTimeout(600);
  59  |       const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  60  |       expect(sw, `scrollWidth at ${width}`).toBeLessThanOrEqual(iw);
  61  |     }
  62  |   });
  63  | 
  64  |   test('no console errors through a full pass', async ({ page }) => {
  65  |     const errors: string[] = [];
  66  |     page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  67  |     page.on('pageerror', (e) => errors.push(e.message));
  68  |     await load(page);
  69  |     await lift(page);
  70  |     for (let k = 0; k < IDS.length; k++) await scrollToScene(page, k);
  71  |     await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  72  |     await page.waitForTimeout(800);
  73  |     expect(errors).toEqual([]);
  74  |   });
  75  | 
  76  |   test('HEAD takes over the full stop within 1px at t=2.6s', async ({ page }) => {
  77  |     await page.goto('/');
  78  |     await page.waitForFunction(() => performance.now() > 2600);
  79  |     const head = await centre(page, '#head');
  80  |     const stop = await centre(page, '#hero-stop');
  81  |     expect(Math.abs(head.x - stop.x)).toBeLessThanOrEqual(1);
  82  |     expect(Math.abs(head.y - stop.y)).toBeLessThanOrEqual(1);
  83  |   });
  84  | 
  85  |   test("HEAD sits on each scene's commit at the dwell centre", async ({ page }) => {
  86  |     await load(page);
  87  |     await lift(page);
  88  |     for (let k = 0; k < IDS.length; k++) {
  89  |       await scrollToScene(page, k);
  90  |       expect((await debug(page)).index, `index at scene ${k}`).toBe(k);
  91  |       const head = await centre(page, '#head');
  92  |       const commit = await centre(page, `.graph-commit[href="#scene-${IDS[k]}"]`);
  93  |       expect(Math.abs(head.y - commit.y), `y at ${IDS[k]}`).toBeLessThanOrEqual(1);
  94  |       expect(Math.abs(head.x - commit.x), `x at ${IDS[k]}`).toBeLessThanOrEqual(1);
  95  |     }
  96  |   });
  97  | 
  98  |   test('scene index is monotonic and reversible', async ({ page }) => {
  99  |     await load(page);
  100 |     await lift(page);
  101 |     const { layout } = await debug(page);
  102 |     const L = layout.vh * 0.75;
  103 |     const ys: number[] = [];
  104 |     for (let y = layout.pinTop - 100; y < layout.pinTop + 8 * L + 100; y += 150) ys.push(Math.round(y));
  105 |     const read = async (y: number) => {
  106 |       await page.evaluate((v) => window.scrollTo(0, v), y);
  107 |       await page.waitForTimeout(60);
  108 |       return (await debug(page)).index;
  109 |     };
  110 |     const down: number[] = [];
  111 |     for (const y of ys) down.push(await read(y));
  112 |     const up: number[] = [];
  113 |     for (const y of [...ys].reverse()) up.push(await read(y));
  114 |     const inRange = down.filter((i) => i >= 0);
  115 |     expect(inRange).toEqual([...inRange].sort((a, b) => a - b));
  116 |     expect(up.reverse()).toEqual(down);
  117 |   });
  118 | 
  119 |   test('#scene-esports deep link lands on that scene', async ({ page }) => {
  120 |     await load(page, '#scene-esports');
  121 |     await page.waitForTimeout(1200);
  122 |     expect((await debug(page)).index).toBe(2);
  123 |   });
  124 | 
  125 |   test('wash is neutral outside Work and matches the group inside', async ({ page }) => {
  126 |     await load(page);
  127 |     await lift(page);
  128 |     expect(await page.locator('.world-wash[data-on="true"]').count()).toBe(0);
  129 |     await scrollToScene(page, 6); // NeuroSync -> lab
  130 |     await expect(page.locator('.world-wash[data-on="true"]')).toHaveAttribute('data-scene', 'lab');
  131 |     await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  132 |     await page.waitForTimeout(900);
  133 |     expect(await page.locator('.world-wash[data-on="true"]').count()).toBe(0);
  134 |   });
  135 | 
  136 |   test('HEAD merges into main at Contact and grows to ~24px', async ({ page }) => {
  137 |     await load(page);
  138 |     await lift(page);
  139 |     await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  140 |     await page.waitForTimeout(1800);
  141 |     await expect(page.locator('#head')).toHaveClass(/is-merged/);
  142 |     const b = await page.locator('#head').boundingBox();
> 143 |     expect(b!.width).toBeGreaterThan(22);
      |                      ^ Error: expect(received).toBeGreaterThan(expected)
  144 |     expect(b!.width).toBeLessThan(26);
  145 |     expect(Math.abs(b!.x + b!.width / 2 - 12)).toBeLessThanOrEqual(1);
  146 |   });
  147 | 
  148 |   test('inactive scenes are inert and focus never lands in them', async ({ page }) => {
  149 |     await load(page);
  150 |     await lift(page);
  151 |     await scrollToScene(page, 2);
  152 |     expect(await page.locator('article.scene[inert]').count()).toBe(IDS.length - 1);
  153 |     await page.locator('body').click({ position: { x: 5, y: 5 } });
  154 |     for (let i = 0; i < 80; i++) {
  155 |       await page.keyboard.press('Tab');
  156 |       expect(await page.evaluate(() => !!document.activeElement?.closest('[inert]')), `tab ${i}`).toBe(false);
  157 |     }
  158 |   });
  159 | 
  160 |   test('axe: no serious or critical violations (top, a scene, contact)', async ({ page }) => {
  161 |     await load(page);
  162 |     await lift(page);
  163 |     const spots: (() => Promise<void>)[] = [
  164 |       async () => void (await page.evaluate(() => window.scrollTo(0, 0))),
  165 |       () => scrollToScene(page, 3),
  166 |       async () => void (await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))),
  167 |     ];
  168 |     for (const go of spots) {
  169 |       await go();
  170 |       await page.waitForTimeout(500);
  171 |       const { violations } = await new AxeBuilder({ page }).analyze();
  172 |       const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  173 |       expect(bad.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
  174 |     }
  175 |   });
  176 | });
  177 | 
  178 | test.describe('without JavaScript', () => {
  179 |   test.use({ javaScriptEnabled: false });
  180 | 
  181 |   test('headline and all eight scenes are readable', async ({ page }) => {
  182 |     await page.goto('/');
  183 |     await expect(page.locator('h1')).toContainText('I build businesses');
  184 |     const scenes = page.locator('article.scene');
  185 |     await expect(scenes).toHaveCount(IDS.length);
  186 |     for (let i = 0; i < IDS.length; i++) await expect(scenes.nth(i)).toBeVisible();
  187 |   });
  188 | });
  189 | 
  190 | test.describe('reduced motion', () => {
  191 |   test.use({ reducedMotion: 'reduce' });
  192 | 
  193 |   test('stacked scenes, no HEAD, nothing pinned', async ({ page }) => {
  194 |     await page.goto('/');
  195 |     await page.waitForTimeout(800);
  196 |     expect(await page.locator('#head').count()).toBe(0);
  197 |     expect(await page.locator('.pin-stage').evaluate((el) => getComputedStyle(el).position)).not.toBe('sticky');
  198 |     await expect(page.locator('article.scene').first()).toBeVisible();
  199 |   });
  200 | });
```