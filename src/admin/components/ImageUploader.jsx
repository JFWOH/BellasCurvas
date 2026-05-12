import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSortable, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { X, Star, GripVertical, Upload, ImagePlus, Loader2 } from 'lucide-react'
import { uploadProductImage, deleteProductImage, setPrimaryImage, updateImageOrder } from '../../lib/api/images'

function SortableImage({ image, onDelete, onSetPrimary }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 aspect-square">
      <img src={image.public_url} alt={image.alt_text ?? ''} className="w-full h-full object-cover" />

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 bg-white/90 rounded text-gray-700 cursor-grab hover:bg-white"
          title="Arrastar para reordenar"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <button
          onClick={() => onSetPrimary(image.id)}
          className={`p-1.5 rounded ${image.is_primary ? 'bg-yellow-400 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'}`}
          title="Definir como principal"
        >
          <Star className="h-4 w-4" />
        </button>

        <button
          onClick={() => onDelete(image.id, image.storage_path)}
          className="p-1.5 bg-red-500 rounded text-white hover:bg-red-600"
          title="Remover imagem"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {image.is_primary && (
        <span className="absolute top-1 left-1 bg-yellow-400 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          Principal
        </span>
      )}
    </div>
  )
}

export default function ImageUploader({ productId, images = [], onImagesChange }) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState([])

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!productId) return
    setUploading(true)
    setUploadProgress(acceptedFiles.map(f => ({ name: f.name, done: false })))

    try {
      const uploaded = []
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const isPrimary = images.length === 0 && i === 0
        const img = await uploadProductImage(productId, file, isPrimary)
        uploaded.push(img)
        setUploadProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true } : p))
      }
      onImagesChange?.([...images, ...uploaded])
    } catch (err) {
      console.error('Erro no upload:', err)
      alert('Erro ao fazer upload. Tente novamente.')
    } finally {
      setUploading(false)
      setUploadProgress([])
    }
  }, [productId, images, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    disabled: !productId || uploading,
  })

  async function handleDelete(imageId, storagePath) {
    if (!confirm('Remover esta imagem?')) return
    try {
      await deleteProductImage(imageId, storagePath)
      onImagesChange?.(images.filter(img => img.id !== imageId))
    } catch (err) {
      alert('Erro ao remover imagem.')
    }
  }

  async function handleSetPrimary(imageId) {
    try {
      await setPrimaryImage(productId, imageId)
      onImagesChange?.(images.map(img => ({ ...img, is_primary: img.id === imageId })))
    } catch (err) {
      alert('Erro ao definir imagem principal.')
    }
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex(i => i.id === active.id)
    const newIndex = images.findIndex(i => i.id === over.id)
    const reordered = [...images]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    onImagesChange?.(reordered)
    await updateImageOrder(reordered)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
        } ${(!productId || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
        {isDragActive ? (
          <p className="text-primary font-medium">Solte as fotos aqui!</p>
        ) : (
          <>
            <p className="font-medium text-gray-700">Arraste fotos ou clique para selecionar</p>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG, WebP • Máx. 10 MB por foto</p>
            {!productId && <p className="text-xs text-amber-600 mt-2">Salve o produto primeiro para fazer upload de imagens</p>}
          </>
        )}
      </div>

      {/* Upload progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-1">
          {uploadProgress.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              {p.done
                ? <ImagePlus className="h-4 w-4 text-green-500" />
                : <Loader2 className="h-4 w-4 animate-spin text-primary" />
              }
              {p.name}
            </div>
          ))}
        </div>
      )}

      {/* Image grid with drag-and-drop */}
      {images.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map(i => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.map(image => (
                <SortableImage
                  key={image.id}
                  image={image}
                  onDelete={handleDelete}
                  onSetPrimary={handleSetPrimary}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-400">
          {images.length} foto{images.length !== 1 ? 's' : ''} • Arraste para reordenar • ★ = foto principal
        </p>
      )}
    </div>
  )
}
