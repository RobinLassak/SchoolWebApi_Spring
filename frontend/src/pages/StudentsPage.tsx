import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react'
import { toast } from 'sonner'
import type { Student, StudentFormData } from '@/types'
import { studentsApi } from '@/api/students'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { StudentForm } from '@/components/students/StudentForm'
import { formatDate } from '@/utils/grade'

export function StudentsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student byl pridán')
      setModalOpen(false)
    },
    onError: () => toast.error('Nepodařilo se přidat studenta'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudentFormData }) =>
      studentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student byl aktualizován')
      setEditingStudent(null)
    },
    onError: () => toast.error('Nepodařilo se aktualizovat studenta'),
  })

  const deleteMutation = useMutation({
    mutationFn: studentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student byl smazán')
      setDeletingStudent(null)
    },
    onError: () => toast.error('Nepodařilo se smazat studenta'),
  })

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return <PageLoader />

  return (
    <div>
      <PageHeader
        title="Studenti"
        description="Správa žáků a studentů školy"
        count={students.length}
        action={
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Přidat studenta
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
              placeholder="Hledat studenta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={search ? 'Žádné výsledky' : 'Zatím žádní studenti'}
            description={
              search
                ? 'Zkuste upravit hledaný výraz.'
                : 'Začněte přidáním prvního studenta.'
            }
            action={
              !search ? { label: 'Přidat studenta', onClick: () => setModalOpen(true) } : undefined
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
                    Jméno
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Datum narození
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((student) => (
                  <tr key={student.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-slate-400 font-mono">
                      {student.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-700">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {formatDate(student.dateOfBirth)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="btn-ghost p-2"
                          onClick={() => setEditingStudent(student)}
                          title="Upravit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn-ghost p-2 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeletingStudent(student)}
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
        title="Přidat studenta"
      >
        <StudentForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title="Upravit studenta"
      >
        {editingStudent && (
          <StudentForm
            defaultValues={editingStudent}
            onSubmit={(data) => updateMutation.mutate({ id: editingStudent.id, data })}
            onCancel={() => setEditingStudent(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={() => deletingStudent && deleteMutation.mutate(deletingStudent.id)}
        title="Smazat studenta"
        message={`Opravdu chcete smazat studenta ${deletingStudent?.firstName} ${deletingStudent?.lastName}? Tato akce je nevratná.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
