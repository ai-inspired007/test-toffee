import { NextResponse } from "next/server";
import OpenAI from "openai";

let promptJson: any = {
  "short": "Convert simply user content",
  "long": "Convert professonally user content",
  "language": "Convert language",
  "idea": "Analyaze user content, and then extract new ideas",
  "spell": "Analyze user content, and then fix spelling",
  "thone": ""
}

export async function POST(
  req: Request,
) {
  try {
    let body = await req.json();
    const { prompt, type } = body;
    console.log(prompt)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let textTypes = ["short", "long", "language", "idea", "spell", "thone"];
    
    // const completion: any = await openai.chat.completions.create({
    //   model: 'gpt-4o',
    //   // stream: true,
    //   max_tokens: 300,
    //   messages: [
    //     { role: "system", content: "Analyze user question and provide prompt for generating Character of high quality." },
    //     {
    //       role: "user",
    //       content: prompt
    //     }
    //   ],
    // });

    // const characterPrompt = completion.choices[0].message.content.trim();
    // console.log(characterPrompt)

    if (type === "image") {
      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      });
  
      const base64String: any = image.data[0].b64_json;
      const parts = base64String.split(';base64,');
      const imageData = parts[1] ? parts[1] : parts[0];
  
      const imageBuffer = Buffer.from(imageData, 'base64');

      return NextResponse.json({ imageBuffer }, { status: 200 })
    } else if (type === "tag") {
      const completion: any = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Analyze Character description and category, and then You should identify key elements and themes in the description that are specific and provide insight into the narrative or the character itself." },
          { role: "user", content: prompt },
        ],
        functions: [
          {
            "name": "get_coordinates",
            "description": "Get multiple tags for Character category.",
            "parameters": {
              "type": "object",
              "properties": {
                  "tags": {
                      "type": "array",
                      "description": "A category defines a broad aspect of a character’s personality, such as virtue or flaw, while a tag specifies an example within that category, like honesty for virtue or impulsiveness for flaw.",
                      "items": {
                        "type": "string"
                      }
                  }
              },
              "required": ["tags"]
            }
            }
        ],
        function_call: "auto",
      })
      const result = completion.choices[0].message.function_call.arguments;
      const parsedResult = JSON.parse(result);
      console.log(parsedResult.tags)
      console.log(result);
      return NextResponse.json({ completion: parsedResult.tags }, { status: 200 })
    } else if (textTypes.includes(type)) {
      console.log(type)
      let openai = new OpenAI({
        baseURL: process.env.ANYSCALE_BASE_URL,
        apiKey: process.env.ANYSCALE_API_KEY,
      });

      const completion: any = await openai.chat.completions.create({
        messages: [
          { role: "system", content: promptJson[type] },
          { role: "user", content: prompt },
        ],
        model: "meta-llama/Meta-Llama-3-70B-Instruct",
        max_tokens: 1024,
      });
      const result = completion.choices[0].message.content.trim();
      return NextResponse.json({ completion: result }, { status: 200 })
    }

    

    
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Error", { status: 500 });
  }
}