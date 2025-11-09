import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 400 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Models API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch models', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    
    // Filter models that support generateContent
    const generateContentModels = data.models?.filter((model: any) => 
      model.supportedGenerationMethods?.includes('generateContent')
    ).map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedMethods: model.supportedGenerationMethods
    }));

    return NextResponse.json({
      availableModels: generateContentModels || [],
      totalModels: data.models?.length || 0
    });

  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch models', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}