import { SLOT_DURATION } from "../../constants"

export const gridCells = ({ rows, columns, generator }) => (
    Array.from({ length: rows }).map((r, row) => (
        Array.from({ length: columns }).map((c, column) => generator({ row, column }))
    )).reduce((a, b) => a.concat(b), [])
)

export const timeToColumn = (time) => {
    const openHour = time.clone().subtract({ minutes: 5 }).startOf("day").add({ hours: 14 }) // HACK
    const column = Math.floor(time.diff(openHour) / SLOT_DURATION)
    return column
}

export const gridArea = (slotLike) => {
    const rowStart = (slotLike.rowStart + 1)        || slotLike.devices[0]
    const columnStart = (slotLike.columnStart + 1)  || timeToColumn(slotLike.from) + 1
    const rowEnd = (slotLike.rowEnd + 2)            || slotLike.devices[slotLike.devices.length - 1] + 1
    const columnEnd = (slotLike.columnEnd + 2)      || timeToColumn(slotLike.to) + 1

    const gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`

    return { gridArea }
}

export const grid = (rows, columns) => {
    const cellHeight = 100 / rows
    const cellWidth = 100 / columns
    const rowGap = "1em"
    const columnGap = "0px"

    return {
        display: "grid",
        gridAutoRows: `calc(${cellHeight}% - ${rowGap})`,
        gridAutoColumns: `calc(${cellWidth}% - ${columnGap})`,
        gridGap: `${rowGap} ${columnGap}`
    }
}