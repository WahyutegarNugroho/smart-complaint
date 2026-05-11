'use client'

export default function PrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; margin: 0 !important; padding: 0 !important; }
        .max-w-7xl { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
        .bg-white { box-shadow: none !important; border: 1px solid #e2e8f0 !important; border-radius: 0 !important; }
        table { width: 100% !important; border-collapse: collapse !important; }
        th, td { border: 1px solid #e2e8f0 !important; padding: 12px !important; }
        .rounded-[2.5rem] { border-radius: 0 !important; }
        .shadow-sm { box-shadow: none !important; }
      }
    `}</style>
  )
}
