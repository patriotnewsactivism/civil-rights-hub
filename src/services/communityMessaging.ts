import { supabase } from "@/integrations/supabase/client";

export interface ConversationSummary {
  id: string;
  name: string | null;
  is_group: boolean;
  last_message_at: string;
  last_message_preview: string | null;
  avatar_url: string | null;
  created_at: string;
  unread_count: number;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  reply_to_id: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  edited_at: string | null;
}

type RpcError = { message: string; code?: string; details?: string | null; hint?: string | null };
type RpcResult<T> = Promise<{ data: T | null; error: RpcError | null }>;
type RpcClient = {
  rpc<T = unknown>(name: string, args?: Record<string, unknown>): RpcResult<T>;
};

// The checked-in Supabase types intentionally trail additive production migrations.
// Keep the escape hatch isolated here; regenerate src/integrations/supabase/types.ts after
// the migration is live rather than spreading `any` throughout UI components.
const rpcClient = supabase as unknown as RpcClient;

function requireData<T>(data: T | null, error: RpcError | null, fallback: string): T {
  if (error) throw new Error(error.message || fallback);
  if (data === null) throw new Error(fallback);
  return data;
}

export async function listMyConversations(limit = 50): Promise<ConversationSummary[]> {
  const { data, error } = await rpcClient.rpc<ConversationSummary[]>("list_my_conversations", {
    p_limit: limit,
  });
  return requireData(data ?? [], error, "Unable to load conversations");
}

export async function getConversationMessages(
  conversationId: string,
  options: { limit?: number; beforeCreatedAt?: string | null; beforeId?: string | null } = {},
): Promise<ConversationMessage[]> {
  const { data, error } = await rpcClient.rpc<ConversationMessage[]>("get_conversation_messages", {
    p_conversation_id: conversationId,
    p_limit: options.limit ?? 50,
    p_before_created_at: options.beforeCreatedAt ?? null,
    p_before_id: options.beforeId ?? null,
  });
  return requireData(data ?? [], error, "Unable to load messages");
}

export async function getOrCreateDirectConversation(otherUserId: string): Promise<string> {
  const { data, error } = await rpcClient.rpc<string>("get_or_create_direct_conversation", {
    p_other_user_id: otherUserId,
  });
  return requireData(data, error, "Unable to start conversation");
}

export async function createGroupConversation(name: string, memberIds: string[]): Promise<string> {
  const { data, error } = await rpcClient.rpc<string>("create_group_conversation", {
    p_name: name,
    p_member_ids: memberIds,
  });
  return requireData(data, error, "Unable to create group conversation");
}

export async function sendConversationMessage(conversationId: string, content: string): Promise<string> {
  const { data, error } = await rpcClient.rpc<string>("send_conversation_message", {
    p_conversation_id: conversationId,
    p_content: content,
  });
  return requireData(data, error, "Unable to send message");
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const { error } = await rpcClient.rpc<null>("mark_conversation_read", {
    p_conversation_id: conversationId,
  });
  if (error) throw new Error(error.message || "Unable to mark conversation read");
}
