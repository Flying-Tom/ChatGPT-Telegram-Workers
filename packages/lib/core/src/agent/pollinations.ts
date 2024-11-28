import type { AgentUserConfig } from '../config';
import type {
    ChatAgent,
    ChatAgentResponse,
    ChatStreamTextHandler,
    ImageAgent,
    LLMChatParams,
} from './types';

import { renderOpenAIMessages } from './openai';
import { requestChatCompletions } from './request';
import { convertStringToResponseMessages, loadModelsList } from './utils';

const header = {
    'Content-Type': 'application/json',
};

class PollinationsBase {
    readonly name = 'pollinations';
    readonly modelFromURI = (uri: string | null): string => {
        if (!uri) {
            return '';
        }
        try {
            const model = new URL(uri).searchParams.get('model');
            if (model) {
                return model;
            }
            throw new Error('Invalid URI');
        } catch {
            return uri;
        }
    };
}

export class PollinationsChatAI extends PollinationsBase implements ChatAgent {
    readonly modelKey = 'POLLINATIONS_CHAT_API';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.POLLINATIONS_CHAT_ENABLED && context.POLLINATIONS_CHAT_API);
    };

    readonly model = (ctx: AgentUserConfig): string | null => {
        return ctx.POLLINATIONS_CHAT_API;
    };

    readonly request = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<ChatAgentResponse> => {
        const { prompt, messages } = params;
        const url = `${context.POLLINATIONS_CHAT_API}/openai`;
        const body = {
            messages: await renderOpenAIMessages(prompt, messages, true),
            stream: onStream != null,
        };
        return convertStringToResponseMessages(requestChatCompletions(url, header, body, onStream));
    };

    readonly modelList = async (context: AgentUserConfig): Promise<string[]> => {
        if (context.POLLINATIONS_CHAT_MODELS_LIST === '') {
            context.POLLINATIONS_CHAT_MODELS_LIST = `${context.POLLINATIONS_CHAT_API}/models`;
        }
        return loadModelsList(context.POLLINATIONS_CHAT_MODELS_LIST, async (url): Promise<string[]> => {
            const header = {
                'Content-Type': 'application/json',
            };
            const data = await fetch(url, { headers: header }).then(res => res.json());
            return data.map((model: any) => model.name) || [];
        });
    };
}

export class PollinationsImageAI extends PollinationsBase implements ImageAgent {
    readonly modelKey = 'POLLINATIONS_IMAGE_API';

    readonly enable = (context: AgentUserConfig): boolean => {
        return !!(context.POLLINATIONS_IMAGE_API);
    };

    readonly model = (ctx: AgentUserConfig) => {
        return this.modelFromURI(ctx.POLLINATIONS_IMAGE_API);
    };

    readonly request = async (prompt: string, context: AgentUserConfig): Promise<Blob> => {
        const params = new URLSearchParams({
            width: context.POLLINATIONS_IMAGE_WIDTH,
            height: context.POLLINATIONS_IMAGE_HEIGHT,
            model: context.POLLINATIONS_IMAGE_MODEL,
            nologo: context.POLLINATIONS_IMAGE_NOLOGO,
            private: context.POLLINATIONS_IMAGE_PRIVATE,
            enhance: context.POLLINATIONS_IMAGE_ENHANCE,
        });
        const url = `${context.POLLINATIONS_IMAGE_API}/p/${encodeURIComponent(prompt)}?${params.toString()}`;
        const resp = await fetch(url, {
            method: 'GET',
            headers: header,
        }) as Response;

        return await resp.blob();
    };
}
