import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Star, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { Grade } from '@/types'
import { gradesApi } from '@/api/grades'
import { studentsApi } from '@/api/students'
import { subjectsApi } from '@/api/subjects'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { GradeForm, type GradeFormValues } from '@/components/grades/GradeForm'
import { gradeConfig, formatDateTime } from '@/utils/grade'
import { cn } from '@/utils/cn'

export function GradesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [deletingGrade, setDeletingGrade] = useState<Grade | null>(null)

  const { data: grades = [], isLoading: gradesLoading } = useQuery({
    queryKey: ['grades'],
    queryFn: gradesApi.getAll,
  })

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.getAll,
  })

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: (data: GradeFormValues) => gradesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] })
      toast.success('Známka byla přidána')
      setModalOpen(false)
    },
    onError: () => toast.error('Nepodařilo se přidat známku'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GradeFormValues }) =>
      gradesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] })
      toast.success('Známka byla aktualizována')
      setEditingGrade(null)
    },
    onError: () => toast.error('Nepodařilo se aktualizovat známku'),
  })

  const deleteMutation = useMutation({
    mutationFn: gradesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] })
      toast.success('Známka byla smazána')
      setDeletingGrade(null)
    },
    onError: () => toast.error('Nepodařilo se smazat známku'),
  })

  const filtered = grades.filter((g) => {
    const studentName = g.student
      ? `${g.student.firstName} ${g.student.lastName}`.toLowerCase()
      : ''
    const subjectName = g.subject?.name?.toLowerCase() ?? ''
    const topic = g.topic?.toLowerCase() ?? ''
    const q = search.toLowerCase()
    return studentName.includes(q) || subjectName.includes(q) || topic.includes(q)
  })

  if (gradesLoading) return <PageLoader />

  return (
    <div>
      <PageHeader
        title="Známky"
        description="Přehled a správa klasifikace"
        count={grades.length}
        action={
          <button
            className="btn-primary"
            onClick={() => setModalOpen(true)}
            disabled={students.length === 0 || subjects.length === 0}
            title={
              students.length === 0 || subjects.length === 0
                ? 'Nejprve přidejte studenty a předměty'
                : undefined
            }
          >
            <Plus size={16} />
            Přidat známku
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
              placeholder="Hledat dle studenta, předmětu nebo tématu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Star}
            title={search ? 'Žádné výsledky' : 'Zatím žádné známky'}
            description={
              search
                ? 'Zkuste upravit hledaný výraz.'
                : students.length === 0 || subjects.length === 0
                ? 'Nejprve přidejte studenty a předměty.'
                : 'Začněte přidáním první známky.'
            }
            action={
              !search && students.length > 0 && subjects.length > 0
                ? { label: 'Přidat známku', onClick: () => setModalOpen(true) }
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Známka
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Student
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Předmět
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Téma
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Datum
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((grade) => {
                  const cfg = gradeConfig[grade.mark] ?? gradeConfig[5]
                  return (
                    <tr key={grade.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'badge text-base font-bold w-9 h-9 rounded-xl flex items-center justify-center',
                            cfg.className
                          )}
                        >
                          {grade.mark}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {grade.student ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-blue-700">
                                {grade.student.firstName[0]}{grade.student.lastName[0]}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {grade.student.firstName} {grade.student.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {grade.subject ? (
                          <span className="badge bg-slate-100 text-slate-700 font-medium">
                            {grade.subject.name}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 max-w-xs truncate">
                        {grade.topic || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                        {formatDateTime(grade.date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="btn-ghost p-2"
                            onClick={() => setEditingGrade(grade)}
                            title="Upravit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="btn-ghost p-2 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeletingGrade(grade)}
                            title="Smazat"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Přidat známku"
        size="lg"
      >
        <GradeForm
          students={students}
          subjects={subjects}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingGrade}
        onClose={() => setEditingGrade(null)}
        title="Upravit známku"
        size="lg"
      >
        {editingGrade && (
          <GradeForm
            defaultValues={editingGrade}
            students={students}
            subjects={subjects}
            onSubmit={(data) => updateMutation.mutate({ id: editingGrade.id, data })}
            onCancel={() => setEditingGrade(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingGrade}
        onClose={() => setDeletingGrade(null)}
        onConfirm={() => deletingGrade && deleteMutation.mutate(deletingGrade.id)}
        title="Smazat známku"
        message={`Opravdu chcete smazat tuto známku (${deletingGrade?.mark}) z předmětu ${deletingGrade?.subject?.name ?? ''}?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
