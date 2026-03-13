// Znajdź gdzie Spotify ustawia --background-base w inline style
const originalSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name, value) {
    if (name === 'style' && value.includes('--background-base')) {
        console.trace('--background-base SET HERE:', this, value);
        debugger; // To zatrzyma wykonanie
    }
    return originalSetAttribute.call(this, name, value);
};

// Alternatywnie, znajdź w plikach:
(async () => {
    const files = performance.getEntriesByType('resource')
        .filter(r => r.name.includes('.js') && r.name.includes('xpui'))
        .map(r => r.name);
    
    console.log('Pliki xpui:', files);
    
    for (const file of files) {
        try {
            const response = await fetch(file);
            const text = await response.text();
            if (text.includes('--background-base') || text.includes('background-base')) {
                console.log('ZNALEZIONO W:', file);
            }
        } catch(e) {
            console.log('Błąd przy:', file);
        }
    }
})();
