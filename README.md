# Friday Hacks: Entity Component System and composition over inheritance

> Entity–component–system (ECS) is an architectural pattern that is mostly used in game development. ECS follows the composition over inheritance principle that allows greater flexibility in defining entities where every object in a game's scene is an entity (e.g. enemies, bullets, vehicles, etc.). Every entity consists of one or more components which contains data or state. Therefore, the behavior of an entity can be changed at runtime by systems that add, remove or mutate components. This eliminates the ambiguity problems of deep and wide inheritance hierarchies that are difficult to understand, maintain and extend. Common ECS approaches are highly compatible and often combined with data-oriented design techniques.

> The ECS architecture uses composition, rather than inheritance trees. An entity will be typically made up of an ID and a list of components that are attached to it. Any type of game object can be created by adding the correct components to an entity. This can also allow the developer to easily add features of one type of object to another, without any dependency issues. For example, a player entity could have a "bullet" component added to it, and then it would meet the requirements to be manipulated by some "bulletHandler" system, which could result in that player doing damage to things by running into them.

[Entity Component System Overview in 7 Minutes](https://www.youtube.com/watch?v=2rW7ALyHaas)

## ECS demo using rook-ecs

I wrote a small viral infection simulation using rook-ecs. We can extend it to have more features during the 'Hack.

[rook-ecs (TypeScript)](https://github.com/sz-piotr/rook-ecs)

## Another ECS demo using the example app from the bevy book

Bevy is a far more advanced project. It provides common game engine features on top of a state-of-the-art ECS implementation.

[Bevy engine (Rust)](https://bevyengine.org)
[Calculator APP in Bevy](https://github.com/PravinKumar95/simple-calc)
