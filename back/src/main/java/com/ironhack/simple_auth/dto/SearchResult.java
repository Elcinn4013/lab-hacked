package com.ironhack.simple_auth.dto;

/**
 * One row returned by the search endpoint. It carries exactly three columns:
 * id, title, body. The feed renders each one as a result card.
 *
 * Keep that column count in mind. A row is a row, and the front end will happily
 * render whatever three values come back, no matter which table they came from.
 */
public record SearchResult(Object id, String title, String body) {
}
