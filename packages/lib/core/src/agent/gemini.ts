import type { AgentUserConfig } from '../config';
import type { ChatAgent, ChatAgentResponse, ChatStreamTextHandler, LLMChatParams } from './types';
import { renderGeminiContents, requestChatCompletions } from './request/gemini';
import { convertStringToResponseMessages, loadModelsList } from './utils';

export class Gemini implements ChatAgent {
    readonly name = 'gemini';
    readonly modelKey = 'GOOGLE_COMPLETIONS_MODEL';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.GOOGLE_API_KEY);
    };

    readonly model = (ctx: AgentUserConfig): string => {
        return ctx.GOOGLE_COMPLETIONS_MODEL;
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<ChatAgentResponse> => {
        const { prompt, messages } = params;
        const genrateMode = onStream !== null ? 'streamGenerateContent?alt=sse&' : 'generateContent?';
        const url = `${context.GOOGLE_API_BASE}/models/${context.GOOGLE_COMPLETIONS_MODEL}:${genrateMode}key=${context.GOOGLE_API_KEY}`;
        const header = {
            'Content-Type': 'application/json',
        };
        const body = {
            contents: await renderGeminiContents(prompt, messages),
        };
        return convertStringToResponseMessages(requestChatCompletions(url, header, body, onStream));
    };

    readonly modelList = async (context: AgentUserConfig): Promise<string[]> => {
        if (context.GOOGLE_CHAT_MODELS_LIST === '') {
            context.GOOGLE_CHAT_MODELS_LIST = `${context.GOOGLE_API_BASE}/models`;
        }
        return loadModelsList(context.GOOGLE_CHAT_MODELS_LIST, async (url): Promise<string[]> => {
            const data = await fetch(`${url}?key=${context.GOOGLE_API_KEY}`).then(r => r.json());
            return data?.models
                ?.filter((model: any) => model.supportedGenerationMethods?.includes('generateContent'))
                .map((model: any) => model.name.split('/').pop()) ?? [];
        });
    };
}
