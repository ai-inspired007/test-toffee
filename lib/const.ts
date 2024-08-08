// default profile picture
export const DEFAULT_PFP = "/logo.png";

// how many messages are stored in a bots short term memory
export const SHORT_TERM_MEMORY_SIZE = 1;

// maximum characters per document (chunk)
export const MAX_CHARS_PER_DOC = 4096;

// expected characters per document
export const CHARS_PER_DOC = 2048;

// minimum number of characters per document
export const MIN_CHARS_PER_DOC = 1024;

// maximum length of an incremental input (greater should be classified as full text)
export const MAX_INCREMENTAL_LENGTH = 2048;

// maximum number of vectors per character
export const MAX_VECTORS = 2000;

// number of secondary vectors to take
export const SECONDARY_VECTOR_COUNT = 2;

// the threshold at which we put two summaries under the same label
export const LABEL_GROUP_SIMILARITY_THRESHOLD = 0.8;


// list of special characters
export const SPECIAL_CHARACTERS = [',', '.', '"', ':', ')', '(', '-', '!', '?', '|', ';', "'", '$', '&', '/', '[', ']', '>', '%', '=', '#', '*', '+', '\\', '•',  '~', '@', '£', 
 '·', '_', '{', '}', '©', '^', '®', '`',  '<', '→', '°', '€', '™', '›',  '♥', '←', '×', '§', '″', '′', ' ', '█', '½', 'à', '…', 
 '“', '★', '”', '–', '●', 'â', '►', '−', '¢', '²', '¬', '░', '¶', '↑', '±', '¿', '▾', '═', '¦', '║', '―', '¥', '▓', '—', '‹', '─', 
 '▒', '：', '¼', '⊕', '▼', '▪', '†', '■', '’', '▀', '¨', '▄', '♫', '☆', 'é', '¯', '♦', '¤', '▲', 'è', '¸', '¾', 'Ã', '⋅', '‘', '∞', 
 '∙', '）', '↓', '、', '│', '（', '»', '，', '♪', '╩', '╚', '³', '・', '╦', '╣', '╔', '╗', '▬', '❤', 'ï', 'Ø', '¹', '≤', '‡', '√', ]

// list of contractions
 export const CONTRACTIONS = new Map([
    ["ain't", "is not"],
    ["aren't", "are not"],
    ["can't", "cannot"],
    ["'cause", "because"],
    ["could've", "could have"],
    ["couldn't", "could not"],
    ["didn't", "did not"],
    ["doesn't", "does not"],
    ["don't", "do not"],
    ["hadn't", "had not"],
    ["hasn't", "has not"],
    ["haven't", "have not"],
    ["he'd", "he would"],
    ["he'll", "he will"],
    ["he's", "he is"],
    ["how'd", "how did"],
    ["how'd'y", "how do you"],
    ["how'll", "how will"],
    ["how's", "how is"],
    ["I'd", "I would"],
    ["I'd've", "I would have"],
    ["I'll", "I will"],
    ["I'll've", "I will have"],
    ["I'm", "I am"],
    ["I've", "I have"],
    ["i'd", "i would"],
    ["i'd've", "i would have"],
    ["i'll", "i will"],
    ["i'll've", "i will have"],
    ["i'm", "i am"],
    ["i've", "i have"],
    ["isn't", "is not"],
    ["it'd", "it would"],
    ["it'd've", "it would have"],
    ["it'll", "it will"],
    ["it'll've", "it will have"],
    ["it's", "it is"],
    ["let's", "let us"],
    ["ma'am", "madam"],
    ["mayn't", "may not"],
    ["might've", "might have"],
    ["mightn't", "might not"],
    ["mightn't've", "might not have"],
    ["must've", "must have"],
    ["mustn't", "must not"],
    ["mustn't've", "must not have"],
    ["needn't", "need not"],
    ["needn't've", "need not have"],
    ["o'clock", "of the clock"],
    ["oughtn't", "ought not"],
    ["oughtn't've", "ought not have"],
    ["shan't", "shall not"],
    ["sha'n't", "shall not"],
    ["shan't've", "shall not have"],
    ["she'd", "she would"],
    ["she'd've", "she would have"],
    ["she'll", "she will"],
    ["she'll've", "she will have"],
    ["she's", "she is"],
    ["should've", "should have"],
    ["shouldn't", "should not"],
    ["shouldn't've", "should not have"],
    ["so've", "so have"],
    ["so's", "so as"],
    ["this's", "this is"],
    ["that'd", "that would"],
    ["that'd've", "that would have"],
    ["that's", "that is"],
    ["there'd", "there would"],
    ["there'd've", "there would have"],
    ["there's", "there is"],
    ["here's", "here is"],
    ["they'd", "they would"],
    ["they'd've", "they would have"],
    ["they'll", "they will"],
    ["they'll've", "they will have"],
    ["they're", "they are"],
    ["they've", "they have"],
    ["to've", "to have"],
    ["wasn't", "was not"],
    ["we'd", "we would"],
    ["we'd've", "we would have"],
    ["we'll", "we will"],
    ["we'll've", "we will have"],
    ["we're", "we are"],
    ["we've", "we have"],
    ["weren't", "were not"],
    ["what'll", "what will"],
    ["what'll've", "what will have"],
    ["what're", "what are"],
    ["what's", "what is"],
    ["what've", "what have"],
    ["when's", "when is"],
    ["when've", "when have"],
    ["where'd", "where did"],
    ["where's", "where is"],
    ["where've", "where have"],
    ["who'll", "who will"],
    ["who'll've", "who will have"],
    ["who's", "who is"],
    ["who've", "who have"],
    ["why's", "why is"],
    ["why've", "why have"],
    ["will've", "will have"],
    ["won't", "will not"],
    ["won't've", "will not have"],
    ["would've", "would have"],
    ["wouldn't", "would not"],
    ["wouldn't've", "would not have"],
    ["y'all", "you all"],
    ["y'all'd", "you all would"],
    ["y'all'd've", "you all would have"],
    ["y'all're", "you all are"],
    ["y'all've", "you all have"],
    ["you'd", "you would"],
    ["you'd've", "you would have"],
    ["you'll", "you will"],
    ["you'll've", "you will have"],
    ["you're", "you are"],
    ["you've", "you have"]
])

// number of labels to connect to
export const LABEL_DEGREE = 5;

// how many summaries before regenerating label
export const REGENERATE_COUNT = 5;