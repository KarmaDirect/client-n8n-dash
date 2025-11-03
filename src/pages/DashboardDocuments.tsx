import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText, Image, Video, File, Download, Eye, Trash2, Filter, Search, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useDebouncedValue } from "@/hooks/useDebounce";

interface Document {
  id: string;
  org_id: string;
  doc_type: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  workflow_id?: string | null;
  workflow_name?: string | null;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
}

const DashboardDocuments = () => {
  const { user } = useAuth();
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [filterType, setFilterType] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    
    const stored = localStorage.getItem("orgId");
    if (stored) {
      setOrgId(stored);
    } else {
      supabase
        .from('organizations')
        .select('id')
        .eq('owner_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setOrgId(data.id);
            localStorage.setItem("orgId", data.id);
          }
        });
    }
  }, [user]);

  useEffect(() => {
    if (!orgId) return;
    fetchDocuments();
  }, [orgId]);

  const fetchDocuments = async () => {
    if (!orgId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          workflows:workflow_id (
            id,
            name
          )
        `)
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Enrichir avec les métadonnées du fichier depuis storage
      const enrichedDocs = await Promise.all(
        (data || []).map(async (doc) => {
          try {
            const pathParts = doc.file_path.split('/');
            const fileName = pathParts[pathParts.length - 1];
            const filePath = `${orgId}/${fileName}`;

            // Récupérer les métadonnées depuis storage
            const { data: fileData, error: fileError } = await supabase.storage
              .from('documents')
              .list(orgId, {
                search: fileName
              });

            return {
              ...doc,
              file_name: fileName,
              workflow_name: doc.workflows?.name || null,
              ...(fileData && fileData[0] ? {
                file_size: fileData[0].metadata?.size || 0,
                mime_type: fileData[0].metadata?.mimetype || ''
              } : {})
            };
          } catch (e) {
            console.error('Error fetching file metadata:', e);
            return { ...doc, file_name: doc.file_path.split('/').pop() || 'unknown' };
          }
        })
      );

      setDocuments(enrichedDocs as Document[]);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast.error("Erreur lors du chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (docType: string, mimeType?: string) => {
    if (mimeType?.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (mimeType?.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
    if (mimeType?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    
    switch (docType?.toLowerCase()) {
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-blue-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'social':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = (docType: string, mimeType?: string) => {
    if (mimeType?.startsWith('image/')) return 'Image';
    if (mimeType?.startsWith('video/')) return 'Vidéo';
    if (mimeType?.includes('pdf')) return 'PDF';
    
    switch (docType?.toLowerCase()) {
      case 'pdf': return 'PDF';
      case 'image': return 'Image';
      case 'video': return 'Vidéo';
      case 'social': return 'Réseaux sociaux';
      case 'document': return 'Document';
      default: return docType || 'Fichier';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Taille inconnue';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadDocument = async (doc: Document) => {
    if (!orgId) return;
    
    try {
      const pathParts = doc.file_path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${orgId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);

      if (error) throw error;

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Téléchargement démarré");
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  const viewDocument = async (doc: Document) => {
    if (!orgId) return;
    
    try {
      const pathParts = doc.file_path.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${orgId}/${fileName}`;

      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // URL valide 1h

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error: any) {
      console.error("Error viewing document:", error);
      toast.error("Erreur lors de l'ouverture du document");
    }
  };

  const deleteDocument = async (docId: string, filePath: string) => {
    if (!orgId) return;
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      const pathParts = filePath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const storagePath = `${orgId}/${fileName}`;

      // Supprimer du storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Supprimer de la base de données
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);

      if (dbError) throw dbError;

      toast.success("Document supprimé");
      fetchDocuments();
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = debouncedSearchQuery === "" || 
      doc.file_name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      doc.workflow_name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || 
      doc.doc_type?.toLowerCase() === filterType.toLowerCase() ||
      (filterType === "image" && doc.mime_type?.startsWith('image/')) ||
      (filterType === "video" && doc.mime_type?.startsWith('video/')) ||
      (filterType === "pdf" && doc.mime_type?.includes('pdf'));

    return matchesSearch && matchesType;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !orgId) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const filePath = `${orgId}/${Date.now()}_${file.name}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Determine doc type from mime type
        let docType = 'document';
        if (file.type.startsWith('image/')) docType = 'image';
        else if (file.type.startsWith('video/')) docType = 'video';
        else if (file.type.includes('pdf')) docType = 'pdf';

        // Create document record
        const { error: dbError } = await supabase
          .from('documents')
          .insert({
            org_id: orgId,
            doc_type: docType,
            file_path: filePath,
          });

        if (dbError) throw dbError;
      }

      toast.success(`${files.length} fichier(s) uploadé(s) avec succès`);
      fetchDocuments();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(`Erreur lors de l'upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const documentTypes = [
    { value: "all", label: "Tous les types" },
    { value: "pdf", label: "PDF" },
    { value: "image", label: "Images" },
    { value: "video", label: "Vidéos" },
    { value: "social", label: "Réseaux sociaux" },
    { value: "document", label: "Documents" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Documents exportés</h1>
          <p className="text-muted-foreground">
            Gérez tous vos fichiers générés par vos automations
          </p>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un document ou workflow..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type de document" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !orgId}
                className="w-full sm:w-auto"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Uploader
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des documents */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={FileText}
                title={searchQuery || filterType !== "all" ? "Aucun document trouvé" : "Aucun document exporté"}
                description={searchQuery || filterType !== "all" 
                  ? "Aucun document ne correspond à votre recherche" 
                  : "Les documents générés par vos workflows apparaîtront ici"}
                action={!searchQuery && filterType === "all" ? {
                  label: "Uploader un document",
                  onClick: () => fileInputRef.current?.click()
                } : undefined}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="dashboard-card hover:shadow-lg transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-muted">
                        {getDocumentIcon(doc.doc_type, doc.mime_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{doc.file_name || 'Document'}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {getDocumentTypeLabel(doc.doc_type, doc.mime_type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {doc.workflow_name && (
                    <div className="text-xs text-muted-foreground">
                      Workflow: <span className="font-medium">{doc.workflow_name}</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(doc.file_size)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(doc.created_at)}
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDocument(doc)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDocument(doc.id, doc.file_path)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredDocuments.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground text-center">
                {filteredDocuments.length} document(s) trouvé(s)
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardDocuments;

