import SectionSkeleton from '@/components/dashboard/sections/SectionSkeleton'

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10">
      <SectionSkeleton type="export" />
    </div>
  )
}
