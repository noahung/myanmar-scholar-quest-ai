
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Share, Plus, Filter, BookOpen } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "My Experience with the JICA Scholarship Application",
    content: "Hello everyone! I wanted to share my experience applying for the JICA scholarship last year. The process was quite intensive but well worth it. I'm now studying Environmental Engineering in Tokyo...",
    author: {
      name: "Thet Paing",
      avatar: "/placeholder.svg"
    },
    date: "2025-04-10",
    likes: 24,
    comments: 8,
    tags: ["JICA", "Japan", "Experience"]
  },
  {
    id: "2",
    title: "Tips for IELTS Preparation from a 7.5 Scorer",
    content: "After three months of intensive preparation, I scored 7.5 on my IELTS test. Here are some strategies that worked for me: 1. Consistent daily practice with real test materials...",
    author: {
      name: "Su Myat",
      avatar: "/placeholder.svg"
    },
    date: "2025-04-05",
    likes: 32,
    comments: 15,
    tags: ["IELTS", "Language Test", "Study Tips"]
  },
  {
    id: "3",
    title: "Need Advice on Statement of Purpose for Fulbright",
    content: "I'm planning to apply for the Fulbright scholarship this year, but I'm struggling with my statement of purpose. My field is Public Health, and I want to focus on improving healthcare systems in rural Myanmar...",
    author: {
      name: "Min Thu",
      avatar: "/placeholder.svg"
    },
    date: "2025-04-02",
    likes: 10,
    comments: 22,
    tags: ["Fulbright", "USA", "SoP", "Help Needed"]
  },
  {
    id: "4",
    title: "Success Story: From Yangon to Cambridge",
    content: "Three years ago, I was just a graduate trying to figure out my next steps. Today, I'm completing my Master's at Cambridge University. Here's my full journey and how Scholar-M resources helped me...",
    author: {
      name: "Kyaw Zin",
      avatar: "/placeholder.svg"
    },
    date: "2025-03-28",
    likes: 56,
    comments: 13,
    tags: ["Success Story", "UK", "Cambridge"]
  },
  {
    id: "5",
    title: "Guide to Moving to Germany for Studies",
    content: "I moved to Berlin last semester and wanted to share a practical guide for Myanmar students planning to study in Germany. From visa application to finding accommodation, public transportation, and cultural adjustments...",
    author: {
      name: "Phyu Phyu",
      avatar: "/placeholder.svg"
    },
    date: "2025-03-25",
    likes: 41,
    comments: 17,
    tags: ["Germany", "Practical Tips", "Relocation"]
  }
];

export default function Community() {
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="pattern-border pb-2">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Community</h1>
        </div>
        <p className="max-w-[600px] text-muted-foreground">
          Connect with fellow Myanmar students, share experiences, and learn from others in the scholarship journey.
        </p>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{posts.length} posts in the community</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="popular" className="mb-8">
        <TabsList>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="mt-4">
          <div className="space-y-6">
            {posts.sort((a, b) => b.likes - a.likes).map(post => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <img src={post.author.avatar} alt={post.author.name} />
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm mb-4">{post.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between">
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <div className="text-center py-10">
            <p>View most recent posts here.</p>
          </div>
        </TabsContent>
        <TabsContent value="unanswered">
          <div className="text-center py-10">
            <p>View unanswered questions here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
