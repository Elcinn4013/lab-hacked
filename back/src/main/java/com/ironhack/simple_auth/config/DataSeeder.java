package com.ironhack.simple_auth.config;

import com.ironhack.simple_auth.model.Comment;
import com.ironhack.simple_auth.model.Post;
import com.ironhack.simple_auth.model.User;
import com.ironhack.simple_auth.repository.CommentRepository;
import com.ironhack.simple_auth.repository.PostRepository;
import com.ironhack.simple_auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Fills the in-memory database on every startup: a handful of real-looking
 * members (free avatar photos from pravatar.cc), some posts, and a few comments.
 *
 * The "secret" the public API should never reveal lives in the users table:
 * private emails and password hashes, including an admin account.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public DataSeeder(UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // --- Members. Real names, free faces, and credentials that must stay put. ---
        User maya = userRepository.save(new User(
                "Maya Thompson", "maya.thompson@inkfeed.app",
                "https://i.pravatar.cc/150?img=5",
                "$2a$10$Qe7kI3yE8mZ1cT0vJ9oQ1uPb5sYxKfM2nR4hVjLwA6dCtB8oNqW2", "user"));

        User leo = userRepository.save(new User(
                "Leo Fernandez", "leo.fernandez@inkfeed.app",
                "https://i.pravatar.cc/150?img=12",
                "$2a$10$9aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abcdefghijklmnoPq", "user"));

        User priya = userRepository.save(new User(
                "Priya Nair", "priya.nair@inkfeed.app",
                "https://i.pravatar.cc/150?img=32",
                "$2a$10$kLmNoPqRsTuVwXyZ0123456abCDefGHijKLmnOPqrSTuvWXyz12abcd", "user"));

        User sam = userRepository.save(new User(
                "Samuel Okafor", "samuel.okafor@inkfeed.app",
                "https://i.pravatar.cc/150?img=14",
                "$2a$10$ZyXwVuTsRqPoNmLkJiHgFeDcBa9876543210zyxwvuTSRQponmLKjih", "user"));

        User hana = userRepository.save(new User(
                "Hana Kim", "hana.kim@inkfeed.app",
                "https://i.pravatar.cc/150?img=47",
                "$2a$10$AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMnOpQrSt", "user"));

        // The trophy. Whoever pulls this row out of a public search endpoint owns the app.
        User admin = userRepository.save(new User(
                "Dana Wexler", "admin@inkfeed.app",
                "https://i.pravatar.cc/150?img=68",
                "$2a$10$7Qx3rF0kV9pLmN2sT1uWc._aDfGhJkLpQrStUvWxYz0AbCdEfGhIjK", "admin"));

        // --- Posts ---
        Post p1 = postRepository.save(new Post(
                "Sketchbook tour: 30 days of ink",
                "Finally finished my daily ink challenge. Swipe through to see how the linework got looser by week three.",
                maya));

        Post p2 = postRepository.save(new Post(
                "What pen do you swear by?",
                "I keep going back to the same fineliner but I want to branch out. What is in your pencil case right now?",
                leo));

        Post p3 = postRepository.save(new Post(
                "Color theory broke my brain (in a good way)",
                "Spent the weekend on complementary palettes. Sharing the three that finally clicked for me.",
                priya));

        Post p4 = postRepository.save(new Post(
                "Timelapse: portrait from blank page to finish",
                "Two hours compressed into forty seconds. The eyes took longer than everything else combined.",
                sam));

        Post p5 = postRepository.save(new Post(
                "Looking for feedback on my comic panels",
                "First time laying out a full page. Be honest about the pacing, I can take it.",
                hana));

        // --- Comments. No account needed, anyone can chime in. ---
        commentRepository.saveAll(List.of(
                new Comment("Leo Fernandez", "Week three really does look different. Love it.", p1),
                new Comment("Anonymous", "This is so inspiring, starting my own challenge tomorrow.", p1),
                new Comment("Priya Nair", "A good fineliner plus a brush pen for fills, never fails me.", p2),
                new Comment("Hana Kim", "That third palette is gorgeous, what are the hex codes?", p3),
                new Comment("Maya Thompson", "The eyes are always the boss fight. Came out great.", p4),
                new Comment("Anonymous", "Pacing feels solid, maybe give panel four more room to breathe.", p5)
        ));
    }
}
