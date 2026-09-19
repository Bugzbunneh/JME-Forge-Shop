import { supabase } from "../lib/supabaseClient";

export interface Profile {
  id: string;
  fullName: string | null;
  isSuperUser: boolean;
  createdAt: string;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  is_super_user: boolean;
  created_at: string;
}

const fromRow = (row: ProfileRow): Profile => ({
  id: row.id,
  fullName: row.full_name,
  isSuperUser: row.is_super_user,
  createdAt: row.created_at,
});

export const fetchProfile = async (userId: string): Promise<Profile | undefined> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as ProfileRow) : undefined;
};

export const updateProfile = async (userId: string, fullName: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return fromRow(data as ProfileRow);
};
