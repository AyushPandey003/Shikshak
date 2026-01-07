# Mermaid Architecture Diagram PNG Generator
# 
# This script extracts all Mermaid diagrams from architecture.md
# and generates high-quality PNG images for each one.
#
# Usage: .\scripts\generate-architecture-pngs.ps1

$ErrorActionPreference = "Continue"

# Configuration
$RootDir = Split-Path -Parent $PSScriptRoot
$InputFile = Join-Path $RootDir "architecture.md"
$OutputDir = Join-Path $RootDir "architecture-diagrams"

# Diagram names mapping
$DiagramNames = @(
    "01-system-overview",
    "02-service-communication",
    "03-kafka-architecture",
    "04-rag-pipeline",
    "05-auth-flow",
    "06-payment-flow",
    "07-material-ingestion",
    "08-rag-query-flow",
    "09-data-models",
    "10-security-architecture",
    "11-deployment-architecture"
)

Write-Host ""
Write-Host "Mermaid Architecture Diagram PNG Generator" -ForegroundColor Cyan
Write-Host "=================================================="
Write-Host ""

# Check if architecture.md exists
if (-not (Test-Path $InputFile)) {
    Write-Host "ERROR: File not found: $InputFile" -ForegroundColor Red
    exit 1
}

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}
Write-Host "Output: $OutputDir"
Write-Host ""

# Read content
$content = Get-Content $InputFile -Raw

# Extract mermaid diagrams using regex
$regexPattern = "``````mermaid`r?`n([\s\S]*?)``````"
$allMatches = [regex]::Matches($content, $regexPattern)

Write-Host "Found $($allMatches.Count) Mermaid diagrams" -ForegroundColor Yellow
Write-Host ""

$successCount = 0

for ($i = 0; $i -lt $allMatches.Count; $i++) {
    $diagramCode = $allMatches[$i].Groups[1].Value.Trim()
    
    if ($i -lt $DiagramNames.Count) {
        $name = $DiagramNames[$i]
    } else {
        $name = "{0:D2}-diagram" -f ($i + 1)
    }
    
    $mmdPath = Join-Path $OutputDir "$name.mmd"
    $pngPath = Join-Path $OutputDir "$name.png"
    
    Write-Host "[$($i + 1)/$($allMatches.Count)] $name" -ForegroundColor White
    
    try {
        # Write mermaid code to temp file
        [System.IO.File]::WriteAllText($mmdPath, $diagramCode, [System.Text.UTF8Encoding]::new($false))
        
        # Generate PNG using mmdc
        $process = Start-Process -FilePath "npx" -ArgumentList "mmdc -i `"$mmdPath`" -o `"$pngPath`" -w 1920 -s 2 -b transparent" -Wait -PassThru -NoNewWindow
        
        if (Test-Path $pngPath) {
            $fileSize = (Get-Item $pngPath).Length / 1KB
            Write-Host "  OK: $name.png ($([math]::Round($fileSize, 1)) KB)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  FAILED to generate PNG" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    finally {
        # Cleanup temp mmd file
        if (Test-Path $mmdPath) {
            Remove-Item $mmdPath -Force
        }
    }
}

Write-Host ""
Write-Host "=================================================="
Write-Host "Generated $successCount/$($allMatches.Count) PNG files" -ForegroundColor Cyan
Write-Host "Location: $OutputDir"
Write-Host ""

# List generated files
$pngFiles = Get-ChildItem -Path $OutputDir -Filter "*.png" | Sort-Object Name
if ($pngFiles.Count -gt 0) {
    Write-Host "Generated files:" -ForegroundColor Yellow
    foreach ($file in $pngFiles) {
        $size = [math]::Round($file.Length / 1KB, 1)
        Write-Host "   - $($file.Name) ($size KB)"
    }
}
