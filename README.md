# Heavy Equipment Operations Trainer

A professional, mobile-friendly **3D heavy-equipment operator training
simulator**. Trainees sit in a first-person cab, look around, and operate the
real controls of each machine through guided start-up and operation procedures
built from manufacturer operation manuals. Make an unsafe move and the screen
goes red with a **FATAL ERROR** — the run resets and you start over, exactly as
the brief requires.

> Built for trainings and people new to daily heavy-equipment operation. The
> goal is confidence on the controls *before* anyone touches a real machine.

## Status

All **17 machines** are built and trainable — each has 3D cab controls, a
start-up procedure, an operation procedure, and safety hazards that trigger the
Fatal Error screen:

Skid Steer Loader · Hydraulic Excavator · Bulldozer · Backhoe Loader ·
Trencher · Wheel Tractor-Scraper · Mobile Crane · Telehandler ·
Boom/Scissor Lift · Motor Grader · Compactor (Road Roller) · Asphalt Paver ·
Dump Truck / Articulated Hauler · Concrete Mixer Truck · Concrete Pump ·
Hydraulic Mining Shovel · Dragline

The app is **data-driven**: adding another machine means writing one data file —
no engine or UI changes.

## Tech

- **React + Vite** — fast, deploys to Vercel out of the box
- **three.js via @react-three/fiber + @react-three/drei** — real-time 3D cab
- **zustand** — the simulator engine / state
- Fully responsive; touch controls and `dvh` layout for phones and tablets

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## How it works

```
src/
  data/
    schema.js              # documented shape of an equipment definition
    equipment/
      index.js             # the fleet registry (+ stubs)
      skidSteer.js         # a full machine, authored as data
      excavator.js         # a full machine, authored as data
  state/useSimStore.js     # the engine: interaction -> hazard check -> step progression
  three/
    Cab.jsx                # first-person 3D cab scene
    Control3D.jsx          # data-driven interactive 3D controls
  components/
    HomeScreen.jsx
    EquipmentSelect.jsx
    SimulatorScreen.jsx    # guided instruction panel + HUD
    FatalError.jsx         # the red "FATAL ERROR" screen
```

Every control interaction flows through one function, `interact()`, which:

1. resolves the control's new state,
2. checks the machine's **hazards** (safety invariants) — any hit -> **Fatal Error**,
3. otherwise checks the current procedure **step** — correct -> advance, wrong -> coach.

## Adding a new machine

Create `src/data/equipment/<machine>.js` exporting an `Equipment` object
(see `schema.js`), then register it in `equipment/index.js`. Define:

- **`controls`** — each with a `type` (`buckle`, `lapbar`, `lockout`, `key`,
  `lever`, `toggle`, `button`, `pedal`, `joystick`), a label, and a 3D
  `position` in the cab.
- **`procedures`** — ordered `steps`, each pointing at a control and the
  `expect`ed state or action. A procedure may set `initialStates` to describe
  the machine condition the lesson starts from.
- **`hazards`** — `when(world, action)` predicates that fire a fatal error with
  a `message` shown on the red screen.

That's it — the 3D cab and the guided UI are generated from the data.
