import type { Holiday, PointOfContact, Task } from '@/types/ContractData.type'

export function formatDate (date: string) {
    return new Date(date)
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

export function calculatePaltActual (start: string, end: string) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    // Add logic to calculate days between SKIPPING DAYS THAT GO OVER BLACKOUT DAYS
    const daysBetween = (endDate.getTime() - startDate.getTime())/(1000 * 3600 * 24)
    
    console.log(daysBetween)
    
    return daysBetween
}