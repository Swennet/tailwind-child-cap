const plugin = require('tailwindcss/plugin')

const childCapPlugin = plugin.withOptions(
    (options = {}) =>
        ({ addUtilities }) => {
            const maxRange = options.maxRange || 24
            const utilities = {}

            // Base utilities
            for (let i = 1; i <= maxRange; i++) {
                utilities[`.child-cap-${i}`] = {
                    '& > *': {
                        display: 'none',
                        [`&:nth-child(-n+${i})`]: {
                            display: 'block'
                        }
                    }
                }
            }

            // No-cap utility
            utilities[`.child-cap-none`] = {
                '& > *': {
                    display: 'block'
                }
            }

            addUtilities(utilities, {
                respectPrefix: false,
                respectImportant: false,
                variants: ['responsive']
            })
        }
)

module.exports = childCapPlugin
