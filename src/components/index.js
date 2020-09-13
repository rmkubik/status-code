import h from "../hyperapp-jsx";

import { isUnitAtLocation, getNeighborLocations } from "../utils";

const TILE_SIZE = 16;

const Sprite = ({
  sheet,
  icon: [row, col] = [],
  color = "white",
  bg = "transparent",
  scale = 1,
  onclick,
  selected,
  moveTarget,
  attackTarget,
  neighbors = [],
  animation = {},
  onanimationend,
}) => {
  return (
    <div
      class={`sprite${selected ? " selected" : ""}${
        moveTarget ? " move-target" : ""
      }${attackTarget ? " attack-target" : ""}${
        animation.state === "UNSTARTED"
          ? ` animated ${
              animation.type === "ADDED" ? "scale-in" : "scale-out"
            } fast`
          : ""
      }`}
      style={{
        width: `${TILE_SIZE * scale}px`,
        height: `${TILE_SIZE * scale}px`,
        backgroundColor:
          animation.state === "UNSTARTED" && animation.type === "REMOVED"
            ? animation.bg
            : bg,
        borderTop:
          neighbors.some((neighbor) => neighbor[0] === -1) &&
          !selected &&
          !moveTarget &&
          !attackTarget
            ? "2px solid transparent"
            : "",
        borderBottom:
          neighbors.some((neighbor) => neighbor[0] === 1) &&
          !selected &&
          !moveTarget &&
          !attackTarget
            ? "2px solid transparent"
            : "",
        borderRight:
          neighbors.some((neighbor) => neighbor[1] === 1) &&
          !selected &&
          !moveTarget &&
          !attackTarget
            ? "2px solid transparent"
            : "",
        borderLeft:
          neighbors.some((neighbor) => neighbor[1] === -1) &&
          !selected &&
          !moveTarget &&
          !attackTarget
            ? "2px solid transparent"
            : "",
      }}
      onclick={onclick}
      onanimationend={onanimationend}
    >
      {row !== undefined && (
        <div
          style={{
            width: `${TILE_SIZE}px`,
            height: `${TILE_SIZE}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backgroundColor: color,
            webkitMaskImage: `url(${sheet})`,
            webkitMaskPosition: `-${col * TILE_SIZE}px -${row * TILE_SIZE}px`,
            position: "absolute",
          }}
        ></div>
      )}
      {moveTarget && (
        <div
          style={{
            width: `${TILE_SIZE}px`,
            height: `${TILE_SIZE}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backgroundColor: "cyan",
            webkitMaskImage: `url(${sheet})`,
            webkitMaskPosition: `-${4 * TILE_SIZE}px -${0 * TILE_SIZE}px`,
            position: "absolute",
          }}
        ></div>
      )}
      {attackTarget && (
        <div
          style={{
            width: `${TILE_SIZE}px`,
            height: `${TILE_SIZE}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backgroundColor: "red",
            webkitMaskImage: `url(${sheet})`,
            webkitMaskPosition: `-${1 * TILE_SIZE}px -${1 * TILE_SIZE}px`,
            position: "absolute",
          }}
        ></div>
      )}
    </div>
  );
};

const Server = ({ sheet, icon, label, number, statusCode, onclick }) => {
  const color = Math.floor(statusCode / 100) === 2 ? "green" : "red";

  return (
    <div class="server" onclick={onclick}>
      <Sprite sheet={sheet} icon={icon} scale={3} />
      <p>#{number}</p>
      <p>{label}</p>
      <p class="statusCode">
        <span class="flash animated infinite" style={{ color }}>
          ●{" "}
        </span>{" "}
        {statusCode}
      </p>
    </div>
  );
};

const Grid = ({ sheet, tiles, onTileClick, onAnimationEnd, selected }) => {
  const scale = 3;
  return (
    <div
      class="grid"
      style={{
        display: "grid",
        gridTemplateColumns: `${TILE_SIZE * scale + 16}px `.repeat(
          tiles[0].length
        ),
        gridTemplateRows: `${TILE_SIZE * scale + 16}px `.repeat(tiles.length),
      }}
    >
      {[].concat(
        ...tiles.map((row, rowIndex) =>
          row.map((tile, colIndex) => {
            let animation = tile.animation;

            if (tile.animation?.type === "REMOVED") {
              // only remove tile if it's in removed
              const isLocationRemoved = tile.animation.removedTiles.some(
                (removed) => removed[0] === rowIndex && removed[1] === colIndex
              );
              if (!isLocationRemoved) {
                animation = {};
              }
            }
            if (tile.animation?.type === "ADDED") {
              // only move tile if it's in moved
              const isLocationMoved = tile.animation.movedTiles.some(
                (moved) => moved[0] === rowIndex && moved[1] === colIndex
              );
              if (!isLocationMoved) {
                animation = {};
              }
            }

            return (
              <Sprite
                onclick={(state) => onTileClick(state, [rowIndex, colIndex])}
                onanimationend={(state) =>
                  onAnimationEnd(state, [rowIndex, colIndex])
                }
                sheet={sheet}
                scale={scale}
                selected={selected[0] === rowIndex && selected[1] === colIndex}
                neighbors={getNeighborLocations(tiles, [rowIndex, colIndex])
                  .filter((neighbor) => isUnitAtLocation(tile, neighbor))
                  .map((location) => [
                    location[0] - rowIndex,
                    location[1] - colIndex,
                  ])}
                {...tile}
                animation={animation}
              />
            );
          })
        )
      )}
    </div>
  );
};

export { Sprite, Server, Grid };
