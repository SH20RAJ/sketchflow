'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

export function InvitationsDropdown() {
  const router = useRouter();
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
    }
  }, [isOpen]);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/collaborations/invitations');
      if (!response.ok) throw new Error('Failed to fetch invitations');

      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const respondToInvitation = async (projectId, status) => {
    setProcessingId(projectId);
    try {
      const response = await fetch(`/api/collaborations/invitations/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to respond to invitation');

      const data = await response.json();
      setInvitations(prev => prev.filter(inv => inv.projectId !== projectId));
      toast.success(data.message);
      setIsOpen(false); // Close dropdown after responding

      if (status === 'ACCEPTED') {
        // Refresh the projects page to show the new collaborated project
        if (window.location.pathname === '/projects') {
          window.location.reload();
        } else {
          // Navigate to the project page
          router.push(`/project/${projectId}`);
        }
      }
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast.error('Failed to process invitation');
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'EDITOR':
        return <Badge variant="default" className="bg-green-500">Editor</Badge>;
      case 'COMMENTER':
        return <Badge variant="default" className="bg-yellow-500">Commenter</Badge>;
      case 'VIEWER':
        return <Badge variant="default" className="bg-gray-500">Viewer</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {invitations.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
              {invitations.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Project Invitations</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No pending invitations</p>
          </div>
        ) : (
          <>
            {invitations.map((invitation) => (
              <div key={invitation.id} className="p-2">
                <div className="flex items-start gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    {invitation.project.emoji ? (
                      <div className="h-full w-full flex items-center justify-center text-lg">
                        {invitation.project.emoji}
                      </div>
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{ backgroundColor: invitation.project.color || '#4F46E5' }}
                      />
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{invitation.project.name}</div>
                    <div className="text-xs text-gray-500 mb-1">
                      Invited {format(new Date(invitation.invitedAt), "MMM d, yyyy")} • Role: {getRoleBadge(invitation.role)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {invitation.project.description || "No description"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 h-8 gap-1"
                    onClick={() => respondToInvitation(invitation.projectId, 'ACCEPTED')}
                    disabled={processingId === invitation.projectId}
                  >
                    {processingId === invitation.projectId ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 gap-1"
                    onClick={() => respondToInvitation(invitation.projectId, 'REJECTED')}
                    disabled={processingId === invitation.projectId}
                  >
                    <X className="h-3 w-3" />
                    Decline
                  </Button>
                </div>
                <DropdownMenuSeparator className="my-2" />
              </div>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
