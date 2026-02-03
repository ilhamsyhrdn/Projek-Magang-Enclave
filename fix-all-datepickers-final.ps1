$files = @(
    "magang-enclave\app\admin\arsip\memo\page.tsx",
    "magang-enclave\app\adk\arsip\memo\page.tsx",
    "magang-enclave\app\approver\daftar-surat\surat-keluar\page.tsx",
    "magang-enclave\app\approver\daftar-surat\notulensi\page.tsx",
    "magang-enclave\app\approver\daftar-surat\memo\page.tsx",
    "magang-enclave\app\approver\arsip\memo\page.tsx",
    "magang-enclave\app\adk\daftar-surat\surat-masuk\page.tsx",
    "magang-enclave\app\adk\daftar-surat\notulensi\page.tsx",
    "magang-enclave\app\adk\daftar-surat\surat-keluar\page.tsx",
    "magang-enclave\app\adk\daftar-surat\memo\page.tsx",
    "magang-enclave\app\approver\daftar-surat\surat-masuk\page.tsx"
)

$oldPattern1 = @'
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="font-['Poppins'] text-sm text-gray-700 focus:outline-none w-[90px]"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="font-['Poppins'] text-sm text-gray-700 focus:outline-none w-[90px]"
                />
                <Calendar size={18} className="text-gray-400 cursor-pointer ml-1" />
'@

$newPattern1 = @'
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  pattern="\d{2}/\d{2}/\d{4}"
                  className="font-['Poppins'] text-sm text-gray-700 focus:outline-none w-[90px]"
                />
                <input
                  type="date"
                  ref={startDateRef}
                  onChange={handleStartDateChange}
                  className="hidden"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  pattern="\d{2}/\d{2}/\d{4}"
                  className="font-['Poppins'] text-sm text-gray-700 focus:outline-none w-[90px]"
                />
                <input
                  type="date"
                  ref={endDateRef}
                  onChange={handleEndDateChange}
                  className="hidden"
                />
                <Calendar size={18} className="text-gray-400 cursor-pointer ml-1" onClick={() => startDateRef.current?.showPicker()} />
'@

foreach ($file in $files) {
    $content = Get-Content $file -Raw -Encoding UTF8
    
    if ($content -match [regex]::Escape($oldPattern1)) {
        $content = $content -replace [regex]::Escape($oldPattern1), $newPattern1
        Set-Content $file $content -NoNewline -Encoding UTF8
        Write-Host "✅ $file"
    } else {
        Write-Host "⏭️  $file (already updated or pattern not found)"
    }
}

Write-Host "`n✨ Done!"
