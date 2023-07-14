---
title: EuroPython 2023 AI game tournament
subtitle: Participate in the EuroPython 2023 AI game tournament!
---

## Register your team here https://forms.gle/v2s9oHZ1xLTUo5ov7 !

![supremacy](https://github.com/nvaytet/supremacy/assets/39047984/6e800f7c-6eb4-47d4-9621-1465aeaae879)

# EuroPython 2023 AI game tournament

## What is the tournament about?

We have created a video game that is designed to be played by a small python program, rather than a human.
Conference attendees can participate in a tournament where they (either alone or in a team) each submit a bot that will play the game, and at the end of the conference, we will have a tournament session where everyone can come and watch our strange creations play against each other (either brilliantly or it may all go wrong!).

## Disclaimer

The topic of the game is a sci-fi war on a foreign planet, set far in the future.
We do not condone war and violence, we just want to make a fun event for EuroPython participants.

## How to participate?

- Register your team: fill in the form at https://forms.gle/v2s9oHZ1xLTUo5ov7 (30 spots available)
- You will be given a private GH repository in the `europython2023gametournament` organisation
- Read the game rules below and start working on your bot
- Ask questions on the Discord channel #<PLACEHOLDER>
- Creating alliances is authorized (betrayals are also allowed!)
- Once your bot is ready, make sure you copy it into the `main` branch of the repo you were given
- Deadline is 15:00 on Friday July 21st
- Tournament will be 15:30 - 16:45 on Friday July 21st in the Open Space area

## TL;DR

Get started with:

```
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
    <td><img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/07e66dc0-ed5d-4e2b-91f6-b7302e1e0a4f" width="100%" /></td>
    <td><img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/d1dd0cb0-2b6f-4904-ac99-f842b4771099" width="100%" /></td>
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
- It has periodic boundary conditions (for example when a vehicle arrives at the right edge of the map, it will re-appear at the left edge)
- The map size will scale with the number of players (more players = larger map)
- Coordinate system: lower left corner: `(x=0, y=0)`, upper right corner: `(x=nx, y=ny)`

## Mining

- Everyone starts with 1 base, housing 1 mine
- Every timestep, each mine will extract `crystal = 2 * number_of_mines`
- Crystal is used to build mines and vehicles
- Mines too close to other bases compete for resources: `crystal = 2 * number_of_mines / number_of_bases_inside_square_of_80px`
- Bases that contain mines that are competing with others will have a “C” label on them:

![Screenshot at 2023-06-22 21-58-52](https://github.com/europython2023gametournament/supremacy/assets/39047984/e2df2246-532e-4989-9892-582d53d171a8)

## Fights

- Whenever two or more vehicles or bases from opposing teams come within 5px from each other, they will fight
- During each time step, every object hits all the others with its attack force, and it takes damage from all other objects

## Vehicles

<table>
  <tr>
    <th></th>
    <th>Tank &nbsp;&nbsp;&nbsp; <img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/0be25f1b-9d14-4438-b5cb-3a355a6b088a" />
</th>
    <th>Ship &nbsp;&nbsp;&nbsp; <img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/248ab310-2a53-4132-9179-b360ebbb45f4" />
</th>
    <th>Jet &nbsp;&nbsp;&nbsp; <img src="https://github.com/europython2023gametournament/supremacy/assets/39047984/594f9902-e848-465a-a5f2-5d9081d4b863" />
</th>
  </tr>
  <tr>
    <td>Speed</td>
    <td>10</td>
    <td>5</td>
    <td>20</td>
  </tr>
  <tr>
    <td>Attack</td>
    <td>20</td>
    <td>10</td>
    <td>30</td>
  </tr>
  <tr>
    <td>Health</td>
    <td>50</td>
    <td>80</td>
    <td>50</td>
  </tr>
  <tr>
    <td>Cost</td>
    <td>500</td>
    <td>2000</td>
    <td>4000</td>
  </tr>
  <tr>
    <td>Can travel</td>
    <td>On land</td>
    <td>On sea</td>
    <td>Anywhere</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>Can turn into base</td>
    <td></td>
  </tr>
</table>

## Additional rules:

- Mine cost doubles for every new mine on a given base (first mine=1000, second=2000, third=4000, etc…)
- Base has `health = 100`, mine has `health = 50` (both have `0` attack)
- Vehicles move at `speed * dt` (`dt = 1/15s`)
- A ship can be turned into a new base, by calling `convert_to_base()`
- A conversion to base will only work if there is land in the immediate vicinity
- A player is eliminated when all his/her bases have been destroyed
- If a player is eliminated, all his/her vehicles disappear instantly

## Scoring

- +1 point if you destroy a base
- If a player gets eliminated, they receive a number of points equal to the number of players that were eliminated before them
- At the end of the round, every player still alive gets a number of points equal to the number of eliminated players

## The control center - the AI

- To play the game, you will have to create a Python program.
- It should contain a class named `PlayerAI` and that class should have a method named `run`.
- Every time step, the `run` method will be called, and it will be inside that function that you should control your vehicles, decide what to build, etc...
- You are provided with a `template_ai.py` to give you an example.

Look at the comments in the `template_ai.py` for details on what information is available to you at every time step and what methods can be called.

### `game_map`

- The `game_map` is one of the arguments the `run` function will receive.
- It is a Numpy array that automatically gets filled when your vehicles or bases visit that region of the map.
- `1` means land, `0` means sea, `-1` means no info.
- Any visit makes anything in that part of the map permanently visible.
- This is basically what defines which enemy bases and vehicles you get in your info every time step.

![Screenshot at 2023-06-22 22-32-11](https://github.com/europython2023gametournament/supremacy/assets/39047984/a207ac95-4006-4b6e-82ce-f64d6c5a6c4f)

## Optimizing development

There are 3 ways you can speed up your development.

### 1. The high contrast mode

Activate `high_contrast = True` to see the land borders better and competing areas for mines:
![Screenshot at 2023-06-22 22-34-32](https://github.com/europython2023gametournament/supremacy/assets/39047984/0da61cd3-9449-4e99-9a40-0c4b3ba0fdf6)

### 2. Crystal boost

Waiting for things to develop can be time consuming.
You can artificially increase mine yield using `crystal_boost=5` (or any number you want, although behavior is untested beyond 10).

### 3. Use the 'Pause' Luke (experimental)

While the game is running, you can hit `P` on the keyboard.
This will pause the game.
You can edit your AI code.
When the game resumes (hit `P` again), it will reload your AI module.

