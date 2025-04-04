import { PremiumLoader } from '@/components/ui/premium-loader'

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <PremiumLoader message="Loading your content..." />
    </div>
  )
}
