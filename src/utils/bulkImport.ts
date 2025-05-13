
import { supabase, bulkImportScholarships } from "@/integrations/supabase/client";
import { Scholarship } from "@/pages/Scholarships";

/**
 * Process and import a JSON file containing scholarship data
 * @param file The JSON file to process
 * @returns Result of the import operation
 */
export async function processScholarshipImport(file: File): Promise<{success: boolean; message: string}> {
  try {
    // Validate file type
    if (file.type !== "application/json") {
      return { success: false, message: "Only JSON files are supported" };
    }
    
    // Read file contents
    const text = await file.text();
    let scholarships: Scholarship[];
    
    try {
      scholarships = JSON.parse(text);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return { success: false, message: "Invalid JSON format" };
    }
    
    // Validate array
    if (!Array.isArray(scholarships)) {
      return { success: false, message: "JSON must contain an array of scholarships" };
    }
    
    // Ensure each scholarship has an ID and convert fields, benefits, requirements to arrays if needed
    const formattedScholarships = scholarships.map(scholarship => {
      // Process fields array
      let fieldsArray: string[] = [];
      if (Array.isArray(scholarship.fields)) {
        fieldsArray = scholarship.fields;
      } else if (typeof scholarship.fields === 'string') {
        fieldsArray = scholarship.fields.split(',').map(f => f.trim()).filter(Boolean);
      }
      
      // Process benefits array
      let benefitsArray: string[] = [];
      if (Array.isArray(scholarship.benefits)) {
        benefitsArray = scholarship.benefits;
      } else if (typeof scholarship.benefits === 'string') {
        benefitsArray = scholarship.benefits.split(',').map(b => b.trim()).filter(Boolean);
      }
      
      // Process requirements array
      let requirementsArray: string[] = [];
      if (Array.isArray(scholarship.requirements)) {
        requirementsArray = scholarship.requirements;
      } else if (typeof scholarship.requirements === 'string') {
        requirementsArray = scholarship.requirements.split(',').map(r => r.trim()).filter(Boolean);
      }

      return {
        ...scholarship,
        id: scholarship.id || `scholarship-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        fields: fieldsArray,
        benefits: benefitsArray,
        requirements: requirementsArray
      };
    });
    
    // Import to Supabase
    const result = await bulkImportScholarships(formattedScholarships);
    
    if (result.success) {
      return { 
        success: true, 
        message: `Successfully imported ${formattedScholarships.length} scholarships` 
      };
    } else {
      return { 
        success: false, 
        message: `Error importing scholarships: ${result.error?.message || "Unknown error"}` 
      };
    }
  } catch (error) {
    console.error("Import error:", error);
    return { 
      success: false, 
      message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}` 
    };
  }
}

/**
 * Create a sample JSON template for scholarship import
 * @returns A sample scholarship JSON object
 */
export function getScholarshipTemplate(): Scholarship[] {
  return [
    {
      id: "sample-id-1",
      title: "Example Scholarship Title",
      country: "Country Name",
      institution: "University or Organization Name",
      deadline: "2025-12-31",
      fields: ["Engineering", "Computer Science"],
      level: "Masters",
      description: "Detailed description of the scholarship opportunity.",
      benefits: ["Tuition fee", "Monthly stipend", "Travel allowance"],
      requirements: ["Bachelor's degree", "English proficiency", "Minimum GPA 3.0"],
      application_url: "https://example.com/apply",
      featured: false,
      source_url: "https://example.com/source",
      image_url: "https://example.com/image.jpg"
    },
    {
      id: "sample-id-2",
      title: "Another Example Scholarship",
      country: "Different Country",
      institution: "Another University",
      deadline: "2025-10-15",
      fields: ["Business", "Economics"],
      level: "PhD", 
      description: "This is an example of another scholarship entry in the bulk import template.",
      benefits: ["Full tuition coverage", "Research grant"],
      requirements: ["Master's degree", "Research proposal", "Letters of recommendation"],
      application_url: "https://example2.com/apply",
      featured: true
    }
  ];
}
