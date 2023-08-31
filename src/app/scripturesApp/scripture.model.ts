export interface Work { 
    books: Book[];
    last_modified?: string;
    lds_slug: string;
    subtitle?: string;
    subsubTitle?: string;
    testimonies?: Testimony[];
    title: string;
    title_page?: {
        subtitle: string;
        text: string[];
        title: string;
        translated_by?: string;
    };
    the_end?: string;
    version: number;
}

export interface Testimony {
    text: string;
    title: string;
    witnesses: string[];
}

export interface Book { 
    book: string;
    chapters: Chapter[];
    full_subtitle?: string;
    full_title?: string;
    heading?: string;
    lds_slug?: string;
}

export interface Chapter { 
    chapter: number;
    reference: string;
    verses: Verse[];
}

export interface Verse { 
    reference: string;
    text: string;
    verse?: number;
    pilcrow?: boolean;
}

export interface WorkFlat {
    headings?: Heading[];
    verses: Verse[];
    version: number;
}

export interface Heading {
    reference: string;
    text: string;
}

export interface Score {
    round: number;
    score: number;
    isNerd?: boolean;
}

export interface Challenge5 {
    round1: number;
    randomNumber1: number;
    reference1?: string;
    round2: number;
    randomNumber2: number;
    reference2?: string;
    round3: number;
    randomNumber3: number;
    reference3?: string;
    round4: number;
    randomNumber4: number;
    reference4?: string;
    round5: number;
    randomNumber5: number;
    reference5?: string;
}

export interface ChallengeSet {
    challenges: Challenge5[];
}