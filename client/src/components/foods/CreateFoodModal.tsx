import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useQlMutation } from '../../graphql/globalRequest';
import { createFood, editFood } from '../../graphql/query/food';
import { enqueueSnackbar } from 'notistack';
import { FOODS } from '../../tanstackKeys';
import { useQueryClient } from '@tanstack/react-query';

interface CreateFoodModalProps {
  categories: { id: number | string, name: string }[];
  isModalOpen: boolean;
  editFoodId: string | null;
  register: any;
  handleSubmit: any;
  reset: any;
  errors: any;
  setIsModalOpen: (value: boolean) => void;
  setEditFoodId: (value: string | null) => void;
}

const CreateFoodModal: React.FC<CreateFoodModalProps> = ({ categories, register, handleSubmit, reset, errors, isModalOpen, setIsModalOpen, editFoodId, setEditFoodId }) => {
  const closeModal = () => {
    setIsModalOpen(false);
    setEditFoodId(null);
    reset();
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { mutate: createMutation, isPending: createPending } = useQlMutation(createFood);
  const { mutate: editMutation, isPending: editPending } = useQlMutation(editFood);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: { name: string, description: string, price: number, category: string, file?: FileList }) => {
    try {
      if (editFoodId) {
        editMutation({
          id: editFoodId,
          name: data.name.toLowerCase(),
          description: data.description.toLowerCase(),
          price: data.price,
          category: data.category.toLowerCase(),
          file: selectedFile || undefined,
        }, {
          onSuccess: (res) => {
            if (res.updateFood.status === 200 || res.updateFood.status === 201) {
              enqueueSnackbar(res.updateFood.message, { variant: "success" });
              queryClient.refetchQueries({ queryKey: [FOODS] });
              closeModal();
            } else {
              enqueueSnackbar(res.updateFood.message, { variant: "error" });
            }
          },
          onError: (error: any) => {
            enqueueSnackbar(error.response?.errors?.[0]?.message || "Failed to update table", { variant: "error" });
          },
        });
      } else {

        createMutation({
          name: data.name.toLowerCase(),
          description: data.description.toLowerCase(),
          price: data.price,
          category: data.category.toLowerCase(),
          file: selectedFile || undefined,
        }, {
          onSuccess: (res) => {
            if (res.createFood.status === 200 || res.createFood.status === 201) {
              enqueueSnackbar(res.createFood.message, { variant: "success" });
              queryClient.refetchQueries({ queryKey: [FOODS] });
              closeModal();
            } else {
              enqueueSnackbar(res.createFood.message, { variant: "error" });
            }
          },
          onError: (error: any) => {
            enqueueSnackbar(error.response?.errors?.[0]?.message || "Failed to update table", { variant: "error" });
          },
        });
      }

    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editFoodId ? "Edit Food" : "Create Food"} >

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Form Fields */}
          <div>
            <label className="block text-sm font-semibold text-[#adaaaa] mb-1">Name</label>
            <input
              {...register('name')}
              placeholder="Food name"
              className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#333]"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#adaaaa] mb-1">Description</label>
            <textarea
              {...register('description')}
              placeholder="Short description"
              rows={3}
              className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#333] resize-none"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message as string}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#adaaaa] mb-1">Price</label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#333]"
              />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#adaaaa] mb-1">Category</label>
              <select
                {...register('category')}
                className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message as string}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#adaaaa] mb-1">Image</label>
            <div className="relative">
              <input
                {...register('file')}
                type="file"
                accept="image/*"
                className="w-full bg-[#131313] text-[#adaaaa] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#F6B100] file:text-[#3d2b00] hover:file:bg-[#fdc003] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all cursor-pointer"
                onChange={handleAvatarChange}
              />
            </div>
            {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file.message as string}</p>}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2.5 rounded-xl border border-white/10 text-[#adaaaa] hover:bg-white/5 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPending || editPending}
              className="px-6 py-2.5 rounded-xl bg-[#F6B100] hover:bg-[#fdc003] text-white font-bold shadow-[0_0_20px_rgba(255,209,108,0.2)] transition-all cursor-pointer flex items-center justify-center min-w-[120px]"
            >
              {(createPending || editPending) ? (editFoodId ? 'Updating...' : 'Creating...') : (editFoodId ? 'Update Food' : 'Create Food')}
            </button>
          </div>
        </form>

      </Modal>

    </>
  );
};

export default CreateFoodModal;
