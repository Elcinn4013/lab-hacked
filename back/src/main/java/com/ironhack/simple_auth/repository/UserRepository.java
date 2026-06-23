package com.ironhack.simple_auth.repository;

import com.ironhack.simple_auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
