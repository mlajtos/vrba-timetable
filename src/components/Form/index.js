import React, { PureComponent } from "react"
import moment from "moment"
import "moment/locale/sk"
import removeAccents from "remove-accents"

import { formatDuration } from "../utils/datetime"
import { SLOT_DURATION, SLOT_COUNT, OPEN_HOURS } from "../../constants"

import "./style.css"
import vive_logo from "./vive_logo.svg"
import plus from "./plus.svg"
import minus from "./minus.svg"


moment.relativeTimeRounding(Math.floor)
moment.relativeTimeThreshold("h", 24)

export default class Form extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            reservation: {
                from: moment().startOf("hour").add({ hours: 1 }),
                to: moment().startOf("hour").add({ hours: 2 }),
                devices: [0],
                people: 4,
                catering: false,
                cateringNote: "",
                privateCompany: false,
                ...props.reservation,
            }
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            reservation: props.reservation
        })
    }
    update(prop, value) {
        let reservation = {
            ...this.state.reservation,
            [prop]: value
        }

        if (prop === "from" || prop === "to") {
            return
        }

        if (prop === "name" && !reservation.email && reservation.name !== "") {
            reservation.suggestedEmail = removeAccents(reservation.name).replace(" ", ".").toLowerCase() + "@gmail.com"
        } else {
            console.log("mu")
            reservation.suggestedEmail = undefined
        }

        this.setState({ reservation })
    }
    render() {
        const reservation = this.state.reservation

        if (!reservation) {
            return <span className="text-muted text-center">Vyberte rezerváciu alebo vytvorte novú.</span>
        }

        const {
            from,
            to,
            devices,
            people,
            catering,
            cateringNote,
            privateCompany,
            note,
            name,
            phone,
            email,
            suggestedEmail,
            price
        } = reservation

        const duration = moment.duration(to.diff(from))

        const D = "ABCD".split("")
        const d = devices.map((v, i) => D[v - 1]).join(", ")

        return (
            <Panel>
                <div className="panel-heading">Objednávka</div>
                <Body>
                    <form>
                        <Group label="Dátum a čas">
                            <input type="text" className="form-control date" value={from.format("dddd, LL")} />
                            <div className="input-group">
                                <Time className="from" value={from} onChange={e => this.update("from", e.target.value) } />
                                <span className="input-group-addon"> – </span>
                                <Time className="to" value={to} min={from} onChange={e => this.update("from", e.target.value) } />
                            </div>
                            <small className="form-text text-muted text-center">{formatDuration(duration)}</small>
                        </Group>
                        <Group label="Počet ľudí">
                            <NumberInput value={people} onChange={value => { this.update("people", value) }} />
                        </Group>
                        <Group label="Zariadenia">
                            <div className="input-group">
                                <span className="input-group-addon"><img src={vive_logo} alt="HTC Vive" /></span>
                                <input type="text" className="form-control" disabled value={d} />
                            </div>
                        </Group>
                        <Group>
                            <label className="control-label">
                                <input type="checkbox" onChange={e => { this.update("privateCompany", e.target.checked) }} className="form-check-input" checked={privateCompany} />  Uzavretá spoločnosť<br />
                                <small className="form-text text-muted">Rezervovať celý podnik pre súkromnú akciu.</small>
                            </label>
                            { /* >=3 devices -> Uzavretá spoločnosť je možná až od 3 hodín na všetky VR. */ }
                            { /* Príplatok za uzavretú spoločnosť je 30€/hodinu. */ }
                        </Group>
                        <Group>
                            <div className="form-group">
                                <label className="control-label">
                                    <input type="checkbox" className="form-check-input" checked={catering} onChange={e => { this.update("catering", e.target.checked) }} /> Catering
                                    <small className="form-text text-muted">V prípade vlastného cateringu/donášky si účtujeme poplatok 1€ za osobu. <a href="https://vrbratislava.sk/catering/" rel="noopener noreferrer" target="_blank">Viac informácií o cateringu.</a></small>
                                </label>
                            </div>
                            <Text visible={catering} value={cateringNote} placeholder="poznámky ku cateringu" onChange={e => { this.update("cateringNote", e.target.value) }} />
                        </Group>

                        <fieldset>
                            <legend>Kontakt</legend>
                            <Group label="Meno">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => { this.update("name", e.target.value) }}
                                    className="form-control"
                                    placeholder="Janko Hraško"
                                    autoComplete="name"
                                />
                            </Group>
                            <Group label="E-mail">
                                <input
                                    type="email"
                                    value={email || suggestedEmail}
                                    onChange={e => { this.update("email", e.target.value) }}
                                    className="form-control"
                                    placeholder="janko.hrasko@gmail.com"
                                    autoComplete="email"
                                />
                            </Group>
                            <Group label="Telefón">
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => { this.update("phone", e.target.value) }}
                                    className="form-control"
                                    placeholder="+421"
                                    autoComplete="tel"
                                />
                            </Group>
                        </fieldset>

                        <Group label="Poznámka">
                            <Text visible={true} value={note} placeholder="ďalšie detaily" onChange={e => { this.update("note", e.target.value) }} />
                        </Group>
                    </form>
                </Body>
                <div className="panel-footer">
                    <h3 className="price">{price}€</h3>
                    <button className="btn btn-default btn-primary">Objednať</button>
                </div>
            </Panel>
        )
    }
}

class NumberInput extends PureComponent {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onStepDown = this.onStepDown.bind(this)
        this.onStepUp = this.onStepUp.bind(this)
    }
    onChange(e) {
        this.props.onChange(e.target.value)
    }
    onStepUp() {
        this.props.onChange(+this.props.value + 1)
    }
    onStepDown() {
        this.props.onChange(+this.props.value - 1)
    }
    render() {
        const min = 1
        const max = Math.max(this.props.value, 50)
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="input-group">
                    <input type="number" onChange={this.onChange} className="form-control" value={this.props.value} />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={ this.onStepDown }>
                            <img src={minus} alt="menej" />
                        </button>
                        <button className="btn btn-default" type="button" onClick={ this.onStepUp }>
                            <img src={plus} alt="viac" />
                        </button>
                    </span>
                </div>
                {/*
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <datalist id="ticks">
                        {Array.from({ length: max / 10 }).map((v, i) => <option key={i}>{i * 10}</option>)}
                    </datalist>
                    <input ref={el => this.el = el} type="range" onChange={this.onChange} value={this.props.value} min={min} max={max} list="ticks" />
                    <div style={{ display: "flex" }}>
                        <span>{min}</span>
                        <div style={{ flex: 1 }} />
                        <span>{max}</span>
                    </div>
                </div>
                */}
            </div>
        )
    }
}

class Group extends PureComponent {
    render() {
        const columnSpanClass = this.props.span ? `col-lg-${this.props.span}` : ""
        return (
            <div className={`form-group ${columnSpanClass}`}>
                {
                    this.props.label ? <label className="control-label">{this.props.label}</label> : null
                }
                {this.props.children}
            </div>
        )
    }
}

class Text extends PureComponent {
    render() {
        return (
            this.props.visible
                ? (
                    <textarea ref={(el) => this.el = el} onChange={this.props.onChange} className="form-control" placeholder={this.props.placeholder} value={this.props.value} />
                )
                : null
        )
    }
}

class Panel extends PureComponent {
    render() {
        return (
            <div className="panel panel-default">
                {this.props.children}
            </div>
        )
    }
}

class Body extends PureComponent {
    render() {
        return (
            <div className="panel-body">
                {this.props.children}
            </div>
        )
    }
}

class Time extends PureComponent {
    isValid(date) {
        let valid = true
        if (this.props.min) {
            valid = valid && date.isAfter(this.props.min)
        }

        if (this.props.max) {
            valid = valid && date.isBefore(this.props.max)
        }

        return valid
    }
    render() {
        return (
            <select
                className={`form-control ${this.props.className}`}
                value={this.props.value.format("HH:mm")}
                onChange={this.props.onChange}
            >
                {
                    Array
                        .from({ length: SLOT_COUNT })
                        .map((v, i) => {
                            const date = this.props.value.clone().startOf("day")
                            date.add({ hours: 14 }) // HACK
                            date.add({ minutes: SLOT_DURATION.asMinutes() * i })
                            return date
                        })
                        .filter((v, i) => this.isValid(v))
                        .map((v, i) => {
                            const value = v.format("HH:mm")
                            //const duration = this.props.min ? " – " + formatDuration(moment.duration(v.diff(this.props.min)), true) : ""
                            return <option key={value} value={value}>{value}</option>
                        })
                }
            </select>
        )
    }
}

class TimeNative extends PureComponent {
    render() {
        return (
            <input
                type="time"
                className={`form-control ${this.props.className}`}
                value={this.props.value.format("HH:mm")}
                step={SLOT_DURATION.asSeconds()}
                onChange={this.props.onChange}
            />
        )
    }
}