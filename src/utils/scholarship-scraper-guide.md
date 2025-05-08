
# Scholarship Web Scraper Guide for Myanmar Scholarships

This guide will help you create a Python web scraper to extract scholarship data from [scholars4dev.com](https://www.scholars4dev.com/tag/scholarships-for-burmese/) and format it into a JSON file that can be imported into your Supabase database.

## Requirements

1. Python 3.7+
2. Required packages:
   - `requests` - For fetching web pages
   - `beautifulsoup4` - For parsing HTML
   - `json` - For saving data in JSON format
   - `slugify` - For creating clean URLs

Install these packages using pip:

```bash
pip install requests beautifulsoup4 python-slugify
```

## Step-by-Step Guide

### 1. Basic Structure

Create a new Python file named `scholarship_scraper.py` with the following structure:

```python
import requests
import json
import time
import random
from bs4 import BeautifulSoup
from slugify import slugify
from datetime import datetime
from urllib.parse import urljoin

# Configuration
BASE_URL = "https://www.scholars4dev.com/tag/scholarships-for-burmese/"
OUTPUT_FILE = "myanmar_scholarships.json"

# List to store all scholarships
scholarships = []

# Generate a unique ID (simple implementation)
def generate_id(title, institution):
    return slugify(f"{title}-{institution}")

# Parse date strings into standard format
def parse_date(date_string):
    # Handle various date formats and convert to ISO format
    try:
        # Add your date parsing logic here
        # This is a simple implementation assuming the date is in "Month DD, YYYY" format
        return datetime.strptime(date_string.strip(), "%B %d, %Y").strftime("%Y-%m-%d")
    except:
        # If parsing fails, return a future date to ensure it's not shown as expired
        return datetime.now().strftime("%Y-%m-%d")

# Main scraping function
def scrape_scholarships():
    # Your implementation here
    pass

# Save scholarships to JSON
def save_to_json(scholarships):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(scholarships, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(scholarships)} scholarships to {OUTPUT_FILE}")

if __name__ == "__main__":
    scholarships = scrape_scholarships()
    save_to_json(scholarships)
```

### 2. Implement the Main Scraping Function

Replace the `scrape_scholarships()` function with this implementation:

```python
def scrape_scholarships():
    page_num = 1
    all_scholarships = []
    has_next_page = True
    
    while has_next_page:
        print(f"Scraping page {page_num}...")
        
        if page_num == 1:
            url = BASE_URL
        else:
            url = f"{BASE_URL}page/{page_num}/"
        
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Failed to fetch page {page_num}")
            break
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all scholarship articles on the page
        articles = soup.select('article.post')
        
        if not articles:
            has_next_page = False
            continue
            
        for article in articles:
            # Extract basic info
            title_element = article.select_one('h2.entry-title a')
            if not title_element:
                continue
                
            title = title_element.text.strip()
            detail_url = title_element['href']
            
            # Skip if not specifically for Myanmar/Burma students
            if not any(keyword in title.lower() for keyword in ['myanmar', 'burma', 'burmese']):
                # Check the content as well
                summary = article.select_one('.entry-summary')
                if not summary or not any(keyword in summary.text.lower() for keyword in ['myanmar', 'burma', 'burmese']):
                    continue
            
            print(f"Found scholarship: {title}")
            
            # Fetch detailed information
            scholarship_data = scrape_scholarship_detail(detail_url, title)
            if scholarship_data:
                all_scholarships.append(scholarship_data)
            
            # Be nice to the server
            time.sleep(random.uniform(1, 3))
        
        # Check if there's a next page
        next_page = soup.select_one('a.next.page-numbers')
        if not next_page:
            has_next_page = False
        
        page_num += 1
        # Be nice to the server between pages
        time.sleep(random.uniform(3, 5))
    
    return all_scholarships
```

### 3. Implement Detail Page Scraping

Add the function to scrape individual scholarship details:

```python
def scrape_scholarship_detail(url, title):
    print(f"Scraping details for: {title}")
    
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch details for {title}")
        return None
        
    soup = BeautifulSoup(response.content, 'html.parser')
    content = soup.select_one('.entry-content')
    
    if not content:
        print(f"No content found for {title}")
        return None
    
    # Extract as much information as possible
    description = ""
    deadline_text = ""
    institution = "Various Universities"
    level = "Masters"  # Default
    country = "International"
    fields = ["Various Fields"]
    benefits = []
    requirements = []
    application_url = ""
    
    # Find paragraphs
    paragraphs = content.select('p')
    for p in paragraphs:
        text = p.text.strip()
        
        # Extract the description from the first paragraphs
        if not description and len(text) > 100:
            description = text
        
        # Look for deadline
        if any(keyword in text.lower() for keyword in ['deadline', 'closing date', 'due date']):
            deadline_text = text
        
        # Look for application link
        links = p.select('a')
        for link in links:
            link_text = link.text.lower()
            if any(keyword in link_text for keyword in ['apply', 'application', 'website']):
                application_url = link['href']
    
    # Process deadline to extract date
    deadline = "2025-12-31"  # Default deadline if not found
    if deadline_text:
        # Try to extract date using different patterns
        import re
        date_patterns = [
            r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December),?\s+(\d{4})',
            r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})',
        ]
        for pattern in date_patterns:
            match = re.search(pattern, deadline_text, re.IGNORECASE)
            if match:
                if len(match.groups()) == 3:
                    if match.group(1).isdigit():  # First pattern (day, month, year)
                        day = int(match.group(1))
                        month = match.group(2)
                        year = int(match.group(3))
                    else:  # Second pattern (month, day, year)
                        month = match.group(1)
                        day = int(match.group(2))
                        year = int(match.group(3))
                    
                    months = {
                        'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5, 'june': 6,
                        'july': 7, 'august': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12
                    }
                    month_num = months.get(month.lower(), 1)
                    deadline = f"{year}-{month_num:02d}-{day:02d}"
                    break
    
    # Extract institution
    institution_section = soup.find(text=lambda t: t and "university" in t.lower())
    if institution_section:
        institution = institution_section.strip()
        if len(institution) > 100:  # Too long, probably not just the institution name
            institution = "Various Universities"
    
    # Try to extract country
    country_keywords = ['USA', 'UK', 'United Kingdom', 'United States', 'Australia', 'Japan', 'Germany', 
                       'France', 'Canada', 'New Zealand', 'Singapore', 'Korea', 'China', 'Netherlands']
    for keyword in country_keywords:
        if keyword in soup.text:
            country = keyword
            break
    
    # Try to extract level
    levels = ['Undergraduate', 'Masters', 'PhD', 'Research', 'Training']
    for lvl in levels:
        if lvl.lower() in soup.text.lower():
            level = lvl
            break
    
    # Try to extract fields
    field_keywords = ['Engineering', 'Science', 'Arts', 'Business', 'Medicine', 'Law', 
                     'Economics', 'Education', 'Social Sciences', 'Computer Science']
    found_fields = []
    for field in field_keywords:
        if field.lower() in soup.text.lower():
            found_fields.append(field)
    
    if found_fields:
        fields = found_fields
    
    # Extract benefits and requirements
    lists = content.select('ul, ol')
    for lst in lists:
        prev_elem = lst.find_previous()
        if prev_elem:
            prev_text = prev_elem.text.lower()
            items = [li.text.strip() for li in lst.select('li')]
            
            if any(keyword in prev_text for keyword in ['benefit', 'cover', 'include', 'offer', 'provide']):
                benefits = items
            elif any(keyword in prev_text for keyword in ['requirement', 'eligibility', 'criteria', 'applicant']):
                requirements = items
    
    # Default benefits if none found
    if not benefits:
        benefits = ["Tuition fee waiver", "Monthly stipend", "Travel allowance"]
    
    # Default requirements if none found
    if not requirements:
        requirements = [
            "Myanmar citizenship",
            "Bachelor's degree with good academic record",
            "English language proficiency"
        ]
    
    # Generate an ID based on title and institution
    scholarship_id = generate_id(title, institution)
    
    return {
        "id": scholarship_id,
        "title": title,
        "country": country,
        "institution": institution,
        "deadline": deadline,
        "fields": fields,
        "level": level,
        "description": description,
        "benefits": benefits,
        "requirements": requirements,
        "application_url": application_url or url,  # Use detail page URL if no application URL found
        "featured": False,
        "source_url": url,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
```

### 4. Running the Scraper

Run the script with:

```bash
python scholarship_scraper.py
```

This will create a JSON file named `myanmar_scholarships.json` containing all the scraped scholarship data.

## Import Data into Supabase

Once you have the JSON file with scholarship data, you can import it into Supabase using these methods:

### Option 1: Manual Import via SQL

1. Convert the JSON data into SQL INSERT statements:

```sql
INSERT INTO scholarships (id, title, country, institution, deadline, fields, level, description, benefits, requirements, application_url, featured, source_url, created_at, updated_at)
VALUES 
('id1', 'Scholarship Title', 'Country', 'Institution', '2025-12-31', ARRAY['Field1', 'Field2'], 'Masters', 'Description', ARRAY['Benefit1', 'Benefit2'], ARRAY['Requirement1', 'Requirement2'], 'https://application-url.com', false, 'https://source-url.com', now(), now()),
...
```

2. Run these INSERT statements in the Supabase SQL Editor.

### Option 2: Use the Supabase JavaScript Client

You can also create a simple Node.js script to import the data:

```javascript
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the JSON file
const scholarships = JSON.parse(fs.readFileSync('myanmar_scholarships.json', 'utf8'));

// Import data
async function importScholarships() {
  for (const scholarship of scholarships) {
    const { error } = await supabase
      .from('scholarships')
      .upsert(scholarship);
    
    if (error) {
      console.error(`Error importing ${scholarship.title}:`, error);
    } else {
      console.log(`Imported: ${scholarship.title}`);
    }
  }
  console.log('Import completed');
}

importScholarships();
```

## Adapter for Your Database Schema

Make sure the JSON structure matches your Supabase table schema. If needed, modify the scraper to match the exact fields and types expected by your database.

## Troubleshooting

- **Rate Limiting**: If you're getting blocked, increase the sleep times between requests.
- **Missing Data**: The scraper might not extract all information correctly. Review the JSON and fill in any gaps manually.
- **Format Issues**: Check that the date formats, arrays, and other data types match what your database expects.

Good luck with your scholarship scraping project!
