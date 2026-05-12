import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWhatsAppGroups, upsertWhatsAppGroup, deleteWhatsAppGroup } from '../../lib/api/publications'
import { MessageCircle, Plus, Trash2, Loader2, Edit, Check, X } from 'lucide-react'

function GroupRow({ group, onDelete }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${group.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
        <div>
          <p className="font-medium text-gray-900 text-sm">{group.name}</p>
          <p className="text-xs text-gray-400 font-mono">{group.group_id}</p>
        </div>
      </div>
      <button onClick={() => onDelete(group.id)} className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function WhatsAppGroups() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ name: '', group_id: '' })
  const [adding, setAdding] = useState(false)

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['whatsapp-groups'],
    queryFn: getWhatsAppGroups,
  })

  const addGroup = useMutation({
    mutationFn: () => upsertWhatsAppGroup(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-groups'] })
      setForm({ name: '', group_id: '' })
      setAdding(false)
    },
  })

  const removeGroup = useMutation({
    mutationFn: deleteWhatsAppGroup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whatsapp-groups'] }),
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Grupos WhatsApp</h2>
        <button
          onClick={() => setAdding(true)}
          className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Grupo
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        <div className="flex items-start gap-3">
          <MessageCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Como encontrar o ID do grupo</p>
            <ol className="list-decimal list-inside space-y-1 text-green-700">
              <li>Abra o WhatsApp Web com o número da Evolution API</li>
              <li>Acesse o grupo desejado</li>
              <li>O ID aparece na URL: <code className="bg-green-100 px-1 rounded">...@g.us</code></li>
              <li>Ou use: <code className="bg-green-100 px-1 rounded">GET /group/fetchAllGroups/{"{"}{"{instanceName}"}{"}"}</code> na Evolution API</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">Novo Grupo</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome do Grupo</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Clientes VIP Bella Curvas"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ID do Grupo</label>
            <input
              type="text"
              value={form.group_id}
              onChange={e => setForm(p => ({ ...p, group_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="5511999999999-1234567890@g.us"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addGroup.mutate()}
              disabled={addGroup.isPending || !form.name || !form.group_id}
              className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-60"
            >
              {addGroup.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Salvar
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2">
              <X className="h-3.5 w-3.5" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Groups list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
        ) : groups.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            Nenhum grupo cadastrado ainda.
          </div>
        ) : (
          groups.map(g => <GroupRow key={g.id} group={g} onDelete={id => removeGroup.mutate(id)} />)
        )}
      </div>
    </div>
  )
}
