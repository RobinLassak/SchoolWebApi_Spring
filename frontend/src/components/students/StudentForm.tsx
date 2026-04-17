import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Student, StudentFormData } from '@/types'
import { FormField } from '@/components/ui/FormField'
import { cn } from '@/utils/cn'

const schema = z.object({
  firstName: z.string().min(1, 'Jméno je povinné').max(100),
  lastName: z.string().min(1, 'Příjmení je povinné').max(100),
  dateOfBirth: z.string().min(1, 'Datum narození je povinné'),
})

interface StudentFormProps {
  defaultValues?: Student
  onSubmit: (data: StudentFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function StudentForm({ defaultValues, onSubmit, onCancel, isLoading }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
      ? {
          firstName: defaultValues.firstName,
          lastName: defaultValues.lastName,
          dateOfBirth: defaultValues.dateOfBirth?.split('T')[0] ?? '',
        }
      : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Jméno" error={errors.firstName?.message} required>
          <input
            {...register('firstName')}
            className={cn('input', errors.firstName && 'input-error')}
            placeholder="Jan"
          />
        </FormField>
        <FormField label="Příjmení" error={errors.lastName?.message} required>
          <input
            {...register('lastName')}
            className={cn('input', errors.lastName && 'input-error')}
            placeholder="Novák"
          />
        </FormField>
      </div>
      <FormField label="Datum narození" error={errors.dateOfBirth?.message} required>
        <input
          {...register('dateOfBirth')}
          type="date"
          className={cn('input', errors.dateOfBirth && 'input-error')}
        />
      </FormField>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
          Zrušit
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Ukládání...' : defaultValues ? 'Uložit změny' : 'Přidat studenta'}
        </button>
      </div>
    </form>
  )
}
