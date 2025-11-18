import { FormUser } from "@/types/form";
import { User } from "@/types/resource";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export function useUserAction(user?: User) {

  const { data, setData, reset, errors, clearErrors, post, put, delete: destory, processing } = useForm<FormUser>({
    name: user?.name || '',
    email: user?.email || '',
    role_id: user?.role.id || '',
    password: '',
    password_confirmation: ''
  });

  const [processingId, setProcessingId] = useState<string | null>(null);

  const createUser = () => {
    post(route('user.store'), {
      onSuccess: () => reset("email", "name", "password", "password_confirmation", "role_id"),
      onError: (err) => {
        console.log(err);
      }
    });
  };

  const updateUser = (id?: string) => {

    if (!id) return;

    put(route('user.update', id), {
      onSuccess: () => reset("name", "role_id"),
      onError: (err) => {
        console.log(err);
      }
    });
  }


  const deleteUser = (id: string) => {

    setProcessingId(id);

    destory(route('user.destroy', id), {
      preserveScroll: true,
      onFinish: () => setProcessingId(null)
    });
  }


  const handleInputChange = (field: keyof FormUser, value: string | number | null) => {
    setData((prev: FormUser) => {

      const updatingValue = {
        ...prev,
        [field as keyof FormUser]: value
      };

      Object.entries(updatingValue)
        .forEach(([key, val]) => {
          if (val && val.toString().length > 0) clearErrors(key);
        });

      return updatingValue;
    });
  }

  return {
    data,
    setData,
    errors,
    clearErrors,
    reset,
    handleInputChange,
    processing,
    processingId,
    createUser,
    updateUser,
    deleteUser,
  }
}

