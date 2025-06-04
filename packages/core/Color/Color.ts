export class Color {
    public static getRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
}
