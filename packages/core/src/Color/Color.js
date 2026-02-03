/**
 * Utility class for colors handling
 */
export class Color {
    /**
     * Returns a string containing a random color with the provided format.
     * @param {'RGB' | 'Hex'} [format]
     * @returns {string}
     */
    static getRandomColor(format = 'Hex') {
        if (format === 'Hex') {
            return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        }
        if (format === 'RGB') {
            const rgb = [];
            for (let i = 0; i < 2; i++) {
                rgb[i] = Math.floor(Math.random() * 255);
            }

            return `rgb(${rgb.join(', ')})`;
        }
        throw new Error(`Color.getRandomColor(${format}): Invalid format for the color`);
    }
}
