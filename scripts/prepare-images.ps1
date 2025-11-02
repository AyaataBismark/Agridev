<#
prepare-images.ps1

Small helper for preparing real photographic images for Agridev.

Usage:
1. Put your photos in a folder (e.g. C:\Users\You\Downloads\photos).
2. Run: .\prepare-images.ps1 -Source "C:\Users\You\Downloads\photos"
3. The script will copy files named mango.*, carrot.*, maize.*, tomato.* into `assets/photos/`.

Optional: If ImageMagick (`magick`) is installed the script can also create WebP versions for smaller payloads.
#>
param(
  [Parameter(Mandatory=$true)]
  [string]$Source,
  [switch]$CreateWebP
)

$expected = @('mango','carrot','maize','tomato')
$dest = Join-Path -Path $PSScriptRoot -ChildPath "..\assets\photos" | Resolve-Path -Relative
if(-not (Test-Path $dest)){
  New-Item -ItemType Directory -Path $dest | Out-Null
}

foreach($name in $expected){
  $pattern = Join-Path $Source "$name.*"
  $files = Get-ChildItem -Path $pattern -File -ErrorAction SilentlyContinue
  if($files -and $files.Length -gt 0){
    $src = $files[0].FullName
    $ext = $files[0].Extension
    $dst = Join-Path $dest "$name$ext"
    Copy-Item -Path $src -Destination $dst -Force
    Write-Host "Copied $src -> $dst"
    if($CreateWebP){
      if(Get-Command magick -ErrorAction SilentlyContinue){
        $webp = Join-Path $dest "$name.webp"
        & magick convert $dst -quality 75 $webp
        Write-Host "Created WebP $webp"
      } else {
        Write-Host "ImageMagick not found; skipping WebP conversion. Install ImageMagick to enable this feature."
      }
    }
  } else {
    Write-Host "No file found for pattern: $pattern"
  }
}

Write-Host "Done. Place additional images in assets/photos/ named <slug>.(jpg|png|webp) to be picked up by the site."}```