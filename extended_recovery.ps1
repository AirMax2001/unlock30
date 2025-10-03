# Recovery esteso - cerca tutte le scene possibili
Write-Host "Recovery esteso di TUTTE le scene..." -ForegroundColor Green

$allCommits = git log --oneline --grep="Aggiornamento automatico" -n 200 | ForEach-Object { $_.Split(' ')[0] }
$sceneDatabase = @{}

Write-Host "Analizzando $($allCommits.Count) commit..." -ForegroundColor Yellow

foreach ($commit in $allCommits) {
    try {
        $jsonContent = git show "$commit`:backend/data/gameData.json" 2>$null
        if ($jsonContent) {
            $gameData = $jsonContent | ConvertFrom-Json
            if ($gameData.scenes) {
                foreach ($scene in $gameData.scenes) {
                    # Conserva solo la versione più recente di ogni scena
                    if (-not $sceneDatabase.ContainsKey($scene.id) -or 
                        $scene.lastModified -gt $sceneDatabase[$scene.id].lastModified) {
                        $sceneDatabase[$scene.id] = $scene
                    }
                }
            }
        }
    } catch {
        # Ignora errori
    }
}

$allScenes = $sceneDatabase.Values | Sort-Object id

Write-Host "`nTOTALE SCENE RECUPERATE: $($allScenes.Count)" -ForegroundColor Green
Write-Host "Range: ID $($allScenes[0].id) - $($allScenes[-1].id)" -ForegroundColor Cyan

# Trova scene mancanti
$allIds = $allScenes | ForEach-Object { $_.id }
$minId = $allIds | Measure-Object -Minimum | Select-Object -ExpandProperty Minimum
$maxId = $allIds | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum

$missingIds = @()
for ($i = $minId; $i -le $maxId; $i++) {
    if ($allIds -notcontains $i) {
        $missingIds += $i
    }
}

if ($missingIds.Count -gt 0) {
    Write-Host "`nScene mancanti: $($missingIds -join ', ')" -ForegroundColor Red
} else {
    Write-Host "`nNessuna scena mancante!" -ForegroundColor Green
}

# Salva tutto
$completeGameData = @{
    scenes = $allScenes
    settings = @{
        gameName = "Il Gioco dei Trenta"
        welcomeMessage = "Benvenuto nel gioco!"
        maxScenes = 999
        theme = "unlock30"
    }
    stats = @{
        totalScenes = $allScenes.Count
        lastModified = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
        recoveredFromCommits = $true
        recoveryVersion = "Extended"
    }
}

$jsonOutput = $completeGameData | ConvertTo-Json -Depth 10
$jsonOutput | Out-File -FilePath "complete_recovery.json" -Encoding UTF8

Write-Host "`nFile salvato: complete_recovery.json" -ForegroundColor Green
Write-Host "Pronto per il ripristino!" -ForegroundColor Cyan