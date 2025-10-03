# SUPER RECOVERY - Tutte le scene da ogni singolo commit
Write-Host "SUPER RECOVERY - Recupero TUTTE le scene possibili!" -ForegroundColor Green

# Include sia commit nuovi che vecchi
$newCommits = git log --oneline --grep="Aggiornamento automatico" -n 100 | ForEach-Object { $_.Split(' ')[0] }
$oldCommits = git log --oneline | Select-Object -Last 100 | ForEach-Object { $_.Split(' ')[0] }

$allCommits = ($newCommits + $oldCommits) | Get-Unique

$sceneDatabase = @{}
$totalProcessed = 0

Write-Host "Analizzando $($allCommits.Count) commit totali..." -ForegroundColor Yellow

foreach ($commit in $allCommits) {
    $totalProcessed++
    if ($totalProcessed % 20 -eq 0) {
        Write-Progress -Activity "Recovery" -Status "Commit $totalProcessed/$($allCommits.Count)" -PercentComplete (($totalProcessed / $allCommits.Count) * 100)
    }
    
    try {
        $jsonContent = git show "$commit`:backend/data/gameData.json" 2>$null
        if ($jsonContent) {
            $gameData = $jsonContent | ConvertFrom-Json
            if ($gameData.scenes) {
                foreach ($scene in $gameData.scenes) {
                    # Conserva sempre la versione più recente
                    if (-not $sceneDatabase.ContainsKey($scene.id)) {
                        $sceneDatabase[$scene.id] = $scene
                        Write-Host "  + Nuova scena $($scene.id): $($scene.title)" -ForegroundColor Green
                    }
                }
            }
        }
    } catch {
        # Ignora errori di parsing
    }
}

Write-Progress -Completed -Activity "Recovery"

$finalScenes = $sceneDatabase.Values | Sort-Object id

Write-Host "`nRECOVERY COMPLETATO!" -ForegroundColor Green
Write-Host "Scene totali recuperate: $($finalScenes.Count)" -ForegroundColor Cyan
Write-Host "Range: ID $($finalScenes[0].id) - $($finalScenes[-1].id)" -ForegroundColor Cyan

# Controlla continuità
$allIds = $finalScenes | ForEach-Object { $_.id }
$minId = $allIds | Measure-Object -Minimum | Select-Object -ExpandProperty Minimum
$maxId = $allIds | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum

$missingIds = @()
for ($i = $minId; $i -le $maxId; $i++) {
    if ($allIds -notcontains $i) {
        $missingIds += $i
    }
}

Write-Host "`nScene mancanti nell'intervallo $minId-$maxId`: $($missingIds.Count)" -ForegroundColor $(if($missingIds.Count -eq 0) {"Green"} else {"Yellow"})
if ($missingIds.Count -gt 0 -and $missingIds.Count -le 20) {
    Write-Host "ID mancanti: $($missingIds -join ', ')" -ForegroundColor Yellow
}

# Crea il file finale super-completo
$superGameData = @{
    scenes = $finalScenes
    settings = @{
        gameName = "Il Gioco dei Trenta"
        welcomeMessage = "Benvenuto nel gioco!"
        maxScenes = 999
        theme = "unlock30"
    }
    stats = @{
        totalScenes = $finalScenes.Count
        lastModified = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
        recoveredFromCommits = $true
        recoveryVersion = "SUPER_RECOVERY"
        commitsAnalyzed = $allCommits.Count
        missingScenes = $missingIds.Count
    }
}

$jsonOutput = $superGameData | ConvertTo-Json -Depth 10
$jsonOutput | Out-File -FilePath "SUPER_RECOVERY_gameData.json" -Encoding UTF8

Write-Host "`nFile salvato: SUPER_RECOVERY_gameData.json" -ForegroundColor Green
Write-Host "Pronto per il ripristino finale!" -ForegroundColor Green