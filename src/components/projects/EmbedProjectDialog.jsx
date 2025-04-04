'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Copy, Check, Eye, Code, Shield, Settings, Layout, Palette } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export function EmbedProjectDialog({ project, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedToken, setEmbedToken] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { theme } = useTheme();

  // Embed configuration options
  const [config, setConfig] = useState({
    // Display options
    showHeader: true,
    showFooter: false,
    showControls: true,
    allowInteraction: true,
    viewMode: 'split', // split, diagram, markdown
    theme: 'system', // light, dark, system

    // Size options
    width: '100%',
    height: '600px',
    responsive: true,

    // Security options
    accessControl: 'public', // public, token, domain
    allowedDomains: '',
    expirationDays: 0, // 0 means never expires

    // Advanced options
    autoSync: false,
    syncInterval: 60, // seconds
    allowFullscreen: true,
  });

  // Generate embed code based on configuration
  useEffect(() => {
    if (!project) return;

    // Create the embed URL with query parameters
    const baseUrl = `${window.location.origin}/embed/${project.id}`;
    const params = new URLSearchParams();

    // Add display options
    params.append('header', config.showHeader);
    params.append('footer', config.showFooter);
    params.append('controls', config.showControls);
    params.append('interact', config.allowInteraction);
    params.append('view', config.viewMode);
    params.append('theme', config.theme);

    // Add security options if using token
    if (config.accessControl === 'token' && embedToken) {
      params.append('token', embedToken);
    }

    // Add advanced options
    if (config.autoSync) {
      params.append('sync', 'true');
      params.append('interval', config.syncInterval);
    }

    const url = `${baseUrl}?${params.toString()}`;
    setEmbedUrl(url);

    // Generate the iframe code
    const iframeCode = `<iframe
  src="${url}"
  width="${config.width}"
  height="${config.height}"
  style="border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 8px;"
  ${config.allowFullscreen ? 'allowfullscreen' : ''}
  ${config.responsive ? 'class="responsive-embed"' : ''}
  title="${project.name} - SketchFlow Embed">
</iframe>

${config.responsive ? `<style>
  .responsive-embed {
    max-width: 100%;
    aspect-ratio: 16/9;
  }
</style>` : ''}`;

    setEmbedCode(iframeCode);
  }, [project, config, embedToken]);

  // Generate embed token
  const generateEmbedToken = async () => {
    if (!project) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/embed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessControl: config.accessControl,
          allowedDomains: config.allowedDomains,
          expirationDays: config.expirationDays,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate embed token');
      }

      const data = await response.json();
      setEmbedToken(data.token);
    } catch (error) {
      console.error('Error generating embed token:', error);
      toast.error('Failed to generate embed token');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy embed code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Embed code copied to clipboard');

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Handle configuration changes
  const updateConfig = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Generate token when access control changes to token
  useEffect(() => {
    if (config.accessControl === 'token' && !embedToken) {
      generateEmbedToken();
    }
  }, [config.accessControl]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Embed Project: {project?.name}</DialogTitle>
          <DialogDescription>
            Configure how your project will be embedded on external websites.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Display
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Embed Code</h3>
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto">
                    {embedCode}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Embed Preview</h3>
                <div className="border rounded-md overflow-hidden bg-white dark:bg-gray-950">
                  <div className="aspect-video flex items-center justify-center p-4">
                    <iframe
                      src={embedUrl || `${window.location.origin}/embed/${project?.id}`}
                      className="w-full h-full border rounded"
                      title={`${project?.name} - Preview`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="viewMode">View Mode</Label>
                  <Select
                    value={config.viewMode}
                    onValueChange={(value) => updateConfig('viewMode', value)}
                  >
                    <SelectTrigger id="viewMode">
                      <SelectValue placeholder="Select view mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="split">Split View (Diagram + Markdown)</SelectItem>
                      <SelectItem value="diagram">Diagram Only</SelectItem>
                      <SelectItem value="markdown">Markdown Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={config.theme}
                    onValueChange={(value) => updateConfig('theme', value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System Default</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={config.width}
                    onChange={(e) => updateConfig('width', e.target.value)}
                    placeholder="e.g., 100%, 800px"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={config.height}
                    onChange={(e) => updateConfig('height', e.target.value)}
                    placeholder="e.g., 600px, 80vh"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showHeader">Show Header</Label>
                  <Switch
                    id="showHeader"
                    checked={config.showHeader}
                    onCheckedChange={(checked) => updateConfig('showHeader', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showFooter">Show Footer</Label>
                  <Switch
                    id="showFooter"
                    checked={config.showFooter}
                    onCheckedChange={(checked) => updateConfig('showFooter', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showControls">Show Controls</Label>
                  <Switch
                    id="showControls"
                    checked={config.showControls}
                    onCheckedChange={(checked) => updateConfig('showControls', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowInteraction">Allow Interaction</Label>
                  <Switch
                    id="allowInteraction"
                    checked={config.allowInteraction}
                    onCheckedChange={(checked) => updateConfig('allowInteraction', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="responsive">Responsive Embed</Label>
                  <Switch
                    id="responsive"
                    checked={config.responsive}
                    onCheckedChange={(checked) => updateConfig('responsive', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessControl">Access Control</Label>
                <Select
                  value={config.accessControl}
                  onValueChange={(value) => updateConfig('accessControl', value)}
                >
                  <SelectTrigger id="accessControl">
                    <SelectValue placeholder="Select access control" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Anyone can embed)</SelectItem>
                    <SelectItem value="token">Token-based (Secure embed with token)</SelectItem>
                    <SelectItem value="domain">Domain Restriction (Limit to specific domains)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.accessControl === 'token' && (
                <div className="space-y-2">
                  <Label htmlFor="embedToken">Embed Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="embedToken"
                      value={embedToken}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateEmbedToken}
                      disabled={isGenerating}
                    >
                      {isGenerating ? 'Generating...' : 'Regenerate'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This token is required to access the embedded project. Keep it secure.
                  </p>
                </div>
              )}

              {config.accessControl === 'domain' && (
                <div className="space-y-2">
                  <Label htmlFor="allowedDomains">Allowed Domains</Label>
                  <Input
                    id="allowedDomains"
                    value={config.allowedDomains}
                    onChange={(e) => updateConfig('allowedDomains', e.target.value)}
                    placeholder="e.g., example.com, subdomain.example.org"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated list of domains where this embed is allowed.
                  </p>
                </div>
              )}

              {(config.accessControl === 'token' || config.accessControl === 'domain') && (
                <div className="space-y-2">
                  <Label htmlFor="expirationDays">Expiration (Days)</Label>
                  <div className="flex gap-4 items-center">
                    <Slider
                      id="expirationDays"
                      min={0}
                      max={365}
                      step={1}
                      value={[config.expirationDays]}
                      onValueChange={(value) => updateConfig('expirationDays', value[0])}
                      className="flex-1"
                    />
                    <span className="w-16 text-center">
                      {config.expirationDays === 0 ? 'Never' : `${config.expirationDays} days`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Set to 0 for no expiration.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSync">Auto Sync</Label>
                  <p className="text-xs text-gray-500">
                    Automatically refresh the embed to show the latest changes.
                  </p>
                </div>
                <Switch
                  id="autoSync"
                  checked={config.autoSync}
                  onCheckedChange={(checked) => updateConfig('autoSync', checked)}
                />
              </div>

              {config.autoSync && (
                <div className="space-y-2">
                  <Label htmlFor="syncInterval">Sync Interval (seconds)</Label>
                  <div className="flex gap-4 items-center">
                    <Slider
                      id="syncInterval"
                      min={10}
                      max={300}
                      step={10}
                      value={[config.syncInterval]}
                      onValueChange={(value) => updateConfig('syncInterval', value[0])}
                      className="flex-1"
                    />
                    <span className="w-16 text-center">
                      {config.syncInterval} sec
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowFullscreen">Allow Fullscreen</Label>
                  <p className="text-xs text-gray-500">
                    Enable fullscreen mode for the embedded project.
                  </p>
                </div>
                <Switch
                  id="allowFullscreen"
                  checked={config.allowFullscreen}
                  onCheckedChange={(checked) => updateConfig('allowFullscreen', checked)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy Embed Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
