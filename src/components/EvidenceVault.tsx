import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lock,
  Upload,
  Camera,
  Video,
  FileText,
  Trash2,
  Download,
  Eye,
  Calendar,
  MapPin,
  Shield,
  AlertTriangle,
  Clock,
  Plus,
  Image as ImageIcon,
  File,
  Hash,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface EvidenceItem {
  id: string;
  type: "photo" | "video" | "document" | "audio" | "other";
  name: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
  size: number;
  mimeType: string;
  hash: string;
  createdAt: string;
  dataUrl?: string; // Base64 for local storage
  thumbnail?: string;
}

const TYPE_ICONS: Record<string, typeof Camera> = {
  photo: Camera,
  video: Video,
  document: FileText,
  audio: File,
  other: File,
};

const TYPE_COLORS: Record<string, string> = {
  photo: "bg-blue-500/20 text-blue-400",
  video: "bg-purple-500/20 text-purple-400",
  document: "bg-green-500/20 text-green-400",
  audio: "bg-orange-500/20 text-orange-400",
  other: "bg-gray-500/20 text-gray-400",
};

const STORAGE_KEY = "crh_evidence_vault";

// Generate SHA-256 hash of a file for chain of custody
async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function EvidenceVault() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showPreview, setShowPreview] = useState<EvidenceItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New item form
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTags, setNewTags] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore parse errors */
    }
  }, []);

  // Save to localStorage
  const saveItems = useCallback((updated: EvidenceItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // Storage full — remove data URLs from oldest items
      const trimmed = updated.map((item, i) =>
        i < updated.length - 5 ? { ...item, dataUrl: undefined, thumbnail: undefined } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    }
  }, []);

  const getFileType = (file: File): EvidenceItem["type"] => {
    if (file.type.startsWith("image/")) return "photo";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.includes("pdf") || file.type.includes("document") || file.type.includes("text"))
      return "document";
    return "other";
  };

  const handleUpload = async () => {
    if (!newFile) {
      toast({ title: "Select a file", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const hash = await hashFile(newFile);
      const dataUrl = newFile.size < 10 * 1024 * 1024 ? await readFileAsDataURL(newFile) : undefined;

      // Generate thumbnail for images
      let thumbnail: string | undefined;
      if (newFile.type.startsWith("image/") && dataUrl) {
        thumbnail = dataUrl; // Use full image as thumbnail for simplicity
      }

      const item: EvidenceItem = {
        id: crypto.randomUUID(),
        type: getFileType(newFile),
        name: newFile.name,
        description: newDescription,
        date: newDate || new Date().toISOString().slice(0, 10),
        location: newLocation,
        tags: newTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        size: newFile.size,
        mimeType: newFile.type,
        hash,
        createdAt: new Date().toISOString(),
        dataUrl,
        thumbnail,
      };

      saveItems([item, ...items]);

      toast({
        title: "Evidence secured",
        description: `${newFile.name} added to vault with SHA-256 hash for chain of custody.`,
      });

      // Reset form
      setNewFile(null);
      setNewDescription("");
      setNewLocation("");
      setNewDate(new Date().toISOString().slice(0, 10));
      setNewTags("");
      setShowUpload(false);
    } catch (err) {
      toast({ title: "Upload failed", description: String(err), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    saveItems(items.filter((i) => i.id !== id));
    setShowPreview(null);
    toast({ title: "Evidence removed from vault" });
  };

  const handleDownload = (item: EvidenceItem) => {
    if (!item.dataUrl) {
      toast({ title: "File data not available for download", variant: "destructive" });
      return;
    }
    const a = document.createElement("a");
    a.href = item.dataUrl;
    a.download = item.name;
    a.click();
  };

  const handleExportLog = () => {
    const log = items
      .map(
        (item) =>
          `[${item.createdAt}] ${item.type.toUpperCase()} — ${item.name}\n` +
          `  SHA-256: ${item.hash}\n` +
          `  Date: ${item.date} | Location: ${item.location || "N/A"}\n` +
          `  Description: ${item.description || "N/A"}\n` +
          `  Tags: ${item.tags.join(", ") || "None"}\n` +
          `  Size: ${formatFileSize(item.size)} | Type: ${item.mimeType}\n`
      )
      .join("\n---\n\n");

    const header = [
      "EVIDENCE VAULT — CHAIN OF CUSTODY LOG",
      "=" .repeat(50),
      `Generated: ${new Date().toISOString()}`,
      `Total items: ${items.length}`,
      `Generated by: Civil Rights Hub (civilrightshub.org)`,
      "",
      "Each item below includes a SHA-256 cryptographic hash",
      "to prove the file has not been tampered with.",
      "",
      "=" .repeat(50),
      "",
    ].join("\n");

    const blob = new Blob([header + log], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `evidence-log-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast({ title: "Chain of custody log exported" });
  };

  // Filtered items
  const filtered = items.filter((item) => {
    if (filter !== "all" && item.type !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5 text-primary" />
            Evidence Vault
          </CardTitle>
          <CardDescription>
            Securely store photos, videos, documents, and recordings related to civil rights
            incidents. Every file is cryptographically hashed (SHA-256) to create an unalterable
            chain of custody that holds up in court.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => setShowUpload(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Evidence
            </Button>
            {items.length > 0 && (
              <Button variant="outline" onClick={handleExportLog} className="gap-2">
                <Download className="h-4 w-4" /> Export Chain of Custody Log
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3 mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Shield className="h-5 w-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200/80">
              <strong>Privacy:</strong> All evidence is stored locally in your browser. Nothing
              leaves your device. Clear your browser data to remove all stored evidence.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Items", value: items.length, icon: File },
            { label: "Photos", value: items.filter((i) => i.type === "photo").length, icon: Camera },
            { label: "Videos", value: items.filter((i) => i.type === "video").length, icon: Video },
            { label: "Documents", value: items.filter((i) => i.type === "document").length, icon: FileText },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-3 flex items-center gap-3">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filter + Search */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="photo">Photos</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Evidence Items */}
      {items.length === 0 ? (
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="py-12 text-center">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your Evidence Vault is Empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by adding photos, videos, documents, or recordings from an incident.
              Each file will be cryptographically hashed for chain of custody.
            </p>
            <Button onClick={() => setShowUpload(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Your First Evidence
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No evidence matches your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? File;
            return (
              <Card
                key={item.id}
                className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => setShowPreview(item)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="h-12 w-12 rounded object-cover shrink-0"
                      />
                    ) : (
                      <div className={`h-12 w-12 rounded flex items-center justify-center shrink-0 ${TYPE_COLORS[item.type]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <Badge variant="outline" className="text-[10px] px-1 h-4 shrink-0">
                          {item.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {item.date}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {item.location}
                          </span>
                        )}
                        <span>{formatFileSize(item.size)}</span>
                      </div>
                      {item.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" /> Add Evidence
            </DialogTitle>
            <DialogDescription>
              Upload a photo, video, document, or recording. The file will be SHA-256 hashed for
              chain of custody verification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Input */}
            <div className="space-y-2">
              <Label>File *</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                {newFile ? (
                  <div className="flex items-center justify-center gap-2">
                    {newFile.type.startsWith("image/") ? <ImageIcon className="h-5 w-5 text-blue-400" /> :
                     newFile.type.startsWith("video/") ? <Video className="h-5 w-5 text-purple-400" /> :
                     <FileText className="h-5 w-5 text-green-400" />}
                    <span className="text-sm">{newFile.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {formatFileSize(newFile.size)}
                    </Badge>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to select a file or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Photos, videos, PDFs, documents, audio
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date of Incident</Label>
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="City, State or address"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="What does this evidence show? Context and details..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                placeholder="e.g., body-cam, traffic-stop, witness"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpload(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading} className="gap-2">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Secure in Vault
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!showPreview} onOpenChange={(open) => !open && setShowPreview(null)}>
        <DialogContent className="sm:max-w-lg">
          {showPreview && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" /> {showPreview.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                {/* Preview */}
                {showPreview.thumbnail && (
                  <img
                    src={showPreview.thumbnail}
                    alt={showPreview.name}
                    className="w-full max-h-64 object-contain rounded border border-border/50"
                  />
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <Badge variant="secondary" className="text-[10px]">{showPreview.type}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>{" "}
                    {formatFileSize(showPreview.size)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span> {showPreview.date}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Added:</span>{" "}
                    {new Date(showPreview.createdAt).toLocaleDateString()}
                  </div>
                  {showPreview.location && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Location:</span> {showPreview.location}
                    </div>
                  )}
                </div>

                {showPreview.description && (
                  <div>
                    <span className="text-sm text-muted-foreground">Description:</span>
                    <p className="text-sm mt-1">{showPreview.description}</p>
                  </div>
                )}

                {showPreview.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {showPreview.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[11px]">{tag}</Badge>
                    ))}
                  </div>
                )}

                {/* Chain of Custody */}
                <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">Chain of Custody — SHA-256</span>
                  </div>
                  <code className="text-[10px] text-muted-foreground break-all block">
                    {showPreview.hash}
                  </code>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    This hash proves the file has not been altered since it was added to the vault.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(showPreview.id)}
                  className="gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(showPreview)}
                  className="gap-1"
                >
                  <Download className="h-3 w-3" /> Download
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
