import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";

export type StoredResponse = {
  id: string;
  movie: string;
  note: string | null;
  user_agent: string | null;
  created_at: string;
};

const localFile = path.join("/tmp", "movie-date-responses.json");

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false
    }
  });
}

async function readLocalResponses(): Promise<StoredResponse[]> {
  try {
    const content = await fs.readFile(localFile, "utf8");
    return JSON.parse(content) as StoredResponse[];
  } catch {
    return [];
  }
}

export async function saveResponse(input: {
  movie: string;
  note?: string;
  userAgent?: string | null;
}) {
  const response: StoredResponse = {
    id: crypto.randomUUID(),
    movie: input.movie,
    note: input.note?.trim() || null,
    user_agent: input.userAgent || null,
    created_at: new Date().toISOString()
  };

  const supabase = getSupabaseClient();

  if (supabase) {
    const { error } = await supabase.from("responses").insert({
      movie: response.movie,
      note: response.note,
      user_agent: response.user_agent
    });

    if (error) {
      throw error;
    }

    return response;
  }

  const responses = await readLocalResponses();
  responses.unshift(response);
  await fs.writeFile(localFile, JSON.stringify(responses, null, 2));
  return response;
}

export async function listResponses(): Promise<StoredResponse[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("responses")
      .select("id,movie,note,user_agent,created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return data || [];
  }

  return readLocalResponses();
}
