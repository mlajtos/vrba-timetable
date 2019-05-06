// init: on 11.11.2017 by mlajtos
import React, { PureComponent } from "react"
import moment from "moment"
import "moment/locale/sk"
import * as d3 from "d3"
import * as chromaticScale from "d3-scale-chromatic"

import "./Table.css"

import ReservationStore from "./ReservationStore"

import Container from "./Container"
import Navigation from "./Navigation"
import Grid from "./Grid"
import Ridges from "./Ridges"
import Slots from "./Slots"
import Reservations from "./Reservations"
import Selection from "./Selection"
import Form from "./Form"

import { gridCells } from "./utils/grid"

import {
    DEVICES,
    SLOT_DURATION,
    SLOT_COUNT,
    MINIMUM_DURATION,
    PEOPLE_PER_DEVICE,
    PEAK_TIME
} from "../constants"

// const pipe = (fn,...fns) => (...args) => fns.reduce( (acc, fn) => fn(acc), fn(...args))

export const colorScale = d3.scaleOrdinal(chromaticScale.schemePastel1)
const id = (function* () { let i = 0; while (true) { yield i; i += 1; } })()

const minmax = (v1, v2) => (v1 < v2 ? [v1, v2] : [v2, v1])

const filterSlots = (slots, selectionSpan) => {
    const [begin, end] = selectionSpan
    const [minRow, maxRow] = minmax(begin.row, end.row)
    const [minColumn, maxColumn] = minmax(begin.column, end.column)
    
    const filteredSlots = slots.filter(s => (
        (s.row >= minRow) && (s.row <= maxRow) && (s.column >= minColumn) && (s.column <= maxColumn)
    ))

    return filteredSlots
}

const intersection = (range1, range2) => {
    const from = moment.max(range1.from, range2.from)
    const to = moment.min(range1.to, range2.to)
    const duration = moment.duration(to.diff(from))
    return Math.max(0, duration)
}

const calcPrice = (reservation) => {
    const devices = reservation.devices.length
    const duration = moment.duration(reservation.to.diff(reservation.from)).asMinutes()
    const isMinimal = (duration === MINIMUM_DURATION.asMinutes())

    const duringPeak = Math.round(moment.duration(intersection(reservation, PEAK_TIME)).asMinutes())
    const outsidePeak = duration - duringPeak

    // <4hr closedCompany +30€/hr 
    // >=4hr closedCompany +20€/hr

    let price = 0

    if (isMinimal) {
        price += (duringPeak / 30) * 20
        price += (outsidePeak / 30) * 15
    } else {
        price += (duringPeak / 60) * 30
        price += (outsidePeak / 60) * 25
    }

    price *= devices

    return price
}

export default class Table extends PureComponent {
    isSlotAvailable = (slot, reservations) => {
        return reservations
            .filter(reservation => reservation.devices.includes(slot.device))
            .reduce((acc, reservation) => {
                const startOverlaps = slot.from.isBetween(reservation.from, reservation.to, null, "[]")
                const endOverlaps = slot.to.isBetween(reservation.from, reservation.to, null, "[]")
                const overlaps = (startOverlaps || endOverlaps)
                const available = (acc && !overlaps)
                return available
            }, true)
    }

    generateCells = (date, reservations) => {
        const cells = gridCells({
            rows: DEVICES.length,
            columns: SLOT_COUNT,
            generator: (cell) => {
                const from = date.clone().add(moment.duration({ hours: 14 }))
                const slot = {
                    ...cell,
                    id: `${cell.row},${cell.column}`,
                    from: from.clone().add(moment.duration(SLOT_DURATION * cell.column)),
                    to: from.clone().add(moment.duration(SLOT_DURATION * (cell.column + 1))),
                    device: cell.row + 1,
                    devices: [cell.row + 1],
                    available: true
                }

                slot.available = this.isSlotAvailable(slot, reservations)
            
                return slot
            }
        })

        return cells
    }

    constructor(props) {
        super(props)
        
        this.state = this.computeState(props)
        this.selectionSpan = []

        this.onBeginSelection = this.onBeginSelection.bind(this)
        this.onChangeSelection = this.onChangeSelection.bind(this)
        this.onEndSelection = this.onEndSelection.bind(this)
        this.onSelect = this.onSelect.bind(this)
    }
    computeState(props) {
        const reservations = props.reservations
        const slots = this.generateCells(props.date, reservations)
        const state = {
            reservations,
            slots,
            tentativeReservation: null
        }
        return state
    }
    onSelect(reservation, event) {
        this.setState({
            tentativeReservation: {
                ...reservation,
                valid: true,
                state: "selected",
                price: calcPrice(reservation)
            }
        })
    }
    componentWillReceiveProps(props) {
        this.setState(this.computeState(props))
        this.selectionSpan = []
    }
    onBeginSelection(slot, event) {
        this.selectionSpan = [slot, slot]
        this.computeTentativeReservation()
    }
    onEndSelection(slot, event) {
        if (!(this.state.tentativeReservation && this.state.tentativeReservation.valid)) {
            this.setState({
                tentativeReservation: null
            })
        } else {
            return;
            const reservation = {
                id: id.next().value,
                ...this.state.tentativeReservation,
            }

            ReservationStore.add(reservation)

            this.setState({
                tentativeReservation: null
            })
        }
    }
    onChangeSelection(slot, event) {
        this.selectionSpan = [this.selectionSpan[0], slot]
        this.computeTentativeReservation()
    }
    computeTentativeReservation() {
        const [first, last] = this.selectionSpan
        if (!(first && last)) { return }

        const from = moment.min(first.from, last.from)
        const to = moment.max(first.to, last.to)
        const duration = moment.duration(to.diff(from))
        
        const selection = filterSlots(this.state.slots, this.selectionSpan)
        const devices = [...new Set(selection.map(s => s.device))]
        const people = Math.round(devices.length * PEOPLE_PER_DEVICE * duration.asHours() / 2)

        let valid = selection.reduce((a, s) => (a && s.available), true)
        valid = valid && (duration >= MINIMUM_DURATION)

        const [rowStart, rowEnd] = minmax(first.row, last.row)
        const [columnStart, columnEnd] = minmax(first.column, last.column)

        const position = { rowStart, columnStart, rowEnd, columnEnd }

        const privateCompany = (people > 30 || devices.length === 4)

        const catering = (duration.asHours() >= 2.5)
        const cateringNote = catering ? (people + "x Subway") : ""

        const tentativeReservation = {
            ...position,
            from,
            to,
            duration,
            devices,
            people,
            privateCompany,
            catering,
            cateringNote,
            valid
        }

        tentativeReservation.price = calcPrice(tentativeReservation)

        this.setState({ tentativeReservation })
    }
    render() {
        return (
            <Container>
                <main>
                    <Navigation date={this.props.date} />
                    <Grid
                        tracks={DEVICES.length}
                        slotsPerTrack={SLOT_COUNT}
                        beginSelection={this.onBeginSelection}
                        changeSelection={this.onChangeSelection}
                        endSelection={this.onEndSelection}
                    >
                        <Ridges slots={this.state.slots} />
                        <Reservations reservations={this.state.reservations} onSelect={this.onSelect} />
                        <Selection reservation={this.state.tentativeReservation} />
                        <Slots
                            slots={this.state.slots}
                            beginSelection={this.onBeginSelection}
                            changeSelection={this.onChangeSelection}
                            endSelection={this.onEndSelection}
                        />
                    </Grid>
                </main>
                <aside>
                    <Form reservation={this.state.tentativeReservation} />
                </aside>
            </Container>
        )
    }
}