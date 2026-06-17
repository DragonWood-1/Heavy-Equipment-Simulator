import skidSteer from './skidSteer'
import excavator from './excavator'

/**
 * A stub is a fully-listed machine whose deep training content is not authored
 * yet. The selection screen shows it with a "Coming soon" badge so the full
 * fleet is always visible and the data layer is the single source of truth.
 */
const stub = (id, name, category, summary) => ({
  id,
  name,
  category,
  summary,
  ready: false,
  manufacturerRef: 'OEM Operation & Maintenance Manual',
  controls: [],
  procedures: [],
  hazards: [],
})

export const EQUIPMENT = [
  skidSteer,
  excavator,
  stub('bulldozer', 'Bulldozer', 'Earthmoving', 'Tracked dozer for pushing, grading and ripping. Blade and ripper hydraulics, differential steering.'),
  stub('backhoe', 'Backhoe Loader', 'Loaders', 'Loader bucket up front, backhoe out back. Stabilizers, swing, and a seat that rotates between stations.'),
  stub('trencher', 'Trencher', 'Excavation', 'Chain or wheel trencher for utility runs. Digging chain, conveyor, and ground-drive controls.'),
  stub('scraper', 'Wheel Tractor-Scraper', 'Earthmoving', 'Self-loading earthmover. Apron, bowl and ejector cylinders for cut, haul and spread.'),
  stub('crane', 'Mobile Crane', 'Lifting', 'Telescoping boom lifting crane. Outriggers, load chart, swing, hoist and boom controls.'),
  stub('telehandler', 'Telehandler', 'Lifting', 'Telescopic handler with forks/attachments. Boom extend, lift, tilt, and frame leveling.'),
  stub('boomlift', 'Boom / Scissor Lift', 'Aerial', 'Aerial work platforms. Platform controls, ground controls, tilt/overload interlocks.'),
  stub('grader', 'Motor Grader', 'Earthmoving', 'Precision blade machine for fine grading. Moldboard articulation, lean wheels, dual steering.'),
  stub('compactor', 'Compactor (Road Roller)', 'Compaction', 'Vibratory drum roller. Drum vibration, water spray, forward/reverse propulsion.'),
  stub('paver', 'Asphalt Paver', 'Paving', 'Lays and screeds hot mix asphalt. Conveyor, augers, screed heat and depth controls.'),
  stub('dumptruck', 'Dump Truck / Articulated Hauler', 'Hauling', 'Off-highway hauler. Bed hoist, retarder, articulated steering on the ADT.'),
  stub('mixer', 'Concrete Mixer Truck', 'Concrete', 'Transit mixer. Drum charge/discharge, drum speed, chute positioning.'),
  stub('pump', 'Concrete Pump', 'Concrete', 'Boom pump for placing concrete. Outriggers, boom articulation, pump stroke and hopper.'),
  stub('miningshovel', 'Hydraulic Mining Shovel', 'Mining', 'Large-scale face shovel. Crowd, hoist, swing and clam controls at production scale.'),
  stub('dragline', 'Dragline', 'Mining', 'Bucket dragged by ropes. Hoist, drag, swing and dump rope controls.'),
]

export const getEquipment = (id) => EQUIPMENT.find((e) => e.id === id)

export const CATEGORIES = [...new Set(EQUIPMENT.map((e) => e.category))]
