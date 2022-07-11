import type { Holiday, PointOfContact, SimpleTask, Task } from '@/types/ContractData.type'

export function formatDate(date: string) {
    return new Date(date.replace(/-/g, '/'))
}

export function dateString(date: Date) {
    return date.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"})
}

export function ymdDateFormat(date: Date) {
    return date.toISOString().slice(0, 10)
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

export function formatTaskParam (task: SimpleTask) {
    return (`${task.id}-${task.slug}`)
}

export function unformatTaskParam(routeSlug: string): number {
    return parseInt(routeSlug.slice(0, routeSlug.indexOf('-')))
}

export function generateSlug(text: string) {
    let slug = text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/--/g, '-').replace(/---/g, '-')
    if (slug.charAt(slug.length - 1) === '-') slug = slug.substring(0, slug.length - 1)
    return slug
}