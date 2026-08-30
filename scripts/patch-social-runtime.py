from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


# SocialFeed: stop browser writes to server-managed poll_data and report failures safely.
path = Path("src/components/SocialFeed.tsx")
text = path.read_text()
text = replace_once(
    text,
    'import { supabase } from "@/integrations/supabase/client";\n',
    'import { supabase } from "@/integrations/supabase/client";\nimport { captureSocialError } from "@/lib/socialTelemetry";\n',
    "SocialFeed telemetry import",
)
text = replace_once(
    text,
    '    if (postsError) {\n      toast.error("Unable to load posts — please refresh the page"); console.error("fetchPosts error:", postsError);\n      setPosts([]);\n      return;\n    }',
    '    if (postsError) {\n      captureSocialError(postsError, { surface: "feed", operation: "load_posts", table: "posts" });\n      toast.error("Unable to load posts — please refresh the page");\n      setPosts([]);\n      return;\n    }',
    "SocialFeed load error",
)
text = replace_once(
    text,
    '    } catch (error) {\n      const message = error instanceof Error ? error.message : "Unable to create post";\n      toast.error(message);\n    } finally {',
    '    } catch (error) {\n      captureSocialError(error, { surface: "feed", operation: "create_post", table: "posts" });\n      toast.error("Unable to create post. Please try again.");\n    } finally {',
    "SocialFeed create error",
)
text = replace_once(
    text,
    '        .catch((err) => console.error("Comment moderation classification failed:", err));',
    '        .catch((error) => captureSocialError(error, { surface: "feed", operation: "moderate_comment" }));',
    "SocialFeed moderation error",
)

poll_pattern = re.compile(
    r"  const handlePollVote = useCallback\(async \(postId: string, optionIds: string\[\]\) => \{.*?^  \}, \[currentUserId, fetchPosts, posts\]\);",
    re.MULTILINE | re.DOTALL,
)
poll_replacement = '''  const handlePollVote = useCallback(async (postId: string, optionIds: string[]): Promise<boolean> => {
    if (!currentUserId) {
      toast.error("Sign in to vote");
      return false;
    }

    const post = posts.find((candidate) => candidate.id === postId);
    if (!post?.poll_data || optionIds.length === 0) return false;

    // poll_data totals/options are server-managed after publication. The browser
    // writes only the authenticated vote ledger; database triggers validate the
    // option ids, enforce single/multiple-choice rules, and rebuild aggregates.
    const { error } = await supabase.from("poll_votes").insert(
      optionIds.map((optionId) => ({
        poll_id: postId,
        user_id: currentUserId,
        option_id: optionId,
      }))
    );

    if (error) {
      captureSocialError(error, {
        surface: "feed",
        operation: "cast_poll_vote",
        table: "poll_votes",
      });
      toast.error("Unable to record your vote. Please try again.");
      return false;
    }

    await fetchPosts();
    return true;
  }, [currentUserId, fetchPosts, posts]);'''
text, count = poll_pattern.subn(poll_replacement, text, count=1)
if count != 1:
    raise SystemExit(f"SocialFeed poll handler: expected exactly one match, found {count}")

text = replace_once(
    text,
    "  onPollVote: (optionIds: string[]) => void;",
    "  onPollVote: (optionIds: string[]) => Promise<boolean>;",
    "SocialFeed PostCard poll prop",
)
path.write_text(text)


# PollDisplay: only show a successful vote as accepted.
path = Path("src/components/social/PollDisplay.tsx")
text = path.read_text()
text = replace_once(
    text,
    "  onVote: (optionIds: string[]) => void;",
    "  onVote: (optionIds: string[]) => Promise<boolean>;",
    "PollDisplay onVote prop",
)
text = replace_once(
    text,
    '  const handleSubmitVote = () => {\n    if (selectedOptions.size === 0) return;\n    onVote(Array.from(selectedOptions));\n    setHasVoted(true);\n  };',
    '  const handleSubmitVote = async () => {\n    if (selectedOptions.size === 0) return;\n    const accepted = await onVote(Array.from(selectedOptions));\n    if (accepted) setHasVoted(true);\n  };',
    "PollDisplay submit behavior",
)
path.write_text(text)


# StoriesBar: story_views is the source of truth; the trigger owns view_count.
path = Path("src/components/StoriesBar.tsx")
text = path.read_text()
text = replace_once(
    text,
    'import { supabase } from "@/integrations/supabase/client";\n',
    'import { supabase } from "@/integrations/supabase/client";\nimport { captureSocialError } from "@/lib/socialTelemetry";\n',
    "Stories telemetry import",
)
text = replace_once(
    text,
    '    const { data: stories } = await supabase\n      .from("stories")\n      .select("*")\n      .gt("expires_at", now)\n      .order("created_at", { ascending: false });\n\n    if (!stories?.length) { setLoading(false); return; }',
    '    const { data: stories, error: storiesError } = await supabase\n      .from("stories")\n      .select("*")\n      .gt("expires_at", now)\n      .order("created_at", { ascending: false });\n\n    if (storiesError) {\n      captureSocialError(storiesError, { surface: "stories", operation: "load_stories", table: "stories" });\n      setStoryGroups([]);\n      setLoading(false);\n      return;\n    }\n\n    if (!stories?.length) { setStoryGroups([]); setLoading(false); return; }',
    "Stories load behavior",
)
text = replace_once(
    text,
    '    const { data: profiles } = await supabase\n      .from("user_profiles")\n      .select("user_id, display_name, avatar_url, role")\n      .in("user_id", userIds);',
    '    const { data: profiles, error: profilesError } = await supabase\n      .from("user_profiles")\n      .select("user_id, display_name, avatar_url, role")\n      .in("user_id", userIds);\n\n    if (profilesError) {\n      captureSocialError(profilesError, { surface: "stories", operation: "load_story_profiles", table: "user_profiles" });\n    }',
    "Stories profile load",
)
text = replace_once(
    text,
    '      const { data: views } = await supabase\n        .from("story_views")\n        .select("story_id")\n        .eq("viewer_id", currentUserId)\n        .in("story_id", stories.map((s) => s.id));\n      viewedSet = new Set(views?.map((v) => v.story_id));',
    '      const { data: views, error: viewsError } = await supabase\n        .from("story_views")\n        .select("story_id")\n        .eq("viewer_id", currentUserId)\n        .in("story_id", stories.map((s) => s.id));\n      if (viewsError) {\n        captureSocialError(viewsError, { surface: "stories", operation: "load_story_views", table: "story_views" });\n      } else {\n        viewedSet = new Set(views?.map((v) => v.story_id));\n      }',
    "Stories views load",
)

view_pattern = re.compile(
    r'    if \(currentUserId && !currentStory\.viewed\) \{\n      supabase\.from\("story_views"\).*?^    \}',
    re.MULTILINE | re.DOTALL,
)
view_replacement = '''    if (currentUserId && !currentStory.viewed) {
      void (async () => {
        const { error } = await supabase
          .from("story_views")
          .insert({ story_id: currentStory.id, viewer_id: currentUserId });

        if (error) {
          // A duplicate view is harmless and can happen if the local viewer state
          // races a second render. Other failures are useful operational signals.
          if (error.code !== "23505") {
            captureSocialError(error, {
              surface: "stories",
              operation: "record_story_view",
              table: "story_views",
            });
          }
          return;
        }

        setStoryGroups((prev) => prev.map((group, groupIndex) => groupIndex !== activeGroupIdx ? group : {
          ...group,
          stories: group.stories.map((story) => story.id === currentStory.id
            ? { ...story, viewed: true, view_count: (story.view_count || 0) + 1 }
            : story),
          hasUnviewed: group.stories.filter((story) => story.id !== currentStory.id).some((story) => !story.viewed),
        }));
      })();
    }'''
text, count = view_pattern.subn(view_replacement, text, count=1)
if count != 1:
    raise SystemExit(f"Stories view handler: expected exactly one match, found {count}")

text = replace_once(
    text,
    '    if (error) { toast.error("Failed to post story"); return; }',
    '    if (error) {\n      captureSocialError(error, { surface: "stories", operation: "create_story", table: "stories" });\n      toast.error("Failed to post story");\n      return;\n    }',
    "Stories create error",
)
path.write_text(text)
