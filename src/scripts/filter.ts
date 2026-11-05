const SEASONS: Record<string, number[]> = { spring: [3, 4, 5], summer: [6, 7, 8], autumn: [9, 10, 11], winter: [12, 1, 2] };

// Wires the Filters component to the cards; the groups combine with AND, `after` gets the number of cards left visible.
// Returns a function that resets everything.
export function initFilters(cards: HTMLElement[], after: (shown: number) => void) {
  const root = document.querySelector<HTMLElement>(".filters")!;
  const search = root.querySelector<HTMLInputElement>("input")!;
  const org = root.querySelector<HTMLSelectElement>("select")!;
  const state: Record<string, string> = { topic: "", entry: "", when: "" };

  const matches = (c: HTMLElement) => {
    const d = c.dataset;
    if (state.topic && !d.topics!.split(",").includes(state.topic)) return false;
    if (org.value && d.org !== org.value) return false;
    if (state.entry && d.entry !== "mixed" && d.entry !== state.entry) return false; // "mixed" can be either
    // year-round events fit every season; events with no known month fit none
    if (state.when && !d.yr && !d.months!.split(",").some((m) => SEASONS[state.when].includes(Number(m)))) return false;
    return d.q!.includes(search.value.trim().toLowerCase());
  };

  const apply = () => {
    let shown = 0;
    for (const c of cards) {
      c.hidden = !matches(c);
      shown += c.hidden ? 0 : 1;
    }
    after(shown);
  };

  root.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-filter]");
    if (!btn) return;
    const group = btn.dataset.filter!;
    state[group] = btn.dataset.value!;
    for (const b of root.querySelectorAll<HTMLButtonElement>(`button[data-filter="${group}"]`)) b.setAttribute("aria-pressed", String(b === btn));
    apply();
  });
  search.addEventListener("input", apply);
  org.addEventListener("change", apply);

  return () => {
    search.value = "";
    org.value = "";
    for (const group of Object.keys(state)) root.querySelector<HTMLButtonElement>(`button[data-filter="${group}"][data-value=""]`)!.click();
  };
}
