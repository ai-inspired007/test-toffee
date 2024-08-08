export const LABEL_PROMPT = `
You must generate a label for a given chunk of text.

1. You will recieve a chunk of text, like so:
[CHUNK]
text goes here
[/CHUNK]

Generate a label for the text. The label should be a concise, descriptive phrase that captures the main theme or topic of the paragraph. 

It should be clear, informative, and relevant to the content of the text. The label should be general and applicable to a variety of texts.

Here is an example of output. You must strictly abide by this format:
    
    {
        "label": "example label",
    }

You should output your findings in the above JSON format. 

Respond only with the label, nothing else.
`

export const REGENERATE_LABEL = `
You are tasked with generating a new label for a group of text by slightly modifying an existing label based on new information.

1. You will recieve the old label, surrounded by tags like so:
[OLD LABEL]
old label goes here
[/OLD LABEL]

2. You will recieve a new paragraph of text, like so:
[NEW TEXT]
new text goes here
possibly multiple texts
[/NEW TEXT]

3. Generate a new label by slightly modifying the old label. The label should be a concise, descriptive phrase that captures the main theme or topic of the paragraph. 

It should be clear, informative, and relevant to the content of the text. The label should be general and applicable to a variety of texts.

You should only slightly modify the old label. Do not include specifics from the new text, but rather slightly update to label toalso  capture the main theme or topic of the new text.

If it is impossible to capture the meaning of the new text with only a slight modification, you should not change the label.

Here is an example of output. You must strictly abide by this format:
    
    {
        "label": "example label",
    }

You should output your findings in the above JSON format. 

Respond only with the new label, nothing else.
`

export const SUMMARIZE_PROMPT = `
You are tasked by an observer with a new paragraph, and need to summarize it.

1. You will recieve a chunk of text, like so:
[CHUNK]
text goes here
[/CHUNK]

2. Generate a summary of the text. The summary should aim to maintain as many specific details as possible, while simplifying the text of the paragraph. 
Here are some examples of specific details:
1. Dates and Timeframes: Including specific dates, times, or timeframes mentioned in the text can help maintain temporal context.
2. Locations and Geographical References: Preserving names of places, countries, cities, landmarks, and other geographical references can aid in understanding the spatial context of the text.
3. Numerical Data: Retaining numerical data such as statistics, measurements, quantities, percentages, and other numerical values provides important details for understanding the content.
4. Technical Terms and Jargon: Keeping specialized terminology, acronyms, industry-specific jargon, and technical terms helps maintain the specificity and accuracy of the text.
5. Key Events or Milestones: Highlighting significant events, milestones, developments, or actions mentioned in the text helps capture important narrative points.

3. Grab all of these specific details of the chunk of text, and return them as a single "keywords" section.

The summary should also aim to maintain clear, concise language with no grammatical errors. You should include all captured keywords, but try to keep them as concise as possible.

Here is an example of output. You must strictly abide by this format:

{
    "summary": "example summary",
    "keywords": "Robotics Nasa Moon Landing",
}

You should output your findings in the above JSON format. 

Respond only with the summary and keywords, nothing else.
`;