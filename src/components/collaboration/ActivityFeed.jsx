'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Loader2, UserPlus, UserCog, UserMinus, LogOut, UserCheck, UserX, Edit, MessageSquare, CheckSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ActivityFeed({ projectId }) {
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchActivities();
    }
  }, [open, projectId]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/activities`);
      if (!response.ok) throw new Error('Failed to fetch activities');

      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case 'invited_collaborator':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'updated_collaborator_role':
        return <UserCog className="h-4 w-4 text-purple-500" />;
      case 'removed_collaborator':
        return <UserMinus className="h-4 w-4 text-red-500" />;
      case 'left_project':
        return <LogOut className="h-4 w-4 text-orange-500" />;
      case 'accepted_invitation':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'rejected_invitation':
        return <UserX className="h-4 w-4 text-red-500" />;
      case 'edited_project':
        return <Edit className="h-4 w-4 text-green-500" />;
      case 'added_comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'resolved_comment':
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityDescription = (activity) => {
    const { action, details, user } = activity;
    const userName = user?.name || 'Someone';

    switch (action) {
      case 'invited_collaborator':
        return `${userName} invited ${details.collaboratorName} as a ${details.role.toLowerCase()}`;
      case 'updated_collaborator_role':
        return `${userName} changed ${details.collaboratorName}'s role to ${details.newRole.toLowerCase()}`;
      case 'removed_collaborator':
        return `${userName} removed ${details.collaboratorName} from the project`;
      case 'left_project':
        return `${userName} left the project`;
      case 'accepted_invitation':
        return `${userName} accepted invitation to collaborate on ${details.projectName}`;
      case 'rejected_invitation':
        return `${userName} declined invitation to collaborate on ${details.projectName}`;
      case 'edited_project':
        return `${userName} made changes to the project`;
      case 'added_comment':
        return `${userName} added a comment: "${details.comment.substring(0, 30)}${details.comment.length > 30 ? '...' : ''}"`;
      case 'resolved_comment':
        return `${userName} resolved a comment`;
      default:
        return `${userName} performed an action on the project`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Activity className="h-4 w-4" />
          <span>Activity</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Project Activity</DialogTitle>
          <DialogDescription>
            Recent activity and changes to this project
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No activity yet</p>
              <p className="mt-1">
                Activity will appear here as you and your collaborators make changes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user?.image} alt={activity.user?.name} />
                    <AvatarFallback>{activity.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{activity.user?.name}</div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {getActivityIcon(activity.action)}
                      <span className="text-sm">{getActivityDescription(activity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
