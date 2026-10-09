/**
 * Bench: two desks on trestles, one behind the other with a walkway between,
 * each holding three team stations: a mat with a laptop and a mug. The
 * pointer picks a station: its lid swings fully open and its mat lifts, its
 * desk-mates lift less, staggered outwards on the 700ms lift curve. At rest
 * the lids stand at uneven angles and one station is bright. The slider is
 * the lift, in world units. From this camera a lid at 39° is seen edge on, so
 * the rest angles keep clear of it.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, a hit test on
 * the resting station centres in screen space, and a composed rest.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, prism, proj, rad, ringAt, rings, rrect, run,
  tdone, tset, tval, tween, disposer, mk, pointer, put, reflect, register, solid,
} = HL;

const PER = 3, N = 2 * PER, W = 36, GAP = 12, M = 6, L = PER * W + (PER - 1) * GAP + 2 * M, D = 56, WALK = 34;
const TH = 4, TOPZ = 26, MT = 1.4, LY = 11, BD = 13, BW = 17, LL = 12.5, TK = 0.9, OPEN = 112, STEP = 45, R = 3.8;
const REST = [72, 92, 66, 84, 6, 78], BRIGHT = 1, NEAR = [1, 0.45, 0.15], EDGE = 39, Y0 = -(D + WALK);
/** Station i is slot i % PER on desk i / PER: 0 the front desk, 1 the back one, WALK behind it. Teams count front left to back right. */
const deskOf = (i) => Math.floor(i / PER), slotOf = (i) => i % PER, oyOf = (i) => (deskOf(i) ? Y0 : 0);

const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));

/** A trestle under a desk at x = tx, y from oy: a solid narrower at the beam than at its feet. */
function trestle(P, front, svg, g, tx, oy) {
  const foot = rrect(tx - 5, oy + 3, tx + 5, oy + D - 3, 1.5, 4), top = rrect(tx - 5, oy + 12, tx + 5, oy + D - 12, 1.5, 4);
  const inner = rrect(tx - 4.2, oy + 12.8, tx + 4.2, oy + D - 12.8, 0.8, 4), z1 = TOPZ - TH;
  reflect(svg, g, P, front, foot, 0, 9);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, z1)))), crease: open(ringAt(P, run(inner, front), z1)) });
}

/** Station i: its rings and the laptop lid's outline in the lid's own plane. */
function station(i) {
  const x0 = M + slotOf(i) * (W + GAP), oy = oyOf(i), ly = oy + LY, bx0 = x0 + 4, bx1 = bx0 + BW;
  const [mat, matIn] = rings(x0 + 2, oy + 6, x0 + W - 2, oy + D - 6, 3, 1.1);
  const [base, baseIn] = rings(bx0, ly, bx1, ly + BD, 1.4, 0.7);
  const pad = rrect(bx0 + 5.5, ly + 7.5, bx1 - 5.5, ly + BD - 1.6, 0.8, 3);
  const lid = rrect(bx0 + 0.5, 0.4, bx1 - 0.5, LL, 1.6, 4).map((q) => [q.u, q.v]);
  const screen = rrect(bx0 + 2, 2.2, bx1 - 2, LL - 1.3, 0.8, 3).map((q) => [q.u, q.v]);
  const cx = x0 + 28, cy = oy + 38, mug = shift(circ(R, 12), cx, cy), mugIn = shift(circ(R - 0.8, 12), cx, cy);
  // the handle stands in the plane the camera sees square on, so it is not foreshortened
  const handle = [];
  for (let k = 0; k <= 8; k++) { const a = rad(-80 + (160 * k) / 8), r = (R - 0.4 + 3.4 * Math.cos(a)) * 0.707; handle.push([cx + r, cy - r, 4.6 + 3.4 * Math.sin(a)]); }
  return { ly, cx: x0 + W / 2, cy: oy + D / 2, mat, matIn, base, baseIn, pad, lid, screen, mug, mugIn, handle };
}

/** Station st with its lid at th degrees and lifted by `lift`: every path it draws. */
function pose(P, front, st, th, lift) {
  const zm = TOPZ + lift, zb = zm + MT, s = Math.sin(rad(th)), c = Math.cos(rad(th));
  // the base is a wedge: thicker at the hinge, thinner at the front edge
  const zt = (q) => zb + 1 + (1 - (q.v - st.ly) / BD) * 1.6;
  const top = st.base.map((q) => P(q.u, q.v, zt(q)));
  const zl = zb + 2.6;
  const w = (u, v) => P(u, st.ly + v * c, zl + v * s), wb = (u, v) => P(u, st.ly + v * c - TK * s, zl + v * s + TK * c);
  return {
    mat: prism(P, front, st.mat, st.matIn, zm, zb),
    base: { sil: poly(hull(ringAt(P, st.base, zb).concat(top))), crease: open(run(st.baseIn, front).map((q) => P(q.u, q.v, zt(q)))) },
    pad: poly(st.pad.map((q) => P(q.u, q.v, zt(q)))),
    back: poly(st.lid.map((p) => wb(p[0], p[1]))),
    face: poly(st.lid.map((p) => w(p[0], p[1]))),
    screen: poly(st.screen.map((p) => w(p[0], p[1]))),
    mug: prism(P, front, st.mug, st.mugIn, zb, zb + 8),
    handle: open(st.handle.map((p) => P(p[0], p[1], zb + p[2]))),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let LIFT = value;

  const C = Cam(45, 0.5, 1.5), ZT = TOPZ + MT + 2.6 + LL + 14;
  fit(C, [[0, Y0, 0], [L, D, 0], [L, Y0, 0], [0, D, 0], [M, Y0 + LY - 4, ZT], [L - M, LY - 4, ZT]], 200, 166);
  const P = proj(C), front = facing(C);

  // the back desk first, then the front one: each its trestles, its top, then its stations by ascending x
  const g = mk("g", {}, svg), sts = [];
  for (const d of [1, 0]) {
    const oy = d ? Y0 : 0;
    trestle(P, front, svg, g, M + 24, oy);
    trestle(P, front, svg, g, L - M - 24, oy);
    const [br, bi] = rings(0, oy, L, oy + D, 2.5, 1.3);
    put(solid(g), prism(P, front, br, bi, TOPZ - TH, TOPZ));
    for (let j = 0; j < PER; j++) {
      const i = d * PER + j, st = station(i), grp = mk("g", {}, g);
      const el = {
        mat: solid(grp), base: solid(grp), pad: mk("path", { class: "nf lo" }, grp),
        back: mk("path", { class: "lo" }, grp), face: mk("path", { class: "sil" }, grp), screen: mk("path", { class: "nf lo" }, grp),
        mug: solid(grp), handle: mk("path", { class: "nf" }, grp),
      };
      sts[i] = { ...st, el, a: tween(REST[i]), z: tween(0), th: NaN, lift: NaN, over: false };
    }
  }

  // hit: the station whose resting centre is nearest the pointer on screen, within most of a slot; the centres never move
  const cen = sts.map((st) => P(st.cx, st.cy, TOPZ)), reach = Math.hypot(cen[1][0] - cen[0][0], cen[1][1] - cen[0][1]) * 0.62;
  function hit([x, y]) {
    let best = -1, bd = reach;
    cen.forEach(([cx, cy], i) => { const d = Math.hypot(cx - x, cy - y - 6); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  function draw(st, th, lift) {
    if (th === st.th && lift === st.lift) return;
    st.th = th; st.lift = lift;
    const q = pose(P, front, st, th, lift), e = st.el, over = th < EDGE;
    put(e.mat, q.mat); put(e.base, q.base); put(e.mug, q.mug);
    e.pad.setAttribute("d", q.pad); e.back.setAttribute("d", q.back); e.face.setAttribute("d", q.face);
    e.screen.setAttribute("d", over ? "" : q.screen); e.handle.setAttribute("d", q.handle);
    // below EDGE the camera sees the lid's top, not its screen: the back plate is then painted over the face
    if (over !== st.over) { st.over = over; if (over) e.face.after(e.back); else e.back.after(e.face); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const st of sts) { draw(st, tval(st.a, now), tval(st.z, now)); if (!tdone(st.a, now) || !tdone(st.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  const lit = (st, on) => { st.el.face.classList.toggle("hi", on); st.el.mat.sil.classList.toggle("hi", on); };
  /** Only desk-mates lift with the chosen station; the stagger runs along the desk from the slot picked or let go. */
  const targets = (a, now, from) => sts.forEach((st, i) => {
    const mate = a >= 0 && deskOf(i) === deskOf(a), d = mate ? Math.abs(slotOf(i) - slotOf(a)) : 9;
    const delay = Math.abs(slotOf(i) - slotOf(from)) * STEP;
    tset(st.a, a === i ? OPEN : REST[i], now, delay);
    tset(st.z, LIFT * (NEAR[d] || 0), now, delay);
  });
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    targets(a, now, from);
    sts.forEach((st, i) => lit(st, i === (a < 0 ? BRIGHT : a)));
    read.textContent = a < 0 ? "rest" : "team " + String(a + 1).padStart(2, "0");
    B.wake();
  }
  sts.forEach((st, i) => lit(st, i === BRIGHT));

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { LIFT = v; if (act >= 0) { targets(act, performance.now(), act); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "bench",
  means: "Two desks of three team stations: the one under the pointer opens its laptop and lifts, and its desk-mates lift less.",
  rules: [1, 2, 5, 9],
  range: [0, 7, 14],
  tour: [[152, 189], [248, 142], [203, 215], null],
  mount,
});
