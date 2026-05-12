import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllAppSettings, setAppSetting } from '../../lib/api/publications'
import { Settings, Save, Loader2, MessageCircle, ExternalLink } from 'lucide-react'

export default function AdminSettings() {
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
        Object.entries(settings)
          .filter(([k]) => ['evolution_api_url', 'evolution_api_key', 'evolution_instance_name'].includes(k))
          .map(([key, value]) => setAppSetting(key, value))
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
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <button
          onClick={() => saveAll.mutate()}
          disabled={saveAll.isPending}
          className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-60"
        >
          {saveAll.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? '✓ Salvo!' : 'Salvar'}
        </button>
      </div>

      {/* Evolution API */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Evolution API (WhatsApp)</h3>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
          Evolution API é uma solução open-source para automação do WhatsApp.
          <a href="https://github.com/EvolutionAPI/evolution-api" target="_blank" rel="noopener noreferrer"
            className="ml-1 underline inline-flex items-center gap-0.5">
            Ver instalação <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL da API</label>
          <input
            type="url"
            value={settings.evolution_api_url ?? ''}
            onChange={e => handleChange('evolution_api_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://seu-vps.com:8080"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chave de API</label>
          <input
            type="password"
            value={settings.evolution_api_key ?? ''}
            onChange={e => handleChange('evolution_api_key', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="sua-chave-secreta"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Instância</label>
          <input
            type="text"
            value={settings.evolution_instance_name ?? ''}
            onChange={e => handleChange('evolution_instance_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="bella-curvas"
          />
          <p className="text-xs text-gray-400 mt-1">Nome configurado ao criar a instância na Evolution API</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600 space-y-2">
        <p className="font-semibold">Próximos passos para funcionar completamente:</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-500">
          <li>Configure as variáveis de ambiente no Supabase (Settings → Edge Functions → Secrets)</li>
          <li>Deploy das Edge Functions: <code className="bg-gray-200 px-1 rounded text-xs">supabase functions deploy whatsapp-publisher</code></li>
          <li>Configure os grupos de WhatsApp na seção WhatsApp</li>
          <li>Configure os tokens do Instagram/Facebook na seção Redes Sociais</li>
        </ol>
      </div>
    </div>
  )
}
