"use server";

import { snap } from "@/lib/midtrans";
import { auth } from "@/auth";
import { randomUUID } from "crypto";   
import { prisma } from "@/lib/prisma";

export async function createTransaction(videoId: string) {

    if (!videoId) {
        throw new Error("Video ID is required");
    }

    try {
        const session = await auth();
        if (!session || !session.user) {
            throw new Error("User is not authenticated");
        }

        const video = await prisma.video.findUnique({
            where: { id: videoId },
            select: { price: true, discount: true, title: true }
        });

        if (!video || !video.price) {
            throw new Error("Video not found");
        }

        const finalPrice = video.discount ? video.price * (1 - video.discount) : video.price;

        const orderId = randomUUID();

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: Math.round(finalPrice),
            },
            customer_details: {
                first_name: session.user.name || 'Anonymous',
                email: session.user.email || 'noemail@example.com',
            },
            item_details: [{
                id: videoId,
                price: Math.round(finalPrice),
                quantity: 1,
                name: video.title || 'Video Product',
            }],
        };
        
        const transaction = await snap.createTransaction(parameter);

        const order = await prisma.order.create({
            data: {
                id: orderId,
                userId: session.user.id,
                videoId: videoId,
                amount: finalPrice,
                status: 'PENDING'
            }
        });

        return {
            token: transaction.token,
        };

    } catch (error) {
        throw error;
    }
}
