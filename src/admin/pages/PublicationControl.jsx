import React, { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPublication, upsertPublication, getWhatsAppGroups, getWhatsAppSendLog } from '../../lib/api/publications'
import { supabase } from '../../lib/supabase'
import { MessageCircle, Instagram, Facebook, Globe, Send, Clock, Check, X, Loader2, ChevronDown } from 'lucide-react'
import PublicationStatusBadge from '../components/PublicationStatusBadge'

const CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'vitrine', label: 'Vitrine do Site', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
]

function ChannelSection({ channel, pub, groups, sendLog, productId, onUpdate }) {
  const { key, label, icon: Icon, color, bg } = channel
  const [schedule, setSchedule] = useState('')

  const publishNow = useMutation({
    mutationFn: async () => {
      if (key === 'vitrine') {
        await supabase.from('products').update({ is_active: true }).eq('id', productId)
        return onUpdate({ status: computeNewStatus('vitrine', pub?.status) })
      }
      const fieldMap = {
        whatsapp: 'publish_whatsapp_at',
        instagram: 'publish_social_at',
        facebook: 'publish_social_at',
      }
      await onUpdate({ [fieldMap[key]]: new Date().toISOString() })
      await supabase.functions.invoke('whatsapp-publisher', { body: { productId } })
        .catch(() => null)
    },
  })

  function computeNewStatus(channel, current) {
    const statuses = { rascunho: 0, whatsapp_apenas: 1, social_apenas: 2, vitrine: 3, publicado_todos: 4 }
    if (channel === 'vitrine') {
      if ((statuses[current] ?? 0) >= 1) return 'publicado_todos'
      return 'vitrine'
    }
    return current ?? 'whatsapp_apenas'
  }

  const isSent = key === 'whatsapp' ? !!pub?.whatsapp_sent_at : key === 'vitrine' ? false : !!(key === 'instagram' ? pub?.instagram_post_id : pub?.facebook_post_id)

  return (
    <div className={`rounded-xl border border-gray-200 overflow-hidden`}>
      <div className={`flex items-center gap-3 px-4 py-3 ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="font-medium text-gray-900 text-sm">{label}</span>
        {isSent && <span className="ml-auto flex items-center gap-1 text-xs text-green-600"><Check className="h-3 w-3" /> Enviado</span>}
      </div>

      <div className="p-4 space-y-3">
        {key === 'whatsapp' && groups.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Grupos ({groups.length} ativos)</p>
            <div className="space-y-1">
              {groups.slice(0, 3).map(g => (
                <div key={g.id} className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  {g.name}
                </div>
              ))}
              {groups.length > 3 && <p className="text-xs text-gray-400">+{groups.length - 3} grupos</p>}
            </div>
            {sendLog.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Último envio: {new Date(sendLog[0].sent_at).toLocaleString('pt-BR')} — {sendLog[0].status}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => publishNow.mutate()}
            disabled={publishNow.isPending || isSent}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isSent
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {publishNow.isPending
              ? <Loader2 className="h-3 w-3 animate-spin" />
              : <Send className="h-3 w-3" />
            }
            {isSent ? 'Já enviado' : 'Enviar Agora'}
          </button>

          <div className="flex items-center gap-1.5 flex-1">
            <Clock className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <input
              type="datetime-local"
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              className="flex-1 text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PublicationControl({ productId, productName }) {
  const queryClient = useQueryClient()

  const { data: pub } = useQuery({
    queryKey: ['publication', productId],
    queryFn: () => getPublication(productId),
    enabled: !!productId,
  })

  const { data: groups = [] } = useQuery({
    queryKey: ['whatsapp-groups'],
    queryFn: getWhatsAppGroups,
  })

  const { data: sendLog = [] } = useQuery({
    queryKey: ['send-log', productId],
    queryFn: () => getWhatsAppSendLog(productId),
    enabled: !!productId,
  })

  const update = useMutation({
    mutationFn: (updates) => upsertPublication(productId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publication', productId] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  if (!productId) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Publicação</h3>
        {pub?.status && <PublicationStatusBadge status={pub.status} />}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {CHANNELS.map(channel => (
          <ChannelSection
            key={channel.key}
            channel={channel}
            pub={pub}
            groups={groups}
            sendLog={sendLog}
            productId={productId}
            onUpdate={(updates) => update.mutateAsync(updates)}
          />
        ))}
      </div>
    </div>
  )
}
