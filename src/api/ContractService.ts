import { govHttp } from './http'
import type { Holiday, PointOfContact, Position, Task, Contract } from '@/types/ContractData.type'

export class HolidayService {
    static get(id: Number) {
        return govHttp.get(`/holidays/${id}/`)
    }
    static list() {
        return govHttp.get('/holidays/')
    }
    static create(data: Holiday) {
        return govHttp.post('/holidays/create/', data)
    }
    static update(id: Number, data: Holiday) {
        return govHttp.put(`/holidays/${id}/update/`, data)
    }
    static delete(id: Number) {
        return govHttp.delete(`/holidays/${id}/delete/`)
    }
}

export class PositionService {
    static get(id: Number) {
        return govHttp.get(`/positions/${id}/`)
    }
    static list() {
        return govHttp.get('/positions/')
    }
    static create(data: Position) {
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
    static create(data: PointOfContact) {
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
    // static list() {
    //     return govHttp.get('/tasks/')
    // }
    // static create(data: PointOfContact) {
    //     return govHttp.post('/tasks/create/', data)
    // }
    static update(id: Number, data: UpdateTask) {
        return govHttp.put(`/tasks/${id}/`, data)
    }
    // static delete(id: Number) {
    //     return govHttp.delete(`/tasks/${id}/delete/`)
    // }
}

export class ContractService {
    static get(id: Number|String) {
        return govHttp.get(`/contracts/${id}/`)
    }
    static getTasks(id: Number|String) {
        return govHttp.get(`/contracts/${id}/tasks/`)
    }
    static list() {
        return govHttp.get('/contracts/')
    }
    static create(data: Contract) {
        return govHttp.post('/contracts/create/', data)
    }
    static update(id: Number, data: Contract) {
        return govHttp.put(`/contracts/${id}/update/`, data)
    }
    static delete(id: Number) {
        return govHttp.delete(`/contracts/${id}/delete/`)
    }
}
