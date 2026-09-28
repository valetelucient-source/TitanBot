import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function getBotResponse(message) {
    const response = await openai.responses.create({
        model: 'gpt-5-mini',
        instructions:
            'You are Atleti Manager, the friendly Discord bot for a VRFS soccer team. ' +
            'Be helpful, friendly, and casual. Keep responses fairly short because you are ' +
            'talking in Discord. You can talk about the team, soccer, VRFS, and general topics. ' +
            'Do not pretend to be a real person.',
        input: message
    });

    return response.output_text;
}
