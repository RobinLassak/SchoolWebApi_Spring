import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Grade, Student, Subject } from '@/types'
import { FormField } from '@/components/ui/FormField'
import { cn } from '@/utils/cn'
import { toDateTimeInputValue } from '@/utils/grade'

const schema = z.object({
  studentId: z.number().min(1, 'Vyberte studenta'),
  subjectId: z.number().min(1, 'Vyberte předmět'),
  topic: z.string().min(1, 'Téma je povinné').max(255),
  mark: z.number().min(1).max(5),
  date: z.string().min(1, 'Datum je povinné'),
})

export type GradeFormValues = z.infer<typeof schema>

interface GradeFormProps {
  defaultValues?: Grade
  students: Student[]
  subjects: Subject[]
  onSubmit: (data: GradeFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function GradeForm({
  defaultValues,
  students,
  subjects,
  onSubmit,
  onCancel,
  isLoading,
}: GradeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          studentId: defaultValues.studentId ?? defaultValues.student?.id,
          subjectId: defaultValues.subjectId ?? defaultValues.subject?.id,
          topic: defaultValues.topic,
          mark: defaultValues.mark,
          date: toDateTimeInputValue(defaultValues.date),
        }
      : {
          mark: 1,
          date: toDateTimeInputValue(new Date().toISOString()),
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Student" error={errors.studentId?.message} required>
          <select
            {...register('studentId', { valueAsNumber: true })}
            className={cn('input', errors.studentId && 'input-error')}
          >
            <option value={0}>Vyberte studenta</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Předmět" error={errors.subjectId?.message} required>
          <select
            {...register('subjectId', { valueAsNumber: true })}
            className={cn('input', errors.subjectId && 'input-error')}
          >
            <option value={0}>Vyberte předmět</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Téma / Popis" error={errors.topic?.message} required>
        <input
          {...register('topic')}
          className={cn('input', errors.topic && 'input-error')}
          placeholder="Písemná práce, ústní zkoušení..."
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Známka (1–5)" error={errors.mark?.message} required>
          <select
            {...register('mark', { valueAsNumber: true })}
            className={cn('input', errors.mark && 'input-error')}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Datum a čas" error={errors.date?.message} required>
          <input
            {...register('date')}
            type="datetime-local"
            className={cn('input', errors.date && 'input-error')}
          />
        </FormField>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
          Zrušit
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Ukládání...' : defaultValues ? 'Uložit změny' : 'Přidat známku'}
        </button>
      </div>
    </form>
  )
}
