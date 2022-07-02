import type { Holiday, PointOfContact, Task } from '@/types/ContractData.type'

export function formatDate(date: string) {
    return new Date(date.replace(/-/g, '/'))
}

export function dateString(date: string) {
    return new Date(date.replace(/-/g, '/')).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
}

export function formatPOC(poc: PointOfContact | null) {
    if (poc !== null) {
        return `${poc.prefix}. ${poc.first_name} ${poc.last_name}`
    }
    else return '-'
}

export function formatUpdateTask(task: Task) {
    const data = {
        ...task,
        comments: task.comments && task.comments !== "" ? task.comments : null,
        poc: task.poc ? task.poc.id : null
    }
    return { data }
}