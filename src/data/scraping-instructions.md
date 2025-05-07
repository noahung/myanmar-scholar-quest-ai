
# Scholarship Scraping Instructions

This document outlines the process for scraping scholarship data from scholars4dev.com and preparing it for the Scholar-M application.

## Data Structure

Your Python scraper should collect the following data for each scholarship:

```python
{
    "id": "unique_id_string",  # Can be auto-generated UUID
    "title": "Scholarship Title",
    "country": "Country Name",
    "institution": "University or Organization Name",
    "deadline": "YYYY-MM-DD",  # ISO format date
    "fields": ["Field1", "Field2"],  # Array of study fields/disciplines
    "level": "Masters",  # One of: "Undergraduate", "Masters", "PhD", "Research", "Training"
    "description": "Full description...",
    "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],  # Array of benefits
    "requirements": ["Requirement 1", "Requirement 2"],  # Array of requirements
    "application_url": "https://...",  # Direct link to apply
    "featured": False,  # Boolean flag for featured scholarships
    "source_url": "https://www.scholars4dev.com/...",  # Original page URL
    "image_url": "https://...",  # Optional image URL
}
```

## Scraping Process

1. Start at https://www.scholars4dev.com/tag/scholarships-for-burmese/
2. For each scholarship listing:
   - Extract the title and link
   - Visit each individual scholarship page
   - Extract all required information
   - Parse deadline dates into ISO format (YYYY-MM-DD)
   - Categorize degree level based on content
   - Parse benefits and requirements into separate arrays
3. Handle pagination to collect all available scholarships
4. Generate a unique ID for each scholarship

## Tips for Extraction

- **Title**: Usually the `h1` or main heading of the page
- **Deadline**: Look for text containing "deadline", "applications close", etc.
- **Fields**: Often mentioned in eligibility or under "fields of study"
- **Level**: Look for terms like "undergraduate", "masters", "PhD", etc.
- **Benefits**: Usually under headings like "scholarship benefits", "coverage", "what's included"
- **Requirements**: Usually under "eligibility", "requirements", "who can apply"

## Data Cleaning Recommendations

- Normalize country names (e.g., "UK", "United Kingdom", "U.K." should all be "United Kingdom")
- Format deadlines consistently
- Remove HTML tags from description text
- Ensure all required fields are present
- Handle special characters properly

## Uploading to Supabase

After scraping and processing, upload the data to Supabase using the Python SDK:

```python
import json
import supabase

# Initialize Supabase client
supabase_url = "YOUR_SUPABASE_URL"
supabase_key = "YOUR_SUPABASE_KEY"
client = supabase.create_client(supabase_url, supabase_key)

# Load your scraped data
with open('scholarships.json', 'r') as f:
    scholarships = json.load(f)

# Upload each scholarship
for scholarship in scholarships:
    result = client.table('scholarships').insert(scholarship).execute()
    print(f"Uploaded: {scholarship['title']}")
```

## Schedule Regular Updates

Consider setting up a scheduled task (using tools like cron, GitHub Actions, or AWS Lambda) to run your scraper weekly or monthly to capture new scholarships and update deadlines.
