import { http } from './http'

class UserService {
    getAll() {
        return http.get('/user/')
    }
    get(id: string) {
        return http.get(`/user/${id}/`)
    }
    create(data: any) {
        return http.post('/user/create/', data)
    }
    update(id: string, data: any) {
        return http.put(`/user/update/${id}/`, data)
    }
    delete(id: string) {
        return http.delete(`/user/delete/${id}/`)
    }
    // deleteAll() {
    //   return http.delete(`/user`)
    // }
    // findByName(name: string) {
    //   return http.get(`/user?name=${name}`)
    // }
}

export default new UserService()
