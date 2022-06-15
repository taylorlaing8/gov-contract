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
    slug: String                    // Auto generated from title if not given
    status: Status
    task_id: Number | null          // Null if it is the task, Number if it is a subtask
    contract_id: Number             // Foreign key to connect object together
    order_id: Number                // Order of object in list of objects (rows) that make up the contract
    data: TaskTitleData | TaskData  // Data about the object itself. If task is the title task, it will have one of two data object types
}

export interface TaskTitleData {
    id: Number
    contract_id: Number
    gate: Number
    subgate: Number | null
    ssp_date: Date | null
    comments: String | null
    tasks: Task[]
}

export interface TaskData {
    id: Number
    contract_id: Number
    task_id: Number
    gate: Number
    subgate: Number | null
    palt_plan: Number
    bus_days: Number
    poc: PointOfContact | Number
    start_date: Date
    end_date: Date
    ssp_date: Date
    comments: String | null
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