'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, GitFork, Clock, Globe, Users, Tag, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function PublicProjectCard({ project, onClone, isCloning }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const isOwner = project.isOwner;
  
  return (
    <Card
      className="group relative overflow-hidden hover:shadow-md transition-all duration-300 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg h-auto min-h-[180px] sm:min-h-[200px] flex flex-col hover:scale-[1.01] hover:bg-white/90"
      style={{
        borderLeftColor: project.projectTags?.[0]?.color || '#4F46E5',
        borderLeftWidth: '4px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="relative flex-shrink-0 pb-2 sm:pb-3 pt-3 sm:pt-4 px-3 sm:px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
        <div className="flex flex-col space-y-2 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-[85%]">
              <CardTitle className="text-base sm:text-lg font-semibold">
                <Link
                  className="text-gray-800 hover:text-blue-600 hover:underline transition-colors duration-200 flex items-center"
                  href={`/project/${project.id}`}
                >
                  {project.emoji && <span className="mr-1.5 flex-shrink-0">{project.emoji}</span>}
                  <span className="truncate block">{project.name}</span>
                </Link>
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {isOwner && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                  Your Project
                </Badge>
              )}
              <Globe className="h-4 w-4 text-green-500 flex-shrink-0" />
            </div>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-500 line-clamp-2 group-hover:text-gray-600 transition-colors duration-200 relative z-10 mt-2 sm:mt-3 mb-1 sm:mb-2">
            {project.description || "No description"}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 relative z-10 pb-0 mt-auto px-3 sm:px-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1 group-hover:text-blue-500 transition-colors duration-200">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(new Date(project.updatedAt), "MMM d, yyyy")}</span>
          </div>
          
          {project.owner && (
            <div className="flex items-center gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={project.owner.image} alt={project.owner.name} />
                        <AvatarFallback className="text-[8px]">{project.owner.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[80px]">{project.owner.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created by {project.owner.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {project.collaboratorCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{project.collaboratorCount}</span>
            </div>
          )}
        </div>
        
        {project.projectTags && project.projectTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.projectTags.map(tag => (
              <Badge 
                key={tag.id} 
                variant="outline" 
                className="text-xs px-1.5 py-0 h-5"
                style={{ 
                  backgroundColor: `${tag.color}15`, 
                  color: tag.color,
                  borderColor: `${tag.color}30`
                }}
              >
                {tag.emoji && <span className="mr-1">{tag.emoji}</span>}
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between mt-auto pt-2 sm:pt-3 border-t border-gray-100/50 px-3 sm:px-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 rounded-md h-7 sm:h-8 px-1 sm:px-2"
          onClick={() => router.push(`/project/${project.id}`)}
        >
          <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1.5" />
          <span className="text-xs">View</span>
        </Button>
        
        {!isOwner && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 rounded-md h-7 sm:h-8 px-1 sm:px-2"
            onClick={() => onClone(project.id)}
            disabled={isCloning}
          >
            {isCloning ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1.5 animate-spin" />
                <span className="text-xs">Cloning...</span>
              </>
            ) : (
              <>
                <GitFork className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1.5" />
                <span className="text-xs">Clone</span>
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
