import Anthropic from '@anthropic-ai/sdk';

console.log('API KEY:', process.env.ANTHROPIC_API_KEY);

const client = new Anthropic();

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64,
            },
          },
          {
            type: 'text',
            text: `Extract all assignments, exams, quizzes, and deadlines from this syllabus. 
Return ONLY valid JSON with no explanation, no markdown, no code blocks. 
Format: { "course_name": "...", "items": [{ "name": "...", "type": "assignment|exam|quiz", "due_date": "...", "weight_pct": 0 }] }
If you cannot find a due date or weight, use null.`,
          },
        ],
      },
    ],
  });

  const text = message.content[0].text;
  
  try {
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: 'Failed to parse', raw: text }, { status: 500 });
  }
}