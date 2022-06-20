import { govHttp } from './http'
import type { PointOfContact, Position } from '@/types/ContractData.type'

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
