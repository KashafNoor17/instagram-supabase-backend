
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const jsonResponse = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  try {
    if (req.method !== "POST") {
      return jsonResponse(
        { error: "Use the POST method." },
        405
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse(
        { error: "Server configuration is missing." },
        500
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const body = await req.json();
    const action = body.action;

    // Retrieve posts with profile information
    if (action === "list_posts") {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          caption,
          image_url,
          created_at,
          profiles!posts_user_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        return jsonResponse({ error: error.message }, 400);
      }

      return jsonResponse({
        message: "Posts retrieved successfully.",
        posts: data,
      });
    }

    // Create a new post
    if (action === "create_post") {
      const userId = body.user_id;
      const caption = body.caption;
      const imageUrl = body.image_url ?? null;

      const validUUID =
        typeof userId === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          userId
        );

      if (!validUUID) {
        return jsonResponse(
          { error: "A valid profile UUID is required." },
          400
        );
      }

      if (
        typeof caption !== "string" ||
        caption.trim().length === 0 ||
        caption.length > 2200
      ) {
        return jsonResponse(
          { error: "Caption must be 1–2200 characters." },
          400
        );
      }

      if (
        imageUrl !== null &&
        (typeof imageUrl !== "string" ||
          imageUrl.length > 2048 ||
          !/^https?:\/\/\S+$/i.test(imageUrl))
      ) {
        return jsonResponse(
          { error: "Image URL must be a valid HTTP(S) URL." },
          400
        );
      }

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: userId,
          caption: caption.trim(),
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) {
        return jsonResponse({ error: error.message }, 400);
      }

      return jsonResponse(
        {
          message: "Post created successfully.",
          post: data,
        },
        201
      );
    }

    return jsonResponse(
      {
        error: "Unknown action.",
        supported_actions: ["list_posts", "create_post"],
      },
      400
    );
  } catch {
    return jsonResponse(
      { error: "Invalid request or unexpected server error." },
      400
    );
  }
});
