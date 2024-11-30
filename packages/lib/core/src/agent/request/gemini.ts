import type { ChatStreamTextHandler, HistoryItem } from '../types';
import { ENV } from '../../config';
import { imageToBase64String } from '../../utils/image';
import { Stream } from '../stream';
import { extractImageContent } from '../utils';

export interface SseChatCompatibleOptions {
    streamBuilder?: (resp: Response, controller: AbortController) => Stream;
    contentExtractor?: (data: object) => string | null;
    fullContentExtractor?: (data: object) => string | null;
    errorExtractor?: (data: object) => string | null;
}

function fixOpenAICompatibleOptions(options: SseChatCompatibleOptions | null): SseChatCompatibleOptions {
    options = options || {};
    options.streamBuilder = options.streamBuilder || function (r, c) {
        return new Stream(r, c);
    };
    options.contentExtractor = options.contentExtractor || function (d: any) {
        return d?.choices?.at(0)?.delta?.content;
    };
    options.fullContentExtractor = options.fullContentExtractor || function (d: any) {
        return d.choices?.at(0)?.message.content;
    };
    options.errorExtractor = options.errorExtractor || function (d: any) {
        return d.error?.message;
    };
    return options;
}

export function isJsonResponse(resp: Response): boolean {
    return resp.headers.get('content-type')?.includes('json') || false;
}

export function isEventStreamResponse(resp: Response): boolean {
    const types = ['application/stream+json', 'text/event-stream'];
    const content = resp.headers.get('content-type') || '';
    for (const type of types) {
        if (content.includes(type)) {
            return true;
        }
    }
    return false;
}

export async function streamHandler<T>(stream: AsyncIterable<T>, contentExtractor: (data: T) => string | null, onStream: (text: string) => Promise<any>): Promise<string> {
    let contentFull = '';
    let lengthDelta = 0;
    let updateStep = 50;
    let lastUpdateTime = Date.now();
    console.log('streamHandler');
    console.log(await stream.text());
    try {
        for await (const part of stream) {
            const textPart = contentExtractor(part);
            if (!textPart) {
                continue;
            }
            lengthDelta += textPart.length;
            contentFull = contentFull + textPart;
            if (lengthDelta > updateStep) {
                if (ENV.TELEGRAM_MIN_STREAM_INTERVAL > 0) {
                    const delta = Date.now() - lastUpdateTime;
                    if (delta < ENV.TELEGRAM_MIN_STREAM_INTERVAL) {
                        continue;
                    }
                    lastUpdateTime = Date.now();
                }
                lengthDelta = 0;
                updateStep += 20;
                await onStream(`${contentFull}\n...`);
            }
        }
    } catch (e) {
        contentFull += `\nError: ${(e as Error).message}`;
    }
    return contentFull;
}

export async function requestChatCompletions(url: string, header: Record<string, string>, body: any, onStream: ChatStreamTextHandler | null, options: SseChatCompatibleOptions | null = null): Promise<string> {
    const controller = new AbortController();
    const { signal } = controller;

    let timeoutID = null;
    if (ENV.CHAT_COMPLETE_API_TIMEOUT > 0) {
        timeoutID = setTimeout(() => controller.abort(), ENV.CHAT_COMPLETE_API_TIMEOUT);
    }
    const resp = await fetch(url, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body),
        signal,
    });
    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    options = fixOpenAICompatibleOptions(options);
    if (onStream && resp.ok && isEventStreamResponse(resp)) {
        const stream = options.streamBuilder?.(resp, controller);
        if (!stream) {
            throw new Error('Stream builder error');
        }
        console.log('streamHandler');
        return streamHandler<object>(stream, options.contentExtractor!, onStream);
    }
    if (!isJsonResponse(resp)) {
        throw new Error(resp.statusText);
    }

    const result = await resp.json() as any;

    if (!result) {
        throw new Error('Empty response');
    }
    if (options.errorExtractor?.(result)) {
        throw new Error(options.errorExtractor?.(result) || 'Unknown error');
    }

    return options.fullContentExtractor?.(result) || '';
}

async function renderGeminiContent(item: HistoryItem, supportImage?: boolean): Promise<any> {
    const res: any = {
        role: item.role,
        parts: [
            { text: item.content.toString() },
        ],
    };
    if (Array.isArray(item.content)) {
        const contents = [];
        for (const content of item.content) {
            switch (content.type) {
                case 'text':
                    contents.push({ type: 'text', text: content.text });
                    break;
                case 'image':
                    if (supportImage) {
                        const data = extractImageContent(content.image);
                        if (data.url) {
                            if (ENV.TELEGRAM_IMAGE_TRANSFER_MODE === 'base64') {
                                contents.push(await imageToBase64String(data.url).then(({ data }) => {
                                    return { type: 'image_url', image_url: { url: data } };
                                }));
                            } else {
                                contents.push({ type: 'image_url', image_url: { url: data.url } });
                            }
                        } else if (data.base64) {
                            contents.push({ type: 'image_url', image_url: { url: data.base64 } });
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        res.content = contents;
    }
    return res;
}

export async function renderGeminiContents(prompt: string | undefined, items: HistoryItem[], supportImage?: boolean): Promise<any[]> {
    const contents = await Promise.all(items.map(r => renderGeminiContent(r, supportImage)));
    if (prompt) {
        if (contents.length > 0 && contents[0].role === 'system') {
            contents.shift();
        }
        contents.unshift({ role: 'system', content: prompt });
    }
    return contents;
}
