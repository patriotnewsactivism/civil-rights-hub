import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronRight, MoreHorizontal, Reply, Trash2, Edit2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface CommentProfile {
  display_name: string;
  avatar_url: string | null;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_comment_id: string | null;
  created_at: string;
  profile: CommentProfile;
}

export interface ThreadedCommentsProps {
  postId: string;
  comments: Comment[];
  currentUserId: string | null;
  onAddComment: (content: string, parentId?: string) => void;
  onUpdateComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  maxDepth?: number;
  sortDirection?: "newest" | "oldest";
  highlightedCommentIds?: Set<string>;
  mentionableUsers?: CommentProfile[];
}

interface CommentThreadProps {
  comment: Comment;
  replies: Comment[];
  allComments: Comment[];
  depth: number;
  maxDepth: number;
  currentUserId: string | null;
  onReply: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  isHighlighted: boolean;
  mentionableUsers?: CommentProfile[];
  collapsedThreads: Set<string>;
  onToggleCollapse: (commentId: string) => void;
  hiddenThreads: Set<string>;
  onToggleHidden: (commentId: string) => void;
}

const INDENTATION_PX = 24;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function highlightMentions(content: string): React.ReactNode {
  const mentionRegex = /@(\w+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = mentionRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={key++} className="text-primary font-semibold">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : content;
}

function countAllReplies(commentId: string, allComments: Comment[]): number {
  const directReplies = allComments.filter((c) => c.parent_comment_id === commentId);
  return directReplies.reduce((sum, reply) => sum + 1 + countAllReplies(reply.id, allComments), 0);
}

function CommentThread({
  comment,
  replies,
  allComments,
  depth,
  maxDepth,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  isHighlighted,
  mentionableUsers,
  collapsedThreads,
  onToggleCollapse,
  hiddenThreads,
  onToggleHidden,
}: CommentThreadProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const isCollapsed = collapsedThreads.has(comment.id);
  const isHidden = hiddenThreads.has(comment.id);
  const isOwnComment = currentUserId === comment.user_id;
  const replyCount = countAllReplies(comment.id, allComments);
  const canNest = depth < maxDepth;
  const indentStyle = { marginLeft: depth > 0 ? `${INDENTATION_PX}px` : undefined };

  const filteredMentions = useMemo(() => {
    if (!mentionQuery || !mentionableUsers) return [];
    return mentionableUsers.filter((user) =>
      user.display_name.toLowerCase().includes(mentionQuery.toLowerCase())
    );
  }, [mentionQuery, mentionableUsers]);

  useEffect(() => {
    if (isReplying && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [isReplying]);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleReplySubmit = useCallback(() => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setIsReplying(false);
    }
  }, [comment.id, onReply, replyContent]);

  const handleEditSubmit = useCallback(() => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    }
  }, [comment.id, editContent, onEdit]);

  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit();
    }
    if (e.key === "Escape") {
      setIsReplying(false);
      setReplyContent("");
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(comment.content);
    }
  };

  const handleReplyInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReplyContent(value);

    const lastAtIndex = value.lastIndexOf("@");
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentions(true);
      setMentionQuery("");
    } else if (lastAtIndex !== -1) {
      const query = value.slice(lastAtIndex + 1);
      if (!query.includes(" ")) {
        setShowMentions(true);
        setMentionQuery(query);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (username: string) => {
    const lastAtIndex = replyContent.lastIndexOf("@");
    const newContent = replyContent.slice(0, lastAtIndex) + `@${username.replace(/\s+/g, "")} `;
    setReplyContent(newContent);
    setShowMentions(false);
    replyInputRef.current?.focus();
  };

  const sortedReplies = useMemo(() => {
    return [...replies].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [replies]);

  if (isHidden) {
    return (
      <div className="py-2">
        <button
          onClick={() => onToggleHidden(comment.id)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
          <MessageSquare className="h-4 w-4" />
          <span>Show {replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={cn("relative", depth > 0 && "border-l-2 border-border/50")}>
      <div
        className={cn(
          "group py-3 transition-colors duration-200",
          depth > 0 && "pl-3",
          isHighlighted && "bg-primary/10 rounded-lg px-3 -ml-3"
        )}
        style={depth === 0 ? undefined : indentStyle}
      >
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.profile.avatar_url || undefined} alt={comment.profile.display_name} />
            <AvatarFallback className="text-xs">{getInitials(comment.profile.display_name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{comment.profile.display_name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  ref={editInputRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="min-h-[60px] text-sm"
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEditSubmit}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-1 text-sm text-foreground/90 break-words">
                {highlightMentions(comment.content)}
              </div>
            )}

            {!isEditing && (
              <div className="mt-2 flex items-center gap-2">
                {canNest && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}

                {replyCount > 0 && (
                  <button
                    onClick={() => onToggleCollapse(comment.id)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    {isCollapsed ? (
                      <>
                        <ChevronRight className="h-3 w-3" />
                        <span>Show {replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        <span>Hide {replyCount === 1 ? "reply" : "replies"}</span>
                      </>
                    )}
                  </button>
                )}

                {isOwnComment && (onEdit || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-auto">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => setIsEditing(true)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}

            {isReplying && (
              <div className="mt-3 space-y-2 relative">
                <Textarea
                  ref={replyInputRef}
                  value={replyContent}
                  onChange={handleReplyInputChange}
                  onKeyDown={handleReplyKeyDown}
                  className="min-h-[60px] text-sm"
                  placeholder="Write a reply... Use @ to mention someone"
                />
                
                {showMentions && mentionableUsers && filteredMentions.length > 0 && (
                  <div className="absolute top-full left-0 z-10 mt-1 w-full max-w-xs bg-popover border rounded-md shadow-lg">
                    {filteredMentions.slice(0, 5).map((user, idx) => (
                      <button
                        key={idx}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                        onClick={() => insertMention(user.display_name)}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">{getInitials(user.display_name)}</AvatarFallback>
                        </Avatar>
                        <span>{user.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" onClick={handleReplySubmit} disabled={!replyContent.trim()}>
                    Post Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isCollapsed && sortedReplies.length > 0 && (
        <div className="overflow-hidden transition-all duration-300 ease-in-out">
          {sortedReplies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              replies={allComments.filter((c) => c.parent_comment_id === reply.id)}
              allComments={allComments}
              depth={depth + 1}
              maxDepth={maxDepth}
              currentUserId={currentUserId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              isHighlighted={isHighlighted}
              mentionableUsers={mentionableUsers}
              collapsedThreads={collapsedThreads}
              onToggleCollapse={onToggleCollapse}
              hiddenThreads={hiddenThreads}
              onToggleHidden={onToggleHidden}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ThreadedComments({
  postId,
  comments,
  currentUserId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  maxDepth = 3,
  sortDirection = "newest",
  highlightedCommentIds = new Set(),
  mentionableUsers,
}: ThreadedCommentsProps) {
  const [newCommentContent, setNewCommentContent] = useState("");
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(new Set());
  const [hiddenThreads, setHiddenThreads] = useState<Set<string>>(new Set());
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const filteredMentions = useMemo(() => {
    if (!mentionQuery || !mentionableUsers) return [];
    return mentionableUsers.filter((user) =>
      user.display_name.toLowerCase().includes(mentionQuery.toLowerCase())
    );
  }, [mentionQuery, mentionableUsers]);

  const topLevelComments = useMemo(() => {
    const topLevel = comments.filter((c) => c.parent_comment_id === null);
    const sorted = [...topLevel].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === "newest" ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [comments, sortDirection]);

  const getReplies = useCallback(
    (parentId: string) => comments.filter((c) => c.parent_comment_id === parentId),
    [comments]
  );

  const handleToggleCollapse = useCallback((commentId: string) => {
    setCollapsedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  const handleToggleHidden = useCallback((commentId: string) => {
    setHiddenThreads((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (newCommentContent.trim()) {
      onAddComment(newCommentContent.trim());
      setNewCommentContent("");
    }
  }, [newCommentContent, onAddComment]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewCommentContent(value);

    const lastAtIndex = value.lastIndexOf("@");
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentions(true);
      setMentionQuery("");
    } else if (lastAtIndex !== -1) {
      const query = value.slice(lastAtIndex + 1);
      if (!query.includes(" ")) {
        setShowMentions(true);
        setMentionQuery(query);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (username: string) => {
    const lastAtIndex = newCommentContent.lastIndexOf("@");
    const newContent = newCommentContent.slice(0, lastAtIndex) + `@${username.replace(/\s+/g, "")} `;
    setNewCommentContent(newContent);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleReply = useCallback(
    (parentId: string, content: string) => {
      onAddComment(content, parentId);
    },
    [onAddComment]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2 relative">
        <Textarea
          ref={inputRef}
          value={newCommentContent}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="min-h-[80px] text-sm"
          placeholder="Write a comment... Use @ to mention someone"
        />

        {showMentions && mentionableUsers && filteredMentions.length > 0 && (
          <div className="absolute top-full left-0 z-10 mt-1 w-full max-w-xs bg-popover border rounded-md shadow-lg">
            {filteredMentions.slice(0, 5).map((user, idx) => (
              <button
                key={idx}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                onClick={() => insertMention(user.display_name)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">{getInitials(user.display_name)}</AvatarFallback>
                </Avatar>
                <span>{user.display_name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!newCommentContent.trim()}>
            Post Comment
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {topLevelComments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          topLevelComments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              allComments={comments}
              depth={0}
              maxDepth={maxDepth}
              currentUserId={currentUserId}
              onReply={handleReply}
              onEdit={onUpdateComment}
              onDelete={onDeleteComment}
              isHighlighted={highlightedCommentIds.has(comment.id)}
              mentionableUsers={mentionableUsers}
              collapsedThreads={collapsedThreads}
              onToggleCollapse={handleToggleCollapse}
              hiddenThreads={hiddenThreads}
              onToggleHidden={handleToggleHidden}
            />
          ))
        )}
      </div>
    </div>
  );
}
