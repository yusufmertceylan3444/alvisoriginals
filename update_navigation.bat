@echo off
echo Updating navigation in all HTML files...

for %%f in (*.html) do (
    if not "%%f"=="index.html" (
        echo Updating %%f...
        powershell -Command "(Get-Content '%%f') -replace '<div class=\"nav-links\">', '<div class=\"nav-links\">' -replace '<div class=\"nav-actions\">', '<div class=\"nav-actions\">' -replace '<div class=\"nav-links nav-links-right\">', '<div class=\"nav-links nav-links-right\">' -replace '<button class=\"panel-close\" data-panel-close aria-label=\"Close Search\">â†—</button>', '<button class=\"panel-close\" data-panel-close aria-label=\"Close Search\">×</button>' -replace '<button class=\"panel-close\" data-panel-close aria-label=\"Close Bag\">â†—</button>', '<button class=\"panel-close\" data-panel-close aria-label=\"Close Bag\">×</button>' | Set-Content '%%f' -Encoding UTF8"
    )
)

echo Navigation update complete!
pause
