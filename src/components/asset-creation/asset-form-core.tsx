"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, ImageIcon, Music, Video, FileText, Code, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssetFormCoreProps {
  formState: any
  updateFormField: (field: string, value: any) => void
  handleFileChange: (file: File | null) => void
  templates?: any[]
  selectedTemplate?: any
  onTemplateChange?: (templateId: string) => void
  showTemplateSelector?: boolean
}

const getIconForTemplate = (templateId: string) => {
  const icons: Record<string, any> = {
    audio: Music,
    art: Palette,
    video: Video,
    documents: FileText,
    software: Code,
    nft: ImageIcon,
    general: FileText,
  }
  return icons[templateId] || FileText
}

export function AssetFormCore({
  formState,
  updateFormField,
  handleFileChange,
  templates = [],
  selectedTemplate,
  onTemplateChange,
  showTemplateSelector = true,
}: AssetFormCoreProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileChange(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileChange(files[0])
    }
  }

  const removeFile = () => {
    handleFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formState.tags.includes(tag)) {
      updateFormField("tags", [...formState.tags, tag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateFormField(
      "tags",
      formState.tags.filter((tag: string) => tag !== tagToRemove),
    )
  }

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const input = e.target as HTMLInputElement
      const tag = input.value.trim()
      if (tag) {
        addTag(tag)
        input.value = ""
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      {showTemplateSelector && templates.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Asset Type</Label>
                <p className="text-sm text-muted-foreground">Choose the type that best describes your asset</p>
              </div>
              <Select value={selectedTemplate?.id} onValueChange={onTemplateChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => {
                    const Icon = getIconForTemplate(template.id)
                    return (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{template.name}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Media Upload */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Upload Your {selectedTemplate?.name || "Asset"}</Label>
              <p className="text-sm text-muted-foreground">
                Add the main file for your {selectedTemplate?.name.toLowerCase() || "asset"}
              </p>
            </div>

            {formState.mediaFile ? (
              <div className="relative">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex-shrink-0">
                    {formState.mediaPreviewUrl &&
                    formState.mediaPreviewUrl !== "/placeholder.svg?height=600&width=600" ? (
                      <img
                        src={formState.mediaPreviewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{formState.mediaFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(formState.mediaFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                  isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  Drop your {selectedTemplate?.name.toLowerCase() || "file"} here
                </h3>
                <p className="text-muted-foreground mb-4">or click to browse from your device</p>
                <Button variant="outline">Choose File</Button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="*/*" />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder={`Give your ${selectedTemplate?.name.toLowerCase() || "asset"} a compelling title`}
              value={formState.title}
              onChange={(e) => updateFormField("title", e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder={`Describe your ${selectedTemplate?.name.toLowerCase() || "asset"} and what makes it unique...`}
              value={formState.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              rows={4}
              className="resize-none text-base"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Tags</Label>
            <div className="space-y-3">
              {formState.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formState.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
              <Input
                placeholder="Add tags (press Enter or comma to add)"
                onKeyDown={handleTagKeyPress}
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Add relevant tags to help others discover your {selectedTemplate?.name.toLowerCase() || "asset"}
              </p>
            </div>
          </div>

          {/* Collection */}
          <div className="space-y-2">
            <Label htmlFor="collection" className="text-base font-medium">
              Collection (Optional)
            </Label>
            <Input
              id="collection"
              placeholder="Add to a collection or create a new one"
              value={formState.collection}
              onChange={(e) => updateFormField("collection", e.target.value)}
              className="h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
