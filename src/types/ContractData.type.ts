type Status = 'IC' | 'IP' | 'CP'

export enum StatusType {
    INCOMPLETE = 'IC',
    INPROGRESS = 'IP',
    COMPLETE = 'CP',
}

export interface Holiday {
    id: Number
    title: String
    details: String | null
    date: Date
    observed: Date
}

interface TemplateData {
    tasks: TaskBuild[]
}

export interface Template {
    id: Number
    title: String
    subtitle: String | null
    data: TemplateData
}

export interface Position {
    id: Number
    title: String
    department: String
    created?: Date
}

export interface PointOfContactBuild {
    first_name: String
    last_name: String
    email: String
    prefix: String | null
    title_id?: Number | null
}

export interface PointOfContact {
    id: Number
    first_name: String
    last_name: String
    email: String
    prefix: String | null
    title?: Position | null
    title_id?: Number
    created?: Date
}

export interface TaskBuild {
    title: String
    sub_title: String | null
    slug: String
    status: Status
    gate: Number
    sub_gate: Number
    palt_plan: Number
    bus_days: Number
    ssp_date: Date | null
    comments: String | null
    poc: Number | null
    tasks: TaskBuild[] | null
}

export interface SimpleTask {
    id: Number
    title: String
    sub_title: String | null
    slug: String
    status: Status
    task_id: Number | null
    contract_id: Number
    order_id: Number
    comments: String | null
    tasks: Task[] | null
}

export interface Task {
    id: Number
    title: String
    sub_title: String | null
    slug: String
    status: Status
    task_id: Number | null
    contract_id: Number
    order_id: Number
    gate: Number
    subgate: Number | null
    palt_plan: Number
    palt_actual: Number
    bus_days: Number
    start_date: Date
    end_date: Date
    ssp_date: Date | null
    poc: PointOfContact | null
    comments: String | null
    tasks: Task[] | null
    status_updated: Date | null
}

export interface SimpleContract {
    id: Number
    title: String
    sub_title: String
    slug: String
    ucid: String
    status: Status
    tasks: SimpleTask[]
}

export interface Contract {
    id: Number
    title: String
    sub_title: String
    slug: String
    type: String
    ucid: String // Unique Contract ID
    status: Status
    value: Number
    ss_leads: PointOfContact[]
    need_date: Date
    award_date: Date
    start_date: Date
    cycle_code: String
    pop_date: Date // When current contract ends
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
