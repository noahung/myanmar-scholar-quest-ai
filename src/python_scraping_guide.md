
# Python Web Scraping Guide for Scholar-M

This guide will help you create a Python script to scrape scholarship data from scholars4dev.com for Myanmar students and format it for use in Supabase.

## Prerequisites

1. Python 3.6+ installed
2. Required libraries: `requests`, `beautifulsoup4`, `pandas` (for data manipulation)

Install these libraries using pip:
```bash
pip install requests beautifulsoup4 pandas
```

## Step-by-Step Web Scraper Implementation

Here's a complete Python script to scrape scholarship data from scholars4dev.com:

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import re
import time
import random
import uuid
from datetime import datetime

class ScholarshipScraper:
    def __init__(self):
        self.base_url = "https://www.scholars4dev.com/tag/scholarships-for-burmese/"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.scholarships = []
    
    def get_page_content(self, url):
        """Fetch webpage content with error handling and rate limiting"""
        try:
            # Add a random delay between requests (1-3 seconds)
            time.sleep(random.uniform(1, 3))
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()  # Raise exception for HTTP errors
            return response.text
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def parse_pagination(self):
        """Get all paginated URLs to scrape"""
        content = self.get_page_content(self.base_url)
        if not content:
            return []
        
        soup = BeautifulSoup(content, 'html.parser')
        pagination = soup.find('div', class_='wp-pagenavi')
        
        if not pagination:
            return [self.base_url]  # No pagination, just one page
        
        pages = []
        for page_link in pagination.find_all('a', class_='page'):
            if page_link.text.isdigit():
                pages.append(int(page_link.text))
        
        # Generate URLs for all pages
        page_urls = [self.base_url]
        max_page = max(pages) if pages else 1
        
        for i in range(2, max_page + 1):
            page_urls.append(f"{self.base_url}/page/{i}/")
        
        return page_urls
    
    def extract_scholarship_links(self, page_url):
        """Extract links to individual scholarship pages from a listing page"""
        content = self.get_page_content(page_url)
        if not content:
            return []
        
        soup = BeautifulSoup(content, 'html.parser')
        articles = soup.find_all('article')
        
        scholarship_links = []
        for article in articles:
            h2_tag = article.find('h2', class_='entry-title')
            if h2_tag and h2_tag.a and h2_tag.a.get('href'):
                scholarship_links.append(h2_tag.a.get('href'))
        
        return scholarship_links
    
    def parse_scholarship_details(self, url):
        """Extract detailed information from a scholarship page"""
        content = self.get_page_content(url)
        if not content:
            return None
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Initialize scholarship data
        scholarship = {
            'id': str(uuid.uuid4()),
            'title': '',
            'country': '',
            'institution': '',
            'deadline': '',
            'fields': [],
            'level': '',
            'description': '',
            'benefits': [],
            'requirements': [],
            'application_url': '',
            'featured': False,
            'source_url': url,
            'image_url': '',
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        # Extract title
        title_tag = soup.find('h1', class_='entry-title')
        if title_tag:
            scholarship['title'] = title_tag.text.strip()
        
        # Extract content
        content_div = soup.find('div', class_='entry-content')
        if not content_div:
            return None
        
        # Extract description (first paragraph)
        first_p = content_div.find('p')
        if first_p:
            scholarship['description'] = first_p.text.strip()
        
        # Extract image if available
        img = content_div.find('img')
        if img and img.get('src'):
            scholarship['image_url'] = img.get('src')
        
        # Extract country from title or content
        country_patterns = [
            r'in\s+([A-Za-z\s]+)(?:\s+University|\s+College|\s+Institute|\s+for|$)',
            r'at\s+([A-Za-z\s]+)(?:\s+University|\s+College|\s+Institute|$)',
            r'([A-Za-z]+)\s+(?:Scholarships|Scholarship|Government)'
        ]
        
        for pattern in country_patterns:
            if 'title' in scholarship:
                match = re.search(pattern, scholarship['title'])
                if match:
                    scholarship['country'] = match.group(1).strip()
                    break
        
        # If country not found, try some common countries from content
        if not scholarship['country']:
            for country in ['USA', 'UK', 'Australia', 'Japan', 'Germany', 'Canada', 'Netherlands', 'Sweden', 'Singapore']:
                if country.lower() in scholarship['description'].lower():
                    scholarship['country'] = country
                    break
        
        # Extract institution from title or content
        institution_pattern = r'(?:at|from|by)\s+(?:the\s+)?([A-Za-z\s&]+(?:University|College|Institute|School))'
        match = re.search(institution_pattern, scholarship['title'])
        if match:
            scholarship['institution'] = match.group(1).strip()
        else:
            # Check content for university names
            content_text = content_div.text.lower()
            uni_pattern = r'(?:at|from|by)\s+(?:the\s+)?([A-Za-z\s&]+(?:university|college|institute|school))'
            match = re.search(uni_pattern, content_text, re.IGNORECASE)
            if match:
                scholarship['institution'] = match.group(1).title().strip()
            else:
                scholarship['institution'] = "Various Universities"
        
        # Extract level (degree)
        level_keywords = {
            'Undergraduate': ['bachelor', 'undergraduate', 'BS', 'BA', 'B.Sc', 'B.A'],
            'Masters': ['master', 'MS', 'MA', 'M.Sc', 'M.A', 'graduate', 'postgraduate'],
            'PhD': ['phd', 'doctorate', 'doctoral', 'Ph.D'],
            'Research': ['research', 'fellowship'],
            'Training': ['training', 'internship', 'non-degree']
        }
        
        content_text = content_div.text.lower()
        for level, keywords in level_keywords.items():
            if any(keyword.lower() in content_text for keyword in keywords):
                scholarship['level'] = level
                break
        
        if not scholarship['level']:
            scholarship['level'] = 'Masters'  # Default to Masters if not found
        
        # Extract fields of study
        field_keywords = [
            'Engineering', 'Computer Science', 'IT', 'Business', 'Economics', 'Science', 
            'Arts', 'Humanities', 'Mathematics', 'Medicine', 'Law', 'Health', 
            'Education', 'Social Sciences', 'Environmental Studies', 'Agriculture'
        ]
        
        found_fields = []
        for field in field_keywords:
            if field.lower() in content_text or field in content_div.text:
                found_fields.append(field)
        
        if not found_fields:
            found_fields = ['All fields available']
        
        scholarship['fields'] = found_fields
        
        # Extract deadline
        deadline_pattern = r'(?:Deadline|Application Deadline|Closing Date)(?:\sis|\:)?\s*([A-Za-z0-9\s,]+\d{4})'
        match = re.search(deadline_pattern, content_div.text, re.IGNORECASE)
        
        if match:
            deadline_str = match.group(1).strip()
            # Try to convert to a standardized format (YYYY-MM-DD)
            try:
                # Multiple date format attempts
                date_formats = [
                    '%B %d, %Y',
                    '%B %d %Y',
                    '%d %B %Y',
                    '%d %B, %Y',
                    '%d-%b-%Y',
                    '%Y-%m-%d'
                ]
                
                parsed_date = None
                for date_format in date_formats:
                    try:
                        parsed_date = datetime.strptime(deadline_str, date_format)
                        break
                    except ValueError:
                        continue
                
                if parsed_date:
                    scholarship['deadline'] = parsed_date.strftime('%Y-%m-%d')
                else:
                    # If we can't parse, use the original string
                    scholarship['deadline'] = deadline_str
            except:
                # If date parsing fails, use original string
                scholarship['deadline'] = deadline_str
        else:
            # If no deadline found, set a default future deadline
            next_year = datetime.now().year + 1
            scholarship['deadline'] = f"{next_year}-05-31"
        
        # Extract benefits
        benefits_section = None
        for h2 in content_div.find_all(['h2', 'h3', 'strong']):
            if h2.text and any(keyword in h2.text.lower() for keyword in ['benefit', 'coverage', 'offer', 'include', 'provide']):
                benefits_section = h2.find_next('ul')
                break
        
        if benefits_section:
            benefits = [li.text.strip() for li in benefits_section.find_all('li')]
            if benefits:
                scholarship['benefits'] = benefits
        
        # If no structured benefits found, look for common benefit terms
        if not scholarship['benefits']:
            benefit_terms = ['tuition', 'stipend', 'allowance', 'accommodation', 'airfare', 'fee', 'waiver', 'grant']
            extracted_benefits = []
            
            for p in content_div.find_all('p'):
                for term in benefit_terms:
                    if term in p.text.lower():
                        extracted_benefits.append(p.text.strip())
                        break
            
            if extracted_benefits:
                scholarship['benefits'] = list(set(extracted_benefits))
            else:
                # Default benefits
                scholarship['benefits'] = [
                    "Scholarship details available on the official website",
                    "Check the official link for complete benefits package"
                ]
        
        # Extract requirements
        requirements_section = None
        for h2 in content_div.find_all(['h2', 'h3', 'strong']):
            if h2.text and any(keyword in h2.text.lower() for keyword in ['requirement', 'eligibility', 'criteria', 'applicant']):
                requirements_section = h2.find_next('ul')
                break
        
        if requirements_section:
            requirements = [li.text.strip() for li in requirements_section.find_all('li')]
            if requirements:
                scholarship['requirements'] = requirements
        
        # If no structured requirements found, look for common requirement terms
        if not scholarship['requirements']:
            requirement_terms = ['must be', 'applicants should', 'eligible', 'qualify', 'gpa', 'test', 'citizen']
            extracted_requirements = []
            
            for p in content_div.find_all('p'):
                for term in requirement_terms:
                    if term in p.text.lower():
                        extracted_requirements.append(p.text.strip())
                        break
            
            if extracted_requirements:
                scholarship['requirements'] = list(set(extracted_requirements))
            else:
                # Default requirements
                scholarship['requirements'] = [
                    "Myanmar citizenship",
                    "Check the official link for complete eligibility requirements"
                ]
        
        # Extract application link
        apply_links = []
        for a in content_div.find_all('a'):
            if a.text and any(keyword in a.text.lower() for keyword in ['apply', 'application', 'official', 'website']):
                apply_links.append(a.get('href'))
        
        if apply_links:
            scholarship['application_url'] = apply_links[0]
        else:
            # If no application link found, use source URL
            scholarship['application_url'] = url
        
        # Mark featured for prestigious scholarships
        prestigious_keywords = ['fulbright', 'chevening', 'erasmus', 'commonwealth', 'gates', 'rhodes']
        scholarship['featured'] = any(keyword in scholarship['title'].lower() for keyword in prestigious_keywords)
        
        return scholarship
    
    def scrape(self):
        """Main method to scrape all scholarship data"""
        page_urls = self.parse_pagination()
        
        print(f"Found {len(page_urls)} pages to scrape")
        scholarship_links = []
        
        for page_url in page_urls:
            print(f"Scraping links from {page_url}")
            page_links = self.extract_scholarship_links(page_url)
            scholarship_links.extend(page_links)
            print(f"Found {len(page_links)} scholarship links on this page")
        
        print(f"Total of {len(scholarship_links)} scholarship links found")
        
        for link in scholarship_links:
            print(f"Scraping details from {link}")
            scholarship = self.parse_scholarship_details(link)
            if scholarship:
                self.scholarships.append(scholarship)
        
        print(f"Successfully scraped {len(self.scholarships)} scholarships")
    
    def save_to_json(self, filename="scholarships.json"):
        """Save scholarships to a JSON file for Supabase import"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.scholarships, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(self.scholarships)} scholarships to {filename}")
    
    def save_to_csv(self, filename="scholarships.csv"):
        """Save scholarships to CSV file"""
        df = pd.DataFrame(self.scholarships)
        df.to_csv(filename, index=False)
        print(f"Saved {len(self.scholarships)} scholarships to {filename}")


# Run the scraper
if __name__ == "__main__":
    scraper = ScholarshipScraper()
    scraper.scrape()
    scraper.save_to_json()
    scraper.save_to_csv()
```

## How to Run the Scraper

1. Save the script to a file named `scholarship_scraper.py`
2. Run the script:
   ```bash
   python scholarship_scraper.py
   ```
3. The script will generate two files:
   - `scholarships.json` - Use this to import data into Supabase
   - `scholarships.csv` - For review and backup

## Importing Data into Supabase

### Method 1: Using the Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select the "scholarships" table
4. Click "Import" and select the generated JSON file
5. Map the columns accordingly and import

### Method 2: Using Supabase API

You can also write a Python script to import the data using the Supabase API:

```python
import json
from supabase import create_client, Client

# Load your Supabase credentials
url = "YOUR_SUPABASE_URL"
key = "YOUR_SUPABASE_KEY"
supabase: Client = create_client(url, key)

# Load the scholarships from JSON file
with open('scholarships.json', 'r', encoding='utf-8') as f:
    scholarships = json.load(f)

# Import scholarships in batches (to avoid API limits)
batch_size = 20
for i in range(0, len(scholarships), batch_size):
    batch = scholarships[i:i+batch_size]
    response = supabase.table('scholarships').insert(batch).execute()
    print(f"Imported batch {i//batch_size + 1}, status: {response}")
```

## Additional Tips

1. **Rate Limiting**: The script includes random delays to avoid being blocked. You can adjust the delay in `get_page_content()`.

2. **Data Cleaning**: Review the CSV file before importing to ensure data quality. You may need to fix some fields manually.

3. **Media Handling**: The script extracts image URLs when available but doesn't download them. If you want to store images in Supabase Storage, you'll need to:
   - Download the images
   - Upload them to Supabase Storage
   - Update the image_url field with the Supabase Storage URL

4. **Error Handling**: The script includes basic error handling, but you may want to enhance it for more robustness.

5. **Scheduled Updates**: Consider setting up a scheduled task to run this scraper periodically to keep your scholarships database updated.

This script is designed to extract as much structured information as possible, but web scraping is inherently imprecise. You may need to review and enhance the data manually for the best results.
