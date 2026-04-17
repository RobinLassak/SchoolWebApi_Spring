import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Subject, SubjectFormData } from '@/types'
import { FormField } from '@/components/ui/FormField'
import { cn } from '@/utils/cn'

const schema = z.object({
  name: z.string().min(1, 'Název předmětu je povinný').max(200),
})

interface SubjectFormProps {
  defaultValues?: Subject
  onSubmit: (data: SubjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function SubjectForm({ defaultValues, onSubmit, onCancel, isLoading }: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ? { name: defaultValues.name } : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Název předmětu" error={errors.name?.message} required>
        <input
          {...register('name')}
          className={cn('input', errors.name && 'input-error')}
          placeholder="Matematika"
          autoFocus
        />
      </FormField>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
          Zrušit
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Ukládání...' : defaultValues ? 'Uložit změny' : 'Přidat předmět'}
        </button>
      </div>
    </form>
  )
}
