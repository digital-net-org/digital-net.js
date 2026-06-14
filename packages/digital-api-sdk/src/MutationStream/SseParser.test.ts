import { describe, expect, it } from 'vitest';
import { SseParser } from './SseParser';

describe('SseParser', () => {
    it('parses a complete event with id, event and data', () => {
        const parser = new SseParser();
        const events = parser.push('id: 42:abc\nevent: mutation\ndata: {"entity":"Page"}\n\n');

        expect(events).toHaveLength(1);
        expect(events[0]).toEqual({ id: '42:abc', event: 'mutation', data: '{"entity":"Page"}' });
    });

    it('buffers events fragmented across arbitrary chunks', () => {
        const parser = new SseParser();

        expect(parser.push('id: 1\neve')).toHaveLength(0);
        expect(parser.push('nt: mutation\ndata: {"a"')).toHaveLength(0);
        const events = parser.push(':1}\n\n');

        expect(events).toHaveLength(1);
        expect(events[0]).toEqual({ id: '1', event: 'mutation', data: '{"a":1}' });
    });

    it('parses multiple events from a single chunk', () => {
        const parser = new SseParser();
        const events = parser.push('event: mutation\ndata: one\n\nevent: mutation\ndata: two\n\n');

        expect(events).toHaveLength(2);
        expect(events[0].data).toBe('one');
        expect(events[1].data).toBe('two');
    });

    it('ignores comment frames such as the keep-alive', () => {
        const parser = new SseParser();
        const events = parser.push(': connected\n\nevent: mutation\ndata: x\n\n');

        expect(events).toHaveLength(1);
        expect(events[0].data).toBe('x');
    });

    it('joins multi-line data fields', () => {
        const parser = new SseParser();
        const events = parser.push('data: first\ndata: second\n\n');

        expect(events).toHaveLength(1);
        expect(events[0].data).toBe('first\nsecond');
    });

    it('normalizes CRLF line endings', () => {
        const parser = new SseParser();
        const events = parser.push('event: mutation\r\ndata: x\r\n\r\n');

        expect(events).toHaveLength(1);
        expect(events[0]).toEqual({ event: 'mutation', data: 'x' });
    });

    it('normalizes a CRLF split across two chunks (no residual \\r in the value)', () => {
        const parser = new SseParser();
        // The "\r\n" after the data value is split: "\r" ends chunk 1, "\n" starts chunk 2.
        expect(parser.push('event: mutation\r\ndata: x\r')).toHaveLength(0);
        const events = parser.push('\n\r\n');

        expect(events).toHaveLength(1);
        expect(events[0]).toEqual({ event: 'mutation', data: 'x' });
    });

    it('treats a lone CR as a line ending', () => {
        const parser = new SseParser();
        const events = parser.push('event: mutation\rdata: x\r\r');

        expect(events).toHaveLength(1);
        expect(events[0]).toEqual({ event: 'mutation', data: 'x' });
    });

    it('throws if the buffer grows past the cap without an event separator', () => {
        const parser = new SseParser();
        expect(() => parser.push('x'.repeat(1_000_001))).toThrow(/buffer exceeded/i);
    });
});
