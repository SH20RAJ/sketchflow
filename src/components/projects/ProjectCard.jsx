import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Clock, Globe, Users, Tag } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { AddTagToProjectDialog } from './AddTagToProjectDialog';

export function ProjectCard({ project, onDelete, isCollaborated = false, roleBadge = null }) {
    const router = useRouter();
    const [showTagDialog, setShowTagDialog] = useState(false);
    return (
        <Card
            className="group relative overflow-hidden hover:shadow-md transition-all duration-300 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg h-auto min-h-[180px] sm:min-h-[200px] flex flex-col hover:scale-[1.01] hover:bg-white/90"
            style={{
                borderLeftColor: project.projectTags?.[0]?.color || '#4F46E5',
                borderLeftWidth: '4px'
            }}>
            <CardHeader className="relative flex-shrink-0 pb-2 sm:pb-3 pt-3 sm:pt-4 px-3 sm:px-4">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
                <div className="flex flex-col space-y-2 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 max-w-[85%]">
                            <CardTitle className="text-base sm:text-lg font-semibold">
                                <Link
                                    className="text-gray-800 hover:text-blue-600 hover:underline transition-colors duration-200 flex items-center"
                                    href={"project/" + project.id}
                                >
                                    {project.emoji && <span className="mr-1.5 flex-shrink-0">{project.emoji}</span>}
                                    <span className="truncate block">{project.name}</span>
                                </Link>
                            </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            {roleBadge}
                            {project.shared && !isCollaborated && (
                                <Globe className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                            {isCollaborated && (
                                <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            )}
                        </div>
                    </div>

                    {project.projectTags && project.projectTags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap w-full">
                            {project.projectTags.slice(0, 3).map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    style={{
                                        backgroundColor: `${tag.color}15` || '#E5E7EB15',
                                        color: tag.color || '#374151',
                                        borderColor: `${tag.color}30` || '#E5E7EB30'
                                    }}
                                    className="hover:opacity-90 transition-all duration-200 cursor-pointer border text-xs font-medium px-2 py-0.5 rounded-full truncate max-w-[100px]"
                                    onClick={() => router.push(`/projects?tagId=${tag.id}`)}
                                    title={tag.name}
                                >
                                    {tag.emoji && <span className="mr-1 opacity-90 flex-shrink-0">{tag.emoji}</span>}
                                    <span className="truncate">{tag.name}</span>
                                </Badge>
                            ))}
                            {project.projectTags.length > 3 && (
                                <Badge
                                    variant="outline"
                                    className="hover:opacity-90 transition-all duration-200 cursor-pointer border text-xs font-medium px-2 py-0.5 rounded-full"
                                    onClick={() => setShowTagDialog(true)}
                                >
                                    +{project.projectTags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
                <CardDescription className="text-xs sm:text-sm text-gray-500 line-clamp-2 group-hover:text-gray-600 transition-colors duration-200 relative z-10 mt-2 sm:mt-3 mb-1 sm:mb-2">
                    {project.description || "No description"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 relative z-10 pb-0 mt-auto px-3 sm:px-4">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1 group-hover:text-blue-500 transition-colors duration-200">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{format(new Date(project.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                    {project.shared && !isCollaborated && (
                        <div className="flex items-center gap-1 text-purple-500 group-hover:text-purple-600 transition-colors duration-200">
                            <Users className="h-3.5 w-3.5" />
                            <span>Shared</span>
                        </div>
                    )}
                    {isCollaborated && project.owner && (
                        <div className="flex items-center gap-1 text-blue-500 group-hover:text-blue-600 transition-colors duration-200">
                            <Users className="h-3.5 w-3.5" />
                            <span>By {project.owner.name || 'Unknown'}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto pt-2 sm:pt-3 border-t border-gray-100/50 px-3 sm:px-4">
                <div className="flex gap-1 sm:gap-1.5 flex-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 rounded-md h-7 sm:h-8 px-1 sm:px-2"
                        onClick={() => router.push(`/project/${project.id}`)}
                    >
                        <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1.5" />
                        <span className="text-xs">Edit</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-50/80 transition-all duration-200 rounded-md h-7 sm:h-8 px-1 sm:px-2"
                        onClick={() => setShowTagDialog(true)}
                    >
                        <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1.5" />
                        <span className="text-xs">Tags</span>
                    </Button>
                </div>
                {onDelete && !isCollaborated && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200 rounded-md h-7 sm:h-8 w-6 sm:w-8 p-0"
                        onClick={() => onDelete(project)}
                    >
                        <Trash className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </Button>
                )}
            </CardFooter>

            {/* Add Tag Dialog */}
            {showTagDialog && (
                <AddTagToProjectDialog
                    open={showTagDialog}
                    onOpenChange={setShowTagDialog}
                    project={project}
                />
            )}
        </Card>
    );
}