
// Updated fetchGuides function to merge both local and Supabase data
async function fetchGuides() {
  setLoading(true);
  try {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from('guides')
      .select('*');
      
    if (error) throw error;
    
    // Get guide steps for each guide
    const guidesWithSteps = await Promise.all(
      data.map(async (guide) => {
        const { data: stepsData, error: stepsError } = await supabase
          .from('guide_steps')
          .select('*')
          .eq('guide_id', guide.id)
          .order('step_order', { ascending: true });
          
        if (stepsError) {
          console.error("Error fetching steps:", stepsError);
          return { ...guide, steps: [] };
        }
        
        return {
          ...guide,
          steps: stepsData.map(step => ({
            title: step.title,
            content: step.content
          }))
        };
      })
    );
    
    setGuides(guidesWithSteps);
  } catch (error) {
    console.error("Error fetching guides:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch guides"
    });
  } finally {
    setLoading(false);
  }
}
