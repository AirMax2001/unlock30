# Recupero manuale delle scene
Write-Host "Recupero scene dal Git..." -ForegroundColor Green

# Definisco i commit chiave che avevano scene diverse
$commits = @(
    @{ hash = "934ddf59"; note = "Scene 1-2" },
    @{ hash = "44a25532"; note = "Scene 3-7" },
    @{ hash = "62e767f5"; note = "Scene 8-9" },
    @{ hash = "dbcd6b52"; note = "Scene 88-110" }
)

$allScenes = @()

foreach ($commit in $commits) {
    Write-Host "Recuperando dal commit $($commit.hash) ($($commit.note))..." -ForegroundColor Yellow
    
    try {
        $jsonContent = git show "$($commit.hash):backend/data/gameData.json"
        if ($jsonContent) {
            $gameData = $jsonContent | ConvertFrom-Json
            if ($gameData.scenes) {
                foreach ($scene in $gameData.scenes) {
                    $allScenes += $scene
                    Write-Host "  + Scena $($scene.id): $($scene.title)" -ForegroundColor White
                }
            }
        }
    }
    catch {
        Write-Host "  Errore: $_" -ForegroundColor Red
    }
}

# Ordina le scene per ID e rimuovi duplicati
$uniqueScenes = $allScenes | Sort-Object id | Group-Object id | ForEach-Object { $_.Group[0] }

Write-Host "`nTotale scene recuperate: $($uniqueScenes.Count)" -ForegroundColor Green

# Crea il nuovo file JSON
$newGameData = @{
    scenes = $uniqueScenes
    settings = @{
        gameName = "Il Gioco dei Trenta"
        welcomeMessage = "Benvenuto nel gioco!"
        maxScenes = 999
        theme = "unlock30"
    }
    stats = @{
        totalScenes = $uniqueScenes.Count
        lastModified = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
        recoveredFromCommits = $true
    }
}

$jsonOutput = $newGameData | ConvertTo-Json -Depth 10
$jsonOutput | Out-File -FilePath "recovered_scenes.json" -Encoding UTF8

Write-Host "`nFile salvato: recovered_scenes.json" -ForegroundColor Green
Write-Host "Scene recuperate:" -ForegroundColor Cyan
$uniqueScenes | ForEach-Object { Write-Host "  $($_.id): $($_.title)" -ForegroundColor White }