import { govHttp } from './http'
import type { Holiday, PointOfContact, Position, Task, Contract, Template, PointOfContactBuild, PositionBuild, HolidayBuild, ContractBuild } from '@/types/ContractData.type'

export class HolidayService {
    static get(id: Number) {
        return govHttp.get(`/holidays/${id}/`)
    }
    static list() {
        return govHttp.get('/holidays/')
    }
    static create(data: HolidayBuild) {
        return govHttp.post('/holidays/create/', data)
    }
    static update(id: Number, data: Holiday) {
        return govHttp.put(`/holidays/${id}/update/`, data)
    }
    static delete(id: Number) {
        return govHttp.delete(`/holidays/${id}/delete/`)
    }
}

export class TemplateService {
    static get(id: Number) {
        return govHttp.get(`/templates/${id}/`)
    }
    static list() {
        return govHttp.get('/templates/')
    }
    static create(data: Template) {
        return govHttp.post('/templates/create/', data)
    }
    static update(id: Number, data: Template) {
        return govHttp.put(`/templates/${id}/update/`, data)
    }
    static delete(id: Number) {
        return govHttp.delete(`/templates/${id}/delete/`)
    }
}

export class PositionService {
    static get(id: Number) {
        return govHttp.get(`/positions/${id}/`)
    }
    static list() {
        return govHttp.get('/positions/')
    }
    static create(data: PositionBuild) {
        return govHttp.post('/positions/create/', data)
    }
    static update(id: Number, data: Position) {
        return govHttp.put(`/positions/${id}/update/`, data)
    }
    static delete(id: Number) {
        return govHttp.delete(`/positions/${id}/delete/`)
    }
}

export class PointOfContactService {
    static get(id: Number) {
        return govHttp.get(`/pocs/${id}/`)
    }
    static list() {
        return govHttp.get('/pocs/')
    }
    static create(data: PointOfContactBuild) {
        return govHttp.post('/pocs/create/', data)
    }
    static update(id: Number, data: PointOfContact) {
        return govHttp.put(`/pocs/${id}/update/`, data)
    }
    static delete(id: Number) {
        return govHttp.delete(`/pocs/${id}/delete/`)
    }
}

interface UpdateTask extends Omit<Task, 'poc'> {
    poc: Number | null
}

export class TaskService {
    static get(id: Number) {
        return govHttp.get(`/tasks/${id}/`)
    }
    static update(id: Number, data: UpdateTask) {
        return govHttp.put(`/tasks/${id}/`, data)
    }
}

export class ContractService {
    static get(id: Number|String) {
        return govHttp.get(`/contracts/${id}/`)
    }
    static getOverview(id: Number|String) {
        return govHttp.get(`/contracts/${id}/overview/`)
    }
    static list() {
        return govHttp.get('/contracts/')
    }
    static create(data: ContractBuild) {
        return govHttp.post('/contracts/', data)
    }
    static update(id: Number, data: Contract) {
        return govHttp.put(`/contracts/${id}/`, data)
    }
    static delete(id: Number) {
        return govHttp.delete(`/contracts/${id}/`)
    }
}
