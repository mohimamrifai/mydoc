import TransactionPageComponent, { Transaction } from "@/components/shared/transaction-page-component";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function TransactionPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Get all transactions for the user
  const transactions = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      video: {
        select: {
          title: true,
          price: true
        }
      }
    }
  });

  // Format data according to Transaction interface
  const formattedData: Transaction[] = transactions.map(transaction => ({
    id: transaction.id,
    amount: transaction.amount,
    status: transaction.status,
    createdAt: transaction.createdAt.toISOString(),
    video: {
      title: transaction.video.title,
      price: transaction.video.price ?? 0
    }
  }));

  return (
    <TransactionPageComponent transactions={formattedData} />
  );
}
