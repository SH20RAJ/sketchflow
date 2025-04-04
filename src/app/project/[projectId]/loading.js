import { PremiumLoader } from '@/components/ui/premium-loader'

export default function ProjectLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <PremiumLoader message="Loading your project..." />
    </div>
  )
}
