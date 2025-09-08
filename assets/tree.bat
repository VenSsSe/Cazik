@echo off
CHCP 65001 > nul
cd /d "%~dp0"

echo Создание красивого древа файлов...

powershell -NoProfile -Command "$baseDepth = ($PWD.Path -split '\\').Count; Get-ChildItem -Recurse | ForEach-Object { $itemDepth = ($_.FullName -split '\\').Count; $indentCount = $itemDepth - $baseDepth - 1; $indent = '    ' * $indentCount; if ($_.PSIsContainer) { $prefix = '`-- ' } else { $prefix = '    ' }; $indent + $prefix + $_.Name } | Out-File -FilePath 'tree.txt' -Encoding utf8"

REM -- Более надежная проверка на успех --
set "filesize=0"
for %%A in ("tree.txt") do set filesize=%%~zA
if exist "tree.txt" if %filesize% gtr 0 (
    echo.
    echo [+] Успешно! Файл "tree.txt" создан.
) else (
    echo.
    echo [!] Ошибка! Не удалось создать или заполнить файл.
)

echo.
echo Нажмите любую клавишу для выхода...
pause > nul