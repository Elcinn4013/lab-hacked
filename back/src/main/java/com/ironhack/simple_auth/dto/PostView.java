package com.ironhack.simple_auth.dto;

import com.ironhack.simple_auth.model.Post;

import java.util.List;

/**
 * What a post looks like when the feed renders it. Notice there is no email and
 * no password hash here. The public API was never meant to expose those.
 */
public record PostView(
        Long id,
        String title,
        String body,
        String authorName,
        String authorAvatar,
        List<CommentView> comments
) {
    public static PostView from(Post post) {
        String authorName = post.getAuthor() != null ? post.getAuthor().getFullName() : "Unknown";
        String authorAvatar = post.getAuthor() != null ? post.getAuthor().getAvatarUrl() : null;
        List<CommentView> comments = post.getComments().stream()
                .map(c -> new CommentView(c.getId(), c.getAuthorName(), c.getBody()))
                .toList();
        return new PostView(post.getId(), post.getTitle(), post.getBody(), authorName, authorAvatar, comments);
    }
}
