import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Clock, Share2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export function ProjectCard({ project, onDelete }) {
    return (
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Project color accent */}
            {project.color && (
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: project.color }}
                />
            )}

            <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl">
                    {project.emoji && <span>{project.emoji}</span>}
                    {project.name}
                </CardTitle>

                {/* Tags */}
                {project.projectTags && project.projectTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {project.projectTags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                                style={{
                                    backgroundColor: tag.color || '#e2e8f0',
                                    color: tag.color ? '#fff' : '#64748b'
                                }}
                            >
                                {tag.emoji && <span>{tag.emoji}</span>}
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}

                {project.description && (
                    <p className="text-sm text-gray-500">{project.description}</p>
                )}
            </CardHeader>

            <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {format(new Date(project.updatedAt), "MMM d, yyyy")}
                    </div>
                    {project.shared && (
                        <div className="flex items-center gap-1.5">
                            <Share2 className="h-4 w-4" />
                            Shared
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between">
                <Link href={`/project/${project.id}`}>
                    <Button variant="outline" size="sm" className="hover:bg-gray-50">
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                </Link>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:border-red-200"
                    onClick={() => onDelete?.(project)}
                >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
} 