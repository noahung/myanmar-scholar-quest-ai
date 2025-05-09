
-- Create function to check if a scholarship is saved by a user
CREATE OR REPLACE FUNCTION is_scholarship_saved(p_user_id UUID, p_scholarship_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.saved_scholarships
    WHERE user_id = p_user_id
    AND scholarship_id = p_scholarship_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to save a scholarship
CREATE OR REPLACE FUNCTION save_scholarship(p_user_id UUID, p_scholarship_id TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.saved_scholarships (user_id, scholarship_id)
  VALUES (p_user_id, p_scholarship_id)
  ON CONFLICT (user_id, scholarship_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to remove a saved scholarship
CREATE OR REPLACE FUNCTION remove_saved_scholarship(p_user_id UUID, p_scholarship_id TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.saved_scholarships
  WHERE user_id = p_user_id
  AND scholarship_id = p_scholarship_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
