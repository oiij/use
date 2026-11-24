import { chatApp } from '../app'

export default (request: Request) => chatApp.fetch(request)
