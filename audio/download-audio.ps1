# Downloads the Salah-step recitation mp3s into this audio/ folder.
# Source: al-hamdoulillah.com (Hisnul Muslim invocations, each sourced to authentic hadith).
# Run from the project root or this folder:
#   powershell -ExecutionPolicy Bypass -File audio\download-audio.ps1
#
# Eight of the eleven steps have a matching source file below.
# takbeer, taawwudh, and tasleem have NO source file here — record those
# three yourself and save them as takbeer.mp3, taawwudh.mp3, tasleem.mp3.

$ErrorActionPreference = 'Stop'
$base = 'https://www.al-hamdoulillah.com/invocations/mp3'
$dir  = $PSScriptRoot

# step filename  ->  source dua number
$map = [ordered]@{
  'thana.mp3'            = 28   # Subhanaka-llahumma wa bihamdika...
  'ruku.mp3'            = 33   # Subhana rabbiya-l-azim (x3)
  'itidal.mp3'         = 39   # Rabbana wa laka-l-hamd...
  'sujood.mp3'         = 41   # Subhana rabbiya-l-a'la (x3)
  'jalsa.mp3'          = 48   # Rabbi-ghfir li, Rabbi-ghfir li
  'tashahhud.mp3'      = 52   # At-tahiyyatu lillahi...
  'durood.mp3'         = 53   # Allahumma salli 'ala Muhammad...
  'dua-before-salam.mp3' = 57 # Allahumma inni zalamtu nafsi...
}

foreach ($name in $map.Keys) {
  $url = "$base/$($map[$name]).mp3"
  $out = Join-Path $dir $name
  Write-Host "Downloading $name  <-  $url"
  Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
}

Write-Host ""
Write-Host "Done. Downloaded $($map.Count) files into $dir"
Write-Host "Still needed (no source - record yourself): takbeer.mp3, taawwudh.mp3, tasleem.mp3"
