type Status = 'IC' | 'IP' | 'CP'

export enum StatusType {
    INCOMPLETE = 'IC',
    INPROGRESS = 'IP',
    COMPLETE = 'CP',
}

export interface Position {
    id: number,
    title: String
    department: String
}

export interface PointOfContact {
    id: number,
    first_name: String
    last_name: String
    email: String
    prefix: String
    title: Position | number
}

export interface Task {
    id: number
    title: String
    sub_title: String | null
    slug: String                    // Auto generated from title if not given
    status: Status
    task_id: number | null          // Null if it is the task, Number if it is a subtask
    contract_id: number             // Foreign key to connect object together
    order_id: number                // Order of object in list of objects (rows) that make up the contract
    data: TaskTitleData | TaskData  // Data about the object itself. If task is the title task, it will have one of two data object types
}

export interface TaskTitleData {
    id: number
    contract_id: number
    gate: number
    subgate: number | null
    ssp_date: Date | null
    comments: String | null
    tasks: Task[]
}

export interface TaskData {
    id: number
    contract_id: number
    task_id: number
    gate: number
    subgate: number | null
    palt_plan: number
    bus_days: number
    poc: PointOfContact
    start_date: Date
    end_date: Date
    ssp_date: Date
    comments: String | null
}
