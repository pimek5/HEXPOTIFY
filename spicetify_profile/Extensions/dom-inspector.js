/* DOM Inspector - Logs NowPlaying structure to file */
(function inspectDOM() {
    const logs = [];
    
    const log = (msg) => {
        console.log(msg);
        logs.push(msg);
    };
    
    // Wait a bit for DOM to load
    setTimeout(() => {
        log("=== DOM INSPECTION START ===");
        log("Timestamp: " + new Date().toISOString());
        
        // Find the right sidebar
        const rightSidebar = document.querySelector('.Root__top-container > div:last-child');
        log("\n1. RIGHT SIDEBAR:");
        log("Found: " + (rightSidebar ? "YES" : "NO"));
        if (rightSidebar) {
            log("Tag: " + rightSidebar.tagName);
            log("Classes: " + rightSidebar.className);
            log("ID: " + rightSidebar.id);
            log("Data attributes: " + Array.from(rightSidebar.attributes)
                .filter(a => a.name.startsWith('data-'))
                .map(a => a.name + "=" + a.value)
                .join(", "));
            log("Computed background: " + window.getComputedStyle(rightSidebar).backgroundColor);
            log("Children count: " + rightSidebar.children.length);
            
            // Inspect direct children
            log("\n2. DIRECT CHILDREN OF RIGHT SIDEBAR:");
            Array.from(rightSidebar.children).forEach((child, i) => {
                log(`\n  Child ${i}:`);
                log(`    Tag: ${child.tagName}`);
                log(`    Classes: ${child.className}`);
                log(`    Background: ${window.getComputedStyle(child).backgroundColor}`);
                log(`    Children: ${child.children.length}`);
                
                // Inspect grandchildren
                Array.from(child.children).slice(0, 5).forEach((grandchild, j) => {
                    log(`\n    Grandchild ${j}:`);
                    log(`      Tag: ${grandchild.tagName}`);
                    log(`      Classes: ${grandchild.className}`);
                    log(`      Background: ${window.getComputedStyle(grandchild).backgroundColor}`);
                });
            });
        }
        
        // Find NowPlaying widget
        log("\n\n3. NOW-PLAYING WIDGET:");
        const nowPlaying = document.querySelector('[data-testid="now-playing-widget"]');
        log("Found: " + (nowPlaying ? "YES" : "NO"));
        if (nowPlaying) {
            log("Tag: " + nowPlaying.tagName);
            log("Classes: " + nowPlaying.className);
            log("Background: " + window.getComputedStyle(nowPlaying).backgroundColor);
            log("Children count: " + nowPlaying.children.length);
            
            Array.from(nowPlaying.children).forEach((child, i) => {
                log(`\n  Child ${i}:`);
                log(`    Tag: ${child.tagName}`);
                log(`    Classes: ${child.className}`);
                log(`    Background: ${window.getComputedStyle(child).backgroundColor}`);
            });
        }
        
        // Find elements with grey backgrounds
        log("\n\n4. ELEMENTS WITH GREY BACKGROUNDS:");
        const allDivs = document.querySelectorAll('div');
        let greyCount = 0;
        allDivs.forEach(div => {
            const bg = window.getComputedStyle(div).backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && !bg.includes('rgb(0, 0, 0)')) {
                // Check if it's in the right sidebar
                if (rightSidebar && rightSidebar.contains(div)) {
                    log(`\nElement ${greyCount}:`);
                    log(`  Classes: ${div.className}`);
                    log(`  Background: ${bg}`);
                    log(`  Path: ${getElementPath(div)}`);
                    greyCount++;
                    if (greyCount >= 5) return;
                }
            }
        });
        
        log("\n\n=== DOM INSPECTION END ===");
        
        // Try to send logs to Spicetify notification
        const logString = logs.join("\n");
        Spicetify.showNotification("DOM inspection complete - check console");
        
    }, 2000);
    
    function getElementPath(el) {
        if (el.id !== '')
            return "#" + el.id;
        if (el === document.body)
            return el.tagName.toLowerCase();
        
        var names = [];
        while (el.parentElement) {
            if (el.id !== '') {
                names.unshift('#' + el.id);
                break;
            } else {
                names.unshift(el.tagName.toLowerCase());
                el = el.parentElement;
            }
        }
        return names.join(" > ");
    }
})();
