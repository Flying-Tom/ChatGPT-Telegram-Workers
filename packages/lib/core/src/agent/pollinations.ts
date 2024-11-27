import type { AgentUserConfig } from '../config';
import type {
    AgentEnable,
    AgentModel,
    AgentModelList,
    ChatAgent,
    ChatAgentResponse,
    ImageAgent,
    LLMChatParams,
} from './types';
import { renderOpenAIMessages } from '#/agent/openai_compatibility';
import { convertStringToResponseMessages, getAgentUserConfigFieldName, loadModelsList } from './utils';

const header = {
    'Content-Type': 'application/json',
};

class PollinationsBase {
    readonly name = 'pollinations';
}

export class PollinationsChatAI extends PollinationsBase implements ChatAgent {
    readonly name = 'pollinations';
    readonly modelKey = getAgentUserConfigFieldName('POLLINATIONS_CHAT_MODEL');

    readonly enable: AgentEnable = ctx => !!(ctx.POLLINATIONS_CHAT_ENABLED && ctx.POLLINATIONS_CHAT_API);
    readonly model: AgentModel = ctx => ctx.POLLINATIONS_CHAT_MODEL;

    readonly request = async (params: LLMChatParams, context: AgentUserConfig): Promise<ChatAgentResponse> => {
        const { prompt, messages } = params;
        const url = `${context.POLLINATIONS_CHAT_API}`;
        const body = {
            messages: await renderOpenAIMessages(prompt, messages, null),
            model: context.POLLINATIONS_CHAT_MODEL,
        };
        const resp = await fetch(url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(body),
        });
        return convertStringToResponseMessages(resp.text());
    };

    readonly modelList = async (context: AgentUserConfig): Promise<string[]> => {
        if (context.POLLINATIONS_CHAT_MODELS_LIST === '') {
            context.POLLINATIONS_CHAT_MODELS_LIST = `${context.POLLINATIONS_CHAT_API}/models`;
        }
        return loadModelsList(context.POLLINATIONS_CHAT_MODELS_LIST, async (url): Promise<string[]> => {
            const data = await fetch(url, { headers: header }).then(res => res.json());
            return data.map((model: any) => model.name) || [];
        });
    };
}

export class PollinationsImageAI extends PollinationsBase implements ImageAgent {
    readonly name = 'pollinations';
    readonly modelKey = getAgentUserConfigFieldName('POLLINATIONS_IMAGE_MODEL');

    readonly enable: AgentEnable = ctx => !!(ctx.POLLINATIONS_IMAGE_API);
    readonly model: AgentModel = ctx => ctx.POLLINATIONS_IMAGE_MODEL;
    readonly modelList = async (context: AgentUserConfig): Promise<string[]> => {
        if (context.POLLINATIONS_IMAGE_MODELS_LIST === '') {
            context.POLLINATIONS_IMAGE_MODELS_LIST = `${context.POLLINATIONS_IMAGE_API}/models`;
        }
        return loadModelsList(context.POLLINATIONS_IMAGE_MODELS_LIST, async (url): Promise<string[]> => {
            const data = await fetch(url, { headers: header }).then(res => res.json());
            return data || [];
        });
    };

    readonly request = async (prompt: string, context: AgentUserConfig): Promise<Blob> => {
        const params = new URLSearchParams({
            width: context.POLLINATIONS_IMAGE_WIDTH,
            height: context.POLLINATIONS_IMAGE_HEIGHT,
            model: context.POLLINATIONS_IMAGE_MODEL,
            seed: context.POLLINATIONS_IMAGE_SEED,
            nologo: context.POLLINATIONS_IMAGE_NOLOGO,
            private: context.POLLINATIONS_IMAGE_PRIVATE,
            enhance: context.POLLINATIONS_IMAGE_ENHANCE,
        });
        const url = `${context.POLLINATIONS_IMAGE_API}/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
        const resp = await fetch(url, {
            method: 'GET',
            headers: header,
        }) as Response;

        return await resp.blob();
    };
}
