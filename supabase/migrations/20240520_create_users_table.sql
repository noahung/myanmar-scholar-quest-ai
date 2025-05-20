-- Create the users table required by Supabase Auth
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL PRIMARY KEY,
    email text,
    encrypted_password text,
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token text,
    confirmation_sent_at timestamp with time zone,
    recovery_token text,
    recovery_sent_at timestamp with time zone,
    email_change_token_new text,
    email_change text,
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text,
    phone_confirmed_at timestamp with time zone,
    phone_change text,
    phone_change_token text,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_token_current text,
    banned_until timestamp with time zone,
    reauthentication_token text,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamp with time zone
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users (email);
CREATE INDEX IF NOT EXISTS users_phone_idx ON auth.users (phone);
CREATE INDEX IF NOT EXISTS users_confirmation_token_idx ON auth.users (confirmation_token);
CREATE INDEX IF NOT EXISTS users_recovery_token_idx ON auth.users (recovery_token);
CREATE INDEX IF NOT EXISTS users_email_change_token_current_idx ON auth.users (email_change_token_current);
CREATE INDEX IF NOT EXISTS users_email_change_token_new_idx ON auth.users (email_change_token_new);
CREATE INDEX IF NOT EXISTS users_phone_change_token_idx ON auth.users (phone_change_token);
CREATE INDEX IF NOT EXISTS users_reauthentication_token_idx ON auth.users (reauthentication_token);

-- Add RLS policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" ON auth.users
    FOR SELECT
    USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON auth.users
    FOR UPDATE
    USING (auth.uid() = id); 