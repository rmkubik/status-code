import h from "../hyperapp-jsx";

import tileSheet from "../../assets/tiles.png";

import { Sprite, Grid } from "../components/index";
import {
  deepClone,
  updateArray,
  isUnitHeadAtLocation,
  isUnitAtLocation,
  findUnitAtLocation,
  findUnitIndexAtLocation,
  getNeighbors,
  findAllIndices,
  manhattanDistance,
  pickRandomlyFromArray,
  getLocationsInArea,
  getLocationsInDiamond,
  getLocationsInSquare,
  getAllLocations,
} from "../utils";

const SelectAbility = (state, index) => {
  return {
    ...state,
    battle: {
      ...state.battle,
      selectedAction: index,
    },
  };
};

const DeselectAbility = (state) => {
  return {
    ...state,
    battle: {
      ...state.battle,
      selectedAction: -1,
    },
  };
};

const ClickAbility = (state, index) => {
  if (state.battle.selectedAction === index) {
    return DeselectAbility(state);
  } else {
    return SelectAbility(state, index);
  }
};

const SelectUnit = (state, location) => {
  return {
    ...state,
    battle: {
      ...state.battle,
      selected: location,
    },
  };
};

const DeselectUnit = (state) => {
  return {
    ...state,
    battle: {
      ...state.battle,
      selected: [],
    },
  };
};

const isLocationValidMoveTarget = (
  { units, tiles, selected, selectedAction },
  location
) => {
  const neighbors = getNeighbors(tiles, location);
  // is neighboring tile selected and a unit's head
  const neighborUnitHead = units.find((unit) =>
    isUnitHeadAtLocation(unit, selected)
  );

  return (
    neighbors.some(
      (neighbor) =>
        selected[0] === neighbor[0] &&
        selected[1] === neighbor[1] && // is selected tile a neighbor of this one
        neighborUnitHead && // is the selected tile a unit head
        !units.some((unit) => isUnitAtLocation(unit, location)) && // is the selected tile empty
        neighborUnitHead.moves[0] > 0
    ) && selectedAction === -1
  );
};

const isLocationValidAttackTarget = (
  { units, tiles, selected, selectedAction },
  location,
  moves
) => {
  if (selectedAction === -1) {
    return false;
  }

  const selectedUnit = findUnitAtLocation(units, selected);
  const abilityKey = selectedUnit.abilities[selectedAction];
  const ability = moves[abilityKey];

  let inRangeLocations = [];

  // Use switch(true) as a pattern matcher
  //
  switch (true) {
    case ability.area.includes("cross"):
      {
        const range = parseInt(ability.area.match(/cross(\d+)/)[1]);
        inRangeLocations = getLocationsInArea(tiles, location, range);
      }
      break;
    case ability.area.includes("diamond"):
      {
        const range = parseInt(ability.area.match(/diamond(\d+)/)[1]);
        inRangeLocations = getLocationsInDiamond(tiles, location, range);
      }
      break;
    case ability.area.includes("square"):
      {
        const range = parseInt(ability.area.match(/square(\d+)/)[1]);
        inRangeLocations = getLocationsInSquare(tiles, location, range);
      }
      break;
    default:
      break;
  }

  // is neighboring tile selected and a unit's head
  return inRangeLocations.some(
    (inRangeLocation) =>
      selected[0] === inRangeLocation[0] &&
      selected[1] === inRangeLocation[1] && // is selected tile in range of this one
      units.some((unit) => isUnitHeadAtLocation(unit, selected)) // is the selected tile a unit head
  );
};

const MoveUnit = (state, selectedUnitIndex, location) => {
  return {
    ...state,
    battle: {
      ...state.battle,
      units: updateArray(state.battle.units, selectedUnitIndex, (unit) => {
        if (unit.moves[0] === 0) {
          // if we're out of moves, make no unit changes
          return unit;
        }

        const tiles = [location, ...unit.tiles];

        if (tiles.length > unit.size) {
          tiles.pop();
        }

        return {
          ...unit,
          moves: [unit.moves[0] - 1, unit.moves[1]],
          animation: {
            type: "ADDED",
            state: "UNSTARTED",
            movedTiles: [location],
          },
          tiles,
        };
      }),
      selected: location,
    },
  };
};

const UseAbility = (state, selectedUnitIndex, location) => {
  // if (selectedAction === 'hack') {
  //
  // }

  const selectedUnit = state.battle.units[selectedUnitIndex];
  const ability =
    state.moves[selectedUnit.abilities[state.battle.selectedAction]];

  if (selectedUnit.ap[0] === 0) {
    // if we're out of ap, make no changes
    return state;
  }

  // if no unit is there, don't do anything
  const targetUnitIndex = state.battle.units.findIndex((unit) =>
    isUnitAtLocation(unit, location)
  );

  if (targetUnitIndex === -1) {
    return state;
  }

  const apUpdatedState = updateArray(
    state.battle.units,
    selectedUnitIndex,
    (unit) => {
      return {
        ...unit,
        ap: [unit.ap[0] - 1, unit.ap[1]],
      };
    }
  );

  const damagedEnemyUnit = updateArray(
    apUpdatedState,
    targetUnitIndex,
    (unit) => {
      return {
        ...unit,
        animation: {
          type: "REMOVED",
          state: "UNSTARTED",
          bg: unit.bg,
          removedTiles: unit.tiles.slice(unit.tiles.length - ability.power),
        },
      };
    }
  );

  return {
    ...state,
    battle: {
      ...state.battle,
      units: damagedEnemyUnit,
      selectedAction: -1,
    },
  };
};

const ClickTile = (state, location) => {
  const deselectedAbilityState = DeselectAbility(state);
  const selectedUnitIndex = state.battle.units.findIndex((unit) =>
    isUnitHeadAtLocation(unit, state.battle.selected)
  );
  const selectedUnit = state.battle.units[selectedUnitIndex];

  if (
    state.battle.selected[0] === location[0] &&
    state.battle.selected[1] === location[1]
  ) {
    return DeselectUnit(deselectedAbilityState);
  } else if (
    state.battle.selected.length === 2 &&
    state.battle.selectedAction === -1 &&
    isLocationValidMoveTarget(state.battle, location) &&
    selectedUnit.owner === 0 // only let player move own units
  ) {
    // move action
    return MoveUnit(state, selectedUnitIndex, location);
  } else if (
    state.battle.selected.length === 2 &&
    state.battle.selectedAction !== -1 &&
    isLocationValidAttackTarget(state.battle, location, state.moves) &&
    selectedUnit.owner === 0 // only let player use action of own units
  ) {
    // ability action
    return UseAbility(state, selectedUnitIndex, location);
  } else {
    return SelectUnit(deselectedAbilityState, location);
  }
};

const FinishAnimation = (state, location) => {
  const unitIndex = findUnitIndexAtLocation(state.battle.units, location);

  return {
    ...state,
    battle: {
      ...state.battle,
      units: updateArray(state.battle.units, unitIndex, (unit) => {
        const isLocationRemoved = unit.animation.removedTiles?.some(
          (removed) => removed[0] === location[0] && removed[1] === location[1]
        );

        const removedLocationIndex = unit.tiles.findIndex(
          (tile) => tile[0] === location[0] && tile[1] === location[1]
        );
        const tiles =
          unit.animation.type === "REMOVED" && isLocationRemoved
            ? [
                ...unit.tiles.slice(0, removedLocationIndex),
                ...unit.tiles.slice(removedLocationIndex + 1),
              ] // unit.tiles.slice(0, unit.tiles.length - unit.animation.amount)
            : unit.tiles;

        return {
          ...unit,
          tiles: tiles.length > 0 ? tiles : [[]],
          animation: { ...unit.animation, state: "COMPLETED" },
        };
      }),
    },
  };
};

const EndTurn = (state) => {
  // is every unit either player owned OR is dead ( this is what empty program looks like: [[]] )
  if (
    state.battle.units.every(
      (unit) => unit.owner === 0 || unit.tiles[0].length === 0
    )
  ) {
    // mark server as complete, and return to map
    return {
      ...state,
      view: "map",
      map: {
        ...state.map,
        servers: updateArray(
          state.map.servers,
          state.map.selected,
          (server) => ({
            ...server,
            statusCode: 200,
          })
        ),
      },
    };
  }

  // perform enemy actions
  const isNotActedEnemyUnit = (unit) => !unit.acted && unit.owner !== 0;

  let newState = deepClone(state);

  state.battle.units.forEach((unit) => {
    // re-calculate index instead of pulling it out of the for loop since
    // units can be destroyed from array
    const index = newState.battle.units.findIndex(
      (target) =>
        target.tiles[0][0] === unit.tiles[0][0] &&
        target.tiles[0][1] === unit.tiles[0][1]
    );

    if (isNotActedEnemyUnit(unit)) {
      // find x and y distance to nearest player unit
      // const playerUnitDistances = state.battle.units
      //   .map((unit, index) => [manhattanDistance(), unit, index])
      //   .filter((unit) => unit.owner === 0);
      // const nearestPlayerUnit = {};
      // move x or y toward nearest player unit
      // recurse until moves are 0
      // is neighboring player unit?
      // use ability on player unit

      let neighbors;
      newState = SelectUnit(newState, newState.battle.units[index].tiles[0]);

      while (newState.battle.units[index].moves[0] > 0) {
        newState = SelectUnit(newState, newState.battle.units[index].tiles[0]);

        neighbors = getNeighbors(
          newState.battle.tiles,
          newState.battle.units[index].tiles[0]
        );

        const moveOptions = neighbors.filter((neighbor) =>
          isLocationValidMoveTarget(newState.battle, neighbor)
        );

        const playerUnitTiles = newState.battle.units
          .filter((unit) => unit.owner === 0)
          .map((unit) => unit.tiles)
          .reduce((allTiles, unitTiles) => [...allTiles, ...unitTiles], []);

        const findNearestOption = (location, options) => {
          let smallestDistance = Infinity;
          let bestOption = [];

          options.forEach((option) => {
            const distance = manhattanDistance(location, option);

            if (distance < smallestDistance) {
              smallestDistance = distance;
              bestOption = option;
            }
          });

          return [smallestDistance, bestOption];
        };

        let smallestDistance = Infinity;
        let bestMoveOption = [];

        moveOptions.forEach((moveOption) => {
          const [
            optionDistanceFromPlayer,
            nearestPlayerTile,
          ] = findNearestOption(moveOption, playerUnitTiles);

          if (optionDistanceFromPlayer < smallestDistance) {
            smallestDistance = optionDistanceFromPlayer;
            bestMoveOption = moveOption;
          }
        });

        if (moveOptions.length > 0) {
          newState = MoveUnit(
            newState,
            index,
            bestMoveOption // pickRandomlyFromArray(moveOptions)
          );
        } else {
          break;
        }
      }

      // hard code to always pick first AI ability
      newState = SelectAbility(newState, 0);

      const attackOptions = getAllLocations(newState.battle.tiles)
        .filter((neighbor) =>
          // filter out any neighbors without units on them
          newState.battle.units.some((unit) => isUnitAtLocation(unit, neighbor))
        )
        .filter((neighbor) =>
          // this may already be validated in our scenario
          isLocationValidAttackTarget(newState.battle, neighbor, newState.moves)
        )
        // filter out non-player unis to prevent firendly AI fire
        // check if any option is contained in a the tiles of a non-player unit
        .filter(
          (option) =>
            newState.battle.units.find((unit) =>
              unit.tiles.some(
                (tile) => tile[0] === option[0] && tile[1] === option[1]
              )
            ).owner === 0
        );

      if (attackOptions.length > 0) {
        newState = UseAbility(
          newState,
          index,
          pickRandomlyFromArray(attackOptions)
        );
      }

      newState = DeselectAbility(newState);
      newState = DeselectUnit(newState);
    }
  });

  // if all player units are dead, declare defeat
  if (
    state.battle.units.every(
      (unit) => unit.owner !== 0 || unit.tiles[0].length === 0
    )
  ) {
    // mark server as complete, and return to map
    return {
      ...state,
      view: "map",
    };
  }

  // reset units
  const units = newState.battle.units.map((unit) => ({
    ...unit,
    moves: [unit.moves[1], unit.moves[1]],
    ap: [unit.ap[1], unit.ap[1]],
    acted: false,
  }));

  return {
    ...state,
    battle: {
      ...state.battle,
      turn: state.battle.turn + 1,
      units,
    },
  };
};

const UnitInfo = ({
  unit: {
    name = "NONE SELECTED",
    icon = [0, 3],
    size = undefined,
    ap = [],
    abilities = [],
    moves = [],
    tiles = [],
  },
}) => {
  const header = `--[ ${name} ]--`;
  const HR = () => <p>{"-".repeat(header.length)}</p>;

  return (
    <div class="unit-info">
      <p>{header}</p>
      <Sprite sheet={tileSheet} icon={icon} scale={3} />
      <p>{`Size: ${tiles.length ?? "?"}/${size ?? "?"}`}</p>
      <p>{`Moves: ${moves[0] ?? "?"}/${moves[1] ?? "?"}`}</p>
      <p>{`Actions: ${ap[0] ?? "?"}/${ap[1] ?? "?"}`}</p>
      <HR />
      <ul>
        {abilities.map((ability, index) => (
          <li
            onclick={(state) => ClickAbility(state, index)}
            class={ability.selected && "selected"}
          >{`${ability.key} - ${ability.power}`}</li>
        ))}
      </ul>
      <HR />
    </div>
  );
};

const Battle = ({
  battle: { tiles, selected, units, selectedAction, turn },
  moves,
}) => {
  const selectedInfo =
    tiles[selected[0]] &&
    units.find((unit) => isUnitHeadAtLocation(unit, selected));

  return (
    <main>
      <div class="battle-map">
        <Grid
          sheet={tileSheet}
          tiles={tiles.map((row, rowIndex) =>
            row.map((tile, colIndex) => {
              if (tile === null) {
                tile = {
                  name: undefined,
                  icon: undefined,
                  size: undefined,
                  abilities: [],
                  moves: [],
                  tiles: [],
                };
              }

              const moveTarget = isLocationValidMoveTarget(
                { tiles, selected, units, selectedAction },
                [rowIndex, colIndex]
              );
              const attackTarget = isLocationValidAttackTarget(
                { tiles, selected, units, selectedAction },
                [rowIndex, colIndex],
                moves
              );

              const unitHead = units.find((unit) =>
                isUnitHeadAtLocation(unit, [rowIndex, colIndex])
              );
              if (unitHead) {
                return {
                  ...unitHead,
                  attackTarget,
                };
              }

              const unitPiece = units.find((unit) =>
                isUnitAtLocation(unit, [rowIndex, colIndex])
              );
              if (unitPiece) {
                return {
                  ...unitPiece,
                  icon: [],
                  attackTarget,
                };
              }

              return {
                ...tile,
                moveTarget,
                attackTarget,
              };
            })
          )}
          onTileClick={ClickTile}
          onAnimationEnd={FinishAnimation}
          selected={selected}
        />
      </div>
      <UnitInfo
        unit={
          selectedInfo
            ? {
                ...selectedInfo,
                abilities: selectedInfo.abilities.map((ability, index) => ({
                  ...moves[ability],
                  selected: selectedAction === index,
                })),
              }
            : {}
        }
      />
      <p>Turn: {turn + 1}</p>
      <button onclick={EndTurn}>End Turn</button>
      {units.every((unit) => unit.owner !== 0 || unit.tiles[0].length === 0) ? (
        // if defeat is true
        <p>
          <span style={{ color: "red" }}>Connection attempt FAILED!</span> This
          server is still <span style={{ color: "red" }}>404 Not Found</span>.
          Try hacking again to retry hack battle.
        </p>
      ) : units.every(
          (unit) => unit.owner === 0 || unit.tiles[0].length === 0
        ) ? (
        // if success is true
        <p>
          <span style={{ color: "green" }}>Connection attempt SUCCEEDED!</span>{" "}
          This server is now <span style={{ color: "green" }}>200 OK</span>.
          Connection to The Cloud has been re-established.
        </p>
      ) : (
        // default text
        <p>
          Destroy the enemy programs to re-establish connection between this
          server and The Cloud.
        </p>
      )}
    </main>
  );
};

export default Battle;
