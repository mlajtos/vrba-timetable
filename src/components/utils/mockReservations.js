import { at } from "./datetime"

const yesterday_at = (time) => at(time).subtract({ hours: 24 })

const data = [
    { id: "mock_1", from: at("14:00"), to: at("15:30"), people: 3, devices: [1], "note": "2 malé deti + 1 dospelý", name: "Martin Belokôňský", email: "martin@biely.kon" },
    { id: "mock_2", from: at("15:00"), to: at("16:00"), people: 3, devices: [2], "note": "2 malé deti + 1 dospelý", name: "Martin Belokôňský", email: "martin@biely.kon" },
    { id: "mock_3", from: at("18:00"), to: at("21:00"), people: 6, devices: [3, 4], "note": "študenti", name: "Martin Belokôňský", email: "martin@biely.kon" },
    { id: "mock_4", from: at("18:00"), to: at("20:00"), people: 2, devices: [1], "note": "gameri", name: "Martin Belokôňský", phone: "0948 333 674" },
    { id: "mock_5", from: at("18:15"), to: at("23:00"), people: 2, devices: [2], "note": "gameri 2", name: "Martin Belokôňský", email: "martin@biely.kon" },
    { id: "mock_6", from: at("16:15"), to: at("18:00"), people: 4, devices: [2], "note": "teambuilding", name: "Zuzana Uličná", email: "zuzana.ulicna@korporacia.sk", catering: true, cateringNote: "Pizzeria Lombardi", privateCompany: true },

    { id: "mock_7", from: yesterday_at("16:15"), to: yesterday_at("18:00"), people: 4, devices: [2], "note": "teambuilding", name: "Zuzana Uličná", contact: "zuzana.ulicna@korporacia.sk", catering: true }
]

export default data