// ==UserScript==
// @name         Commit Graph Colour with theme support
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the color scheme of GitHub's contribution graph
// @author       Mitul Patel
// @match        https://github.com/*
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
            LEVEL0: '#ffd7d7'
        },
        light: {
            LEVEL4: '#db143c',
            LEVEL3: '#e3305f',
            LEVEL2: '#e95782',
            LEVEL1: '#ef7ea5',
            LEVEL0: '#f7bac9'
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
        const elements = document.querySelectorAll('.day');
        elements.forEach(element => {
            const count = parseInt(element.getAttribute('data-count'), 10);
            let fillColor = '';
            if (count >= 18) {
                fillColor = colorLevels.LEVEL4;
            } else if (count >= 11) {
                fillColor = colorLevels.LEVEL3;
            } else if (count >= 5) {
                fillColor = colorLevels.LEVEL2;
            } else if (count >= 1) {
                fillColor = colorLevels.LEVEL1;
            } else {
                fillColor = colorLevels.LEVEL0;
            }
            element.style.fill = fillColor;
        });
    }

    function init() {
        const currentTheme = detectTheme();
        const colorLevels = colorThemes[currentTheme];
        updateLegendColors(colorLevels);
        updateGraphColors(colorLevels);
    }

    init();
})();
