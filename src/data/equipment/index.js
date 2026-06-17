import skidSteer from './skidSteer'
import excavator from './excavator'
import bulldozer from './bulldozer'
import backhoe from './backhoe'
import trencher from './trencher'
import scraper from './scraper'
import crane from './crane'
import telehandler from './telehandler'
import boomlift from './boomlift'
import grader from './grader'
import compactor from './compactor'
import paver from './paver'
import dumptruck from './dumptruck'
import mixer from './mixer'
import pump from './pump'
import miningshovel from './miningshovel'
import dragline from './dragline'

/**
 * The full trainable fleet. Every machine is authored as data; the 3D cab and
 * guided UI are generated from these definitions.
 */
export const EQUIPMENT = [
  skidSteer,
  excavator,
  bulldozer,
  backhoe,
  trencher,
  scraper,
  crane,
  telehandler,
  boomlift,
  grader,
  compactor,
  paver,
  dumptruck,
  mixer,
  pump,
  miningshovel,
  dragline,
]

export const getEquipment = (id) => EQUIPMENT.find((e) => e.id === id)

export const CATEGORIES = [...new Set(EQUIPMENT.map((e) => e.category))]
