# 🎨 DynamicGlow - Twój Spicetify Theme

**DynamicGlow** to połączenie dwóch popularnych motywów Spicetify:
- **DefaultDynamic** - dynamiczne kolory dostosowane do okładki albumu
- **Glowify** - efekty świetlne i nowoczesne animacje

## ✨ Funkcje

- 🎨 **Dynamiczne kolory** - automatyczne dopasowanie kolorów motywu do aktualnie odtwarzanej okładki
- 💫 **Efekty glow** - eleganckie efekty świetlne wokół elementów interfejsu
- 🌓 **Tryb jasny/ciemny** - przełączanie między trybem jasnym i ciemnym jednym kliknięciem
- 🖼️ **Animowane tło** - płynnie animowane tło z okładką albumu
- 🎵 **Skupione teksty** - dynamiczne wyróżnienie aktywnego tekstu piosenki
- ⚡ **Płynne przejścia** - wszystkie zmiany kolorów są animowane

## 📋 Wymagania

- **Spicetify CLI** - najnowsza wersja ([Pobierz tutaj](https://spicetify.app/docs/advanced-usage/installation))
- **Spotify** - najnowsza wersja ([Pobierz tutaj](https://www.spotify.com/download))

## 🚀 Instalacja

### Windows (PowerShell)

1. **Skopiuj pliki motywu:**
   ```powershell
   # Przejdź do folderu Spicetify
   cd "$(spicetify -c | Split-Path)\Themes"
   
   # Skopiuj folder DynamicGlow
   Copy-Item "C:\Users\48796\DynamicGlow" -Destination "DynamicGlow" -Recurse
   ```

2. **Skopiuj rozszerzenia:**
   ```powershell
   # Skopiuj pliki JavaScript do folderu Extensions
   Copy-Item "C:\Users\48796\DynamicGlow\Extensions\*.js" -Destination "$(spicetify -c | Split-Path)\Extensions"
   ```

3. **Skonfiguruj Spicetify:**
   ```powershell
   spicetify config current_theme DynamicGlow
   spicetify config color_scheme Dark-Base
   spicetify config extensions dynamic-glow.js
   spicetify config extensions Vibrant.min.js
   spicetify config inject_css 1 replace_colors 1
   ```

4. **Zastosuj motyw:**
   ```powershell
   spicetify apply
   ```

### Linux/MacOS (Bash)

1. **Skopiuj pliki motywu:**
   ```bash
   # Przejdź do folderu Spicetify
   cd "$(dirname "$(spicetify -c)")/Themes"
   
   # Skopiuj folder DynamicGlow
   cp -r ~/DynamicGlow ./DynamicGlow
   ```

2. **Skopiuj rozszerzenia:**
   ```bash
   # Skopiuj pliki JavaScript
   cp ~/DynamicGlow/Extensions/*.js "$(dirname "$(spicetify -c)")/Extensions/"
   ```

3. **Skonfiguruj Spicetify:**
   ```bash
   spicetify config current_theme DynamicGlow
   spicetify config color_scheme Dark-Base
   spicetify config extensions dynamic-glow.js
   spicetify config extensions Vibrant.min.js
   spicetify config inject_css 1 replace_colors 1
   ```

4. **Zastosuj motyw:**
   ```bash
   spicetify apply
   ```

## ⚙️ Ustawienia

### Schematy kolorów

Motyw posiada kilka schematów kolorów:
- `Dark-Base` - ciemny motyw (domyślny)
- `Light-Base` - jasny motyw
- `Dark-Animated` - ciemny motyw z animowanym tłem
- `Light-Animated` - jasny motyw z animowanym tłem

Aby zmienić schemat:
```powershell
spicetify config color_scheme <nazwa-schematu>
spicetify apply
```

### Przełącznik Light/Dark

W prawym górnym rogu znajduje się przycisk z ikoną księżyca/słońca, który pozwala szybko przełączać się między trybem jasnym i ciemnym.

## 🎨 Dostosowywanie

### Zmiana intensywności efektu glow

Możesz dostosować intensywność efektu glow edytując zmienną CSS w `user.css`:
```css
:root {
    --glowify-glow-accent: var(--accent-color);
}
```

### Zmiana rozmycia tła

Aby zmienić rozmycie tła, zmodyfikuj tę linię w `user.css`:
```css
filter: blur(var(--glowify-bg-blur, 7px)) brightness(80%);
```

Zmień `7px` na dowolną wartość (np. `10px` dla większego rozmycia).

## 🔧 Rozwiązywanie problemów

### Motyw się nie stosuje
```powershell
spicetify restore
spicetify backup apply
```

### Kolory nie zmieniają się
Upewnij się, że oba rozszerzenia są załadowane:
```powershell
spicetify config extensions dynamic-glow.js
spicetify config extensions Vibrant.min.js
spicetify apply
```

### Spotify się crashuje
```powershell
spicetify restore
# Zaktualizuj Spotify i Spicetify do najnowszych wersji
spicetify upgrade
spicetify backup apply
```

## 🗑️ Odinstalowanie

### Windows (PowerShell)
```powershell
spicetify config current_theme " "
spicetify config extensions dynamic-glow.js-
spicetify config extensions Vibrant.min.js-
spicetify apply
```

### Linux/MacOS (Bash)
```bash
spicetify config current_theme " "
spicetify config extensions dynamic-glow.js-
spicetify config extensions Vibrant.min.js-
spicetify apply
```

## 📝 Licencja

Ten motyw łączy kod z dwóch projektów:
- **DefaultDynamic** - MIT License (Copyright © 2021 Julien Maille)
- **Glowify** - Licencja oryginalna projektu

Ten projekt jest rozpowszechniany jako kombinacja obu motywów dla celów osobistego użytku.

## 🙏 Podziękowania

- [JulienMaille](https://github.com/JulienMaille/spicetify-dynamic-theme) za DefaultDynamic
- [NMWplays](https://github.com/NMWplays/Glowify) za Glowify
- Społeczność [Spicetify](https://github.com/spicetify) za niesamowite narzędzie

## 📸 Screenshoty

[Dodaj tutaj zrzuty ekranu swojego motywu po instalacji]

## 🤝 Wsparcie

Jeśli masz problemy z instalacją lub chcesz zgłosić błąd, odwiedź:
- [Spicetify Discord](https://discord.gg/VnevqPp2Rr)
- [Dokumentacja Spicetify](https://spicetify.app/docs)

---

**Enjoy your custom Spotify theme! 🎵✨**
