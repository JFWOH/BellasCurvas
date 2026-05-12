import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllAppSettings, setAppSetting } from '../../lib/api/publications'
import { Instagram, Facebook, Save, Loader2, ExternalLink, AlertCircle } from 'lucide-react'

function SettingField({ label, settingKey, value, onChange, type = 'text', placeholder, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(settingKey, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

export default function SocialSettings() {
  const [settings, setSettings] = useState({})
  const [saved, setSaved] = useState(false)

  const { data: loaded, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: getAllAppSettings,
  })

  useEffect(() => {
    if (loaded) setSettings(loaded)
  }, [loaded])

  const saveAll = useMutation({
    mutationFn: async () => {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => setAppSetting(key, value))
      )
    },
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 3000) },
  })

  function handleChange(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Redes Sociais</h2>
        <button
          onClick={() => saveAll.mutate()}
          disabled={saveAll.isPending}
          className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-60"
        >
          {saveAll.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? '✓ Salvo!' : 'Salvar Configurações'}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Pré-requisitos</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Conta Instagram Business (não conta pessoal)</li>
            <li>Página do Facebook vinculada ao Instagram</li>
            <li>App no Meta for Developers com permissões: <code className="bg-amber-100 px-1 rounded">instagram_content_publish</code></li>
          </ul>
          <a href="https://developers.facebook.com/docs/instagram-api/getting-started" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-amber-700 underline hover:text-amber-900">
            Guia de configuração <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Instagram */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Instagram className="h-5 w-5 text-pink-600" />
          <h3 className="font-semibold text-gray-900">Instagram</h3>
        </div>
        <SettingField
          label="User ID do Instagram Business"
          settingKey="instagram_user_id"
          value={settings.instagram_user_id}
          onChange={handleChange}
          placeholder="1234567890"
          hint="Encontre em: Conta Instagram > Configurações > Sobre"
        />
        <SettingField
          label="Token de Acesso (longa duração — 60 dias)"
          settingKey="instagram_access_token"
          value={settings.instagram_access_token}
          onChange={handleChange}
          type="password"
          placeholder="EAAxxxxxxxx..."
          hint="Gere em: Meta for Developers > Tools > Graph API Explorer"
        />
      </div>

      {/* Facebook */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Facebook className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Facebook</h3>
        </div>
        <SettingField
          label="ID da Página do Facebook"
          settingKey="facebook_page_id"
          value={settings.facebook_page_id}
          onChange={handleChange}
          placeholder="123456789"
          hint="Configurações da Página > Informações da Página"
        />
        <SettingField
          label="Token da Página"
          settingKey="facebook_access_token"
          value={settings.facebook_access_token}
          onChange={handleChange}
          type="password"
          placeholder="EAAxxxxxxxx..."
          hint="Obtido pelo Graph API Explorer com permissão pages_manage_posts"
        />
      </div>

      {/* Store info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-900">Informações da Loja</h3>
        <p className="text-xs text-gray-400">Usadas nas mensagens automáticas e captions de posts</p>
        <SettingField label="Nome da Loja" settingKey="store_name" value={settings.store_name} onChange={handleChange} placeholder="Bella Curvas" />
        <SettingField label="URL da Loja" settingKey="store_url" value={settings.store_url} onChange={handleChange} placeholder="https://bellacurvas.com.br" />
        <SettingField label="WhatsApp de Contato" settingKey="store_whatsapp_phone" value={settings.store_whatsapp_phone} onChange={handleChange} placeholder="5511999999999" hint="Formato internacional sem + ou espaços" />
      </div>
    </div>
  )
}
