# MEGA RECOVERY - Analizza OGNI commit per recuperare TUTTE le scene
Write-Host "MEGA RECOVERY - Cercando OGNI scena dalla 1 alla 110..." -ForegroundColor Green

# Ottieni TUTTI i commit (non solo 100-200 ma TUTTO)
$allCommitHashes = git log --oneline --all | ForEach-Object { $_.Split(' ')[0] }
Write-Host "Analizzando $($allCommitHashes.Count) commit totali..." -ForegroundColor Yellow

$sceneDatabase = @{}
$processedCommits = 0
$scenesFound = 0

foreach ($commitHash in $allCommitHashes) {
    $processedCommits++
    
    # Progress ogni 50 commit
    if ($processedCommits % 50 -eq 0) {
        Write-Host "Commit $processedCommits/$($allCommitHashes.Count) - Scene trovate: $scenesFound" -ForegroundColor Cyan
    }
    
    try {
        # Prova a estrarre gameData.json da questo commit
        $jsonContent = git show "$commitHash`:backend/data/gameData.json" 2>$null
        
        if ($jsonContent) {
            try {
                $gameData = $jsonContent | ConvertFrom-Json
                
                if ($gameData.scenes -and $gameData.scenes.Count -gt 0) {
                    foreach ($scene in $gameData.scenes) {
                        # Se non abbiamo questa scena, o se questa versione è più recente
                        if (-not $sceneDatabase.ContainsKey($scene.id)) {
                            $sceneDatabase[$scene.id] = $scene
                            $scenesFound++
                            Write-Host "  + Scena $($scene.id): $($scene.title)" -ForegroundColor Green
                        }
                    }
                }
            }
            catch {
                # JSON malformato, ignora
            }
        }
    }
    catch {
        # Commit non ha il file, ignora
    }
}

$finalScenes = $sceneDatabase.Values | Sort-Object id

Write-Host "`nMEGA RECOVERY COMPLETATO!" -ForegroundColor Green
Write-Host "Scene totali recuperate: $($finalScenes.Count)" -ForegroundColor Yellow
if ($finalScenes.Count -gt 0) {
    Write-Host "Range: ID $($finalScenes[0].id) - $($finalScenes[-1].id)" -ForegroundColor Yellow
}

# Controlla continuità completa
$allIds = $finalScenes | ForEach-Object { $_.id }
$missingIds = @()

for ($i = 1; $i -le 110; $i++) {
    if ($allIds -notcontains $i) {
        $missingIds += $i
    }
}

$coverage = [math]::Round((($finalScenes.Count / 110) * 100), 1)
$recovered = 110 - $missingIds.Count
Write-Host "Copertura: $coverage% ($recovered/110 scene)" -ForegroundColor Cyan

if ($missingIds.Count -eq 0) {
    Write-Host "PERFETTO! Tutte le scene 1-110 recuperate!" -ForegroundColor Green
} else {
    Write-Host "Scene mancanti: $($missingIds.Count)" -ForegroundColor Yellow
    if ($missingIds.Count -le 30) {
        Write-Host "ID mancanti: $($missingIds -join ', ')" -ForegroundColor Yellow
    }
}

# Crea il file MEGA completo
$megaGameData = @{
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
        recoveryVersion = "MEGA_RECOVERY"
        commitsAnalyzed = $allCommitHashes.Count
        coverage = $coverage
        missingScenes = $missingIds.Count
    }
}

$jsonOutput = $megaGameData | ConvertTo-Json -Depth 10
$jsonOutput | Out-File -FilePath "MEGA_RECOVERY_gameData.json" -Encoding UTF8

Write-Host "`nFile salvato: MEGA_RECOVERY_gameData.json" -ForegroundColor Green
Write-Host "Pronto per il ripristino totale!" -ForegroundColor Green

# Mostra le prime e ultime scene per verifica
if ($finalScenes.Count -gt 0) {
    Write-Host "`nPrime 5 scene:" -ForegroundColor Cyan
    $finalScenes | Select-Object -First 5 | ForEach-Object { 
        Write-Host "  ID $($_.id): $($_.title)" -ForegroundColor White 
    }

    Write-Host "`nUltime 5 scene:" -ForegroundColor Cyan
    $finalScenes | Select-Object -Last 5 | ForEach-Object { 
        Write-Host "  ID $($_.id): $($_.title)" -ForegroundColor White 
    }
}