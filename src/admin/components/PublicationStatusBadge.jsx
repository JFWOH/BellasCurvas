import React from 'react'

const STATUS_CONFIG = {
  rascunho: { label: 'Rascunho', className: 'bg-gray-100 text-gray-600' },
  whatsapp_apenas: { label: 'WhatsApp', className: 'bg-green-100 text-green-700' },
  social_apenas: { label: 'Redes Sociais', className: 'bg-blue-100 text-blue-700' },
  vitrine: { label: 'Na Vitrine', className: 'bg-purple-100 text-purple-700' },
  publicado_todos: { label: 'Publicado', className: 'bg-emerald-100 text-emerald-700' },
}

export default function PublicationStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.rascunho
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
