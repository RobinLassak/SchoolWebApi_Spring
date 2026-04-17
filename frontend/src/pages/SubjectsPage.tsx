import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, BookOpen, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { Subject, SubjectFormData } from '@/types'
import { subjectsApi } from '@/api/subjects'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { SubjectForm } from '@/components/subjects/SubjectForm'

const SUBJECT_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
]

function subjectColor(id: number) {
  return SUBJECT_COLORS[id % SUBJECT_COLORS.length]
}

export function SubjectsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null)

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Předmět byl přidán')
      setModalOpen(false)
    },
    onError: () => toast.error('Nepodařilo se přidat předmět'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubjectFormData }) =>
      subjectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Předmět byl aktualizován')
      setEditingSubject(null)
    },
    onError: () => toast.error('Nepodařilo se aktualizovat předmět'),
  })

  const deleteMutation = useMutation({
    mutationFn: subjectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      toast.success('Předmět byl smazán')
      setDeletingSubject(null)
    },
    onError: () => toast.error('Nepodařilo se smazat předmět'),
  })

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return <PageLoader />

  return (
    <div>
      <PageHeader
        title="Předměty"
        description="Správa vyučovaných předmětů"
        count={subjects.length}
        action={
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Přidat předmět
          </button>
        }
      />

      <div className="card">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="input pl-9"
              placeholder="Hledat předmět..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={search ? 'Žádné výsledky' : 'Zatím žádné předměty'}
            description={
              search
                ? 'Zkuste upravit hledaný výraz.'
                : 'Začněte přidáním prvního předmětu.'
            }
            action={
              !search ? { label: 'Přidat předmět', onClick: () => setModalOpen(true) } : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    #
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Název předmětu
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((subject) => (
                  <tr key={subject.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-slate-400 font-mono">
                      {subject.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`badge ${subjectColor(subject.id)} font-bold text-sm px-3 py-1`}
                        >
                          {subject.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-slate-900">{subject.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="btn-ghost p-2"
                          onClick={() => setEditingSubject(subject)}
                          title="Upravit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn-ghost p-2 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeletingSubject(subject)}
                          title="Smazat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Přidat předmět"
        size="sm"
      >
        <SubjectForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingSubject}
        onClose={() => setEditingSubject(null)}
        title="Upravit předmět"
        size="sm"
      >
        {editingSubject && (
          <SubjectForm
            defaultValues={editingSubject}
            onSubmit={(data) => updateMutation.mutate({ id: editingSubject.id, data })}
            onCancel={() => setEditingSubject(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingSubject}
        onClose={() => setDeletingSubject(null)}
        onConfirm={() => deletingSubject && deleteMutation.mutate(deletingSubject.id)}
        title="Smazat předmět"
        message={`Opravdu chcete smazat předmět "${deletingSubject?.name}"? Tato akce je nevratná.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
