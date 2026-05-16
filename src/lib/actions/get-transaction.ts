"use server"

import { snap } from "../midtrans"

export async function getTransaction(orderId: string) {
    try {
        const transaction = await snap.transaction.status(orderId)
        return transaction
    } catch (error) {
        return null
    }
}
