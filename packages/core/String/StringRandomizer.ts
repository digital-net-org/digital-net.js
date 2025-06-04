export class StringRandomizer {
    public static GenerateName(): string {
        const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z'];
        const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
        const syllableCount = Math.floor(Math.random() * 3) + 2;

        let name = '';
        for (let i = 0; i < syllableCount; i++) {
            const c = consonants[Math.floor(Math.random() * consonants.length)];
            const v = vowels[Math.floor(Math.random() * vowels.length)];
            name += c + v;
        }

        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    static randomGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
