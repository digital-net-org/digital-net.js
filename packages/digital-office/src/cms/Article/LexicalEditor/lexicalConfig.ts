import { type HeadingTagType, HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import type { Klass, LexicalNode } from 'lexical';

export const LEXICAL_NODES: Array<Klass<LexicalNode>> = [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode];

export const LEXICAL_HEADING_LEVELS: HeadingTagType[] = ['h1', 'h2', 'h3', 'h4'];
export const LEXICAL_THEME = {
    paragraph: 'paragraph',
    heading: { h1: 'title-1', h2: 'title-2', h3: 'title-3', h4: 'title-4' },
    list: { ul: 'list', ol: 'list-numbered', listitem: 'list-item' },
    quote: '',
    text: {
        bold: 'bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'strikethrough',
    },
    link: 'lexical-link',
};
