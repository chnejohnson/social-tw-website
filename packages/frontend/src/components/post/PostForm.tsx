import { clsx } from 'clsx'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import RichTextEditor from '@/components/common/RichTextEditor'

export interface PostValues {
    content: string
}

export default function PostForm({
    onCancel = () => {},
    onSubmit = () => {},
    disabled = false,
}: {
    onCancel?: () => void
    onSubmit?: (values: PostValues) => void
    onSubmitCancel?: () => void
    isSubmitCancellable?: boolean
    isSubmitCancelled?: boolean
    disabled?: boolean
}) {
    const { handleSubmit, control, reset, formState } = useForm<PostValues>({
        defaultValues: {
            content: '',
        },
    })

    const { isValid, isSubmitSuccessful } = formState

    const _onSubmit = handleSubmit((values) => {
        const cache = { ...values }
        reset({ content: '' })
        onSubmit(cache)
    })

    const _onCancel = () => {
        reset({ content: '' })
        onCancel()
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({ content: '' })
        }
    }, [isSubmitSuccessful, reset])

    return (
        <>
            <form
                className={clsx('space-y-6', disabled && 'opacity-20')}
                onSubmit={_onSubmit}
            >
                <section className="flex items-center justify-end gap-1">
                    <button
                        className="btn btn-sm btn-ghost"
                        title="cancel a post"
                        type="button"
                        disabled={disabled}
                        onClick={_onCancel}
                    >
                        取消編輯
                    </button>
                    <button
                        className="btn btn-sm btn-secondary"
                        title="submit a post"
                        type="submit"
                        disabled={disabled || !isValid}
                    >
                        發佈文章
                    </button>
                </section>
                <section>
                    <Controller
                        name="content"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <RichTextEditor
                                ariaLabel="post editor"
                                onValueChange={field.onChange}
                                value={field.value}
                                namespace={field.name}
                                placeholder="你想說些什麼呢......？"
                                classes={{
                                    content:
                                        'min-h-[3rem] overflow-auto text-white text-xl tracking-wide',
                                    placeholder: 'text-gray-300 text-xl',
                                }}
                            />
                        )}
                    />
                </section>
            </form>
        </>
    )
}
