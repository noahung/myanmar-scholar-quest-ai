import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, GraduationCap } from "lucide-react";
import { AdBanner } from "./AdBanner";
import { Scholarship } from "@/pages/Home";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  index: number;
}

export function ScholarshipCard({ scholarship, index }: ScholarshipCardProps) {
  // Show ad after every 3rd scholarship card
  const showAd = (index + 1) % 3 === 0;

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-xl font-bold text-myanmar-maroon line-clamp-2">
              {scholarship.title}
            </CardTitle>
            {scholarship.featured && (
              <Badge variant="secondary" className="shrink-0">Featured</Badge>
            )}
          </div>
          <CardDescription className="text-muted-foreground line-clamp-2">
            {scholarship.institution}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>{scholarship.country}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{scholarship.level}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1">
            {scholarship.fields.slice(0, 3).map((field, index) => (
              <Badge key={index} variant="outline" className="text-xs border-myanmar-gold text-myanmar-gold">
                {field}
              </Badge>
            ))}
            {scholarship.fields.length > 3 && (
              <Badge variant="outline" className="text-xs border-myanmar-gold text-myanmar-gold">
                +{scholarship.fields.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Link 
            to={`/scholarships/${scholarship.id}`}
            className="w-full text-center text-myanmar-maroon hover:text-myanmar-maroon/80 font-medium"
          >
            View Details
          </Link>
        </CardFooter>
      </Card>
      {showAd && (
        <div className="col-span-full my-4">
          <AdBanner type="horizontal" />
        </div>
      )}
    </>
  );
} 