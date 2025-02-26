import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Clock, Globe, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';

export function ProjectCard({ project, onDelete }) {
    const router = useRouter();
    return (
        <Card
            style={{
                backgroundColor: project.projectTags?.[0]?.color ? `${project.projectTags[0].color}15` : '#E5E7EB15',
                color: project.projectTags?.[0]?.color || '#374151',
                borderColor: project.projectTags?.[0]?.color ? `${project.projectTags[0].color}30` : '#E5E7EB30'
            }}
            className={"group relative overflow-hidden hover:sheadow-xl transition-all duration-300 bg-white/60 backdrop-blur-sm border-gray-200/30 h-[200px] flex flex-col hover:scalee-[1.02] hover:bg-white/80" + ""}>
            <CardHeader className="relative flex-shrink-0 pb-3">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-purple-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
                <div className="flex items-center justify-between mb-2.5 relative z-10">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300">
                            <Link className=" text-stone-800 hover:underline  decoration-wavy lime-100/50" href={"project/" + project.id}>{project.name}</Link>
                        </CardTitle>
                        {project.shared && (
                            <Globe className="h-4 w-4 text-green-500" />
                        )}
                    </div>
                    {project.projectTags && project.projectTags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                            {project.projectTags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    style={{
                                        backgroundColor: `${tag.color}15` || '#E5E7EB15',
                                        color: tag.color || '#374151',
                                        borderColor: `${tag.color}30` || '#E5E7EB30'
                                    }}
                                    className="hover:opacity-90 transition-all duration-200 cursor-pointer border text-xs font-medium px-2 py-0.5 rounded-full"
                                    onClick={() => router.push(`/projects?tagId=${tag.id}`)}
                                >
                                    {tag.emoji && <span className="mr-1 opacity-90">{tag.emoji}</span>}
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
                <CardDescription className="text-sm text-gray-500/90 line-clamp-2 group-hover:text-gray-600 transition-colors duration-300 relative z-10">
                    {project.description || "No description"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 relative z-10">
                <div className="flex items-center gap-4 text-sm text-gray-500/90">
                    <div className="flex items-center gap-1.5 group-hover:text-blue-500 transition-colors duration-300">
                        <Clock className="h-4 w-4" />
                        {format(new Date(project.updatedAt), "MMM d, yyyy")}
                    </div>
                    {project.shared && (
                        <div className="flex items-center gap-1.5 text-purple-500/90 group-hover:text-purple-600 transition-colors duration-300">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">Shared</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto border-t pt-4 border-gray-100/50">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/80 transition-all duration-200 flex-1 mr-2 rounded-md shadow-sm"
                    onClick={() => router.push(`/project/${project.id}`)}
                >
                    <Pencil className="h-3.5 w-3.5 mr-2 transition-transform group-hover:scale-105 duration-200" />
                    <span className="font-medium">Edit Project</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200 px-3 rounded-md"
                    onClick={() => onDelete(project)}
                >
                    <Trash className="h-3.5 w-3.5 transition-transform group-hover:scale-105 duration-200" />
                </Button>
            </CardFooter>
        </Card>
    );
}