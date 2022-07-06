interface Type {
    id: Number,
    title: String,
    value: TypeValue[],
}

interface TypeValue {
    id: Number,
    title: String,
    sub_title: String | null,
    g_fr_o_p: Number,
    g_fr_t_p: Number,
    g_fr_tr_p: Number,
    g_fr_fr_p: Number,
    g_fr_fv_p: Number,
}

interface ContractCycles {
    g_o_p: Number,
    g_t_p: Number,
    g_tr_p: Number,
    types: Type[],
}

const contractCycles: ContractCycles = {
    g_o_p: 5,
    g_t_p: 15,
    g_tr_p: 577,
    types: [
        {
            id: 1,
            title: "Competitive",
            value: [
                {
                    id: 1,
                    title: "4",
                    sub_title: "SAT",
                    g_fr_o_p: 20,
                    g_fr_t_p: 25,
                    g_fr_tr_p: 10,
                    g_fr_fr_p: 10,
                    g_fr_fv_p: 5,
                },
                {
                    id: 2,
                    title: "6",
                    sub_title: "SAT - TINA",
                    g_fr_o_p: 20,
                    g_fr_t_p: 45,
                    g_fr_tr_p: 15,
                    g_fr_fr_p: 15,
                    g_fr_fv_p: 5,
                },
                {
                    id: 3,
                    title: "8",
                    sub_title: ">TINA",
                    g_fr_o_p: 25,
                    g_fr_t_p: 45,
                    g_fr_tr_p: 15,
                    g_fr_fr_p: 25,
                    g_fr_fv_p: 10,
                },
                {
                    id: 4,
                    title: "1",
                    sub_title: "Sealed Bid",
                    g_fr_o_p: 25,
                    g_fr_t_p: 45,
                    g_fr_tr_p: 10,
                    g_fr_fr_p: 10,
                    g_fr_fv_p: 10,
                },
            ]
        },
        {
            id: 2,
            title: "Source Selection",
            value: [
                {
                    id: 1,
                    title: "9",
                    sub_title: "<$10M",
                    g_fr_o_p: 45,
                    g_fr_t_p: 60,
                    g_fr_tr_p: 30,
                    g_fr_fr_p: 55,
                    g_fr_fv_p: 10,
                },
                {
                    id: 2,
                    title: "5",
                    sub_title: "$10M - $100M",
                    g_fr_o_p: 60,
                    g_fr_t_p: 90,
                    g_fr_tr_p: 100,
                    g_fr_fr_p: 110,
                    g_fr_fv_p: 10,
                },
                {
                    id: 3,
                    title: "3",
                    sub_title: ">$100M",
                    g_fr_o_p: 60,
                    g_fr_t_p: 90,
                    g_fr_tr_p: 100,
                    g_fr_fr_p: 140,
                    g_fr_fv_p: 10,
                },
            ]
        },
        {
            id: 3,
            title: "Non-Competitive",
            value: [
                {
                    id: 1,
                    title: "7",
                    sub_title: "SAT",
                    g_fr_o_p: 20,
                    g_fr_t_p: 30,
                    g_fr_tr_p: 10,
                    g_fr_fr_p: 15,
                    g_fr_fv_p: 5,
                },
                {
                    id: 2,
                    title: "D",
                    sub_title: "SAT - TINA",
                    g_fr_o_p: 20,
                    g_fr_t_p: 45,
                    g_fr_tr_p: 30,
                    g_fr_fr_p: 20,
                    g_fr_fv_p: 5,
                },
                {
                    id: 3,
                    title: "E",
                    sub_title: null,
                    g_fr_o_p: 0,
                    g_fr_t_p: 0,
                    g_fr_tr_p: 0,
                    g_fr_fr_p: 0,
                    g_fr_fv_p: 0,
                },
                {
                    id: 4,
                    title: "E1",
                    sub_title: "TINA - $10M",
                    g_fr_o_p: 45,
                    g_fr_t_p: 60,
                    g_fr_tr_p: 50,
                    g_fr_fr_p: 30,
                    g_fr_fv_p: 10,
                },
                {
                    id: 5,
                    title: "E2",
                    sub_title: "$10M - <$500M",
                    g_fr_o_p: 45,
                    g_fr_t_p: 90,
                    g_fr_tr_p: 90,
                    g_fr_fr_p: 60,
                    g_fr_fv_p: 10,
                },
                {
                    id: 6,
                    title: "E3",
                    sub_title: ">$500M",
                    g_fr_o_p: 60,
                    g_fr_t_p: 90,
                    g_fr_tr_p: 150,
                    g_fr_fr_p: 120,
                    g_fr_fv_p: 10,
                },
            ]
        },
        {
            id: 4,
            title: "Delivery Orders / Mods / UCAs",
            value: [
                {
                    id: 1,
                    title: "M",
                    sub_title: "All $$ Values",
                    g_fr_o_p: 0,
                    g_fr_t_p: 0,
                    g_fr_tr_p: 0,
                    g_fr_fr_p: 0,
                    g_fr_fv_p: 15,
                },
                {
                    id: 2,
                    title: "N",
                    sub_title: "PR Gen Mod",
                    g_fr_o_p: 0,
                    g_fr_t_p: 0,
                    g_fr_tr_p: 0,
                    g_fr_fr_p: 0,
                    g_fr_fv_p: 20,
                },
                {
                    id: 3,
                    title: "F",
                    sub_title: "UCA",
                    g_fr_o_p: 10,
                    g_fr_t_p: 20,
                    g_fr_tr_p: 5,
                    g_fr_fr_p: 10,
                    g_fr_fv_p: 10,
                },
                {
                    id: 4,
                    title: "W",
                    sub_title: "UCA Defin",
                    g_fr_o_p: 20,
                    g_fr_t_p: 90,
                    g_fr_tr_p: 30,
                    g_fr_fr_p: 30,
                    g_fr_fv_p: 10,
                },
            ]
        },
    ]
}

export default contractCycles