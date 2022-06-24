type Status = 'IC' | 'IP' | 'CP'

export enum StatusType {
    INCOMPLETE = 'IC',
    INPROGRESS = 'IP',
    COMPLETE = 'CP',
}

export type Position = {
    id: Number,
    title: String
    department: String
    created?: Date
}

export type PointOfContact = {
    id: Number,
    first_name: String
    last_name: String
    email: String
    prefix: String
    title?: Position | null
    title_id?: Number
    created?: Date
}

export type Task = {
    id: Number
    title: String
    sub_title: String | null
    slug: String
    status: Status
    task_id: Number | null                  // Null if it is the task, Number if it is a subtask
    contract_id: Number
    order_id: Number
    gate: Number
    subgate: Number | null
    palt_plan: Number | null
    bus_days: Number | null
    start_date: Date | null
    end_date: Date | null
    ssp_date: Date | null
    poc: PointOfContact | Number | null
    comments: String | null
    tasks: Task[] | null                    // If subtasks exist, this lists them out, otherwise null
}

export type Contract = {
    id: Number
    title: String
    sub_title: String
    slug: String
    type: String
    ucid: String                    // Unique Contract ID
    status: Status
    value: Number
    ss_leads: PointOfContact[]
    need_date: Date
    award_date: Date
    cycle_code: String
    pop_date: Date                  // When current contract ends
    g_o_p: Number
    g_t_p: Number
    g_tr_p: Number
    g_fr_o_p: Number
    g_fr_t_p: Number
    g_fr_tr_p: Number
    g_fr_fr_p: Number
    g_fr_fv_p: Number
    pocs: PointOfContact[]
    tasks: Task[]
    created: Date
    pco: PointOfContact
    buyer: PointOfContact
    admin_pco: PointOfContact
    admin_buyer: PointOfContact
}