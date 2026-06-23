# Lab: Who Got Into Our Database?

<img src="./public/main.png" width=400 />

## Introduction

You just joined the team behind **InkFeed**, a tiny community app where people who
like to draw post their work, search the feed, and leave comments. No account is
needed to read or to comment. It is small, it is friendly, and until last week
nobody thought twice about security.

Then the emails started. Several members got the exact same phishing message,
sent to the private address they only ever gave to InkFeed. One of them even
mentioned their password was "almost right". Someone has the user table.

This lab is about a skill every developer has to understand whether they write
backends or not: how an attacker turns an innocent frontend
into a database dump, and how you stop it for good. You are going to play the
attacker first, because the only way to truly understand this bug is to use it.

## The situation

Your team lead drops this in your chat and logs off for the day:

> "Ok so it looks like someone pulled our whole users table, emails and password
> hashes included, out of a system that should only ever show public posts. I do
> not have proof of how yet, just the result. Nothing in the logs looks like a
> break in, no stolen admin password, no server access. Whoever did this only
> ever talked to the same public API our website uses. That is the part that
> scares me. I need you to figure out how someone standing at the front door, with
> zero credentials, walked out with the one table we never expose. Reproduce it
> yourself, write down exactly how, then close the hole. Do not just guess at a
> fix and move on."

Our team lead is clear here: You are not done when you have a
theory. You are done when you have **reproduced the breach with your own hands**,
**documented it**, and **fixed it so it cannot happen again**.

## The app

InkFeed is two pieces that run side by side:

- **`back/`** is a Spring Boot API backed by an in-memory **H2** database. It
  serves the feed, runs the search, and stores comments. The database is rebuilt
  and re-seeded every time it starts, so you can experiment freely and never do
  permanent damage.
- **`front/`** is the Next.js app your members actually use: a feed of posts, a
  search box, and a comment form on every post.

The public API offers exactly three things:

- `GET /api/posts` gives the feed.
- `GET /api/posts/search?q=...` searches posts and returns a list of results,
  each one a `title` and a `body`.
- `POST /api/posts/{id}/comments` adds a comment.

Notice what is **not** in that list: there is no "get all users" endpoint,
nothing that returns an email, nothing that returns a password hash. The user
table is private. And yet it walked out the door. Your only job is to explain how.

## Getting started

You need **two terminals**, one for each half of the app.

**Terminal 1, the backend:**

```bash
cd back
./mvnw spring-boot:run
```

Wait until you see "Started SimpleAuthApplication". The API is now on
http://localhost:8080. (On Windows use `mvnw.cmd spring-boot:run`. You need
Java 17 or newer.) *You can also run the app on IntelliJ

**Terminal 2, the frontend:**

```bash
cd front
npm install
npm run dev
```

Open http://localhost:3000. You will see the InkFeed feed with a few posts,
their authors, and some comments. Try it like a normal user first: read a post,
leave a comment, type a word like `pen` into the search box and search. It all
just works. That is exactly how the attacker found it too.

There is also a built in database browser at http://localhost:8080/h2-console
(JDBC URL `jdbc:h2:mem:hackdb`, user `sa`, no password). Use it to see what is
really in the `users` table, the thing the public app is never supposed to reveal.
Looking at the real table will make it obvious when you have managed to leak it.

## Your job

Work through this in order. Resist the urge to jump straight to the code and
"fix something". An investigator reproduces the crime before changing the scene.

### 1. Poke at the app like an attacker, not like a user

A normal user types a word and reads the results. An attacker asks a different
question: *what is this search actually doing behind the box?* The search returns
rows with a `title` and a `body`. Start wondering where those rows come from, and
what would happen if you typed something that was not a normal word.

Try feeding the search box things that are not words. A lone quote. A quote
followed by some SQL keywords. Watch how the results change, and watch the
backend terminal for errors, because an error message is a clue, not a failure.

### 2. Reproduce the breach

Your goal for this step is concrete: make the **search box on the feed** return
data from the `users` table, including `admin@inkfeed.app` and its password hash,
all rendered as if they were normal search results.

I am not going to hand you the payload, because crafting it is the whole point.
But here are the questions that get you there, in order:

- The results come back as a `title` and a `body`. That is **two columns** the
  front end shows you (there is a hidden id too). What SQL feature lets you glue a
  second query's rows onto the first query's results, as long as the column counts
  line up?
- The search puts your text straight into a `WHERE ... LIKE '%yourtext%'` clause.
  What would you have to type to *close* that string early and start writing your
  own SQL?
- Once you are writing your own SQL, how do you make the rest of the original
  query (everything after your injection) just disappear so the database does not
  choke on it?

When the email and password hash of the admin show up inside the InkFeed search
results in the browser, you have reproduced the breach. Screenshot it.

### 3. Write it down

Open `NOTES.md` and fill it in **as you go**, not at the end. We value your work, not what AI thinks. 
The exact payload you used, what each part of it
does, and what you got back. If you cannot explain *why* your payload works, you
have not finished this step.

### 4. Close the hole

Now, and only now, open the backend code and find the line responsible. The
search lives in the controller under
`back/src/main/java/com/ironhack/simple_auth/controller/`. Read how it builds the
query. You will know the bad line when you see it.

Then fix it so the exact same payload from step 2 returns zero results (or just
the posts that genuinely match), and the user table stays where it belongs. There
is more than one way to do this. Pick your fix **on purpose**, see the decision
point below before you commit to one.

### 5. Prove the fix

Re-run your attack from step 2 against the fixed backend. It must fail now. The
normal search (`pen`, `color`, `comic`) must still work. Confirm both.

## 💡 The decision point

When developers first meet SQL injection, the tempting fix is to play whack a
mole with the input: strip out quotes, ban the word `UNION`, reject anything with
two dashes. This is called blocklisting, and it is the **wrong** fix. There is
always another encoding, another keyword, another trick you did not think of, and
meanwhile a member named `O'Brien` can no longer search for their own posts.

The right fix attacks the root cause: the query was built by **gluing untrusted
text into a SQL string**. The database had no way to tell your data apart from
your commands. The professional answer is to never build SQL that way. Let the
database receive the query and the values **separately**, so the value can never
change the shape of the query. That is what a parameterized query (also called a
prepared statement) does for you.

In this project you have at least two clean roads to that:

- Use a real **parameterized query** for the native SQL (bind the search term as
  a parameter instead of concatenating it).
- Or skip native SQL entirely and let the repository do the work. Look inside
  `back/.../repository/PostRepository.java`. There may already be a safe, derived
  query method sitting there, unused, quietly judging the controller. 🤨

Decide which road you are taking and say why in `NOTES.md`. "I made the error go
away" is not a reason. "Data can no longer be interpreted as code because..." is.

## How to work through this

1. Read the lesson on SQL injection in the student portal first. Come back with
   the words "parameterized query" and "UNION" in your head.
2. Get both halves running and use the app normally so you know what *correct*
   looks like.
3. Open the H2 console and look at the real `users` table, so you know what
   stolen data looks like when it appears where it should not.
4. Break the search box on purpose. Go slow, change one thing at a time.
5. Only after you have reproduced the breach, open the backend and fix it.
6. Attack your own fix. A fix you did not try to break is just a hope.

## Styling

The front end already uses Tailwind. You do not need to touch the styling for
this lab. If the leaked data shows up looking like a normal post card, that is
the styling doing its job, and it is exactly what made the breach so quiet.

## Checklist before you call it done

✅ You can run the original attack and watch the `users` table (emails and the
admin password hash) appear inside the InkFeed search results.

✅ `NOTES.md` contains your exact payload and a clear explanation of why each
part of it works.

✅ You fixed the vulnerability at its root with a parameterized query or the safe
repository method, not by blocklisting characters or keywords.

✅ After the fix, the same attack returns no user data, and a normal search
(`pen`, `color`) still returns the right posts.

✅ Commenting on a post still works.

✅ No errors in the browser console, and no leaked stack traces in the backend
terminal during normal use.

## If you finish early

✅ The comment endpoint also takes raw input from anyone. Convince yourself it is
safe (or not) and explain why in `NOTES.md`.

✅ Try a blind version of the attack: without using the results on screen, can
you confirm whether a user with the email `admin@inkfeed.app` exists, using only
true/false behavior from the search?

✅ Harden the backend further. Should the API ever be able to read password
hashes at all? Read about the principle of least privilege.

✅ Add server side input validation as a second layer of defense, on top of (never
instead of) the parameterized query.

## Key concepts to review

- **SQL injection**: what it is, and why string concatenation into a query is the
  root cause (start with the OWASP SQL Injection page).
- **Parameterized queries / prepared statements**: how separating the query from
  its values makes injection impossible.
- **UNION based injection**: how an attacker reads other tables through one input.
- **Spring Data JPA**: native queries versus derived repository methods, and why
  the derived methods are safe by default.
- **Defense in depth and least privilege**: why the fix is the database boundary,
  not the input filter, and why secrets should not be reachable in the first place.

## Delivering the lab

Open a pull request with your fix and your completed `NOTES.md`, then share the PR
link in the students portal. Make sure your `NOTES.md` clearly tells the story:
how they got in, the proof you reproduced, and how you closed the door.
