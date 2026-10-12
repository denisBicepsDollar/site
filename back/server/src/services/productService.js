import * as productRepo from '../db/productRepo.js'

export async function list() {
    return productRepo.list();
}