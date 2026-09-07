import { NextResponse } from 'next/server';
import getGemini from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    console.log("[Analyze API] Started processing request");
    
    let formData;
    try {
      formData = await req.formData();
      console.log("[Analyze API] Parsed form data");
    } catch (e) {
      console.error("[Analyze API] Failed to parse formData:", e);
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const resumeFile = formData.get('resume') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!resumeFile || !jobDescription) {
      console.log("[Analyze API] Missing fields");
      return NextResponse.json({ error: 'Missing resume or job description' }, { status: 400 });
    }

    console.log("[Analyze API] Received file of size:", resumeFile.size);

    let buffer;
    try {
      const arrayBuffer = await resumeFile.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      console.log("[Analyze API] Converted file to buffer");
    } catch (e) {
      console.error("[Analyze API] Failed to read file buffer:", e);
      return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
    }

    let pdfPart;
    try {
      console.log("[Analyze API] Preparing PDF for Gemini...");
      pdfPart = {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: "application/pdf"
        }
      };
      console.log("[Analyze API] PDF prepared");
    } catch (e) {
      console.error("[Analyze API] Failed to prepare PDF data:", e);
      return NextResponse.json({ error: 'Failed to process PDF file.' }, { status: 500 });
    }

    console.log("[Analyze API] Initializing Gemini...");
    let model;
    try {
      const genAI = getGemini();
      model = genAI.getGenerativeModel({ 
        model: 'gemini-3.5-flash-lite',
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
      console.log("[Analyze API] Gemini initialized");
    } catch (e) {
      console.error("[Analyze API] Gemini initialization failed:", e);
      return NextResponse.json({ error: 'AI Initialization failed. Check API key.' }, { status: 500 });
    }

    const prompt = `
      You are an expert technical recruiter and career coach.
      Analyze the following resume against the provided job description.
      
      Job Description:
      ${jobDescription}
      
      Resume:
      (See attached PDF document)
      
      Provide a detailed JSON response strictly following this structure:
      {
        "matchScore": number (0 to 100 representing the match percentage),
        "missingSkills": [string] (list of key skills in JD missing from resume),
        "strengths": [string] (list of candidate's strengths relative to the JD),
        "weaknesses": [string] (list of areas of improvement or missing qualifications),
        "likelyQuestions": [
          {
            "question": string (a likely interview question based on their resume and the JD),
            "suggestedAnswer": string (a good way for the candidate to answer based on their experience)
          }
        ]
      }
    `;

    console.log("[Analyze API] Calling Gemini generation...");
    let jsonString = "";
    try {
      const result = await model.generateContent([prompt, pdfPart]);
      const response = await result.response;
      jsonString = response.text();
      console.log("[Analyze API] Gemini returned response length:", jsonString.length);
    } catch (e: any) {
      console.error("[Analyze API] Gemini generation failed:", e);
      return NextResponse.json({ error: `AI failed to generate analysis. Error: ${e.message || 'Unknown API Error'}` }, { status: 500 });
    }
    
    let analysisResult;
    try {
      let cleanedText = jsonString.replace(/```json/gi, '').replace(/```/g, '').trim();
      analysisResult = JSON.parse(cleanedText);
      console.log("[Analyze API] Successfully parsed JSON result");
    } catch (e) {
      console.error("[Analyze API] Failed to parse JSON from Gemini:", jsonString.substring(0, 100));
      return NextResponse.json({ error: 'AI returned invalid JSON.' }, { status: 500 });
    }

    return NextResponse.json(analysisResult);
  } catch (error: unknown) {
    console.error('[Analyze API] Catch-all error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg || 'Internal server error' }, { status: 500 });
  }
}
