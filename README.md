# Instagram Database and Supabase Edge Function

## Project Overview

This project implements a simplified Instagram-style backend using Supabase. It stores user profiles, posts, likes, and comments in a PostgreSQL database and uses a Supabase Edge Function to handle API requests.

## Technologies Used

- **Supabase** – Backend platform
- **PostgreSQL** – Relational database
- **Deno and TypeScript** – Edge Function runtime and programming language
- **Supabase JavaScript Client** – Database operations

## Database Design

The database contains four tables:

### 1. Profiles
Stores user information.

- `id` – Unique profile ID
- `username` – Unique username
- `full_name` – User's full name
- `bio` – Profile biography
- `avatar_url` – Profile picture URL
- `created_at` – Profile creation timestamp

### 2. Posts
Stores posts created by users.

- `id` – Unique post ID
- `user_id` – References the profile that created the post
- `caption` – Post caption
- `image_url` – Image URL
- `created_at` – Post creation timestamp

### 3. Likes
Stores likes on posts.

- `user_id` – Profile that liked a post
- `post_id` – Post that received the like
- `created_at` – Like timestamp

The combination of `user_id` and `post_id` is the primary key, preventing the same profile from liking the same post more than once.

### 4. Comments
Stores comments on posts.

- `id` – Unique comment ID
- `user_id` – Profile that wrote the comment
- `post_id` – Post being commented on
- `content` – Comment text
- `created_at` – Comment timestamp

## Database Relationships

- One profile can create multiple posts.
- One profile can write multiple comments.
- One post can have multiple comments.
- Profiles and posts have a many-to-many relationship through the likes table.

Row Level Security (RLS) is enabled on all four tables.

## Supabase Edge Function

Function name: `instagram-api`

File location: `supabase/functions/instagram-api/index.ts`

The function currently supports two actions:

### 1. List Posts

Request body:

```json
{
  "action": "list_posts"
}
```

Retrieves posts with their associated profile information, ordered from newest to oldest.

### 2. Create a Post

Request body:

```json
{
  "action": "create_post",
  "user_id": "YOUR_PROFILE_UUID",
  "caption": "My first Instagram-style post!",
  "image_url": "https://example.com/image.jpg"
}
```

Replace `YOUR_PROFILE_UUID` with an existing profile ID from the database. The image URL is optional.

The function validates the profile UUID, caption, and image URL before inserting a post.

## Testing

The Edge Function can be tested from the Supabase Dashboard using a POST request.

Test the `list_posts` action to retrieve existing posts. Test `create_post` with an existing profile UUID to insert a new post.

## Project Structure

```text
instagram-supabase-backend/
├── README.md
├── database/
│   └── schema.sql
├── supabase/
│   └── functions/
│       └── instagram-api/
│           └── index.ts
└── screenshots/
```

## Limitations

This is an educational project. The current Edge Function uses the Supabase service-role key on the server and accepts a profile ID from the request body. A production application would need authentication and authorization checks to ensure users can only create posts as themselves.

## Conclusion

This project demonstrates relational database design, primary and foreign keys, database relationships, Row Level Security configuration, input validation, and API development using a Supabase Edge Function.