type Status = 'IC' | 'IP' | 'CP'

export enum StatusType {
    INCOMPLETE = 'IC',
    INPROGRESS = 'IP',
    COMPLETE = 'CP',
}

export interface HolidayBuild {
    title: string
    details: string | null
    date: Date | string
    observed: Date | string
}

export interface Holiday {
    id: number
    title: string
    details: string | null
    date: Date | string
    observed: Date | string
}

interface TemplateData {
    tasks: TaskBuild[]
}

export interface Template {
    id: number
    title: string
    subtitle: string | null
    data: TemplateData
}

export interface PositionBuild {
    title: string,
    department: string,
}

export interface Position {
    id: number
    title: string
    department: string
    created?: Date
}

export interface PointOfContactBuild {
    first_name: string
    last_name: string
    email: string
    prefix: string | null
    title_id?: number | null
}

export interface PointOfContact {
    id: number
    first_name: string
    last_name: string
    email: string
    prefix: string | null
    title?: Position | null
    title_id?: number
    created?: Date
}

export interface TaskBuild {
    title: string
    sub_title: string | null
    slug: string
    status: Status
    gate: number
    sub_gate: number | null
    palt_plan: number
    bus_days: number
    ssp_date: Date | null
    comments: string | null
    poc: number | null
    tasks: TaskBuild[] | null
}

export interface SimpleTask {
    id: number
    title: string
    sub_title: string | null
    slug: string
    status: Status
    task_id: number | null
    contract_id: number
    order_id: number
    comments: string | null
    tasks: Task[] | null
}

export interface Task {
    id: number
    title: string
    sub_title: string | null
    slug: string
    status: Status
    task_id: number | null
    contract_id: number
    order_id: number
    gate: number
    subgate: number | null
    palt_plan: number
    palt_actual: number
    bus_days: number
    start_date: Date
    end_date: Date
    ssp_date: Date | null
    poc: PointOfContact | null
    comments: string | null
    tasks: Task[] | null
    status_updated: Date | null
}

export interface SimpleContract {
    id: number
    title: string
    sub_title: string
    slug: string
    ucid: string
    status: Status
    tasks: SimpleTask[]
    pocs: PointOfContact[]
}

export interface Contract {
    id: number
    title: string
    sub_title: string
    slug: string
    type: string
    ucid: string // Unique Contract ID
    status: Status
    value: number
    ss_leads: PointOfContact[]
    need_date: Date
    award_date: Date
    start_date: Date
    cycle_code: string
    pop_date: Date // When current contract ends
    g_o_p: number
    g_t_p: number
    g_tr_p: number
    g_fr_o_p: number
    g_fr_t_p: number
    g_fr_tr_p: number
    g_fr_fr_p: number
    g_fr_fv_p: number
    pocs: PointOfContact[]
    tasks: Task[]
    created: Date
    pco: PointOfContact
    buyer: PointOfContact
    admin_pco: PointOfContact
    admin_buyer: PointOfContact
}
