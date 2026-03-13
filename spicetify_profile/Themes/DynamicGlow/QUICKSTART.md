# DynamicGlow - Szybki Start 🚀

## Instalacja w 3 krokach:

### Krok 1: Uruchom instalator
```powershell
cd C:\Users\48796\DynamicGlow
.\install.ps1
```

### Krok 2: Poczekaj na zakończenie
Skrypt automatycznie:
- Skopiuje pliki motywu
- Skonfiguruje Spicetify
- Zastosuje motyw

### Krok 3: Gotowe!
Spotify zostanie uruchomione z nowym motywem DynamicGlow.

---

## Funkcje klawiszowe:

- 🌓 **Przycisk Light/Dark** - w prawym górnym rogu
- 🎨 **Automatyczne kolory** - dopasowują się do okładki
- 💫 **Efekty glow** - świetlne efekty wokół elementów

---

## Schematy kolorów:

Zmień schemat używając:
```powershell
spicetify config color_scheme <nazwa>
spicetify apply
```

Dostępne schematy:
- `Dark-Base` - ciemny (domyślny)
- `Light-Base` - jasny
- `Dark-Animated` - ciemny z animacją
- `Light-Animated` - jasny z animacją

---

## Problemy?

### Motyw się nie stosuje:
```powershell
spicetify restore
spicetify backup apply
```

### Spotify crashuje:
```powershell
spicetify restore
# Zaktualizuj Spotify
spicetify backup apply
```

### Kolory nie działają:
Sprawdź czy rozszerzenia są załadowane:
```powershell
spicetify config
```

Powinno pokazywać:
```
extensions = dynamic-glow.js|Vibrant.min.js
```

---

## Odinstalowanie:

```powershell
spicetify config current_theme " "
spicetify config extensions dynamic-glow.js-
spicetify config extensions Vibrant.min.js-
spicetify apply
```

---

## Dokumentacja:

Pełna dokumentacja w pliku `README.md`

**Enjoy! 🎵✨**
