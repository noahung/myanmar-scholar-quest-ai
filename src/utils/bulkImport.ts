
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
    
    // Validate required fields for each scholarship
    const requiredFields = ['id', 'title', 'country', 'institution', 'deadline', 'level', 'description', 'application_url'];
    
    // Format scholarships to ensure arrays
    const formattedScholarships = scholarships.map(scholarship => ({
      ...scholarship,
      fields: Array.isArray(scholarship.fields) ? scholarship.fields : [],
      benefits: Array.isArray(scholarship.benefits) ? scholarship.benefits : [],
      requirements: Array.isArray(scholarship.requirements) ? scholarship.requirements : []
    }));
    
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
    }
  ];
}
