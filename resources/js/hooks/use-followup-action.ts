import { FormFollowUp } from '@/types/form';
import { PostpartumVisit, Result } from '@/types/resource';
import { useForm } from '@inertiajs/react';

export function useFollowUpAction(
    result?: PostpartumVisit,
    onSuccessCallBack?: () => void,
    initialType?: number | null,
    initialStatus?: number | null,
) {
    const { data, setData, reset, errors, clearErrors, put, post, processing } =
        useForm<FormFollowUp>({
            type: initialType ?? result?.followup?.type.value ?? 0,
            followup_status: initialStatus ?? result?.result?.followup_status?.value ?? 0,
            notes: result?.followup?.notes ?? '',
            result_id: result?.result?.id ?? '',
        });

    // const storeFollowUp = () => {
    //   post(route('followup.store', {
    //     onSuccess: () => {
    //       reset(
    //         'type',
    //         'notes',
    //         'followup_status',
    //         'result_id'
    //       );
    //       if (onSuccessCallBack) onSuccessCallBack();
    //     },

    //     onError: (err: Record<string, string[]>) => {
    //       console.log(err);
    //     }
    //   }));
    // }

    const storeFollowUp = (postpartumId: string) => {
        post(route('followup.store', postpartumId), {
            onSuccess: () => {
                reset('type', 'notes', 'followup_status', 'result_id');
                if (onSuccessCallBack) onSuccessCallBack();
            },

            onError: (err) => {
                console.log(err);
            },
        });
    };

    const updateFollowUp = (id?: string) => {
        if (!id) return;

        put(route('followup.update', id), {
            onSuccess: () => {
                reset('type', 'notes');
                if (onSuccessCallBack) onSuccessCallBack();
            },
            onError: (err) => console.log(err),
        });
    };

    const handleInputChange = (
        field: keyof FormFollowUp,
        value: string | number | null,
    ) => {
        setData((prev: FormFollowUp) => {
            const updatingValue = {
                ...prev,
                [field as keyof FormFollowUp]: value,
            };

            Object.entries(updatingValue).forEach(([key, val]) => {
                if (val && val.toString().length > 0)
                    clearErrors(key as keyof FormFollowUp);
            });

            return updatingValue;
        });
    };

    return {
        data,
        setData,
        errors,
        clearErrors,
        reset,
        handleInputChange,
        processing,
        updateFollowUp,
        storeFollowUp,
    };
}
