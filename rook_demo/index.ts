import {
  component,
  system,
  UpdateTick,
  start,
  gameClock,
  InitEvent,
  Entity,
  World,
} from "rook-ecs"

const TICK_INTERVAL_SECONDS = 1
const GRID_SIZE = 5
const INFECT_CHANCE = 0.3
const GET_BETTER_CHANCE = 0.2
const WITHER_CHANCE = 0.05
const MIN_SAFE_DISTANCE = 2.0

// COMPONENTS
// ----------

// a component with data
interface Person {
  name: string
  avatar: string //emoji
}
const Person = component<Person>("Person")

interface Position {
  x: number
  y: number
}
const Position = component<Position>("Position")

type TreeKind = "palmtree" | "oak" | "pine"
const Tree = component<TreeKind>("Tree")

// symbolic component, like a flag
const Alive = component<"Alive">("Alive")
const Infected = component<"Infected">("Infected")
const Dead = component<"Dead">("Dead")

// SYSTEMS
// -------

// startup system, runs only once (based on the InitEvent requirement)
const init = system(InitEvent, function (world) {
  populate(world)
  world.run(() => null)
})

// regular system
// runs on every "tick" (interval) and updates the simulation state for matching components
const spreadInfection = system(UpdateTick, function (world) {
  for (const infectedPerson of world.query(Person, Position, Alive, Infected)) {
    for (const healthyPerson of world.query(Person, Position, Alive)) {
      if (
        Math.random() <= INFECT_CHANCE &&
        withinUnsafeRadius(
          infectedPerson.get(Position),
          healthyPerson.get(Position)
        )
      ) {
        healthyPerson.set(Infected, "Infected")
      }
    }
  }
})

function withinUnsafeRadius(a: Position, b: Position): boolean {
  const xDistance = Math.abs(a.x - b.x)
  const yDistance = Math.abs(a.y - b.y)
  const distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))

  return distance < MIN_SAFE_DISTANCE
}

// ...another regular system
const updateInfected = system(UpdateTick, function (world) {
  for (const infectedPerson of world.query(Person, Position, Alive, Infected)) {
    if (Math.random() <= WITHER_CHANCE) {
      // Wither
      infectedPerson.remove(Alive)
      infectedPerson.remove(Infected)
      infectedPerson.set(Dead, "Dead")
    } else if (Math.random() <= GET_BETTER_CHANCE) {
      // Get better
      infectedPerson.remove(Infected)
    }
  }
})

// ...and another regular system
const render = system(UpdateTick, function (world) {
  console.clear()

  const entities: Array<Entity> = [...world.query(Position)]
  let chars = []

  for (let y = 1; y <= GRID_SIZE; y++) {
    for (let x = 1; x <= GRID_SIZE; x++) {
      const entity = entities.filter((e) => {
        const pos = e.get(Position)
        return pos.x === x && pos.y === y
      })[0]

      // emojis have a width of two chars
      chars.push(entity ? display(entity) : "  ")

      if (chars.length === GRID_SIZE) {
        console.log(chars.join(""))
        chars = []
      }
    }
  }
})

function display(entity: Entity): string {
  if (entity.has(Tree)) {
    switch (entity.get(Tree)) {
      case "pine":
        return "🌲"

      case "palmtree":
        return "🌴"
    }
  } else if (entity.has(Person)) {
    if (entity.has(Dead)) {
      return "💀"
    } else if (entity.has(Infected)) {
      return "🤢"
    } else {
      return entity.get(Person).avatar
    }
  }

  return ""
}

// HELPERS
// -------

function populate(world: World) {
  world
    .create()
    .set(Person, { name: "Jeane", avatar: "👩" })
    .set(Position, { x: 1, y: 1 })
    .set(Alive, "Alive")

  world
    .create()
    .set(Person, { name: "Richard", avatar: "🤠" })
    .set(Position, { x: 4, y: 1 })
    .set(Alive, "Alive")

  world
    .create()
    .set(Person, { name: "George", avatar: "👨" })
    .set(Position, { x: 4, y: 4 })
    .set(Alive, "Alive")

  world
    .create()
    .set(Person, { name: "Abigail", avatar: "👵" })
    .set(Position, { x: 5, y: 5 })
    .set(Alive, "Alive")
    // the patient zero
    .set(Infected, "Infected")

  // static entity
  world.create().set(Tree, "palmtree").set(Position, { x: 1, y: 5 })
  world.create().set(Tree, "pine").set(Position, { x: 2, y: 2 })
}

// SETUP
// -----

start([
  gameClock(TICK_INTERVAL_SECONDS),
  init,
  updateInfected,
  spreadInfection,
  render,
])
