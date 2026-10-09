/**
 * Podium: seven plinths on a low rounded stage, in a slight arc, each a
 * rounded column under a thin top plate that overhangs it. The pointer's x
 * picks the plinth nearest it (by its resting centre, so the choice never
 * moves) and the pointer's height sets a score line: that plinth rises to meet
 * it on its own spring, and its neighbours follow less, falling off with
 * distance. The chosen plinth is bright, and the read-out gives its rank among
 * the seven by target height. At rest the row is a 3-1-2 podium left of
 * centre, the winner bright. The slider is the reach, in plinth pitches.
 *
 * The pattern: a continuous field. Springs, a falloff by distance, a hit test
 * on the rest pose, and a rest that is a composition.
 */
const {
  Cam, clamp, facing, fit, lerp, prism, proj, rings, spring, stepS,
  mk, pointer, put, register, disposer, solid,
} = HL;

const N = 7, PITCH = 22, FOOT = 15, ARC = 7, OVER = 3.4, CAP = 1.5, PB = 4, HMIN = 4, HMAX = 60;
const REST = [12, 30, 42, 24, 9, 17, 11];
const X0 = -10, X1 = (N - 1) * PITCH + FOOT + 10, Y0 = -10, Y1 = FOOT + ARC + 10;

/** The share of the score a plinth takes at u reaches from the chosen one: 1 → .31 at 42% → .09 at the edge and beyond. */
const falloff = (u) =>
  u <= 0 ? 1 : u <= 0.417 ? 1 - (u / 0.417) * 0.6875 : u <= 1 ? 0.3125 - ((u - 0.417) / 0.583) * 0.2185 : 0.094;

/** Plinth i's footprint: along x, bowed toward the viewer in the middle. */
const foot = (i) => [i * PITCH, ARC * (1 - ((i - 3) / 3) ** 2)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.84);
  fit(C, [[X0, Y0, -PB], [X1, Y1, -PB], [X1, Y0, -PB], [X0, Y1, -PB], [X0, Y0, HMAX + CAP], [X1, Y1, HMAX + CAP]], 200, 166);
  const P = proj(C), front = facing(C);
  let R = value * PITCH, over = -1, hT = 0;

  const g = mk("g", {}, svg);
  const [sr, si] = rings(X0, Y0, X1, Y1, 8, 2);
  put(solid(g), prism(P, front, sr, si, -PB, 0));

  // Left to right is far to near at this camera, so appending in order paints back to front.
  const ps = [];
  for (let i = 0; i < N; i++) {
    const [x0, y0] = foot(i);
    const [ring, inner] = rings(x0, y0, x0 + FOOT, y0 + FOOT, 2.4, 0.9);
    const [cring, cinner] = rings(x0 - OVER, y0 - OVER, x0 + FOOT + OVER, y0 + FOOT + OVER, 3.4, 0.8);
    const cx = x0 + FOOT / 2, cy = y0 + FOOT / 2, base = P(cx, cy, 0);
    ps.push({ i, cx, sx: base[0], by: base[1], kz: base[1] - P(cx, cy, 1)[1], ring, inner, cring, cinner, sp: spring(REST[i], { eps: 0.04 }), col: solid(g), cap: solid(g), drawn: NaN });
  }

  /** A plinth whose spring has not moved keeps its paths. */
  function draw(p) {
    const h = Math.max(HMIN, p.sp.x);
    if (h === p.drawn) return;
    p.drawn = h;
    put(p.col, prism(P, front, p.ring, p.inner, 0, h));
    put(p.cap, prism(P, front, p.cring, p.cinner, h, h + CAP));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const p of ps) { if (stepS(p.sp, dt)) m = true; draw(p); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const p of ps) p.sp.t = over < 0 ? REST[p.i] : lerp(REST[p.i], hT, falloff(Math.abs(p.cx - ps[over].cx) / R));
    // the winner at rest, or the plinth under the pointer: the one bright place
    const a = over < 0 ? ps.reduce((m, p) => (p.sp.t > m.sp.t ? p : m)) : ps[over];
    for (const p of ps) { const on = p === a; p.col.sil.classList.toggle("hi", on); p.cap.sil.classList.toggle("hi", on); }
    read.textContent = over < 0 ? "rest" : `rank ${1 + ps.filter((p) => p.sp.t > a.sp.t).length}`;
    B.wake();
  }
  retarget();

  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      // the plinth whose resting centre is nearest the pointer's screen x; its height from the pointer's screen y
      const p = ps.reduce((m, q) => (Math.abs(q.sx - sx) < Math.abs(m.sx - sx) ? q : m));
      over = p.i;
      hT = clamp((p.by - sy) / p.kz, HMIN, HMAX);
      retarget();
    },
    leave: () => { over = -1; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v * PITCH; if (over >= 0) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "podium",
  means: "Seven plinths on a stage: the one under the pointer rises to its height, and its neighbours follow less.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3.5],
  tour: [[142, 168], [195, 126], [257, 193], null],
  mount,
});
