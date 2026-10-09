/**
 * Hours: a glass column of eight round chambers, each pinched to the next by
 * a narrow neck, standing on a rounded base under a lid. Forty-eight beads
 * fall through it without end, spreading out in each chamber and threading
 * through each neck. Hovering slows the fall to a tenth, so a bead can be
 * followed; the chamber under the pointer takes the bright stroke, and the
 * bead nearest the pointer is the bright one. The read-out counts the beads
 * that have passed that chamber. The slider is the rate of the fall, in
 * column lengths per second.
 *
 * The pattern: dilated time. One spring on the rate, an ambient loop that the
 * kernel sleeps offscreen, and a hit test on the chambers' resting bands.
 */
const { Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, run, spring, stepS, reducedMotion, mk, place, pointer, put, register, disposer, solid } = HL;

const N = 8, CH = 14, NK = 7, PITCH = CH + NK, H = N * CH + (N - 1) * NK, BEADS = 48;
const CR = 8.5, BELLY = 17, NR = 4.5, BR = 36, LID = 2.5, PB = 5, S = 1.35;

/** The glass radius at height l of a chamber: it swells from the foot to the belly and back to the top. */
const glass = (l) => CR + (BELLY - CR) * (1 - Math.abs(l - CH / 2) / (CH / 2));

/** Where a bead at height z sits in the column: its chamber from the bottom, and how wide the glass is there (the belly 1, a neck near 0). */
function at(z) {
  const k = clamp(Math.floor(z / PITCH), 0, N - 1), l = z - k * PITCH;
  const w = l >= CH ? 0.08 : (glass(l) - 2) / (BELLY - 2);
  return { k, w };
}

/** A chamber: a lantern, the hull of its foot, its belly and its top, with one crease at the top. */
function lantern(P, front, z0) {
  const foot = circ(CR, 28), belly = circ(BELLY, 36), top = circ(CR, 28), inner = circ(CR - 1.3, 28);
  const sil = poly(hull(ringAt(P, foot, z0).concat(ringAt(P, belly, z0 + CH / 2), ringAt(P, top, z0 + CH))));
  const crease = open(ringAt(P, run(inner, front), z0 + CH));
  return { sil, crease };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, S);
  fit(C, [[-BR, -BR, -PB], [BR, BR, -PB], [BR, -BR, -PB], [-BR, BR, -PB], [0, 0, H + LID]], 200, 166);
  const P = proj(C), front = facing(C);
  let rate = value, over = -1, nearest = -1;
  const slow = spring(1);

  const g = mk("g", {}, svg);
  // base, then the column bottom to top so each piece covers the top of the one it stands on, then the lid
  put(solid(g), prism(P, front, circ(BR, 40), circ(BR - 2.2, 40), -PB, 0));
  const neck = circ(NR, 20), neckIn = circ(NR - 1.1, 20);
  const chambers = [];
  for (let k = 0; k < N; k++) {
    const z0 = k * PITCH;
    chambers.push(solid(g));
    put(chambers[k], lantern(P, front, z0));
    if (k < N - 1) put(solid(g), prism(P, front, neck, neckIn, z0 + CH, z0 + PITCH));
  }
  put(solid(g), prism(P, front, circ(CR + 2, 28), circ(CR + 0.6, 28), H, H + LID));

  // The beads, seen through the glass: one circle each, spread out at rest so the stream is never a straight line.
  const beads = [];
  for (let i = 0; i < BEADS; i++) {
    beads.push({
      phase: (i + 0.5) / BEADS + (((i * 7) % 5) - 2) * 0.004,
      ox: (((i * 7) % 5) - 2) * 3.2, oy: (((i * 3) % 5) - 2) * 3.2,
      el: mk("circle", { r: 1.5, class: "dot m" }, g),
      sx: 0, sy: 0,
    });
  }

  const REST = N - 3; // the third chamber from the top carries the rest mark
  chambers[REST].sil.classList.add("hi");

  // Hit bands: the resting chambers, read on the front of the glass. They never move.
  const axisX = P(0, 0, 0)[0], halfW = BELLY * S + 10, yOf = (z) => P(8, 8, z)[1];
  const bands = chambers.map((_, k) => [yOf((k + 1) * PITCH), yOf(k * PITCH)]);
  function hit([x, y]) {
    if (Math.abs(x - axisX) > halfW || y > bands[0][1] + 4 || y < bands[N - 1][0] - LID * S - 4) return -1;
    for (let k = 0; k < N; k++) if (y <= bands[k][1] && y >= bands[k][0]) return k;
    return y < bands[N - 1][0] ? N - 1 : -1;
  }

  let point = null;
  function caption() {
    if (over < 0) { read.textContent = "rest"; return; }
    let passed = 0;
    for (const b of beads) if (H * (1 - b.phase) < over * PITCH) passed++;
    read.textContent = `h ${String(passed).padStart(2, "0")}`;
  }

  const B = register(stage, (dt) => {
    const moving = stepS(slow, dt);
    if (!reducedMotion()) for (const b of beads) b.phase = (b.phase + rate * slow.x * dt) % 1;
    let best = -1, bd = Infinity;
    for (let i = 0; i < BEADS; i++) {
      const b = beads[i], z = H * (1 - b.phase), { w } = at(z);
      const [sx, sy] = P(b.ox * w, b.oy * w, z);
      if (sx !== b.sx || sy !== b.sy) { b.sx = sx; b.sy = sy; place(b.el, [sx, sy]); }
      if (point) { const d = Math.hypot(sx - point[0], sy - point[1]); if (d < bd) { bd = d; best = i; } }
    }
    if (best !== nearest) {
      if (nearest >= 0) beads[nearest].el.classList.add("m");
      if (best >= 0) beads[best].el.classList.remove("m");
      nearest = best;
    }
    if (over >= 0) caption();
    return moving || !reducedMotion();
  });
  bag.add(B.unregister);

  function choose(k, p) {
    point = k >= 0 ? p : null;
    slow.t = k >= 0 ? 0.1 : 1;
    if (k !== over) {
      chambers[over < 0 ? REST : over].sil.classList.remove("hi");
      chambers[k < 0 ? REST : k].sil.classList.add("hi");
      over = k;
      caption();
    }
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => choose(hit(p), p), leave: () => choose(-1, null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { rate = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "hours",
  means: "Beads fall through a column of eight glass chambers; hovering slows them so one can be followed, and counts the ones gone by.",
  rules: [1, 4, 7, 8],
  range: [0.03, 0.06, 0.12],
  tour: [[200, 71], [200, 116], [200, 240], null],
  mount,
});
