---
title: EuroPython 2023 AI game tournament
subtitle: Participate in the EuroPython 2023 AI game tournament!
---

## [Register your team here!](https://forms.gle/v2s9oHZ1xLTUo5ov7)

<img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/fd147b1a-252b-4aed-b949-e2cb943f80dd" />

# AI game tournament

## What is the tournament about?

We have created a video game that is designed to be played by a small python
program, rather than a human. Conference attendees can participate in a
tournament where they (either alone or in a team) each submit a bot that will
play the game, and at the end of the conference, we will have a tournament
session where everyone can come and watch our strange creations play against
each other (either brilliantly or it may all go wrong!).

## Disclaimer

The topic of the game is a sci-fi war on a foreign planet, set far in the
future. We do not condone war and violence, we just want to make a fun event for
EuroPython participants.

## How to participate?

- Register your team: fill in the form at https://forms.gle/v2s9oHZ1xLTUo5ov7
  (30 spots available)
- You will be given a private GH repository in the
  `europython2023gametournament` organisation
- Read the game rules below and start working on your bot
- Ask questions on the Discord forum `ai-game-tournament`
- Creating alliances is authorized (betrayals are also allowed!)
- Once your bot is ready, make sure you copy it into the `main` branch of the
  repo you were given
- Deadline is 15:00 on Friday July 21st
- Tournament will be 15:30 - 16:45 on Friday July 21st in the Open Space area

## TL;DR

Get started with:

```bash
conda create -n <NAME> -c conda-forge python=3.10
conda activate <NAME>

git clone git@github.com:europython2023gametournament/supremacy.git

cd supremacy/
python -m pip install .

cd tests/
python test.py
```

## The game: Supremacy

Preview

<table>
  <tr>
    <td>Time = 2min</td><td>Time = 4min</td>
  </tr>
  <tr>
    <td><img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/faa2b2c6-67c0-4017-af47-1f8a8b2d42b0" /></td>
    <td><img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/b3915e43-48dd-41ff-978d-24a213a0934a" /></td>
  </tr>
</table>

## Goal

- Mine resources to build an army
- Destroy enemy bases and eliminate other players

## Rounds

- All participants play on the map at the same time
- Each round lasts 8 minutes
- The tournament will consist of 8 rounds of 8 minutes

## Game map

- The map is auto-generated every round
- It has periodic boundary conditions (for example when a vehicle arrives at the
  right edge of the map, it will re-appear at the left edge)
- The map size will scale with the number of players (more players = larger map)
- Coordinate system: lower left corner: `(x=0, y=0)`, upper right corner:
  `(x=nx, y=ny)`

## Mining

- Everyone starts with 1 base, housing 1 mine
- Every timestep, each mine will extract `crystal = 2 * number_of_mines`
- Crystal is used to build mines and vehicles
- Mines too close to other bases compete for resources:
  `crystal = 2 * number_of_mines / number_of_bases_inside_square_of_80px`
- Bases that contain mines that are competing with others will have a “C” label
  on them:

<img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/d4e96611-0e40-4364-8b07-afc8b5f64023" />

## Fights

- Whenever two or more vehicles or bases from opposing teams come within 5px
  from each other, they will fight
- During each time step, every object hits all the others with its attack force,
  and it takes damage from all other objects

## Vehicles

<table>
  <tr>
    <th></th>
    <th className="border border-black p-2">Tank &nbsp;&nbsp;&nbsp; <img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/d8a69d16-62f3-4bb3-924e-7c3ec5821813" /></th>
    <th className="border border-black p-2">Ship &nbsp;&nbsp;&nbsp; <img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/3e8b2b2d-272d-4159-8c7d-4901c30f459e" /></th>
    <th className="border border-black p-2">Jet &nbsp;&nbsp;&nbsp; <img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/6ffa27ce-fe80-4fbf-95c4-c57696525df3" /></th>
  </tr>
  <tr>
    <td className="border border-black p-2">Speed</td>
    <td className="border border-black p-2">10</td>
    <td className="border border-black p-2">5</td>
    <td className="border border-black p-2">20</td>
  </tr>
  <tr>
    <td className="border border-black p-2">Attack</td>
    <td className="border border-black p-2">20</td>
    <td className="border border-black p-2">10</td>
    <td className="border border-black p-2">30</td>
  </tr>
  <tr>
    <td className="border border-black p-2">Health</td>
    <td className="border border-black p-2">50</td>
    <td className="border border-black p-2">80</td>
    <td className="border border-black p-2">50</td>
  </tr>
  <tr>
    <td className="border border-black p-2">Cost</td>
    <td className="border border-black p-2">500</td>
    <td className="border border-black p-2">2000</td>
    <td className="border border-black p-2">4000</td>
  </tr>
  <tr>
    <td className="border border-black p-2">Can travel</td>
    <td className="border border-black p-2">On land</td>
    <td className="border border-black p-2">On sea</td>
    <td className="border border-black p-2">Anywhere</td>
  </tr>
  <tr>
    <td className="border border-black p-2"></td>
    <td className="border border-black p-2"></td>
    <td className="border border-black p-2">Can turn into base</td>
    <td className="border border-black p-2"></td>
  </tr>
</table>

## Additional rules:

- Mine cost doubles for every new mine on a given base (first mine=1000,
  second=2000, third=4000, etc…)
- Base has `health = 100`, mine has `health = 50` (both have `0` attack)
- Vehicles move at `speed * dt` (`dt = 1/15s`)
- A ship can be turned into a new base, by calling `convert_to_base()`
- A conversion to base will only work if there is land in the immediate vicinity
- A player is eliminated when all his/her bases have been destroyed
- If a player is eliminated, all his/her vehicles disappear instantly

## Scoring

- +1 point if you destroy a base
- If a player gets eliminated, they receive a number of points equal to the
  number of players that were eliminated before them
- At the end of the round, every player still alive gets a number of points
  equal to the number of eliminated players

## The control center - the AI

- To play the game, you will have to create a Python program.
- It should contain a class named `PlayerAI` and that class should have a method
  named `run`.
- Every time step, the `run` method will be called, and it will be inside that
  function that you should control your vehicles, decide what to build, etc...
- You are provided with a `template_ai.py` to give you an example.

Look at the comments in the `template_ai.py` for details on what information is
available to you at every time step and what methods can be called.

### `game_map`

- The `game_map` is one of the arguments the `run` function will receive.
- It is a Numpy array that automatically gets filled when your vehicles or bases
  visit that region of the map.
- `1` means land, `0` means sea, `-1` means no info.
- Any visit makes anything in that part of the map permanently visible.
- This is basically what defines which enemy bases and vehicles you get in your
  info every time step.

<img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/350da216-3eb2-49d5-9f63-944a778ff766" width="700px" height="362px" />

## Optimizing development

There are 3 ways you can speed up your development.

### 1. The high contrast mode

Activate `high_contrast = True` to see the land borders better and competing
areas for mines:

<img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/9498479d-6a3b-440f-828e-289186b92bf1" width="700px" height="362px" />

### 2. Crystal boost

Waiting for things to develop can be time consuming. You can artificially
increase mine yield using `crystal_boost=5` (or any number you want, although
behavior is untested beyond 10).

### 3. Use the 'Pause' Luke (experimental)

While the game is running, you can hit `P` on the keyboard. This will pause the
game. You can edit your AI code. When the game resumes (hit `P` again), it will
reload your AI module.
