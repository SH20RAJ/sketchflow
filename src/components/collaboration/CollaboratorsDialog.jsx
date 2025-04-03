'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, ChevronDown, Loader2, X, Check, Clock, Shield, Eye, Edit, Trash, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export function CollaboratorsDialog({ projectId, isOwner }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [isInviting, setIsInviting] = useState(false);
  const [activeTab, setActiveTab] = useState('collaborators');

  // Fetch collaborators when dialog opens
  useEffect(() => {
    if (open) {
      fetchCollaborators();
    }
  }, [open, projectId]);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!response.ok) throw new Error('Failed to fetch collaborators');
      
      const data = await response.json();
      setCollaborators(data.collaborators || []);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast.error('Failed to load collaborators');
    } finally {
      setIsLoading(false);
    }
  };

  const inviteCollaborator = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsInviting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to invite collaborator');
      }

      const newCollaborator = await response.json();
      setCollaborators(prev => [...prev, newCollaborator]);
      setEmail('');
      toast.success('Invitation sent successfully');
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast.error(error.message || 'Failed to invite collaborator');
    } finally {
      setIsInviting(false);
    }
  };

  const updateCollaboratorRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) throw new Error('Failed to update role');
      
      const updatedCollaborator = await response.json();
      setCollaborators(prev => 
        prev.map(c => c.userId === userId ? { ...c, role: newRole } : c)
      );
      toast.success('Collaborator role updated');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update collaborator role');
    }
  };

  const removeCollaborator = async (userId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove collaborator');
      
      setCollaborators(prev => prev.filter(c => c.userId !== userId));
      toast.success('Collaborator removed');
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast.error('Failed to remove collaborator');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'OWNER':
        return <Badge variant="default" className="bg-blue-500">Owner</Badge>;
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge variant="outline" className="text-green-500 border-green-500"><Check className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="text-red-500 border-red-500"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return null;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'OWNER':
        return <Shield className="h-4 w-4" />;
      case 'EDITOR':
        return <Edit className="h-4 w-4" />;
      case 'COMMENTER':
        return <MessageCircle className="h-4 w-4" />;
      case 'VIEWER':
        return <Eye className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          <span>Collaborators</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Project Collaborators</DialogTitle>
          <DialogDescription>
            Invite people to collaborate on this project. You can set different permission levels for each collaborator.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="collaborators" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
            {isOwner && <TabsTrigger value="invite">Invite People</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="collaborators" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No collaborators yet</p>
                {isOwner && (
                  <p className="mt-1">
                    Invite people to collaborate on this project
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div 
                    key={collaborator.isOwner ? 'owner' : collaborator.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={collaborator.user?.image} alt={collaborator.user?.name} />
                        <AvatarFallback>{collaborator.user?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{collaborator.user?.name}</div>
                        <div className="text-sm text-gray-500">{collaborator.user?.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(collaborator.role)}
                      {!collaborator.isOwner && collaborator.inviteStatus && getStatusBadge(collaborator.inviteStatus)}
                      
                      {isOwner && !collaborator.isOwner && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => updateCollaboratorRole(collaborator.userId, 'EDITOR')}
                              className="gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Make Editor</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateCollaboratorRole(collaborator.userId, 'COMMENTER')}
                              className="gap-2"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>Make Commenter</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateCollaboratorRole(collaborator.userId, 'VIEWER')}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Make Viewer</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => removeCollaborator(collaborator.userId)}
                              className="text-red-600 gap-2"
                            >
                              <Trash className="h-4 w-4" />
                              <span>Remove</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {isOwner && (
            <TabsContent value="invite" className="space-y-4 mt-4">
              <form onSubmit={inviteCollaborator} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Permission Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={role === 'EDITOR' ? 'default' : 'outline'}
                      className="gap-2"
                      onClick={() => setRole('EDITOR')}
                    >
                      <Edit className="h-4 w-4" />
                      <span>Editor</span>
                    </Button>
                    <Button
                      type="button"
                      variant={role === 'COMMENTER' ? 'default' : 'outline'}
                      className="gap-2"
                      onClick={() => setRole('COMMENTER')}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Commenter</span>
                    </Button>
                    <Button
                      type="button"
                      variant={role === 'VIEWER' ? 'default' : 'outline'}
                      className="gap-2"
                      onClick={() => setRole('VIEWER')}
                    >
                      <Eye className="h-4 w-4" />
                      <span>Viewer</span>
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Edit className="h-4 w-4 text-green-500" />
                      <span><strong>Editors</strong> can edit the project content</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="h-4 w-4 text-yellow-500" />
                      <span><strong>Commenters</strong> can view and add comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span><strong>Viewers</strong> can only view the project</span>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button type="submit" disabled={isInviting || !email}>
                    {isInviting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Invitation...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
