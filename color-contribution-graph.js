// ==UserScript==
// @name         Commit Graph Colour with theme support
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the color scheme of GitHub's contribution graph
// @author       Mitul Patel
// @match        https://github.com/bittricky
// @grant        none
// ==/UserScript==

(function() {                                                                                                                                                                                                                                                                                                               
    'use strict';

    const colorThemes = {
        dark: {
            LEVEL4: '#ff5555',
            LEVEL3: '#ff6e6e',
            LEVEL2: '#ff8787',
            LEVEL1: '#ffafaf',
            LEVEL0: '#161b22'
        },
        light: {
            LEVEL4: '#db143c',
            LEVEL3: '#e3305f',
            LEVEL2: '#e95782',
            LEVEL1: '#ef7ea5',
            LEVEL0: '#ebedf0'
        }
    };

    function detectTheme() {
        const themeMeta = document.querySelector('meta[name="color-scheme"]');
        return themeMeta && themeMeta.content.includes('dark') ? 'dark' : 'light';
    }

    function updateLegendColors(colorLevels) {
        const legend = document.querySelector('.legend');
        if (legend) {
            const legendItems = legend.querySelectorAll('li');
            legendItems.forEach((item, index) => {
                const levelKey = `LEVEL${4 - index}`;
                item.style.background = colorLevels[levelKey];
            });
        }
    }

    function updateGraphColors(colorLevels) {
        const elements = document.querySelectorAll('.ContributionCalendar-day');
        if (elements.length > 0) {
            elements.forEach(element => {
                const count = parseInt(element.getAttribute('data-level'), 10);

                const thresholds = [
                    { limit: 18, color: colorLevels.LEVEL4 },
                    { limit: 11, color: colorLevels.LEVEL3 },
                    { limit: 5, color: colorLevels.LEVEL2 },
                    { limit: 1, color: colorLevels.LEVEL1 },
                    { limit: 0, color: colorLevels.LEVEL0 }
                ];
                
                const fillColor = thresholds.find(threshold => count >= threshold.limit).color;
                element.style.fill = fillColor;
                element.style['background-color'] = fillColor;
            });
        } else {
            //Observe changes to the DOM nodes
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        updateGraphColors(colorLevels);
                        observer.disconnect();
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function init() {
        const currentTheme = detectTheme();
        const colorLevels = colorThemes[currentTheme];
        updateLegendColors(colorLevels);
        updateGraphColors(colorLevels);
    }

    init();
})();
