# BobsMap을 BobsMaps_final로 복사하는 스크립트

Write-Host "BobsMap을 BobsMaps_final로 복사 중..." -ForegroundColor Green

$source = "C:\Users\mchon\PycharmProjects\BobsMap"
$destination = "C:\Users\mchon\PycharmProjects\BobsMaps_final"

# 대상 폴더가 없으면 생성
if (!(Test-Path $destination)) {
    New-Item -ItemType Directory -Path $destination | Out-Null
}

# 제외할 항목들
$exclude = @("node_modules", ".git", "BobMapNative", "*.log", ".env.local")

# 파일 및 폴더 복사
Write-Host "파일 복사 중..."

# 모든 파일과 폴더를 복사 (제외 항목 제외)
Get-ChildItem $source -Recurse -Exclude $exclude | 
    Where-Object { 
        $_.FullName -notmatch "\\node_modules\\" -and 
        $_.FullName -notmatch "\\.git\\" -and
        $_.FullName -notmatch "\\BobMapNative\\"
    } |
    ForEach-Object {
        $targetPath = $_.FullName.Replace($source, $destination)
        $targetDir = Split-Path $targetPath -Parent
        
        if (!(Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        if (!$_.PSIsContainer) {
            Copy-Item $_.FullName -Destination $targetPath -Force
            Write-Host "." -NoNewline
        }
    }

Write-Host ""
Write-Host "복사 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. cd C:\Users\mchon\PycharmProjects\BobsMaps_final"
Write-Host "2. npm install"
Write-Host "3. cd client && npm install && cd .."
Write-Host "4. npm run server (첫 번째 터미널)"
Write-Host "5. cd client && npm start (두 번째 터미널)"