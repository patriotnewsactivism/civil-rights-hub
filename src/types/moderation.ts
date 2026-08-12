/**
 * Comment Moderation System - Types & Interfaces
 * Don Matthews / Patriot News Activism Portfolio
 */

export type ModerationLabel = 'genuine' | 'troll' | 'bad_faith';

export type ModerationStatus = 'pending' | 'approved' | 'flagged' | 'rejected';

export type RecommendedAction = 'approve' | 'review' | 'flag';

export type ModerationCategory =
  | 'harassment'
  | 'personal_attack'
  | 'off_topic_derailment'
  | 'spam'
  | 'bad_faith_arguing'
  | 'hate_speech'
  | 'doxxing'
  | 'threats';

export interface ModerationVerdict {
  classification: ModerationLabel;
  confidence: number; // 0.0 to 1.0
  reasoning: string;
  categories: ModerationCategory[];
  recommendedAction: RecommendedAction;
  providerUsed: string; // 'cerebras' | 'groq' | 'cohere' | 'mistral' | 'fallback'
}

export interface ModerationRequest {
  commentId: string;
  content: string;
  commentType?: 'social' | 'violation' | 'forum';
  authorId?: string;
  contextTitle?: string;
}

export interface ModerationLogEntry {
  id: string;
  comment_id: string;
  comment_type: string;
  content_text: string;
  classification: string;
  confidence: number;
  reasoning: string;
  categories: string[];
  recommended_action: string;
  provider_used: string;
  human_overridden: boolean;
  overridden_by?: string | null;
  override_action?: string | null;
  override_notes?: string | null;
  created_at: string;
}
