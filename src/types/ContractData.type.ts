type Status = 'IC' | 'IP' | 'CP'

export enum StatusType {
    INCOMPLETE = 'IC',
    INPROGRESS = 'IP',
    COMPLETE = 'CP',
}

export interface Position {
    id: Number,
    title: String
    department: String
}

export interface PointOfContact {
    id: Number,
    first_name: String
    last_name: String
    email: String
    prefix: String
    title: Position | Number
}

export interface Task {
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

export interface Contract {
    id: Number
    title: String
    sub_title: String
    abv: String
    type: String
    ucid: String                    // Unique Contract ID
    status: Status
    pop_date: Date                  // When current contract ends
    gate_one_plan: Number
    gate_two_plan: Number
    gate_three_plan: Number
    gate_four_one_plan: Number
    gate_four_two_plan: Number
    gate_four_three_plan: Number
    gate_four_four_plan: Number
    gate_four_five_plan: Number
    pocs: PointOfContact[]
}