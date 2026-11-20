const SEASONS: Record<string, number[]> = { spring: [3, 4, 5], summer: [6, 7, 8], autumn: [9, 10, 11], winter: [12, 1, 2] };

// Wires the Filters component to the cards; the groups combine with AND, `after` gets the number of cards left visible.
// `search` is the text field (it lives above the cards, outside the filter panel). Returns a function that resets everything.
export function initFilters(cards: HTMLElement[], after: (shown: number) => void, search: HTMLInputElement) {
  const root = document.querySelector<HTMLElement>(".filters")!;
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
    // the choice lives in the address (?topic=music&when=summer&q=...): a refresh or "Back" keeps it and the view can be shared
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) if (v) q.set(k, v);
    if (org.value) q.set("org", org.value);
    if (search.value.trim()) q.set("q", search.value.trim());
    const qs = q.toString();
    try {
      history.replaceState(null, "", location.pathname + (qs ? `?${qs}` : "") + location.hash);
    } catch {} // Safari throws after too many calls in a short time; the filters still work
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

  // restore what the address says; a value that matches no button or option is simply ignored
  if (location.search) {
    const saved = new URLSearchParams(location.search);
    for (const group of Object.keys(state)) {
      const v = saved.get(group);
      if (v) [...root.querySelectorAll<HTMLButtonElement>(`button[data-filter="${group}"]`)].find((b) => b.dataset.value === v)?.click();
    }
    org.value = saved.get("org") ?? "";
    search.value = saved.get("q") ?? "";
    apply();
  }

  return () => {
    search.value = "";
    org.value = "";
    for (const group of Object.keys(state)) root.querySelector<HTMLButtonElement>(`button[data-filter="${group}"][data-value=""]`)!.click();
  };
}
