export type MessageRole = 'user' | 'assistant';

export type ChatResponseData =
  | { type: 'table'; title: string; headers: string[]; rows: (string | number)[][] }
  | { type: 'kpi'; items: { label: string; value: string; status?: 'green' | 'orange' | 'red' }[] }
  | { type: 'list'; title: string; items: string[] };

export type ChatResponse = {
  text: string;
  data?: ChatResponseData;
  suggestions?: string[];
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  data?: ChatResponseData;
  suggestions?: string[];
  timestamp: number;
};

export type QueryEngine = (query: string) => Promise<ChatResponse>;

export type SavedReport = {
  id: string;
  name: string;
  savedAt: number;
  source: 'finley' | 'custom';
  query?: string;
  data: ChatResponseData;
};
