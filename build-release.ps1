param(
    [string]$SourceFile = "index.html",
    [string]$OutputDir = "release"
)

$content = Get-Content $SourceFile -Raw -Encoding UTF8
$originalLength = $content.Length

# 1) Strip DEV PANEL CSS (from marker to </style>)
$content = $content -replace '(?s)/\* ===== DEV PANEL ===== \*/.*?(?=\n</style>)', ''

# 2) Strip DEV PANEL HTML (from comment marker to just before <script>)
$content = $content -replace '(?s)<!-- ===== DEV PANEL \(bottom bar\) ===== -->.*?(?=\n<script>)', ''

# 3) Strip DEV PANEL JS section (from // DEV PANEL to just before // INIT)
$content = $content -replace '(?s)// DEV PANEL.*?(?=\n// =+\n// INIT)', ''

# 4) Strip updateDevBadge() call from INIT
$content = $content -replace '; updateDevBadge\(\);', ';'

$strippedLength = $content.Length

# Write output
$outputPath = Join-Path $OutputDir $SourceFile
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
Set-Content -Path $outputPath -Value $content -NoNewline -Encoding UTF8

Write-Host "✅ Release built: $outputPath"
Write-Host "   $originalLength bytes → $strippedLength bytes (removed $($originalLength - $strippedLength) bytes)"
Write-Host ""
Write-Host "Dev code removed: DEV PANEL CSS + HTML + JS + badge references"
