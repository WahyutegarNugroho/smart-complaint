'use client'

interface PageSizeSelectorProps {
  currentStatus?: string
  searchQuery?: string
  categoryFilter?: string
  fromDate?: string
  toDate?: string
  rt?: string
  rw?: string
  pageSize: number
}

export default function PageSizeSelector(props: PageSizeSelectorProps) {
  const { currentStatus, searchQuery, categoryFilter, fromDate, toDate, rt, rw, pageSize } = props

  return (
    <form action="/dashboard" method="GET" className="inline-flex">
      {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
      {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
      {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
      {fromDate && <input type="hidden" name="fromDate" value={fromDate} />}
      {toDate && <input type="hidden" name="toDate" value={toDate} />}
      {rt && <input type="hidden" name="rt" value={rt} />}
      {rw && <input type="hidden" name="rw" value={rw} />}
      <select
        name="pageSize"
        defaultValue={pageSize}
        onChange={(e) => e.target.form?.requestSubmit()}
        className="bg-brand-canvas border border-brand-hairline rounded-xl px-3 py-2 text-xs font-bold text-brand-ink outline-none cursor-pointer"
      >
        <option value="12">12</option>
        <option value="24">24</option>
        <option value="48">48</option>
      </select>
    </form>
  )
}
