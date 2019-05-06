import moment from "moment"
import flex from "./flex"

export const at = (time) => moment(time, "HH:mm")

const flexHour = (n) => flex(n, ["hodina", "hodiny", "hodín"])
const flexMinutes = (n) => flex(n, ["minúta", "minúty", "minút"])

export const formatDuration = (m, minimal) => {
    if (m.hours() < 1) { return minimal ? (m.minutes() + "m") : flexMinutes(m.minutes()) }
    if (m.minutes() === 0) { return minimal ? (m.hours() + "h") : flexHour(m.hours()) }
    return minimal ? `${m.hours()}h${m.minutes()}m` : flexHour(m.hours()) + " " + flexMinutes(m.minutes())
}