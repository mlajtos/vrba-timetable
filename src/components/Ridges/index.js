import React, { PureComponent } from "react"
import "./style.css"
import moment from "moment"

import { gridArea } from "../utils/grid"

export default class Ridges extends PureComponent {
    render() {
        const ridges = getRidges(this.props.slots).map((r, i) => <Ridge key={"ridge-" + i} ridge={r} />)
        return ridges
    }
}

class Ridge extends PureComponent {
    render() {
        const style = gridArea(this.props.ridge)
        return (
            <div className="ridge" style={style}/>
        )
    }
}

const getRidges = (slots) => {
    return (
        slots
            .filter(slot => slot.available)
            .reduce(mergeNeighbours, mergeNeighbours_init).ridges
            .map(ridge => (
                ridge.reduce((a, c) => ({
                    ...a,
                    from: moment.min(a.from, c.from),
                    to: moment.max(a.to, c.to),
                    rowStart: Math.min(a.row, c.row),
                    columnStart: Math.min(a.column, c.column),
                    rowEnd: Math.max(a.row, c.row),
                    columnEnd: Math.max(a.column, c.column)
                }))
            ))
    )
}

const mergeNeighbours_init = { array: [], previousSlot: null, ridges: [] }
const mergeNeighbours = ({ array, previousSlot, ridges }, currentSlot, i, slots) => {
    if (i === 0) {
        if (i === slots.length - 1) {
            return { array: [], previousSlot: currentSlot, ridges: [...ridges, [...array, currentSlot]] }
        } 
        return { array: [currentSlot], previousSlot: currentSlot, ridges }
    }

    if (neighbours(previousSlot, currentSlot)) {
        if (i === slots.length - 1) {
            return { array: [], previousSlot: currentSlot, ridges: [...ridges, [...array, currentSlot]] }
        }
        return { array: array.concat([currentSlot]), previousSlot: currentSlot, ridges }
    }

    if (i === slots.length - 1) {
        return { array: [], previousSlot: currentSlot, ridges: [...ridges, array, [currentSlot]] }
    }

    return { array: [currentSlot], previousSlot: currentSlot, ridges: [...ridges, array] }
}

const neighbours = (s1, s2) => (
    ((s1.row - s2.row) === 0) && (Math.abs(s1.column - s2.column) === 1)
)