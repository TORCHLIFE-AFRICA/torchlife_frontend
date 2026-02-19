'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Upload } from 'lucide-react'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import { Calendar } from '@/src/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover'
import { cn } from '@/src/lib/utils'
import { medicalDetailsSchema, type MedicalDetailsFormData } from '@/src/types/campaign-form'
import { useCallback, useState } from 'react'

interface MedicalDetailsFormProps {
  defaultValues?: Partial<MedicalDetailsFormData>
  onNext: (data: MedicalDetailsFormData) => void
  onBack: () => void
}

export function MedicalDetailsForm({ defaultValues, onNext, onBack }: MedicalDetailsFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(defaultValues?.medicalReports || [])
  const [isDragging, setIsDragging] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<MedicalDetailsFormData>({
    resolver: zodResolver(medicalDetailsSchema),
    defaultValues: {
      ...defaultValues,
      medicalReports: defaultValues?.medicalReports || [],
    },
  })

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        const maxSize = 10 * 1024 * 1024 // 10MB
        return validTypes.includes(file.type) && file.size <= maxSize
      })
      setUploadedFiles(prev => [...prev, ...validFiles])
      setValue('medicalReports', [...uploadedFiles, ...validFiles])
    }
  }, [uploadedFiles, setValue])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }, [handleFileChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    setValue('medicalReports', newFiles)
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="hospitalName">Hospital Name</Label>
        <Input
          id="hospitalName"
          placeholder="Enter hospital name"
          {...register('hospitalName')}
          aria-invalid={!!errors.hospitalName}
        />
        {errors.hospitalName && (
          <p className="text-sm text-destructive">{errors.hospitalName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendingDoctorName">Attending doctor&apos;s name</Label>
        <Input
          id="attendingDoctorName"
          placeholder="Enter doctor's name"
          {...register('attendingDoctorName')}
          aria-invalid={!!errors.attendingDoctorName}
        />
        {errors.attendingDoctorName && (
          <p className="text-sm text-destructive">{errors.attendingDoctorName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="doctorContact">Doctor&apos;s contact (phone or email)</Label>
        <Input
          id="doctorContact"
          placeholder="Enter phone or email"
          {...register('doctorContact')}
          aria-invalid={!!errors.doctorContact}
        />
        {errors.doctorContact && (
          <p className="text-sm text-destructive">{errors.doctorContact.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hospitalAccountDetails">Hospital&apos;s account details</Label>
        <Input
          id="hospitalAccountDetails"
          placeholder="Enter hospital account details"
          {...register('hospitalAccountDetails')}
          aria-invalid={!!errors.hospitalAccountDetails}
        />
        {errors.hospitalAccountDetails && (
          <p className="text-sm text-destructive">{errors.hospitalAccountDetails.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Expected delivery date</Label>
        <Controller
          name="expectedDeliveryDate"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.expectedDeliveryDate && (
          <p className="text-sm text-destructive">{errors.expectedDeliveryDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Upload Medical Reports</Label>
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging ? 'border-primary bg-primary/5' : 'border-input',
            'hover:border-primary hover:bg-primary/5'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag and drop file or{' '}
            <span className="text-primary font-medium">Click to browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Accepted formats: PDF, JPG, PNG. Max size: 10MB
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button type="button" variant="outline" className="w-32" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="w-32">
          Next
        </Button>
      </div>
    </form>
  )
}
