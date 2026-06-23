package com.ironhack.simple_auth.repository;

import com.ironhack.simple_auth.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
