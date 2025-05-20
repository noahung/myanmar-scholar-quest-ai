-- Create custom_css table
CREATE TABLE IF NOT EXISTS custom_css (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    css TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Only allow one row in the table
CREATE UNIQUE INDEX IF NOT EXISTS custom_css_single_row ON custom_css ((true));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_custom_css_updated_at
    BEFORE UPDATE ON custom_css
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 