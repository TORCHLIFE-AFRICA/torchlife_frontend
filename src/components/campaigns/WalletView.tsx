'use client'

import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, CheckCircle, Wallet as WalletIcon } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { type Wallet, type Transaction } from '@/src/types/donation'

interface WalletViewProps {
  wallet: Wallet
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: transaction.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getAmountDisplay = () => {
    const prefix = transaction.type === 'deposit' ? '+' : '-'
    return `${prefix}${formatCurrency(transaction.amount)}`
  }

  const getAmountColor = () => {
    return transaction.type === 'deposit' ? 'text-primary' : 'text-foreground'
  }

  return (
    <div className="flex items-start justify-between py-4 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
          <CheckCircle className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-muted-foreground">
            Est: {format(transaction.createdAt, "do, h:mm a")}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${getAmountColor()}`}>{getAmountDisplay()}</p>
        <p className="text-sm text-muted-foreground capitalize">{transaction.status}</p>
      </div>
    </div>
  )
}

export function WalletView({ wallet }: WalletViewProps) {
  const router = useRouter()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: wallet.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Balance Card */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <WalletIcon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-muted-foreground">Your Wallet Balance</span>
        </div>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-3xl font-bold">{formatCurrency(wallet.balance)}</span>
          <span className="text-muted-foreground">{wallet.currency}</span>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1">
            Withdraw
          </Button>
          <Button className="flex-1">
            Add Funds
          </Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Transaction History</h2>

        {wallet.transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No transactions yet.
          </p>
        ) : (
          <div>
            {wallet.transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
