import type { ContractBuild, Holiday, PointOfContact, SimpleTask, Task } from '@/types/ContractData.type'
import contractCycles from '@/views/contracts/cTemplates/ContractCycles'

export function formatDate(date: string) {
    return new Date(date.replace(/-/g, '/'))
}

export function dateString(date: Date) {
    return date.toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"short", day:"numeric"})
}

export function ymdDateFormat(date: Date | string | null) {
    if (typeof date === 'string') return (new Date(date)).toISOString().slice(0, 10)
    else if (date === null) return new Date().toISOString().slice(0, 10)
    else return date.toISOString().slice(0, 10)
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
        sub_title: task.sub_title && task.sub_title !== "" ? task.sub_title : null,
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

export function cycleCodeString(details: ContractBuild, code: string) {
    let ccstring = ''
    contractCycles.types.forEach((type) => {
        if (type.title === details.type) {
            type.value.forEach((val) => {
                if (val.code === code) ccstring = `${val.code} (${val.sub_title})`
            })
        }
    })
    return ccstring
}