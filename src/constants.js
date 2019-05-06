import moment from "moment"
import { at } from "./components/utils/datetime"

export const DEVICES = [1, 2, 3, 4]
export const OPEN_HOURS = {
    open: at("14:00"),
    close: at("24:00")
}
export const SLOT_DURATION = moment.duration(15, "minutes")
export const SLOT_COUNT = moment.duration(OPEN_HOURS.close.diff(OPEN_HOURS.open)) / SLOT_DURATION
export const MINIMUM_DURATION = moment.duration(30, "minutes")
export const PEAK_TIME = {
    from: at("17:00"),
    to: at("21:00")
}
export const PEOPLE_PER_DEVICE = 4