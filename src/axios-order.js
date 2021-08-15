import axios from 'axios'

export const instance = axios.create({
    baseURL: 'https://react-my-burger-6e238-default-rtdb.asia-southeast1.firebasedatabase.app/',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
})