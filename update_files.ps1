 = @(
  'C:\xampp\htdocs\smart-complaint-app\src\app\informasi\agenda\page.tsx',
  'C:\xampp\htdocs\smart-complaint-app\src\app\informasi\keamanan\page.tsx',
  'C:\xampp\htdocs\smart-complaint-app\src\app\informasi\struktur\page.tsx'
)

foreach (\ in \) {
    \ = Get-Content \ -Raw -Encoding UTF8
    \ = \ -replace " export const dynamic = force-dynamic \r?\nexport const revalidate = 0\, 'export const revalidate = 60'
 Set-Content \ -Value \ -Encoding UTF8
 Write-Host \Updated: \\
}
